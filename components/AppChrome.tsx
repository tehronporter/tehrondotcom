"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { isPractice, practiceFromPath, type Practice } from "@/content/practices";
import { site } from "@/content/site";

const primaryNavigation: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "Work", href: "/", icon: "folder" },
  { label: "Featured", href: "/featured", icon: "star" },
  { label: "Recent", href: "/recent", icon: "clock" },
  { label: "About", href: "/about", icon: "user" },
  { label: "Contact", href: "/contact", icon: "send" },
];

const browserRoutes = new Set(["/", "/featured", "/recent"]);

function collectionBase(pathname: string) {
  return browserRoutes.has(pathname) ? pathname : "/";
}

function isPrimaryActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/work/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** href ("/work/brand-identity", "/work/brand-identity/blue-t-shirt") -> its label. */
export type BreadcrumbLabels = Record<string, string>;

type Crumb = { label: string; href?: string };

/**
 * Where you are, not what the page is titled. A category or case study route
 * used to copy its own <h1> verbatim — reading the DOM after paint, no less —
 * which meant the word sat twice within about 40px: once as this title, once
 * again as the headline directly beneath it. The toolbar is the app's location
 * bar; the page below it is the content. They only need to be the same string
 * where there is nothing more specific to say, i.e. the four single-word
 * collections.
 *
 * This is now the site's only breadcrumb. The case study used to render a
 * second one of its own a few pixels below this, and the two disagreed about
 * what the root was called — this said WORK, that said HOME, for the same
 * destination. Making these crumbs links is what let the other row go.
 *
 * `labels` supplies the two levels a plain slug can't: a category's declared
 * label ("brand-identity" -> "Brand Identity") and a project's actual name.
 * Built once, server-side, in AppShell — see the note there on why this can't
 * just import content/projects.ts itself. It holds an entry for every live
 * route, so a `/work/...` href missing from it is a URL that 404s below —
 * which is why that case reports NOT FOUND rather than title-casing the slug
 * into a confident-looking location for a page that does not exist.
 */
function breadcrumbTrail(pathname: string, labels: BreadcrumbLabels): Crumb[] {
  if (pathname === "/") return [{ label: "WORK" }];
  if (pathname === "/featured") return [{ label: "FEATURED" }];
  if (pathname === "/recent") return [{ label: "RECENT" }];
  if (pathname === "/about") return [{ label: "ABOUT" }];
  if (pathname === "/contact") return [{ label: "CONTACT" }];

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "work" || segments.length < 2) return [{ label: "NOT FOUND" }];

  const trail: Crumb[] = [{ label: "WORK", href: "/" }];
  let href = "/work";
  for (const segment of segments.slice(1)) {
    href += `/${segment}`;
    const label = labels[href];
    if (!label) return [{ label: "NOT FOUND" }];
    trail.push({ label: label.toUpperCase(), href });
  }

  /* The page you are on is a location, not a destination. */
  return trail.map((crumb, i) => (i === trail.length - 1 ? { label: crumb.label } : crumb));
}

export function AppNavigation({ practices }: { practices: Practice[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedDiscipline = searchParams.get("discipline");
  const activeDiscipline =
    practiceFromPath(pathname, practices) ??
    (isPractice(requestedDiscipline, practices) ? requestedDiscipline : null);
  const base = collectionBase(pathname);
  const disciplineHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (searchParams.get("view") === "list") params.set("view", "list");
    if (slug) params.set("discipline", slug);
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  return (
    <aside className="app-sidebar">
      <Link className="sidebar-wordmark display" href="/" aria-label={`${site.name}, home`}>
        {site.name}
      </Link>

      <nav className="sidebar-nav" aria-label="Primary">
        {primaryNavigation.map((item) => {
          const active = isPrimaryActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "sidebar-link is-active" : "sidebar-link"}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <div className="discipline-nav">
        <p className="sidebar-label">PRACTICES</p>
        {/* Only shown once a filter is on — otherwise this sat next to "Work"
           in the primary nav above, both pointing at "/" and both marked
           active, saying "you are here" twice for the same place. */}
        {activeDiscipline && (
          <Link className="discipline-link" href={disciplineHref()}>
            Clear filter
          </Link>
        )}
        {practices.map((discipline) => (
          <Link
            key={discipline.slug}
            href={disciplineHref(discipline.slug)}
            className={activeDiscipline === discipline.slug ? "discipline-link is-active" : "discipline-link"}
          >
            {discipline.label}
          </Link>
        ))}
      </div>

      <div className="sidebar-status">
        <p>© {site.name}</p>
        <p>{site.location}</p>
        <p>AVAILABLE WORLDWIDE</p>
      </div>
    </aside>
  );
}

export function WorkspaceToolbar({ breadcrumbLabels }: { breadcrumbLabels: BreadcrumbLabels }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const trail = breadcrumbTrail(pathname, breadcrumbLabels);
  const [historyState, setHistoryState] = useState({ canGoBack: false, canGoForward: false });
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /* A collection route, or a category that actually resolves. `/work/<slug>`
     alone was enough to render the grid/list switch over the 404 page. */
  const isBrowser =
    browserRoutes.has(pathname) || (/^\/work\/[^/]+$/.test(pathname) && pathname in breadcrumbLabels);
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  useEffect(() => {
    type NavigationHistory = EventTarget & {
      canGoBack: boolean;
      canGoForward: boolean;
      back: () => { finished: Promise<unknown> };
      forward: () => { finished: Promise<unknown> };
    };
    const navigation = (window as Window & { navigation?: NavigationHistory }).navigation;
    let frame = 0;
    const read = () => setHistoryState({
      canGoBack: navigation?.canGoBack ?? window.history.length > 1,
      canGoForward: navigation?.canGoForward ?? false,
    });
    /* Deferred a frame rather than run inline. `currententrychange` fires
       synchronously inside the navigation's own commit, and when that commit
       is the one React is driving from `startViewTransition` — i.e. every
       click on a folder — setting state from it lands during an insertion
       effect, which React rejects outright ("useInsertionEffect must not
       schedule updates"). A frame later the commit has finished and the same
       read is just an ordinary update. */
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    navigation?.addEventListener("currententrychange", update);
    window.addEventListener("popstate", update);
    return () => {
      cancelAnimationFrame(frame);
      navigation?.removeEventListener("currententrychange", update);
      window.removeEventListener("popstate", update);
    };
  }, [pathname]);

  const goBack = () => {
    const navigation = (window as Window & { navigation?: { back: () => { finished: Promise<unknown> } } }).navigation;
    if (navigation) navigation.back().finished.catch(() => {});
    else router.back();
  };

  const goForward = () => {
    const navigation = (window as Window & { navigation?: { forward: () => { finished: Promise<unknown> } } }).navigation;
    if (navigation) navigation.forward().finished.catch(() => {});
    else window.history.forward();
  };

  const setView = (nextView: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === "grid") params.delete("view");
    else params.set("view", nextView);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const [shareFailed, setShareFailed] = useState(false);

  const share = async () => {
    const payload = { title: document.title, url: window.location.href };
    setShareFailed(false);
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(payload.url);
        setCopied(true);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1800);
      }
    } catch (error) {
      /* Cancelling a native share sheet should leave the interface unchanged —
         that arrives as an AbortError and is not a failure. Anything else is:
         a clipboard write blocked by permissions or by an insecure context
         used to look exactly like a successful copy, silently. */
      if ((error as DOMException)?.name === "AbortError") return;
      setShareFailed(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setShareFailed(false), 2600);
    }
  };

  return (
    <header className="workspace-toolbar">
      <div className="toolbar-leading">
        <div className="history-controls" aria-label="History controls">
          <button type="button" onClick={goBack} aria-label="Go back" title="Go back" data-tooltip="Back" disabled={!historyState.canGoBack}>
            <Icon name="chevron-left" size={21} />
          </button>
          <button type="button" onClick={goForward} aria-label="Go forward" title="Go forward" data-tooltip="Forward" disabled={!historyState.canGoForward}>
            <Icon name="chevron-right" size={21} />
          </button>
        </div>
        <nav className="toolbar-title" aria-label="Breadcrumb">
          <ol className="toolbar-crumbs">
            {trail.map((crumb) => (
              <li key={crumb.href ?? crumb.label}>
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="toolbar-actions">
        {isBrowser ? (
          <div className="view-controls" role="group" aria-label="Project view">
            <button
              type="button"
              className={view === "grid" ? "is-active" : undefined}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              title="Grid view"
              data-tooltip="Grid"
              onClick={() => setView("grid")}
            >
              <Icon name="grid" size={19} />
            </button>
            <button
              type="button"
              className={view === "list" ? "is-active" : undefined}
              aria-pressed={view === "list"}
              aria-label="List view"
              title="List view"
              data-tooltip="List"
              onClick={() => setView("list")}
            >
              <Icon name="list" size={20} />
            </button>
          </div>
        ) : null}

        <button type="button" className="toolbar-button" onClick={share} aria-label="Share this page" title="Share this page" data-tooltip="Share">
          <Icon name={copied ? "check" : "share"} size={19} />
          <span className="toolbar-feedback" role="status">
            {copied ? "COPIED" : shareFailed ? "COPY FAILED" : ""}
          </span>
        </button>

      </div>
    </header>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav className="mobile-nav" aria-label="Mobile primary">
      {primaryNavigation.map((item) => {
        const active = isPrimaryActive(item.href, pathname);
        return (
          <Link key={item.href} href={item.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function WorkspaceScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const workspace = document.querySelector<HTMLElement>(".workspace-scroll");
    if (workspace) workspace.scrollTop = 0;
  }, [pathname]);

  return null;
}
