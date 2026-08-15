import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { categories, getProject } from "@/content/projects";
import type { Media } from "@/content/projects";
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

function Frame({ item }: { item: Media }) {
  return (
    <figure className={item.span === "half" ? undefined : "full"}>
      <div className="frame">
        {item.src ? (
          <Image src={item.src} alt={item.alt} width={1600} height={1000} />
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
        <Link href={`/work/${category.slug}`} className="back-link">
          <Icon name="arrow-left" size={14} /> {category.titleLines.join(" ").replace(".", "")}
        </Link>
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
          className={project.mediaLayout === "grid" ? "media media-grid" : "media"}
        >
          {project.media.map((item, i) => (
            <Frame key={i} item={item} />
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
