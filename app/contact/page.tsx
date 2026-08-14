import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Lines } from "@/components/Lines";
import { contact } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.intro[0],
};

export default function ContactPage() {
  return (
    <div className="page">
      <div className="cat-head top">
        <h1 className="display cat-title">
          <Lines lines={contact.titleLines} />
        </h1>
        <p className="cat-meta">{contact.availability}</p>
      </div>

      <section className="prose">
        <div>
          {contact.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Full-bleed, matching the project index rows. */}
      <section className="contact-links">
        <a className="contact-link" href={`mailto:${site.email}`}>
          <span className="k">EMAIL</span>
          <span className="v">
            {site.email} <Icon name="arrow-right" size={16} />
          </span>
        </a>

        {site.socials.map((social) => (
          <a
            key={social.label}
            className="contact-link"
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="k">{social.label}</span>
            <span className="v">
              {social.handle} <Icon name="arrow-up-right" size={16} />
            </span>
          </a>
        ))}

        <div className="contact-link">
          <span className="k">BASED</span>
          <span className="v">{site.location}</span>
        </div>
      </section>
    </div>
  );
}
