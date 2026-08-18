import type { MetadataRoute } from "next";
import { liveCategories } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  /* Drafts are absent from the site, so they are absent from the sitemap —
     submitting a URL that 404s is worse than not submitting it at all. */
  const live = liveCategories();

  const urls = [
    "/",
    "/work",
    "/about",
    "/contact",
    ...live.map((c) => `/work/${c.slug}`),
    ...live.flatMap((c) => c.projects.map((p) => `/work/${c.slug}/${p.slug}`)),
  ];

  return urls.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
  }));
}
