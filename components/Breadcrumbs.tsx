import Link from "next/link";
import { Icon } from "@/components/Icon";

export type Crumb = { label: string; href?: string };

/**
 * Every level of the /work hierarchy in one row, each a click away. Replaces
 * the old single `.back-link`, which only ever pointed at the level directly
 * above — stepping from a project back to home meant three clicks (project ->
 * category -> all work -> home) even though most visitors now arrive at a
 * project straight from the home gallery. The last crumb is the current page:
 * unlinked, and dimmed to read as inactive rather than another destination.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol className="crumb-list">
        {trail.map((crumb, i) => (
          <li key={crumb.href ?? crumb.label}>
            {crumb.href ? (
              <Link href={crumb.href}>
                {i === 0 && <Icon name="arrow-left" size={14} />}
                {crumb.label}
              </Link>
            ) : (
              <span className="crumb-current" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
