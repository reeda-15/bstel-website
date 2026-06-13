import { CoverageExplorer } from "@/components/CoverageExplorer";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHeroVisual } from "@/components/PageHeroVisual";

export default function CoveragePage() {
  return (
    <main>
      <section className="page-hero" data-reveal="hero">
        <PageHeroVisual variant="coverage" />
        <span className="eyebrow">GEOGRAPHIC FOOTPRINT</span>
        <h1>Coverage built around fibre routes, districts and support response.</h1>
        <p>Full-state capability in Maharashtra, Madhya Pradesh, Chhattisgarh and Goa, with key district operations across Uttar Pradesh and Gujarat.</p>
      </section>
      <section className="coverage-proof-band" aria-label="Coverage proof">
        <span><strong data-count-stat="4" suppressHydrationWarning>0</strong><small>Full coverage states</small></span>
        <span><strong data-count-stat="2" suppressHydrationWarning>0</strong><small>Key district footprints</small></span>
        <span><strong data-count-stat="24" data-count-suffix="x7" suppressHydrationWarning>0x7</strong><small>NOC-backed support</small></span>
        <span><strong data-count-stat="130" data-count-suffix="+" suppressHydrationWarning>0+</strong><small>District delivery reach</small></span>
      </section>
      <section className="section" data-reveal="scale">
        <div className="section-head coverage-page-head">
          <span className="eyebrow">COVERAGE STATUS</span>
          <h2>Select a state to see coverage detail.</h2>
          <p>Use the map and district list to understand full-state availability, key district coverage and regions planned for future expansion.</p>
        </div>
        <CoverageExplorer />
      </section>
      <CtaBanner title="Discuss a route or district requirement." text="Our footprint is growing - talk to us about your region, rollout scope or O&M requirement." label="Contact Us" />
    </main>
  );
}
