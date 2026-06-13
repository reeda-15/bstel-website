function validateContactRequest(values) {
  const errors = {};
  const email = String(values.email || "").trim();

  if (!String(values.name || "").trim()) {
    errors.name = "Please enter your name";
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = "Please enter a valid email";
  }

  if (!String(values.message || "").trim()) {
    errors.message = "Please describe your requirement";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = { validateContactRequest };
