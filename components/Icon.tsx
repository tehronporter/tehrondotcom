/**
 * Inline stroke icons. The original mockup referenced an icon font that was never
 * loaded, which is why the glyphs were invisible — these are self-contained SVGs
 * instead, so there is no external request and nothing to fail.
 */

const paths = {
  "arrow-right": "M5 12h13M13 6l6 6-6 6",
  "arrow-left": "M19 12H6M11 18l-6-6 6-6",
  "arrow-up-right": "M8 16 16 8M9 8h7v7",
  "chevron-left": "m15 18-6-6 6-6",
  "chevron-right": "m9 18 6-6-6-6",
  crop: "M8 4v12a1 1 0 0 0 1 1h12M4 8h12a1 1 0 0 1 1 1v12",
  world: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18",
  cube: "M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6zM12 12l8-4.4M12 12v8.8M12 12 4 7.6",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  folder: "M3 6.5h6l2 2h10v9.5H3z",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3.5 2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4.5 21a7.5 7.5 0 0 1 15 0",
  send: "m3 11 18-8-8 18-2.5-7.5zM10.5 13.5 21 3",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  share: "M12 16V4M8 8l4-4 4 4M5 13v7h14v-7",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  check: "m5 12 4 4L19 6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
