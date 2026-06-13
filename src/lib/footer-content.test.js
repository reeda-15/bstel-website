const assert = require("node:assert/strict");
const test = require("node:test");
const { footerStats, footerTrustBadges } = require("./footer-content.js");

test("footer reinforces the main credibility metrics", () => {
  assert.deepEqual(
    footerStats.map((stat) => stat.value),
    ["18+", "6", "130+", "IP-1"],
  );
});

test("footer trust badges stay concise", () => {
  assert.equal(footerTrustBadges.length, 3);
  footerTrustBadges.forEach((badge) => {
    assert.ok(badge.length <= 24);
  });
});
