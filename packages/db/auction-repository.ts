import { getSupabaseServiceClient } from "./supabase-server";

export type AuctionRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category?: string;
  starting_price_cents: number;
  reserve_price_cents: number | null;
  current_price_cents: number;
  status: "draft" | "live" | "ended" | "cancelled";
  ends_at: string;
  winner_id: string | null;
};

export async function listLiveAuctions() {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("auctions")
    .select("id,seller_id,title,description,starting_price_cents,reserve_price_cents,current_price_cents,status,ends_at,winner_id")
    .eq("status", "live")
    .order("ends_at", { ascending: true });

  if (error) throw error;
  return (data || []) as AuctionRow[];
}

export async function placeBid(input: {
  auctionId: string;
  bidderId: string;
  amountCents: number;
}) {
  const supabase = getSupabaseServiceClient();

  const { data: auction, error: auctionError } = await supabase
    .from("auctions")
    .select("id,current_price_cents,status,ends_at")
    .eq("id", input.auctionId)
    .single();

  if (auctionError) throw auctionError;
  if (!auction || auction.status !== "live") throw new Error("Auction is not live.");
  if (new Date(auction.ends_at).getTime() <= Date.now()) throw new Error("Auction has ended.");
  if (input.amountCents <= Number(auction.current_price_cents || 0)) {
    throw new Error("Bid must be higher than the current price.");
  }

  const { error: bidError } = await supabase.from("bids").insert({
    auction_id: input.auctionId,
    bidder_id: input.bidderId,
    amount_cents: input.amountCents,
  });

  if (bidError) throw bidError;

  const { data: updatedAuction, error: updateError } = await supabase
    .from("auctions")
    .update({
      current_price_cents: input.amountCents,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.auctionId)
    .select("id,current_price_cents")
    .single();

  if (updateError) throw updateError;

  const { count, error: countError } = await supabase
    .from("bids")
    .select("id", { count: "exact", head: true })
    .eq("auction_id", input.auctionId);

  if (countError) throw countError;

  return {
    auction_id: input.auctionId,
    current_price_cents: Number(updatedAuction.current_price_cents),
    amount_cents: input.amountCents,
    bid_count: count || 0,
    leader_id: input.bidderId,
    committed_at: new Date().toISOString(),
    mode: "supabase",
  };
}
