import { ImageResponse } from "next/og";
import { getProject, liveCategories } from "@/content/projects";
import { site } from "@/content/site";
import { OG_BLUE, OG_SIZE, artwork, ogFonts } from "@/lib/og";

/* Every project link that gets pasted into Slack, a DM, or a post previews as
   its own work rather than as the same blue card with a name on it. Portfolio
   links travel one project at a time, and the share is doing the pitching in a
   room nobody is standing in. */

export const alt = "Project by Tehron Porter";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return liveCategories().flatMap((c) =>
    c.projects.map((p) => ({ category: c.slug, project: p.slug }))
  );
}

/** The box the artwork is fitted into, leaving the left half for the type. */
const PLATE = { width: 470, height: 502 };

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category, project: projectSlug } = await params;
  const found = getProject(category, projectSlug);
  const project = found?.project;

  const [fonts, piece] = await Promise.all([
    ogFonts(),
    project?.featured?.src ? artwork(project.featured.src, PLATE) : undefined,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          background: OG_BLUE,
          color: "#fff",
          padding: 64,
          fontFamily: "Lato",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 1.2, fontWeight: 700, opacity: 0.8 }}>
            {site.name}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Archivo Black",
                /* Long names wrap rather than overflow; the step down keeps two
                   lines inside the plate's height. */
                /* Archivo Black is wide, so both steps drop and the break
                   to the smaller size comes earlier than it did for Anton. */
                fontSize: (project?.name.length ?? 0) > 13 ? 44 : 54,
                lineHeight: 1,
                letterSpacing: -0.5,
              }}
            >
              {project?.name ?? site.name}
            </div>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 0.6, marginTop: 20, opacity: 0.85 }}>
              {project?.meta ?? site.disciplines.join("  ·  ")}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 17, letterSpacing: 1.1, opacity: 0.7 }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>

        {/* The piece, hung on the blue at its own proportions — the same
            relationship the wall has to its artwork. Absent for a project with
            no featured image, and the type simply takes the full card. */}
        {piece && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: PLATE.width,
              height: PLATE.height,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={piece.uri} width={piece.width} height={piece.height} alt="" />
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
