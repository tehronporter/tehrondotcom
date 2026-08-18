"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { ProjectPreview } from "@/content/projects";

const ALL = "ALL";

export type ArchiveProject = Pick<
  ProjectPreview,
  "slug" | "name" | "href" | "categorySlug" | "meta" | "tags"
>;

export function ProjectArchive({ projects }: { projects: ArchiveProject[] }) {
  const [active, setActive] = useState(ALL);
  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const project of projects) for (const tag of project.tags) seen.add(tag);
    return [ALL, ...seen];
  }, [projects]);

  const indexed = projects.map((project, index) => ({ project, index }));
  const visible = active === ALL ? indexed : indexed.filter(({ project }) => project.tags.includes(active));

  return (
    <section className="home-archive" aria-labelledby="archive-title">
      <div className="archive-heading home-gutter">
        <div>
          <p className="home-label">COMPLETE COLLECTION</p>
          <h2 id="archive-title">ARCHIVE</h2>
        </div>
        <p className="archive-count" role="status">
          {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} PROJECTS
        </p>
      </div>

      <div className="archive-filters home-gutter" role="group" aria-label="Filter archive by discipline">
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

      <div className="archive-rows">
        {visible.map(({ project, index }) => (
          <Link
            className="archive-row"
            href={project.href}
            key={project.categorySlug + "/" + project.slug}
          >
            <span className="archive-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="archive-name">{project.name}</span>
            <span className="archive-meta">{project.meta}</span>
            <span className="archive-arrow" aria-hidden="true">
              <Icon name="arrow-right" size={17} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
