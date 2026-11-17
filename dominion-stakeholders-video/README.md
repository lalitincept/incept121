# Dominion Energy · Stakeholders & Reviewing Ingested Technical Assets

Remotion project for the ~3 min enterprise training video (target audience: Data Stewards).
Output: 3840×2160, 30 fps, H.264 + AAC.

## Structure

| Section | Time | Treatment |
|---|---|---|
| Intro | 0:00–0:54 | Pure motion graphics: logo sting, kinetic type, icon rings, funnel/gauge, asset hierarchy, catalog orbit |
| Method 1 – Review what came in | 0:54–1:29 | Screen recording (browse → overview → contains → history) + spotlights, side "health check" panel |
| Part 2 – Assign manually | 1:29–2:02 | Screen recording (Stakeholders tab → Modify → role → users) + Manage-Access note card, joint-responsibility diagram |
| Part 3 – Assign at scale | 2:02–2:42 | Grid-of-tables graphic → Export/Update/Re-import workflow → recording (export → Excel → import) with magnifier lenses |
| Conclusion | 2:42–3:07 | Pure motion graphics: dead end → conversation, effort/impact meter, minutes vs hours, end card + tagline |

Section titles ("Method 1", "Part 2", "Part 3") are intentionally not shown on screen.

## How the sync works

* `scripts/build_media.py` is the edit decision list. It
  * assembles `public/media/vo_final.wav` (3 s logo lead-in plus short breathing gaps at section boundaries), and
  * cuts, speed-ramps and freezes the 16 fps Teams recording into four shots (`shot_W1/W2/X1/W3.mp4`),
    cropping away the Teams frame, browser tabs/address bar, the Windows taskbar and the browser's border,
    and upscaling to the card size used at 4K.
  Each piece maps a source interval onto a final-timeline interval, so every click lands on the matching voiceover word.
* The script writes `src/data/timeline.json`. React code converts **voiceover word times** (`VF(t)`) and
  **source-recording moments** (`srcFrame(shot, t)`) into frames, so overlays, captions and kinetic text stay locked
  to the audio even after the edit changes.

## Design system

* Background `#221F20` with slowly breathing `#0072CE` glows top-left and bottom-right (`src/components/Background.tsx`).
* Icons: hand-built SVG set in the lineal-colour style (white rounded 10 px strokes at 4K over flat `#0072CE` shapes),
  with draw-on animation (`src/components/Icons.tsx`). Flaticon could not be reached from the build environment,
  so the set was drawn to match that style; swap in licensed Flaticon SVGs if required.
* Type: Inter (bundled in `public/fonts`). Kinetic text = per-word masked rise with blur, highlight words in a blue gradient.
* Screen recording is shown as a full-window card (no tight zooms); attention is guided with spotlights,
  outline boxes, click ripples and a few magnifier lenses for tiny Excel details.

## Rebuild / render

```bash
npm install
# place the inputs:
#   public/source/screen.mp4  (Teams screen recording)
#   public/source/vo.mp3      (ElevenLabs voiceover)
npm run build:media
npm run studio      # preview
npm run render      # 4K render to out/ (single pass)
bash scripts/render_chunks.sh   # memory-safe, resumable 4K render (recommended on <16 GB RAM)
```

Requires ffmpeg/ffprobe on PATH. Optional music bed: pass `--props='{"music":"media/music.mp3","musicVolume":0.1}'`.
