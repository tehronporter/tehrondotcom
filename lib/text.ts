/** Words that stay uppercase when an ALL-CAPS tag is title-cased for display. */
const ACRONYMS = new Set(["UX", "UI", "AI", "AR", "VR", "3D", "CGI", "&", "/"]);

const cap = (word: string) =>
  ACRONYMS.has(word) ? word : word.charAt(0) + word.slice(1).toLowerCase();

/**
 * "UX / UI DESIGN" -> "UX / UI Design"
 * Hyphenated words capitalize on both sides: "T-SHIRT" -> "T-Shirt".
 */
export const titleCase = (input: string) =>
  input
    .split(" ")
    .map((word) => word.split("-").map(cap).join("-"))
    .join(" ");

/** Tag list -> the middot-separated subhead used under category titles. */
export const tagLine = (tags: readonly string[]) => tags.map(titleCase).join("  ·  ");
