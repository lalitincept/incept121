# CDGC Module 14: Creating System & Data Set Assets (Intro + Conclusion)

This is a Remotion project for a Dominion Energy data-governance training video.
It covers only the **Intro** and **Conclusion** of the script
(*CDGC_Creating_System_DataSet_Assets_Script.docx*). Methods 1–4 and the tagline are left out.

| | |
|---|---|
| Output | `npm run render` → `out/CDGC_System_DataSet_Intro_Conclusion_4K.mp4` (CRF 16 master, ~137 MB). The committed copy in `deliverables/` is a two-pass ~11 Mbps re-encode (92 MB) to fit GitHub's 100 MB limit, and is visually identical. |
| Resolution | 3840 × 2160 (4K UHD), 30 fps, H.264 (CRF 16) + AAC 320k |
| Duration | about 65.5 s |
| Background | `#221F20`, with subtle `#0072CE` gradients in the top-left and bottom-right corners |
| Icons | Lineal-colour style: 10 px white stroke over `#0072CE` shapes, drawn on with animation |
| Type | Plus Jakarta Sans (variable, bundled locally through `@fontsource-variable`) |

## Voiceover edit

The voiceover was transcribed to get word-level timestamps. It was then cut at natural pauses:

| Segment | Source range in `Voiceover.mp3` | File | Starts on the timeline at |
|---|---|---|---|
| Intro | 0.00 – 35.95 s | `public/vo_intro.wav` | 3.20 s |
| Conclusion | 186.98 – 206.40 s | `public/vo_conclusion.wav` | 41.10 s |

The tagline begins at 206.7 s in the source and is not used. Every kinetic word is keyed to its
spoken timestamp through `ti()` (intro) and `tc()` (conclusion) in `src/timing.ts`.

## Storyboard

| Time | Scene | VO |
|---|---|---|
| 0 – 3.2 | Title card: Module 14 | — |
| 3.2 – 11 | **S1** Data catalog → users trace where data lives → pull back to the enterprise landscape | "A data catalog only delivers value…" |
| 11 – 19 | **S2** A hierarchy forms, then falls apart. Assets drift and lose context, and discoverability and governance are struck out | "Without a clear hierarchy…" |
| 19 – 27 | **S3** Step outside Business Glossary and into the CDGC Business Data domain, where System and Data Set appear | "In this module, we step outside…" |
| 27 – 39 | **S4** Three cards: WHY (backbone), HOW (relate), WHICH (key fields) | "You'll see why structuring…" |
| 39 – 53 | **S5** The System container holds the Data Sets. The mandatory Parent field gets an *Official* seal and a *Required* tag | "So here's the shape of it…" |
| 53 – 60 | **S6** New System and New Data Set forms each fill with their own fields, and both end with the same Stakeholders section | "From there, each form…" |
| 60 – 65.5 | End card | — |

## How it's built

- **Camera** (`src/lib/camera.ts`): every scene sits in one large 2D world. Eased moves glide a
  single camera between scenes. Zoom "lifts", slight rolls and a hand-held float keep it moving.
- **Motion blur** (`src/Main.tsx`): when the camera moves fast, each frame averages up to 14
  sub-frame samples across a 180° shutter. Frames where the camera is still are rendered once.
- **Depth**: a parallax dot-grid, bokeh, two particle layers behind the content, and soft
  foreground bokeh in front of it.
- **Kinetic type** (`src/components/Kit.tsx`, `KText`): words rise through a mask on their VO
  timestamp. Key words get a blue box, an underline or a strike-through.
- **Icons** (`src/components/Icons.tsx`): a hand-built set of 24 SVG icons in the lineal-colour
  style. Stroke width is calculated so it stays exactly 10 px at native size.

## Commands

```bash
npm install
npm run studio          # interactive preview in Remotion Studio
npm run render          # full 4K render to out/
node scripts/stills.mjs out/stills 0.5 12 30 52   # quick half-res stills at given seconds
```

Optional music bed: put a licensed track in `public/` and pass it as a prop:

```bash
npx remotion render CDGCSystemDataSet out/with-music.mp4 --props='{"musicSrc":"music.mp3","musicVolume":0.12}'
```

The music fades in and out automatically and sits under the VO.

## Notes

- The Flaticon "detailed mixed / lineal color" pack could not be downloaded from this
  environment (the site blocks automated access). The icons were redrawn in that style instead.
  To use licensed Flaticon SVGs, replace the drawings in `Icons.tsx`. The `Icon`/`PopIcon`
  API stays the same.
- The Dominion Energy name appears only as plain text. No logo artwork is included. You can add
  the official logo to the title and end cards if brand guidelines allow it.
