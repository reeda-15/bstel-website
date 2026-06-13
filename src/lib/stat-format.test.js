const assert = require("node:assert/strict");
const test = require("node:test");
const { formatStatValue } = require("./stat-format.js");

test("rounds animated stat values", () => {
  assert.equal(formatStatValue(17.6), "18");
});

test("keeps stat suffixes such as plus signs", () => {
  assert.equal(formatStatValue(129.8, "+"), "130+");
});
