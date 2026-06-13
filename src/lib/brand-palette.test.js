const assert = require("node:assert/strict");
const test = require("node:test");
const { brandPalette } = require("./brand-palette.js");

test("uses a premium telecom purple graphite and amber palette", () => {
  assert.equal(brandPalette.ink, "#15151a");
  assert.equal(brandPalette.deep, "#24114a");
  assert.equal(brandPalette.purple, "#5b21b6");
  assert.equal(brandPalette.green, "#a66a00");
});

test("keeps light section colors calm and readable", () => {
  assert.equal(brandPalette.tint, "#f4f4f5");
  assert.equal(brandPalette.section, "#fafafa");
  assert.equal(brandPalette.body, "#3f3f46");
  assert.equal(brandPalette.border, "#e4e4e7");
});
