"use client";

import Image from "next/image";
import type { PointerEvent, ReactNode } from "react";
import { useCallback, useRef } from "react";
import type { GalleryPiece } from "@/content/projects";
import { WALL_SIZES, type WallDensity } from "@/lib/sizes";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One piece of artwork inside its gold moulding.
 *
 * The moulding is a `border-image` on `.piece-frame`, so the artwork sits in the
 * content box and the frame surrounds it — the same relationship a real rabbet
 * has to a canvas. The image keeps its own intrinsic aspect ratio rather than
 * being forced into a uniform box, which is what stops the wall from reading as
 * a grid of identical tiles and means nothing is ever stretched.
 *
 * `data-frame` sits on the outer plate rather than on the frame itself so that
 * the rail depth it sets is inherited by anything layered over the artwork —
 * the hover veil has to inset by exactly the same amount to land inside the
 * moulding. `children` is that overlay.
 *
 * Deliberately named apart from the plain `.frame` on the case study pages:
 * gilding belongs to the home wall only, and the project pages keep showing
 * their galleries unframed.
 *
 * Pointer movement over the frame tilts it a couple of degrees toward the
 * cursor — `--tilt-rx` / `--tilt-ry` are two of the inputs `.piece-frame`
 * composes into its one `transform` in globals.css, alongside the hover lift
 * and Gallery.tsx's scroll parallax, so this never has to know about (or
 * clobber) what those are doing. Mouse only: touch has no hover state to lean
 * into, and reduced motion skips it outright.
 */
export function Frame({
  piece,
  density,
  priority,
  children,
}: {
  piece: GalleryPiece;
  density: WallDensity;
  priority?: boolean;
  children?: ReactNode;
}) {
  const { featured, frameStyle } = piece;
  const frameRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | undefined>(undefined);

  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion()) return;
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-ry", `${(x * 7).toFixed(2)}deg`);
      el.style.setProperty("--tilt-rx", `${(y * -7).toFixed(2)}deg`);
    });
  }, []);

  const onLeave = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  }, []);

  /* Applied via ref rather than the `style` prop so it never lands in the
     server-rendered HTML. Chrome has a real, if intermittent, bug where an
     element carrying `view-transition-name` on its very first painted frame —
     with no view transition actually in flight, which is every direct load —
     can fail to paint at all until something else forces a repaint. Setting it
     a tick later, once the element exists, sidesteps that while still landing
     long before the one place the name is read: Gallery.tsx's
     `document.startViewTransition`, which only fires on an in-app click. */
  const setHeroName = useCallback(
    (el: HTMLImageElement | null) => {
      if (el) el.style.viewTransitionName = `piece-hero-${piece.slug}`;
    },
    [piece.slug],
  );

  return (
    <div className="piece-plate" data-frame={frameStyle}>
      <div className="piece-frame" ref={frameRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        <Image
          src={featured.src}
          alt={featured.alt}
          width={featured.width}
          height={featured.height}
          className="piece-art"
          style={featured.focus ? { objectPosition: featured.focus } : undefined}
          ref={setHeroName}
          /* The density tier sets --col-max, which is the hard ceiling on how
             wide a piece is ever painted — so it, not a vw fraction, is what
             the browser should be told. See WALL_SIZES. */
          sizes={WALL_SIZES[density]}
          priority={priority}
          {...(featured.blurDataURL
            ? { placeholder: "blur" as const, blurDataURL: featured.blurDataURL }
            : {})}
        />
      </div>
      {children}
    </div>
  );
}
