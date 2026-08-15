/**
 * Gold moulding, drawn as SVG and hung on the artwork through CSS `border-image`.
 *
 * Why border-image rather than a background or a flat border: a 9-slice border
 * keeps the carved corners intact at their drawn size while the ornament along
 * the rails repeats to fill whatever length it needs (`border-image-repeat:
 * round`). One asset therefore frames a wide landscape and a tall portrait
 * without stretching a single bead. It is vector, so it stays sharp at any size,
 * costs no network request, and recolours from the one ramp below.
 *
 * All four styles are cut from the same cross-section vocabulary — outer lip,
 * bright roll, dark cove, ornament bed, inner bevel, rabbet — so they read as
 * one family that varies in depth and ornament density rather than four
 * unrelated frames.
 *
 * To swap these for photographed frame assets later, replace `frameVars()` with
 * url()s pointing at the files and keep the slice numbers in step. Nothing in
 * Frame.tsx or the stylesheet needs to change.
 */

export type FrameStyle = "ornate" | "vintage" | "wide" | "plain";

/** Gilt ramp, from the brightest catch of light down into the deepest recess. */
const G = {
  hi: "#fdf6d8",
  lite: "#eccd7c",
  mid: "#c99a37",
  deep: "#8a6018",
  dark: "#46300a",
} as const;

/**
 * One band of the moulding's cross-section. `from`/`to` are depths into the
 * rail — 0 is the outer edge of the frame, 1 is where the artwork begins —
 * and `stops` runs in that same direction.
 */
type Band = { from: number; to: number; stops: readonly string[] };

type Spec = {
  /** Rail depth in SVG units. Doubles as the border-image slice. */
  slice: number;
  /** Length of the repeating stretch between two corners. */
  tile: number;
  bands: Band[];
  /** Carved beads running along one band. Omit for an unornamented rail. */
  bead?: { band: number; count: number; rx: number; ry: number };
  /** Corner rosette radius. 0 leaves the corner as plain mitred moulding. */
  rosette: number;
};

const SPECS: Record<FrameStyle, Spec> = {
  /* Classical and heaviest — the anchor of the wall. */
  ornate: {
    slice: 38,
    tile: 38,
    bands: [
      { from: 0, to: 0.05, stops: [G.dark, G.deep] },
      { from: 0.05, to: 0.22, stops: [G.hi, G.lite, G.mid] },
      { from: 0.22, to: 0.32, stops: [G.deep, G.dark] },
      { from: 0.32, to: 0.7, stops: [G.mid, G.lite, G.mid] },
      { from: 0.7, to: 0.84, stops: [G.hi, G.mid] },
      { from: 0.84, to: 1, stops: [G.deep, G.dark] },
    ],
    bead: { band: 3, count: 4, rx: 3.4, ry: 5.2 },
    rosette: 9,
  },

  /* Broad decorative moulding — a second, flatter ornament bed. */
  wide: {
    slice: 46,
    tile: 46,
    bands: [
      { from: 0, to: 0.04, stops: [G.dark, G.deep] },
      { from: 0.04, to: 0.16, stops: [G.hi, G.lite] },
      { from: 0.16, to: 0.24, stops: [G.deep, G.dark] },
      { from: 0.24, to: 0.42, stops: [G.lite, G.mid] },
      { from: 0.42, to: 0.74, stops: [G.mid, G.lite, G.mid] },
      { from: 0.74, to: 0.88, stops: [G.hi, G.mid] },
      { from: 0.88, to: 1, stops: [G.deep, G.dark] },
    ],
    /* Beads want to sit *in* their band, not fill it — around a third of the
       band's depth is what reads as a carved bead rather than a stacked block. */
    bead: { band: 4, count: 4, rx: 3.8, ry: 5.3 },
    rosette: 11,
  },

  /* Thin vintage gilt — fine bead-and-reel, much shallower rail. */
  vintage: {
    slice: 24,
    tile: 30,
    bands: [
      { from: 0, to: 0.08, stops: [G.dark, G.deep] },
      { from: 0.08, to: 0.3, stops: [G.lite, G.hi, G.lite] },
      { from: 0.3, to: 0.44, stops: [G.deep, G.dark] },
      { from: 0.44, to: 0.74, stops: [G.mid, G.lite, G.mid] },
      { from: 0.74, to: 1, stops: [G.deep, G.dark] },
    ],
    bead: { band: 3, count: 5, rx: 1.8, ry: 2.6 },
    rosette: 5,
  },

  /* Restrained traditional gold — bevels and a cove, no carving. */
  plain: {
    slice: 20,
    tile: 24,
    bands: [
      { from: 0, to: 0.1, stops: [G.dark, G.deep] },
      { from: 0.1, to: 0.38, stops: [G.hi, G.lite, G.mid] },
      { from: 0.38, to: 0.52, stops: [G.deep, G.dark] },
      { from: 0.52, to: 0.8, stops: [G.lite, G.mid] },
      { from: 0.8, to: 1, stops: [G.deep, G.dark] },
    ],
    rosette: 0,
  },
};

const stops = (list: readonly string[]) =>
  list
    .map(
      (colour, i) =>
        `<stop offset="${((i / (list.length - 1)) * 100).toFixed(1)}%" stop-color="${colour}"/>`,
    )
    .join("");

/**
 * Builds the top rail only, then rotates it into the other three positions.
 * Each band is a trapezoid whose sloped ends are the 45° mitre, so four
 * rotations meet at the corners exactly the way a cut frame does.
 */
function build(spec: Spec): string {
  const { slice, tile, bands, bead, rosette } = spec;
  const size = slice * 2 + tile;
  const centre = size / 2;

  const defs = bands
    .map(
      (band, i) =>
        `<linearGradient id="b${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${(
          band.from * slice
        ).toFixed(2)}" x2="0" y2="${(band.to * slice).toFixed(2)}">${stops(band.stops)}</linearGradient>`,
    )
    .join("");

  const rails = bands
    .map((band, i) => {
      const a = band.from * slice;
      const b = band.to * slice;
      return `<path d="M${a.toFixed(2)},${a.toFixed(2)} L${(size - a).toFixed(2)},${a.toFixed(
        2,
      )} L${(size - b).toFixed(2)},${b.toFixed(2)} L${b.toFixed(2)},${b.toFixed(2)} Z" fill="url(#b${i})"/>`;
    })
    .join("");

  /* Beads sit on the centreline of their band, evenly spaced across the tile.
     Spacing divides the tile exactly and no bead touches the boundary, so the
     repeat is seamless however many times `round` tiles it. */
  let beads = "";
  if (bead) {
    const band = bands[bead.band];
    const cy = ((band.from + band.to) / 2) * slice;
    const step = tile / bead.count;
    for (let i = 0; i < bead.count; i++) {
      const cx = slice + step * (i + 0.5);
      beads +=
        `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${bead.rx}" ry="${bead.ry}" fill="${G.deep}" opacity="0.75"/>` +
        `<ellipse cx="${cx.toFixed(2)}" cy="${(cy - bead.ry * 0.22).toFixed(2)}" rx="${(
          bead.rx * 0.72
        ).toFixed(2)}" ry="${(bead.ry * 0.66).toFixed(2)}" fill="${G.hi}" opacity="0.85"/>`;
    }
  }

  /* One rosette in the top-left corner block; the rotations supply the rest. */
  let corner = "";
  if (rosette > 0) {
    const c = slice / 2;
    const r = rosette;
    corner =
      `<path d="M${c},${c - r} L${c + r},${c} L${c},${c + r} L${c - r},${c} Z" fill="${G.deep}" opacity="0.7"/>` +
      `<path d="M${c},${c - r * 0.62} L${c + r * 0.62},${c} L${c},${c + r * 0.62} L${c - r * 0.62},${c} Z" fill="${G.hi}" opacity="0.9"/>` +
      `<circle cx="${c}" cy="${c}" r="${(r * 0.2).toFixed(2)}" fill="${G.dark}" opacity="0.65"/>`;
  }

  /* The carving is rotationally symmetric, so a single overlay re-establishes
     one light source from above — the top rail catches, the bottom falls away. */
  const light =
    `<linearGradient id="lit" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${size}">` +
    `<stop offset="0%" stop-color="#fff" stop-opacity="0.22"/>` +
    `<stop offset="42%" stop-color="#fff" stop-opacity="0"/>` +
    `<stop offset="58%" stop-color="#000" stop-opacity="0"/>` +
    `<stop offset="100%" stop-color="#000" stop-opacity="0.26"/>` +
    `</linearGradient>`;

  const use = [0, 90, 180, 270]
    .map((deg) => `<use href="#rail" transform="rotate(${deg} ${centre} ${centre})"/>`)
    .join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<defs>${defs}${light}<g id="rail">${rails}${beads}${corner}</g></defs>` +
    `${use}<rect width="${size}" height="${size}" fill="url(#lit)"/>` +
    `</svg>`
  );
}

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/**
 * Custom properties for every frame style, set once on the gallery container so
 * the SVG source is inlined a single time no matter how many pieces hang on the
 * wall. The stylesheet reads them per `[data-frame]`.
 */
export function frameVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [name, spec] of Object.entries(SPECS)) {
    vars[`--frame-${name}`] = dataUri(build(spec));
    vars[`--slice-${name}`] = String(spec.slice);
  }
  return vars;
}
