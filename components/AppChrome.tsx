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
  { label: "Latest", href: "/recent", icon: "clock" },
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

function labelFromPath(pathname: string) {
  if (pathname === "/") return "WORK";
  if (pathname === "/featured") return "FEATURED";
  if (pathname === "/recent") return "LATEST";
  if (pathname === "/about") return "ABOUT";
  if (pathname === "/contact") return "CONTACT";
  const last = pathname.split("/").filter(Boolean).at(-1) ?? "WORK";
  return decodeURIComponent(last).replaceAll("-", " ").toUpperCase();
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
        <Link className={!activeDiscipline ? "discipline-link is-active" : "discipline-link"} href={disciplineHref()}>
          <span className="discipline-dot all" />
          All work
        </Link>
        {practices.map((discipline) => (
          <Link
            key={discipline.slug}
            href={disciplineHref(discipline.slug)}
            className={activeDiscipline === discipline.slug ? "discipline-link is-active" : "discipline-link"}
          >
            <span className="discipline-dot" data-discipline={discipline.slug} />
            {discipline.label}
          </Link>
        ))}
      </div>

      <div className="sidebar-status">
        <p>© {site.name}</p>
        <p>{site.location}</p>
        <p>AVAILABLE WORLDWIDE</p>
        <span className="status-track" aria-hidden="true"><span /></span>
      </div>
    </aside>
  );
}

export function WorkspaceToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [toolbarTitle, setToolbarTitle] = useState(() => labelFromPath(pathname));
  const [historyState, setHistoryState] = useState({ canGoBack: false, canGoForward: false });
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isBrowser = browserRoutes.has(pathname) || /^\/work\/[^/]+$/.test(pathname);
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#main h1");
      setToolbarTitle(heading?.textContent?.trim() || labelFromPath(pathname));
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    type NavigationHistory = EventTarget & {
      canGoBack: boolean;
      canGoForward: boolean;
      back: () => { finished: Promise<unknown> };
      forward: () => { finished: Promise<unknown> };
    };
    const navigation = (window as Window & { navigation?: NavigationHistory }).navigation;
    const update = () => setHistoryState({
      canGoBack: navigation?.canGoBack ?? window.history.length > 1,
      canGoForward: navigation?.canGoForward ?? false,
    });
    update();
    navigation?.addEventListener("currententrychange", update);
    window.addEventListener("popstate", update);
    return () => {
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

  const share = async () => {
    const payload = { title: document.title, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(payload.url);
        setCopied(true);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Cancelling a native share sheet should leave the interface unchanged.
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
        <p className="toolbar-title">{toolbarTitle}</p>
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
          <span className="toolbar-feedback" role="status">{copied ? "COPIED" : ""}</span>
        </button>

        <details className="toolbar-menu">
          <summary aria-label="More contact options" title="More contact options" data-tooltip="More"><Icon name="more" size={22} /></summary>
          <div className="toolbar-popover">
            <a href={`mailto:${site.email}`}>Email</a>
            {site.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer noopener">
                {social.label}
              </a>
            ))}
          </div>
        </details>
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
