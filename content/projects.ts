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

export type BrowserPresentation = {
  cover?: {
    fit?: "cover" | "contain";
    position?: string;
    scale?: number;
    background?: string;
  };
  /**
   * NOT CURRENTLY RENDERED. The folder used to be drawn in CSS, with loose
   * sheets peeking out of it that swapped on hover; the folder is now a
   * photograph of a real one and has no sheets to swap. Kept because these
   * are hand-picked second images and the choice is worth more than the nine
   * lines it costs — but nothing reads it, and it is no longer resolved into
   * the payload the browser ships.
   */
  hoverPreview?: false | { srcs: [string] | [string, string] };
  /** Defaults to the featured image. */
  listPreview?: string;
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
  /** A body entry is normally a paragraph. `{ quote: "…" }` sets an isolated
      line — one already standing on its own in the writing — in larger
      display type instead of shrinking it to paragraph size. */
  sections: { heading: string; body: (string | { quote: string })[] }[];
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
  /** Optional, homepage-only art direction. All project content remains above. */
  browser?: BrowserPresentation;
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
      "Identity systems built to hold up in the real world: on garments, in feeds, and under pressure.",
    projects: [
      {
        slug: "blue-t-shirt",
        name: "BLUE T-SHIRT",
        meta: "Brand Identity / Creative Direction",
        intro:
          "G. Perico had the name, Blue T-Shirt, and no idea what it should look like. After months of chasing his ideas, I gave him the simplest one in the room: a Crip legend's clothing line, printed all red, named Blue T-Shirt.",
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
        browser: {
          hoverPreview: { srcs: ["/work/brand-identity/blue-t-shirt/06-campaign-portrait.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "I was introduced to G. Perico through a mutual associate in LA. He told me G. Perico had just signed to Roc Nation and needed someone to help with his branding and design work. He was prepping his new album and needed to build momentum. When we started working together, he'd just left his old group, So Way Out. He was on a new label, looking for a fresh start.",
              "I made his song cover artwork, tour flyers, even helped redesign a store he owned in South Central. One of the most pivotal moments of running his brand was the drop of Blue T-Shirt, the clothing line.",
              "G. Perico and I went back and forth for months on designs. He had the \"Blue T-Shirt\" name but he wasn't sure how it would, could, or should look, lol. I tried everything. He had me making blue bird logos, different fonts, try this idea, try that icon. We tried what felt like everything under the sun. Finally, after weeks of trying his ideas, I decided to take matters into my own hands….",
              "My favorite thing to do with design is to SIMPLIFY. What is the simplest version of what we're working on? What does it look like if I strip EVERYTHING? So I did that. The epiphany moment for me came from one of my favorite movies, Liar Liar. As a kid, I always thought the scene with the blue pen was hilarious. He can't tell a lie…. He's holding a blue pen…. Trying his hardest to say it was a RED PEN. Super silly scene, Jim Carrey at his finest. (If you haven't seen it, look it up.)",
              { quote: "So ya, that was it. THE COLOR OF THIS PEN IS……BLUE." },
              "That's what inspired me to just type \"THIS IS A BLUE T-SHIRT\" in the simplest font I could imagine. The true genius was in understanding G. Perico's background: he was a Crip gang member, infamous in LA. Blue, Blue, Blue. Everything.",
              "And I love contrast. Opposites. Shock value. What's more shocking than a Crip gang member starting an all-red clothing line, but the name of the clothing line is Blue T-Shirt? GENIUS.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "I pitched him the idea and he loved it, we got some samples printed up. Streets of LA went crazy. Internet went wild for it. Instantly viral.",
              "So viral in fact, Coach decided to steal my design. (I'm not going to get into it, just do your own research.)",
              "And that's the story behind the Blue T-Shirt brand design.",
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
          "Chase N. Cashe believed in me as a designer before I had the portfolio to prove it. Can't Buy Respect became the place I learned to actually run a clothing brand, and the Not For Sale tee ended up on Lil Wayne, Kendrick Lamar, and Jermaine Dupri.",
        role: ["Identity Design", "Art Direction"],
        deliverables: ["Wordmark", "Type System", "Capsule Apparel"],
        published: true,
        featuredRank: 2,
        tags: ["BRAND IDENTITY", "APPAREL"],
        shortDescription:
          "An apparel line built on one line of type per piece, and a tee that travelled on its own.",
        featured: {
          src: "/work/brand-identity/cant-buy-respect/02-kendrick-not-for-sale.webp",
          alt: "Kendrick Lamar wearing the Not For Sale tee backstage",
        },
        browser: {
          /* The garment is the work, and it sits in the upper third of a
             full-length backstage frame. Centred, the folder cropped to his
             knees and the graphic never appeared at thumbnail size. */
          cover: { position: "54% 30%", scale: 1.2 },
          hoverPreview: { srcs: ["/work/brand-identity/cant-buy-respect/04-lil-wayne-cant-buy-respect.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Can't Buy Respect is a clothing line by Grammy Award-winning producer Chase N. Cashe. Chase was one of the first people to really believe in me as a designer. He trusted me early: before I had a huge portfolio, before I had all the experience, before I had proof that I could do this at a high level. He just believed in the work. And that meant everything to me.",
              "One of the staple pieces I designed for the brand was the NOT FOR SALE T-shirt. Simple message. Simple type. Strong color. That was it. And honestly, that was the whole point.",
              "I've always believed people severely overthink merch. Sometimes the best thing you can do is ask:",
              { quote: "What are we actually trying to say?" },
              "Then say it as clearly as possible. Don't bury the message under a bunch of graphics. Don't clutter it. Don't try to prove how \"creative\" you are. Just make the statement hit. That was the design philosophy behind a lot of the work we did for Can't Buy Respect. Simple. Bold. Less is more.",
              "Then something crazy started happening. I started seeing the clothes everywhere: on celebrities, on TV, backstage, online. Lil Wayne. Kendrick Lamar. Jermaine Dupri. Huge artists were wearing something I designed.",
              "That was one of the first times in my career where I really got to see the reach of design. You can sit at a computer making something that feels small…. then suddenly Kendrick Lamar is wearing it. That changes the way you think about the work.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "But this project was bigger than the shirts. Chase became an amazing mentor to me. Through working with him, I learned the ins and outs of actually manufacturing a clothing brand. I learned about production, sourcing, making samples, getting pieces into the right hands, and understanding how important relationships are.",
              "I learned that a great product is only part of the equation. You also have to know how to move it. How to network. How to create moments. How to get people talking. How to put the product in places where culture can actually touch it. A lot of what I know about fashion, branding, and moving through creative spaces came from that period of my life.",
              "I owe so much of my career to Chase. He gave me an opportunity to showcase my talent before a lot of people knew who I was. He believed in me early. He trusted my ideas. And he gave me room to grow. He'll forever be my brother, and I'll forever be grateful for that.",
              "Sometimes a project gives you a portfolio piece. Sometimes it gives you a career.",
              { quote: "This one gave me both." },
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
          "I spent time in Karl Kani's studio working as a design assistant: tech packs, color variations, product mockups, at the speed of a machine. One line from Kani has stuck with me ever since: don't make the simple, complicated.",
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
        browser: {
          /* A full technical flat sheet holds fifteen garments and their line
             numbers. Whole, it is grey noise at folder size — nothing in it is
             legible until the frame is on a few pieces. This crop takes the
             colourway block: the orange KANI SPORT hood and the red and navy
             tracksuits. The sheets are shown entire on the case study. */
          cover: { position: "24% 74%", scale: 2.45 },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Working with Karl Kani was a great experience. I was brought into his studio in LA to work basically as a fashion design assistant. It was one of my first real chances to see the inside of a fashion brand operating at that scale. I learned A LOT in that studio, and I still think about that experience almost every week when I'm working with design clients now.",
              "There was a lot of pressure to turn around ideas, graphics, and fashion tech packs with extreme speed. Working inside that studio, I learned that done is always better than perfect. Communicate often. Move fast. And of course, one of the greatest quotes I got directly from Karl Kani:",
              { quote: "DON'T MAKE THE SIMPLE, COMPLICATED." },
              "Once I really understood that, things started flowing. I was producing tech packs and color palette variations faster than ever before.",
              "I learned that when you're working directly with a CEO, you have to move extremely fast. It's usually better to just get the idea down on paper and get a draft back in front of them as quickly as possible. Let them react. Let them make changes. Let the project keep moving. Waiting around trying to make something \"perfect\" before anybody sees it can actually slow the whole machine down.",
              "And that was probably one of my biggest lessons from working there: it really was a machine. I got to see how project management, communication, timelines, and budgets become some of the biggest factors when you're operating a fashion company at that scale. Designing cool clothes was obviously important, but there was so much more happening behind the scenes. You're not operating a little mom-and-pop shop. You're operating a design machine. The briefs had to be organized and detailed because your work might get passed down the assembly line to the next three employees after you. Everybody needed to understand what was happening.",
              "I also learned something important about confidence. As a designer, you have to have confidence in what you know and what you do. But you also need enough self-awareness to know what you DON'T know, and when to lean on the expertise of the people around you to get the best result.",
              "I spent some of my time in Kani's studio producing video content for social media. But the bulk of my time? I was basically a graphic design MACHINE. Logos. Color variations. Tech packs. Product mockups. Material testing. Be ready to get a text in the middle of the night with a new idea, then show up the next day with that idea visualized and ready to present to the team. And be ready to adjust at a moment's notice: maybe you made the dark colorway, but now the team wants to see it light. Cool.",
              "Eventually I learned to anticipate moments like that. Instead of bringing one version, I started thinking ahead about the questions I might get, the changes they might ask for, and the obstacles that could come up. I wanted to show up already prepared.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "Working in fashion at Karl Kani took my design work to another level. A much more professional level. It taught me how to move faster, communicate better, think beyond the individual design, and understand how creative work actually moves through a large company.",
              "And years later, I still hear Karl's voice in my head sometimes:",
              { quote: "DON'T MAKE THE SIMPLE, COMPLICATED." },
            ],
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
          "This clothing brand was designed for an entrepreneur in Texas who wanted something original: graffiti, hand-drawn illustration, that bad-kid troublemaker energy. Once we found the personality, less was more: one wordmark, one icon, a few loud colors.",
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
        browser: {
          /* Contained, the tee floated small inside its own white studio
             margin and the folder read as mostly empty. Cropped to the chest
             hit instead, the red fills the frame and the mark is the subject. */
          cover: { position: "50% 40%", scale: 1.5 },
          hoverPreview: { srcs: ["/work/brand-identity/indivisual-threads/02-red-tee-back.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "This clothing brand was designed for an entrepreneur in Texas who wanted something original. The direction was pretty loose in the beginning, but we knew we wanted to lean into graffiti, hand-drawn illustration, and that \"bad kid / troublemaker\" energy. Not polished. Not corporate. Not too clean.",
              "We went back and forth for a while on the logo, characters, colors, and overall personality until we finally landed on something that felt right. And like usual….",
              { quote: "Less was more." },
              "The final identity came down to a really simple hand-drawn wordmark, a spray-can icon, a few bold colorways, and some character illustrations that felt like they belonged in the same world. Red. Blue. Black. White. Yellow. Simple colors, but enough contrast to make everything hit.",
              "I wanted the graphics to feel like somebody could have drawn them in a notebook, on a wall, or on the back of a school desk. A little messy. A little rebellious. A little immature in the best way.",
              "Once the visual language was established, it became really easy to spread across the collection. T-shirts, hoodies, shorts, logos, mascots. Everything felt connected without needing to overdesign every single piece.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "This was a pretty quick project, but I loved how it turned out.",
              "Sometimes a project doesn't need some huge complicated strategy.",
              { quote: "You just find the personality. Make a few strong decisions. And let the design do the rest." },
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
          "I was living in Guadalajara when Westside Gunn was gearing up for his first Saucony collab, and I'd just been to my first Lucha Libre show. Instead of a clean sneaker campaign, I built a fake championship universe around the shoe, bootleg posters and all.",
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
        browser: { hoverPreview: false },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "I was living in Guadalajara, Mexico when I worked on this project. Westside Gunn was preparing for his first sneaker collaboration with Saucony.",
              "If you know anything about Westside Gunn, you know wrestling has always been a HUGE part of his world. Not just something he references here and there. The characters, the drama, the old wrestling posters, the typography, the championship belts, all of it has been woven into the Griselda aesthetic for years.",
              "And weirdly enough, at the exact same time, I had just gone to my first Lucha Libre show in Guadalajara. Perfect timing.",
              "I remember sitting there looking around at all the masks, ridiculous costumes, hand-painted signs, bright colors, cheap printed posters…. Everything felt loud. Everything felt slightly bootleg. Everything felt AMAZING. And because I was actually living in Mexico, I was seeing a version of wrestling culture that felt completely different from American WWE nostalgia.",
              "That became the idea. Instead of designing another clean sneaker campaign, I wanted to make the Saucony shoe feel like it had entered the world of Mexican wrestling. Like Westside Gunn had his own luchador. And the sneaker was the championship belt.",
              "So I started looking at old Lucha Libre posters, Mexican boxing flyers, lottery cards, hand-painted signage, and cheap event advertisements: stuff that wasn't necessarily \"good graphic design\" in the traditional sense. Sometimes the type was way too big. Sometimes there were 14 things fighting for your attention. Sometimes the colors made absolutely no sense. But somehow…. IT WORKED.",
              { quote: "That chaos was the language." },
              "So I leaned into it. I created this imaginary wrestling universe around the shoe: LUCHA LIBRE. CAMPEÓN. BATALLA FINAL. EL RITUAL DEL CAMPEÓN. Every poster became a different piece of this fake championship story. One showed the wrestler. One made the sneaker itself the champion. One became the big final battle. It almost felt like I was advertising matches that never actually happened. And that was probably my favorite part.",
              "I wasn't trying to make a sneaker ad that looked like a sneaker ad. I wanted somebody walking past one of these posters to look twice and think: Wait…. is this a real lucha libre event? Then realize they're looking at a Saucony.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "That project reminded me how much my environment affects my design work. I was in Guadalajara. I had just experienced lucha libre in person. Westside Gunn already had this deep connection to professional wrestling. And somehow all three things met in the middle.",
              "That's usually where my favorite ideas come from anyway. Not sitting at a desk searching Pinterest for \"cool poster inspiration.\" Just living somewhere. Seeing something. Then realizing….",
              { quote: "These two worlds belong together." },
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
        name: "AMINÉ / CLUB BANANA",
        meta: "Graphic Design / Apparel",
        intro:
          "I met Aminé at a sneaker pop-up in Portland, told him I was a designer, and asked if I could send him some ideas for Club Banana. He said sure. That was enough for me. I built a full clothing capsule around one pattern and one face.",
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
        browser: {
          cover: { position: "50% 32%" },
          hoverPreview: { srcs: ["/work/brand-identity/amine-club-banana/02-pink-colorway.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "I met Aminé at a sneaker pop-up he hosted in Portland, Oregon. We talked for a little bit, I told him I was a designer, and eventually I asked if I could send him some ideas for Club Banana, his clothing brand.",
              "He basically said:",
              { quote: "Sure. Send me some mockups." },
              "That was enough for me.",
              "Club Banana already had such a strong visual language: bright colors, bananas, humor, fashion, and this playful personality that feels very connected to Aminé himself. The banana isn't just some random graphic either. It has followed him since the early days of his career and eventually became one of the most recognizable symbols around his brand.",
              "So I didn't want to overthink it. I made a simple repeating banana pattern, then created a smiley face where the banana became the mouth. That was basically the whole idea. Simple. Bold. Different. Just my style.",
              "From there I built it into a small clothing system with sweaters, beanies, pants, and accessories in a few different colorways: black and yellow, blue and yellow, pink and yellow.",
              "The goal wasn't to reinvent Club Banana. It was more like: how far can I take one really simple idea? One banana pattern. One face. A few colors. And suddenly it starts to feel like a full little collection.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "Sometimes that's my favorite kind of design anyway.",
              { quote: "You don't need 100 ideas. You just need one good one that can stretch." },
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
          "I created these logo concepts for Red Panda Academy, Ian Dunlap's investing education platform under Earn Your Leisure. The name already had personality. I just had to find out how much of it a red panda in a suit could carry.",
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
        browser: {
          /* The lockup carries the wordmark under the mark, and the card's own
             title already says the name — so the folder shows the mark alone,
             at a size where the panda actually reads. */
          cover: { position: "50% 36%", scale: 1.5 },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "I created these logo concepts for Red Panda Academy, the investing and stock market education platform built by Ian Dunlap and closely tied to the Earn Your Leisure community. The brand already had a strong name and personality, so I wanted to explore what it could look like if the visual identity leaned harder into that.",
              "The obvious place to start was the panda. But I didn't want it to feel like a cute tech startup mascot. The audience was learning about investing, building wealth, and taking the stock market seriously, so the character needed to feel confident, sharp, and a little aggressive.",
              "I explored a few different directions. One was a clean geometric red panda mark that could work almost anywhere. The others leaned more into an old-school finance club / collegiate mascot feeling. Suit. Money bag. Big personality. Almost like the mascot for a fictional Wall Street university.",
              "The goal was really just to take the name Red Panda Academy and see how much personality I could pull out of it without overcomplicating the idea.",
              { quote: "Sometimes the name already gives you everything you need." },
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
      "Physical products taken from a sketch to something real: object, print, and a run you can hold.",
    projects: [
      {
        slug: "tomorrow-is-yesterday",
        name: "TOMORROW IS YESTERDAY",
        meta: "Product Design / Concept Development",
        intro:
          "Tomorrow Is Yesterday started as a personal design exercise in Long Beach. My son helped name it, then spent the whole summer with me building it. We designed, produced, and sold everything ourselves, and it all sold out.",
        role: ["Concept Development", "Product Design", "3D Design"],
        deliverables: ["Sunglasses Design", "Umbrella Print Design", "Production Run"],
        published: true,
        featuredRank: 5,
        tags: ["PRODUCT DESIGN", "CONCEPTS"],
        shortDescription:
          "One concept, two objects: sun-and-moon shades and sky-and-flower umbrellas, sketch to production.",
        /* Blue T-Shirt already holds the default "ornate" for a landscape piece,
           and Karl Kani holds "vintage" — plain keeps this one apart from both
           and suits a product concept better than a heavier carved moulding. */
        featured: {
          src: "/work/product-development/tomorrow-is-yesterday/05-umbrellas-instore.webp",
          alt: "Sky and sunflower Tomorrow Is Yesterday umbrellas on a retail shop floor",
        },
        browser: {
          /* The two canopies are the product; the top of the frame is the
             shop's board wall and rails. Biased down so the umbrellas fill the
             folder and the room stays context rather than subject. */
          cover: { position: "50% 60%", scale: 1.35 },
          hoverPreview: { srcs: ["/work/product-development/tomorrow-is-yesterday/02-shades-render.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "Tomorrow Is Yesterday started as a personal design exercise while I was living in Long Beach, California. The name actually came from my son. We were throwing ideas around together, playing with words and opposites, and somehow landed on Tomorrow Is Yesterday.",
              "It felt weird. A little confusing. A little impossible. Which is exactly why I liked it.",
              "A lot of my ideas come from contrast. Opposites attract. Things that should not really go together, but somehow do. That became the whole energy behind the brand.",
              "My son ended up being part of the entire process that summer. He was there while I was designing, figuring out production, packaging things, and even selling. That part probably means more to me now than the actual products. I got to spend the whole summer with him while building something from scratch.",
              "And of course, like always, my goal was to make things I hadn't really seen before.",
              "The two products I had the most fun with were the umbrellas and sunglasses. For the umbrellas, I played with a sun on one side and a moon on the other, then took that same idea into different prints and patterns. The sunglasses followed the same logic. Sun. Moon. Day. Night. Tomorrow. Yesterday. Everything was playing against itself.",
              "I also designed a full run of T-shirts, hoodies, sweatpants, and other pieces around the brand. I designed everything. Produced everything. Sold everything myself.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "And somehow…. everything sold out. Both the umbrellas and sunglasses sold out, along with the clothing I produced around the project. What started as another random design exercise turned into a real little brand.",
              "But my favorite part wasn't even selling it.",
              { quote: "It was getting to build the whole thing with my son right there beside me." },
              "Another idea. Another experiment. Another experience in the books.",
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
          "I produce hip-hop music and I've been a J Dilla fan since middle school. Right before his birthday one year, I started with one question (what do you even say to a legendary creative like that besides thank you) and ended up spelling it out in actual donuts.",
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
        browser: {
          hoverPreview: { srcs: ["/work/product-development/thank-you-dilla/01-thank-you-dilla-lifestyle.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "I produce hip-hop music, and I've been a fan of J Dilla since I was in middle school. So every year when his birthday comes around, it means something to me. This project came right before his birthday, and the whole idea started with a really simple question:",
              { quote: "What do you even say to a legendary creative like J Dilla besides thank you?" },
              "That was the premise. Just THANK YOU. Simple. Direct. Real.",
              "Dilla has inspired so many people, and I knew I didn't want to make some regular tribute tee with a photo slapped on it or some generic graphic. I wanted to make something that felt fresh. Something personal. Something that had NEVER been seen before.",
              "And of course, if you know Dilla, you know Donuts is a huge part of his legacy. That album is legendary. The donut theme is already deeply connected to him, so I started thinking about how I could use that world without it feeling obvious or lazy.",
              "That's when the idea hit me: what if the actual words THANK YOU DILLA! were made out of real donuts? Not illustrated donuts. Not donut-inspired lettering. Real donuts.",
              "So I ordered custom letter donuts from a donut company in California. They looked amazing: pink icing, sprinkles, the whole thing. Honestly they looked delicious too…. but I didn't eat them, lol. I used the donuts as the actual typography for the design and turned them into the merch graphic.",
              "That's what made the project feel special to me. It started with a genuine feeling, then became a concept, then became a real object. And that's always my favorite kind of design process. Take a simple idea. Push it one step farther. Make it real.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "The final merch was loved by J Dilla fans everywhere, which meant a lot to me because this was never just another design exercise. This one was personal. It was my way of showing love to somebody whose art had such a real impact on me.",
              "Sometimes that's all you really have to say:",
              { quote: "THANK YOU." },
              "RIP J Dilla.",
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
          "I'd never designed jewelry before, so I decided to make a ring where the numbers themselves were the object: not stamped on, not printed on top, the actual structure. I taught myself just enough 3D modeling to make it real, and it sold out.",
        role: ["Product Design", "3D Design"],
        deliverables: ["3D Model", "Prototype", "Colorway System"],
        published: true,
        featuredRank: 6,
        tags: ["PRODUCT DESIGN", "CONCEPTS"],
        shortDescription:
          "A two-finger ring where the numerals themselves are the band: 222, printed in three colorways.",
        featured: {
          src: "/work/product-development/222-rings/06-222-ring-red-face.webp",
          alt: "222 ring render in red, numeral face forward",
        },
        browser: {
          /* The render sits low in a tall studio sweep — roughly the top third
             of the file is empty ground. Origin and scale together crop to the
             object rather than to the middle of the frame. The scale is capped
             by the width: the piece is wider than it is tall, so zooming far
             enough to fill the frame vertically starts cutting the outer two
             numerals, and then the folder is a red shape rather than a 222. */
          cover: { position: "50% 92%", scale: 1.2 },
          hoverPreview: { srcs: ["/work/product-development/222-rings/07-222-ring-blue-face.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "I had never designed jewelry before, so naturally I decided I wanted to make a ring. This started as a personal project during a time when I was learning a lot about angel numbers, numerology, and the meaning people attach to repeating numbers: 111, 222, 333. I kept seeing them everywhere, and I became obsessed with the idea of turning one of those numbers into an actual object. Not just engraving 222 onto a ring or printing it on top. I wanted the number itself to BE the ring.",
              "My goal was really simple:",
              { quote: "Make something I had never seen before." },
              "The biggest inspiration came from classic hip-hop jewelry: those big rings with words stretched across multiple fingers, the kind of jewelry that feels loud before you even know what it says. I kept thinking about the rings from Do the Right Thing. Big letters. Big personality. Something that becomes part jewelry, part typography, part sculpture.",
              "So I started asking myself: what would that look like with numbers instead of words? That became the 222 ring. Three numbers across the front. Two fingers underneath. One continuous object.",
              "I designed the entire thing from scratch in Blender, which was another challenge, because now I wasn't just designing something that needed to look good. It had to actually work. Your fingers have to fit through it. The numbers have to connect. The curves have to feel right. It has to be strong enough to exist in the real world.",
              "And once you start designing something for 3D printing, you realize very quickly that there's a huge difference between \"that looks cool on my screen\" and \"that can actually be manufactured.\" So I kept adjusting it. Printing. Testing. Changing proportions. Trying different colors. Trying it on. Going back into Blender. Eventually, we got it right.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "The final rings turned out AMAZING. They looked almost exactly how I imagined them: bright, chunky, a little ridiculous, very hip-hop. And most importantly, I hadn't seen anything else like them.",
              "I made a small run and put them up for sale. They sold out immediately.",
              "That was probably the coolest part of the whole experiment. I started with zero experience designing jewelry, just an idea. I taught myself enough to model it, figured out how to make it physical, got it manufactured, and put it out into the world. And people actually wanted it.",
              "That project became a really good reminder for me that sometimes the best reason to make something is simply:",
              { quote: "I wonder if I can make this real." },
            ],
          },
        ],
        mediaLayout: "grid",
        media: [
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
          "While I was working at Apple, I started paying attention to something small nobody else seemed to notice: the shirts. No brief, no permission. I mocked up new colorways on my own time, and Apple actually put them on employees.",
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
        browser: {
          /* Contained, the shot's own white ground sat as a bright panel inside
             the folder's letterbox bars and the two whites did not match.
             Cropped to the body of the shirt instead — the colourway is the
             proposal, so the colour should be what fills the folder. The scale
             is what the photographed opening added: a portrait studio shot
             cropped to a 1.45:1 window still left the shirt sitting in more
             white than green. */
          cover: { position: "50% 41%", scale: 1.4 },
          hoverPreview: { srcs: ["/work/product-development/apple-retail-merch/04-hat-black.webp"] },
        },
        sections: [
          {
            heading: "APPROACH",
            body: [
              "While I was working at Apple, I started paying attention to something small that most people probably didn't think twice about: the shirts. At the time, store employees were wearing a green shirt that everyone called \"skittle green.\" Then around the holidays, we'd switch over to a bright red Christmas shirt. It worked. It was Apple. But I kept thinking…. why only those colors?",
              "That question turned into a little side project. No design brief. No big presentation. Nobody asked me to do it. I just started thinking about what Apple retail merch could look like if the colors felt a little more intentional, a little more wearable, and a little more connected to the kind of clothes people would actually want to keep wearing outside of work.",
              "So I started making color variations: forest green, maroon, navy. Simple colors, nothing crazy. Because again, one of my favorite things to do with design is simplify. The Apple logo was already doing all the work. I didn't need to redesign the shirt. I didn't need some giant graphic on the back. I definitely didn't need to make it \"cooler.\" I just thought:",
              { quote: "What if we kept the exact same idea and made better color choices?" },
              "That was really the whole concept. Then I started thinking beyond the shirts. Apple has one of the most recognizable logos in the world, but I've always loved the old rainbow Apple mark, so I mocked up some really simple hats using that version of the logo: black, navy, white. Again…. nothing complicated. Just stuff I genuinely thought would look good.",
              "I put the whole thing together as a small internal proposal. A few shirt colorways. A few hats. Basically: here's what I think Apple retail merch could look like.",
            ],
          },
          {
            heading: "OUTCOME",
            body: [
              "And then something pretty cool happened. The proposal started moving around internally. Eventually, Apple actually produced and shipped the shirt colorways I had mocked up to stores. That was a really strange moment for me. This wasn't some giant campaign where a creative director handed me a brief and said, \"Go design this.\" I was working inside the company, noticed something I thought could be better, designed a solution, and put it in front of the right people.",
              "Then one day the thing that had been sitting on my computer screen…. was being worn by Apple employees.",
              "That project taught me a lesson I still use all the time:",
              { quote: "You don't always need permission to have an idea." },
              "Sometimes you just notice something. Make it better. Show somebody. And see what happens.",
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
 *
 * `next` walks the whole archive in order rather than cycling inside one
 * category. It used to wrap on the category's own length, which meant reading
 * straight through circled the seven Brand Identity projects for as long as
 * you kept clicking: it never reached Product Development, and it never
 * signalled that there was nothing left. Null at the last project is that
 * signal — the case study turns the band into a way back out.
 */
export const getProject = (categorySlug: string, projectSlug: string) => {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const index = category.projects.findIndex((p) => p.slug === projectSlug);
  if (index === -1) return undefined;

  const ordered = liveCategories().flatMap((c) =>
    c.projects.map((p) => ({ href: `/work/${c.slug}/${p.slug}`, name: p.name })),
  );
  const position = ordered.findIndex(
    (entry) => entry.href === `/work/${categorySlug}/${projectSlug}`,
  );
  const next = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : null;

  return { category, project: category.projects[index], index, next };
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
  featuredRank?: number;
  tags: string[];
  featured: ResolvedFeatured;
  browser: {
    cover?: BrowserPresentation["cover"];
    listPreview?: ResolvedFeatured;
  };
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

const resolveProjectImage = (project: Project, src: string): ResolvedFeatured => {
  const media = project.media.find((item) => item.src === src);
  return resolveFeatured({ src, alt: media?.alt ?? project.name });
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
    .map(({ category, project }) => {
      const featured = resolveFeatured(project.featured as Featured);
      return {
        slug: project.slug,
        name: project.name,
        href: `/work/${category.slug}/${project.slug}`,
        meta: project.meta,
        categorySlug: category.slug,
        categoryLabel: categoryLabel(category),
        featuredRank: project.featuredRank,
        tags: project.tags ?? [],
        featured,
        browser: {
          cover: project.browser?.cover,
          listPreview: project.browser?.listPreview
            ? resolveProjectImage(project, project.browser.listPreview)
            : undefined,
        },
      };
    });

export type ProjectCollection = "work" | "featured" | "recent";

/** Minimal, serializable shape passed from Server Components to the project browser. */
export type BrowserProject = Omit<GalleryPiece, "tags" | "featuredRank">;

const browserShape = ({ tags: _tags, featuredRank: _featuredRank, ...project }: GalleryPiece) => project;

/** Project sets used by the app-like portfolio browser. */
export const collectionProjects = (collection: ProjectCollection): BrowserProject[] => {
  const all = galleryProjects();
  if (collection === "featured") {
    return all
      .filter((project) => project.featuredRank !== undefined)
      .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))
      .map(browserShape);
  }
  if (collection === "recent") return all.map(browserShape);
  return all.map(browserShape);
};
