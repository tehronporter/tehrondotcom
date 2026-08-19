const STORAGE_KEY = "tehron:recent-projects:v1";
const MAX_RECENT = 6;

export function readRecentRoutes(): string[] {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function recordRecentRoute(href: string) {
  try {
    const routes = [href, ...readRecentRoutes().filter((route) => route !== href)].slice(0, MAX_RECENT);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch {
    // Private browsing or disabled storage should never block a project page.
  }
}
