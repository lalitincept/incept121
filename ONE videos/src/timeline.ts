import {toFrames} from './motion/time';
import type {Shot, TransitionName} from './types';

// Transition lengths in 30 fps beats.
export const TRANSITION_BEATS: Record<TransitionName, number> = {
  cut: 0,
  push: 22,
  wipe: 30,
  zoom: 24,
  iris: 30,
};

// Beats a scene waits before animating in, so its intro isn't spent under the transition.
const ENTER_DELAY: Record<TransitionName, number> = {
  cut: 0,
  push: 3,
  wipe: 15,
  zoom: 8,
  iris: 8,
};

export type TimedShot = {
  shot: Shot;
  index: number;
  // First frame of the shot, counting its incoming transition.
  from: number;
  frames: number;
  transition: TransitionName;
  overlap: number;
  delay: number;
};

// Lay the shots on a timeline. Transitions overlap neighbouring shots, so the
// video is shorter than the sum of shot lengths.
export const buildTimeline = (shots: Shot[], fps: number) => {
  let cursor = 0;
  const timed: TimedShot[] = shots.map((shot, index) => {
    const transition: TransitionName = index === 0 ? 'cut' : (shot.transition ?? 'push');
    const overlap = toFrames(TRANSITION_BEATS[transition], fps);
    const frames = Math.round(shot.seconds * fps);
    const from = cursor - overlap;
    cursor = from + frames;
    return {shot, index, from, frames, transition, overlap, delay: toFrames(ENTER_DELAY[transition], fps)};
  });
  return {shots: timed, total: Math.max(1, cursor)};
};
