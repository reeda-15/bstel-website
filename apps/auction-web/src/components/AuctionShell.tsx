"use client";

import { useEffect, useMemo, useState } from "react";

type Auction = {
  id: string;
  title: string;
  description: string;
  category: string;
  current_price_cents: number;
  reserve_price_cents: number | null;
  ends_at: string;
};

function formatMoney(cents: number) {
  return "$" + Math.round(cents / 100).toLocaleString("en-US");
}

export function AuctionShell() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/auctions")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Failed to load auctions");
        return payload.auctions as Auction[];
      })
      .then((nextAuctions) => {
        if (!active) return;
        setAuctions(nextAuctions);
        setError(null);
      })
      .catch((nextError) => {
        if (!active) return;
        setError(nextError instanceof Error ? nextError.message : "Failed to load auctions");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const liveCount = useMemo(() => auctions.length, [auctions]);

  return (
    <main className="auction-page">
      <nav className="auction-nav">
        <div className="brand-mark">P</div>
        <div>
          <strong>Paddle</strong>
          <span>Backend foundation</span>
        </div>
        <div className="live-pill">{liveCount} live</div>
      </nav>

      <section className="hero">
        <p className="eyebrow">Supabase + Socket.IO architecture</p>
        <h1>Live auctions now read through backend API routes.</h1>
        <p>
          This is the first real implementation milestone: the frontend no longer needs hardcoded auction cards once Supabase credentials and schema are applied.
        </p>
      </section>

      {loading ? <div className="notice">Loading auctions from /api/auctions...</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      <section className="auction-grid">
        {auctions.map((auction) => (
          <article className="auction-card" key={auction.id}>
            <div className="lot-art">
              <span>{auction.category}</span>
            </div>
            <div className="auction-card-body">
              <p>{auction.category}</p>
              <h2>{auction.title}</h2>
              <span className="price">{formatMoney(auction.current_price_cents)}</span>
              <small>Ends {new Date(auction.ends_at).toLocaleString()}</small>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
