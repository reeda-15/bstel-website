function formatStatValue(value, suffix) {
  return `${Math.round(value)}${suffix || ""}`;
}

module.exports = { formatStatValue };
