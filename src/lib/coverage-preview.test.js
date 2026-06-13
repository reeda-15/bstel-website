const assert = require("node:assert/strict");
const test = require("node:test");
const { getCoveragePreview } = require("./coverage-preview.js");

test("returns the home coverage summary metrics", () => {
  assert.deepEqual(getCoveragePreview().metrics, [
    ["6", "States"],
    ["130+", "Districts"],
    ["3", "Full-State Regions"],
  ]);
});

test("marks Maharashtra as the HQ coverage chip", () => {
  const maharashtra = getCoveragePreview().chips.find((chip) => chip.name === "Maharashtra");

  assert.equal(maharashtra.status, "HQ: Nagpur");
});

test("uses full and key district statuses for remaining chips", () => {
  const statuses = getCoveragePreview().chips.map((chip) => chip.status);

  assert.ok(statuses.includes("Full coverage"));
  assert.ok(statuses.includes("Key districts"));
});
