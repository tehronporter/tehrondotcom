import { Suspense } from "react";
import { AppNavigation, MobileNavigation, WorkspaceScrollReset, WorkspaceToolbar } from "@/components/AppChrome";

function ChromeFallback({ className }: { className: string }) {
  return <div className={className} aria-hidden="true" />;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-frame">
      <Suspense fallback={<ChromeFallback className="app-sidebar" />}>
        <AppNavigation />
      </Suspense>

      <div className="app-workspace">
        <Suspense fallback={<ChromeFallback className="workspace-toolbar" />}>
          <WorkspaceToolbar />
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
