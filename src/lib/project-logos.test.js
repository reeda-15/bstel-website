const assert = require("node:assert/strict");
const test = require("node:test");
const { projectLogos } = require("./project-logos.js");

test("lists the ten supplied project logos", () => {
  assert.equal(projectLogos.length, 10);
});

test("uses the clean project logo asset path for every project logo", () => {
  assert.deepEqual(
    projectLogos.map((logo) => logo.file),
    [
      "project-logo-01.png",
      "project-logo-02.png",
      "project-logo-03.png",
      "project-logo-04.png",
      "project-logo-05.png",
      "project-logo-06.png",
      "project-logo-07.png",
      "project-logo-08.png",
      "project-logo-09.png",
      "project-logo-10.png",
    ],
  );
});

test("gives every project logo an accessible name", () => {
  assert.ok(projectLogos.every((logo) => logo.name.length > 0));
});
