"use client";

import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { Icon } from "@/components/Icon";
import { Lines } from "@/components/Lines";

export function Footer() {
  /* The contact page already is the call to action — don't repeat it there. */
  const showCta = usePathname() !== "/contact";

  return (
    <footer>
      {showCta && (
        <section className="footer">
          <h2 className="display">
            <Lines lines={site.cta.headline} />
          </h2>
          <a className="footer-email" href={`mailto:${site.email}`}>
            {site.email.toUpperCase()} <Icon name="arrow-right" />
          </a>
        </section>
      )}

      <div className="footer-bottom">
        {/* Prerendered at build time; the year can lag a live client on Jan 1. */}
        <span suppressHydrationWarning>
          {site.location} &nbsp;·&nbsp; © {new Date().getFullYear()} {site.name}
        </span>
        <nav className="socials" aria-label="Social">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
              {s.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`}>EMAIL</a>
        </nav>
      </div>
    </footer>
  );
}
