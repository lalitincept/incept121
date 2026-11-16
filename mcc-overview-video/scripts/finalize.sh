#!/usr/bin/env bash
# Post-render: loudness-normalise the voiceover to -16 LUFS / -1.5 dBTP (two-pass,
# video stream copied untouched) and create a lightweight 1080p preview.
set -euo pipefail
cd "$(dirname "$0")/../out"
IN=MCC-Overview-4K.mp4
read -r I TP LRA TH OFF < <(ffmpeg -hide_banner -i "$IN" -vn -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 \
  | python3 -c "import sys,json,re; d=json.loads(re.search(r'\{[^}]*\}', sys.stdin.read(), re.S).group(0)); print(d['input_i'], d['input_tp'], d['input_lra'], d['input_thresh'], d['target_offset'])")
ffmpeg -v error -y -i "$IN" -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aresample=48000" \
  -c:a aac -b:a 320k -movflags +faststart tmp_norm.mp4
mv tmp_norm.mp4 "$IN"
ffmpeg -v error -y -i "$IN" -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 20 \
  -c:a aac -b:a 192k -movflags +faststart MCC-Overview-1080p-preview.mp4
echo "done: out/$IN + out/MCC-Overview-1080p-preview.mp4"
