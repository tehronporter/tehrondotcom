"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

/** HOME is an exact match; WORK stays lit across every page under /work. */
function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      {/* The signature is the wordmark. It's an image, so the accessible name
          lives on the link and the img stays alt="" to avoid announcing twice. */}
      <Link href="/" className="header-left" aria-label={`${site.name}, ${site.role}, home`}>
        <Image
          src="/brand/signature-white.png"
          alt=""
          width={348}
          height={260}
          className="wordmark-signature"
          priority
        />
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
