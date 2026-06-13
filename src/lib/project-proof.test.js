const assert = require("node:assert/strict");
const test = require("node:test");
const { projectProofPoints } = require("./project-proof.js");

test("provides three project proof points", () => {
  assert.equal(projectProofPoints.length, 3);
});

test("does not ship testimonial placeholders", () => {
  const combined = projectProofPoints
    .flatMap((point) => [point.title, point.text, point.metric, point.label])
    .join(" ")
    .toLowerCase();

  assert.equal(combined.includes("placeholder"), false);
  assert.equal(combined.includes("client name"), false);
});

test("keeps proof points concise for card layouts", () => {
  assert.ok(projectProofPoints.every((point) => point.text.length <= 145));
});
