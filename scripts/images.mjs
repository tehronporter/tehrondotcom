#!/usr/bin/env node
/**
 * Web-ready image pipeline for public/work.
 *
 * Two jobs, both idempotent:
 *
 *   1. NORMALIZE — any image under public/work that is not already a WebP
 *      within MAX_EDGE is re-encoded to one. The original is archived to
 *      source-photos/_originals/ first (gitignored, local only) and the
 *      reference to it in content/ is rewritten to the new filename.
 *
 *   2. MANIFEST — content/image-manifest.json gets the real intrinsic
 *      dimensions and a tiny blur placeholder for every image, so no
 *      width/height is ever hand-typed and next/image can reserve exact space.
 *
 * ── Why this is safe to run on every commit ──────────────────────────────────
 *
 * The guard against re-compressing an already-processed file is the POLICY
 * CHECK, not the cache: a file is in policy iff it is a real WebP whose long
 * edge is <= MAX_EDGE. Since that is exactly what this script emits, a second
 * run over its own output re-encodes nothing. The cache below only skips the
 * work of re-measuring unchanged files — deleting it costs time, never quality.
 *
 * Deliberately absent: a byte-size budget. "This file is bigger than N KB" is
 * the one policy that is NOT a fixed point — a file failing it would be
 * re-encoded on every run, losing a little more each time. Size is reported,
 * never acted on.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *
 *   npm run images            normalize + rebuild manifest
 *   npm run images:check      report drift, write nothing, exit 1 if any
 *   node scripts/images.mjs --manifest      rebuild manifest only
 *   node scripts/images.mjs --no-archive    skip archiving originals
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const WORK_DIR = path.join(PUBLIC_DIR, "work");
const CONTENT_DIR = path.join(ROOT, "content");
const ARCHIVE_DIR = path.join(ROOT, "source-photos", "_originals");
const MANIFEST_PATH = path.join(CONTENT_DIR, "image-manifest.json");
const CACHE_PATH = path.join(ROOT, ".image-cache.json");

/* Long edge of the largest render the layout can ask for (a full-bleed figure
   on a 1720px shell at 2x) rounded to a round number. Anything above this is
   pixels no visitor will ever see. */
const MAX_EDGE = 2560;
/* Opaque photography. Flat art and anything with transparency gets more room
   because WebP's lossy ringing shows up on hard edges long before it does on
   a photograph. */
const QUALITY = 82;
const ALPHA_QUALITY = 90;
/* Placeholder is decoded by the browser at full size, so it wants to be tiny
   in pixels rather than tiny in bytes — 12px wide lands around 250 bytes. */
const BLUR_WIDTH = 12;

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const args = new Set(process.argv.slice(2));
const CHECK_ONLY = args.has("--check");
const MANIFEST_ONLY = args.has("--manifest");
const ARCHIVE = !args.has("--no-archive");

const rel = (abs) => path.relative(ROOT, abs);
/** public/work/a/b.webp -> /work/a/b.webp, the form used in content/ and in src. */
const publicPath = (abs) => "/" + path.relative(PUBLIC_DIR, abs).split(path.sep).join("/");
const kb = (bytes) => `${Math.round(bytes / 1024)}KB`;

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(abs)));
    else if (IMAGE_EXT.test(entry.name)) found.push(abs);
  }
  return found.sort();
}

const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
};

const hash = (buffer) => createHash("sha1").update(buffer).digest("hex").slice(0, 16);

/**
 * A file is in policy iff it is what this script emits. Extension and actual
 * container must agree — the repo has carried PNG bytes under a .jpg name
 * before, and trusting the name is how that happened.
 */
const inPolicy = (file, meta) =>
  path.extname(file).toLowerCase() === ".webp" &&
  meta.format === "webp" &&
  Math.max(meta.width, meta.height) <= MAX_EDGE;

/** Re-encode to policy. Returns the output buffer and its true final size. */
async function encode(buffer, hasAlpha) {
  /* .rotate() before anything else applies the EXIF orientation to the pixels.
     Metadata is stripped on write, so a phone shot that relied on that tag
     would otherwise come out on its side. */
  const pipeline = sharp(buffer)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({
      quality: hasAlpha ? ALPHA_QUALITY : QUALITY,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true,
    });
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function blurDataURL(buffer) {
  const tiny = await sharp(buffer)
    .rotate()
    .resize({ width: BLUR_WIDTH, fit: "inside" })
    .webp({ quality: 45, alphaQuality: 100 })
    .toBuffer();
  return `data:image/webp;base64,${tiny.toString("base64")}`;
}

/**
 * Point content/ at a renamed file. Paths are matched as exact literals rather
 * than by pattern, so a rename can only ever hit the string it is about.
 */
async function rewriteReferences(renames) {
  if (renames.size === 0) return 0;
  let total = 0;
  for (const entry of await readdir(CONTENT_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(ts|tsx|json|md)$/.test(entry.name)) continue;
    const file = path.join(CONTENT_DIR, entry.name);
    const before = await readFile(file, "utf8");
    let after = before;
    for (const [from, to] of renames) {
      if (after.includes(from)) {
        total += after.split(from).length - 1;
        after = after.split(from).join(to);
      }
    }
    if (after !== before) await writeFile(file, after);
  }
  return total;
}

async function main() {
  const files = await walk(WORK_DIR);
  if (files.length === 0) {
    console.log("images: nothing under public/work");
    return;
  }

  const cache = await readJson(CACHE_PATH, {});
  const nextCache = {};
  const manifest = {};
  const renames = new Map();
  const drift = [];
  let bytesBefore = 0;
  let bytesAfter = 0;
  let converted = 0;

  for (const file of files) {
    let buffer = await readFile(file);
    let meta = await sharp(buffer).metadata();
    let current = file;

    bytesBefore += buffer.length;

    if (!inPolicy(file, meta)) {
      const why = [];
      if (path.extname(file).toLowerCase() !== ".webp" || meta.format !== "webp")
        why.push(`${meta.format} as ${path.extname(file).slice(1)}`);
      if (Math.max(meta.width, meta.height) > MAX_EDGE)
        why.push(`${meta.width}x${meta.height}`);
      drift.push(`  ${publicPath(file)}  (${why.join(", ")}, ${kb(buffer.length)})`);

      if (!CHECK_ONLY && !MANIFEST_ONLY) {
        const target = file.replace(/\.[^.]+$/, ".webp");

        if (ARCHIVE) {
          const archived = path.join(ARCHIVE_DIR, path.relative(WORK_DIR, file));
          if (!existsSync(archived)) {
            await mkdir(path.dirname(archived), { recursive: true });
            await copyFile(file, archived);
          }
        }

        const out = await encode(buffer, Boolean(meta.hasAlpha));
        await writeFile(target, out.data);

        /* Only now that the replacement is on disk does the original go. */
        if (target !== file) {
          await rm(file);
          renames.set(publicPath(file), publicPath(target));
        }

        console.log(
          `  ${publicPath(file)}  ${kb(buffer.length)} -> ${kb(out.data.length)}` +
            `  ${meta.width}x${meta.height} -> ${out.width}x${out.height}`,
        );

        current = target;
        buffer = out.data;
        meta = { width: out.width, height: out.height, format: "webp" };
        converted += 1;
      }
    }

    bytesAfter += buffer.length;

    /* Manifest, keyed by the path content/ will reference. The cache is keyed
       by content hash, so an untouched file skips the blur re-render. */
    const key = publicPath(current);
    const digest = hash(buffer);
    const cached = cache[key]?.hash === digest ? cache[key] : undefined;
    const entry = cached
      ? { width: cached.width, height: cached.height, blurDataURL: cached.blurDataURL }
      : {
          width: meta.width,
          height: meta.height,
          blurDataURL: await blurDataURL(buffer),
        };

    manifest[key] = entry;
    nextCache[key] = { hash: digest, ...entry };
  }

  if (CHECK_ONLY) {
    if (drift.length > 0) {
      console.error(`images: ${drift.length} file(s) out of policy\n${drift.join("\n")}`);
      console.error(`\nRun \`npm run images\` to fix.`);
      process.exit(1);
    }
    console.log(`images: all ${files.length} files in policy`);
    return;
  }

  const rewritten = await rewriteReferences(renames);

  /* Sorted keys so the manifest diffs cleanly instead of reshuffling. */
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  await writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + "\n");
  await writeFile(CACHE_PATH, JSON.stringify(nextCache, null, 2) + "\n");

  console.log(
    `images: ${files.length} file(s), ${converted} converted` +
      (rewritten ? `, ${rewritten} reference(s) rewritten` : "") +
      `, ${kb(bytesBefore)} -> ${kb(bytesAfter)}`,
  );
  console.log(`images: manifest -> ${rel(MANIFEST_PATH)}`);
}

main().catch((error) => {
  console.error("images: failed —", error.message);
  process.exit(1);
});
