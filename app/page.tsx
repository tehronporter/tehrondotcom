import { Gallery } from "@/components/Gallery";
import { frameVars } from "@/components/frames";
import { site } from "@/content/site";
import { galleryProjects, galleryTags, wallDensity } from "@/content/projects";

export default function HomePage() {
  const pieces = galleryProjects();
  const tags = galleryTags();

  return (
    /* The frame SVGs are set here as custom properties so their source is
       inlined once for the whole page rather than once per piece — custom
       properties inherit, so every .frame below can reach them. The density
       tier is what lets the wall re-compose itself as the portfolio grows:
       publish more projects and the frames tighten, with no layout change. */
    <div className="page home" style={frameVars()} data-density={wallDensity(pieces.length)}>
      {/* One grid holds the masthead, the filters, and the wall so the name and
          the keywords share a baseline row and the artwork spans beneath them. */}
      <section className="home-grid" aria-label="Selected work">
        <div className="masthead">
          <h1 className="display masthead-name">{site.name}</h1>
          <p className="masthead-role">{site.disciplines.join("  ·  ")}</p>
        </div>

        <Gallery pieces={pieces} tags={tags} />
      </section>
    </div>
  );
}
