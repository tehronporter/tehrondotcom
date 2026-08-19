# tehron.com

Portfolio for Tehron Porter — designer & creative technologist.
Next.js (App Router) + TypeScript. Every page is statically generated.

```bash
npm install && npm run dev
```

---

## Where to edit things

| I want to change…                            | Edit                    |
| -------------------------------------------- | ----------------------- |
| Name, tagline, email, socials, nav, footer CTA | `content/site.ts`       |
| The home page hero                            | `content/site.ts`       |
| Categories, projects, case study copy         | `content/projects.ts`   |
| About + Contact page copy                     | `content/pages.ts`      |
| Featured ordering                             | `content/projects.ts`   |
| Colors, type, spacing, every visual rule      | `app/globals.css`       |

Nothing else needs touching for normal content updates.

## Adding a project

Add one object to the right category's `projects` array in `content/projects.ts`:

```ts
{
  slug: "new-project",              // becomes /work/<category>/new-project
  name: "NEW PROJECT",
  meta: "Brand Identity / Campaign",
  intro: "One paragraph that sets up the work.",
  role: ["Creative Direction"],
  deliverables: ["Identity System"],
  sections: [{ heading: "APPROACH", body: ["…"] }],
  media: [{ alt: "Hero image", src: "/work/brand-identity/new-project/01.webp" }],
}
```

The category index row, the case study page, the URL, the sitemap entry, and the
prev/next links all generate from that. Nothing else to update.

Set `published: true` and add a `featured` image to place a project in the Work
browser. Add `featuredRank: 1` (or another unique rank) to include it in the
curated Featured collection. Recent is always the first six published projects
in file order. Folder covers use the existing featured image and optional
`featured.focus`; source artwork is never reshaped or overwritten.

## Adding images

Drop files in `public/work/<category-slug>/<project-slug>/` — any format, any
size, straight out of the export. Reference them as
`/work/<category-slug>/<project-slug>/01.webp` in a project's `media` array. A
`media` entry with no `src` renders as an empty frame, so the layout holds while
you're still shooting.

`span: "half"` puts two side by side; anything else spans the full width. Set
`mediaLayout: "grid"` on a project for a small uniform feed instead (images keep
their full aspect ratio, nothing gets cropped) — `mediaColumns: 3` narrows it from
the 4-across default.

Raw, unedited photos (phone shots, exports, alternates you're picking from) go in
`source-photos/<category-slug>/<project-slug>/` at the repo root, not in `public/`.
Anything under `public/` is deployed and publicly servable, so only finished,
curated images belong there.

### The image pipeline

You reference `.webp` above because that is what the file becomes. Committing an
image runs `npm run images`, which converts anything under `public/work` that
isn't already a WebP within 2560px, rewrites the `src` in `content/` to match,
and records the file's real dimensions and a blur placeholder in
`content/image-manifest.json`.

That manifest is why no image dimension is written by hand — a number that drifts
from its file hangs a piece in the wrong frame and shifts the layout for every
visitor. It regenerates from the files themselves.

| | |
| --- | --- |
| `npm run images` | Convert + rebuild the manifest. Safe to run any time. |
| `npm run images:check` | Report anything out of policy, change nothing. |
| `git commit --no-verify` | Commit without running it. |

Originals are copied to `source-photos/_originals/` before being replaced. That
folder is gitignored and purely a local safety net — git history has every
original too, so it is safe to delete whenever you want the disk space back.

Running it twice is a no-op: a file is only converted if it is *not* already what
the pipeline emits, so nothing is ever compressed twice. Deliberately absent is
any "bigger than N KB" rule — that is the one policy a file could fail forever,
losing quality on every run.

## Before launch

- [ ] Replace the placeholder case study copy in `content/projects.ts`
- [ ] Replace the About bio and experience rows in `content/pages.ts`
- [ ] Point `site.socials` at your real profiles
- [ ] Set `site.url` to the live domain (drives canonical URLs, OG tags, sitemap)
- [ ] Add real project images to `public/`
- [ ] Add an OG share image at `app/opengraph-image.png` (1200×630)

## Deploy

Pushes to `main` deploy to production on Vercel. Every other branch and PR gets
its own preview URL.
