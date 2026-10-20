# Deleting Assets Correctly — Intro & Conclusion (Dominion Energy · CDGC)

Remotion project for the enterprise training video *Cloud Data Governance & Catalog: Deleting Assets Correctly*.
Only the **Intro** and **Conclusion** of the script are produced; Methods 1–4 and the tagline are intentionally left out.

- **Output:**
  - `out/Deleting_Assets_Correctly_4K.mp4`: 3840×2160, 30 fps, H.264 High@5.1
  - `out/Deleting_Assets_Correctly_1080p.mp4`: 1920×1080 copy for previews and sharing, H.264 High@4.1

  Both are 74 s long and BT.709 limited range, with AAC 48 kHz audio and the VO normalised to −16.5 LUFS / −1.5 dBTP.
- **Look:** `#221F20` background with soft `#0072CE` light in the top-left and bottom-right corners, kinetic
  typography synced word-by-word to the voiceover, smooth keyframed camera moves, glass cards and circular icon badges
  matching the Dominion CDGC reference series.
- **Icons:** lineal-colour style, white 10 px outline over `#0072CE` shapes, drawn on stroke by stroke
  (`src/components/Icons.tsx`).

## Timeline

| Time (s)    | Section | Voiceover |
|-------------|---------|-----------|
| 0.0 – 3.9   | Dominion Energy logo reveal (trace → fill → glint) | none |
| 3.2 – 8.6   | Title card: *Cloud Data Governance & Catalog: Deleting Assets Correctly* | none |
| 8.6 – 53.8  | Intro, five scenes | master VO 0.00 – 45.20 |
| 54.4 – 68.4 | Conclusion | master VO 148.45 – 162.45 |
| 68.2 – 74.0 | Logo lock-up outro, fade to black | none |

Intro scenes (times relative to the intro VO):

1. **0 – 5.6** *Interconnected catalog*: camera pulls back from a single asset to reveal the connected web.
2. **4.9 – 13.7** *Business Term → dozens of columns*, then a lateral pan to *System → critical Data Sets*.
3. **13.6 – 24.3** *If an asset is deleted…*: a cursor deletes the central asset, links snap and dependents raise
   alerts. Then *You risk* shows three badges: broken lineage, corrupted glossaries, blind spots.
4. **23.8 – 31.4** *Strict dependency guardrails*: a shield with a rotating guardrail ring, and an attempted
   *Delete Asset* is blocked.
5. **30.8 – 45.6** *In this module*: three focus cards (safety net / trace & untangle / Obsolete lifecycle) with a
   rack-focus camera.

Conclusion: *Deleting correctly = checking first*, then a 3-step routine (Relationships tab → clear what's
attached → only then delete), then **OR**: *Choose Obsolete Lifecycle if retiring the asset is enough*.

Word timings come from a word-level transcription of the supplied VO, so every kinetic word lands on its spoken word.
The VO segments are pre-cut into `public/vo_intro.wav` and `public/vo_conclusion.wav`.

## Working on it

```bash
npm install
npm run studio          # live preview in Remotion Studio
npm run render          # master render + delivery encodes (see below)
node scripts/stills.mjs 0.5 out/stills 12 25 40   # review stills at given seconds
```

`npm run render` works in two steps:

1. Remotion renders a near-lossless master, `out/master_4K.mp4`. It captures lossless PNG frames, encodes to BT.709 at
   CRF 6 and is not committed.
2. `scripts/deliver.sh` encodes the delivery files from that master. Both stay inside H.264 High@5.1 (4K) or
   High@4.1 (1080p), with 4 reference frames, 2-second keyframes and a VBV cap, so hardware decoders in browsers,
   LMS players and phones decode them cleanly. The script also lifts the VO to the e-learning loudness target.
   Exceeding those limits (for example `-tune animation`, which pushes 4K to Level 6.0) makes many players smear
   blocks of earlier frames across the picture.

On machines where Remotion can't download its own browser, point it at a local Chromium:
`REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render`.

## Layout

```
src/
  Video.tsx            master timeline: scenes, audio, fade-out
  timeline.ts          section start times and VO cut points
  theme.ts             colours and bundled fonts (Inter, JetBrains Mono)
  lib/anim.ts          easing, keyframes, camera interpolation
  components/          Background, Kinetic text, Icons, UI (badge, glass, pill, cursor, camera), Logo, Shell
  scenes/              Opening, SceneConnected, SceneDependencies, SceneRisk, SceneGuardrails,
                       SceneModule, SceneConclusion, Outro
public/                VO clips, fonts, grain texture
```

## Notes

- **Icons.** Flaticon blocks automated access, so the icons are hand-built SVGs in the Flaticon "lineal color" style,
  to the brief (white 10 px stroke, `#0072CE` shapes). Building them in code lets every stroke animate. To swap in
  licensed Flaticon SVGs, replace the matching entries in `Icons.tsx`.
- **Logo.** The Dominion Energy lock-up is vector-traced from the client's reference footage
  (`src/components/logoPaths.ts`). Replace it with the official brand SVG if one is available.
- **Fonts.** Inter and JetBrains Mono (SIL OFL) ship in `public/fonts`, so renders need no network access.
