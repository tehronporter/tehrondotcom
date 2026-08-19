import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseStudyMedia } from "@/components/CaseStudyMedia";
import { Icon } from "@/components/Icon";
import { categories, categoryLabel, getProject } from "@/content/projects";
import type { Media, Project } from "@/content/projects";
import { MEDIA_SIZES } from "@/lib/sizes";
import { titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string; project: string }> };

export function generateStaticParams() {
  return categories.flatMap((c) =>
    c.projects.map((p) => ({ category: c.slug, project: p.slug }))
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, project: projectSlug } = await params;
  const found = getProject(category, projectSlug);
  if (!found) return {};
  return {
    title: titleCase(found.project.name),
    description: found.project.intro,
  };
}

/**
 * Which slot this image occupies, and therefore how wide it will ever be
 * painted. The grid feed ignores `span` — every cell there is one column — so
 * the layout has to be consulted before the item.
 */
function sizesFor(project: Project, item: Media): string {
  if (project.mediaLayout === "grid")
    return project.mediaColumns === 3 ? MEDIA_SIZES.grid3 : MEDIA_SIZES.grid4;
  return item.span === "half" ? MEDIA_SIZES.half : MEDIA_SIZES.full;
}

function CaseSections({ sections, className = "" }: { sections: Project["sections"]; className?: string }) {
  if (sections.length === 0) return null;
  return (
    <section className={`case-body ${className}`.trim()}>
      {sections.map((section) => (
        <div className="case-section" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ))}
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { category: categorySlug, project: projectSlug } = await params;
  const found = getProject(categorySlug, projectSlug);
  if (!found) notFound();

  const { category, project, next } = found;
  const featuredIndex = project.media.findIndex((item) => item.src && item.src === project.featured?.src);
  const firstImageIndex = project.media.findIndex((item) => item.src);
  const heroIndex = featuredIndex >= 0 ? featuredIndex : Math.max(0, firstImageIndex);
  const hero = project.media[heroIndex];
  const supportingMedia = project.media.filter((_, index) => index !== heroIndex);
  const [leadSection, ...remainingSections] = project.sections;

  return (
    <div className="page">
      <div className="page-head">
        <Breadcrumbs
          trail={[
            { label: "HOME", href: "/" },
            { label: categoryLabel(category), href: `/work/${category.slug}` },
            { label: project.name },
          ]}
        />
      </div>

      <div className="case-head">
        <h1 className="display case-title">{project.name}</h1>
        <p className="case-intro">{project.intro}</p>
        {project.link && (
          <a
            className="case-live"
            href={project.link.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {project.link.label} <Icon name="arrow-up-right" size={13} />
          </a>
        )}
      </div>

      {hero ? (
        <section className="case-hero" aria-label="Project hero">
          <CaseStudyMedia
            item={hero}
            sizes={MEDIA_SIZES.full}
            priority
            heroName={hero.src && hero.src === project.featured?.src ? `piece-hero-${project.slug}` : undefined}
          />
        </section>
      ) : null}

      <dl className="facts">
        {project.client && (
          <div className="fact">
            <dt>CLIENT</dt>
            <dd>{project.client}</dd>
          </div>
        )}
        <div className="fact">
          <dt>ROLE</dt>
          <dd>
            {project.role.map((r) => (
              <div key={r}>{r}</div>
            ))}
          </dd>
        </div>
        <div className="fact">
          <dt>DELIVERABLES</dt>
          <dd>
            {project.deliverables.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </dd>
        </div>
      </dl>

      <CaseSections sections={leadSection ? [leadSection] : []} className="case-body-lead" />

      {supportingMedia.length > 0 ? (
        <section
          className={[
            "media",
            "supporting-media",
            project.mediaLayout === "grid" && "media-grid",
            project.mediaLayout === "grid" && project.mediaColumns === 3 && "media-grid-3",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Project gallery"
        >
          {supportingMedia.map((item, index) => (
            <CaseStudyMedia key={`${item.src ?? item.alt}-${index}`} item={item} sizes={sizesFor(project, item)} />
          ))}
        </section>
      ) : null}

      <CaseSections sections={remainingSections} className="case-body-outcome" />

      {next.slug !== project.slug && (
        <Link href={`/work/${category.slug}/${next.slug}`} className="next-project">
          <span>
            <span className="label">NEXT PROJECT</span>
            <span className="name">{next.name}</span>
          </span>
          <Icon name="arrow-right" size={20} />
        </Link>
      )}
    </div>
  );
}
