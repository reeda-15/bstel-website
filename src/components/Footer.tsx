import Image from "next/image";
import Link from "next/link";
import { footerStats, footerTrustBadges } from "@/lib/footer-content";
import { contact, navLinks, serviceAreas } from "@/lib/site-data";

const coverageCodes = ["MH", "MP", "CG", "GA", "UP", "GJ"];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-routes" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="footer-cta">
        <div>
          <span>ROUTE, ROLLOUT OR O&amp;M REQUIREMENT?</span>
          <h2>Discuss a fibre route or O&amp;M requirement.</h2>
        </div>
        <div className="footer-cta-actions">
          <Link className="button primary" href="/contact">Request a Quote</Link>
          <Link className="button ghost light" href="/coverage">View Coverage</Link>
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <span>
              <Image src="/assets/logo-0.png" alt="BSTEL" width={42} height={40} />
            </span>
            <strong>BSTEL DIGITAL SOLUTIONS</strong>
          </div>
          <p>Trusted telecom infrastructure partner since 2007. Fibre-optic design, deployment and maintenance for India&apos;s leading operators.</p>

          <div className="footer-stat-row">
            {footerStats.map((stat) => (
              <span key={stat.label}>
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </span>
            ))}
          </div>

          <div className="footer-badges">
            {footerTrustBadges.map((badge) => (
              <b key={badge}>{badge}</b>
            ))}
          </div>
        </div>

        <div>
          <h3>COMPANY</h3>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
          <Link href="/contact">Contact Us</Link>
        </div>

        <div>
          <h3>SERVICES</h3>
          {serviceAreas.map((service) => (
            <Link key={service.id} href={`/services#${service.id}`}>{service.title}</Link>
          ))}
        </div>

        <div>
          <h3>COVERAGE</h3>
          <p className="footer-mini-copy">Serving operators and enterprises across Central and Western India.</p>
          <div className="footer-coverage-chips">
            {coverageCodes.map((state) => (
              <Link href="/coverage" key={state}>{state}</Link>
            ))}
          </div>
          <Link className="footer-inline-link" href="/coverage">Open coverage details</Link>
        </div>

        <div>
          <h3>CONTACT</h3>
          <div className="footer-contact-block">
            <span>Nagpur HQ</span>
            <p>{contact.address}</p>
            <a href={contact.maps} target="_blank" rel="noreferrer">Open in Google Maps</a>
          </div>
          <div className="footer-contact-block">
            <span>Call</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
            <a href="tel:+917720044786">+91 77200 44786</a>
            <a href="tel:+917709042392">+91 77090 42392</a>
          </div>
          <div className="footer-contact-block">
            <span>Email</span>
            <a href={contact.emailHref}>{contact.email}</a>
            <a href={`mailto:${contact.kashafEmail}`}>{contact.kashafEmail}</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 BSTEL Digital Solutions Pvt. Ltd. All rights reserved.</span>
        <span>IP-1 Licensed · Nagpur HQ · Connecting You With India</span>
      </div>
    </footer>
  );
}
