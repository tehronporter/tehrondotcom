import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Lines } from "@/components/Lines";
import { contact } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description: contact.intro[0],
});

export default function ContactPage() {
  const projectEmail = `mailto:${site.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent("Hi Tehron,\n\nI'm building...\n\nTimeline:\nProject type:\n")}`;

  return (
    <div className="page">
      <div className="cat-head top">
        <p className="document-kicker">CONTACT DETAILS</p>
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
        <a className="contact-link contact-primary" href={projectEmail}>
          <span className="k">START A PROJECT</span>
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

        <a className="contact-link" href={site.resume} target="_blank" rel="noreferrer noopener">
          <span className="k">RÉSUMÉ</span>
          <span className="v">
            PDF <Icon name="arrow-up-right" size={16} />
          </span>
        </a>

        {/* Availability is not repeated here — it is already the line directly
            under the headline above, and as a seventh row it also left an odd
            item in a two-column grid, i.e. an empty grey cell beside it. */}
        <div className="contact-link">
          <span className="k">BASED</span>
          <span className="v">{site.location}</span>
        </div>
      </section>
    </div>
  );
}
