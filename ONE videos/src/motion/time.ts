import {useCurrentFrame, useVideoConfig} from 'remotion';

// Every timing in this project is written in frames at 30 fps ("beats").
// useTime() returns the current frame on that 30 fps clock, so the same scene code
// plays at the same speed whether the video renders at 24, 30 or 60 fps.
export const BASE_FPS = 30;

export const useTime = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (frame * BASE_FPS) / fps;
};

// Convert 30 fps beats into real frames at `fps`.
export const toFrames = (beats: number, fps: number) => Math.round((beats * fps) / BASE_FPS);
