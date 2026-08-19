"use client";

import Image from "next/image";
import type { Media } from "@/content/projects";
import { imageProps } from "@/lib/images";

/**
 * One media item on a case study page: the image (or empty frame) plus its
 * caption. A client component only so `heroName` can be applied via ref
 * instead of the `style` prop — see the comment on `setHeroName` below.
 */
export function CaseStudyMedia({
  item,
  sizes,
  priority,
  heroName,
  lightboxIndex,
}: {
  item: Media;
  sizes: string;
  priority?: boolean;
  /* Matches whichever media item is the project's `featured` image to the same
     view-transition-name PortfolioBrowser.tsx puts on that image on the project
     browser — so the folder the visitor clicked morphs into the hero here
     instead of the page just cross-fading under it. */
  heroName?: string;
  /** Position in the page's lightbox list. Omitted for an empty frame. */
  lightboxIndex?: number;
}) {
  /* Applied via ref rather than the `style` prop so it never lands in the
     server-rendered HTML. Chrome has a real, if intermittent, bug where an
     element carrying `view-transition-name` on its very first painted frame —
     with no view transition actually in flight, which is every direct load,
     refresh, or shared link — can fail to paint at all until something else
     forces a repaint. Setting it a tick later, once the element exists,
     sidesteps that while still landing long before the one place the name is
     read: the browser's `document.startViewTransition`, which only ever fires
     on an in-app click from a folder, well after this has mounted. */
  const setHeroName = (el: HTMLImageElement | null) => {
    if (el && heroName) el.style.viewTransitionName = heroName;
  };

  /* Empty frames hold the layout until real images are dropped into /public.
     There is nothing to enlarge, so they are never lightbox triggers. */
  if (!item.src) {
    return (
      <figure className={item.span === "half" ? undefined : "full"}>
        <div className="frame">
          <span>{item.alt}</span>
        </div>
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>
    );
  }

  const image = (
    /* Dimensions come from the file itself via the manifest. The 1600x1000
       fallback is only reached for an image the pipeline has not measured yet,
       and matches the .frame aspect ratio so it degrades to exactly the framing
       this had before. */
    <Image
      src={item.src}
      /* The button around this carries the description and the action, so the
         image itself would otherwise be announced twice. */
      alt={lightboxIndex === undefined ? item.alt : ""}
      {...imageProps(item.src, { width: 1600, height: 1000 })}
      sizes={sizes}
      priority={priority}
      ref={setHeroName}
    />
  );

  return (
    <figure className={item.span === "half" ? undefined : "full"}>
      {lightboxIndex === undefined ? (
        <div className="frame">{image}</div>
      ) : (
        /* Opening is wired by delegation in Lightbox.tsx off this data
           attribute, so the page stays server-rendered and no callback has to
           be threaded down from the route. A real button, not a click handler
           on the figure: this is the only way into the full-size image, so it
           has to be reachable by keyboard and announced as opening a dialog. */
        <button
          type="button"
          className="frame frame-open"
          data-lightbox={lightboxIndex}
          aria-haspopup="dialog"
          aria-label={`${item.alt} — view larger`}
        >
          {image}
        </button>
      )}
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  );
}
