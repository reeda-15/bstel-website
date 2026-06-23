const AUCTION_EVENTS = {
  STATE: "auction:state",
  PRICE_CHANGED: "auction:priceChanged",
  BID_REJECTED: "auction:bidRejected",
  ENDED: "auction:ended",
  CANCELLED: "auction:cancelled",
  VIEWERS_CHANGED: "presence:viewersChanged",
};

function auctionRoom(auctionId) {
  return "auction:" + auctionId;
}

function userRoom(userId) {
  return "user:" + userId;
}

module.exports = {
  AUCTION_EVENTS,
  auctionRoom,
  userRoom,
};
