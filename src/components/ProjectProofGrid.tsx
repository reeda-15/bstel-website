import type { CSSProperties } from "react";
import { projectProofPoints } from "@/lib/project-proof";
import { getRevealDelay } from "@/lib/reveal";

export function ProjectProofGrid() {
  return (
    <div className="project-proof-grid">
      {projectProofPoints.map((point, index) => (
        <article
          className="project-proof-card"
          key={point.title}
          data-reveal
          style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}
        >
          <div>
            <strong>{point.metric}</strong>
            <span>{point.label}</span>
          </div>
          <h3>{point.title}</h3>
          <p>{point.text}</p>
        </article>
      ))}
    </div>
  );
}
