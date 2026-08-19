import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { liveCategories } from "@/content/projects";
import { site } from "@/content/site";

/**
 * The last commit that touched a file, as an ISO date.
 *
 * `lastModified: new Date()` stamped build time onto every URL, which told
 * crawlers that all 23 pages changed on every deploy — a signal they learn to
 * ignore, at the cost of the pages that genuinely did change. Git already knows
 * the real answer.
 *
 * Falls back to the build date. This runs during `next build`, and a build can
 * legitimately happen without a git history: a shallow CI clone, a tarball, a
 * fresh `npm create` before the first commit. A sitemap is not worth failing a
 * build over.
 */
const lastCommit = (() => {
  const cache = new Map<string, Date>();
  const fallback = new Date();

  return (file: string): Date => {
    const hit = cache.get(file);
    if (hit) return hit;
    try {
      const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      const date = iso ? new Date(iso) : fallback;
      const resolved = Number.isNaN(date.getTime()) ? fallback : date;
      cache.set(file, resolved);
      return resolved;
    } catch {
      cache.set(file, fallback);
      return fallback;
    }
  };
})();

/* Content and template both move a page. A project's copy lives in
   content/projects.ts and its route renders it, so a page is as fresh as the
   more recent of the two. */
const freshest = (...files: string[]) =>
  files.map(lastCommit).reduce((a, b) => (a > b ? a : b));

const CONTENT = "content/projects.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  /* Built from the live set, not from `categories` — three placeholder projects
     with no artwork were being listed here, and Creative Technology was being
     listed with nothing in the interface pointing at it. */
  const live = liveCategories();

  const entries: Array<{ path: string; lastModified: Date }> = [
    { path: "/", lastModified: freshest(CONTENT, "app/page.tsx", "components/PortfolioBrowser.tsx") },
    { path: "/featured", lastModified: freshest(CONTENT, "app/featured/page.tsx") },
    { path: "/recent", lastModified: freshest(CONTENT, "app/recent/page.tsx") },
    { path: "/about", lastModified: freshest("content/pages.ts", "app/about/page.tsx") },
    { path: "/contact", lastModified: freshest("content/pages.ts", "app/contact/page.tsx") },
    ...live.map((c) => ({
      path: `/work/${c.slug}`,
      lastModified: freshest(CONTENT, "app/work/[category]/page.tsx"),
    })),
    /* A project's own image folder is included so the dates actually differ
       per project. Without it every case study shares whichever date the
       shared template was last touched, and adding photographs to one project
       — the most common real edit — would move nothing. */
    ...live.flatMap((c) =>
      c.projects.map((p) => ({
        path: `/work/${c.slug}/${p.slug}`,
        lastModified: freshest(
          CONTENT,
          "app/work/[category]/[project]/page.tsx",
          `public/work/${c.slug}/${p.slug}`,
        ),
      })),
    ),
  ];

  return entries.map(({ path, lastModified }) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
  }));
}
