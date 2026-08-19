#!/usr/bin/env node
/**
 * Derives the shipped folder templates, and the geometry the card reads them
 * with, from the photographed PNG masters in assets/folder-templates/source.
 *
 * The card is a real object photographed on a transparent ground: the project
 * art is mounted behind the master's alpha opening and the master paints
 * everything in front of it. Two numbers therefore have to agree exactly with
 * the pixels — where the opening is, and where the tab is — and neither is
 * something to eyeball. This script measures both and prints the config block
 * that components/PortfolioBrowser.tsx carries, so the assets and the numbers
 * can never drift apart.
 *
 *   node scripts/folder-templates.mjs           write WebP + print config
 *   node scripts/folder-templates.mjs --check   measure only, write nothing
 *
 * ── Why the masters get cropped ─────────────────────────────────────────────
 *
 * Every master is a 1122x1402 canvas with a folder somewhere inside it and
 * transparent air around the edges — around 15% of the height. That air is not
 * free: the card box is the image box, so it became layout, pushing the title
 * a centimetre below the folder it belongs to and stretching every row of the
 * grid. Cropping is done to ONE rectangle shared by all four, the union of
 * their opaque bounds, so the folders keep the hand-placed differences between
 * them (d sits lower and wider than the rest) while losing only the air no
 * template uses. Same rectangle in, same aspect ratio out, no card taller than
 * its neighbour.
 *
 * Nothing here is destructive: the masters are never written to, and a second
 * run over the same masters produces the same bytes.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "assets", "folder-templates", "source");
const OUT_DIR = path.join(ROOT, "public", "work", "folder-templates");

const LETTERS = ["a", "b", "c", "d"];
/* Matches scripts/images.mjs so a template that ever passes back through the
   image pipeline is already in policy and gets left alone. */
const WEBP = { quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true };
/* Anything at or under this is a stray semi-transparent pixel, not paper. */
const OPAQUE = 24;
/* The inner paper edge is rough at pixel level. Pulling the art this far past
   the measured opening on every side means no antialiased edge can ever reveal
   the card underneath it. */
const OVERSCAN = 4;

const CHECK = process.argv.includes("--check");
const pct = (value, total) => Number(((value / total) * 100).toFixed(2));

async function raw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  return { data, channels, width, height, alpha: (x, y) => data[(y * width + x) * channels + 3] };
}

/** Bounds of everything that is not transparent — the folder itself. */
function opaqueBounds({ width, height, alpha }) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha(x, y) <= OPAQUE) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY };
}

/**
 * The photo opening: the largest run of transparency that the outside cannot
 * reach. Flooding from the border first is what separates the hole in the
 * middle from the air around the folder — a bounding box over "every
 * transparent pixel" would return the whole canvas.
 */
function opening({ width, height, alpha }) {
  const seen = new Uint8Array(width * height);
  const clear = (x, y) => alpha(x, y) <= OPAQUE;
  const stack = [];
  const flood = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i] || !clear(x, y)) return;
    seen[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < width; x++) { flood(x, 0); flood(x, height - 1); }
  for (let y = 0; y < height; y++) { flood(0, y); flood(width - 1, y); }
  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i - x) / width;
    flood(x + 1, y); flood(x - 1, y); flood(x, y + 1); flood(x, y - 1);
  }

  let best = null;
  for (let y0 = 0; y0 < height; y0++) {
    for (let x0 = 0; x0 < width; x0++) {
      const start = y0 * width + x0;
      if (seen[start] || !clear(x0, y0)) continue;
      let minX = width, minY = height, maxX = -1, maxY = -1, count = 0;
      seen[start] = 1;
      const queue = [start];
      while (queue.length) {
        const i = queue.pop();
        const x = i % width;
        const y = (i - x) / width;
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const j = ny * width + nx;
          if (seen[j] || !clear(nx, ny)) continue;
          seen[j] = 1;
          queue.push(j);
        }
      }
      if (!best || count > best.count) best = { minX, minY, maxX, maxY, count };
    }
  }
  return best;
}

/**
 * The fold across the front pocket, found as the darkest horizontal step in
 * the lower half of the paper — the shadow the pocket casts on the folder
 * behind it. It is what separates the two blue areas: the folder's face above,
 * where writing would cross a crease, and the pocket below, which is where a
 * hand actually writes. All four register it at 200+ levels of luminance, so
 * this is a real edge rather than a threshold that needs tuning.
 */
function fold({ width, height, alpha, data, channels }) {
  const x0 = Math.floor(width * 0.2);
  const x1 = Math.floor(width * 0.8);
  const rows = new Array(height).fill(null);
  for (let y = 0; y < height; y++) {
    let sum = 0, count = 0;
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * channels;
      if (data[i + 3] < 200) continue;
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      count++;
    }
    /* Rows the photo opening cuts through are not a fair sample. */
    if (count > (x1 - x0) * 0.9) rows[y] = sum / count;
  }
  let best = { y: Math.floor(height * 0.7), drop: -Infinity };
  for (let y = Math.floor(height * 0.55); y < Math.floor(height * 0.95); y++) {
    const above = rows[y - 3], below = rows[y + 3];
    if (above == null || below == null) continue;
    if (above - below > best.drop) best = { y, drop: above - below };
  }
  let bottom = height - 1;
  for (let y = height - 1; y >= 0 && bottom === height - 1; y--) {
    for (let x = x0; x < x1; x++) if (alpha(x, y) > OPAQUE) { bottom = y; break; }
  }
  return { top: best.y, bottom, drop: best.drop };
}

/**
 * The tab: the columns whose paper starts higher than the folder body does.
 * Found by profile rather than by a hand-typed rectangle, because the four
 * masters do not agree on it — d's tab is 2% of the height above the others',
 * which is exactly the kind of difference a shared constant renders as a label
 * sitting off its own tab.
 */
function tab({ width, height, alpha }) {
  const top = new Int32Array(width).fill(-1);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (alpha(x, y) > OPAQUE) { top[x] = y; break; }
    }
  }
  /* The body's top edge is the most common starting row across the right of
     the folder, which the tab never reaches. */
  const tally = new Map();
  for (let x = Math.floor(width * 0.55); x < Math.floor(width * 0.95); x++) {
    if (top[x] >= 0) tally.set(top[x], (tally.get(top[x]) ?? 0) + 1);
  }
  let bodyTop = 0, most = 0;
  for (const [row, count] of tally) if (count > most) { most = count; bodyTop = row; }

  let minX = -1, maxX = -1, minY = height;
  for (let x = 0; x < width; x++) {
    /* A dozen rows of slack keeps the folder's own slight tilt from reading as
       a tab that runs the full width. */
    if (top[x] < 0 || top[x] >= bodyTop - 12) continue;
    if (minX < 0) minX = x;
    maxX = x;
    if (top[x] < minY) minY = top[x];
  }
  return { minX, maxX, minY, maxY: bodyTop };
}

async function main() {
  const masters = [];
  for (const letter of LETTERS) {
    const file = path.join(SOURCE_DIR, `folder-template-${letter}.png`);
    if (!existsSync(file)) throw new Error(`missing master: ${path.relative(ROOT, file)}`);
    const buffer = await readFile(file);
    const pixels = await raw(buffer);
    masters.push({ letter, buffer, bounds: opaqueBounds(pixels), size: [pixels.width, pixels.height] });
  }

  const crop = masters.reduce((box, { bounds }) => ({
    minX: Math.min(box.minX, bounds.minX),
    minY: Math.min(box.minY, bounds.minY),
    maxX: Math.max(box.maxX, bounds.maxX),
    maxY: Math.max(box.maxY, bounds.maxY),
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

  const width = crop.maxX - crop.minX + 1;
  const height = crop.maxY - crop.minY + 1;
  const [srcW, srcH] = masters[0].size;
  console.log(`masters ${srcW}x${srcH} -> shared crop ${width}x${height} at ${crop.minX},${crop.minY}`);

  if (!CHECK) await mkdir(OUT_DIR, { recursive: true });
  const rows = [];

  for (const { letter, buffer } of masters) {
    const out = await sharp(buffer)
      .extract({ left: crop.minX, top: crop.minY, width, height })
      .webp(WEBP)
      .toBuffer();

    const pixels = await raw(out);
    const hole = opening(pixels);
    const band = tab(pixels);
    const bounds = opaqueBounds(pixels);

    /* Overscan is applied to the art, never to the label: an opening a few
       pixels wider than measured is hidden behind paper, but a tab label a few
       pixels taller than measured is sitting on the folder body. */
    const imageInset = {
      top: pct(hole.minY + OVERSCAN, height),
      right: pct(width - 1 - hole.maxX + OVERSCAN, width),
      bottom: pct(height - 1 - hole.maxY + OVERSCAN, height),
      left: pct(hole.minX + OVERSCAN, width),
    };
    const tabBox = {
      left: pct(band.minX, width),
      right: pct(width - 1 - band.maxX, width),
      mid: pct((band.minY + band.maxY) / 2, height),
    };

    /* Where a hand would write on this folder: the middle of the front pocket.
       Measured rather than assumed, because the four templates put their folds
       between 67.9% and 71.5% of the canvas — a shared constant would sit one
       label neatly in the pocket and run the next one over its crease. */
    const pocket = fold(pixels);
    const labelMid = pct((pocket.top + pocket.bottom) / 2, height);
    const labelBand = pct(pocket.bottom - pocket.top, height);

    const file = path.join(OUT_DIR, `folder-template-${letter}.webp`);
    if (!CHECK) await writeFile(file, out);
    console.log(
      `  ${letter}: ${Math.round(out.length / 1024)}KB` +
      `  opening ${(((hole.maxX - hole.minX + 1) / (hole.maxY - hole.minY + 1))).toFixed(3)}:1` +
      `  tab ${pct(band.maxY - band.minY, height)}% tall` +
      `  pocket ${labelBand}% tall (fold step ${Math.round(pocket.drop)})`,
    );
    rows.push({ letter, imageInset, tabBox, labelMid, labelBand });
  }

  console.log(`\n/* Generated by scripts/folder-templates.mjs — do not hand-edit. */`);
  console.log(`const FOLDER_SIZE = { width: ${width}, height: ${height} };\n`);
  console.log(`const folderTemplates: FolderTemplate[] = [`);
  for (const { letter, imageInset, tabBox, labelMid } of rows) {
    console.log(
      `  {\n` +
      `    src: "/work/folder-templates/folder-template-${letter}.webp",\n` +
      `    imageInset: { top: ${imageInset.top}, right: ${imageInset.right}, bottom: ${imageInset.bottom}, left: ${imageInset.left} },\n` +
      `    tab: { left: ${tabBox.left}, right: ${tabBox.right}, mid: ${tabBox.mid} },\n` +
      `    labelMid: ${labelMid},\n` +
      `  },`,
    );
  }
  console.log(`];`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
