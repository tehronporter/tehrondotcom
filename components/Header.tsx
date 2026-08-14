"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

/** WORK stays lit for the home page and everything under /work. */
function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/work");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      {/* The wordmark is a logo, not a heading — each page owns its own <h1>.
          The role line is not shown; it rides along in the label so screen
          reader users still get it. */}
      <Link href="/" className="header-left" aria-label={`${site.name}, ${site.role}, home`}>
        <p className="wordmark">{site.name}</p>
      </Link>

      <div className="header-right">
        <nav className="nav" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href, pathname) ? "active" : undefined}
              aria-current={isActive(item.href, pathname) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Personal mark, not a link — the wordmark above already carries the
            name and the home link, so this stays out of the accessibility tree. */}
        <Image
          src="/brand/signature-white.png"
          alt=""
          width={348}
          height={260}
          className="signature"
          priority
        />
      </div>
    </header>
  );
}
