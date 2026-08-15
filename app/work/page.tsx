import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { categories, num } from "@/content/projects";
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

      <section className="archive-hero">
        <div className="archive-list">
          <div className="archive-list-head">
            <span>NUMBER</span>
            <span>PROJECT</span>
          </div>
          {all.map(({ category, project }, i) => (
            <Link
              key={`${category.slug}/${project.slug}`}
              href={`/work/${category.slug}/${project.slug}`}
              className="archive-row"
            >
              <span className="archive-num">{num(i)}</span>
              <span className="archive-name">{project.name}</span>
            </Link>
          ))}
        </div>

        <div className="archive-text">
          <h1 className="display headline">ALL WORK.</h1>
          <p className="cat-meta">
            {tagLine(categories.map((c) => c.titleLines.join(" ").replace(".", "")))}
          </p>
        </div>
      </section>

      <div className="archive-image">
        <div className="frame">
          <span>Studio image</span>
        </div>
      </div>
    </div>
  );
}
