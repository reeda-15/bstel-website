const assert = require("node:assert/strict");
const test = require("node:test");
const { mapBitmap } = require("./dot-map.js");

test("restores the original 26-row coverage dot map", () => {
  assert.equal(mapBitmap.length, 26);
});

test("includes the original coverage state keys", () => {
  const joined = mapBitmap.join("");

  for (const key of ["M", "P", "C", "A", "U", "G"]) {
    assert.ok(joined.includes(key));
  }
});
