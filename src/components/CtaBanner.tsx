import Link from "next/link";

export function CtaBanner({ title, text, href = "/contact", label = "Request a Quote" }: { title: string; text?: string; href?: string; label?: string }) {
  return (
    <section className="section">
      <div className="cta-banner" data-reveal="cta">
        <div>
          <h2>{title}</h2>
          {text ? <p>{text}</p> : null}
        </div>
        <Link className="button green" href={href}>{label}</Link>
      </div>
    </section>
  );
}
