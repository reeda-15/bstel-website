import { CtaBanner } from "@/components/CtaBanner";
import { PageHeroVisual } from "@/components/PageHeroVisual";
import { contact, roles } from "@/lib/site-data";
import { getRevealDelay } from "@/lib/reveal";
import type { CSSProperties } from "react";

export default function CareersPage() {
  return (
    <main>
      <section className="page-hero" data-reveal="hero">
        <PageHeroVisual variant="careers" />
        <span className="eyebrow">CAREERS</span>
        <h1>Build the networks India runs on.</h1>
        <p>Join a field-first telecom team working across fibre deployment, NOC operations, O&M support and district-scale network delivery.</p>
      </section>
      <section className="section careers-proof-section">
        <div className="section-head compact" data-reveal>
          <span className="eyebrow">WHY BSTEL</span>
          <h2>Practical telecom careers with real infrastructure impact.</h2>
          <p>Work on live routes, operator networks and support workflows where quality, uptime and field discipline matter every day.</p>
        </div>
        <div className="card-grid three">
          {[
            ["01", "Field work that matters", "The fibre you splice and the routes you build carry traffic for businesses, public networks and districts."],
            ["02", "Learn from operators", "Work with teams experienced in fibre rollout, fault response, NOC coordination and O&M execution."],
            ["03", "Grow with the footprint", "As coverage expands into new states and districts, field, support and coordination responsibilities grow too."],
          ].map(([num, title, text], index) => <article className="card" key={num} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}><b>{num}</b><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
      <section className="section tinted">
        <div className="section-head compact careers-head" data-reveal><span className="eyebrow">OPEN ROLES</span><h2>Current field, fibre and network roles</h2><p>Send your profile for active and upcoming requirements across deployment, splicing and network operations.</p></div>
        <div className="role-list">
          {roles.map(([title, meta], index) => (
            <article key={title} data-reveal style={{ "--reveal-delay": getRevealDelay(index) } as CSSProperties}>
              <div><h3>{title}</h3><p>{meta}</p><span>{roleType(title)}</span></div>
              <a className="button secondary" href={`mailto:${contact.kashafEmail}?subject=Application%20for%20${encodeURIComponent(title)}`}>Apply by email</a>
            </article>
          ))}
        </div>
      </section>
      <CtaBanner title="Send your CV for field, fibre and NOC roles." text="We review profiles for current openings and upcoming project requirements." href={`mailto:${contact.kashafEmail}`} label="Email your CV" />
    </main>
  );
}

function roleType(title: string) {
  if (title.includes("Splicing")) return "Fibre field role";
  if (title.includes("NOC")) return "Network operations";
  return "Project delivery";
}
