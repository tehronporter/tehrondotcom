import type { MetadataRoute } from "next";
import { categories } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [
    "/",
    "/featured",
    "/recent",
    "/about",
    "/contact",
    ...categories.map((c) => `/work/${c.slug}`),
    ...categories.flatMap((c) => c.projects.map((p) => `/work/${c.slug}/${p.slug}`)),
  ];

  return urls.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
  }));
}
