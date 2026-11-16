#!/usr/bin/env bash
# Prepares the screen recording for the 4K composition:
#  - crops the Teams frame, browser tabs/URL bar and Windows taskbar (app viewport only)
#  - upscales 2x with lanczos + light sharpening so UI text holds up at 4K
#  - short GOP for frame-accurate seeking (freeze frames / speed ramps)
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -v error -i source/mcc-recording.mp4 -an \
  -vf "crop=1666:826:4:139,scale=3332:1652:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,format=yuv420p" \
  -c:v libx264 -preset slow -crf 12 -g 8 -keyint_min 8 -r 16 \
  public/media/mcc-app.mp4
echo "done: public/media/mcc-app.mp4"
