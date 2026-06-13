import type { ReactNode } from "react";
import type { ExploreOverviewItem } from "@/lib/explore-overview";

type OverviewIconKey = ExploreOverviewItem["icon"];

const paths: Record<OverviewIconKey, ReactNode> = {
  services: (
    <>
      <path d="M7 12 L16 7 L25 12 V22 L16 27 L7 22 Z" />
      <path d="M16 7 V16 M7 12 L16 16 L25 12" />
      <path d="M11 19 L16 22 L21 19" />
    </>
  ),
  coverage: (
    <>
      <path d="M16 27 C21.5 22, 24 17.5, 24 13 C24 8.6, 20.4 5, 16 5 C11.6 5, 8 8.6, 8 13 C8 17.5, 10.5 22, 16 27 Z" />
      <circle cx="16" cy="13" r="3.2" />
      <path d="M6 24 C10 21.8, 22 21.8, 26 24" />
    </>
  ),
  projects: (
    <>
      <rect x="6" y="8" width="20" height="16" rx="3" />
      <path d="M10 13 H17 M10 18 H22" />
      <path d="M20 6 V10 M12 6 V10" />
      <circle cx="22" cy="13" r="1.5" />
    </>
  ),
  about: (
    <>
      <circle cx="16" cy="10" r="4" />
      <path d="M8 26 C9.5 20.5, 22.5 20.5, 24 26" />
      <path d="M23 9 C25.5 10.4, 27 12.8, 27 16" />
      <path d="M9 9 C6.5 10.4, 5 12.8, 5 16" />
    </>
  ),
  careers: (
    <>
      <rect x="6" y="10" width="20" height="15" rx="3" />
      <path d="M12 10 V8 C12 6.9, 12.9 6, 14 6 H18 C19.1 6, 20 6.9, 20 8 V10" />
      <path d="M6 16 H26" />
      <path d="M13 20 H19" />
    </>
  ),
};

export function OverviewIcon({ icon }: { icon: OverviewIconKey }) {
  return (
    <span className={`overview-icon overview-icon-${icon}`} aria-hidden="true">
      <svg viewBox="0 0 32 32">{paths[icon]}</svg>
    </span>
  );
}
