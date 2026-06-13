import Image from "next/image";
import type { CSSProperties } from "react";
import { projectLogos } from "@/lib/project-logos";
import { getRevealDelay } from "@/lib/reveal";

export function ProjectLogoGrid() {
  return (
    <div className="project-logo-grid">
      {projectLogos.map((logo, index) => (
        <article
          className="project-logo-card"
          key={logo.file}
          data-reveal
          style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}
        >
          <div className="project-logo-box">
            <Image
              src={`/project-logos/clean/${logo.file}`}
              alt={logo.name}
              width={180}
              height={132}
              className="project-logo-image"
            />
          </div>
          <span>{logo.name}</span>
        </article>
      ))}
    </div>
  );
}
