const MIN_BID_INCREMENT_CENTS = 100;

function formatMoney(cents) {
  const normalized = Number.isFinite(cents) ? cents : 0;
  return "$" + Math.round(normalized / 100).toLocaleString("en-US");
}

function getMinimumBidCents(auction) {
  const current = auction.currentPriceCents;
  if (typeof current === "number") {
    return current + MIN_BID_INCREMENT_CENTS;
  }
  return auction.startingPriceCents;
}

function hasRole(user, role) {
  return Array.isArray(user.roles) && user.roles.includes(role);
}

function reject(reason, minimumBidCents) {
  return { ok: false, reason, minimumBidCents };
}

function validateBidIntent({ auction, bidder, amountCents, now }) {
  const minimumBidCents = getMinimumBidCents(auction);
  const currentTime = now instanceof Date ? now : new Date(now);
  const endsAt = new Date(auction.endsAt);

  if (auction.status !== "live") return reject("AUCTION_NOT_LIVE", minimumBidCents);
  if (currentTime >= endsAt) return reject("AUCTION_ENDED", minimumBidCents);
  if (!bidder || !bidder.id) return reject("AUTH_REQUIRED", minimumBidCents);
  if (bidder.bannedAt) return reject("USER_BANNED", minimumBidCents);
  if (hasRole(bidder, "admin") && bidder.roles.length === 1) return reject("ADMIN_CANNOT_BID", minimumBidCents);
  if (!hasRole(bidder, "bidder")) return reject("BIDDER_ROLE_REQUIRED", minimumBidCents);
  if (bidder.id === auction.sellerId) return reject("SELLER_CANNOT_BID", minimumBidCents);
  if (amountCents < minimumBidCents) return reject("BID_TOO_LOW", minimumBidCents);

  return { ok: true, minimumBidCents };
}

module.exports = {
  MIN_BID_INCREMENT_CENTS,
  formatMoney,
  getMinimumBidCents,
  validateBidIntent,
};
