import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/PortfolioPage";
import { categories, categoryLabel, collectionProjects, getCategory } from "@/content/projects";
import { pageMetadata } from "@/lib/meta";
import { titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
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
