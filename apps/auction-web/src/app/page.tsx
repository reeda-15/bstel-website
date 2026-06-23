import Link from "next/link";

export default function AuctionHomePage() {
  return (
    <main className="auction-page">
      <nav className="auction-nav">
        <div className="brand-mark">P</div>
        <strong>Paddle</strong>
        <Link href="/auth">Sign in</Link>
      </nav>
      <section className="hero">
        <p className="eyebrow">Production auth foundation</p>
        <h1>Live auctions with real account infrastructure.</h1>
        <p>Sign in, manage profiles, and prepare seller security requirements.</p>
      </section>
    </main>
  );
}
