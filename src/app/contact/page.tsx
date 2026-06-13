import { ContactForm } from "@/components/ContactForm";
import { contact } from "@/lib/site-data";

const contactIntents = [
  ["Route rollout", "Fibre, HDD, ducting, splicing or access network deployment."],
  ["O&M support", "Fault response, NOC coordination and ongoing network maintenance."],
  ["Connectivity", "Leased lines, FTTH/FTTB, Wi-Fi hotspots or enterprise data links."],
  ["Projects", "Public, enterprise, CCTV and infrastructure support requirements."],
];

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero contact-page-hero" data-reveal="hero">
        <span className="eyebrow">CONTACT BSTEL</span>
        <h1>Discuss a fibre route, O&M requirement or connectivity project.</h1>
        <p>Share the service, location, timeline or support need and the right BSTEL team member will respond within one business day.</p>
      </section>

      <section className="contact-intent-strip" aria-label="Contact enquiry types">
        {contactIntents.map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </article>
        ))}
      </section>

      <section className="section contact-layout">
        <div data-reveal="left"><ContactForm /></div>
        <aside className="contact-side" data-reveal="right">
          <div className="direct-card">
            <span className="eyebrow green-text">REACH US DIRECTLY</span>
            <h2>Speak to the right team.</h2>
            <p><strong>Altaf Sheikh - Founder & MD</strong><a href="tel:+919822704786">+91 98227 04786</a></p>
            <p><strong>Kashaf Sheikh - Director</strong><a href="tel:+917720044786">+91 77200 44786</a></p>
            <p><strong>NOC - 24x7 support</strong><a className="green-text" href="tel:+917709042392">+91 77090 42392</a></p>
            <hr />
            <a href={contact.emailHref}>{contact.email}</a>
            <a href={`mailto:${contact.kashafEmail}`}>{contact.kashafEmail}</a>
          </div>
          <div className="office-card">
            <span className="eyebrow">REGISTERED OFFICE</span>
            <h3>Nagpur, Maharashtra</h3>
            <p>{contact.address}</p>
            <a href={contact.maps} target="_blank" rel="noreferrer">Open in Google Maps</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
