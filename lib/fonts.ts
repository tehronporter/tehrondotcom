import localFont from "next/font/local";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";

/*
 * The role variables below are the stable typography API for the site.
 * Components and CSS only ever reference --font-display, --font-primary,
 * --font-editorial, and --font-mono, so swapping a source here re-types the
 * whole site without touching a single component.
 *
 * The pairing is one superfamily plus two voices:
 *   display    Archivo Black  — mastheads, project names, the footer call
 *   primary    Archivo        — everything else set in the sans
 *   editorial  Instrument Serif — the italic accent, and only that
 *   mono       IBM Plex Mono  — labels, indices, metadata
 *
 * Archivo Black is the same face the Open Graph cards render in (see lib/og.ts),
 * so a link preview and the page it opens are finally set in the same type.
 */

/* Vendored rather than fetched: lib/og.ts needs the raw .ttf bytes at runtime
   to render social cards, so the file has to exist on disk either way. */
const display = localFont({
  src: [{ path: "../assets/fonts/ArchivoBlack-Regular.ttf", weight: "400", style: "normal" }],
  display: "swap",
  variable: "--font-display-loaded",
  fallback: ["Arial Black", "Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: false,
});

const primary = Archivo({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary-loaded",
});

const editorial = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial-loaded",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-loaded",
});

export const fontVariables = [display, primary, editorial, mono]
  .map((font) => font.variable)
  .join(" ");
