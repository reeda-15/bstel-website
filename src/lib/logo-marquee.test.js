const assert = require("node:assert/strict");
const test = require("node:test");
const { createLogoMarqueeItems } = require("./logo-marquee.js");

test("duplicates logos for a seamless marquee loop", () => {
  const logos = [
    ["Jio", "jio.png"],
    ["Airtel", "airtel.png"],
  ];

  assert.deepEqual(createLogoMarqueeItems(logos), [
    ["Jio", "jio.png"],
    ["Airtel", "airtel.png"],
    ["Jio", "jio.png"],
    ["Airtel", "airtel.png"],
  ]);
});

test("supports a custom repeat count", () => {
  assert.deepEqual(createLogoMarqueeItems([["Jio", "jio.png"]], 3), [
    ["Jio", "jio.png"],
    ["Jio", "jio.png"],
    ["Jio", "jio.png"],
  ]);
});
