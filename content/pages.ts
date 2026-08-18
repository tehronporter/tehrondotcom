/**
 * Copy for the About and Contact pages.
 *
 * NOTE: the About bio and experience rows below are scaffolding — they match the
 * voice of the home page but the facts are placeholders. Replace them with yours.
 */

export const about = {
  titleLines: ["DESIGN,", "TECHNOLOGY,", "AND CULTURE."],
  intro: [
    "I'm Tehron Porter, a designer and creative technologist working across brand identity, digital product, and the tools in between. Based in Las Vegas, working remote.",
    "Most of my work starts the same way: a brief that needs both a point of view and a build. I do both, so there's fewer handoffs and less lost in translation between the idea and the thing that ships.",
  ],
  statement: [
    "I don't think the interesting problems are the safe ones. The work I'm proudest of is the work where the format didn't exist yet. An identity system that had to survive a drop model. A tool nobody could call useful until it actually existed.",
    "The through-line is craft. Systems that hold up, type that's set on purpose, and interfaces that don't need a tutorial.",
  ],
  /* The same three disciplines the rest of the site is built on, under the same
     names — these are the /work categories and the home "What I Do" rows,
     expanded into what each one actually covers. They used to be titled Brand /
     Technology / Product, which read as a second, competing list of three. */
  capabilities: [
    {
      title: "Brand Identity",
      items: ["Identity Systems", "Art Direction", "Campaigns", "Packaging", "Brand Guidelines"],
    },
    {
      title: "Creative Technology",
      items: ["Web Experiences", "AI & Automation", "Interactive Prototypes", "Front-end Build"],
    },
    {
      title: "Product Development",
      items: ["UX / UI Design", "Design Systems", "Product Strategy", "Development"],
    },
  ],
  experience: [
    { k: "Independent Practice", v: "Design & Creative Technology · Since 2023" },
    { k: "Selected Clients", v: "Apparel, Music, Small Business" },
    { k: "Based", v: "Las Vegas, NV · Working Remote" },
  ],
};

export const contact = {
  titleLines: ["TELL ME WHAT", "YOU'RE BUILDING."],
  intro: [
    "Open to new projects, collaborations, and the occasional strange idea. The fastest way to reach me is email — tell me what you're building and when you need it.",
  ],
  availability: "Currently taking on select projects.",
};
