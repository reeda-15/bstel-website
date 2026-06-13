const assert = require("node:assert/strict");
const test = require("node:test");
const { clientSuccessTimeline } = require("./client-success.js");

test("provides four client success timeline points", () => {
  assert.equal(clientSuccessTimeline.length, 4);
});

test("uses real proof points instead of testimonial placeholders", () => {
  const combined = clientSuccessTimeline.map((item) => `${item.year} ${item.title} ${item.text}`).join(" ").toLowerCase();

  assert.equal(combined.includes("lorem"), false);
  assert.equal(combined.includes("testimonial"), false);
  assert.equal(combined.includes("client name"), false);
});
