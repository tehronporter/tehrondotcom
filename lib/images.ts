import manifest from "@/content/image-manifest.json";

/**
 * Intrinsic dimensions and a blur placeholder for every image under
 * `public/work`, measured from the files themselves by `npm run images`.
 *
 * This exists so no image dimension is ever hand-typed. Hand-typed numbers go
 * stale the moment a file is re-exported or re-compressed, and a wrong aspect
 * ratio is invisible in review but shifts the layout for every visitor.
 *
 * Server-only by construction: the manifest is ~17KB and has no business in a
 * client bundle. Client components receive already-resolved image values.
 */

export type ImageMeta = {
  width: number;
  height: number;
  /** ~185 byte inline WebP, decoded as the placeholder while the real file loads. */
  blurDataURL: string;
};

const entries = manifest as Record<string, ImageMeta>;

export const imageMeta = (src: string): ImageMeta | undefined => entries[src];

/**
 * next/image props for a file under `public/`, resolved from the manifest.
 *
 * Falls back to whatever the caller declares when there is no entry, so an
 * image dropped in before the pipeline has run still renders — it just goes
 * without a placeholder until the next `npm run images`. A missing manifest
 * entry must never be able to break a page.
 */
export function imageProps(
  src: string,
  fallback: { width: number; height: number },
): {
  width: number;
  height: number;
  placeholder?: "blur";
  blurDataURL?: string;
} {
  const meta = imageMeta(src);
  if (!meta) return fallback;
  return {
    width: meta.width,
    height: meta.height,
    placeholder: "blur",
    blurDataURL: meta.blurDataURL,
  };
}
