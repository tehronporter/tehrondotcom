import manifest from "@/content/image-manifest.json";

/**
 * Intrinsic dimensions and a blur placeholder for every image under
 * `public/work`, measured from the files themselves by `npm run images`.
 *
 * This exists so no image dimension is ever hand-typed. Hand-typed numbers go
 * stale the moment a file is re-exported or re-compressed, and a wrong aspect
 * ratio is invisible in review but shifts the layout for every visitor.
 *
 * Server-only by construction: the manifest is ~17KB and has no business in a
 * client bundle. Every module that imports this one is a server component, and
 * the two client components (Gallery, Frame) take resolved values as props.
 */

export type ImageMeta = {
  width: number;
  height: number;
  /** ~185 byte inline WebP, decoded as the placeholder while the real file loads. */
  blurDataURL: string;
};

const entries = manifest as Record<string, ImageMeta>;

export const imageMeta = (src: string): ImageMeta | undefined => entries[src];

/**
 * next/image props for a file under `public/`, resolved from the manifest.
 *
 * Falls back to whatever the caller declares when there is no entry, so an
 * image dropped in before the pipeline has run still renders — it just goes
 * without a placeholder until the next `npm run images`. A missing manifest
 * entry must never be able to break a page.
 */
export function imageProps(
  src: string,
  fallback: { width: number; height: number },
): {
  width: number;
  height: number;
  placeholder?: "blur";
  blurDataURL?: string;
} {
  const meta = imageMeta(src);
  if (!meta) return fallback;
  return {
    width: meta.width,
    height: meta.height,
    placeholder: "blur",
    blurDataURL: meta.blurDataURL,
  };
}

/* ---------------------------------------------------------------------------
   `sizes` for each slot the case study layout can put an image in.

   These mirror the grid rules in globals.css and have to move with them. The
   numbers: the shell caps at --content-max (1720px) and the media section is
   inset by --pad on both sides (3.5rem above the 760px breakpoint, 1.5rem
   below), so the widest an image is ever painted is 1608px.

   Getting this wrong is expensive in one direction only. Without a `sizes`,
   next/image assumes the image may fill the viewport and serves the largest
   candidate it has — which is how a 395px grid thumbnail ends up downloading a
   3200px render.
   --------------------------------------------------------------------------- */

const CONTENT_MAX = 1608;

export const MEDIA_SIZES = {
  /** figure.full — spans both columns, one column below 760px. */
  full:
    "(max-width: 760px) calc(100vw - 3rem)," +
    " (max-width: 1720px) calc(100vw - 7rem)," +
    ` ${CONTENT_MAX}px`,

  /** figure.half — 2-up with a 1.4rem gutter, stacking below 760px. */
  half:
    "(max-width: 760px) calc(100vw - 3rem)," +
    " (max-width: 1720px) calc((100vw - 8.4rem) / 2)," +
    ` ${Math.floor((CONTENT_MAX - 22.4) / 2)}px`,

  /** .media-grid — 4 across with a 0.6rem gutter, 2 across below 760px. */
  grid4:
    "(max-width: 760px) calc((100vw - 3.6rem) / 2)," +
    " (max-width: 1720px) calc((100vw - 8.8rem) / 4)," +
    ` ${Math.floor((CONTENT_MAX - 28.8) / 4)}px`,

  /** .media-grid-3 — 3 across, also 2 across below 760px. */
  grid3:
    "(max-width: 760px) calc((100vw - 3.6rem) / 2)," +
    " (max-width: 1720px) calc((100vw - 8.2rem) / 3)," +
    ` ${Math.floor((CONTENT_MAX - 19.2) / 3)}px`,
} as const;
