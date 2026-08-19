import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";

export const metadata: Metadata = {
  title: "Latest Work",
  description: "A selection of the latest published projects from Tehron Porter.",
};

export default function RecentPage() {
  return (
    <PortfolioPage
      collection="recent"
      title="LATEST"
      description="The latest six projects in the maintained portfolio order."
    />
  );
}
