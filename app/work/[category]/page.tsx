import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Lines } from "@/components/Lines";
import { ProjectRows } from "@/components/ProjectRows";
import { categoryLabel, getCategory, liveCategories, liveProjects } from "@/content/projects";
import { tagLine, titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string }> };

/* Only categories with work behind them get a page. A category whose projects
   are all drafts is not a thin page, it is a missing one. */
export function generateStaticParams() {
  return liveCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: titleCase(categoryLabel(category)),
    description: category.summary,
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const projects = liveProjects(category);
  if (projects.length === 0) notFound();

  return (
    <div className="page">
      <div className="page-head">
        <Breadcrumbs
          trail={[
            { label: "HOME", href: "/" },
            { label: "ALL WORK", href: "/work" },
            { label: categoryLabel(category) },
          ]}
        />
      </div>

      <div className="cat-head">
        <h1 className="display cat-title">
          <Lines lines={category.titleLines} />
        </h1>
        <p className="cat-meta">{tagLine(category.tags)}</p>
        <p className="cat-summary">{category.summary}</p>
      </div>

      {/* The same row as /work and the home index. Built from the raw project
          list rather than from previews, so a draft still shows here in
          development even before it has a featured image. */}
      <ProjectRows
        items={projects.map((project, index) => ({
          id: category.slug + "/" + project.slug,
          name: project.name,
          href: `/work/${category.slug}/${project.slug}`,
          meta: project.meta,
          published: project.published === true,
          index,
        }))}
      />
    </div>
  );
}
