import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { OG_BLUE, OG_CANVAS, OG_INK, OG_MUTED, OG_RULE, OG_SIZE, OG_SURFACE, ogFonts } from "@/lib/og";

/* The card for links to the site itself. Individual projects have their own —
   see app/work/[category]/[project]/opengraph-image.tsx. Generated at build
   time, in the workspace's own paper and ink. */

export const alt = site.title;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  const fonts = await ogFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: OG_CANVAS,
          color: OG_INK,
          padding: 56,
          fontFamily: "Lato",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            background: OG_SURFACE,
            border: `1px solid ${OG_RULE}`,
            borderRadius: 18,
            padding: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, letterSpacing: 1.3, fontWeight: 700, color: OG_MUTED }}>
            <span style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: OG_BLUE }} />
            {site.role}
          </div>

          {/* The name is the message, same as the sidebar wordmark. */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Archivo Black", fontSize: 96, lineHeight: 1, letterSpacing: -2 }}>
              {site.name}
            </div>
            <div style={{ display: "flex", fontSize: 23, letterSpacing: 0.6, marginTop: 22, color: OG_MUTED }}>
              {site.disciplines.join("  ·  ")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 17,
              letterSpacing: 1.1,
              color: OG_MUTED,
              borderTop: `1px solid ${OG_RULE}`,
              paddingTop: 22,
            }}
          >
            <span>{site.location}</span>
            <span>{site.url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
