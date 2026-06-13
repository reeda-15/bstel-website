const assert = require("node:assert/strict");
const test = require("node:test");
const { shaderHeroConfig } = require("./shader-hero.js");

test("uses the requested prompt shader as the full-width hero background", () => {
  assert.equal(shaderHeroConfig.source, "csstype-prompt-shader-background");
  assert.equal(shaderHeroConfig.variant, "home-full-width-prompt-shader");
  assert.equal(shaderHeroConfig.layout, "full-bleed-background");
});

test("tracks the prompt shader color palette", () => {
  assert.deepEqual(shaderHeroConfig.colors, ["#1a1a4d", "#4d1a80", "#6633cc"]);
});

test("documents the visual cues represented by the prompt shader", () => {
  assert.deepEqual(shaderHeroConfig.cues, ["warped grid", "plasma lines", "moving light circles", "purple telecom field"]);
});
