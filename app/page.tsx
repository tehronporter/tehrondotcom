import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Lines } from "@/components/Lines";
import { hero } from "@/content/site";
import { categories, num } from "@/content/projects";

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-row">
          <h1 className="display headline">
            <Lines lines={hero.headline} />
          </h1>

          {/* Carries real meaning rather than decoration, so it gets a real
              alt rather than being hidden from screen readers. */}
          <Image
            src="/brand/portrait.jpg"
            alt="Painted portrait of Tehron Porter grappling a bull"
            width={1100}
            height={1366}
            className="hero-portrait"
            priority
          />
        </div>
      </section>

      <div className="divider" />

      <div className="row-head">
        <h2 className="eyebrow">SELECTED WORK</h2>
        <Link href="/work" className="row-link">
          ALL WORK <Icon name="arrow-right" size={14} />
        </Link>
      </div>

      <section className="stage">
        <div className="space">
          {categories.map((category, i) => (
            <Link key={category.slug} href={`/work/${category.slug}`} className="card">
              <div className="folder-wrap">
                <div className="folder">
                  <Icon name={category.icon} size={25} />
                </div>
              </div>
              <div className="card-num">{num(i)}</div>
              <div className="card-title-row">
                <h3 className="card-title">
                  <Lines lines={category.titleLines} />
                </h3>
                <span className="card-arrow">
                  <Icon name="arrow-right" size={14} />
                </span>
              </div>
              <div className="card-tags">
                <Lines lines={category.tags} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
