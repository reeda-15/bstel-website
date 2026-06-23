export const AUCTION_EVENTS = {
  STATE: "auction:state",
  PRICE_CHANGED: "auction:priceChanged",
  BID_REJECTED: "auction:bidRejected",
  ENDED: "auction:ended",
  CANCELLED: "auction:cancelled",
  VIEWERS_CHANGED: "presence:viewersChanged",
} as const;

export function auctionRoom(auctionId: string) {
  return `auction:${auctionId}`;
}
