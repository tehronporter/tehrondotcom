import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";

/*
 * The role variables below are the stable typography API for the site.
 * When licensed Grtsk and Ogg files arrive, only the sources in this module
 * need to change; components and CSS continue to use --font-primary,
 * --font-editorial, and --font-mono.
 */
const primaryFallback = localFont({
  src: [
    {
      path: "../assets/fonts/Lato-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lato-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-primary-loaded",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-loaded",
});

export const fontVariables = `${primaryFallback.variable} ${mono.variable}`;
