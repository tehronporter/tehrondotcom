/**
 * Global site copy. Everything here shows up in the header, footer, and metadata.
 * Edit this file to change your name, tagline, email, or social links.
 */

export const site = {
  name: "TEHRON PORTER",
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

  /* HOME is gone: the wordmark in the header is the way back, and on the home
     page itself the name is already the masthead. */
  nav: [
    { label: "WORK", href: "/work" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ],
} as const;
