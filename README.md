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
  media: [{ alt: "Hero image", src: "/work/brand-identity/new-project/01.jpg" }],
}
```

The category index row, the case study page, the URL, the sitemap entry, and the
prev/next links all generate from that. Nothing else to update.

## Adding images

Drop files in `public/work/<category-slug>/<project-slug>/` and reference them as
`/work/<category-slug>/<project-slug>/01.jpg` in a project's `media` array. A
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
