import type { Metadata, Viewport } from "next";
import { Anton, Inter, Permanent_Marker } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { site } from "@/content/site";
import "./globals.css";

/* Self-hosted at build time — no external font request, no layout shift. */
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * The marker the folders are labelled in. It replaces a stack of system
 * handwriting faces — Marker Felt, Segoe Print, Bradley Hand — which meant the
 * folders were written in three different hands depending on the visitor's OS,
 * and in whatever the browser calls `cursive` on the machines that have none
 * of the three. That was survivable while the writing was 7px of decoration.
 * It is not now that it is the folder's title.
 *
 * Self-hosted at build time by next/font, same as the other two: one more file
 * on the wire, no external request, no package.
 */
const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-marker",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /* The home route is the only one that ever surfaces these three — every
     other route calls pageMetadata with its own `title`, which overrides all
     three below rather than filling the template. So this is the browser tab,
     the share-sheet title, and the link-preview headline for the site itself,
     and all three used to read as the full tagline sentence. A share sheet
     is read at a glance; a name is what belongs there, the way the OG image's
     own wordmark already only says the name. */
  title: {
    default: site.name,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${marker.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          SKIP TO CONTENT
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
