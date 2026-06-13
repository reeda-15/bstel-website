function getInitialStatProgress() {
  return 0;
}

function shouldCompleteStatsImmediately({ hasIntersectionObserver, reduceMotion }) {
  return reduceMotion;
}

function shouldAnimateStatsOnMount({ hasIntersectionObserver, reduceMotion }) {
  return !reduceMotion && !hasIntersectionObserver;
}

function shouldUseTimerForStatAnimation(hasRequestAnimationFrame) {
  return !hasRequestAnimationFrame;
}

module.exports = {
  getInitialStatProgress,
  shouldAnimateStatsOnMount,
  shouldCompleteStatsImmediately,
  shouldUseTimerForStatAnimation,
};
