"use client";

import { useMemo, useState } from "react";
import { ProjectRows } from "@/components/ProjectRows";
import type { ProjectPreview } from "@/content/projects";

const ALL = "ALL";

export type ArchiveProject = Pick<
  ProjectPreview,
  "slug" | "name" | "href" | "categorySlug" | "meta" | "tags" | "published"
>;

/**
 * The complete, filterable index of the work. It lives at /work and nowhere
 * else — the homepage used to carry a second copy of it under two sections that
 * already showed the same projects.
 */
export function ProjectArchive({
  projects,
  label = "COMPLETE COLLECTION",
  title = "All Work",
}: {
  projects: ArchiveProject[];
  label?: string;
  title?: string;
}) {
  const [active, setActive] = useState(ALL);
  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const project of projects) for (const tag of project.tags) seen.add(tag);
    return [ALL, ...seen];
  }, [projects]);

  /* Numbered against the full list, so filtering narrows the set without
     renumbering every project it leaves behind. */
  const indexed = projects.map((project, index) => ({
    key: project.categorySlug + "/" + project.slug,
    name: project.name,
    href: project.href,
    meta: project.meta,
    published: project.published,
    tags: project.tags,
    index,
  }));
  const visible = active === ALL ? indexed : indexed.filter((item) => item.tags.includes(active));

  return (
    <section className="archive" aria-labelledby="archive-title">
      <div className="section-head home-gutter">
        <div>
          <p className="home-label">{label}</p>
          <h2 id="archive-title">{title}</h2>
        </div>
        <p className="section-count" role="status">
          {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} PROJECTS
        </p>
      </div>

      <div className="archive-filters home-gutter" role="group" aria-label="Filter work by discipline">
        {tags.map((tag) => (
          <button
            className="archive-filter"
            type="button"
            key={tag}
            aria-pressed={active === tag}
            onClick={() => setActive(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <ProjectRows items={visible} />
    </section>
  );
}
