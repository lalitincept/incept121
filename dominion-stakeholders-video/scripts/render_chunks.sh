#!/usr/bin/env bash
# Memory-safe 4K render: renders the film in resumable chunks, then joins them
# losslessly and muxes the voiceover. Usage: bash scripts/render_chunks.sh [chunkFrames] [concurrency]
set -euo pipefail
cd "$(dirname "$0")/.."
CHUNK=${1:-600}
CONC=${2:-3}
OUT=out
PARTS=$OUT/parts
FINAL=$OUT/Dominion_Stakeholders_Reviewing_Ingested_Assets_4K.mp4
mkdir -p "$PARTS"
TOTAL=$(python3 -c "import json;print(json.load(open('src/data/timeline.json'))['durationInFrames'])")
i=0
for ((a=0; a<TOTAL; a+=CHUNK)); do
  b=$((a+CHUNK-1)); ((b>=TOTAL)) && b=$((TOTAL-1))
  part=$(printf "%s/part_%03d.mp4" "$PARTS" "$i")
  if [[ ! -s "$part" ]]; then
    echo "rendering frames $a-$b -> $part"
    npx remotion render StakeholdersVideo "$part.tmp.mp4" --frames="$a-$b" --scale=2 --codec=h264 --crf=18 \
      --muted --concurrency="$CONC" --offthreadvideo-cache-size-in-bytes=1500000000 --log=error
    mv "$part.tmp.mp4" "$part"
  fi
  i=$((i+1))
done
ls "$PARTS"/part_*.mp4 | sed "s#^#file '$PWD/#; s#\$#'#" > "$PARTS/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$PARTS/list.txt" -i public/media/vo_final.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$FINAL"
echo "done -> $FINAL"
