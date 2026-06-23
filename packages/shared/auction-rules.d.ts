export const MIN_BID_INCREMENT_CENTS: 100;

export type AuctionBidState = {
  sellerId: string;
  status: "draft" | "live" | "ended" | "cancelled";
  endsAt: string;
  currentPriceCents: number | null;
  startingPriceCents: number;
};

export type BidderState = {
  id: string;
  roles: string[];
  bannedAt: string | null;
};

export type BidValidationResult =
  | { ok: true; minimumBidCents: number }
  | { ok: false; reason: string; minimumBidCents: number };

export function formatMoney(cents: number): string;
export function getMinimumBidCents(auction: AuctionBidState): number;
export function validateBidIntent(input: {
  auction: AuctionBidState;
  bidder: BidderState | null;
  amountCents: number;
  now: Date | string;
}): BidValidationResult;
