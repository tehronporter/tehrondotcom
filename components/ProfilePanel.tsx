import Link from "next/link";
import { Icon } from "@/components/Icon";
import { site } from "@/content/site";

export function ProfilePanel() {
  return (
    <section className="profile-panel" aria-label="Tehron Porter profile">
      <div className="profile-panel-head">
        <p>ABOUT THIS ARCHIVE</p>
        <span>PORTFOLIO INFORMATION</span>
      </div>
      <div className="profile-name display">TEHRON<br />PORTER</div>
      <div className="profile-summary">
        <p className="profile-kicker">{site.role}</p>
        <p>Brand identities, digital products, physical objects, and creative experiments.</p>
        <p>{site.location} / AVAILABLE WORLDWIDE</p>
        <Link href="/about" className="inline-link">MORE ABOUT TEHRON <Icon name="arrow-right" size={13} /></Link>
      </div>
      <div className="profile-connect">
        <p className="profile-kicker">CONNECT</p>
        <a href={`mailto:${site.email}`}><Icon name="mail" size={16} /> {site.email}</a>
        {site.socials.slice(0, 2).map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noreferrer noopener">
            <Icon name="arrow-up-right" size={15} /> {social.label}
          </a>
        ))}
      </div>
      <div className="signature-mark" aria-hidden="true" />
    </section>
  );
}
