export const portfolioPractices = [
  { label: "Brand Identity", shortLabel: "Brand", slug: "brand-identity" },
  { label: "Product Development", shortLabel: "Product", slug: "product-development" },
] as const;

export type PortfolioPracticeSlug = (typeof portfolioPractices)[number]["slug"];

export function isPortfolioPractice(value: string | null): value is PortfolioPracticeSlug {
  return portfolioPractices.some((practice) => practice.slug === value);
}

export function practiceFromPath(pathname: string): PortfolioPracticeSlug | null {
  const candidate = pathname.match(/^\/work\/([^/]+)$/)?.[1] ?? null;
  return isPortfolioPractice(candidate) ? candidate : null;
}
