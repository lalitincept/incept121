# Metadata Command Center — Overview & Access (Dominion Energy)

Enterprise training video built with [Remotion](https://www.remotion.dev/), rendered at **3840 × 2160 (4K), 30 fps, ~3:07**.

## Structure

| Time | Section | Visuals |
| --- | --- | --- |
| 0:00 | Logo open | Dominion Energy mark build (pure animation) |
| 0:03 | Title | "Metadata Command Center" + "Overview & Access" pill |
| 0:10 | Introduction | Where metadata comes from → MCC engine → data vs. metadata (BILL_AMOUNT) → at scale |
| 0:46 | Part 1 – What MCC Actually Does | Data stays in place / structure scan → recording: Home → Explore → Catalog Sources (Oracle, Snowflake) → technical assets → CDGC → 100+ source types |
| 1:32 | Part 2 – Getting Access | Roles → recording: Services → Administrator → User Roles → Governance Administrator vs. Admin → "MCC not showing up?" |
| 2:12 | Part 3 – Why Data Stewards Should Care | Steward review items → MCC as the front door → Updated On / job history |
| 2:42 | Conclusion | Origin-story trail (pure animation) |
| 2:58 | Tagline + end card | "Behind every trusted report is a clear data trail." |

## Sync approach

* `src/timing.ts` — the voiceover is split at digital silence into chunks; small gaps are inserted for the title
  and chapter cards. Every beat is keyed to the **original VO word time** (from a word-level transcript) and mapped
  with `vo()` / `at()` so visuals land on the spoken word.
* The screen recording is cropped to the app viewport (Teams frame, browser tabs and taskbar removed), upscaled 2×,
  and cut into clips that **play, freeze or speed-ramp** (`ScreenCard` clips) so each click lands on its VO cue.
  Zoom-pans, spotlight highlights, labels and click ripples are positioned in recording-pixel coordinates.

## Commands

```bash
npm install
npm run prep     # builds public/media/mcc-app.mp4 from source/mcc-recording.mp4 (ffmpeg required)
npm run studio   # preview / edit
npm run render   # final 4K render → out/MCC-Overview-4K.mp4 (+ -16 LUFS loudness pass and 1080p preview)
```

## Design system

* Background `#221F20` with subtle `#0072CE` light pools (top-left, bottom-right), static grain against banding.
* Inter typeface; accent words use a blue gradient; series-style gradient pill, glow cards, chips and caption bars.
* Icons (`src/components/Icons.tsx`): lineal-colour set drawn in the Flaticon "detailed mixed – lineal color" style
  with **10 px white strokes** and **#0072CE** fills (Flaticon itself was not reachable from the build machine, so the
  set was hand-drawn to match).
* Dominion Energy logo traced to vector from the series' end card (`src/logoPaths.ts`).
