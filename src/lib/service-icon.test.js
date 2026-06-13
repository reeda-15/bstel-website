const assert = require("node:assert/strict");
const test = require("node:test");
const { getServiceIconKey } = require("./service-icon.js");

test("maps fibre services to fibre icon", () => {
  assert.equal(getServiceIconKey("Fibre Optical Laying & Network Maintenance"), "fibre");
  assert.equal(getServiceIconKey("Fibre Optic Splicing"), "fibre");
});

test("maps field and connectivity services to specific icons", () => {
  assert.equal(getServiceIconKey("Horizontal Directional Drilling (HDD)"), "hdd");
  assert.equal(getServiceIconKey("Wi-Fi Hotspot Installation & O&M"), "wifi");
  assert.equal(getServiceIconKey("CCTV Installation & Maintenance"), "cctv");
  assert.equal(getServiceIconKey("Advanced Network Security & Monitoring"), "noc");
});

test("falls back to tower icon for unknown services", () => {
  assert.equal(getServiceIconKey("Custom telecom service"), "tower");
});
