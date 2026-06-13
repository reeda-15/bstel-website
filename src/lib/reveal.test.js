const assert = require("node:assert/strict");
const test = require("node:test");
const { getRevealDelay } = require("./reveal.js");

test("uses no delay for the first revealed item", () => {
  assert.equal(getRevealDelay(0), "0ms");
});

test("staggers later revealed items by the default interval", () => {
  assert.equal(getRevealDelay(3), "165ms");
});

test("caps reveal delay so long lists still feel responsive", () => {
  assert.equal(getRevealDelay(20), "275ms");
});
