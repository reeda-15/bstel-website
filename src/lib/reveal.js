function getRevealDelay(index, step = 55, max = 275) {
  return `${Math.min(Math.max(index, 0) * step, max)}ms`;
}

module.exports = { getRevealDelay };
