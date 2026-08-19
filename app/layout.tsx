import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name.split(" ").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ")}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          SKIP TO CONTENT
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
