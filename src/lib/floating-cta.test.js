const assert = require("node:assert/strict");
const test = require("node:test");
const { shouldShowFloatingCta } = require("./floating-cta.js");

test("shows the floating CTA on marketing pages", () => {
  assert.equal(shouldShowFloatingCta("/"), true);
  assert.equal(shouldShowFloatingCta("/services"), true);
  assert.equal(shouldShowFloatingCta("/coverage"), true);
});

test("hides the floating CTA on the contact page", () => {
  assert.equal(shouldShowFloatingCta("/contact"), false);
});

test("hides the floating CTA on nested contact routes", () => {
  assert.equal(shouldShowFloatingCta("/contact/thank-you"), false);
});
