const assert = require("node:assert/strict");
const test = require("node:test");
const { getClientLogoClass } = require("./client-logo.js");

test("uses a wide logo class for Tikona", () => {
  assert.equal(getClientLogoClass("tikona.png"), "client-logo wide");
});

test("uses a wide logo class for TowerVision", () => {
  assert.equal(getClientLogoClass("towervision.png"), "client-logo wide");
});

test("uses an emphasis logo class for Tata Communications", () => {
  assert.equal(getClientLogoClass("tata-communications.png"), "client-logo wide emphasis");
});

test("uses a wide logo class for Tata Teleservices Limited", () => {
  assert.equal(getClientLogoClass("tata-teleservices-limited.png"), "client-logo wide");
});

test("uses a compact logo class for the unidentified orange logo", () => {
  assert.equal(getClientLogoClass("one.png"), "client-logo compact");
});

test("uses an emphasis logo class for RailTel", () => {
  assert.equal(getClientLogoClass("railtel.png"), "client-logo emphasis");
});

test("uses the standard logo class by default", () => {
  assert.equal(getClientLogoClass("jio.png"), "client-logo");
});
