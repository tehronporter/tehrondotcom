/**
 * Helpers for the practice filter, deliberately holding no data of their own.
 *
 * The list itself is derived from the published work by `livePractices()` in
 * content/projects.ts and handed down as a prop. This module cannot import it:
 * both consumers are client components, projects.ts reaches the image manifest
 * through lib/images, and a value import across that boundary would pull all
 * ~17KB of the manifest into the browser bundle — the same trap lib/sizes.ts
 * exists to avoid.
 *
 * It used to declare the list instead, and drifted in both directions at once:
 * it named two of the three categories, so Creative Technology was routable and
 * in the sitemap with nothing in the interface pointing at it.
 */

export type Practice = {
  slug: string;
  /** "Brand Identity" — the sidebar and the count line. */
  label: string;
  /** "Brand" — the mobile pills, where the full label will not fit. */
  shortLabel: string;
};

export function isPractice(value: string | null, practices: Practice[]): value is string {
  return practices.some((practice) => practice.slug === value);
}

/** The practice a `/work/<category>` route is showing, if it is a live one. */
export function practiceFromPath(pathname: string, practices: Practice[]): string | null {
  const candidate = pathname.match(/^\/work\/([^/]+)$/)?.[1] ?? null;
  return candidate && isPractice(candidate, practices) ? candidate : null;
}
