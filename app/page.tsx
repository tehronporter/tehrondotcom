import Link from "next/link";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Icon } from "@/components/Icon";
import { SelectedWorkRail } from "@/components/SelectedWorkRail";
import { resolveHomeCuration } from "@/content/home";
import { categories } from "@/content/projects";
import { site } from "@/content/site";

export default function HomePage() {
  const { selected, featured } = resolveHomeCuration();

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
          I build what&rsquo;s next,
          <br />
          <em className="editorial-accent">not</em> what&rsquo;s safe.
        </p>
      </section>

      <SelectedWorkRail items={selected} />

      <section className="practice-statement home-gutter" aria-labelledby="practice-title">
        <p className="home-label">THE PRACTICE</p>
        <h2 id="practice-title">
          I work across identity, technology and physical products. The medium changes.{" "}
          <em className="editorial-accent">The goal doesn&rsquo;t.</em> Make something people actually
          remember.
        </h2>
      </section>

      <FeaturedProjects projects={featured} />

      <section className="home-disciplines" aria-labelledby="disciplines-title">
        <div className="section-head home-gutter">
          <div>
            <p className="home-label">DISCIPLINES</p>
            <h2 id="disciplines-title">What I Do</h2>
          </div>
          <p className="section-count">01 — {String(categories.length).padStart(2, "0")}</p>
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

        {/* The full index lives at /work and only at /work. It used to be
            repeated here as an eleven-row archive under a curated rail and a
            case-study block that already showed the same projects — the same
            work listed three times on one page. */}
        <Link className="home-all-work home-gutter" href="/work">
          <span className="home-label">EVERY PROJECT</span>
          <span className="home-all-work-name">
            ALL WORK <Icon name="arrow-up-right" size={22} />
          </span>
        </Link>
      </section>
    </div>
  );
}
