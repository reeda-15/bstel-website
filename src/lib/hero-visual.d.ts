export type HeroVisualVariant = "home" | "services" | "coverage" | "projects" | "careers";

export type HeroVisualConfig = {
  variant: HeroVisualVariant;
  label: string;
};

export function getHeroVisualConfig(variant: string): HeroVisualConfig;
