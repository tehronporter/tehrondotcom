import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseStudyMedia } from "@/components/CaseStudyMedia";
import { Lightbox, type LightboxItem } from "@/components/Lightbox";
import { Icon } from "@/components/Icon";
import { categoryLabel, getProject, liveCategories } from "@/content/projects";
import type { Media, Project } from "@/content/projects";
import { imageProps } from "@/lib/images";
import { pageMetadata } from "@/lib/meta";
import { MEDIA_SIZES } from "@/lib/sizes";
import { titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string; project: string }> };

/* Live projects only — `liveCategories` has already dropped the unpublished
   ones, so a placeholder with no artwork never becomes a page. */
export function generateStaticParams() {
  return liveCategories().flatMap((c) =>
    c.projects.map((p) => ({ category: c.slug, project: p.slug }))
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, project: projectSlug } = await params;
  const found = getProject(category, projectSlug);
  if (!found) return {};
  return pageMetadata({
    path: `/work/${category}/${projectSlug}`,
    title: titleCase(found.project.name),
    description: found.project.intro,
  });
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

  /* One flat list for the whole page, in the order the images are painted —
     hero first, then the gallery — so the lightbox's arrow keys walk the case
     study the way the page reads. Entries with no `src` are placeholders with
     nothing to enlarge, so they are left out, which is why the index a figure
     is given is looked up here rather than taken from `project.media`. */
  const lightboxItems: LightboxItem[] = [hero, ...supportingMedia]
    .filter((item): item is Media => Boolean(item?.src))
    .map((item) => {
      const source = item.src as string;
      const { width, height, blurDataURL } = imageProps(source, { width: 1600, height: 1000 });
      return {
        src: source,
        alt: item.alt,
        caption: item.caption,
        width,
        height,
        ...(blurDataURL ? { blurDataURL } : {}),
      };
    });
  const at = (src?: string) => {
    if (!src) return undefined;
    const found = lightboxItems.findIndex((entry) => entry.src === src);
    return found === -1 ? undefined : found;
  };

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
            lightboxIndex={at(hero.src)}
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
            <CaseStudyMedia
              key={`${item.src ?? item.alt}-${index}`}
              item={item}
              sizes={sizesFor(project, item)}
              lightboxIndex={at(item.src)}
            />
          ))}
        </section>
      ) : null}

      <CaseSections sections={remainingSections} className="case-body-outcome" />

      {/* One dialog for the page, opened by delegation off the `data-lightbox`
          attribute each figure renders. Renders nothing when the project has no
          real images. */}
      <Lightbox items={lightboxItems} />

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
