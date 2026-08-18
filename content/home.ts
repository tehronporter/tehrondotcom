import { projectPreviews, type ProjectPreview } from "@/content/projects";

export type HomeMediaTreatment = {
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  background?: string;
  /**
   * Override the card's proportions. Left off — which is the norm — the card
   * takes the picture's own ratio and nothing is cropped.
   */
  ratio?: number;
};

type HomeProjectEntry = {
  kind: "project";
  key: string;
  media?: HomeMediaTreatment;
};

type HomePlaceholderEntry = {
  kind: "placeholder";
  title: string;
  meta: string;
  status: string;
  background: string;
  /** Placeholders have no image, so they have to be told what shape to be. */
  ratio: number;
};

export type HomeSelectedEntry = HomeProjectEntry | HomePlaceholderEntry;

/**
 * Homepage storytelling lives here, separate from canonical project content.
 * Reordering work or tuning a card never changes a case study or a URL.
 *
 * The rail is sequenced on two axes at once, and it is worth keeping both when
 * you reorder it:
 *
 *   discipline  brand → product → technology, twice through, so all three
 *               practices are visible without scrolling to the end
 *   shape       wide → tall → wide → tall → wide → tall, because the cards now
 *               carry their own proportions and a run of six similar rectangles
 *               is what makes a rail read as a grid that failed
 */
export const homeCuration = {
  selected: [
    {
      kind: "project",
      key: "brand-identity/blue-t-shirt",
      media: { background: "#d7d1c6" },
    },
    {
      kind: "project",
      key: "product-development/apple-retail-merch",
      media: { background: "#e6e4de" },
    },
    {
      kind: "placeholder",
      title: "OVERWATCH",
      meta: "PRODUCT / TECHNOLOGY",
      status: "IN PROGRESS",
      background: "#1a35e0",
      ratio: 1.33,
    },
    {
      kind: "project",
      key: "brand-identity/westside-gunn-saucony",
      media: { background: "#d9d0b8" },
    },
    {
      kind: "project",
      key: "product-development/tomorrow-is-yesterday",
      media: { background: "#d9d5cb" },
    },
    /* Creative Technology has no published case study yet, so it would be the
       one discipline absent from the rail. This card holds its place. */
    {
      kind: "placeholder",
      title: "PORTFOLIO SYSTEM",
      meta: "WEB EXPERIENCE / DESIGN SYSTEM",
      status: "IN PROGRESS",
      background: "#111111",
      ratio: 0.8,
    },
  ] satisfies HomeSelectedEntry[],
  /* Two case studies shown large. The first gets the wide slot, so it wants to
     be the strongest single image on the site. */
  featured: ["brand-identity/cant-buy-respect", "product-development/222-rings"],
  playground: [] as string[],
} as const;

export type ResolvedSelectedProject = {
  kind: "project";
  project: ProjectPreview;
  media: HomeMediaTreatment;
  /** The card's proportions: the override if given, else the picture's own. */
  ratio: number;
};

export type ResolvedSelectedPlaceholder = HomePlaceholderEntry;
export type ResolvedSelectedWork = ResolvedSelectedProject | ResolvedSelectedPlaceholder;

const projectKey = (project: ProjectPreview) => `${project.categorySlug}/${project.slug}`;

const requireProject = (projects: Map<string, ProjectPreview>, key: string) => {
  const project = projects.get(key);
  if (!project) throw new Error(`Homepage curation references a missing published project: ${key}`);
  return project;
};

export function resolveHomeCuration() {
  const archive = projectPreviews();
  const projects = new Map(archive.map((project) => [projectKey(project), project]));

  const selected: ResolvedSelectedWork[] = homeCuration.selected.map((entry) => {
    if (entry.kind === "placeholder") return entry;
    const project = requireProject(projects, entry.key);
    /* `as const` up top narrows each literal to only the keys it happens to
       set, so widen back to the declared shape before reading an optional. */
    const media: HomeMediaTreatment = entry.media ?? {};
    return {
      kind: "project",
      project,
      media,
      ratio: media.ratio ?? project.featured.width / project.featured.height,
    };
  });

  const featured = homeCuration.featured.map((key) => requireProject(projects, key));

  return {
    selected,
    featured,
    archive,
  };
}
