#!/usr/bin/env python3
"""
Builds every time-critical media asset for the Remotion project:

  1. public/media/vo_final.wav  - the voiceover with a lead-in, short breathing
     gaps at section boundaries and a tail for the end card.
  2. public/media/shot_*.mp4    - cropped (no browser chrome / taskbar), upscaled
     and retimed screen-recording shots. Every piece of a shot maps a source
     interval onto a final-timeline interval (speed ramps, cuts, freeze frames)
     so on-screen clicks land on the matching voiceover words.
  3. src/data/timeline.json     - frame-accurate description of all of the above,
     consumed by the React code for overlays (spotlights, lenses, captions).

Usage:  python3 scripts/build_media.py <screen_recording.mp4> <voiceover.mp3>
Defaults to public/source/screen.mp4 and public/source/vo.mp3.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30

SCREEN = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "public/source/screen.mp4")
VO = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "public/source/vo.mp3")
MEDIA_DIR = os.path.join(ROOT, "public/media")
DATA_DIR = os.path.join(ROOT, "src/data")

# ---------------------------------------------------------------- VO timeline
LEAD = 3.0  # logo sting before the first word
CUTS = [  # (cut point in original VO seconds, silence inserted)
    (51.55, 0.5),   # intro      -> method 1
    (85.50, 0.6),   # method 1   -> part 2
    (117.80, 0.6),  # part 2     -> part 3
    (156.80, 1.0),  # part 3     -> conclusion
]
TOTAL = 187.5  # seconds, includes end-card hold


def V(t):
    """Original voiceover time -> final timeline time."""
    off = LEAD
    for c, g in CUTS:
        if t >= c:
            off += g
    return round(t + off, 4)


# --------------------------------------------------------------- crop presets
# The recording is a Teams capture: the shared screen sits at x 0..1674,
# y 68..1011 of a 1920x1080 frame. "web" removes the browser tab/address bar and
# the Windows taskbar; "xl" keeps Excel's own title bar (it is part of the app).
CROPS = {
    "web": {"crop": (1664, 830, 5, 138), "out_w": 3040},
    "xl": {"crop": (1674, 900, 0, 68), "out_w": 2880},
}

# ------------------------------------------------------------------- shots
# ('play', src_a, src_b, final_a, final_b) | ('freeze', src_t, final_a, final_b)
SHOTS = [
    {
        "id": "W1", "crop": "web", "pieces": [
            ("freeze", 9.8, 54.0, 54.9),
            ("play", 9.8, 14.8, 54.9, 57.9),        # browse, expand catalog source
            ("play", 26.9, 28.6, 57.9, 58.7),       # expand schema
            ("play", 31.0, 33.95, 58.7, 60.1),      # hover + open table
            ("play", 33.95, 35.8, 60.1, 61.1),
            ("play", 35.8, 41.5, 61.1, 65.1),       # overview / description
            ("play", 54.6, 59.5, 65.1, 68.4),       # contains / columns
            ("play", 59.5, 64.5, 68.4, 72.8),
            ("play", 69.6, 74.6, 72.8, 77.5),       # history tab click
            ("play", 74.6, 86.4, 77.5, 89.0),       # audit history
            ("play", 86.4, 88.4, 89.0, 91.2),       # stakeholders tab
            ("play", 88.4, 89.6, 91.2, 91.9),
            ("play", 93.9, 95.9, 91.9, 92.9),       # modify stakeholders (+)
            ("play", 95.9, 97.4, 92.9, 94.2),       # confirmation dialog
            ("play", 103.9, 105.0, 94.2, 94.9),     # confirm modify
            ("play", 105.0, 107.4, 94.9, 97.3),     # open role dropdown
            ("freeze", 107.6, 97.3, 99.6),          # owner / steward roles
            ("play", 107.6, 112.0, 99.6, 100.9),    # pick DE_Data_Steward
            ("play", 112.0, 118.6, 100.9, 102.9),   # search + pick user
            ("freeze", 118.6, 102.9, 112.6),        # permissions note
            ("play", 122.6, 127.0, 112.6, 116.0),   # second stakeholder
            ("play", 127.0, 128.8, 116.0, 117.8),
            ("freeze", 128.8, 117.8, 121.9),
        ],
    },
    {
        "id": "W2", "crop": "web", "pieces": [
            ("play", 182.9, 185.6, 133.6, 135.0),   # results -> actions menu
            ("play", 203.9, 205.4, 135.0, 135.7),   # export dialog
            ("play", 207.9, 210.9, 135.7, 136.9),   # start export
            ("play", 210.9, 212.6, 136.9, 137.6),   # toast
            ("play", 246.0, 249.6, 137.6, 139.0),   # open file from downloads
        ],
    },
    {
        "id": "X1", "crop": "xl", "pieces": [
            ("play", 252.4, 256.0, 139.0, 141.6),   # workbook opens on Technical Data Set
            ("freeze", 256.5, 141.6, 145.4),        # sheet tabs
            ("play", 262.0, 270.4, 145.4, 148.6),   # scroll to stakeholder role column
            ("play", 296.0, 345.6, 148.6, 151.7),   # enter username (time-lapse)
            ("play", 351.4, 356.6, 151.7, 153.6),   # scroll to operation column
            ("freeze", 356.6, 153.6, 155.3),        # Operation = Update
        ],
    },
    {
        "id": "W3", "crop": "web", "pieces": [
            ("play", 361.7, 365.6, 155.3, 157.0),   # New > Import Assets
            ("play", 367.2, 368.6, 157.0, 157.6),   # import files dialog
            ("play", 378.3, 383.2, 157.6, 159.8),   # choose file -> validated
            ("freeze", 384.0, 159.8, 161.5),
        ],
    },
]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(" ".join(cmd) + "\n" + r.stderr[-3000:])
        raise SystemExit(1)
    return r


def fr(t):
    return int(round(t * FPS))


def vf_for(crop_key):
    w, h, x, y = CROPS[crop_key]["crop"]
    ow = CROPS[crop_key]["out_w"]
    return (f"crop={w}:{h}:{x}:{y},scale={ow}:-2:flags=lanczos,"
            f"unsharp=5:5:0.55:5:5:0.0,format=yuv420p")


ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "14", "-pix_fmt", "yuv420p",
       "-r", str(FPS), "-video_track_timescale", "15360", "-an"]


def build_shot(shot, tmp):
    parts = []
    timeline_pieces = []
    for i, p in enumerate(shot["pieces"]):
        out = os.path.join(tmp, f"{shot['id']}_{i:02d}.mp4")
        if p[0] == "play":
            _, sa, sb, fa, fb = p
            n = fr(fb) - fr(fa)
            speed = (sb - sa) / (fb - fa)
            vf = (f"setpts=(PTS-STARTPTS)/{speed:.6f},fps={FPS},{vf_for(shot['crop'])},"
                  f"tpad=stop_mode=clone:stop_duration=3")
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{sa:.3f}", "-i", SCREEN,
                 "-t", f"{sb - sa + 0.3:.3f}", "-vf", vf, "-frames:v", str(n), *ENC, out])
            timeline_pieces.append({"type": "play", "srcA": sa, "srcB": sb,
                                    "from": fr(fa), "to": fr(fb), "speed": round(speed, 4)})
        else:
            _, st, fa, fb = p
            n = fr(fb) - fr(fa)
            png = os.path.join(tmp, f"{shot['id']}_{i:02d}.png")
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{st:.3f}", "-i", SCREEN,
                 "-frames:v", "1", png])
            run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS),
                 "-i", png, "-vf", vf_for(shot["crop"]), "-frames:v", str(n), *ENC, out])
            timeline_pieces.append({"type": "freeze", "srcA": st, "srcB": st,
                                    "from": fr(fa), "to": fr(fb), "speed": 0})
        parts.append(out)
    lst = os.path.join(tmp, f"{shot['id']}.txt")
    with open(lst, "w") as f:
        for p in parts:
            f.write(f"file '{p}'\n")
    dst = os.path.join(MEDIA_DIR, f"shot_{shot['id']}.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
         "-c", "copy", "-movflags", "+faststart", dst])
    # sanity check frame count
    probe = run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
                 "-show_entries", "stream=nb_read_frames,width,height", "-of", "json", dst])
    info = json.loads(probe.stdout)["streams"][0]
    start = timeline_pieces[0]["from"]
    end = timeline_pieces[-1]["to"]
    print(f"{shot['id']}: {info['width']}x{info['height']} frames={info['nb_read_frames']}"
          f" expected={end - start}")
    w, h, cx, _ = CROPS[shot["crop"]]["crop"]
    return {
        "cropX": cx,
        "id": shot["id"], "crop": shot["crop"], "src": f"media/shot_{shot['id']}.mp4",
        "from": start, "to": end, "srcW": w, "srcH": h,
        "width": int(info["width"]), "height": int(info["height"]),
        "pieces": timeline_pieces,
    }


def build_vo(tmp):
    # sample-accurate segment assembly
    segs = []
    bounds = [0.0] + [c for c, _ in CUTS] + [None]
    gaps = [LEAD] + [g for _, g in CUTS]
    filters = []
    labels = []
    idx = 0
    for k in range(len(bounds) - 1):
        a, b = bounds[k], bounds[k + 1]
        filters.append(f"anullsrc=r=44100:cl=mono,atrim=0:{gaps[k]}[s{k}]")
        labels.append(f"[s{k}]")
        trim = f"atrim=start={a}" + (f":end={b}" if b is not None else "")
        filters.append(f"[0:a]{trim},asetpts=PTS-STARTPTS[v{k}]")
        labels.append(f"[v{k}]")
        idx += 1
    n = len(labels)
    filters.append("".join(labels) + f"concat=n={n}:v=0:a=1,apad,atrim=0:{TOTAL}[out]")
    dst = os.path.join(MEDIA_DIR, "vo_final.wav")
    run(["ffmpeg", "-v", "error", "-y", "-i", VO, "-filter_complex", ";".join(filters),
         "-map", "[out]", "-ar", "48000", "-ac", "2", dst])
    print("VO ->", dst)


def main():
    os.makedirs(MEDIA_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)
    only = os.environ.get("ONLY")  # e.g. ONLY=W1,X1 to rebuild some shots
    tmp = tempfile.mkdtemp(prefix="shots_")
    try:
        if not only or "VO" in only.split(","):
            build_vo(tmp)
        shots_out = []
        prev = {}
        tl_path = os.path.join(DATA_DIR, "timeline.json")
        if os.path.exists(tl_path):
            prev = {s["id"]: s for s in json.load(open(tl_path)).get("shots", [])}
        for shot in SHOTS:
            if only and shot["id"] not in only.split(",") and shot["id"] in prev:
                shots_out.append(prev[shot["id"]])
                continue
            shots_out.append(build_shot(shot, tmp))
        timeline = {
            "fps": FPS,
            "durationInFrames": fr(TOTAL),
            "lead": LEAD,
            "cuts": [{"at": c, "gap": g} for c, g in CUTS],
            "shots": shots_out,
        }
        with open(tl_path, "w") as f:
            json.dump(timeline, f, indent=1)
        print("timeline ->", tl_path)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
