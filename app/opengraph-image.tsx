import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/* Share card for links to the site. Generated at build time — same blue, and
   the same name-led lockup as the home masthead.
   Note: the renderer only ships one font weight, so the fontWeight values below
   have no effect today. Register a font with weights here to make them apply. */

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a35e0",
          color: "#fff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 1.2, opacity: 0.8 }}>
          {site.role}
        </div>

        {/* Same lockup as the home masthead: the name is the message. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, lineHeight: 1, letterSpacing: -2 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 1.4, marginTop: 22, opacity: 0.85 }}>
            {site.disciplines.join("  ·  ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 1.2,
            borderTop: "1px solid rgba(255,255,255,0.28)",
            paddingTop: 24,
          }}
        >
          <span>{site.location}</span>
          <span>{site.email.toUpperCase()}</span>
        </div>
      </div>
    ),
    size
  );
}
