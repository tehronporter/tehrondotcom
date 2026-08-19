import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/meta";

/* No `title` — the home page is the one route that keeps the site-level title
   rather than having it composed through the `%s — Tehron Porter` template. */
export const metadata: Metadata = pageMetadata({
  path: "/",
  description: site.description,
});

export default function HomePage() {
  return <PortfolioPage collection="work" title="WORK" />;
}
