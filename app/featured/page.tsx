import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  path: "/featured",
  title: "Featured Work",
  description: "A curated selection of brand, product, and creative technology work by Tehron Porter.",
});

export default function FeaturedPage() {
  return (
    <PortfolioPage
      collection="featured"
      title="FEATURED"
      description="A tight edit of the work that best represents the practice."
    />
  );
}
