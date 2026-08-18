import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { OG_BLUE, OG_SIZE, ogFonts } from "@/lib/og";

/* Share card for links to the site itself. Generated at build time — same blue,
   and the same name-led lockup as the home masthead. Individual projects carry
   their own card showing their own work; see
   app/work/[category]/[project]/opengraph-image.tsx. */

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
          justifyContent: "space-between",
          background: OG_BLUE,
          color: "#fff",
          padding: 72,
          fontFamily: "Lato",
        }}
      >
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 1.2, fontWeight: 700, opacity: 0.8 }}>
          {site.role}
        </div>

        {/* Same lockup as the home masthead: the name is the message. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Archivo Black",
              /* Archivo Black is wide where Anton was condensed — the name
                 needs ~30% less size to hold the same measure on the card. */
              fontSize: 72,
              lineHeight: 1,
              letterSpacing: -1.5,
            }}
          >
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
    { ...size, fonts },
  );
}
