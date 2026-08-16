/**
 * The `sizes` attribute for every slot this site can paint an image into.
 *
 * These mirror the grid rules in globals.css and have to move with them. Kept
 * apart from lib/images.ts deliberately: that module carries the ~17KB image
 * manifest and is server-only, while these strings are needed by the client
 * components that render the wall. Importing them from there would drag the
 * manifest into the browser bundle.
 *
 * Getting a `sizes` wrong is asymmetric. Too small and the browser picks a
 * candidate below the painted size and the image looks soft. Too large and it
 * silently downloads several times the bytes it needs — which is the failure
 * these constants exist to prevent, so every value here is the real painted
 * ceiling, rounded up rather than eyeballed.
 *
 * Shared geometry: the shell caps at --content-max (1720px) and is inset by
 * --pad on both sides — 3.5rem above the 760px breakpoint, 1.5rem below.
 */

const CONTENT_MAX = 1608;

/* ---------------------------------------------------------------------------
   Case study media — the two-column editorial grid and the uniform feed.
   --------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------
   The home gallery wall.

   The wall is `auto-fit` over `minmax(--col-min, 1fr)`, so the column count
   floats with the viewport — but `.piece` carries `max-width: var(--col-max)`,
   which makes the density tier's --col-max a hard ceiling on how wide a piece
   is ever painted. That ceiling is the honest `sizes`, and it is well under
   what a vw fraction implies: at the dense tier a piece tops out at 340px,
   where a viewport-relative guess would have claimed roughly 585px and pulled
   the next candidate up.

   Below 900px the ceiling comes off and the wall drops to two tracks, then to
   one below 760px, so those two cases are expressed against the viewport.
   Each is the full plate, including the moulding — the artwork inside the
   rabbet is narrower still, which leaves a little headroom toward sharpness.
   --------------------------------------------------------------------------- */

export type WallDensity = "sparse" | "medium" | "dense";

/** Tablet term: the container less --pad, less one --wall-gap, over two tracks. */
const tablet = (gapRem: number) => `(max-width: 900px) calc((100vw - ${7 + gapRem}rem) / 2)`;

const wall = (gapRem: number, colMax: number) =>
  `(max-width: 760px) calc(100vw - 3rem), ${tablet(gapRem)}, ${colMax}px`;

export const WALL_SIZES: Record<WallDensity, string> = {
  /** --wall-gap 4rem, --col-max 520px */
  sparse: wall(4, 520),
  /** --wall-gap 3rem, --col-max 420px */
  medium: wall(3, 420),
  /** --wall-gap 2.25rem, --col-max 340px */
  dense: wall(2.25, 340),
};
