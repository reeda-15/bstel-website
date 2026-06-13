"use client";

import ShaderBackground from "@/components/ui/shader-background";

export function ShaderHeroBackground() {
  return (
    <div className="shader-hero-background" aria-hidden="true">
      <ShaderBackground />
      <span />
    </div>
  );
}
