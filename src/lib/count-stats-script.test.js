const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const scriptPath = path.join(__dirname, "..", "..", "public", "scripts", "count-stats.js");

test("ships the browser stat count-up script referenced by the layout", () => {
  assert.equal(fs.existsSync(scriptPath), true);
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /data-count-stat/);
  assert.match(script, /requestAnimationFrame/);
});
