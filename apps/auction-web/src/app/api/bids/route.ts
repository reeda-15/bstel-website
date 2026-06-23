import { NextResponse } from "next/server";
import { placeBid } from "@paddle/db/auction-repository";

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
  try {
    const body = await request.json();
    const result = await placeBid({
      auctionId: body.auctionId,
      bidderId: body.bidderId,
      amountCents: Number(body.amountCents),
    });
    await notifyRealtime(result);
    return NextResponse.json({ bid: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bid rejected";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
