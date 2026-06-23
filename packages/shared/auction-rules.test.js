const assert = require("node:assert/strict");
const test = require("node:test");

const {
  MIN_BID_INCREMENT_CENTS,
  formatMoney,
  getMinimumBidCents,
  validateBidIntent,
} = require("./auction-rules");

test("formats cents as whole dollar money for auction display", () => {
  assert.equal(formatMoney(184000), "$1,840");
  assert.equal(formatMoney(99), "$1");
  assert.equal(formatMoney(0), "$0");
});

test("requires a 100 cent increment above the current price", () => {
  assert.equal(MIN_BID_INCREMENT_CENTS, 100);
  assert.equal(getMinimumBidCents({ currentPriceCents: 184000, startingPriceCents: 100000 }), 184100);
  assert.equal(getMinimumBidCents({ currentPriceCents: null, startingPriceCents: 25000 }), 25000);
});

test("accepts a valid bidder bid before the auction ends", () => {
  const result = validateBidIntent({
    auction: {
      sellerId: "seller-1",
      status: "live",
      endsAt: "2026-06-22T18:00:00.000Z",
      currentPriceCents: 10000,
      startingPriceCents: 9000,
    },
    bidder: { id: "bidder-1", roles: ["bidder"], bannedAt: null },
    amountCents: 10100,
    now: new Date("2026-06-22T17:59:59.000Z"),
  });

  assert.deepEqual(result, { ok: true, minimumBidCents: 10100 });
});

test("rejects bids below the minimum increment", () => {
  const result = validateBidIntent({
    auction: {
      sellerId: "seller-1",
      status: "live",
      endsAt: "2026-06-22T18:00:00.000Z",
      currentPriceCents: 10000,
      startingPriceCents: 9000,
    },
    bidder: { id: "bidder-1", roles: ["bidder"], bannedAt: null },
    amountCents: 10099,
    now: new Date("2026-06-22T17:59:59.000Z"),
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "BID_TOO_LOW");
  assert.equal(result.minimumBidCents, 10100);
});

test("rejects seller self-bids, admin-only bids, banned users, and late bids", () => {
  const baseAuction = {
    sellerId: "seller-1",
    status: "live",
    endsAt: "2026-06-22T18:00:00.000Z",
    currentPriceCents: 10000,
    startingPriceCents: 9000,
  };
  const beforeEnd = new Date("2026-06-22T17:59:59.000Z");

  assert.equal(
    validateBidIntent({
      auction: baseAuction,
      bidder: { id: "seller-1", roles: ["seller", "bidder"], bannedAt: null },
      amountCents: 10100,
      now: beforeEnd,
    }).reason,
    "SELLER_CANNOT_BID"
  );

  assert.equal(
    validateBidIntent({
      auction: baseAuction,
      bidder: { id: "admin-1", roles: ["admin"], bannedAt: null },
      amountCents: 10100,
      now: beforeEnd,
    }).reason,
    "ADMIN_CANNOT_BID"
  );

  assert.equal(
    validateBidIntent({
      auction: baseAuction,
      bidder: { id: "bidder-1", roles: ["bidder"], bannedAt: "2026-06-01T00:00:00.000Z" },
      amountCents: 10100,
      now: beforeEnd,
    }).reason,
    "USER_BANNED"
  );

  assert.equal(
    validateBidIntent({
      auction: baseAuction,
      bidder: { id: "bidder-1", roles: ["bidder"], bannedAt: null },
      amountCents: 10100,
      now: new Date("2026-06-22T18:00:00.000Z"),
    }).reason,
    "AUCTION_ENDED"
  );
});
