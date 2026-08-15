import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectRow } from "@/components/ProjectRow";
import { categories, categoryLabel } from "@/content/projects";
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
        <Breadcrumbs trail={[{ label: "HOME", href: "/" }, { label: "ALL WORK" }]} />
      </div>

      <div className="cat-head">
        <h1 className="display cat-title">ALL WORK.</h1>
        <p className="cat-meta">{tagLine(categories.map(categoryLabel))}</p>
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
