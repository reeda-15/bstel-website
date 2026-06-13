import { getHeroVisualConfig, type HeroVisualVariant } from "@/lib/hero-visual";

export function PageHeroVisual({ variant }: { variant: HeroVisualVariant }) {
  const config = getHeroVisualConfig(variant);

  return (
    <div className={`page-hero-visual hero-visual-${config.variant}`} aria-hidden="true">
      <span className="hero-visual-grid" />
      <span className="hero-visual-route route-one" />
      <span className="hero-visual-route route-two" />
      <span className="hero-visual-route route-three" />
      <span className="hero-visual-node node-one" />
      <span className="hero-visual-node node-two" />
      <span className="hero-visual-node node-three" />
      <span className="hero-visual-panel panel-one" />
      <span className="hero-visual-panel panel-two" />
      <span className="hero-visual-label">{config.label}</span>
    </div>
  );
}
