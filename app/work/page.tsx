import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectArchive } from "@/components/ProjectArchive";
import { projectPreviews } from "@/content/projects";

export const metadata: Metadata = {
  title: "All Work",
  description: "Every project — brand identity, creative technology, and product development.",
};

/**
 * The one complete index. It used to be a second, text-only list in a different
 * visual language from the archive the homepage carried; both are now this
 * component, so there is a single list of the work on the site.
 */
export default function AllWorkPage() {
  const projects = projectPreviews().map(
    ({ slug, name, href, categorySlug, meta, tags, published }) => ({
      slug,
      name,
      href,
      categorySlug,
      meta,
      tags,
      published,
    }),
  );

  return (
    <div className="page">
      <div className="page-head">
        <Breadcrumbs trail={[{ label: "HOME", href: "/" }, { label: "ALL WORK" }]} />
      </div>

      <ProjectArchive projects={projects} label="COMPLETE COLLECTION" title="All Work" />
    </div>
  );
}
