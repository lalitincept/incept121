# Viewing Metadata Extraction Results — Dominion Energy training video

Remotion project that renders the 4K (3840×2160, 30 fps) enterprise training video
*Viewing Metadata Extraction Results* for Dominion Energy data stewards.

- **Intro & conclusion:** pure motion graphics (kinetic type, lineal-color icons, shapes/diagrams).
- **Methods 1–3:** the CDGC screen recording, cut and frozen to the voiceover, with callouts,
  side panels and explainer graphics. No "Method 1/2/3" title cards are shown.
- **Look:** `#221F20` background, subtle `#0072CE` glows top-left / bottom-right, Inter type,
  white 10 px outline icons with `#0072CE` fill shapes (Flaticon "lineal color" style, hand-built SVG).

## Source media (not committed)

Client media is kept out of git. Put these files in `source-media/` before rendering:

| File | What it is |
| --- | --- |
| `source-media/screen-recording.mp4` | Teams capture "Reviewing Extraction results" (1920×1080, 16 fps) |
| `source-media/voiceover.mp3` | ElevenLabs voiceover (143 s) |

`public/brand/` holds the white Dominion Energy logo (mark, wordmark, lockup) used for the opener and end slate.

## Build

```bash
npm install
```

```bash
npm run prepare-media
```

```bash
npm run render
```

`prepare-media` crops the Teams capture to the Informatica app window (drops the Teams frame,
presenter tile, browser tabs/URL bar and Windows taskbar), upscales it 2× with Lanczos for crisp
4K UI text, and extracts the freeze-frame stills. The render writes
`out/Viewing_Metadata_Extraction_Results_4K.mp4`.

Use `npm run studio` to preview, or `node scripts/stills.mjs 0.5 <frame> …` for quick stills.

## How the sync works

All timing is on the **voiceover clock** (`src/theme.ts`: `at(seconds)`, `VO_OFFSET` = 2.5 s logo
sting before the VO). Word timestamps came from a forced transcription of the voiceover, so kinetic
words land when they are spoken.

The screen recording is driven by an edit-decision list (`SEGS_M12` in
`src/scenes/ScreenStory.tsx`, `SEGS_M3` in `src/scenes/Method3.tsx`): each entry maps a VO window to
a recording window (or a freeze frame). Cuts are placed on real UI events, e.g.

| VO | Recording | Event |
| --- | --- | --- |
| 38.5 s "…you ran" | 43.9 s | click `Snowflake_Enterprise` |
| 39.9 s "hierarchy" | 47.6 s | click **Hierarchy** tab |
| 42.7 s "database" | 54.5 s | `BIAD003_DEVL (Database)` appears |
| 46.5 s | 73.0 s | `PREMISE_CHARACTERISTICS (Table)` appears |
| 54.5–63.3 s | freeze 86.4 s | search-bar explainer |
| 65.1 s "Click into…" | 88.2 s | click column `ADDRESS` |
| 84.0 s "Contains tab" | 98.9 s | click **Contains** |

## Layout

```
src/
  theme.ts              colours, easing, VO-clock helpers
  components/
    Background.tsx      #221F20 + animated blue corner glows
    Icon.tsx            lineal-color SVG icon set (draw-on animation, 10 px stroke)
    Kinetic.tsx         word-timed kinetic text
    Screen.tsx          recording player (EDL, cross-dissolves, freezes, spotlights, rings)
    UI.tsx              icon badges, glass panels, chips, connectors, ripples
    Scene.tsx           scene camera (push / rise / zoom transitions)
  scenes/
    Intro.tsx           logo sting, title, why it matters (pure animation)
    ScreenStory.tsx     Methods 1 & 2 (navigate the hierarchy, search, Overview, Contains)
    Method3.tsx         sanity check, count comparison, root causes, early vs late
    Outro.tsx           conclusion and end slate with tagline
```
