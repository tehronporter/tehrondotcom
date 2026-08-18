import Image from "next/image";
import type { Media } from "@/content/projects";
import { imageProps } from "@/lib/images";

/** One media item on a case study page: the image (or empty frame) plus its caption. */
export function CaseStudyMedia({
  item,
  sizes,
  priority,
  lightboxIndex,
}: {
  item: Media;
  sizes: string;
  priority?: boolean;
  /** Position in the page's lightbox list. Omitted for an empty frame. */
  lightboxIndex?: number;
}) {
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
       fallback is only reached for an image the pipeline has not measured
       yet, and matches the .frame aspect ratio so it degrades to exactly
       the framing this had before. */
    <Image
      src={item.src}
      /* The button around this carries the description and the action, so the
         image itself would otherwise be announced twice. */
      alt={lightboxIndex === undefined ? item.alt : ""}
      {...imageProps(item.src, { width: 1600, height: 1000 })}
      sizes={sizes}
      priority={priority}
    />
  );

  return (
    <figure className={item.span === "half" ? undefined : "full"}>
      {lightboxIndex === undefined ? (
        <div className="frame">{image}</div>
      ) : (
        /* Opening is wired by delegation in Lightbox.tsx off this data
           attribute, so the page stays server-rendered and no callback has to
           be threaded down from the route. */
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
