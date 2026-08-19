"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";
import { Icon } from "@/components/Icon";
import type { BrowserProject } from "@/content/projects";
import { isPractice, practiceFromPath, type Practice } from "@/content/practices";
import { BROWSER_COVER_SIZES } from "@/lib/sizes";
import { titleCase } from "@/lib/text";

type ViewTransition = { finished: Promise<void>; ready: Promise<void>; updateCallbackDone: Promise<void> };
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
};

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PortfolioBrowser({ projects, practices }: { projects: BrowserProject[]; practices: Practice[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedDiscipline = searchParams.get("discipline");
  const routeDiscipline = practiceFromPath(pathname, practices);
  const discipline = routeDiscipline ?? (isPractice(requestedDiscipline, practices) ? requestedDiscipline : null);
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const visibleProjects = discipline ? projects.filter((project) => project.categorySlug === discipline) : projects;
  const activePractice = practices.find((practice) => practice.slug === discipline);
  const collectionBase = pathname === "/" || pathname === "/featured" || pathname === "/recent" ? pathname : "/";
  const filterHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (view === "list") params.set("view", "list");
    if (slug) params.set("discipline", slug);
    const query = params.toString();
    return query ? `${collectionBase}?${query}` : collectionBase;
  };
  const countLabel = discipline && visibleProjects.length !== projects.length
    ? `${visibleProjects.length} OF ${projects.length} PROJECTS · ${activePractice?.label.toUpperCase()}`
    : `${visibleProjects.length} ${visibleProjects.length === 1 ? "PROJECT" : "PROJECTS"}${activePractice ? ` · ${activePractice.label.toUpperCase()}` : ""}`;

  const openProject = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition || reducedMotion()) return;
    event.preventDefault();
    const transition = doc.startViewTransition(
      () => new Promise<void>((resolve) => {
        router.push(href);
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
    );
    transition.ready.catch(() => {});
    transition.updateCallbackDone.catch(() => {});
    transition.finished.catch(() => {});
  };

  return (
    <>
      <div className="browser-controls">
        <p className="browser-count" aria-live="polite">{countLabel}</p>
        <nav className="mobile-practice-filters" aria-label="Filter projects by practice">
          <Link href={filterHref()} className={!discipline ? "is-active" : undefined} aria-current={!discipline ? "true" : undefined}>
            All
          </Link>
          {practices.map((practice) => (
            <Link
              key={practice.slug}
              href={filterHref(practice.slug)}
              className={discipline === practice.slug ? "is-active" : undefined}
              aria-current={discipline === practice.slug ? "true" : undefined}
            >
              <span className="discipline-dot" data-discipline={practice.slug} aria-hidden="true" />
              {practice.shortLabel}
            </Link>
          ))}
        </nav>
      </div>

      {visibleProjects.length > 0 ? (
        <section className={`project-browser is-${view}`} aria-label="Portfolio projects">
          {visibleProjects.map((project, position) => (
            <article className="project-card" key={project.href} data-discipline={project.categorySlug}>
              <Link href={project.href} className="project-card-link" onClick={openProject(project.href)}>
                <div className="folder-cover">
                  <span className="folder-layer folder-layer-back" aria-hidden="true" />
                  <span className="folder-layer folder-layer-mid" aria-hidden="true" />
                  <div className="folder-art">
                    <Image
                      src={project.featured.src}
                      alt={project.featured.alt}
                      width={project.featured.width}
                      height={project.featured.height}
                      sizes={BROWSER_COVER_SIZES}
                      className="folder-image"
                      style={project.featured.focus ? { objectPosition: project.featured.focus } : undefined}
                      ref={(element) => {
                        if (element) element.style.viewTransitionName = `piece-hero-${project.slug}`;
                      }}
                      priority={position === 0}
                      {...(project.featured.blurDataURL
                        ? { placeholder: "blur" as const, blurDataURL: project.featured.blurDataURL }
                        : {})}
                    />
                    <span className="folder-sheen" aria-hidden="true" />
                  </div>
                </div>

                <div className="project-card-copy">
                  <h2 className="project-card-title">
                    <span>{String(project.globalIndex + 1).padStart(2, "0")}</span>
                    {titleCase(project.name)}
                  </h2>
                  <p className="project-card-meta">{project.meta}</p>
                  <p className="project-card-description">{project.shortDescription}</p>
                  <span className="sr-only">Category: {project.categoryLabel}.</span>
                  <span className="project-card-dot" aria-hidden="true" />
                </div>
                <span className="project-list-arrow" aria-hidden="true"><Icon name="arrow-right" size={17} /></span>
              </Link>
            </article>
          ))}
        </section>
      ) : null}

      {visibleProjects.length === 0 ? (
        <section className="empty-collection" aria-labelledby="empty-collection-title">
          <h2 className="display" id="empty-collection-title">WORK IN PROGRESS.</h2>
          <p>This practice is being documented. Browse the published work or start a conversation.</p>
          <div className="empty-actions">
            <Link href="/">VIEW ALL WORK</Link>
            <Link href="/contact">CONTACT TEHRON</Link>
          </div>
        </section>
      ) : null}

      <p className="sr-only" role="status">
        {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"} shown.
      </p>
    </>
  );
}
