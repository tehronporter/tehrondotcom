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
}: {
  item: Media;
  sizes: string;
  priority?: boolean;
  /* Matches whichever media item is the project's `featured` image to the
     same view-transition-name Frame.tsx puts on that image on the home wall
     (see Gallery.tsx) — so the piece the visitor clicked morphs into place
     here instead of the page just cross-fading under it. */
  heroName?: string;
}) {
  /* Applied via ref rather than the `style` prop so it never lands in the
     server-rendered HTML. Chrome has a real, if intermittent, bug where an
     element carrying `view-transition-name` on its very first painted frame —
     with no view transition actually in flight, which is every direct load,
     refresh, or shared link — can fail to paint at all until something else
     forces a repaint. Setting it a tick later, once the element exists,
     sidesteps that while still landing long before the one place the name is
     read: Gallery.tsx's `document.startViewTransition`, which only ever fires
     on an in-app click from the wall, well after this has mounted. */
  const setHeroName = (el: HTMLImageElement | null) => {
    if (el && heroName) el.style.viewTransitionName = heroName;
  };

  return (
    <figure className={item.span === "half" ? undefined : "full"}>
      <div className="frame">
        {item.src ? (
          /* Dimensions come from the file itself via the manifest. The 1600x1000
             fallback is only reached for an image the pipeline has not measured
             yet, and matches the .frame aspect ratio so it degrades to exactly
             the framing this had before. */
          <Image
            src={item.src}
            alt={item.alt}
            {...imageProps(item.src, { width: 1600, height: 1000 })}
            sizes={sizes}
            priority={priority}
            ref={setHeroName}
          />
        ) : (
          <span>{item.alt}</span>
        )}
      </div>
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  );
}
