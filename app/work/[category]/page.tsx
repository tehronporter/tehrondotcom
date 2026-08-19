import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/PortfolioPage";
import { categoryLabel, collectionProjects, getCategory, liveCategories } from "@/content/projects";
import { pageMetadata } from "@/lib/meta";
import { titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string }> };

/* Only categories with published work. A category whose projects are all
   unpublished has nothing to show and should not be a URL at all — it used to
   prerender straight into the "WORK IN PROGRESS" empty state. */
export function generateStaticParams() {
  return liveCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    path: `/work/${category.slug}`,
    title: titleCase(categoryLabel(category)),
    description: category.summary,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const projects = collectionProjects("work").filter((project) => project.categorySlug === category.slug);

  return (
    <PortfolioPage title={categoryLabel(category)} description={category.summary} projects={projects} />
  );
}
