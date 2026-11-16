#!/usr/bin/env bash
# Extracts the browser-content region of each screen recording as an image
# sequence (absolute source-frame numbering, 16 fps) and copies the voiceover.
# Crop removes the browser tab/URL bar, Teams participant panel and taskbar.
set -euo pipefail
cd "$(dirname "$0")/.."
CROP="crop=1660:890:6:112,scale=3320:1780:flags=lanczos,unsharp=5:5:0.35"
mkdir -p public/frames/a public/frames/b public/audio
cp source-media/voiceover.mp3 public/audio/voiceover.mp3

extract () { # src outdir startSec durSec
  local start_frame=$(( $3 * 16 ))
  ffmpeg -v error -y -ss "$3" -t "$4" -i "$1" -vf "$CROP" -q:v 3 \
    -start_number "$start_frame" "$2/%05d.jpg"
}
# Recording A: Home -> Explore -> Catalog Sources -> Test Connection -> Run -> Monitor
extract source-media/Monitoring_MCC.mp4   public/frames/a 10 160
extract source-media/Monitoring_MCC.mp4   public/frames/a 280 19
# Recording B: Monitor -> completed job overview -> subtasks -> Logs -> Download
extract source-media/Monitoring_MCC_1.mp4 public/frames/b 3 57
echo "frames A: $(ls public/frames/a | wc -l)  frames B: $(ls public/frames/b | wc -l)"
