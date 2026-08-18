/**
 * The `sizes` attribute for every slot this site can paint an image into.
 *
 * These mirror the grid rules in globals.css and have to move with them. Kept
 * apart from lib/images.ts deliberately: that module carries the ~17KB image
 * manifest and is server-only.
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
