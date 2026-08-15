"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Frame } from "@/components/Frame";
import { Icon } from "@/components/Icon";
import type { GalleryPiece } from "@/content/projects";

const ALL = "ALL";

/** How long the outgoing pieces fade before the wall closes the gap. */
const FADE = 170;
/** How long a surviving piece takes to travel to its new position. */
const TRAVEL = 420;

const matches = (piece: GalleryPiece, tag: string) => tag === ALL || piece.tags.includes(tag);

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Gallery({ pieces, tags }: { pieces: GalleryPiece[]; tags: string[] }) {
  /* Two filters, one step apart. `pending` is what the user just clicked and it
     drives the fade; `active` commits a moment later and is what actually takes
     pieces out of the layout. Splitting them is what buys the fade-out — a piece
     removed from the flow immediately has nothing left to animate. */
  const [active, setActive] = useState(ALL);
  const [pending, setPending] = useState(ALL);

  const wall = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect>>(new Map());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /* The FLIP animation in flight per piece. Kept so a fast second click can
     cancel the first: an interrupted transform animation otherwise stays
     applied and leaves the piece parked away from its grid track. Tracked here
     rather than read back off the element so cancelling can't catch the CSS
     opacity transition by mistake. */
  const flips = useRef<Map<string, Animation>>(new Map());

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      flips.current.forEach((animation) => animation.cancel());
    },
    [],
  );

  const choose = useCallback(
    (tag: string) => {
      if (tag === pending) return;
      setPending(tag);

      const commit = () => {
        /* Measure while the old layout is still on screen. */
        before.current.clear();
        wall.current?.querySelectorAll<HTMLElement>("[data-piece]").forEach((el) => {
          if (!el.hidden) before.current.set(el.dataset.piece as string, el.getBoundingClientRect());
        });
        setActive(tag);
      };

      clearTimeout(timer.current);
      if (reducedMotion()) commit();
      else timer.current = setTimeout(commit, FADE);
    },
    [pending],
  );

  /* FLIP: grid tracks aren't animatable, so each surviving piece is offset back
     to where it just was and allowed to travel to where it now is. Pieces that
     weren't on the wall a moment ago fade up in place instead. Done with the Web
     Animations API rather than a motion library — the site ships three
     dependencies and this is about forty lines. */
  useLayoutEffect(() => {
    if (before.current.size === 0) return;
    if (reducedMotion()) {
      before.current.clear();
      return;
    }

    const options: KeyframeAnimationOptions = {
      duration: TRAVEL,
      easing: "cubic-bezier(.22,.61,.36,1)",
    };

    wall.current?.querySelectorAll<HTMLElement>("[data-piece]").forEach((el) => {
      const key = el.dataset.piece as string;
      flips.current.get(key)?.cancel();
      flips.current.delete(key);

      if (el.hidden) return;
      const prev = before.current.get(key);
      const next = el.getBoundingClientRect();

      if (!prev) {
        flips.current.set(key, el.animate([{ opacity: 0 }, { opacity: 1 }], options));
        return;
      }

      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (!dx && !dy) return;

      flips.current.set(
        key,
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], options),
      );
    });

    before.current.clear();
  }, [active]);

  const shown = pieces.filter((piece) => matches(piece, active)).length;

  return (
    <>
      {tags.length > 0 && (
        <div className="filters" role="group" aria-label="Filter work by keyword">
          {[ALL, ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              className="filter"
              aria-pressed={pending === tag}
              onClick={() => choose(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="wall" ref={wall}>
        {pieces.map((piece, i) => (
          <article
            key={piece.slug}
            className="piece"
            data-piece={piece.slug}
            /* Deterministic three-step cycle off the source order, not the
               visible order — the hang stays put when the wall is filtered,
               and it can't drift between server and client. */
            data-drop={i % 3}
            data-out={matches(piece, pending) ? undefined : ""}
            hidden={!matches(piece, active)}
          >
            <Link href={piece.href} className="piece-link">
              <Frame piece={piece} priority={i < 3}>
                {/* Decorative restatement of the caption below, so it is not
                    announced twice. The title is already an inch away — the
                    veil only adds the sentence and the affordance. */}
                <div className="piece-veil" aria-hidden="true">
                  <p className="piece-note">{piece.shortDescription}</p>
                  <span className="piece-cta">
                    VIEW PROJECT <Icon name="arrow-right" size={13} />
                  </span>
                </div>
              </Frame>

              <div className="piece-label">
                <h3 className="piece-title">{piece.name}</h3>
                {piece.tags.length > 0 && <p className="piece-tags">{piece.tags.join(" / ")}</p>}
                <p className="piece-note-caption">{piece.shortDescription}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Announced on filter change; the count itself is visible in the wall. */}
      <p className="sr-only" role="status">
        {shown} {shown === 1 ? "project" : "projects"} shown
        {active === ALL ? "" : `, filtered by ${active}`}.
      </p>
    </>
  );
}
