#!/usr/bin/env bash
# Rebuilds public/rec.mp4 from the original Teams screen recording.
# Crops to the MCC app area (drops the browser tabs/URL bar, Windows taskbar and the meeting
# participant tile), upscales 2x with Lanczos + light sharpening, keyframes every 0.5 s for fast seeking.
# Usage: scripts/prepare-assets.sh /path/to/ConfiguringCatalog_Source-Meeting_Recording.mp4
set -euo pipefail
SRC="${1:?path to original screen recording}"
cd "$(dirname "$0")/.."
ffmpeg -y -i "$SRC" -an \
  -vf "crop=1666:826:4:139,scale=3332:1652:flags=lanczos,unsharp=5:5:0.55:5:5:0" \
  -c:v libx264 -preset slow -crf 13 -pix_fmt yuv420p -g 8 -movflags +faststart public/rec.mp4
