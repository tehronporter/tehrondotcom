import { Suspense } from "react";
import { AppNavigation, MobileNavigation, WorkspaceScrollReset, WorkspaceToolbar } from "@/components/AppChrome";
import { breadcrumbLabels, livePractices } from "@/content/projects";

function ChromeFallback({ className }: { className: string }) {
  return <div className={className} aria-hidden="true" />;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  /* Resolved here, on the server, and passed down. The sidebar and toolbar are
     client components and must not reach into content/projects.ts themselves —
     see the note in content/practices.ts. */
  const practices = livePractices();
  const labels = breadcrumbLabels();

  return (
    <div className="app-frame">
      <Suspense fallback={<ChromeFallback className="app-sidebar" />}>
        <AppNavigation practices={practices} />
      </Suspense>

      <div className="app-workspace">
        <Suspense fallback={<ChromeFallback className="workspace-toolbar" />}>
          <WorkspaceToolbar breadcrumbLabels={labels} />
        </Suspense>
        <main id="main" className="workspace-scroll">
          <WorkspaceScrollReset />
          {children}
        </main>
      </div>

      <Suspense fallback={null}>
        <MobileNavigation />
      </Suspense>
    </div>
  );
}
