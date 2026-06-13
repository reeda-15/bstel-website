export type ExploreOverviewItem = {
  title: string;
  icon: "services" | "coverage" | "projects" | "about" | "careers";
  summary: string;
  href: string;
};

export function getExploreOverviewItems(): ExploreOverviewItem[];
