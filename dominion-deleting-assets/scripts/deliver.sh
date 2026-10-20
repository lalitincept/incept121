#!/usr/bin/env bash
# Encode delivery files from the Remotion master (out/master_4K.mp4).
# Settings stay inside H.264 High@5.1 (4K) / High@4.1 (1080p) with 4 reference frames and
# 2-second keyframes so hardware decoders in browsers, LMS players and phones play them cleanly.
set -euo pipefail
cd "$(dirname "$0")/.."

MASTER=out/master_4K.mp4
# Voiceover gain to reach ~-16.5 LUFS integrated, -1.5 dBTP.
AUDIO=(-af "volume=2.35dB" -c:a aac -ar 48000)
TAGS=(-pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart)

ffmpeg -v error -y -i "$MASTER" \
  -c:v libx264 -preset slow -crf 17 -profile:v high -level:v 5.1 \
  -x264-params "ref=4:bframes=3:keyint=60:min-keyint=30:vbv-maxrate=40000:vbv-bufsize=80000" \
  "${TAGS[@]}" "${AUDIO[@]}" -b:a 256k out/Deleting_Assets_Correctly_4K.mp4

ffmpeg -v error -y -i "$MASTER" \
  -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -preset slow -crf 17 -profile:v high -level:v 4.1 \
  -x264-params "ref=4:bframes=3:keyint=60:min-keyint=30:vbv-maxrate=20000:vbv-bufsize=40000" \
  "${TAGS[@]}" "${AUDIO[@]}" -b:a 192k out/Deleting_Assets_Correctly_1080p.mp4

ls -la out/Deleting_Assets_Correctly_*.mp4
