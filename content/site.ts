/**
 * Global site copy. Everything here shows up in the header, footer, and metadata.
 * Edit this file to change your name, tagline, email, or social links.
 */

export const site = {
  name: "TEHRON PORTER",
  role: "DESIGNER & CREATIVE TECHNOLOGIST",
  email: "tehronporter@gmail.com",
  location: "LAS VEGAS / REMOTE",

  /**
   * Canonical origin — drives Open Graph URLs, canonical tags, and the sitemap.
   * Set NEXT_PUBLIC_SITE_URL in Vercel to override (e.g. while on a *.vercel.app
   * domain, before the real domain is pointed at the project).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tehron.com",
  title: "Tehron Porter — Designer & Creative Technologist",
  description:
    "Design, technology, and culture. Brands, products, and digital experiences. Las Vegas / Remote.",

  /** Footer CTA, shared by every page. */
  cta: {
    headline: ["LET'S MAKE", "SOMETHING REAL."],
  },

  /** TODO: swap in your real profile URLs and handles. */
  socials: [
    { label: "INSTAGRAM", handle: "@tehronporter", href: "https://instagram.com/tehronporter" },
    { label: "LINKEDIN", handle: "Tehron Porter", href: "https://linkedin.com/in/tehronporter" },
    { label: "TWITTER", handle: "@tehronporter", href: "https://x.com/tehronporter" },
  ],

  nav: [
    { label: "WORK", href: "/" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ],
} as const;

/** Home page hero. */
export const hero = {
  headline: ["I BUILD", "WHAT'S NEXT,", "NOT WHAT'S SAFE."],
  body: ["Design, technology, and culture.", "Brands, products, and digital experiences."],
};
