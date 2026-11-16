/*
 * Screen-recording edit decision list.
 *
 * Every entry is authored in VOICE-OVER seconds (v0/v1, from word-level
 * timestamps) so picture lands exactly on the words. Source times (s0/s1)
 * are seconds into each recording:
 *   a = Monitoring_MCC.mp4    (run the job → monitor it)
 *   b = Monitoring_MCC_1.mp4  (completed job overview → logs)
 * Coordinates are in the cropped recording space (1660 × 890 px).
 */

export type Src = "a" | "b";
export type Seg = { src: Src; v0: number; v1: number; s0: number; s1: number; xf?: number };

export const SEGMENTS: Seg[] = [
  // ── Method 1 · Running the job ──────────────────────────────────────────
  { src: "a", v0: 36.4, v1: 40.1, s0: 17.4, s1: 20.2 }, // Home, left nav
  { src: "a", v0: 40.1, v1: 41.4, s0: 22.3, s1: 23.75, xf: 8 }, // → Explore
  { src: "a", v0: 41.4, v1: 43.3, s0: 23.75, s1: 25.6 }, // Catalog Sources list loads
  { src: "a", v0: 43.3, v1: 45.6, s0: 25.6, s1: 28.2 }, // locate Snowflake_Business
  { src: "a", v0: 45.6, v1: 46.5, s0: 28.2, s1: 30.2 }, // open source
  { src: "a", v0: 46.5, v1: 47.7, s0: 30.2, s1: 31.6 }, // registration page
  { src: "a", v0: 47.7, v1: 48.5, s0: 40.6, s1: 43.05, xf: 8 }, // scroll → Test Connection click
  { src: "a", v0: 48.5, v1: 50.4, s0: 43.05, s1: 45.0 }, // testing…
  { src: "a", v0: 50.4, v1: 52.7, s0: 81.0, s1: 84.0, xf: 10 }, // Test Connection Successful
  { src: "a", v0: 52.7, v1: 54.25, s0: 89.5, s1: 93.15, xf: 8 }, // → click Run
  { src: "a", v0: 54.25, v1: 55.3, s0: 93.15, s1: 96.0 }, // Run Catalog Source Job dialog
  { src: "a", v0: 55.3, v1: 56.2, s0: 110.9, s1: 112.4, xf: 8 }, // confirm Run
  { src: "a", v0: 56.2, v1: 57.35, s0: 127.35, s1: 128.7, xf: 8 }, // job triggered
  { src: "a", v0: 57.35, v1: 63.4, s0: 128.7, s1: 131.5 }, // (dimmed: runtime insert)
  { src: "a", v0: 63.4, v1: 68.85, s0: 131.5, s1: 135.4 }, // runs in background
  // ── Method 2 · Monitoring progress ──────────────────────────────────────
  { src: "a", v0: 68.85, v1: 69.6, s0: 135.4, s1: 136.6 }, // click Monitor
  { src: "a", v0: 69.6, v1: 72.2, s0: 136.6, s1: 137.6 }, // Monitor list (STARTING)
  { src: "a", v0: 72.2, v1: 79.0, s0: 137.6, s1: 137.9 }, // (dimmed: phases insert)
  { src: "a", v0: 79.0, v1: 82.55, s0: 137.9, s1: 143.55 }, // click into job
  { src: "a", v0: 82.55, v1: 84.1, s0: 143.55, s1: 145.6 }, // job detail (STARTING)
  { src: "a", v0: 84.1, v1: 87.15, s0: 145.6, s1: 149.0 }, // check queue
  { src: "a", v0: 87.15, v1: 93.4, s0: 149.0, s1: 161.7 }, // sub-tasks
  { src: "a", v0: 93.4, v1: 95.6, s0: 161.7, s1: 164.0 }, // status → RUNNING
  // ── Method 3 · Reading the outcome ──────────────────────────────────────
  { src: "b", v0: 95.6, v1: 96.7, s0: 14.6, s1: 16.6, xf: 12 }, // open completed run
  { src: "b", v0: 96.7, v1: 98.3, s0: 16.6, s1: 20.9 }, // job overview
  { src: "b", v0: 98.3, v1: 101.5, s0: 20.9, s1: 24.8 }, // expand sub-tasks
  { src: "b", v0: 101.5, v1: 102.4, s0: 24.8, s1: 26.0 },
  { src: "b", v0: 102.4, v1: 104.05, s0: 43.9, s1: 46.1, xf: 8 }, // Logs tab
  { src: "b", v0: 104.05, v1: 106.9, s0: 48.0, s1: 50.6, xf: 6 }, // Download Job Logs
  { src: "b", v0: 106.9, v1: 116.6, s0: 50.6, s1: 54.0 }, // (dimmed: bottleneck insert)
  { src: "b", v0: 116.6, v1: 124.6, s0: 46.2, s1: 46.9, xf: 10 }, // audit trail / timestamps
];

/** Available extracted frame ranges (16 fps source frame numbers). */
export const FRAME_RANGES: Record<Src, [number, number][]> = {
  a: [
    [160, 2719],
    [4480, 4783],
  ],
  b: [[48, 959]],
};

// Camera moves: transition INTO (z, x, y) between v0 and v1, then hold.
export type Cam = { v0: number; v1: number; z: number; x: number; y: number };
export const CAMERA: Cam[] = [
  { v0: 47.6, v1: 48.7, z: 1.22, x: 560, y: 650 }, // Test Connection
  { v0: 50.5, v1: 51.4, z: 1.0, x: 830, y: 445 },
  { v0: 83.5, v1: 84.5, z: 1.28, x: 900, y: 300 }, // STATUS: Starting
  { v0: 87.0, v1: 87.9, z: 1.0, x: 830, y: 445 },
  { v0: 93.0, v1: 94.0, z: 1.24, x: 860, y: 330 }, // STATUS: Running
  { v0: 94.95, v1: 95.55, z: 1.0, x: 830, y: 445 },
  { v0: 104.0, v1: 104.95, z: 1.24, x: 1330, y: 330 }, // Download Job Logs
  { v0: 106.6, v1: 107.4, z: 1.0, x: 830, y: 445 },
  { v0: 120.7, v1: 121.7, z: 1.18, x: 540, y: 560 }, // Timestamp column
];

// Background dim + blur while an animated insert explains a concept.
export const DIMS: { v0: number; v1: number }[] = [
  { v0: 57.3, v1: 63.55 },
  { v0: 72.05, v1: 79.05 },
  { v0: 106.75, v1: 116.75 },
];

export type Rect = { x: number; y: number; w: number; h: number };
export type Highlight = Rect & { v0: number; v1: number; spot?: boolean };
export const HIGHLIGHTS: Highlight[] = [
  { v0: 37.4, v1: 40.0, x: 2, y: 88, w: 210, h: 322, spot: true }, // left navigation panel
  { v0: 40.6, v1: 41.6, x: 6, y: 178, w: 204, h: 40 }, // Explore
  { v0: 42.4, v1: 43.9, x: 404, y: 106, w: 192, h: 42 }, // Catalog Sources
  { v0: 44.8, v1: 46.0, x: 304, y: 389, w: 854, h: 45, spot: true }, // configured source row
  { v0: 48.0, v1: 50.35, x: 298, y: 794, w: 205, h: 52 }, // Test Connection
  { v0: 51.45, v1: 52.75, x: 802, y: 88, w: 272, h: 56 }, // success toast
  { v0: 53.55, v1: 54.5, x: 1402, y: 98, w: 146, h: 52 }, // Run
  { v0: 55.6, v1: 56.25, x: 909, y: 749, w: 145, h: 52 }, // dialog Run
  { v0: 68.4, v1: 69.7, x: 6, y: 224, w: 204, h: 40 }, // Monitor nav
  { v0: 70.3, v1: 72.1, x: 1384, y: 405, w: 84, h: 32 }, // STARTING in list
  { v0: 83.6, v1: 87.0, x: 884, y: 186, w: 80, h: 30 }, // STATUS STARTING
  { v0: 88.3, v1: 92.3, x: 300, y: 505, w: 1256, h: 92, spot: true }, // Tasks table
  { v0: 93.55, v1: 95.0, x: 798, y: 186, w: 74, h: 30 }, // STATUS RUNNING
  { v0: 97.3, v1: 98.6, x: 760, y: 168, w: 128, h: 50 }, // Completed tasks 9/9
  { v0: 98.8, v1: 100.2, x: 300, y: 546, w: 1246, h: 188, spot: true }, // sub-tasks
  { v0: 100.3, v1: 101.6, x: 1112, y: 546, w: 102, h: 188 }, // status column
  { v0: 102.9, v1: 103.9, x: 386, y: 230, w: 116, h: 54 }, // Logs tab
  { v0: 104.3, v1: 106.75, x: 1489, y: 100, w: 56, h: 54 }, // Download Job Logs
  { v0: 121.1, v1: 123.6, x: 300, y: 400, w: 172, h: 392, spot: true }, // Timestamp column
];

export const RIPPLES: { v: number; x: number; y: number }[] = [
  { v: 41.22, x: 66, y: 198 }, // Explore
  { v: 45.75, x: 452, y: 420 }, // Snowflake_Business
  { v: 48.46, x: 384, y: 822 }, // Test Connection
  { v: 54.16, x: 1474, y: 124 }, // Run
  { v: 55.98, x: 960, y: 778 }, // dialog Run
  { v: 68.92, x: 60, y: 244 }, // Monitor
  { v: 82.5, x: 520, y: 428 }, // into job
  { v: 96.1, x: 520, y: 460 }, // completed run
  { v: 98.36, x: 320, y: 568 }, // expand sub-tasks
  { v: 103.52, x: 430, y: 258 }, // Logs tab
  { v: 104.75, x: 1516, y: 128 }, // Download
];

// Privacy: soften account identifiers, usernames and key paths.
export const REDACTIONS: { src: Src; s0: number; s1: number; r: Rect }[] = [
  { src: "a", s0: 30.0, s1: 41.05, r: { x: 598, y: 740, w: 300, h: 150 } },
  { src: "a", s0: 41.05, s1: 41.35, r: { x: 598, y: 640, w: 300, h: 250 } },
  { src: "a", s0: 41.35, s1: 94.2, r: { x: 598, y: 640, w: 300, h: 140 } },
  { src: "a", s0: 136.0, s1: 143.7, r: { x: 368, y: 306, w: 182, h: 30 } }, // user filter chip
];

export type Caption = { v0: number; v1: number; text: string };
export const CAPTIONS: Caption[] = [
  { v0: 44.25, v1: 46.45, text: "Locate your configured source" },
  { v0: 47.95, v1: 52.45, text: "Run a quick *connection *test" },
  { v0: 52.75, v1: 57.35, text: "Once verified, click *Run" },
  { v0: 63.65, v1: 68.3, text: "Jobs run *in *the *background — navigate freely" },
  { v0: 68.5, v1: 72.0, text: "*Monitor tab: observe your run in real time" },
  { v0: 79.15, v1: 82.9, text: "Starting longer than expected? *Click *into *it" },
  { v0: 83.2, v1: 87.05, text: "Check *queue *availability — it hasn’t stalled" },
  { v0: 87.25, v1: 92.2, text: "Detail view: individual *sub‑tasks" },
  { v0: 92.4, v1: 95.45, text: "Know exactly *which *step is processing" },
  { v0: 95.95, v1: 101.7, text: "*Job *Overview: completed sub‑tasks & warnings" },
  { v0: 102.25, v1: 106.6, text: "Failed or hung? *Download *the *task *log" },
  { v0: 116.95, v1: 120.95, text: "The log keeps a *historical *audit *trail" },
  { v0: 121.1, v1: 123.55, text: "Confirm *exactly *when data was refreshed" },
];
