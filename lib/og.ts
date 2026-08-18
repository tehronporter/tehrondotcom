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

export const OG_BLUE = "#1a35e0";

const fontFile = (name: string) => readFile(join(process.cwd(), "assets/fonts", name));

/**
 * The site's own typefaces, vendored under `assets/fonts` rather than resolved
 * through `next/font`, which hashes them into the client build with no path a
 * Node process can read back. Both are SIL Open Font License.
 *
 * Without these the renderer falls back to a generic sans and silently ignores
 * every font-weight it is given — which is why the card used to be the one
 * surface on the site not set in the site's type.
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
 * Flattened onto the site blue: some of this artwork is a mark on transparency,
 * and the alternative is a black box where the background should be.
 *
 * Returns undefined rather than throwing. A share card is not worth failing a
 * build over — without artwork the caller still has a card to draw.
 */
export async function artwork(src: string, box: { width: number; height: number }): Promise<Artwork | undefined> {
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
      .flatten({ background: OG_BLUE })
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
