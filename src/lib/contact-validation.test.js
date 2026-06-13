const assert = require("node:assert/strict");
const test = require("node:test");
const { validateContactRequest } = require("./contact-validation.js");

test("requires a full name", () => {
  const result = validateContactRequest({
    name: " ",
    email: "altaf@example.com",
    message: "Need a fibre route.",
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.name, "Please enter your name");
});

test("requires a valid email", () => {
  const result = validateContactRequest({
    name: "Altaf Sheikh",
    email: "not-an-email",
    message: "Need a fibre route.",
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.email, "Please enter a valid email");
});

test("requires a message", () => {
  const result = validateContactRequest({
    name: "Altaf Sheikh",
    email: "altaf@example.com",
    message: "",
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.message, "Please describe your requirement");
});

test("accepts complete contact requests", () => {
  const result = validateContactRequest({
    name: "Altaf Sheikh",
    email: "altaf@example.com",
    message: "Need a leased line quote for Nagpur.",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});
