import Image from "next/image";
import type { ReactNode } from "react";
import type { GalleryPiece } from "@/content/projects";

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
 */
export function Frame({
  piece,
  priority,
  children,
}: {
  piece: GalleryPiece;
  priority?: boolean;
  children?: ReactNode;
}) {
  const { featured, frameStyle } = piece;

  return (
    <div className="piece-plate" data-frame={frameStyle}>
      <div className="piece-frame">
        <Image
          src={featured.src}
          alt={featured.alt}
          width={featured.width}
          height={featured.height}
          className="piece-art"
          style={featured.focus ? { objectPosition: featured.focus } : undefined}
          sizes="(max-width: 760px) 92vw, (max-width: 1180px) 46vw, 34vw"
          priority={priority}
        />
      </div>
      {children}
    </div>
  );
}
