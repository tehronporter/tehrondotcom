import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Per-page title, description, canonical, and share card in one call.
 *
 * The root layout declares an `openGraph` block, and Next merges rather than
 * replaces it: a route that sets only `title` and `description` still ships the
 * layout's og:title, og:description, and og:url. Every project therefore used to
 * preview as "Tehron Porter — Designer & Creative Technologist", described as
 * the site, linking to the home page — the one thing a shared project link must
 * not do, since portfolio links travel one project at a time.
 *
 * `path` is also the canonical. Nothing on this site is reachable at two URLs
 * today, but the canonical is what keeps a query string — `?discipline=`,
 * `?view=list`, a campaign tag — from being indexed as a separate page.
 */
export function pageMetadata({
  path,
  title,
  description,
}: {
  /** Route-absolute, e.g. "/work/brand-identity/blue-t-shirt". */
  path: string;
  /** Omitted on the home page, which keeps the site-level title. */
  title?: string;
  description: string;
}): Metadata {
  const url = new URL(path, site.url).toString();
  /* The title template lives in the layout and only applies to the `title`
     field, so the OG title has to be composed here to match what the tab says.
     The home-page fallback is the bare name rather than the full tagline: a
     share sheet or a link-preview card is read at a glance, at a size where
     "Tehron Porter — Designer & Creative Technologist" wraps to two or three
     lines before the description even starts. */
  const ogTitle = title ? `${title} — ${site.shortName}` : site.name;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
