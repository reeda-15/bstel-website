import type { CSSProperties } from "react";
import { clientSuccessTimeline } from "@/lib/client-success";
import { getRevealDelay } from "@/lib/reveal";

export function ClientSuccessTimeline() {
  return (
    <div className="client-success-timeline">
      {clientSuccessTimeline.map((item, index) => (
        <article
          className="client-success-step"
          data-reveal
          key={`${item.year}-${item.title}`}
          style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}
        >
          <span>{item.year}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}
