/**
 * Shared pieces of the Open Graph share cards.
 *
 * Build-time only. Every card on this site has known params ahead of time, so
 * each one is rendered once during `next build` and served as a static PNG —
 * nothing here runs on a request.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

/** The one size every social scraper crops from. */
export const OG_SIZE = { width: 1200, height: 630 };

/* The card is painted in the workspace's own palette — the paper the app sits
   on, its ink, and the blue it reserves for the live thing on screen. Kept as
   literals rather than read from globals.css: this renders in Node, where the
   stylesheet does not exist. They have to move together. */
export const OG_CANVAS = "#eeece8";
export const OG_SURFACE = "#fbfaf8";
export const OG_INK = "#111111";
export const OG_MUTED = "#66645f";
export const OG_RULE = "#dfddd8";
export const OG_BLUE = "#1b67f2";

/* The accent each practice is dotted with in the sidebar and on every folder.
   Mirrors the [data-discipline] rules in globals.css — they have to move
   together, and a slug with no entry falls back to the blue. */
const PRACTICE_ACCENT: Record<string, string> = {
  "brand-identity": "#1b67f2",
  "creative-technology": "#6844e9",
  "product-development": "#ef7a0b",
};

export const practiceAccent = (slug?: string) =>
  (slug && PRACTICE_ACCENT[slug]) || OG_BLUE;

const fontFile = (name: string) => readFile(join(process.cwd(), "assets/fonts", name));

/**
 * The card's typefaces, vendored under `assets/fonts` rather than resolved
 * through `next/font`, which hashes them into the client build with no path a
 * Node process can read back.
 *
 * Without these the renderer falls back to a generic sans and silently ignores
 * every font-weight it is given — which is why the card used to be the one
 * surface on the site not set in type at all.
 *
 * Archivo Black and Lato stand in for the site's Anton and Inter: both are SIL
 * Open Font License and shippable as files, which Anton and Inter are not once
 * next/font has hashed them. Same register — a heavy grotesque display over a
 * neutral text face — so the card reads as the same family of thing without
 * pretending to be a pixel match.
 */
export async function ogFonts() {
  const [archivo, lato, latoBold] = await Promise.all([
    fontFile("ArchivoBlack-Regular.ttf"),
    fontFile("Lato-Regular.ttf"),
    fontFile("Lato-Bold.ttf"),
  ]);

  return [
    { name: "Archivo Black", data: archivo, weight: 400 as const, style: "normal" as const },
    { name: "Lato", data: lato, weight: 400 as const, style: "normal" as const },
    { name: "Lato", data: latoBold, weight: 700 as const, style: "normal" as const },
  ];
}

export type Artwork = { uri: string; width: number; height: number };

/**
 * A project's featured image, ready to be drawn into a card.
 *
 * Two things have to happen before the renderer can take it. It is a WebP —
 * `public/work` is WebP-only by policy and that is not up for negotiation — and
 * the renderer's WebP support is the weak link, so sharp decodes it to a JPEG
 * first. And the fitted dimensions are computed here rather than left to a CSS
 * `object-fit`, so the layout engine is handed exact numbers.
 *
 * Flattened onto the card's own surface: some of this artwork is a mark on
 * transparency, and the alternative is a black box where the paper should be.
 *
 * Returns undefined rather than throwing. A share card is not worth failing a
 * build over — without artwork the caller still has a card to draw.
 */
export async function artwork(
  src: string,
  box: { width: number; height: number },
): Promise<Artwork | undefined> {
  try {
    const source = sharp(await readFile(join(process.cwd(), "public", src)));
    const { width, height } = await source.metadata();
    if (!width || !height) return undefined;

    const scale = Math.min(box.width / width, box.height / height, 1);

    const buffer = await source
      .resize({
        width: Math.round(width * scale * 2),
        height: Math.round(height * scale * 2),
        fit: "inside",
      })
      .flatten({ background: OG_SURFACE })
      .jpeg({ quality: 82 })
      .toBuffer();

    return {
      uri: `data:image/jpeg;base64,${buffer.toString("base64")}`,
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    };
  } catch {
    return undefined;
  }
}
