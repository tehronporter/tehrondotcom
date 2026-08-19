"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type CSSProperties, type MouseEvent } from "react";
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

/**
 * Position within the collection being shown, not within the whole archive.
 *
 * This used to read the project's global index, so Featured counted
 * 01 02 05 06 08 10 and Recent — which is ordered by recency — counted
 * backwards. A numbered list with holes in it reads as items that failed to
 * load, not as a selection.
 */
const numberAt = (position: number) => String(position + 1).padStart(2, "0");

type FolderTreatment = {
  accessory: "label" | "pin" | "stamp" | "sticker";
  code: string;
  mark: string;
  note: string;
  tab: "left" | "middle" | "right";
  tape: "black" | "clear" | "cream";
};

const folderTreatments: Record<string, FolderTreatment> = {
  "blue-t-shirt": { accessory: "stamp", code: "BTS / ARCHIVE", mark: "◎", note: "ONE SHIRT.\nWHOLE WORLD.  →", tab: "left", tape: "cream" },
  "cant-buy-respect": { accessory: "sticker", code: "CBR", mark: "＿＿", note: "NOT FOR SALE", tab: "middle", tape: "black" },
  "karl-kani": { accessory: "pin", code: "KK–93 / SAMPLE", mark: "↗", note: "CHECK COLOR + CUT", tab: "right", tape: "cream" },
  "indivisual-threads": { accessory: "stamp", code: "CAPSULE 01", mark: "✳", note: "SPRAY / PRINT / REPEAT", tab: "left", tape: "black" },
  "westside-gunn-saucony": { accessory: "label", code: "FLYER SET / 05", mark: "★", note: "BATTLE CARD PROOF", tab: "middle", tape: "cream" },
  "amine-club-banana": { accessory: "sticker", code: "ACB", mark: ":)", note: "PATTERN TEST — PASS", tab: "right", tape: "clear" },
  "red-panda-academy": { accessory: "stamp", code: "MARK SYSTEM", mark: "◎", note: "CREST STUDY / FINAL", tab: "left", tape: "cream" },
  "tomorrow-is-yesterday": { accessory: "label", code: "OBJECT FILE", mark: "☼", note: "SKETCH → PRODUCTION", tab: "middle", tape: "clear" },
  "thank-you-dilla": { accessory: "sticker", code: "TYD", mark: "♡", note: "MADE, NOT SET", tab: "right", tape: "black" },
  "222-rings": { accessory: "pin", code: "PROTO / 222", mark: "222", note: "FORM STUDY", tab: "left", tape: "cream" },
  "apple-retail-merch": { accessory: "label", code: "COLOR FILE", mark: "✓", note: "PROPOSED → PRODUCED", tab: "middle", tape: "clear" },
};

const defaultTreatment: FolderTreatment = {
  accessory: "stamp",
  code: "TP / WORK FILE",
  mark: "+",
  note: "ARCHIVE COPY",
  tab: "left",
  tape: "cream",
};

export function PortfolioBrowser({ projects, practices }: { projects: BrowserProject[]; practices: Practice[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedHref, setSelectedHref] = useState<string | null>(null);
  const [listPreviewHref, setListPreviewHref] = useState<string | null>(null);
  const requestedDiscipline = searchParams.get("discipline");
  const routeDiscipline = practiceFromPath(pathname, practices);
  const discipline = routeDiscipline ?? (isPractice(requestedDiscipline, practices) ? requestedDiscipline : null);
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const visibleProjects = discipline ? projects.filter((project) => project.categorySlug === discipline) : projects;
  const activePractice = practices.find((practice) => practice.slug === discipline);
  /* Index rather than the project itself, because the preview's caption
     numbers it the same way the rows do — by position in this collection. */
  const activeListIndex = Math.max(
    0,
    visibleProjects.findIndex((project) => project.href === listPreviewHref),
  );
  const activeListProject = visibleProjects[activeListIndex];
  const activeListImage = activeListProject
    ? activeListProject.browser.listPreview ?? activeListProject.featured
    : undefined;
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
    setSelectedHref(href);
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
              {practice.shortLabel}
            </Link>
          ))}
        </nav>
      </div>

      {visibleProjects.length > 0 && view === "grid" ? (
        <section className="project-browser is-grid" aria-label="Portfolio projects">
          {visibleProjects.map((project, position) => {
            const cover = project.browser.cover;
            const treatment = folderTreatments[project.slug] ?? defaultTreatment;
            const artworkStyle = { background: cover?.background } satisfies CSSProperties;
            const artworkInnerStyle = {
              transform: cover?.scale ? `scale(${cover.scale})` : undefined,
              /* Zoom toward the same point the crop is already centred on.
                 Scaling about the middle pulls away from the subject on any
                 piece whose subject is not in the middle — which is most of
                 the product renders, where the object sits low in a tall
                 frame of empty studio sweep. */
              transformOrigin: cover?.scale && cover?.position ? cover.position : undefined,
            } satisfies CSSProperties;

            return (
              <article
                className={selectedHref === project.href ? "project-card is-selected" : "project-card"}
                key={project.href}
              >
                <Link
                  href={project.href}
                  className="project-card-link"
                  onClick={openProject(project.href)}
                >
                  <div className={`folder-cover folder-${project.slug} folder-tab-${treatment.tab}`}>
                    <span className="folder-back" aria-hidden="true" />
                    <span className="folder-layer folder-layer-back" aria-hidden="true" />
                    <span className="folder-layer folder-layer-mid" aria-hidden="true" />
                    <span className="folder-tab-copy" aria-hidden="true">
                      <strong>{numberAt(position)}</strong>
                      <span>{project.name}</span>
                    </span>

                    <div className="folder-face">
                      <span className="folder-grain" aria-hidden="true" />
                      <span className="folder-crease" aria-hidden="true" />
                      <span className="folder-hand-note" aria-hidden="true">{treatment.note}</span>
                      <span className="folder-mark" aria-hidden="true">{treatment.mark}</span>
                      <span className={`folder-accessory folder-accessory-${treatment.accessory}`} aria-hidden="true">
                        {treatment.code}
                      </span>

                      <div className="folder-art" style={artworkStyle}>
                        <span className="folder-art-inner" style={artworkInnerStyle}>
                          <Image
                            src={project.featured.src}
                            alt={project.featured.alt}
                            width={project.featured.width}
                            height={project.featured.height}
                            sizes={BROWSER_COVER_SIZES}
                            className="folder-image"
                            style={{
                              objectFit: cover?.fit ?? "cover",
                              objectPosition: cover?.position ?? project.featured.focus,
                            }}
                            ref={(element) => {
                              if (element) element.style.viewTransitionName = `piece-hero-${project.slug}`;
                            }}
                            priority={position === 0}
                            {...(project.featured.blurDataURL
                              ? { placeholder: "blur" as const, blurDataURL: project.featured.blurDataURL }
                              : {})}
                          />
                        </span>
                      </div>

                      <span className={`folder-tape folder-tape-${treatment.tape}`} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="project-card-copy">
                    <h2 className="project-card-title">
                      <span>{numberAt(position)}</span>
                      {titleCase(project.name)}
                    </h2>
                    <p className="project-card-meta">{project.meta}</p>
                    <span className="sr-only">Category: {project.categoryLabel}.</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      ) : null}

      {visibleProjects.length > 0 && view === "list" ? (
        <section className="project-index" aria-label="Portfolio project index">
          <div className="project-index-rows">
            {visibleProjects.map((project, position) => {
              const thumb = project.browser.listPreview ?? project.featured;
              return (
                <article className={selectedHref === project.href ? "index-row is-selected" : "index-row"} key={project.href}>
                  <Link
                    href={project.href}
                    className="index-row-link"
                    onClick={openProject(project.href)}
                    onMouseEnter={() => setListPreviewHref(project.href)}
                    onFocus={() => setListPreviewHref(project.href)}
                  >
                    <span className="index-number">{numberAt(position)}</span>
                    {/* Carries the imagery at the widths where the sticky
                        preview panel beside these rows is hidden. Decorative:
                        the row's own heading is the accessible name. */}
                    <span className="index-thumb" aria-hidden="true">
                      <Image
                        src={thumb.src}
                        alt=""
                        width={thumb.width}
                        height={thumb.height}
                        sizes="(max-width: 980px) 64px, 1px"
                        {...(thumb.blurDataURL
                          ? { placeholder: "blur" as const, blurDataURL: thumb.blurDataURL }
                          : {})}
                      />
                    </span>
                    <h2>{titleCase(project.name)}</h2>
                    <p>{project.meta}</p>
                  </Link>
                </article>
              );
            })}
          </div>

          {activeListProject && activeListImage ? (
            <aside className="index-preview" aria-hidden="true">
              <div className="index-preview-frame" key={activeListProject.href}>
                <Image
                  src={activeListImage.src}
                  alt=""
                  width={activeListImage.width}
                  height={activeListImage.height}
                  sizes="(max-width: 980px) 1px, 34vw"
                  className="index-preview-image"
                  {...(activeListImage.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: activeListImage.blurDataURL }
                    : {})}
                />
              </div>
              <p>{numberAt(activeListIndex)} / {titleCase(activeListProject.name)}</p>
            </aside>
          ) : null}
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
