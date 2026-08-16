import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { categories, categoryLabel, getProject } from "@/content/projects";
import type { Media, Project } from "@/content/projects";
import { MEDIA_SIZES, imageProps } from "@/lib/images";
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

/* `heroName` matches whichever media item is the project's `featured` image to
   the same view-transition-name Frame.tsx puts on that image on the home wall
   (see Gallery.tsx) — so the piece the visitor clicked morphs into place here
   instead of the page just cross-fading under it. Keyed off the project slug
   both sides already have, so a new project gets this for free the moment it
   sets `featured` to one of its own media entries. */
function Frame({
  item,
  sizes,
  priority,
  heroName,
}: {
  item: Media;
  sizes: string;
  priority?: boolean;
  heroName?: string;
}) {
  return (
    <figure className={item.span === "half" ? undefined : "full"}>
      <div className="frame">
        {item.src ? (
          /* Dimensions come from the file itself via the manifest. The 1600x1000
             fallback is only reached for an image the pipeline has not measured
             yet, and matches the .frame aspect ratio so it degrades to exactly
             the framing this had before. */
          <Image
            src={item.src}
            alt={item.alt}
            {...imageProps(item.src, { width: 1600, height: 1000 })}
            sizes={sizes}
            priority={priority}
            style={heroName ? { viewTransitionName: heroName } : undefined}
          />
        ) : (
          <span>{item.alt}</span>
        )}
      </div>
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { category: categorySlug, project: projectSlug } = await params;
  const found = getProject(categorySlug, projectSlug);
  if (!found) notFound();

  const { category, project, next } = found;

  return (
    <div className="page">
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

      {project.media.length > 0 && (
        <section
          className={[
            "media",
            project.mediaLayout === "grid" && "media-grid",
            project.mediaLayout === "grid" && project.mediaColumns === 3 && "media-grid-3",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {project.media.map((item, i) => (
            <Frame
              key={i}
              item={item}
              sizes={sizesFor(project, item)}
              /* The first figure is above the fold on every case study, so it is
                 the LCP element. The rest stay lazy. */
              priority={i === 0}
              heroName={item.src && item.src === project.featured?.src ? `piece-hero-${project.slug}` : undefined}
            />
          ))}
        </section>
      )}

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
