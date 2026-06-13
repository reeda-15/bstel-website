const assert = require("node:assert/strict");
const test = require("node:test");
const {
  getInitialStatProgress,
  shouldAnimateStatsOnMount,
  shouldCompleteStatsImmediately,
  shouldUseTimerForStatAnimation,
} = require("./stat-animation.js");

test("starts stat values at zero so they can increment", () => {
  assert.equal(getInitialStatProgress(), 0);
});

test("completes stats immediately when reduced motion is enabled", () => {
  assert.equal(
    shouldCompleteStatsImmediately({
      hasIntersectionObserver: true,
      reduceMotion: true,
    }),
    true,
  );
});

test("does not complete stats immediately when IntersectionObserver is unavailable", () => {
  assert.equal(
    shouldCompleteStatsImmediately({
      hasIntersectionObserver: false,
      reduceMotion: false,
    }),
    false,
  );
});

test("waits for viewport intersection when animation support is available", () => {
  assert.equal(
    shouldCompleteStatsImmediately({
      hasIntersectionObserver: true,
      reduceMotion: false,
    }),
    false,
  );
});

test("animates stats on mount when IntersectionObserver is unavailable", () => {
  assert.equal(
    shouldAnimateStatsOnMount({
      hasIntersectionObserver: false,
      reduceMotion: false,
    }),
    true,
  );
});

test("does not animate stats on mount when reduced motion is enabled", () => {
  assert.equal(
    shouldAnimateStatsOnMount({
      hasIntersectionObserver: false,
      reduceMotion: true,
    }),
    false,
  );
});

test("uses timer animation when requestAnimationFrame is unavailable", () => {
  assert.equal(shouldUseTimerForStatAnimation(false), true);
});

test("uses requestAnimationFrame when it is available", () => {
  assert.equal(shouldUseTimerForStatAnimation(true), false);
});
