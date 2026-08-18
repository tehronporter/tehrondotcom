import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseStudyMedia } from "@/components/CaseStudyMedia";
import { Icon } from "@/components/Icon";
import { Lightbox, type LightboxItem } from "@/components/Lightbox";
import { categoryLabel, getProject, liveCategories } from "@/content/projects";
import type { Media, Project } from "@/content/projects";
import { imageProps } from "@/lib/images";
import { MEDIA_SIZES } from "@/lib/sizes";
import { titleCase } from "@/lib/text";

type Params = { params: Promise<{ category: string; project: string }> };

export function generateStaticParams() {
  return liveCategories().flatMap((c) =>
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

/**
 * The one image a case study opens on, and the rest.
 *
 * The hero is the project's featured image so index and case-study presentation
 * stay visually connected. Falls back to the first media item when needed.
 */
function splitHero(project: Project): { hero?: Media; rest: Media[] } {
  if (project.media.length === 0) return { rest: [] };
  const featured = project.featured?.src;
  const index = featured ? project.media.findIndex((m) => m.src === featured) : 0;
  const at = index === -1 ? 0 : index;
  return {
    hero: project.media[at],
    rest: project.media.filter((_, i) => i !== at),
  };
}

export default async function ProjectPage({ params }: Params) {
  const { category: categorySlug, project: projectSlug } = await params;
  const found = getProject(categorySlug, projectSlug);
  if (!found) notFound();

  const { category, project, next } = found;
  const { hero, rest } = splitHero(project);

  /* Lightbox order is reading order: the hero, then the feed beneath it. Empty
     frames have nothing to enlarge, so they are absent from the list and never
     get an index — which is what keeps the arrow keys from landing on a hole.
     Dimensions are resolved here, on the server, so the manifest stays out of
     the client bundle (see lib/images.ts). */
  const ordered = [hero, ...rest].filter((m): m is Media => Boolean(m));
  const lightbox: LightboxItem[] = ordered
    .filter((m) => m.src)
    .map((m) => ({
      src: m.src as string,
      alt: m.alt,
      caption: m.caption,
      ...imageProps(m.src as string, { width: 1600, height: 1000 }),
    }));

  /** This item's position in the lightbox list, or undefined if it isn't in it. */
  const lightboxIndex = (item: Media) =>
    item.src ? lightbox.findIndex((l) => l.src === item.src) : undefined;

  return (
    <div className="page case-study">
      <div className="page-head">
        <Breadcrumbs
          trail={[
            { label: "HOME", href: "/" },
            { label: "ALL WORK", href: "/work" },
            { label: categoryLabel(category), href: `/work/${category.slug}` },
            { label: project.name },
          ]}
        />
      </div>

      {/* The head and the facts are siblings, not nested, so the two can share a
          row on a wide screen and be reordered independently on a narrow one —
          see .case-study in globals.css. The facts used to sit below every
          image on the page, which put the block a client scans first behind the
          longest scroll on the site. */}
      <div className="case-head">
        <h1 className="display case-title">{project.name}</h1>
        {/* Development only — a draft never reaches a public surface. */}
        {!project.published && <p className="draft-tag">DRAFT · NOT PUBLISHED</p>}
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

      {hero && (
        <section className="media case-hero">
          <CaseStudyMedia
            item={hero}
            sizes={MEDIA_SIZES.full}
            priority
            lightboxIndex={lightboxIndex(hero)}
          />
        </section>
      )}

      {/* The copy sits between the hero and the feed: the work is introduced,
          explained, and only then shown in full. */}
      <section className="case-body">
        {project.sections.map((section) => (
          <div className="case-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ))}
      </section>

      {rest.length > 0 && (
        <section
          className={[
            "media",
            project.mediaLayout === "grid" && "media-grid",
            project.mediaLayout === "grid" && project.mediaColumns === 3 && "media-grid-3",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {rest.map((item, i) => (
            <CaseStudyMedia
              key={i}
              item={item}
              sizes={sizesFor(project, item)}
              lightboxIndex={lightboxIndex(item)}
            />
          ))}
        </section>
      )}

      {next.slug !== project.slug && (
        <Link href={`/work/${category.slug}/${next.slug}`} className="next-project">
          <span>
            <span className="label">NEXT PROJECT</span>
            <span className="name">{next.name}</span>
          </span>
          <Icon name="arrow-right" size={20} />
        </Link>
      )}

      <Lightbox items={lightbox} />
    </div>
  );
}
