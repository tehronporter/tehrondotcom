import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProjectRow } from "@/components/ProjectRow";
import { categories } from "@/content/projects";
import { tagLine } from "@/lib/text";

export const metadata: Metadata = {
  title: "All Work",
  description: "Every project — brand identity, creative technology, and product development.",
};

/** Flat index of every project across all three categories. */
export default function AllWorkPage() {
  const all = categories.flatMap((category) =>
    category.projects.map((project) => ({ category, project }))
  );

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/" className="back-link">
          <Icon name="arrow-left" size={14} /> INDEX
        </Link>
      </div>

      <div className="cat-head">
        <h1 className="display cat-title">ALL WORK.</h1>
        <p className="cat-meta">
          {tagLine(categories.map((c) => c.titleLines.join(" ").replace(".", "")))}
        </p>
      </div>

      <section>
        {all.map(({ category, project }, i) => (
          <ProjectRow
            key={`${category.slug}/${project.slug}`}
            project={project}
            index={i}
            categorySlug={category.slug}
          />
        ))}
      </section>
    </div>
  );
}
