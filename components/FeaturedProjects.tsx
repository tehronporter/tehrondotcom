import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { ProjectPreview } from "@/content/projects";

export function FeaturedProjects({ projects }: { projects: ProjectPreview[] }) {
  return (
    <section className="home-features" aria-labelledby="featured-title">
      <div className="feature-heading home-gutter">
        <p className="home-label">A CLOSER LOOK</p>
        <h2 id="featured-title">FEATURED PROJECTS</h2>
      </div>

      <div className="feature-list">
        {projects.map((project, index) => (
          <article className="feature-project" data-layout={index === 0 ? "wide" : "offset"} key={project.href}>
            <Link href={project.href} className="feature-link">
              <div className="feature-media">
                <Image
                  src={project.featured.src}
                  alt={project.featured.alt}
                  fill
                  className="feature-image"
                  style={{ objectPosition: project.featured.focus ?? "50% 50%" }}
                  sizes={index === 0 ? "(max-width: 760px) 100vw, 92vw" : "(max-width: 760px) 100vw, 64vw"}
                  {...(project.featured.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: project.featured.blurDataURL }
                    : {})}
                />
              </div>
              <div className="feature-meta">
                <div>
                  <p className="home-label">{project.meta}</p>
                  <h3>{project.name}</h3>
                </div>
                <span className="feature-action">
                  VIEW PROJECT <Icon name="arrow-up-right" size={16} />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
