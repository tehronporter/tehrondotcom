import type { Metadata } from "next";
import { RecentPortfolio } from "@/components/RecentPortfolio";
import { collectionProjects, livePractices } from "@/content/projects";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  path: "/recent",
  title: "Recent Work",
  description: "Projects viewed during the current browsing session.",
});

export default function RecentPage() {
  return <RecentPortfolio projects={collectionProjects("recent")} practices={livePractices()} />;
}
