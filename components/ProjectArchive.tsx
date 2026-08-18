"use client";

import { useMemo, useState } from "react";
import { ProjectRows } from "@/components/ProjectRows";
import type { ProjectPreview } from "@/content/projects";

const ALL = "ALL";

export type ArchiveProject = Pick<
  ProjectPreview,
  "slug" | "name" | "href" | "categorySlug" | "category" | "meta" | "published"
>;

/**
 * The complete, filterable index of the work. It lives at /work and nowhere
 * else — the homepage used to carry a second copy of it under two sections that
 * already showed the same projects.
 */
export function ProjectArchive({
  projects,
  title = "All Work",
}: {
  projects: ArchiveProject[];
  title?: string;
}) {
  const [active, setActive] = useState(ALL);
  /* Filtered by discipline, not by tag. The tag list carried its own taxonomy —
     five labels that overlapped the three categories without matching them, so
     the "BRAND IDENTITY" chip returned four projects while the BRAND IDENTITY
     category page returned seven. Same words, two answers. The categories are
     the spine of the site (the routes, the home disciplines, the breadcrumbs),
     so they are what the filter speaks now, and the finer detail a tag used to
     carry is already spelled out in each row's meta. */
  const disciplines = useMemo(() => {
    const seen = new Set<string>();
    for (const project of projects) seen.add(project.category);
    return [ALL, ...seen];
  }, [projects]);

  /* Numbered against the full list, so filtering narrows the set without
     renumbering every project it leaves behind. */
  const indexed = projects.map((project, index) => ({
    id: project.categorySlug + "/" + project.slug,
    name: project.name,
    href: project.href,
    meta: project.meta,
    published: project.published,
    category: project.category,
    index,
  }));
  const visible = active === ALL ? indexed : indexed.filter((item) => item.category === active);

  return (
    <section className="archive" aria-labelledby="archive-title">
      <div className="section-head home-gutter">
        <h2 id="archive-title">{title}</h2>
        <p className="section-count" role="status">
          {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} PROJECTS
        </p>
      </div>

      <div className="archive-filters home-gutter" role="group" aria-label="Filter work by discipline">
        {disciplines.map((discipline) => (
          <button
            className="archive-filter"
            type="button"
            key={discipline}
            aria-pressed={active === discipline}
            onClick={() => setActive(discipline)}
          >
            {discipline}
          </button>
        ))}
      </div>

      <ProjectRows items={visible} />
    </section>
  );
}
