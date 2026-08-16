"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent, PointerEvent } from "react";
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

type ViewTransition = {
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
};

/* The browser can refuse or abort the visual transition for reasons outside
   our control — the pointer still moving into the click, the tab losing
   focus, another transition still settling — without that ever meaning the
   navigation itself failed. Every promise on the transition gets a no-op
   catch so none of that surfaces as an unhandled rejection. */
const silence = (transition: ViewTransition) => {
  transition.ready.catch(() => {});
  transition.updateCallbackDone.catch(() => {});
  transition.finished.catch(() => {});
};

export function Gallery({ pieces, tags }: { pieces: GalleryPiece[]; tags: string[] }) {
  /* Two filters, one step apart. `pending` is what the user just clicked and it
     drives the fade; `active` commits a moment later and is what actually takes
     pieces out of the layout. Splitting them is what buys the fade-out — a piece
     removed from the flow immediately has nothing left to animate. */
  const [active, setActive] = useState(ALL);
  const [pending, setPending] = useState(ALL);

  const router = useRouter();
  const wall = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect>>(new Map());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /* The FLIP animation in flight per piece. Kept so a fast second click can
     cancel the first: an interrupted transform animation otherwise stays
     applied and leaves the piece parked away from its grid track. Tracked here
     rather than read back off the element so cancelling can't catch the CSS
     opacity transition by mistake. */
  const flips = useRef<Map<string, Animation>>(new Map());
  const spotlightRaf = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      flips.current.forEach((animation) => animation.cancel());
      if (spotlightRaf.current) cancelAnimationFrame(spotlightRaf.current);
    },
    [],
  );

  /* Scroll parallax: pieces drift a few px against the scroll rather than
     travelling with it 1:1, like they sit slightly proud of the wall. Lands in
     --parallax-y, one of the inputs .piece-frame composes into its own
     transform in globals.css — this loop never sets `transform` directly, so
     it can't collide with the hover lift or the cursor tilt in Frame.tsx. */
  useEffect(() => {
    if (reducedMotion()) return;

    let raf: number | undefined;

    const strength = () => {
      const raw = wall.current ? getComputedStyle(wall.current).getPropertyValue("--parallax-strength") : "";
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : 1;
    };

    const apply = () => {
      raf = undefined;
      const centerY = window.innerHeight / 2;
      const k = strength();
      wall.current?.querySelectorAll<HTMLElement>(".piece-frame").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = rect.top + rect.height / 2 - centerY;
        const offset = Math.max(-16, Math.min(16, distance * -0.04 * k));
        el.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      });
    };

    const onScroll = () => {
      if (raf !== undefined) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Track lighting: a soft glow that follows the cursor across the wall,
     switched on for the duration the pointer is actually over it. Mouse only,
     off under reduced motion, and the CSS itself only renders it on
     hover-capable devices — this handler is harmless dead weight on touch. */
  const onWallPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion()) return;
    const el = wall.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRaf.current) cancelAnimationFrame(spotlightRaf.current);
    spotlightRaf.current = requestAnimationFrame(() => {
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    });
  }, []);

  const onWallPointerEnter = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion()) return;
    wall.current?.setAttribute("data-spotlight", "");
  }, []);

  const onWallPointerLeave = useCallback(() => {
    wall.current?.removeAttribute("data-spotlight");
  }, []);

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

  /* Wall -> case study as a native View Transition: the piece's own image
     carries a matching view-transition-name on both ends (Frame.tsx and the
     case study page), so it morphs in place while the rest of the page
     cross-fades under it — feature-detected and reduced-motion-gated, so
     anywhere it's unsupported this is just a normal Link click. The double rAF
     is the standard way to give the App Router's async navigation a moment to
     paint before the API takes its "after" snapshot. */
  const openPiece = useCallback(
    (href: string) => {
      const doc = typeof document !== "undefined" ? (document as ViewTransitionDocument) : undefined;
      if (!doc?.startViewTransition || reducedMotion()) {
        router.push(href);
        return;
      }
      try {
        silence(
          doc.startViewTransition(
            () =>
              new Promise<void>((resolve) => {
                router.push(href);
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
              }),
          ),
        );
      } catch {
        /* startViewTransition itself can throw synchronously (not just
           reject) when the browser won't grant a transition right now — the
           callback above may never have run, so push explicitly. */
        router.push(href);
      }
    },
    [router],
  );

  const onPieceClick = useCallback(
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      openPiece(href);
    },
    [openPiece],
  );

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

      <div
        className="wall"
        ref={wall}
        onPointerMove={onWallPointerMove}
        onPointerEnter={onWallPointerEnter}
        onPointerLeave={onWallPointerLeave}
      >
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
            style={{ "--wall-i": i } as CSSProperties}
          >
            <Link href={piece.href} className="piece-link" onClick={onPieceClick(piece.href)}>
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

        <div className="wall-spotlight" aria-hidden="true" />
      </div>

      {/* Announced on filter change; the count itself is visible in the wall. */}
      <p className="sr-only" role="status">
        {shown} {shown === 1 ? "project" : "projects"} shown
        {active === ALL ? "" : `, filtered by ${active}`}.
      </p>
    </>
  );
}
