const assert = require("node:assert/strict");
const test = require("node:test");
const { getHeroVisualConfig } = require("./hero-visual.js");

test("provides visual configs for the approved hero variants", () => {
  assert.deepEqual(
    ["home", "services", "coverage", "projects", "careers"].map(
      (variant) => getHeroVisualConfig(variant).label,
    ),
    [
      "Fibre network routes",
      "Technical infrastructure",
      "India coverage footprint",
      "Project delivery collage",
      "Field engineering team",
    ],
  );
});

test("falls back to the home visual for unknown variants", () => {
  assert.equal(getHeroVisualConfig("unknown").variant, "home");
});
