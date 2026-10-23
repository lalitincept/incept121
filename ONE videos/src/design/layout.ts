import {useVideoConfig} from 'remotion';

// Layout that adapts to 16:9, 9:16 and 1:1 from the same scene code.
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const square = width === height;
  // 1 at 1080p; every size in the system multiplies by this.
  const u = Math.min(width, height) / 1080;
  const padX = Math.round((portrait ? 84 : square ? 96 : 140) * u);
  const padY = Math.round((portrait ? 150 : square ? 96 : 110) * u);
  // Display type shrinks on narrow frames so headlines keep to 2-3 lines.
  const display = portrait ? 0.74 : square ? 0.8 : 1;
  return {width, height, u, portrait, square, landscape: !portrait && !square, padX, padY, display};
};
