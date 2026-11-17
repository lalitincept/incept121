#!/usr/bin/env bash
# Builds render-ready media in public/ from the raw files in source-media/.
# - Crops the Teams capture down to the Informatica app window
#   (drops the Teams frame, presenter tile, browser tabs/URL bar and Windows taskbar)
# - Upscales 2x with Lanczos + light unsharp for crisp UI text at 4K
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public
# App window inside the 1920x1080 capture: x=4..1668, y=139..965
ffmpeg -v error -y -i source-media/screen-recording.mp4 -an \
  -vf "crop=1664:826:4:139,scale=3328:1652:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,format=yuv420p" \
  -c:v libx264 -preset slow -crf 14 -g 16 -movflags +faststart public/screen.mp4
cp source-media/voiceover.mp3 public/voiceover.mp3
echo "Media ready in public/"

# Freeze-frame stills (recording seconds) used by the edit
mkdir -p public/stills
for t in 86.4 93.6 101.0 104.5; do
  ffmpeg -v error -y -ss "$t" -i public/screen.mp4 -frames:v 1 "public/stills/rec_${t}.png"
done
echo "Stills ready in public/stills/"
