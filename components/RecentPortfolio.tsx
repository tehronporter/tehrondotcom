"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { ProfilePanel } from "@/components/ProfilePanel";
import type { BrowserProject } from "@/content/projects";
import type { Practice } from "@/content/practices";
import { readRecentRoutes } from "@/lib/recent";

export function RecentPortfolio({ projects, practices }: { projects: BrowserProject[]; practices: Practice[] }) {
  const [recentProjects, setRecentProjects] = useState<BrowserProject[] | null>(null);

  useEffect(() => {
    const byHref = new Map(projects.map((project) => [project.href, project]));
    setRecentProjects(readRecentRoutes().flatMap((href) => {
      const project = byHref.get(href);
      return project ? [project] : [];
    }));
  }, [projects]);

  return (
    <div className="page portfolio-page">
      <header className="browser-heading">
        <h1 className="display">RECENT</h1>
        <p className="browser-description">Projects opened during this browsing session.</p>
      </header>

      {recentProjects === null ? <div className="recent-loading" aria-hidden="true" /> : null}

      {recentProjects && recentProjects.length > 0 ? (
        <Suspense fallback={<div className="project-browser browser-loading" aria-hidden="true" />}>
          <PortfolioBrowser projects={recentProjects} practices={practices} />
        </Suspense>
      ) : null}

      {recentProjects?.length === 0 ? (
        <section className="empty-collection recent-empty" aria-labelledby="recent-empty-title">
          <p className="empty-kicker">SESSION HISTORY</p>
          <h2 className="display" id="recent-empty-title">NO PROJECTS OPENED YET.</h2>
          <p>Projects you visit will appear here for the rest of this session.</p>
          <div className="empty-actions">
            <Link href="/">BROWSE ALL WORK</Link>
          </div>
        </section>
      ) : null}

      <ProfilePanel />
    </div>
  );
}
