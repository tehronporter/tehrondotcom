import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import type { ProjectPreview } from "@/content/projects";

export function FeaturedProjects({ projects }: { projects: ProjectPreview[] }) {
  return (
    <section className="home-features" aria-labelledby="featured-title">
      <div className="section-head home-gutter">
        <h2 id="featured-title">Case Studies</h2>
        <p className="section-count">01 — {String(projects.length).padStart(2, "0")}</p>
      </div>

      <div className="feature-list">
        {projects.map((project, index) => (
          <article className="feature-project" data-layout={index === 0 ? "wide" : "offset"} key={project.href}>
            <Link href={project.href} className="feature-link">
              {/* The frame takes the picture's own proportions rather than a
                  fixed 16/9 or 5/4, so nothing is cropped to fit a slot. Height
                  is what's held constant across the page; width follows from
                  the ratio, which is what keeps a square image from being
                  blown up to the full width of the page. */}
              <div
                className="feature-media"
                style={{ "--media-ratio": project.featured.width / project.featured.height } as CSSProperties}
              >
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
