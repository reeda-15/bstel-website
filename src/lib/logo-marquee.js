function createLogoMarqueeItems(logos, repeatCount = 2) {
  return Array.from({ length: repeatCount }, () => logos).flat();
}

module.exports = { createLogoMarqueeItems };
