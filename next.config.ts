import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    /* AVIF first, WebP as the fallback — the browser picks via Accept. AVIF
       costs more to encode on the first request for a given size, but that is
       paid once per (image, width) into a durable cache, and it lands 25-35%
       under WebP on artwork with large flat areas, which is most of this wall. */
    formats: ["image/avif", "image/webp"],

    /* Trimmed to the widths this layout can actually ask for. The shell caps at
       1720px and the widest figure is inset to 1608px, so 1620 covers 1x and
       2560 covers 2x — which is also the ceiling `npm run images` encodes to.
       Dropping 3840 removes a candidate no source can satisfy: next/image would
       serve a 2560px file under it anyway, as a second cache entry and a second
       billed transformation for identical pixels. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1620, 2048, 2560],
  },
};

export default nextConfig;
