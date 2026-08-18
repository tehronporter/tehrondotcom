import { projectPreviews, type ProjectPreview } from "@/content/projects";

export type HomeMediaTreatment = {
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  background?: string;
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
};

export type HomeSelectedEntry = HomeProjectEntry | HomePlaceholderEntry;

/**
 * Homepage storytelling lives here, separate from canonical project content.
 * Reordering work or tuning an image crop never changes a case study or URL.
 */
export const homeCuration = {
  selected: [
    {
      kind: "project",
      key: "brand-identity/blue-t-shirt",
      media: { objectFit: "cover", objectPosition: "50% 50%", background: "#d7d1c6" },
    },
    {
      kind: "placeholder",
      title: "OVERWATCH",
      meta: "PRODUCT / TECHNOLOGY",
      status: "COMING SOON",
      background: "#1a35e0",
    },
    {
      kind: "project",
      key: "brand-identity/westside-gunn-saucony",
      media: { objectFit: "cover", objectPosition: "50% 50%", background: "#d9d0b8" },
    },
    {
      kind: "project",
      key: "product-development/tomorrow-is-yesterday",
      media: { objectFit: "cover", objectPosition: "50% 55%", background: "#d9d5cb" },
    },
    {
      kind: "project",
      key: "brand-identity/amine-club-banana",
      media: { objectFit: "contain", objectPosition: "50% 50%", background: "#f7f6f2" },
    },
    {
      kind: "project",
      key: "product-development/apple-retail-merch",
      media: { objectFit: "contain", objectPosition: "50% 50%", background: "#e6e4de" },
    },
  ] satisfies HomeSelectedEntry[],
  featured: ["product-development/222-rings", "brand-identity/cant-buy-respect"],
  playground: [] as string[],
} as const;

export type ResolvedSelectedProject = {
  kind: "project";
  project: ProjectPreview;
  media: HomeMediaTreatment;
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
    return {
      kind: "project",
      project: requireProject(projects, entry.key),
      media: entry.media ?? {},
    };
  });

  const featured = homeCuration.featured.map((key) => requireProject(projects, key));

  return {
    selected,
    featured,
    archive,
  };
}
