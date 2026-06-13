import Link from "next/link";
import type { CSSProperties } from "react";
import { OverviewIcon } from "@/components/OverviewIcon";
import { getExploreOverviewItems } from "@/lib/explore-overview";
import { getRevealDelay } from "@/lib/reveal";

export function ExploreOverview() {
  return (
    <section className="section explore-overview">
      <div className="section-head compact" data-reveal>
        <span className="eyebrow">EXPLORE BSTEL</span>
        <h2>Plan, build and operate your network with one infrastructure partner.</h2>
        <p>Move from capability to coverage, delivery proof and the team behind the work.</p>
      </div>
      <div className="overview-grid">
        {getExploreOverviewItems().map((item, index) => (
          <Link
            className="overview-card"
            href={item.href}
            key={item.href}
            data-reveal
            style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <OverviewIcon icon={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <b>Open page →</b>
          </Link>
        ))}
      </div>
    </section>
  );
}
