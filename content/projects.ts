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
import type { Practice } from "@/content/practices";
import { imageMeta } from "@/lib/images";

/**
 * The single image that represents a project on the home gallery wall.
 * Always one of that project's own images — never borrowed from elsewhere.
 *
 * Intrinsic pixel dimensions are measured from the file by `npm run images`
 * and read out of the manifest, not declared here — they are what `orientation`
 * is derived from, so the frame never has to be told which way up the piece is,
 * and a number that drifts from the file would silently hang it in the wrong
 * moulding. `width`/`height` below are a fallback for an image the pipeline has
 * not seen yet; leaving them out is the normal case.
 */
export type Featured = {
  src: string;
  alt: string;
  /**
   * Escape hatch, normally omitted. Only read when the manifest has no entry
   * for `src` — i.e. an image dropped in since the last `npm run images`.
   */
  width?: number;
  height?: number;
  /** object-position for the crop, e.g. "50% 30%". Defaults to centre. */
  focus?: string;
};

/** A `Featured` with its dimensions resolved — what the wall actually renders. */
export type ResolvedFeatured = Omit<Featured, "width" | "height"> & {
  width: number;
  height: number;
  blurDataURL?: string;
};

export type Media = {
  /** Path under /public, e.g. "/work/brand-identity/blue-t-shirt/01.webp". Omit for an empty frame. */
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

  /* ---- home gallery wall ---------------------------------------------------
     A project hangs on the wall only when `published` is true AND `featured`
     is set. Both are deliberate acts. Nothing reaches the homepage because a
     file happens to sit in a folder or a name appears in this file. */

  /** Keyword filters. A project can belong to several. Stored ALL CAPS, like `Category.tags`. */
  tags?: string[];
  /** One sentence, shown on hover. Falls back to `intro` if absent. */
  shortDescription?: string;
  /** The piece hung on the wall. No featured image, no wall slot. */
  featured?: Featured;
  /** Opt-in. Absent or false keeps the project off the homepage. */
  published?: boolean;
  /** Curated order for the Featured collection. Absent keeps it out. */
  featuredRank?: number;
};

export type Category = {
  slug: string;
  /** Rendered as stacked lines on the home card and category header. */
  titleLines: string[];
  /** One word for the mobile practice pills, where the full label will not fit. */
  shortLabel: string;
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
    shortLabel: "Brand",
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
        published: true,
        featuredRank: 1,
        tags: ["BRAND IDENTITY", "APPAREL", "ART DIRECTION"],
        shortDescription:
          "A complete identity system for an apparel label built around a single garment.",
        featured: {
          src: "/work/brand-identity/blue-t-shirt/05-campaign-mural.webp",
          alt: "Campaign photo in front of a hand-painted BLUE mural",
        },
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
            src: "/work/brand-identity/blue-t-shirt/01-mockup-white.webp",
            alt: "Type system applied to a white garment mockup",
            caption: "Type system on garment",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/02-mockup-red.webp",
            alt: "Type system applied to a red garment mockup",
            caption: "Alternate colorway",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/03-wordmark.webp",
            alt: "TSHIRT / BLUE wordmark lockup",
            caption: "Wordmark lockup",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/04-tagline.webp",
            alt: "“this is a blue t-shirt.” tagline graphic",
            caption: "Tagline graphic",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/05-campaign-mural.webp",
            alt: "Campaign photo in front of a hand-painted BLUE mural",
            caption: "Campaign imagery",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/06-campaign-portrait.webp",
            alt: "Campaign portrait wearing the type system",
            caption: "Campaign portrait",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/07-on-set.webp",
            alt: "Behind the scenes on the campaign shoot",
            caption: "On set",
          },
          {
            src: "/work/brand-identity/blue-t-shirt/08-in-the-wild.webp",
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
        published: true,
        featuredRank: 2,
        tags: ["BRAND IDENTITY", "APPAREL"],
        shortDescription:
          "An apparel line built on one line of type per piece — and a tee that travelled on its own.",
        featured: {
          src: "/work/brand-identity/cant-buy-respect/02-kendrick-not-for-sale.webp",
          alt: "Kendrick Lamar wearing the Not For Sale tee backstage",
        },
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
            src: "/work/brand-identity/cant-buy-respect/01-not-for-sale-mockup.webp",
            alt: "Not For Sale green tee mockup",
            caption: "Not For Sale tee",
          },
          {
            src: "/work/brand-identity/cant-buy-respect/02-kendrick-not-for-sale.webp",
            alt: "Kendrick Lamar wearing the Not For Sale tee backstage",
            caption: "Worn backstage",
          },
          {
            src: "/work/brand-identity/cant-buy-respect/03-cant-buy-respect-mockup.webp",
            alt: "Can't Buy Respect yellow hoodie mockup",
            caption: "Can't Buy Respect hoodie",
          },
          {
            src: "/work/brand-identity/cant-buy-respect/04-lil-wayne-cant-buy-respect.webp",
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
        published: true,
        tags: ["APPAREL", "ART DIRECTION"],
        shortDescription:
          "Apparel and graphic design inside a label with decades of history already on the tag.",
        /* Blue T-Shirt is the other landscape on the wall and takes the default
           heavy ornate moulding — a slim vintage gilt keeps these two apart, and
           suits a white design sheet better than a wide carved frame would. */
        featured: {
          src: "/work/brand-identity/karl-kani/01-design-sheet.webp",
          alt: "Karl Kani apparel design sheet, navy and red colorway",
        },
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
            src: "/work/brand-identity/karl-kani/01-design-sheet.webp",
            alt: "Karl Kani apparel design sheet, navy and red colorway",
            caption: "Design sheet",
          },
          {
            src: "/work/brand-identity/karl-kani/02-design-sheet.webp",
            alt: "Karl Kani apparel design sheet, olive and black colorway",
            caption: "Design sheet",
          },
          {
            src: "/work/brand-identity/karl-kani/03-design-sheet.webp",
            alt: "Karl Kani apparel design sheet, blue and red colorway",
            caption: "Design sheet",
          },
        ],
      },
      {
        slug: "indivisual-threads",
        name: "INDIVISUAL THREADS",
        meta: "Brand Identity / Apparel",
        intro:
          "A full apparel identity for Indivisual Threads, designed from scratch for a client: a spray-can icon and a graffiti-bubble wordmark built to run across a five-colorway capsule of tees, hoodies, and shorts.",
        role: ["Creative Direction", "Identity Design", "Apparel Design"],
        deliverables: ["Wordmark", "Icon Mark", "Type System", "Apparel Mockups"],
        published: true,
        tags: ["BRAND IDENTITY", "APPAREL", "ART DIRECTION"],
        shortDescription:
          "A graffiti-rooted apparel identity, from a spray-can mark to a full five-colorway capsule.",
        /* Can't Buy Respect already holds the default "wide" frame for a square
           piece — "plain" keeps this one from doubling it and suits the flat
           graphic-tee artwork better than a heavier carved moulding would. */
        featured: {
          src: "/work/brand-identity/indivisual-threads/01-red-tee-front.webp",
          alt: "Indivisual Threads spray-can icon on a red tee",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The brief was a streetwear label that needed to look handmade and mass-producible at once. The spray-can icon carries the brand on its own — small enough for a chest hit, bold enough to read from across a room — while the bubble-letter wordmark does the heavy lifting on back prints.",
              "Everything was built to survive a real production run: one mark, one wordmark, and a system for dropping both onto tees, hoodies, and shorts across five colorways without redesigning a thing each time.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "A capsule the client could put into production immediately — consistent across every garment and colorway, with room to keep adding pieces without touching the identity.",
            ],
          },
        ],
        mediaLayout: "grid",
        mediaColumns: 3,
        media: [
          {
            src: "/work/brand-identity/indivisual-threads/01-red-tee-front.webp",
            alt: "Indivisual Threads spray-can icon on a red tee",
            caption: "Red tee, front",
          },
          {
            src: "/work/brand-identity/indivisual-threads/02-red-tee-back.webp",
            alt: "Indivisual Threads wordmark on the back of a red tee",
            caption: "Red tee, back",
          },
          {
            src: "/work/brand-identity/indivisual-threads/03-tee-colorways-blue-black.webp",
            alt: "Indivisual Threads tee mockups in blue and black",
            caption: "Blue & black colorways",
          },
          {
            src: "/work/brand-identity/indivisual-threads/04-tee-colorways-white-red.webp",
            alt: "Indivisual Threads tee mockups in white and red",
            caption: "White & red colorways",
          },
          {
            src: "/work/brand-identity/indivisual-threads/05-shorts-colorways.webp",
            alt: "Indivisual Threads shorts mockups across four colorways",
            caption: "Shorts, four colorways",
          },
          {
            src: "/work/brand-identity/indivisual-threads/06-hoodie-front.webp",
            alt: "Indivisual Threads wordmark on a white hoodie",
            caption: "Hoodie, front",
          },
          {
            src: "/work/brand-identity/indivisual-threads/07-hoodie-back.webp",
            alt: "Indivisual Threads spray-can icon on the back of a white hoodie",
            caption: "Hoodie, back",
          },
          {
            src: "/work/brand-identity/indivisual-threads/08-logo-lockup.webp",
            alt: "Indivisual Threads wordmark lockup",
            caption: "Wordmark lockup",
          },
          {
            src: "/work/brand-identity/indivisual-threads/09-mascot-illustration.webp",
            alt: "Illustrated mascot character spray-painting the Indivisual Threads mark",
            caption: "Mascot illustration",
          },
        ],
      },
      {
        slug: "westside-gunn-saucony",
        name: "WESTSIDE GUNN X SAUCONY",
        meta: "Art Direction / Flyer Design",
        intro:
          "A concept flyer series pairing Westside Gunn's Griselda with a Saucony sneaker collab, styled after vintage lucha libre posters and lotería ephemera.",
        role: ["Art Direction", "Graphic Design"],
        deliverables: ["Campaign Flyers", "Poster Series"],
        published: true,
        featuredRank: 3,
        tags: ["ART DIRECTION", "CONCEPTS"],
        shortDescription:
          "A Griselda x Saucony flyer series art-directed like a stack of vintage lucha libre posters.",
        /* The only portrait piece on the wall so far. Karl Kani already holds
           "vintage" for its landscape sheet — "ornate" instead, which also
           suits the maximalist poster style better than a slim gilt would. */
        featured: {
          src: "/work/brand-identity/westside-gunn-saucony/01-super-flygod.webp",
          alt: "Super Flygod lucha libre flyer for the Griselda x Saucony collab",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Griselda's whole visual world already runs on grime and grit, so the flyers lean into it: sun-faded stock, halftone shading, and the ornate type of a wrestling poster tacked up outside an arena for weeks. Each piece pairs the sneaker with a different piece of lucha libre iconography — the champion's ring walk, the title belt, the final battle.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "A poster series that could hang on a wall or run as a drop announcement without losing the bootleg-poster energy that makes it feel real.",
            ],
          },
        ],
        mediaLayout: "grid",
        mediaColumns: 3,
        media: [
          {
            src: "/work/brand-identity/westside-gunn-saucony/01-super-flygod.webp",
            alt: "Super Flygod lucha libre flyer for the Griselda x Saucony collab",
            caption: "Super Flygod",
          },
          {
            src: "/work/brand-identity/westside-gunn-saucony/02-campeon-sin-limite.webp",
            alt: "Campeón Sin Límite lucha libre flyer for the Griselda x Saucony collab",
            caption: "Campeón sin límite",
          },
          {
            src: "/work/brand-identity/westside-gunn-saucony/03-los-tenis-del-campeon.webp",
            alt: "Los Tenis del Campeón vintage poster for the Griselda x Saucony collab",
            caption: "Los tenis del campeón",
          },
          {
            src: "/work/brand-identity/westside-gunn-saucony/04-batalla-final.webp",
            alt: "Batalla Final vintage poster for the Griselda x Saucony collab",
            caption: "Batalla final",
          },
          {
            src: "/work/brand-identity/westside-gunn-saucony/05-el-ritual-del-campeon.webp",
            alt: "El Ritual del Campeón vintage poster for the Griselda x Saucony collab",
            caption: "El ritual del campeón",
          },
        ],
      },
      {
        slug: "amine-club-banana",
        name: "AMINE CLUB BANANA",
        meta: "Graphic Design / Apparel",
        intro:
          "An all-over banana print and a companion smiley-mascot graphic, built out across a five-piece apparel capsule in three colorways.",
        role: ["Graphic Design", "Apparel Design"],
        deliverables: ["Pattern Design", "Mascot Graphic", "Apparel Mockups", "Colorway System"],
        published: true,
        featuredRank: 4,
        tags: ["APPAREL", "ART DIRECTION"],
        shortDescription:
          "A playful all-over banana print and mascot graphic, built out across three colorways.",
        featured: {
          src: "/work/brand-identity/amine-club-banana/01-black-colorway.webp",
          alt: "Amine Club banana-print apparel capsule, black colorway",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "One repeat pattern and one mascot mark had to carry a full capsule — beanie, crewneck, tie, track jacket, slides — without the print reading as noise at any of those scales, and the smiley banana graphic doing the job a wordmark usually would.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "The same system holds up across three colorways, pink, blue, and black, so the capsule reads as one drop instead of three unrelated ones.",
            ],
          },
        ],
        mediaLayout: "grid",
        mediaColumns: 3,
        media: [
          {
            src: "/work/brand-identity/amine-club-banana/01-black-colorway.webp",
            alt: "Amine Club banana-print apparel capsule, black colorway",
            caption: "Black colorway",
          },
          {
            src: "/work/brand-identity/amine-club-banana/02-pink-colorway.webp",
            alt: "Amine Club banana-print apparel capsule, pink colorway",
            caption: "Pink colorway",
          },
          {
            src: "/work/brand-identity/amine-club-banana/03-blue-colorway.webp",
            alt: "Amine Club banana-print apparel capsule, blue colorway",
            caption: "Blue colorway",
          },
        ],
      },
      {
        slug: "red-panda-academy",
        name: "RED PANDA ACADEMY",
        meta: "Brand Identity / Mascot Design",
        intro:
          "A mascot and mark system for Red Panda Academy — a red panda in a suit, worked into a crest, a wordmark lockup, and a standalone geometric logo, built to cover a stock-club sub-brand without losing the parent identity.",
        role: ["Brand Identity", "Mascot Design", "Logo Design"],
        deliverables: ["Mascot Illustration", "Brand Seal", "Wordmark Lockup", "Logo System"],
        published: true,
        tags: ["BRAND IDENTITY", "ART DIRECTION"],
        shortDescription:
          "A suited red panda mascot built out across a crest, a wordmark lockup, and a standalone geometric mark.",
        /* The other squares on the wall hold "wide" (Can't Buy Respect), "plain"
           (Indivisual Threads), and "ornate" (222 Rings) — "vintage" completes
           the set and suits a crest-and-seal mark better than the rest would. */
        featured: {
          src: "/work/brand-identity/red-panda-academy/01-logo-mark.webp",
          alt: "Red Panda Stock Club geometric logo mark with a stock chart worked into the collar",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The mascot had to hold two registers at once — approachable enough for an academy, sharp enough for a stock club sitting under it. The same panda in a suit carries both: a dapper, walking figure for the parent brand, a seated one holding a money bag for the finance-focused wing.",
              "The geometric mark strips it down further, folding a stock chart into the shape of the panda's own collar so the finance angle still reads at icon size, with no suit or money bag left to do the work.",
            ],
          },
        ],
        mediaLayout: "grid",
        media: [
          {
            src: "/work/brand-identity/red-panda-academy/01-logo-mark.webp",
            alt: "Red Panda Stock Club geometric logo mark with a stock chart worked into the collar",
            caption: "Logo mark",
          },
          {
            src: "/work/brand-identity/red-panda-academy/02-brand-seal.webp",
            alt: "Red Panda Academy crest seal, mascot holding a money bag",
            caption: "Brand seal",
          },
          {
            src: "/work/brand-identity/red-panda-academy/03-stock-club-lockup.webp",
            alt: "Red Panda Stock Club wordmark lockup with a dapper walking mascot",
            caption: "Wordmark lockup",
          },
          {
            src: "/work/brand-identity/red-panda-academy/04-mascot-illustration.webp",
            alt: "Standalone vintage dapper red panda mascot illustration",
            caption: "Mascot illustration",
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
    shortLabel: "Technology",
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
    shortLabel: "Product",
    titleLines: ["PRODUCT", "DEVELOPMENT."],
    icon: "cube",
    tags: ["PRODUCT DESIGN", "CONCEPT DEVELOPMENT", "PROTOTYPING", "EXECUTION"],
    summary:
      "Physical products taken from a sketch to something real — object, print, and a run you can hold.",
    projects: [
      {
        slug: "tomorrow-is-yesterday",
        name: "TOMORROW IS YESTERDAY",
        meta: "Product Design / Concept Development",
        intro:
          "A product concept built around one idea — that tomorrow is yesterday — carried across two objects: a sun-and-moon pair of shades and a set of sky-and-flower umbrellas, taken from sketch to a real production run.",
        role: ["Concept Development", "Product Design", "3D Design"],
        deliverables: ["Sunglasses Design", "Umbrella Print Design", "Production Run"],
        published: true,
        featuredRank: 5,
        tags: ["PRODUCT DESIGN", "CONCEPTS"],
        shortDescription:
          "One concept, two objects — sun-and-moon shades and sky-and-flower umbrellas, sketch to production.",
        /* Blue T-Shirt already holds the default "ornate" for a landscape piece,
           and Karl Kani holds "vintage" — plain keeps this one apart from both
           and suits a product concept better than a heavier carved moulding. */
        featured: {
          src: "/work/product-development/tomorrow-is-yesterday/05-umbrellas-instore.webp",
          alt: "Sky and sunflower Tomorrow Is Yesterday umbrellas on a retail shop floor",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The idea is the duality: a sun lens and a moon lens on one frame, a sky print and a flower print across a pair of umbrellas — the same day looked at from both ends. The umbrella canopy carries it literally, with TOMORROW spelled across its own panels.",
              "Each object had to work on its own and as half of the pair, which is what kept the sketch, the render, and the finished print all pointing at the same shape.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "The umbrellas went further than a concept — a full production run, photographed on the shop floor next to the rest of the line. The shades are the same idea one step behind them.",
            ],
          },
        ],
        mediaLayout: "grid",
        media: [
          {
            src: "/work/product-development/tomorrow-is-yesterday/01-tiy-sketch.webp",
            alt: "Hand-drawn sketch labeled Tomorrow is Yesterday shades",
            caption: "Concept sketch",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/02-shades-render.webp",
            alt: "3D render of the sun-and-moon lens shades",
            caption: "Shades render",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/03-shades-lifestyle.webp",
            alt: "Sun-and-moon shades worn, close portrait",
            caption: "Worn",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/04-shades-lifestyle-alt.webp",
            alt: "Sun-and-moon shades worn, alternate angle",
            caption: "Worn, alternate",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/09-shades-lifestyle-grad.webp",
            alt: "Sun-and-moon shades worn at a University of Michigan graduation shoot",
            caption: "Graduation shoot",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/10-shades-lifestyle-grad-alt.webp",
            alt: "Sun-and-moon shades worn at a University of Michigan graduation shoot, alternate angle",
            caption: "Graduation shoot, alternate",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/05-umbrellas-instore.webp",
            alt: "Sky and sunflower umbrellas on a retail shop floor",
            caption: "In store",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/06-umbrella-artwork.webp",
            alt: "Umbrella canopy print artwork, sky and sunflower panels with TOMORROW lettering",
            caption: "Print artwork",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/07-umbrellas-production.webp",
            alt: "A full production run of sky and sunflower umbrellas",
            caption: "Production run",
          },
          {
            src: "/work/product-development/tomorrow-is-yesterday/08-umbrella-lifestyle.webp",
            alt: "Sky umbrella carried on the street",
            caption: "Out in the world",
          },
        ],
      },
      {
        slug: "thank-you-dilla",
        name: "THANK YOU DILLA!",
        meta: "Apparel Design / Tribute",
        intro:
          "A tribute to J Dilla built the same way he worked — start with what's in front of you. Thank You Dilla began as a phrase spelled out in real glazed donuts, a nod to Donuts, before it ever became a graphic.",
        role: ["Concept Development", "Graphic Design", "Apparel Design"],
        deliverables: ["Typography System", "Installation", "Apparel Design"],
        published: true,
        tags: ["APPAREL", "CONCEPTS"],
        shortDescription:
          "A J Dilla tribute spelled out in real donuts first, then carried onto apparel in two colorways.",
        /* The other landscape pieces on the wall hold "ornate" (Blue T-Shirt),
           "vintage" (Karl Kani), and "plain" (Tomorrow Is Yesterday) — "wide"
           finishes the set and gives this one enough substance for a flat lay. */
        featured: {
          src: "/work/product-development/thank-you-dilla/02-donut-typography.webp",
          alt: "THANK YOU DILLA! spelled out in glazed donuts",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The type had to be made, not set — every letter is a donut, arranged and shot before it ever became a file. That physical first draft is what gives the final graphic its texture; nothing about it reads as a font.",
              "From there it dropped straight onto apparel in both colorways, on white and on black, with the same donut-built lettering doing all the work.",
            ],
          },
        ],
        mediaLayout: "grid",
        media: [
          {
            src: "/work/product-development/thank-you-dilla/01-thank-you-dilla-lifestyle.webp",
            alt: "Thank You Dilla donut lettering next to J Dilla and Slum Village vinyl",
            caption: "With the records that inspired it",
          },
          {
            src: "/work/product-development/thank-you-dilla/02-donut-typography.webp",
            alt: "THANK YOU DILLA! spelled out in glazed donuts",
            caption: "Donut typography",
          },
          {
            src: "/work/product-development/thank-you-dilla/03-tee-white.webp",
            alt: "Thank You Dilla graphic on a white tee",
            caption: "White tee",
          },
          {
            src: "/work/product-development/thank-you-dilla/04-tee-black.webp",
            alt: "Thank You Dilla graphic on a black tee",
            caption: "Black tee",
          },
        ],
      },
      {
        slug: "222-rings",
        name: "222 RINGS",
        meta: "Product Design / 3D Design",
        intro:
          "A two-finger ring where the numerals are the band — 222, the angel number, printed as three linked rings that read as the digits themselves rather than a design stamped onto them.",
        role: ["Product Design", "3D Design"],
        deliverables: ["3D Model", "Prototype", "Colorway System"],
        published: true,
        featuredRank: 6,
        tags: ["PRODUCT DESIGN", "CONCEPTS"],
        shortDescription:
          "A two-finger ring where the numerals themselves are the band — 222, printed in three colorways.",
        /* The other square piece on the wall, Can't Buy Respect, holds the
           default "wide"; Indivisual Threads already took "plain" — "ornate"
           suits the jewelry scale better than either would. */
        featured: {
          src: "/work/product-development/222-rings/01-222-rings-worn.webp",
          alt: "222 rings in red, yellow, and blue worn across three fingers",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The number had to be the structure, not a stamp on top of one — each ‘2’ is its own ring, fused to the next, so the piece only reads correctly worn across three fingers at once.",
              "Modeled and printed across three colorways to test how the form held up in each: whether the curves stayed legible at ring scale once the render became something you could actually put on.",
            ],
          },
        ],
        mediaLayout: "grid",
        media: [
          {
            src: "/work/product-development/222-rings/01-222-rings-worn.webp",
            alt: "222 rings in red, yellow, and blue worn across three fingers",
            caption: "Worn, three colorways",
          },
          {
            src: "/work/product-development/222-rings/02-222-ring-yellow.webp",
            alt: "222 ring render, yellow colorway",
            caption: "Yellow",
          },
          {
            src: "/work/product-development/222-rings/03-222-ring-red.webp",
            alt: "222 ring render, red colorway",
            caption: "Red",
          },
          {
            src: "/work/product-development/222-rings/04-222-ring-blue.webp",
            alt: "222 ring render, blue colorway",
            caption: "Blue",
          },
          {
            src: "/work/product-development/222-rings/05-222-ring-yellow-face.webp",
            alt: "222 ring render, yellow colorway, numeral face",
            caption: "Yellow, numeral face",
          },
          {
            src: "/work/product-development/222-rings/06-222-ring-red-face.webp",
            alt: "222 ring render, red colorway, numeral face",
            caption: "Red, numeral face",
          },
          {
            src: "/work/product-development/222-rings/07-222-ring-blue-face.webp",
            alt: "222 ring render, blue colorway, numeral face",
            caption: "Blue, numeral face",
          },
        ],
      },
      {
        slug: "apple-retail-merch",
        name: "APPLE RETAIL MERCH",
        meta: "Product Design / Employee-Led Redesign",
        client: "Apple Inc.",
        intro:
          "While working at Apple as a Technical Expert, a color complaint turned into a proposal that shipped. The store shirts ran what staff called skittle green and Christmas red — an internal post pitched two calmer replacements, and Apple produced and shipped exactly what got posted.",
        role: ["Concept Development", "Color & Product Design"],
        deliverables: ["Colorway Proposal", "Product Mockups", "Company-Wide Production"],
        published: true,
        tags: ["PRODUCT DESIGN", "CONCEPTS"],
        shortDescription:
          "An employee color-palette pitch for Apple retail merch that Apple actually produced and shipped.",
        /* The other portrait piece, Amine Club Banana, already holds the
           default "vintage"; Westside Gunn x Saucony holds "ornate" — "plain"
           keeps this one apart and suits a corporate colorway pitch better
           than either would. */
        featured: {
          src: "/work/product-development/apple-retail-merch/01-shirt-forest-green.webp",
          alt: "Forest green Apple retail shirt, one of the two new colorways proposed to replace the old palette",
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "The existing shirts ran a green and a red loud enough that staff had nicknamed them skittle green and Christmas red. The proposal was two calmer replacements — a forest green and a maroon — mocked up next to the navy everyone already liked, and posted to Apple's internal system the same way any employee's idea gets posted: no design team, no review cycle, just the case for it.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "The post went viral inside the company, and Apple produced the colorways as designed — shipped to stores and worn by the people who'd been asking for the change. One of the few projects here where the client is the company you clocked into.",
            ],
          },
        ],
        mediaLayout: "grid",
        mediaColumns: 3,
        media: [
          {
            src: "/work/product-development/apple-retail-merch/01-shirt-forest-green.webp",
            alt: "Forest green Apple retail shirt mockup, the proposed replacement colorway",
            caption: "Forest green",
          },
          {
            src: "/work/product-development/apple-retail-merch/02-shirt-maroon.webp",
            alt: "Maroon Apple retail shirt mockup, the proposed replacement colorway",
            caption: "Maroon",
          },
          {
            src: "/work/product-development/apple-retail-merch/03-shirt-navy.webp",
            alt: "Navy Apple retail shirt, the colorway kept from the original lineup",
            caption: "Navy, kept as-is",
          },
          {
            src: "/work/product-development/apple-retail-merch/04-hat-black.webp",
            alt: "Black Apple retail hat mockup with rainbow logo embroidery",
            caption: "Black hat",
          },
          {
            src: "/work/product-development/apple-retail-merch/05-hat-navy.webp",
            alt: "Navy Apple retail hat mockup",
            caption: "Navy hat",
          },
          {
            src: "/work/product-development/apple-retail-merch/06-hat-white.webp",
            alt: "White Apple retail hat mockup",
            caption: "White hat",
          },
        ],
      },
    ],
  },
];

/* ---------- what is actually live ---------- */

/**
 * The one test for "this project is public": you have said so, and there is an
 * image to show for it. Both halves are load-bearing and independent —
 * `published` is your decision, `featured` is whether the work exists yet.
 */
export const isLive = (project: Project) => project.published === true && Boolean(project.featured?.src);

/**
 * Categories that have at least one live project, carrying only those projects.
 *
 * Everything that describes the site to the outside world is built from this
 * rather than from `categories`: the static params, the sitemap, and the
 * practice list in the sidebar. Reading the raw array instead is what let three
 * image-less placeholder projects get prerendered and indexed, and what left
 * Creative Technology routable with no way to navigate to it.
 */
export const liveCategories = (): Category[] =>
  categories
    .map((category) => ({ ...category, projects: category.projects.filter(isLive) }))
    .filter((category) => category.projects.length > 0);

/**
 * The practices offered in the sidebar and the mobile filter pills.
 *
 * Derived rather than declared, so a practice can never appear with nothing
 * behind it and can never go missing once it has work — the failure the
 * hand-maintained list had in both directions at once.
 *
 * Returned as plain data so it can be handed to the client components that
 * render it. They must not import this module directly: it reaches the image
 * manifest through lib/images, and a value import from a client component would
 * pull all ~17KB of that into the browser bundle.
 */
export const livePractices = (): Practice[] =>
  liveCategories().map((category) => ({
    slug: category.slug,
    label: titleCaseLabel(categoryLabel(category)),
    shortLabel: category.shortLabel,
  }));

/**
 * `/work/<category>` and `/work/<category>/<project>` -> the label the
 * toolbar's breadcrumb shows for that level, for every live route at once.
 *
 * Flat rather than nested, because the toolbar only ever needs the one entry
 * matching its current URL — a tree it would have to walk to get there is
 * structure this has no use for.
 */
export const breadcrumbLabels = (): Record<string, string> =>
  Object.fromEntries(
    liveCategories().flatMap((category) => [
      [`/work/${category.slug}`, titleCaseLabel(categoryLabel(category))],
      ...category.projects.map(
        (project) => [`/work/${category.slug}/${project.slug}`, project.name] as const,
      ),
    ]),
  );

/* ---------- lookups used by the route files ---------- */

/**
 * A category by slug, from the live set only.
 *
 * Deliberately not `categories.find(...)`. `generateStaticParams` no longer
 * prerenders the empty ones, but `dynamicParams` defaults to true — so without
 * this an unpublished category still rendered on demand at request time, which
 * is exactly the URL the prerender list was changed to stop serving. Returning
 * undefined is what turns it into the 404 it should be.
 */
export const getCategory = (slug: string) => liveCategories().find((c) => c.slug === slug);

/** A category's stacked title lines flattened to one label, e.g. "BRAND IDENTITY". */
export const categoryLabel = (category: Category) => category.titleLines.join(" ").replace(".", "");

/** "BRAND IDENTITY" -> "Brand Identity", for the places the caps would shout. */
const titleCaseLabel = (label: string) =>
  label
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * A project and its neighbours, from the live set only — so `next` can never
 * hand a visitor to a placeholder, and an unpublished slug 404s rather than
 * rendering on demand.
 */
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

/* ---------- the project browser ---------- */

/** A project flattened out of its category, ready for the browser. */
export type GalleryPiece = {
  slug: string;
  name: string;
  href: string;
  meta: string;
  categorySlug: string;
  categoryLabel: string;
  globalIndex: number;
  featuredRank?: number;
  tags: string[];
  shortDescription: string;
  featured: ResolvedFeatured;
};

/**
 * Measured dimensions win over declared ones; a piece with neither is treated
 * as square, which is the orientation that crops the least badly when we are
 * guessing. Resizing preserves aspect ratio, so re-running the image pipeline
 * can never move a piece into a different frame.
 */
const resolveFeatured = (featured: Featured): ResolvedFeatured => {
  const meta = imageMeta(featured.src);
  return {
    ...featured,
    width: meta?.width ?? featured.width ?? 1000,
    height: meta?.height ?? featured.height ?? 1000,
    blurDataURL: meta?.blurDataURL,
  };
};

/**
 * Every published, featured project, in the order it appears in this file.
 * The two gates are independent on purpose: `published` is your decision that
 * the work is public, `featured` is the existence of an image to show for it.
 */
export const galleryProjects = (): GalleryPiece[] =>
  categories
    .flatMap((category) =>
      category.projects
        .filter((project) => project.published === true && project.featured?.src)
        .map((project) => ({ category, project })),
    )
    .map(({ category, project }, globalIndex) => ({
      slug: project.slug,
      name: project.name,
      href: `/work/${category.slug}/${project.slug}`,
      meta: project.meta,
      categorySlug: category.slug,
      categoryLabel: categoryLabel(category),
      globalIndex,
      featuredRank: project.featuredRank,
      tags: project.tags ?? [],
      shortDescription: project.shortDescription ?? project.intro,
      featured: resolveFeatured(project.featured as Featured),
    }));

export type ProjectCollection = "work" | "featured" | "recent";

/** Minimal, serializable shape passed from Server Components to the project browser. */
export type BrowserProject = Omit<GalleryPiece, "tags">;

const browserShape = ({ tags: _tags, ...project }: GalleryPiece) => project;

/** Project sets used by the app-like portfolio browser. */
export const collectionProjects = (collection: ProjectCollection): BrowserProject[] => {
  const all = galleryProjects();
  if (collection === "featured") {
    return all
      .filter((project) => project.featuredRank !== undefined)
      .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))
      .map(browserShape);
  }
  if (collection === "recent") return all.slice(0, 6).map(browserShape);
  return all.map(browserShape);
};
