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

const CONTENT_MAX = 1386;

/* ---------------------------------------------------------------------------
   Case study media — the two-column editorial grid and the uniform feed.
   --------------------------------------------------------------------------- */

export const MEDIA_SIZES = {
  /** figure.full — spans both columns, one column below 760px. */
  full:
    "(max-width: 980px) calc(100vw - 2.7rem)," +
    " (max-width: 1220px) calc(100vw - 19rem)," +
    " (max-width: 1720px) calc(100vw - 20.9rem)," +
    ` ${CONTENT_MAX}px`,

  /** figure.half — 2-up with a 1.4rem gutter, stacking below 760px. */
  half:
    "(max-width: 760px) calc(100vw - 2.7rem)," +
    " (max-width: 980px) calc((100vw - 3.7rem) / 2)," +
    " (max-width: 1220px) calc((100vw - 20rem) / 2)," +
    " (max-width: 1720px) calc((100vw - 21.9rem) / 2)," +
    ` ${Math.floor((CONTENT_MAX - 22.4) / 2)}px`,

  /** .media-grid — 4 across with a 0.6rem gutter, 2 across below 760px. */
  grid4:
    "(max-width: 760px) calc((100vw - 3.7rem) / 2)," +
    " (max-width: 980px) calc((100vw - 5.7rem) / 4)," +
    " (max-width: 1220px) calc((100vw - 21rem) / 4)," +
    " (max-width: 1720px) calc((100vw - 22.9rem) / 4)," +
    ` ${Math.floor((CONTENT_MAX - 28.8) / 4)}px`,

  /** .media-grid-3 — 3 across, also 2 across below 760px. */
  grid3:
    "(max-width: 760px) calc((100vw - 3.7rem) / 2)," +
    " (max-width: 980px) calc((100vw - 4.7rem) / 3)," +
    " (max-width: 1220px) calc((100vw - 20.6rem) / 3)," +
    " (max-width: 1720px) calc((100vw - 22.5rem) / 3)," +
    ` ${Math.floor((CONTENT_MAX - 19.2) / 3)}px`,
} as const;

/** Folder artwork inside the app-shell project browser. */
export const BROWSER_COVER_SIZES =
  "(max-width: 520px) calc(100vw - 3rem)," +
  " (max-width: 760px) calc((100vw - 4rem) / 2)," +
  " (max-width: 1100px) calc((100vw - 20rem) / 3)," +
  " (max-width: 1500px) calc((100vw - 22rem) / 4)," +
  " 210px";
