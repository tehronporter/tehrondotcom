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

/** The folder template — a full-width card, since it is the card's whole face. */
export const BROWSER_COVER_SIZES =
  "(max-width: 520px) calc(100vw - 3rem)," +
  " (max-width: 980px) calc((100vw - 4rem) / 2)," +
  " (max-width: 1220px) calc((100vw - 20rem) / 3)," +
  " (max-width: 1720px) calc((100vw - 22rem) / 4)," +
  " 250px";

/**
 * The project art behind the folder's opening — the narrowest slot on the
 * site, and the only one that is not its own box. The opening runs from
 * ~11.5% to ~88% of the card across the four templates, so the art is painted
 * at roughly 0.76 of the width of the folder around it. Handing it the card's
 * own `sizes` asked for a candidate a third wider than the opening can show.
 */
export const BROWSER_ART_SIZES =
  "(max-width: 520px) calc((100vw - 3rem) * .76)," +
  " (max-width: 980px) calc((100vw - 4rem) / 2 * .76)," +
  " (max-width: 1220px) calc((100vw - 20rem) / 3 * .76)," +
  " (max-width: 1720px) calc((100vw - 22rem) / 4 * .76)," +
  " 190px";
