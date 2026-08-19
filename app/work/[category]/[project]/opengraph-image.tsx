import { ImageResponse } from "next/og";
import { categories, categoryLabel, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { OG_CANVAS, OG_INK, OG_MUTED, OG_RULE, OG_SIZE, OG_SURFACE, artwork, ogFonts, practiceAccent } from "@/lib/og";

/* Every project link that gets pasted into Slack, a DM, or a post previews as
   its own work rather than as the same card with the same name on it. Portfolio
   links travel one project at a time, and the share is doing the pitching in a
   room nobody is standing in.

   Without this route every page on the site inherits the one site-level card
   declared in app/layout.tsx — same title, same description, same image, and an
   og:url pointing at the home page no matter which project was shared. */

export const alt = "Project by Tehron Porter";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return categories.flatMap((c) => c.projects.map((p) => ({ category: c.slug, project: p.slug })));
}

/** The box the artwork is fitted into, leaving the left column for the type. */
const PLATE = { width: 468, height: 466 };

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category: categorySlug, project: projectSlug } = await params;
  const found = getProject(categorySlug, projectSlug);
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
          flexDirection: "column",
          background: OG_CANVAS,
          color: OG_INK,
          padding: 56,
          fontFamily: "Lato",
        }}
      >
        {/* The card is a window onto the workspace: the same paper, the same
            rounded surface the project browser paints its cards on. */}
        <div
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            alignItems: "center",
            gap: 48,
            background: OG_SURFACE,
            border: `1px solid ${OG_RULE}`,
            borderRadius: 18,
            padding: 48,
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, letterSpacing: 1.3, fontWeight: 700, color: OG_MUTED }}>
              <span style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: practiceAccent(found?.category.slug) }} />
              {found ? categoryLabel(found.category).toUpperCase() : site.role}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Archivo Black",
                  /* Long names wrap rather than overflow; the step down keeps
                     two lines inside the plate's height. Archivo Black is wide,
                     so the break comes earlier than it would for Anton. */
                  fontSize: (project?.name.length ?? 0) > 13 ? 44 : 54,
                  lineHeight: 1,
                  letterSpacing: -0.5,
                }}
              >
                {project?.name ?? site.name}
              </div>
              <div style={{ display: "flex", fontSize: 21, letterSpacing: 0.4, marginTop: 18, color: OG_MUTED }}>
                {project?.meta ?? site.disciplines.join("  ·  ")}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                letterSpacing: 1.1,
                color: OG_MUTED,
                borderTop: `1px solid ${OG_RULE}`,
                paddingTop: 20,
              }}
            >
              <span>{site.name}</span>
              <span>{site.url.replace(/^https?:\/\//, "")}</span>
            </div>
          </div>

          {/* The piece at its own proportions. Absent for a project with no
              featured image, and the type simply takes the full card. */}
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
              <img src={piece.uri} width={piece.width} height={piece.height} alt="" style={{ borderRadius: 10 }} />
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
