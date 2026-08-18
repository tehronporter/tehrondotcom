# Design updates — reference list for review

Specific references pulled from refero.design and fontsinuse.com, plus the
marina_uiux tutorial. Each entry says what to take and why it fits **this** site
— flat cobalt `#1a35e0`, white type, Archivo Black display, Lato body, a wall of
work images, multi-page.

Nothing here is decided. Mark up what you like.

---

# Part 1 — refero.design

Filtered ~44 style entries down to the seven whose problem resembles ours: a
single dominant surface colour, type doing the heavy lifting, images as the only
other visual element.

## 1.1 monopo saigon — the "one expressive gesture" rule
<https://styles.refero.design/style/3e52dd36-6ab1-48c6-bc40-47ef6d33abc2>

A creative studio portfolio built on "radical monochrome discipline… wrapped
around massive Roobert typography." The rule worth stealing: **sharp 0px corners
on everything — navigation, text links, cards — broken by exactly one gesture,
full-pill 75px-radius buttons "that float like liquid over imagery."**

**Why this one:** you already do this and probably by instinct rather than by
rule — square image frames, pill filter chips at `border-radius: 999px`. Naming
it as a law is what stops the next component from splitting the difference at
8px and quietly killing the contrast.

**Also worth taking — their motion spec.** `cubic-bezier(0.19, 1, 0.22, 1)` with
transforms up to **1.25s**, described as letting elements "glide rather than
snap." Ours is `cubic-bezier(0.22, 0.61, 0.36, 1)` at a flat **200ms** for
everything. 200ms is right for a hover on a filter pill and far too fast for a
full-bleed image entering the viewport. Proposal: keep `--speed` for small
controls, add a second slower token for large surfaces.

**Their type scale runs to 225px.** Our masthead caps at 8.5rem (136px). Worth
knowing the ceiling other studios actually use before deciding ours is bold.

## 1.2 Hyperstudio — hairlines as the only structure
<https://styles.refero.design/style/8eb9c53e-d69c-497a-b640-610856cf3a60>

"Blueprint scratched into obsidian." Everything carved out of a near-black
canvas by 1px borders. **Oversized headlines at weight 400 with aggressive
negative tracking — "authority through scale and tracking alone", never bold.**
Components reduced to skeletons: outlined buttons, ghost pills, thin dividers,
no shadows, one white pill for the primary action.

**Why this one:** it is the closest structural match to our page — a single
saturated field where hairline rules and type are the *only* devices, because
there are no other surfaces to work with. We already run `--rule` /
`--rule-soft` / `--fill` at 0.28 / 0.14 / 0.06. Their discipline is a level
stricter: one border colour for *all* structural linework, and a single
high-contrast fill reserved for one action. Ours has five white-alpha tokens
and no stated rule about which wins where.

## 1.3 Dayos "AI for Business" — brutalist editorial scale ratio
<https://styles.refero.design/style/ee403055-480e-4bd4-9216-07c9ae2dde2e>

"Oversized uppercase display type squeezed into 0.9 line-height, and zero
shadows or gradients… compressed condensed headlines at 130px tower over 16px
body text, creating a dramatic scale ratio."

**Why this one:** the **8:1 display-to-body ratio** is the specific number. Ours
is roughly 136px against 15px — close, so this validates the direction — but
their hero pairs the headline with a *rendered physical object*, which is
exactly what your work images are. Worth reading as confirmation that the
current masthead is not too big, and that the answer to "it feels sparse" is
larger type, not more elements.

## 1.4 ORYZO AI — the isolated object as museum artifact
<https://styles.refero.design/style/1f204e95-454a-437e-845b-c1b169d35607>

"A lone object floating in warm darkness, cream typography the only decoration…
treats a single product object like a museum artifact." Layout alternates two
modes: **photographic hero (product in context) and void-mode reveal (product
isolated on the field)**, joined by hairline dashed dividers.

**Why this one:** this is the case-study page problem exactly. Right now every
media item on a case study is the same kind of block. Alternating "in context"
against "isolated on the blue" would give the page a rhythm, and it costs
nothing but a field on the media item — the WebP pipeline stays untouched.

**One rationing rule from them worth copying:** a single vivid orange appears
"only for credit lines and the studio link — never for buttons or CTAs —
earning its rarity."

## 1.5 Ventriloc — colour rationed to 5% of the page
<https://styles.refero.design/style/f99aca3e-5289-4595-a7cc-77a72052f4b8>

"Pages should read **95% achromatic** with orange appearing only as functional
punctuation for highlights, link underlines, and decorative data accents."
Headings set at **weight 400** — "authority-through-precision" rather than
authority-through-volume. Cards wear **asymmetric corner radii** (sharp
top-right, soft elsewhere).

**Why this one:** we have the inverse problem — 95% chromatic, since the blue
*is* the page. That inversion is worth thinking about explicitly: if blue is the
field rather than the accent, what plays the role of the rare punctuating
colour? Right now nothing does. That may be the single biggest gap in the
system, and it's why the site can read as flat.

## 1.6 Awesomic — hairline borders instead of elevation
<https://styles.refero.design/style/8512e28d-5385-4c20-a336-214568c4370c>

"Hairline 1px borders replace drop shadows as the primary elevation tool… colour
deployed as functional punctuation rather than decoration." Corner radii are
deliberately staged: 36px cards, 14px buttons, 10000px pills.

**Why this one:** a staged radius ladder is a cheap way to build hierarchy we
don't currently have — our frames are square and our pills are round, with
nothing between. Contrast this with monopo (1.1), which forbids the middle
ground entirely. **These two references disagree, and picking a side is a real
decision** rather than something to split.

## 1.7 Resend — mono as the second voice
<https://styles.refero.design/style/0d914ef0-fa84-4c60-a9aa-cef0b5eb6e5d>

"A monospaced font (Commit Mono) carries the developer identity through every
code block, badge, and inline label, making the page read like a terminal
wrapped in a luxury interface." The brand violet "appears in email-address
strings, status icons, and code samples — never on buttons."

**Why this one:** it sets up Part 2 — the strongest single finding in this
whole review.

---

# Part 2 — fontsinuse.com

Swept Branding/Identity (9,076 uses), Web (5,987), Fashion/Apparel, Music, and
Graphic Design, then opened the individual uses closest to our situation.

## 2.1 The finding: display + **mono**, not display + humanist sans

Four independent uses in the Web format landed on the same structure — a display
face for headlines and a **monospace** carrying labels, metadata and captions:

| Use | Typefaces | Link |
|---|---|---|
| GE Beauty | Italian Plate No2 **Expanded** + Italian Plate No2 **Mono** | [/uses/78640](https://fontsinuse.com/uses/78640/ge-beauty) |
| Grays (retail/apparel) | Oceanic Text **Mono** + Ready Active | [/uses/78161](https://fontsinuse.com/uses/78161/grays) |
| Qatsi Tea | POW Covenant **Mono** + Prompt + Inter | [/uses/76757](https://fontsinuse.com/uses/76757/qatsi-tea) |
| Highsnobiety — Guide to Good Sports Marketing | Oficia **Mono** + Univers | [/uses/78850](https://fontsinuse.com/uses/78850/highsnobiety-s-guide-to-good-sports-marketing) |

**Why this matters for us specifically:** the site is full of small tracked
uppercase labels — `.eyebrow`, `.wall-count`, `.filter`, `.piece-label`, the
project meta rows, the breadcrumb. Every one is Lato at 9–12px with letter-
spacing bolted on to make it *behave* like a mono. A real mono would do that job
natively, give those labels their own register instead of a stretched version of
the body voice, and read as "creative technologist" without saying it.

It also delivers the catalogue framing from the crab tutorial (Part 3) for free —
catalogue numbers and spec blocks want to be mono.

**GE Beauty is the structural model to copy:** one superfamily, two registers —
Expanded for display, Mono for labels. No third voice, no new personality.

**Highsnobiety is the cultural proof:** that is your exact audience and adjacent
industry, and the report is set in mono + neo-grotesque.

Free `.ttf` candidates (must be TrueType — Chrome won't embed `.otf`, see
`resume/README.md`): **Martian Mono**, **DM Mono**, **Space Mono**,
**JetBrains Mono**.

## 2.2 Upstatement — the studio-portfolio pattern
<https://fontsinuse.com/uses/78959/upstatement-portfolio-website>

"Rizoma from R-Typography does the heavy lifting, supported by ABC Diatype by
Dinamo." A global design-and-technology studio — the closest analogue on the
site to what you do.

**Why this one:** the support face is **ABC Diatype**, a neutral neo-grotesque —
not a humanist. Across the whole Branding/Identity corpus the recurring
workhorses are Akkurat, Aperçu, Atlas Grotesk, Diatype. **Lato is a 2010
humanist and the outlier.** This is the concrete evidence that the body font,
not the display, is the weak half of our pair.

## 2.3 Daylit Studio — accessibility face as a design position
<https://fontsinuse.com/uses/79109/daylit-studio-website>

"Atkinson Hyperlegible's Bold weight for headings and the menu, Regular for
smaller copy. Newsreader features for the call to action above the footer."

**Why this one:** Atkinson Hyperlegible is the Braille Institute's
legibility-first typeface — free, OFL, ships `.ttf`. Using it in a design studio
site is a *position*, not a fallback. For us it is also substantively correct:
white-on-saturated-blue is a genuinely hard contrast case, which is why `--dim`
is pinned at 0.75 as the WCAG floor. A face engineered for character
disambiguation earns its place here on merit.

Also note the **Newsreader** move: one serif, used for exactly one call to
action above the footer. That is the disciplined version of the "add an
editorial serif" idea — and it maps onto our footer CTA (`LET'S MAKE /
SOMETHING REAL.`) precisely.

## 2.4 Pophouse — single expanded grotesque, artist-brand context
<https://fontsinuse.com/uses/78821/pophouse>

Italian Plate No2 Expanded, alone. Pophouse is a Stockholm music company whose
portfolio is Avicii, Tina Turner, Iron Maiden, Swedish House Mafia.

**Why this one:** artist-brand portfolio, one family, no second voice — the
closest business analogue to the G. Perico / ROC NATION side of your work. It is
the counter-argument to 2.1: single-family discipline is a legitimate answer,
and cheaper than adding a mono.

## 2.5 Platformart — one typeface for a whole art marketplace
<https://fontsinuse.com/uses/52976/platformart>

"Platformart is a contemporary art marketplace backed by David Zwirner… employs
LL Medium as its primary typeface across its website."

**Why this one:** a gallery wall of images with minimal type around them is
structurally identical to your work index. If a Zwirner-backed art platform can
run on one face, the pressure to add typefaces to our wall is worth resisting.

## 2.6 Zohran for NYC / Forge — widths instead of families
<https://fontsinuse.com/uses/78381/zohran-for-new-york-city-campaign-graphics>

Hand-lettered wordmark based on Boheld, with "texts rendered in **multiple
weights and widths** of Union Gothic." Tagged `multiple widths`, `type on type`,
`all caps`. Credited with "forging a new pathway in a long tradition of bland
political campaign graphics."

**Why this one:** it gets range from **width variation inside one family**
rather than a second family. Archivo ships Archivo, Archivo Narrow, Archivo
Expanded and Archivo Black — all OFL `.ttf`. That means an entire display range
that is guaranteed to harmonise with what we already have, at zero risk to the
resume pairing. Of everything in Part 2, **this is the lowest-risk upgrade.**

Attitude-wise it is also the nearest thing here to "DON'T HIRE ME…" — loud,
vernacular, unmistakably from somewhere.

---

# Part 3 — marina_uiux tutorial (carried over)

## 3.1 Scroll-scrubbed video hero on case studies

> Don't jump `currentTime` on every scroll event. Run a `requestAnimationFrame`
> loop tracking a `targetTime` from scroll position, then either play forward at
> variable speed (faster the further behind, clamped 1×–8×) or seek backward
> directly when the target is behind current — browsers can't play in reverse.

Seeks snap to keyframes, so per-tick `currentTime` gives chunky jumps; elevated
`playbackRate` lets the decoder do its job. Plus her buffer gate: hold loading
until ≥20% buffered or 4s elapsed. Per-project opt-in in `content/projects.ts`,
static WebP fallback for reduced-motion and mobile.

## 3.2 A third rung on the text opacity ladder

Hers runs 0.92 / 0.65 / 0.50 / 0.38 / 0.22 and bans gray hex codes. Our text
ladder is two rungs — white and `--dim: 0.75`. Add ~0.5 for large text only;
0.75 is the AA floor for 10px labels and that constraint belongs in the comment.

## 3.3 Catalogue metadata framing

`A.04`, `ARACHNIDA`, coordinates, `Reptid: Invertebrata No. 24` pinned in the
corners. Give each project a catalogue number and a fixed-position spec block.
Pairs with the mono in 2.1.

---

# Shortlist, if you only want three

1. **Mono as the label voice** (2.1) — biggest change in character per unit of
   effort, and it makes 3.3 free.
2. **Archivo width range** (2.6) — display range at zero risk to the resume pair.
3. **Two motion speeds** (1.1) — one line of CSS; the flat 200ms is currently
   doing large images and small pills the same disservice.

# The open question worth answering first

Ventriloc (1.5) rations colour to 5% of the page. We are the inverse — the blue
is the field, not the accent — so **nothing on the site is rare.** Deciding what
plays the rare-punctuation role, or deciding deliberately that nothing does, is
upstream of most of the items above.
