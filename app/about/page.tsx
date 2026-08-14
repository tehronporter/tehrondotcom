import type { Metadata } from "next";
import { Lines } from "@/components/Lines";
import { about } from "@/content/pages";

export const metadata: Metadata = {
  title: "About",
  description: about.intro[0],
};

export default function AboutPage() {
  return (
    <div className="page">
      <div className="cat-head top">
        <h1 className="display cat-title">
          <Lines lines={about.titleLines} />
        </h1>
      </div>

      <section className="prose">
        <div>
          {about.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div>
          <h2>APPROACH</h2>
          {about.statement.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div>
          <h2>CAPABILITIES</h2>
          <div className="capabilities">
            {about.capabilities.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>EXPERIENCE</h2>
          <div className="list-rows">
            {about.experience.map((row) => (
              <div className="list-row" key={row.k}>
                <span className="k">{row.k}</span>
                <span className="v">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
