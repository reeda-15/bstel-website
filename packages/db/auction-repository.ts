import { getSupabaseServiceClient } from "./supabase-server";

export type AuctionRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
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
    .select("id,seller_id,title,description,category,starting_price_cents,reserve_price_cents,current_price_cents,status,ends_at,winner_id")
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
  const { data, error } = await supabase.rpc("place_bid", {
    p_auction_id: input.auctionId,
    p_bidder_id: input.bidderId,
    p_amount_cents: input.amountCents,
  });

  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}
