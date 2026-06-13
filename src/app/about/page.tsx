import type { CSSProperties } from "react";
import { CtaBanner } from "@/components/CtaBanner";
import { getRevealDelay } from "@/lib/reveal";

const proofPoints = [
  ["IP-1", "Licensed telecom infrastructure provider"],
  ["2007", "Field operations started as Bharat Services"],
  ["24x7", "NOC-backed network monitoring and support"],
  ["130+", "Districts reached through project delivery"],
];

const operatingModel = [
  ["Plan", "Route surveys, feasibility checks and rollout planning for fibre and utility corridors."],
  ["Build", "Civil execution, OFC deployment, splicing, testing and handover with field discipline."],
  ["Operate", "Network monitoring, escalation handling and coordination for always-on infrastructure."],
  ["Maintain", "Preventive maintenance, fault response and O&M support for long-term uptime."],
];

const timelineItems = [
  ["2007", "Started as Bharat Services with telecom field operations in Nagpur."],
  ["2008-14", "Expanded into broadband, digital TV and last-mile connectivity services."],
  ["2015-16", "Shifted focus toward fibre infrastructure, route delivery and network support."],
  ["2017", "Rebranded as BSTEL Digital Solutions Pvt. Ltd. for infrastructure-led growth."],
  ["2018-now", "Scaled OFC, NOC and O&M capabilities across multi-state telecom projects."],
];

const principles = [
  ["Vision", "Long-term direction", "To become a dependable infrastructure partner for operators, public projects and enterprises building high-availability digital networks."],
  ["Mission", "Operating promise", "To plan, deploy and maintain fibre networks with transparent execution, responsive support and measurable uptime outcomes."],
];

const leaders = [
  {
    initials: "AS",
    name: "Altaf Sheikh",
    role: "Founder & Managing Director",
    phone: "+91 98227 04786",
    href: "tel:+919822704786",
    points: ["Infrastructure strategy", "Operator partnerships"],
  },
  {
    initials: "KS",
    name: "Kashaf Sheikh",
    role: "Director",
    phone: "+91 77200 44786",
    href: "tel:+917720044786",
    points: ["Delivery coordination", "Client operations"],
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="ABOUT BSTEL"
        title="Built from field telecom experience. Trusted for fibre infrastructure."
        text="BSTEL Digital Solutions is an IP-1 licensed telecom infrastructure partner helping operators, public projects and enterprises plan, deploy and maintain reliable digital networks."
      />

      <section className="section about-intro-grid">
        <div className="about-story" data-reveal="left">
          <span className="eyebrow">OUR STORY</span>
          <h2>From Bharat Services to a full-scale infrastructure partner.</h2>
          <p>
            Founded in 2007 as <strong>Bharat Services</strong>, BSTEL grew from hands-on telecom field delivery into a broader infrastructure company focused on fibre rollout, network monitoring and long-term operations support.
          </p>
          <p>
            Today, our work is built around one simple promise: help customers expand connectivity with disciplined execution, responsive maintenance and a team that understands the realities of network deployment on the ground.
          </p>
        </div>

        <div className="about-proof-grid" data-reveal="right">
          {proofPoints.map(([value, label], index) => (
            <article className="about-proof-card" key={label} style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-operating-model">
        <div className="section-head about-operating-head" data-reveal>
          <span className="eyebrow">HOW WE WORK</span>
          <h2>Plan, build, operate and maintain telecom networks.</h2>
          <p>One infrastructure partner for the practical stages that decide rollout quality, service reliability and long-term customer confidence.</p>
        </div>
        <div className="operating-model-grid">
          {operatingModel.map(([title, text], index) => (
            <article className="operating-model-card" key={title} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="timeline about-timeline" data-reveal>
        <span className="eyebrow green-text">OUR TIMELINE</span>
        <h2>Growth led by field capability and infrastructure focus.</h2>
        <div>
          {timelineItems.map(([year, text]) => (
            <article key={year}>
              <b>{year}</b>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-principles">
        <div className="section-head compact" data-reveal>
          <span className="eyebrow">VISION & MISSION</span>
          <h2>Reliable infrastructure, delivered with field discipline.</h2>
        </div>
        <div className="card-grid two">
          {principles.map(([title, label, text], index) => (
            <article className="card large principle-card" key={title} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section tinted about-leadership">
        <div className="section-head compact" data-reveal>
          <span className="eyebrow">LEADERSHIP</span>
          <h2>Experienced operators behind field delivery.</h2>
          <p>Direct leadership access keeps project decisions, route requirements and support escalations clear.</p>
        </div>
        <div className="leader-grid">
          {leaders.map((leader, index) => (
            <article className="leader-card" key={leader.name} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <span className="leader-avatar">{leader.initials}</span>
              <div>
                <h3>{leader.name}</h3>
                <p>{leader.role}</p>
                <a href={leader.href}>{leader.phone}</a>
                <ul>
                  {leader.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner title="Discuss a fibre route or O&M requirement." text="Bring us your route, uptime requirement or network challenge." />
    </main>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-hero about-page-hero" data-reveal="hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}
