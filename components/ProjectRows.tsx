import Link from "next/link";
import { Icon } from "@/components/Icon";

export type ProjectRowItem = {
  /** Stable list key — the project's `category/slug` path. */
  key: string;
  name: string;
  href: string;
  meta: string;
  published: boolean;
};

/**
 * The index row, in one place. Every list of projects on the site is this —
 * /work, each category page, and anything else that grows later. There used to
 * be two row designs doing the same job in two different visual registers.
 *
 * `start` offsets the numbering so a filtered list can still show each project's
 * position in the full set rather than renumbering from 01 on every click.
 */
export function ProjectRows({ items }: { items: (ProjectRowItem & { index: number })[] }) {
  return (
    <div className="archive-rows">
      {items.map((item) => (
        <Link className="archive-row" href={item.href} key={item.key}>
          <span className="archive-number">{String(item.index + 1).padStart(2, "0")}</span>
          <span className="archive-name">
            {item.name}
            {/* Only ever reached in development — a draft is filtered out of
                every public surface before it gets here. */}
            {!item.published && <span className="draft-tag">DRAFT</span>}
          </span>
          <span className="archive-meta">{item.meta}</span>
          <span className="archive-arrow" aria-hidden="true">
            <Icon name="arrow-right" size={17} />
          </span>
        </Link>
      ))}
    </div>
  );
}
