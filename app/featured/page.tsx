import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";

export const metadata: Metadata = {
  title: "Featured Work",
  description: "A curated selection of brand, product, and creative technology work by Tehron Porter.",
};

export default function FeaturedPage() {
  return (
    <PortfolioPage
      collection="featured"
      title="FEATURED"
      description="A tight edit of the work that best represents the practice."
    />
  );
}
