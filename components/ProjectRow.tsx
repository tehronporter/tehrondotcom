import Link from "next/link";
import { Icon } from "@/components/Icon";
import { num } from "@/content/projects";
import type { Project } from "@/content/projects";

export function ProjectRow({
  project,
  index,
  categorySlug,
  /** Overrides the project's own meta line — used on the all-work index. */
  meta,
}: {
  project: Project;
  index: number;
  categorySlug: string;
  meta?: string;
}) {
  return (
    <Link href={`/work/${categorySlug}/${project.slug}`} className="project-row">
      <span className="project-left">
        <span className="project-num">{num(index)}</span>
        <span className="project-name">{project.name}</span>
      </span>
      <span className="project-meta">{meta ?? project.meta}</span>
      <span className="project-year">
        {project.year} <Icon name="arrow-right" size={14} />
      </span>
    </Link>
  );
}
