import { Suspense } from "react";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { ProfilePanel } from "@/components/ProfilePanel";
import { collectionProjects, type BrowserProject, type ProjectCollection } from "@/content/projects";

export function PortfolioPage({
  collection,
  title,
  description,
  projects,
}: {
  collection?: ProjectCollection;
  title: string;
  description?: string;
  projects?: BrowserProject[];
}) {
  const items = projects ?? collectionProjects(collection ?? "work");

  return (
    <div className="page portfolio-page">
      <header className="browser-heading">
        <h1 className="display">{title}</h1>
        {description ? <p className="browser-description">{description}</p> : null}
      </header>

      <Suspense fallback={<div className="project-browser browser-loading" aria-hidden="true" />}>
        <PortfolioBrowser projects={items} />
      </Suspense>

      <ProfilePanel />
    </div>
  );
}
