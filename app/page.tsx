import Link from "next/link";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { ProjectArchive } from "@/components/ProjectArchive";
import { SelectedWorkRail } from "@/components/SelectedWorkRail";
import { resolveHomeCuration } from "@/content/home";
import { categories } from "@/content/projects";
import { site } from "@/content/site";

export default function HomePage() {
  const { selected, featured, archive } = resolveHomeCuration();
  const archiveRows = archive.map(({ slug, name, href, categorySlug, meta, tags }) => ({
    slug,
    name,
    href,
    categorySlug,
    meta,
    tags,
  }));

  return (
    <div className="page home">
      <section className="home-hero home-gutter" aria-labelledby="home-title">
        <div className="hero-topline">
          <p>DESIGNER + CREATIVE TECHNOLOGIST</p>
          <p>{site.location}</p>
        </div>

        <h1 id="home-title" className="hero-name">
          <span>TEHRON</span>
          <span>PORTER</span>
        </h1>

        <p className="hero-tagline">
          I BUILD WHAT&apos;S NEXT,
          <br />
          NOT WHAT&apos;S SAFE.
        </p>
      </section>

      <SelectedWorkRail items={selected} />

      <section className="practice-statement home-gutter" aria-labelledby="practice-title">
        <p className="home-label">THE PRACTICE</p>
        <h2 id="practice-title">
          I work across identity, technology and physical products. The medium changes.{" "}
          <em className="editorial-accent">The goal doesn&apos;t.</em> Make something people actually remember.
        </h2>
      </section>

      <FeaturedProjects projects={featured} />

      <section className="home-disciplines" aria-labelledby="disciplines-title">
        <div className="disciplines-heading home-gutter">
          <p className="home-label">DISCIPLINES</p>
          <h2 id="disciplines-title">WHAT I DO</h2>
        </div>
        <div className="discipline-rows">
          {categories.map((category, index) => {
            const title = category.titleLines.join(" ").replace(".", "");
            const hasPublishedWork = category.projects.some((project) => project.published === true);
            const content = (
              <>
                <span className="discipline-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="discipline-name">{title}</span>
                <span className="discipline-summary">{category.summary}</span>
                <span className="discipline-mark" aria-hidden="true">
                  {hasPublishedWork ? "↗" : "—"}
                </span>
              </>
            );

            return hasPublishedWork ? (
              <Link className="discipline-row" href={"/work/" + category.slug} key={category.slug}>
                {content}
              </Link>
            ) : (
              <div className="discipline-row" key={category.slug}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <ProjectArchive projects={archiveRows} />
    </div>
  );
}
