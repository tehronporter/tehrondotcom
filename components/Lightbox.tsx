"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

/** One enlargeable image, with its dimensions already resolved on the server. */
export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  placeholder?: "blur";
  blurDataURL?: string;
};

/**
 * Full-bleed view of a case study image.
 *
 * The case study gallery paints at roughly 200px a cell, which is enough to
 * show what a project contains and nowhere near enough to show how it was made.
 * This is where the craft is actually legible.
 *
 * Built on a native <dialog>, which brings the parts that are easy to get
 * wrong by hand: a real focus trap, Escape, inert content behind it, and focus
 * returned to the thumbnail that opened it. Opening is delegated off the
 * `data-lightbox` attribute CaseStudyMedia renders, so the page around this
 * stays entirely server-rendered.
 */
export function Lightbox({ items }: { items: LightboxItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = index === null ? undefined : items[index];

  /* Closes and clears in one act rather than closing and waiting to be told.
     `close()` is specified to fire a `close` event, but it is queued as a task
     and a throttled or backgrounded renderer can sit on it — which leaves the
     figure mounted and, far worse, the body still scroll-locked behind a
     dialog that has visually gone. Observed, not theoretical. The listener
     below stays for the one path this cannot intercept. */
  const close = useCallback(() => {
    dialog.current?.close();
    setIndex(null);
  }, []);

  const step = useCallback(
    (delta: number) =>
      setIndex((current) =>
        current === null ? current : (current + delta + items.length) % items.length,
      ),
    [items.length],
  );

  /* Delegated so every figure on the page is wired by one listener, and so
     nothing has to be passed down through the server components in between. */
  useEffect(() => {
    if (items.length === 0) return;

    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest?.("[data-lightbox]");
      if (!trigger) return;
      const at = Number(trigger.getAttribute("data-lightbox"));
      if (!Number.isInteger(at) || at < 0 || at >= items.length) return;
      setIndex(at);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [items.length]);

  /* State is the source of truth for which image shows; the dialog's own open
     state is driven from it. `close` is listened for rather than assumed,
     because Escape closes the dialog without going through our handler. */
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    if (index === null) {
      if (el.open) el.close();
      return;
    }
    if (!el.open) el.showModal();
  }, [index]);

  /* Backstop for a close we did not initiate — the dialog's own light-dismiss
     paths. Idempotent: setting an already-null index changes nothing. */
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => setIndex(null);
    el.addEventListener("close", onClose);
    el.addEventListener("cancel", onClose);
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("cancel", onClose);
    };
  }, []);

  /* The page behind a modal dialog still scrolls on its own — locking it is
     ours to do.

     The container to lock is `.workspace-scroll`, not `document.body`. This is
     an app shell: the body is already `overflow: hidden` and never scrolls, and
     the workspace pane inside it is what actually moves. Locking the body here
     is what the same component did on a page that scrolled normally, and it is
     a no-op in this layout — the case study would keep scrolling under the
     open dialog on every wheel gesture over the backdrop.

     Falls back to the body so the component still behaves if it is ever mounted
     outside the shell. Restored to whatever was there before rather than to a
     hardcoded value, since the stylesheet, not this, owns the resting state. */
  useEffect(() => {
    if (index === null) return;
    const scroller: HTMLElement =
      document.querySelector<HTMLElement>(".workspace-scroll") ?? document.body;
    const previous = scroller.style.overflow;
    scroller.style.overflow = "hidden";
    return () => {
      scroller.style.overflow = previous;
    };
  }, [index]);

  /* Escape is handled here as well as by the dialog itself. The native close
     is the one that dismisses it; this is what guarantees our state follows,
     without depending on the `close` event arriving. Not prevented — the
     browser's own handling should still run. */
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (items.length > 1 && e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (items.length > 1 && e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, items.length, step, close]);

  if (items.length === 0) return null;

  return (
    <dialog
      className="lightbox"
      ref={dialog}
      aria-label="Enlarged image"
      /* The backdrop is the dialog's own padding box, so a click that lands on
         the element itself — rather than on the figure inside it — is a click
         outside the image. */
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      {open && (
        <figure className="lightbox-figure">
          <Image
            key={open.src}
            src={open.src}
            alt={open.alt}
            width={open.width}
            height={open.height}
            sizes="100vw"
            className="lightbox-img"
            /* The stylesheet sizes the box off this rather than off the loaded
               file — see .lightbox-img in globals.css. */
            style={{ "--ar": open.width / open.height } as CSSProperties}
            {...(open.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: open.blurDataURL }
              : {})}
          />
          <figcaption className="lightbox-caption">
            <span>{open.caption ?? open.alt}</span>
            {items.length > 1 && (
              <span className="lightbox-count">
                {(index ?? 0) + 1} / {items.length}
              </span>
            )}
          </figcaption>
        </figure>
      )}

      <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
        <Icon name="close" size={18} />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox-nav prev"
            onClick={() => step(-1)}
            aria-label="Previous image"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <button
            type="button"
            className="lightbox-nav next"
            onClick={() => step(1)}
            aria-label="Next image"
          >
            <Icon name="arrow-right" size={20} />
          </button>
        </>
      )}
    </dialog>
  );
}
