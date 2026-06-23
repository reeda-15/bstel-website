import { NextResponse } from "next/server";
import { listLiveAuctions } from "@paddle/db/auction-repository";

export async function GET() {
  try {
    const auctions = await listLiveAuctions();
    return NextResponse.json({ auctions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load auctions";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
