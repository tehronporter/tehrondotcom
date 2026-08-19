/**
 * Global site copy. Everything here shows up in the header, footer, and metadata.
 * Edit this file to change your name, tagline, email, or social links.
 */

export const site = {
  name: "TEHRON PORTER",
  /** Sentence-case name, for the places the all-caps lockup would shout: the
      browser tab, the title template, and every og:title. */
  shortName: "Tehron Porter",
  role: "DESIGNER & CREATIVE TECHNOLOGIST",
  email: "tehronporter@gmail.com",
  location: "LAS VEGAS / REMOTE",

  /** The line under the name on the home masthead. */
  disciplines: ["Brand Identity", "Creative Technology", "Product Development"],

  /**
   * Canonical origin — drives Open Graph URLs, canonical tags, and the sitemap.
   * Set NEXT_PUBLIC_SITE_URL in Vercel to override (e.g. while on a *.vercel.app
   * domain, before the real domain is pointed at the project).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tehron.com",
  title: "Tehron Porter — Designer & Creative Technologist",
  description:
    "Design, technology, and culture. Brands, products, and digital experiences. Las Vegas / Remote.",

  /**
   * Served from `public/`, so it has a real URL. The authored source stays in
   * `resume/` at the repo root — run that folder's build to regenerate, then
   * copy the PDF here. Only what is under `public/` is publicly reachable.
   *
   * Deliberately not `public/resume/`: `.git/info/exclude` carries a bare
   * `resume/` pattern, which matches a directory of that name at any depth. A
   * copy placed there is silently untracked, so it never deploys and this link
   * 404s in production while working perfectly in dev.
   */
  resume: "/Tehron-Porter-Resume.pdf",

  /** Footer CTA, shared by every page. */
  cta: {
    headline: ["LET'S MAKE", "SOMETHING REAL."],
  },

  /** TODO: swap in your real profile URLs and handles. */
  socials: [
    { label: "IG", handle: "@tehronporter", href: "https://instagram.com/tehronporter" },
    { label: "LINKEDIN", handle: "Tehron Porter", href: "https://linkedin.com/in/tehronporter" },
    { label: "X", handle: "@tehronporter", href: "https://x.com/tehronporter" },
  ],

  /* No `nav` here. The primary navigation is declared in components/AppChrome
     alongside the icon each item carries, and it is shared by the sidebar and
     the mobile tab bar. A second copy lived here for a header component that
     no route imported, and had already drifted — it was missing both Featured
     and Recent. */
} as const;
