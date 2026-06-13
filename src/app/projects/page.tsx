import { CtaBanner } from "@/components/CtaBanner";
import { ClientSuccessTimeline } from "@/components/ClientSuccessTimeline";
import { LogoGrid } from "@/components/LogoGrid";
import { ProjectLogoGrid } from "@/components/ProjectLogoGrid";
import { ProjectProofGrid } from "@/components/ProjectProofGrid";
import { PageHeroVisual } from "@/components/PageHeroVisual";
import { capabilityMix, projects } from "@/lib/site-data";
import { getRevealDelay } from "@/lib/reveal";
import type { CSSProperties } from "react";

export default function ProjectsPage() {
  return (
    <main>
      <section className="page-hero" data-reveal="hero">
        <PageHeroVisual variant="projects" />
        <span className="eyebrow">PROJECTS & CLIENTS</span>
        <h1>Delivered in the field, proven at scale.</h1>
        <p>Selected project environments, operators and delivery proof across fibre infrastructure, public networks and enterprise connectivity.</p>
      </section>
      <section className="section split project-capability-section">
        <div data-reveal="left">
          <span className="eyebrow">INFRA CAPABILITY</span>
          <h2>Delivery mix across the network lifecycle.</h2>
          <p>Our work spans underground routes, backbone fibre, last-mile FTTH and long-term OSP/OFC maintenance for public, operator and enterprise environments.</p>
        </div>
        <div className="bar-list" data-reveal="right">
          {capabilityMix.map(([label, value, tone]) => (
            <div key={label}>
              <span><b>{label}</b><em>{value}%</em></span>
              <i><strong className={String(tone)} style={{ width: `${value}%` }} /></i>
            </div>
          ))}
        </div>
      </section>
      <section className="section tinted">
        <div className="section-head compact clients-head" data-reveal>
          <span className="eyebrow">OUR PROJECTS</span>
          <h2>Project types we are equipped to deliver.</h2>
          <p>Field-ready execution across access networks, underground routes and monitored security infrastructure.</p>
        </div>
        <div className="card-grid three">
          {projects.map(([tag, title, text], index) => (
            <article className="project-card" key={title} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <div className={`project-photo project-visual-${index + 1}`}>
                <div className="project-visual-grid">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span>{tag}</span>
                <b>{index === 0 ? "Live access" : index === 1 ? "Route build" : "Site security"}</b>
              </div>
              <span>{tag}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head compact clients-head" data-reveal>
          <span className="eyebrow">OUR PROJECTS</span>
          <h2>Public, enterprise and infrastructure environments</h2>
          <p>Selected organisations and project environments where BSTEL has delivered connectivity, fibre or infrastructure support.</p>
        </div>
        <ProjectLogoGrid />
      </section>
      <section className="section">
        <div className="section-head compact clients-head" data-reveal>
          <span className="eyebrow">OUR CLIENTS</span>
          <h2>Operators and enterprises we serve</h2>
          <p>Trusted across telecom, fibre infrastructure, enterprise connectivity and managed networks.</p>
        </div>
        <LogoGrid />
        <ClientSuccessTimeline />
      </section>
      <section className="section tinted">
        <div className="section-head compact clients-head" data-reveal>
          <span className="eyebrow">DELIVERY PROOF</span>
          <h2>Built for dependable field execution</h2>
          <p>Operational strengths that make BSTEL credible for public, operator and enterprise project work.</p>
        </div>
        <ProjectProofGrid />
      </section>
      <CtaBanner title="Have a project, route or client requirement to discuss?" text="Share the location, service requirement or support scope and our team will respond." />
    </main>
  );
}
