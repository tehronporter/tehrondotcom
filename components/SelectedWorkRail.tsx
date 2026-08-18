"use client";

import Image from "next/image";
import Link from "next/link";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { ResolvedSelectedWork } from "@/content/home";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SelectedWorkRail({ items }: { items: ResolvedSelectedWork[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFrame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = rootRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (root && finePointer && !reducedMotion()) root.setAttribute("data-cursor-ready", "");
    const hideOnResize = () => cursorRef.current?.removeAttribute("data-visible");
    window.addEventListener("resize", hideOnResize);

    return () => {
      if (cursorFrame.current !== undefined) cancelAnimationFrame(cursorFrame.current);
      window.removeEventListener("resize", hideOnResize);
    };
  }, []);

  const moveCursor = useCallback((event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion()) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (cursorFrame.current !== undefined) cancelAnimationFrame(cursorFrame.current);
    cursorFrame.current = requestAnimationFrame(() => {
      const x = Math.max(8, Math.min(event.clientX + 14, window.innerWidth - cursor.offsetWidth - 8));
      const y = Math.max(8, Math.min(event.clientY + 14, window.innerHeight - cursor.offsetHeight - 8));
      cursor.style.transform =
        "translate3d(" + x + "px, " + y + "px, 0)";
    });
  }, []);

  const showCursor = useCallback((event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion()) return;
    cursorRef.current?.setAttribute("data-visible", "");
  }, []);

  const hideCursor = useCallback(() => {
    cursorRef.current?.removeAttribute("data-visible");
  }, []);

  const scrollWithKeyboard = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: (event.key === "ArrowRight" ? 1 : -1) * track.clientWidth * 0.72,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  }, []);

  return (
    <div className="selected-work" ref={rootRef}>
      <div className="selected-work-heading home-gutter">
        <div>
          <p className="home-label">CURATED PROJECTS</p>
          <h2 id="selected-work-title" className="editorial-accent">
            Selected Work
          </h2>
        </div>
        <p className="selected-work-count">01 — {String(items.length).padStart(2, "0")}</p>
      </div>

      <p id="selected-work-instructions" className="sr-only">
        Horizontally scroll through selected projects. Use the left and right arrow keys while the gallery is focused.
      </p>

      <div
        className="selected-work-track"
        ref={trackRef}
        role="region"
        aria-labelledby="selected-work-title"
        aria-describedby="selected-work-instructions"
        tabIndex={0}
        onKeyDown={scrollWithKeyboard}
      >
        {items.map((item, index) => {
          const number = String(index + 1).padStart(2, "0");

          if (item.kind === "placeholder") {
            return (
              <article className="selected-card selected-card-placeholder" key={"placeholder-" + item.title}>
                <div className="selected-card-media" style={{ background: item.background }}>
                  <p className="placeholder-status">{item.status}</p>
                  <p className="placeholder-title">{item.title}</p>
                  <p className="placeholder-mark" aria-hidden="true">
                    TP
                  </p>
                </div>
                <div className="selected-card-meta">
                  <h3>{item.title}</h3>
                  <p>
                    {number} / {item.meta}
                  </p>
                </div>
              </article>
            );
          }

          const { project, media } = item;
          return (
            <article className="selected-card" key={project.categorySlug + "/" + project.slug}>
              <Link
                href={project.href}
                className="selected-card-link"
                onPointerEnter={showCursor}
                onPointerMove={moveCursor}
                onPointerLeave={hideCursor}
                onBlur={hideCursor}
              >
                <div className="selected-card-media" style={{ background: media.background }}>
                  <Image
                    src={project.featured.src}
                    alt={project.featured.alt}
                    fill
                    className="selected-card-image"
                    style={{
                      objectFit: media.objectFit ?? "cover",
                      objectPosition: media.objectPosition ?? project.featured.focus ?? "50% 50%",
                    }}
                    sizes="(max-width: 760px) 82vw, (max-width: 1100px) 44vw, 31vw"
                    priority={index === 0}
                    {...(project.featured.blurDataURL
                      ? { placeholder: "blur" as const, blurDataURL: project.featured.blurDataURL }
                      : {})}
                  />
                </div>
                <div className="selected-card-meta">
                  <h3>{project.name}</h3>
                  <p>
                    {number} / {project.tags.join(" / ")}
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <div className="project-cursor" ref={cursorRef} aria-hidden="true">
        VIEW PROJECT ↗
      </div>
    </div>
  );
}
