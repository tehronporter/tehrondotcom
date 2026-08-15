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
  /** Path under /public, e.g. "/work/brand-identity/blue-t-shirt/01.jpg". Omit for an empty frame. */
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
  /** Lead paragraph on the case study page. */
  intro: string;
  client?: string;
  role: string[];
  deliverables: string[];
  sections: { heading: string; body: string[] }[];
  media: Media[];
  /** "grid" renders media as a small uniform feed instead of the full/half editorial layout. */
  mediaLayout?: "grid";
  /** Columns for the grid feed. Defaults to 4. */
  mediaColumns?: 3 | 4;
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
        mediaLayout: "grid",
        media: [
          {
            src: "/work/brand-identity/blue-t-shirt/01-mockup-white.png",
            alt: "Type system applied to a white garment mockup",
            caption: "Type system on garment",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/02-mockup-red.png",
            alt: "Type system applied to a red garment mockup",
            caption: "Alternate colorway",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/03-wordmark.png",
            alt: "TSHIRT / BLUE wordmark lockup",
            caption: "Wordmark lockup",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/04-tagline.jpg",
            alt: "“this is a blue t-shirt.” tagline graphic",
            caption: "Tagline graphic",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/05-campaign-mural.jpg",
            alt: "Campaign photo in front of a hand-painted BLUE mural",
            caption: "Campaign imagery",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/06-campaign-portrait.jpg",
            alt: "Campaign portrait wearing the type system",
            caption: "Campaign portrait",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/07-on-set.jpg",
            alt: "Behind the scenes on the campaign shoot",
            caption: "On set",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/08-in-the-wild.jpg",
            alt: "The shirt worn out in the world",
            caption: "In the wild",
          },
        ],
      },
      {
        slug: "cant-buy-respect",
        name: "CAN'T BUY RESPECT",
        meta: "Brand Identity / Apparel",
        intro:
          "Can't Buy Respect is a small apparel line built on one line of type per piece. Its first viral product, a tee that just says Not For Sale, moved before any campaign pushed it.",
        role: ["Identity Design", "Art Direction"],
        deliverables: ["Wordmark", "Type System", "Capsule Apparel"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The hoodie says the brand name straight. The tee took the other route: instead of the full phrase, it just says Not For Sale, a slogan sharp enough to travel on its own. Neither piece needed more than one line of type.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "The tee found its way onto real people, Kendrick Lamar backstage among them, before any campaign pushed it. That is the only proof a slogan like that needs.",
            ],
          },
        ],
        mediaLayout: "grid",
        media: [
          {
            src: "/work/brand-identity/cant-buy-respect/01-not-for-sale-mockup.png",
            alt: "Not For Sale green tee mockup",
            caption: "Not For Sale tee",
          },
          {
            src: "/work/brand-identity/cant-buy-respect/02-kendrick-not-for-sale.png",
            alt: "Kendrick Lamar wearing the Not For Sale tee backstage",
            caption: "Worn backstage",
          },
          {
            src: "/work/brand-identity/cant-buy-respect/03-cant-buy-respect-mockup.png",
            alt: "Can't Buy Respect yellow hoodie mockup",
            caption: "Can't Buy Respect hoodie",
          },
          {
            src: "/work/brand-identity/cant-buy-respect/04-lil-wayne-cant-buy-respect.png",
            alt: "Lil Wayne wearing the Can't Buy Respect hoodie",
            caption: "Worn out",
          },
        ],
      },
      {
        slug: "karl-kani",
        name: "KARL KANI",
        meta: "Apparel Design / Graphic Design",
        intro:
          "Apparel and graphic design for Karl Kani, working inside a brand with decades of history already on the label.",
        role: ["Apparel Design", "Graphic Design"],
        deliverables: ["Apparel Design", "Graphic Design", "Print Graphics"],
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Working inside an established label means the identity is already set. The job was applying it well: graphics that hold up printed on fabric, layouts that read at hangtag size and at poster size.",
            ],
          },
          {
            heading: "OUTCOME",
            body: ["A body of apparel and graphic work that fits the brand's history instead of just repeating it."],
          },
        ],
        mediaLayout: "grid",
        mediaColumns: 3,
        media: [
          {
            src: "/work/brand-identity/karl-kani/01-design-sheet.png",
            alt: "Karl Kani apparel design sheet, navy and red colorway",
            caption: "Design sheet",
          },
          {
            src: "/work/brand-identity/karl-kani/02-design-sheet.png",
            alt: "Karl Kani apparel design sheet, olive and black colorway",
            caption: "Design sheet",
          },
          {
            src: "/work/brand-identity/karl-kani/03-design-sheet.png",
            alt: "Karl Kani apparel design sheet, blue and red colorway",
            caption: "Design sheet",
          },
        ],
      },
      {
        slug: "selected-client-work",
        name: "SELECTED CLIENT WORK",
        meta: "Identity / Campaigns",
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
