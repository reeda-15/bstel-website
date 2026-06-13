export type StatAnimationSupport = {
  hasIntersectionObserver: boolean;
  reduceMotion: boolean;
};

export function getInitialStatProgress(): number;

export function shouldAnimateStatsOnMount(support: StatAnimationSupport): boolean;

export function shouldCompleteStatsImmediately(support: StatAnimationSupport): boolean;

export function shouldUseTimerForStatAnimation(hasRequestAnimationFrame: boolean): boolean;
