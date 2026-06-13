const assert = require("node:assert/strict");
const test = require("node:test");
const { getExploreOverviewItems } = require("./explore-overview.js");

test("returns five home overview cards", () => {
  assert.equal(getExploreOverviewItems().length, 5);
});

test("includes routes to the main full pages", () => {
  const hrefs = getExploreOverviewItems().map((item) => item.href);

  assert.deepEqual(hrefs, ["/services", "/coverage", "/projects", "/about", "/careers"]);
});

test("keeps every overview card concise", () => {
  for (const item of getExploreOverviewItems()) {
    assert.ok(item.summary.length <= 95);
  }
});

test("gives every overview card a stable icon key", () => {
  const iconKeys = getExploreOverviewItems().map((item) => item.icon);

  assert.deepEqual(iconKeys, ["services", "coverage", "projects", "about", "careers"]);
});
