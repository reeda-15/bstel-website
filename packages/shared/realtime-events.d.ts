export const AUCTION_EVENTS: {
  STATE: "auction:state";
  PRICE_CHANGED: "auction:priceChanged";
  BID_REJECTED: "auction:bidRejected";
  ENDED: "auction:ended";
  CANCELLED: "auction:cancelled";
  VIEWERS_CHANGED: "presence:viewersChanged";
};

export function auctionRoom(auctionId: string): string;
export function userRoom(userId: string): string;
