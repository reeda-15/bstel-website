import Link from "next/link";
import type { CSSProperties } from "react";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { ExploreOverview } from "@/components/ExploreOverview";
import { HomeProofBand } from "@/components/HomeProofBand";
import { Icon } from "@/components/Icon";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ShaderHeroBackground } from "@/components/ShaderHeroBackground";
import { getCoveragePreview } from "@/lib/coverage-preview";
import { whyBstel } from "@/lib/site-data";
import { getRevealDelay } from "@/lib/reveal";

export default function HomePage() {
  const coveragePreview = getCoveragePreview();
  const homeServiceHighlights = [
    {
      href: "/services#infra",
      icon: "Passive Infrastructure",
      title: "IP-1 infrastructure assets",
      text: "Dark fibre, right-of-way, duct space and towers for operator rollouts.",
    },
    {
      href: "/services#fibre",
      icon: "Fibre Deployment & O&M",
      title: "Fibre rollout and O&M",
      text: "Laying, splicing, HDD, cable blowing and long-term maintenance teams.",
    },
    {
      href: "/services#connectivity",
      icon: "Enterprise Connectivity",
      title: "Dedicated enterprise links",
      text: "Leased lines, FTTH/FTTB, high-speed data and managed Wi-Fi networks.",
    },
    {
      href: "/services#security",
      icon: "Security, Quality & Support",
      title: "Monitoring and site security",
      text: "Network security, CCTV, QA discipline and support for dependable uptime.",
    },
  ];

  return (
    <main>
      <section className="hero home-hero" data-reveal="hero">
        <ShaderHeroBackground />
        <div>
          <span className="pill hero-enter hero-enter-one"><i /> Trusted by leading operators since 2007</span>
          <AnimatedHeadline text="Telecom infrastructure, built end to end." />
          <p className="hero-enter hero-enter-three">Fibre-optic design, deployment and maintenance for India&apos;s leading operators - delivered on time, on budget, with 24x7 NOC support.</p>
          <div className="actions hero-enter hero-enter-four">
            <Link className="button green" href="/contact">Request a Quote</Link>
            <Link className="button secondary" href="/services">Explore Services</Link>
          </div>
        </div>
      </section>

      <HomeProofBand />

      <section className="section tinted home-services">
        <div className="section-head" data-reveal>
          <span className="eyebrow">OUR SERVICES</span>
          <h2>Licensed infrastructure, fibre rollout, connectivity and support.</h2>
          <Link href="/services">View all services</Link>
        </div>
        <div className="card-grid four">
          {homeServiceHighlights.map((service, index) => (
            <Link className="card linked" href={service.href} key={service.href} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <Icon label={service.icon} />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="coverage-teaser" data-reveal="scale">
        <div>
          <span className="eyebrow green-text">GEOGRAPHIC FOOTPRINT</span>
          <h2>Six states. 130+ districts. One network partner.</h2>
          <p>Full-state coverage across Maharashtra, Madhya Pradesh and Chhattisgarh, plus Goa and key districts in Uttar Pradesh and Gujarat.</p>
          <div className="coverage-metrics">
            {coveragePreview.metrics.map(([value, label]) => (
              <span key={label}><strong>{value}</strong><small>{label}</small></span>
            ))}
          </div>
          <div className="coverage-actions">
            <Link className="button green" href="/coverage">View Coverage Map</Link>
            <Link className="coverage-text-link" href="/contact">Need a custom route? Contact us</Link>
          </div>
        </div>
        <div className="coverage-preview-panel">
          <div className="state-chip-grid">
            {coveragePreview.chips.map((chip) => (
              <span className={`state-chip ${chip.tone}`} key={chip.name}>
                <b>{chip.status}</b>
                <strong>{chip.name}</strong>
                <small>{chip.detail}</small>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section split home-why">
        <div className="sticky-copy" data-reveal="left">
          <span className="eyebrow">WHY BSTEL</span>
          <h2>Built for operators who can&apos;t afford downtime</h2>
          <p>From backbone fibre to last-mile networks, we give operators scalable, future-ready infrastructure they can trust.</p>
          <Link href="/about">More about us</Link>
        </div>
        <div className="card-grid two">
          {whyBstel.map(([number, title, text], index) => (
            <article className="card" key={number} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <b>{number}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">OUR CLIENTS</span>
          <h2>Trusted by operators, public projects and enterprises.</h2>
          <Link href="/projects">View clients</Link>
        </div>
        <div data-reveal>
          <LogoMarquee />
        </div>
      </section>

      <ExploreOverview />
    </main>
  );
}
