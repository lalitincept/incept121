# Creating a Catalog Source — Dominion Energy training video (Remotion)

A 4K (3840×2160, 30 fps, ~2:42) motion-graphics training video built with [Remotion](https://www.remotion.dev/).
The intro and conclusion are pure animation; methods 1–3 use the MCC screen recording, cut and time-remapped to the voiceover.

## Render

```bash
npm install
npm run render            # → out/Creating_a_Catalog_Source_4K.mp4
npx remotion studio       # live preview / scrubbing
```

`remotion.config.ts` points at the headless Chromium shipped in this environment; set `REMOTION_BROWSER` to override.
A full 4K render takes ~25 min on 4 cores with the ANGLE GL backend. Remotion emits full-range video from JPEG frames,
so convert to standard limited-range BT.709 for delivery:

```bash
ffmpeg -i out/Creating_a_Catalog_Source_4K.mp4 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -preset medium -crf 15 -c:a copy -movflags +faststart out/final_4K.mp4
```

Before the first render, rebuild the processed screen recording: `scripts/prepare-assets.sh <original recording.mp4>`.

## How it is organised

| Path | What it does |
| --- | --- |
| `src/Main.tsx` | Composition: background, intro, methods, conclusion, voiceover (starts after a 2.5 s logo sting). |
| `src/lib/constants.ts` | Frame size, brand colours (`#221F20`, `#0072CE`), `VO_OFFSET`, `useT()` (current voiceover time). |
| `src/data/voWords.ts` | Word-level timestamps of the voiceover (Whisper transcription). All animation is keyed to these. |
| `src/lib/words.ts` | Matches on-screen text to spoken words so kinetic type appears exactly as it is said (`*word*` = blue highlight, `/` = line break). |
| `src/scenes/Intro.tsx` | Logo sting, title, power-grid analogy, source→catalog gap, connection, MCC acronym, bridge, governed metadata. |
| `src/scenes/methodData.ts` | **Edit decision list** for the screen recording: voiceover-time → source-time remap (cuts, speed ramps, holds), inner camera zooms, highlights, click ripples. |
| `src/scenes/Methods.tsx` | Screen card plus kinetic side panels (100+ systems, admin tip, name anatomy, scope benefits, schedule caption). |
| `src/scenes/Conclusion.tsx` | Ready-to-scan card, raw details → governed metadata, every-scan timeline, dependency network, tagline and end card. |
| `src/components/icons.tsx` | Custom icon set in the Flaticon *Detailed Mixed – Lineal Color* style (512 grid, white strokes, `#0072CE` shapes). |
| `src/components/ScreenCard.tsx` | Rounded app window with per-frame time remapping, eased zoom/pan, spotlight highlights, callouts. |
| `public/rec.mp4` | Screen recording cropped to the app area (browser chrome, taskbar and meeting tile removed), 2× Lanczos upscale. |

## Re-timing

Change a `[voTime, srcTime]` pair in `REMAP` to slide the recording against the narration; change a `CAM` key to
move the zoom. Kinetic text re-syncs automatically from `voWords.ts` if the voiceover is replaced and re-transcribed.
