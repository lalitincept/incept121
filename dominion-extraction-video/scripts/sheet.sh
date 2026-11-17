#!/usr/bin/env bash
# Tile out/stills/f<frame>.jpg for the given frames into a 3-column contact sheet: sheet.sh name f1 f2 ...
set -e
cd "$(dirname "$0")/../out/stills"
name=$1; shift
n=$#; inputs=""; filt=""; lay=""; i=0
for f in "$@"; do
  inputs="$inputs -i f$f.jpg"
  filt="$filt[$i:v]scale=640:360,drawtext=text='$f':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6[s$i];"
  x=$(( (i % 3) * 640 )); y=$(( (i / 3) * 360 ))
  lay="$lay${lay:+|}${x}_${y}"; i=$((i+1))
done
streams=$(for j in $(seq 0 $((n-1))); do echo -n "[s$j]"; done)
ffmpeg -v error -y $inputs -filter_complex "${filt}${streams}xstack=inputs=$n:layout=$lay:fill=black" -q:v 3 ../sheet_$name.jpg
echo out/sheet_$name.jpg
