"use client";

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
      {/* The wordmark is a logo, not a heading — each page owns its own <h1>. */}
      <Link href="/" className="header-left" aria-label={`${site.name}, home`}>
        <p className="wordmark">{site.name}</p>
        <p className="wordmark-sub">{site.role}</p>
      </Link>

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
    </header>
  );
}
