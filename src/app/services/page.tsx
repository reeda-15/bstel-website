import type { CSSProperties } from "react";
import Image from "next/image";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHeroVisual } from "@/components/PageHeroVisual";
import { ServiceIcon } from "@/components/ServiceIcon";
import { getRevealDelay } from "@/lib/reveal";
import { serviceAreas } from "@/lib/site-data";

const serviceVisuals: Record<string, { src: string; alt: string }> = {
  infra: {
    src: "/assets/services/passive-infrastructure.jpg",
    alt: "Fibre optic cable representing passive telecom infrastructure",
  },
  fibre: {
    src: "/assets/services/fibre-deployment.jpg",
    alt: "Fibre cable drums prepared for network deployment",
  },
  connectivity: {
    src: "/assets/services/enterprise-connectivity.jpg",
    alt: "High-speed fibre optic data streams for enterprise connectivity",
  },
  security: {
    src: "/assets/services/security-support.jpg",
    alt: "Digital network globe showing connected coverage and monitoring",
  },
};

const serviceCapabilities: Record<string, {
  summary: string;
  chips: string[];
  cards: { icon: string; title: string; text: string; featured?: boolean }[];
}> = {
  infra: {
    summary:
      "Physical network assets and access readiness for operators, public projects and enterprise rollout teams.",
    chips: ["IP-1 Licensed", "ROW support", "Duct readiness", "Tower access"],
    cards: [
      {
        icon: "Internet Leased Lines",
        title: "Licensed passive infrastructure",
        text: "Dark fibre, right-of-way, duct space and tower assets delivered under BSTEL's IP-1 licence.",
        featured: true,
      },
      {
        icon: "Scalable & Customizable Solutions",
        title: "Network integration",
        text: "New routes and assets aligned with existing operator, enterprise and public network environments.",
      },
      {
        icon: "Quality Assurance & Guarantees",
        title: "Route readiness checks",
        text: "Feasibility review, site coordination and execution planning before deployment starts.",
      },
    ],
  },
  fibre: {
    summary:
      "Field teams for fibre laying, splicing, trenchless work and long-term O&M across backbone and access routes.",
    chips: ["Low-loss splicing", "HDD execution", "Cable blowing", "24x7 O&M"],
    cards: [
      {
        icon: "Fibre Optical Laying & Network Maintenance",
        title: "Fibre rollout and maintenance",
        text: "End-to-end OFC laying, route execution and preventive maintenance for reliable uptime.",
        featured: true,
      },
      {
        icon: "Horizontal Directional Drilling (HDD)",
        title: "Trenchless underground routes",
        text: "HDD and duct installation for routes where surface disruption must stay minimal.",
      },
      {
        icon: "Fibre Optic Splicing",
        title: "Splicing and testing",
        text: "Precision splicing, loss control and OTDR-backed quality checks for dependable links.",
      },
      {
        icon: "Cable Blowing",
        title: "Cable blowing",
        text: "Fast, clean cable installation into prepared ducts and conduits.",
      },
    ],
  },
  connectivity: {
    summary:
      "Reliable bandwidth and access solutions for offices, campuses, homes, public networks and Wi-Fi environments.",
    chips: ["Leased lines", "FTTH / FTTB", "Wi-Fi hotspots", "Scalable bandwidth"],
    cards: [
      {
        icon: "Internet Leased Lines",
        title: "Dedicated enterprise links",
        text: "Stable leased-line connectivity for sites that need predictable bandwidth and uptime.",
        featured: true,
      },
      {
        icon: "FTTH & FTTB",
        title: "FTTH and FTTB rollout",
        text: "Last-mile fibre builds for residential, building and dense access network requirements.",
      },
      {
        icon: "Wi-Fi Hotspot Installation & O&M",
        title: "Public and enterprise Wi-Fi",
        text: "Hotspot deployment, operations and support for public areas and business environments.",
      },
      {
        icon: "Scalable & Customizable Solutions",
        title: "Bandwidth planning",
        text: "Symmetrical or asymmetrical capacity models matched to usage, cost and growth.",
      },
    ],
  },
  security: {
    summary:
      "Monitoring, surveillance and quality controls that keep network environments dependable after rollout.",
    chips: ["24x7 NOC", "CCTV support", "QA discipline", "Flexible contracts"],
    cards: [
      {
        icon: "Advanced Network Security & Monitoring",
        title: "Network monitoring",
        text: "Operational visibility, escalation support and monitoring discipline for critical links.",
        featured: true,
      },
      {
        icon: "CCTV Installation & Maintenance",
        title: "CCTV installation and care",
        text: "Camera deployment and maintenance support for public, business and infrastructure sites.",
      },
      {
        icon: "Quality Assurance & Guarantees",
        title: "Quality assurance",
        text: "Testing, checks and service guarantees built into delivery and maintenance workflows.",
      },
      {
        icon: "Flexible Contract Options",
        title: "Support models",
        text: "Flexible engagement structures for SMBs, enterprises and long-term operators.",
      },
    ],
  },
};

const serviceProof = [
  ["IP-1 Licensed", "Passive infrastructure provider"],
  ["24x7 NOC", "Monitoring and escalation"],
  ["130+ Districts", "Operational coverage"],
  ["Since 2007", "Telecom delivery experience"],
];

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero with-tabs" data-reveal="hero">
        <PageHeroVisual variant="services" />
        <span className="eyebrow">OUR SERVICES</span>
        <h1>Fibre rollout, connectivity, O&M and digital infrastructure.</h1>
        <p>Licensed infrastructure, field execution and support services for operators, public projects and enterprises that need dependable networks.</p>
      </section>

      <section className="service-overview-strip" aria-label="Service overview">
        <div className="service-overview-track">
          {[...serviceAreas, ...serviceAreas].map((area, index) => {
            const isDuplicate = index >= serviceAreas.length;

            return (
              <a
                aria-hidden={isDuplicate}
                href={`#${area.id}`}
                key={`${area.id}-${index}`}
                tabIndex={isDuplicate ? -1 : undefined}
              >
                <span>{area.number}</span>
                <strong>{area.title}</strong>
                <small>{area.summary}</small>
              </a>
            );
          })}
        </div>
      </section>

      {serviceAreas.map((area, index) => {
        const capability = serviceCapabilities[area.id];

        return (
        <section className={index % 2 ? "section tinted service-section" : "section service-section"} id={area.id} key={area.id}>
          <div className="service-head" data-reveal>
            <b>{area.number}</b>
            <div>
              <h2>{area.title}</h2>
              <p>{capability.summary}</p>
              <div className="service-proof-chips" aria-label={`${area.title} proof points`}>
                {capability.chips.map((chip) => <span key={chip}>{chip}</span>)}
              </div>
            </div>
          </div>
        <div className={index % 2 ? "service-section-layout reverse" : "service-section-layout"}>
          <figure className="service-image-card" data-reveal>
            <Image
              alt={serviceVisuals[area.id].alt}
              fill
              sizes="(max-width: 760px) 100vw, 34vw"
              src={serviceVisuals[area.id].src}
            />
          </figure>
          <div className={`service-capability-grid card-count-${capability.cards.length}`}>
            {capability.cards.map((card, cardIndex) => (
              <article
                className={card.featured ? "dark-card service-card service-card-featured" : "card service-card service-card-compact"}
                key={card.title}
                data-reveal
                style={{ "--reveal-delay": getRevealDelay(cardIndex) } as CSSProperties}
              >
                <ServiceIcon name={card.icon} />
                {card.featured ? <span>{capability.chips[0]}</span> : null}
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
        </section>
        );
      })}
      <section className="service-proof-band" aria-label="Operations proof">
        {serviceProof.map(([metric, label]) => (
          <span key={metric}>
            <strong>{metric}</strong>
            <small>{label}</small>
          </span>
        ))}
      </section>
      <CtaBanner title="Discuss a fibre route or O&M requirement." text="Tell us the route, site type or uptime target and our team will recommend the right infrastructure approach." />
    </main>
  );
}
