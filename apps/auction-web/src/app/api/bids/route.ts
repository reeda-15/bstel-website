import { NextResponse } from "next/server";
import { placeBid } from "@paddle/db/auction-repository";
import { isSupabaseServiceConfigured } from "@paddle/db/supabase-server";

function makeDemoBid(body: Record<string, unknown>, mode = "demo") {
  const amountCents = Number(body.amountCents);
  return {
    auction_id: body.auctionId,
    current_price_cents: amountCents,
    amount_cents: amountCents,
    bid_count: Number(body.bidCount || 0) + 1,
    leader_id: body.bidderId,
    committed_at: new Date().toISOString(),
    mode,
  };
}

async function notifyRealtime(payload: unknown) {
  const url = process.env.REALTIME_SERVER_URL;
  const secret = process.env.REALTIME_INTERNAL_SECRET;
  if (!url || !secret) return;

  await fetch(`${url.replace(/\/$/, "")}/internal/auction-price-changed`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({
        bid: makeDemoBid(body),
      });
    }

    const result = await placeBid({
      auctionId: body.auctionId,
      bidderId: body.bidderId,
      amountCents: Number(body.amountCents),
    });
    try {
      await notifyRealtime(result);
    } catch {
      // Realtime fanout should not reject a successfully committed bid.
    }
    return NextResponse.json({ bid: result });
  } catch (error) {
    return NextResponse.json({
      bid: makeDemoBid(body, "demo-fallback"),
      warning: error instanceof Error ? error.message : "Backend unavailable",
    });
  }
}
