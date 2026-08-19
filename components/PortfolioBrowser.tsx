"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type CSSProperties, type MouseEvent } from "react";
import type { BrowserProject } from "@/content/projects";
import { isPractice, practiceFromPath, type Practice } from "@/content/practices";
import { BROWSER_ART_SIZES, BROWSER_COVER_SIZES } from "@/lib/sizes";
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
  accessory?: "pin" | "sticker";
  code?: string;
  /**
   * What somebody actually wrote on the folder in marker — a studio shorthand,
   * not the project's name. The name is already set twice on the card, once on
   * the tab and once in the title beneath it; writing it a third time in the
   * middle of the paper is a caption, not handwriting. Shorthand is what makes
   * the object read as somebody's rather than as a template's.
   */
  label: string;
  /** Which of the four photographed folders this project is filed in. */
  template: number;
};

/**
 * A project keeps the same folder everywhere it appears.
 *
 * The assignment used to be `position % folderTemplates.length`, which with
 * four templates and a four-column grid drew every column out of one template
 * — a perfectly striped wall, in every collection, including the four-project
 * category views where each column then held its own single folder. Pinning
 * the folder to the project instead fixes both: the order changes between
 * Work, Featured and a practice filter, so the templates fall differently in
 * each, and a folder a visitor recognises on the home wall is still that
 * project's folder on the way back to it.
 *
 * The template order below is chosen, not incidental: no two folders of the
 * same template sit side by side or directly above one another at four or
 * three columns in any collection this site can show.
 */
const folderTreatments: Record<string, FolderTreatment> = {
  "blue-t-shirt": { label: "BLUE", template: 0 },
  "cant-buy-respect": { label: "CBR", template: 1 },
  "karl-kani": { accessory: "pin", code: "KK–93", label: "KANI", template: 2 },
  "indivisual-threads": { label: "THREADS", template: 3 },
  "westside-gunn-saucony": { label: "SAUCONY", template: 2 },
  "amine-club-banana": { accessory: "sticker", code: "ACB", label: "BANANA", template: 0 },
  "red-panda-academy": { label: "RED PANDA", template: 1 },
  "tomorrow-is-yesterday": { label: "TIY", template: 2 },
  "thank-you-dilla": { accessory: "sticker", code: "TYD", label: "DILLA", template: 1 },
  "222-rings": { label: "222", template: 3 },
  "apple-retail-merch": { label: "APPLE", template: 0 },
};

/* A project published without a treatment still has to land on a folder, and
   on the same one every render — server and client included. */
const hash = (slug: string) => {
  let value = 0;
  for (let i = 0; i < slug.length; i++) value = (value * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(value);
};

const treatmentFor = (slug: string, name: string): FolderTreatment =>
  folderTreatments[slug] ?? { label: name.toUpperCase(), template: hash(slug) % folderTemplates.length };

/**
 * Nobody writes on eleven folders at the same angle. The tilt and the nudge
 * off centre come from the slug, so they are the same on the server, on the
 * client and on every collection the project appears in — a `Math.random()`
 * here would rewrite the wall on every navigation and mismatch hydration.
 * Kept inside a couple of degrees: the folders are hand-labelled, the grid
 * they sit in is not.
 */
const labelHand = (slug: string) => {
  const seed = hash(`${slug}/hand`);
  return {
    rotate: ((seed % 33) / 10 - 1.6).toFixed(2),
    shift: ((((seed >> 5) % 25) / 10 - 1.2)).toFixed(2),
  };
};

type FolderTemplate = {
  src: string;
  /** The alpha opening the project art is mounted behind, in % of the canvas. */
  imageInset: { top: number; right: number; bottom: number; left: number };
  /** The tab: left and right as % insets, `mid` as the % down to its centre. */
  tab: { left: number; right: number; mid: number };
  /** The % down to the middle of the blue paper below the opening. */
  labelMid: number;
};

/* ---------------------------------------------------------------------------
   Generated by `node scripts/folder-templates.mjs` from the PNG masters in
   assets/folder-templates/source. Every number is measured off the alpha
   channel — do not hand-edit, re-run the script.

   The tab is per template because the four masters genuinely disagree about
   it: d's tab sits 2% of the canvas height above the other three, which one
   shared value rendered as a label printed on the folder body instead of on
   its own tab.
   --------------------------------------------------------------------------- */

const FOLDER_SIZE = { width: 1072, height: 1224 };

const folderTemplates: FolderTemplate[] = [
  {
    src: "/work/folder-templates/folder-template-a.webp",
    imageInset: { top: 22.71, right: 12.5, bottom: 31.54, left: 11.66 },
    tab: { left: 4.66, right: 63.62, mid: 6.09 },
    labelMid: 84.03,
  },
  {
    src: "/work/folder-templates/folder-template-b.webp",
    imageInset: { top: 21.9, right: 12.41, bottom: 33.42, left: 12.03 },
    tab: { left: 4.48, right: 64.09, mid: 5.96 },
    labelMid: 82.68,
  },
  {
    src: "/work/folder-templates/folder-template-c.webp",
    imageInset: { top: 23.04, right: 14.27, bottom: 35.78, left: 11.85 },
    tab: { left: 4.38, right: 64.37, mid: 5.84 },
    labelMid: 81.5,
  },
  {
    src: "/work/folder-templates/folder-template-d.webp",
    imageInset: { top: 21, right: 11.75, bottom: 33.5, left: 11.38 },
    tab: { left: 3.45, right: 63.62, mid: 3.88 },
    labelMid: 83.33,
  },
];

type FolderStyle = CSSProperties & Record<
  | "--folder-image-top"
  | "--folder-image-right"
  | "--folder-image-bottom"
  | "--folder-image-left"
  | "--folder-tab-left"
  | "--folder-tab-right"
  | "--folder-tab-mid"
  | "--folder-label-mid"
  | "--folder-label-tilt"
  | "--folder-label-shift",
  string
>;

const folderStyleFor = (template: FolderTemplate, slug: string): FolderStyle => {
  const hand = labelHand(slug);
  return {
    "--folder-image-top": `${template.imageInset.top}%`,
    "--folder-image-right": `${template.imageInset.right}%`,
    "--folder-image-bottom": `${template.imageInset.bottom}%`,
    "--folder-image-left": `${template.imageInset.left}%`,
    "--folder-tab-left": `${template.tab.left}%`,
    "--folder-tab-right": `${template.tab.right}%`,
    "--folder-tab-mid": `${template.tab.mid}%`,
    "--folder-label-mid": `${template.labelMid}%`,
    "--folder-label-tilt": `${hand.rotate}deg`,
    "--folder-label-shift": `${hand.shift}%`,
  };
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
            const treatment = treatmentFor(project.slug, project.name);
            const template = folderTemplates[treatment.template];
            const folderStyle = folderStyleFor(template, project.slug);
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
                  <div className={`folder-cover folder-${project.slug}`} style={folderStyle}>
                    <div className="folder-art" style={artworkStyle}>
                      <span className="folder-art-inner" style={artworkInnerStyle}>
                        <Image
                          src={project.featured.src}
                          alt={project.featured.alt}
                          width={project.featured.width}
                          height={project.featured.height}
                          sizes={BROWSER_ART_SIZES}
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

                    {/* The folder is what paints first and largest, so the
                        first one on the wall is the LCP element and is
                        preloaded as such. The other ten are lazy and, being
                        four files across eleven cards, mostly cache hits. */}
                    <Image
                      src={template.src}
                      alt=""
                      width={FOLDER_SIZE.width}
                      height={FOLDER_SIZE.height}
                      sizes={BROWSER_COVER_SIZES}
                      className="folder-template-image"
                      aria-hidden="true"
                      priority={position === 0}
                      loading={position === 0 ? undefined : "lazy"}
                    />

                    <span className="folder-tab-copy" aria-hidden="true">
                      <strong>{numberAt(position)}</strong>
                      <span>{project.name}</span>
                    </span>
                    {/* Decorative: the tab above it and the heading below it
                        already carry this project's name to a screen reader. */}
                    <span className="folder-label" aria-hidden="true">{treatment.label}</span>
                    {treatment.accessory && treatment.code ? (
                      <span className={`folder-accessory folder-accessory-${treatment.accessory}`} aria-hidden="true">
                        {treatment.code}
                      </span>
                    ) : null}
                  </div>

                  <div className="project-card-copy">
                    <h2 className="project-card-title">{titleCase(project.name)}</h2>
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
