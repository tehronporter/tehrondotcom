import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Lines } from "@/components/Lines";
import { ProjectRow } from "@/components/ProjectRow";
import { categories, getCategory } from "@/content/projects";
import { tagLine, titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: titleCase(category.titleLines.join(" ").replace(".", "")),
    description: category.summary,
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/work" className="back-link">
          <Icon name="arrow-left" size={14} /> ALL WORK
        </Link>
      </div>

      <div className="cat-head">
        <h1 className="display cat-title">
          <Lines lines={category.titleLines} />
        </h1>
        <p className="cat-meta">{tagLine(category.tags)}</p>
        <p className="cat-summary">{category.summary}</p>
      </div>

      <section>
        {category.projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} categorySlug={category.slug} />
        ))}
      </section>
    </div>
  );
}
