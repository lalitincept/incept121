import type { CamKey, CardKey, ClickFx, Highlight, RemapSeg } from '../components/ScreenCard';

/*
 * Edit decision list for the screen recording, keyed to voiceover time (seconds).
 * Each segment is a hard cut; inside a segment playback speed is the slope between points
 * (slow-downs, speed-ups and holds keep the UI in step with the narration).
 * Source times are seconds in the original recording.
 */
export const REMAP: RemapSeg[] = [
  // Method 1 — Home → New → Catalog Source tab → source list → search "Talend"
  [
    [41.0, 15.9],
    [45.85, 21.12], // New dialog opens on "click New"
    [47.4, 23.0], // Catalog Source tab clicked on "Catalog Source tab"
    [48.6, 24.19], // list loads
    [52.0, 27.0],
    [61.6, 33.5], // slow scroll through 100+ source types
    [64.3, 38.45], // type "Talend" → Talend Data Integration
    [74.0, 44.6], // gentle hold on the chosen type
  ],
  // Method 2 — registration page
  [
    [74.0, 53.8],
    [82.9, 62.7],
  ],
  // Method 2 — catalog source list ("a dozen catalog sources sitting side by side")
  [
    [94.8, 190.6],
    [98.9, 194.7],
  ],
  // Method 3 — Next → Configuration / Metadata Extraction
  [
    [98.9, 81.9],
    [99.9, 83.6],
    [102.6, 84.85],
  ],
  // Filters (scope) — static stretch, then scroll
  [
    [102.6, 86.3],
    [110.7, 93.35],
    [115.6, 98.6],
  ],
  // Schedule — toggle on
  [
    [115.6, 115.3],
    [117.6, 117.85],
    [118.4, 118.6],
  ],
  // Schedule — interval → Weekly, effective days
  [
    [118.4, 133.3],
    [119.6, 136.75],
    [122.3, 140.2],
  ],
  // Save
  [
    [122.3, 178.4],
    [126.5, 182.6],
  ],
];

/** Inner camera: focus point in recording coordinates (1666×826) and zoom. */
export const CAM: CamKey[] = [
  { t: 41.0, cx: 833, cy: 413, z: 1 },
  { t: 44.4, cx: 833, cy: 413, z: 1 },
  { t: 45.1, cx: 330, cy: 170, z: 2.4 },
  { t: 45.75, cx: 330, cy: 170, z: 2.4 },
  { t: 46.35, cx: 833, cy: 413, z: 1.15 },
  { t: 46.7, cx: 833, cy: 413, z: 1.15 },
  { t: 47.2, cx: 470, cy: 330, z: 2.1 },
  { t: 48.7, cx: 470, cy: 330, z: 2.1 },
  { t: 49.6, cx: 800, cy: 420, z: 1.45 },
  { t: 52.9, cx: 800, cy: 420, z: 1.45 },
  { t: 53.6, cx: 560, cy: 300, z: 2.6 },
  { t: 55.5, cx: 560, cy: 300, z: 2.6 },
  { t: 56.3, cx: 800, cy: 430, z: 1.3 },
  { t: 61.7, cx: 800, cy: 430, z: 1.3 },
  { t: 62.4, cx: 1150, cy: 300, z: 2.3 },
  { t: 63.8, cx: 1150, cy: 300, z: 2.3 },
  { t: 64.45, cx: 860, cy: 320, z: 1.8 },
  { t: 65.6, cx: 860, cy: 330, z: 1.6 },
  { t: 73.98, cx: 860, cy: 330, z: 1.6 },
  // Method 2
  { t: 74.0, cx: 833, cy: 413, z: 1 },
  { t: 74.45, cx: 833, cy: 413, z: 1 },
  { t: 75.0, cx: 420, cy: 190, z: 2.4 },
  { t: 75.75, cx: 420, cy: 190, z: 2.4 },
  { t: 76.45, cx: 590, cy: 285, z: 2.3 },
  { t: 82.6, cx: 590, cy: 285, z: 2.5 },
  { t: 94.8, cx: 520, cy: 330, z: 1.7 },
  { t: 98.4, cx: 520, cy: 470, z: 1.85 },
  { t: 98.88, cx: 520, cy: 470, z: 1.85 },
  // Method 3
  { t: 98.9, cx: 1100, cy: 200, z: 1.8 },
  { t: 99.5, cx: 1100, cy: 200, z: 1.8 },
  { t: 100.1, cx: 470, cy: 190, z: 2.3 },
  { t: 100.7, cx: 470, cy: 190, z: 2.3 },
  { t: 101.3, cx: 380, cy: 250, z: 2.4 },
  { t: 102.5, cx: 380, cy: 250, z: 2.4 },
  { t: 103.3, cx: 860, cy: 640, z: 1.3 },
  { t: 107.2, cx: 860, cy: 650, z: 1.35 },
  { t: 108.0, cx: 800, cy: 735, z: 3.4 },
  { t: 110.3, cx: 800, cy: 735, z: 3.4 },
  { t: 111.1, cx: 833, cy: 420, z: 1.15 },
  { t: 115.58, cx: 833, cy: 420, z: 1.15 },
  { t: 115.6, cx: 500, cy: 330, z: 2.0 },
  { t: 117.7, cx: 500, cy: 330, z: 2.0 },
  { t: 118.38, cx: 600, cy: 480, z: 1.5 },
  { t: 118.4, cx: 680, cy: 640, z: 1.7 },
  { t: 122.28, cx: 680, cy: 660, z: 1.75 },
  { t: 122.3, cx: 1250, cy: 140, z: 2.2 },
  { t: 123.0, cx: 1300, cy: 110, z: 3.0 },
  { t: 125.4, cx: 1300, cy: 110, z: 3.25 },
];

const center = { x: 1920, y: 1080, s: 1, rx: 0, ry: 0, o: 1 };
const split = { x: 1290, y: 1080, s: 0.66, rx: 0, ry: 0, o: 1 };

/** Card placement in the 3840×2160 frame. */
export const CARD: CardKey[] = [
  { t: 41.0, x: 1920, y: 1500, s: 0.72, rx: 24, ry: 0, o: 0 },
  { t: 42.4, ...center },
  { t: 53.0, ...center },
  { t: 53.9, ...split },
  { t: 61.6, ...split },
  { t: 62.4, ...center },
  { t: 64.9, ...center },
  { t: 65.7, ...split },
  { t: 73.5, ...split },
  { t: 74.5, ...center },
  { t: 82.5, ...center },
  { t: 83.3, x: 1920, y: 1200, s: 0.86, rx: 10, ry: 0, o: 0 },
  { t: 94.75, x: 1920, y: 1200, s: 0.86, rx: 10, ry: 0, o: 0 },
  { t: 95.6, ...center },
  { t: 110.4, ...center },
  { t: 111.2, ...split },
  { t: 115.2, ...split },
  { t: 116.0, ...center },
  { t: 124.9, ...center },
  { t: 126.0, x: 1920, y: 960, s: 1.14, rx: -8, ry: 0, o: 0 },
];

export const HIGHLIGHTS: Highlight[] = [
  // Method 1
  { from: 44.9, to: 46.0, r: { x: 12, y: 68, w: 68, h: 26 }, label: 'Click New', side: 'right' },
  { from: 46.95, to: 49.3, r: { x: 283, y: 273, w: 130, h: 30 }, label: 'Catalog Source tab', side: 'bottom' },
  { from: 50.3, to: 52.8, r: { x: 436, y: 250, w: 952, h: 390 }, label: 'Choose a source type', side: 'top', spot: 0.3 },
  { from: 53.7, to: 55.6, r: { x: 438, y: 246, w: 196, h: 27 } },
  { from: 62.0, to: 64.15, r: { x: 1214, y: 196, w: 174, h: 34 }, label: 'Search for your system', side: 'bottom', radius: 16 },
  { from: 64.3, to: 65.8, r: { x: 436, y: 274, w: 952, h: 46 }, label: 'Pick the matching type', side: 'bottom' },
  { from: 65.8, to: 73.7, r: { x: 436, y: 274, w: 952, h: 46 } },
  // Method 2
  { from: 74.6, to: 75.9, r: { x: 199, y: 139, w: 112, h: 36 }, label: 'Registration', side: 'bottom', radius: 18 },
  { from: 76.2, to: 82.6, r: { x: 455, y: 252, w: 435, h: 34 }, label: 'Clear, recognizable name', side: 'bottom' },
  { from: 95.6, to: 98.95, r: { x: 228, y: 224, w: 262, h: 348 }, label: 'Easy to tell apart', side: 'right', spot: 0.32 },
  // Method 3
  { from: 99.1, to: 99.8, r: { x: 1128, y: 78, w: 110, h: 34 } },
  { from: 99.95, to: 100.95, r: { x: 399, y: 139, w: 118, h: 38 }, label: 'Configuration', side: 'bottom', radius: 18 },
  { from: 101.1, to: 102.7, r: { x: 212, y: 200, w: 164, h: 35 }, label: 'Metadata Extraction', side: 'bottom' },
  { from: 103.3, to: 107.45, r: { x: 222, y: 582, w: 1380, h: 182 }, label: 'Define scope: schemas & databases', side: 'top', spot: 0.32 },
  { from: 107.9, to: 110.6, r: { x: 760, y: 727, w: 54, h: 28 }, label: 'Scan everything', side: 'bottom', radius: 8 },
  { from: 116.3, to: 118.35, r: { x: 220, y: 248, w: 158, h: 30 }, label: 'Run on schedule', side: 'right' },
  { from: 118.5, to: 122.25, r: { x: 455, y: 615, w: 435, h: 35 }, label: 'Recurring interval', side: 'right' },
  { from: 122.6, to: 125.4, r: { x: 1250, y: 78, w: 104, h: 34 }, label: 'Save', side: 'bottom' },
];

export const CLICKS: ClickFx[] = [
  { t: 45.62, x: 42, y: 81 },
  { t: 47.32, x: 337, y: 287 },
  { t: 64.45, x: 640, y: 297 },
  { t: 99.45, x: 1183, y: 95 },
  { t: 117.5, x: 352, y: 263 },
  { t: 119.5, x: 490, y: 806 },
  { t: 123.25, x: 1302, y: 95 },
];
