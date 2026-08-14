/**
 * All work lives here. Add a project by dropping an object into a category's
 * `projects` array — the category index page, the case study page, its URL, and
 * the prev/next links all generate from this file. Nothing else to touch.
 *
 * NOTE: case study body copy below is scaffolding written from the project names
 * in the original mockup. Rewrite `intro` / `sections` with the real story before
 * you launch. The structure is what matters; the words are yours.
 */

import type { IconName } from "@/components/Icon";

export type Media = {
  /** Path under /public, e.g. "/work/blue-t-shirt/01.jpg". Omit for an empty frame. */
  src?: string;
  alt: string;
  caption?: string;
  /** "full" spans the page, "half" sits in a 2-up row. Defaults to "full". */
  span?: "full" | "half";
};

export type Project = {
  slug: string;
  name: string;
  /** Right-hand label on the category index row. */
  meta: string;
  year: string;
  /** Lead paragraph on the case study page. */
  intro: string;
  client?: string;
  role: string[];
  deliverables: string[];
  sections: { heading: string; body: string[] }[];
  media: Media[];
  /** Optional live link shown under the title. */
  link?: { label: string; href: string };
};

export type Category = {
  slug: string;
  /** Rendered as stacked lines on the home card and category header. */
  titleLines: string[];
  icon: IconName;
  /** Home card tag list, also joined into the category subhead. */
  tags: string[];
  /** One-line description used on the category page and in metadata. */
  summary: string;
  projects: Project[];
};

export const categories: Category[] = [
  {
    slug: "brand-identity",
    titleLines: ["BRAND", "IDENTITY."],
    icon: "crop",
    tags: ["BRAND DESIGN", "VISUAL IDENTITY", "CAMPAIGNS", "ART DIRECTION"],
    summary:
      "Identity systems built to hold up in the real world — on garments, in feeds, and under pressure.",
    projects: [
      {
        slug: "blue-t-shirt",
        name: "BLUE T-SHIRT",
        meta: "Brand Identity / Creative Direction",
        year: "2025",
        intro:
          "A full identity system for an apparel label built around a single garment. The mark, the type, and the packaging all had to survive being screen-printed, folded, shipped, and photographed on a phone.",
        role: ["Creative Direction", "Identity Design", "Art Direction"],
        deliverables: ["Wordmark", "Type System", "Packaging", "Campaign Imagery"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The brief was one product and no budget for spectacle, so the identity had to do the work. Everything routes back to one geometric wordmark and a strict two-weight type system.",
              "No gradients, no illustration, no seasonal reinvention. The system is deliberately narrow so that it reads the same on a hangtag as it does on a billboard.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "A brand kit that a two-person team can run without a designer in the room — templates, rules, and a short set of decisions already made.",
            ],
          },
        ],
        media: [
          { alt: "Blue T-Shirt wordmark lockup" },
          { alt: "Packaging system", span: "half" },
          { alt: "Campaign imagery", span: "half" },
        ],
      },
      {
        slug: "not-for-sale",
        name: "NOT FOR SALE",
        meta: "Brand Identity / Apparel",
        year: "2025",
        intro:
          "An apparel identity for a label that releases in closed drops. The system had to feel scarce without feeling precious.",
        role: ["Identity Design", "Art Direction"],
        deliverables: ["Identity System", "Drop Campaigns", "Lookbook"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Scarcity is a design constraint, not a marketing line. The system leans on stamped type, fixed edition numbering, and a palette that never expands.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "Each release reads as part of one run rather than a new campaign, which is what a drop model actually needs.",
            ],
          },
        ],
        media: [{ alt: "Not For Sale identity" }, { alt: "Drop campaign" }],
      },
      {
        slug: "g-perico",
        name: "G. PERICO",
        meta: "Creative Direction / Music",
        year: "2024",
        intro:
          "Creative direction across a release cycle — cover art, campaign visuals, and the visual language tying the rollout together.",
        role: ["Creative Direction", "Art Direction"],
        deliverables: ["Cover Art", "Campaign Visuals", "Rollout System"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Music rollouts fall apart when every asset is designed separately. The work here was setting a single visual grammar early, then holding it across every drop in the cycle.",
            ],
          },
          {
            heading: "OUTCOME",
            body: ["A rollout that reads as one body of work rather than a folder of singles."],
          },
        ],
        media: [{ alt: "Cover art" }, { alt: "Campaign visuals", span: "half" }, { alt: "Rollout assets", span: "half" }],
      },
      {
        slug: "selected-client-work",
        name: "SELECTED CLIENT WORK",
        meta: "Identity / Campaigns",
        year: "2023–26",
        intro:
          "An ongoing set of identity and campaign engagements across apparel, music, and small business — shorter runs, same standard.",
        role: ["Identity Design", "Campaign Design"],
        deliverables: ["Identity Systems", "Campaign Assets", "Brand Guidelines"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Most of these are three-to-six week engagements. The value is in deciding fast and building a system the client can actually operate after handoff.",
            ],
          },
        ],
        media: [
          { alt: "Client identity marks", span: "half" },
          { alt: "Campaign assets", span: "half" },
        ],
      },
    ],
  },
  {
    slug: "creative-technology",
    titleLines: ["CREATIVE", "TECHNOLOGY."],
    icon: "world",
    tags: ["SOFTWARE", "WEB EXPERIENCES", "AI & AUTOMATION", "INTERACTIVE SYSTEMS"],
    summary:
      "Where the design brief needs code to exist — web experiences, AI tooling, and things that only work once you build them.",
    projects: [
      {
        slug: "portfolio-system",
        name: "PORTFOLIO SYSTEM",
        meta: "Web Experience / Design System",
        year: "2026",
        intro:
          "This site. A content-driven portfolio where the entire design system is one CSS file and every page generates from a single typed content file.",
        role: ["Design", "Development"],
        deliverables: ["Design System", "Next.js Build", "Deployment"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Portfolios rot because updating them is annoying. This one is built so that adding a project is one object in one file — the index page, the case study, the URL, and the prev/next links all follow.",
            ],
          },
        ],
        media: [{ alt: "Portfolio system" }],
      },
      {
        slug: "ai-workflow-tools",
        name: "AI WORKFLOW TOOLS",
        meta: "AI & Automation / Internal Tooling",
        year: "2025",
        intro:
          "Internal tooling that puts AI where it actually removes work — asset generation, copy variation, and the parts of a campaign build that are mechanical.",
        role: ["Product Design", "Development"],
        deliverables: ["Tooling", "Workflow Design"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The useful question was never \"where can we add AI\" — it was which steps in a build are repetitive enough to be worth automating, and which ones lose their value the moment they're automated.",
            ],
          },
        ],
        media: [{ alt: "AI workflow tools" }],
      },
    ],
  },
  {
    slug: "product-development",
    titleLines: ["PRODUCT", "DEVELOPMENT."],
    icon: "cube",
    tags: ["PRODUCT DESIGN", "CONCEPT DEVELOPMENT", "PROTOTYPING", "EXECUTION"],
    summary:
      "Digital products taken from a rough idea to something people can use — interface, system, and build.",
    projects: [
      {
        slug: "product-one",
        name: "PRODUCT ONE",
        meta: "Digital Product / UX & UI",
        year: "2025",
        intro:
          "End-to-end product design and front-end build — information architecture, interface system, and the shipped application.",
        role: ["Product Design", "UX / UI", "Front-end"],
        deliverables: ["Product Design", "Design System", "Front-end Build"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Start with the smallest version that is genuinely useful, ship it, then let real usage decide what gets built next.",
            ],
          },
        ],
        media: [{ alt: "Product interface" }, { alt: "Design system", span: "half" }, { alt: "Components", span: "half" }],
      },
    ],
  },
];

/* ---------- lookups used by the route files ---------- */

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const getProject = (categorySlug: string, projectSlug: string) => {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const index = category.projects.findIndex((p) => p.slug === projectSlug);
  if (index === -1) return undefined;
  return {
    category,
    project: category.projects[index],
    index,
    next: category.projects[(index + 1) % category.projects.length],
  };
};

/** Zero-padded display number, e.g. 0 -> "01". */
export const num = (i: number) => String(i + 1).padStart(2, "0");
