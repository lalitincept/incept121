"""Synthesize the reel's temp score and sound-design cues.

No licensed music or VO was supplied, so this builds two stems that follow the
editor script's cue sheet exactly. Swap them for the real music / SFX in the
edit; the cue times below are the ones the picture is cut to.

    python3 scripts/make_audio.py   ->  assets/audio/music_temp.wav, sfx.wav
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 67.0
N = int(SR * DUR)
OUT = Path(__file__).resolve().parent.parent / "assets" / "audio"
rng = np.random.default_rng(7)  # seeded: identical output every run


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def place(buf, start, sig, gain=1.0):
    i = int(start * SR)
    j = min(N, i + len(sig))
    if i < N:
        buf[i:j] += sig[: j - i] * gain


def env(n, a, r):
    """Attack/release envelope over n samples (seconds)."""
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass(x, cutoff):
    """One-pole low-pass via FFT-free recursive filter (vectorised in blocks)."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for k in range(len(x)):
        acc = (1 - a) * x[k] + a * acc
        y[k] = acc
    return y


def soft_saw(freq, sec, harmonics=10):
    t = t_axis(sec)
    s = np.zeros_like(t)
    for h in range(1, harmonics + 1):
        s += np.sin(2 * np.pi * freq * h * t) / (h ** 1.4)
    return s


def pad(freqs, sec, a=0.6, r=0.8, detune=0.004):
    s = sum(soft_saw(f, sec) + soft_saw(f * (1 + detune), sec) for f in freqs)
    return s / (2 * len(freqs)) * env(len(s), a, r)


def kick(level=1.0):
    t = t_axis(0.45)
    f = 120 * np.exp(-t * 18) + 42
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * level


def hat(level=0.15):
    n = rng.standard_normal(int(0.05 * SR))
    n = n - lowpass(n, 6000)  # crude high-pass
    return n * np.exp(-np.arange(len(n)) / SR * 80) * level


def tick(freq=2400, level=0.25):
    t = t_axis(0.03)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 220) * level


def impact(level=1.0, sub=48):
    t = t_axis(1.6)
    body = np.sin(2 * np.pi * (sub + 60 * np.exp(-t * 25)) * t) * np.exp(-t * 3.2)
    noise = rng.standard_normal(len(t))
    crack = lowpass(noise, 2500) * np.exp(-t * 14) * 2.0
    return (body + crack) * level


def whoosh(sec=1.0, rising=True, level=0.6):
    n = rng.standard_normal(int(sec * SR))
    t = np.arange(len(n)) / len(n)
    shape = t ** 2 if rising else (1 - t) ** 2
    out = np.zeros_like(n)
    # three band-limited layers whose cutoff sweeps with the envelope
    for c in (600, 1800, 4200):
        out += lowpass(n, c) * shape
    return out / 3 * level * 3


def bass_hit(level=1.2):
    t = t_axis(2.6)
    f = 70 * np.exp(-t * 6) + 34
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.exp(-t * 1.4) * level


def riser_swell(sec=2.0, level=0.5):
    """Reverse-cymbal style swell for the emotional transition."""
    n = rng.standard_normal(int(sec * SR))
    t = np.arange(len(n)) / len(n)
    return (n - lowpass(n, 3000)) * (t ** 3) * level


# ----------------------------------------------------------------- music bed
music = np.zeros(N)
A1, A2, C3, E3, F2, G2, C2 = 55.0, 110.0, 130.81, 164.81, 87.31, 98.0, 65.41

# 0–45.6  suspense: A-minor drone + 120bpm pulse that tightens
drone = pad([A1, A2, C3 * 1.0, E3], 45.6, a=0.02, r=0.05)  # starts at full level
place(music, 0.0, drone, 0.55)
beat = 0.5
b = 0.0
while b < 45.5:
    lvl = 0.55 + 0.35 * (b / 45.6)
    place(music, b, kick(lvl))
    place(music, b + beat / 2, hat(0.05 + 0.08 * (b / 45.6)))
    b += beat
# 42–45.6 tension swell under the counter
place(music, 42.0, pad([A2, E3, A2 * 2], 3.6, a=3.0, r=0.05), 0.35)

# 45.6–46.0 clean drop (silence) -> 46.0 hit handled in sfx; sustain after
place(music, 46.0, pad([A1, A2, E3], 3.0, a=0.01, r=1.2), 0.45)

# 49–58 emotional tension: slow pads, no drums
for i, (st, chord) in enumerate([(49.0, [A2, C3, E3]), (52.0, [F2, A2, C3]),
                                 (55.0, [C2 * 2, E3, G2 * 2])]):
    place(music, st, pad(chord, 3.4, a=1.0, r=1.0), 0.5)
place(music, 49.0, lowpass(pad([A1], 9.0, a=1.5, r=1.0), 300), 0.5)

# 58–64 inspirational rise: major progression + building drums
prog = [(58.0, [C3, E3, G2 * 2]), (59.5, [G2, 123.47, 146.83]),
        (61.0, [A2, C3, E3]), (62.5, [F2, A2, C3])]
for st, chord in prog:
    place(music, st, pad(chord, 1.7, a=0.05, r=0.4), 0.55)
b = 58.0
while b < 64.0:
    place(music, b, kick(0.5 + 0.5 * (b - 58) / 6))
    b += 0.5 if b < 62 else 0.25
place(music, 61.5, riser_swell(2.8, 0.35))
# 64.3 resolve on C major, ring out
place(music, 64.3, pad([C2, C3, E3, G2 * 2], 2.7, a=0.01, r=2.0), 0.7)

# ---------------------------------------------------------------- SFX stem
sfx = np.zeros(N)
place(sfx, 1.0, impact(0.9))                       # 00:01 hook impact
place(sfx, 3.75, whoosh(0.35, rising=True, level=0.35))  # split-screen wipe
# 10–21 soft stock-ticker bed
tt = 10.0
k = 0
while tt < 21.0:
    place(sfx, tt, tick(3200 if k % 4 else 2600, 0.08))
    tt += 0.125
    k += 1
place(sfx, 17.0, whoosh(1.2, rising=True, level=0.55))  # ~00:18 overtake whoosh
place(sfx, 18.2, impact(0.8))                       # graph crosses
# 21–31 accelerating ticks
tt = 21.0
while tt < 31.0:
    prog_ = (tt - 21.0) / 10.0
    place(sfx, tt, tick(2000 + 1600 * prog_, 0.12 + 0.12 * prog_))
    tt += 0.42 * (1 - prog_) ** 1.6 + 0.045
place(sfx, 36.85, whoosh(0.5, rising=True, level=0.45))  # upward move into #1
place(sfx, 37.3, impact(0.55))
place(sfx, 46.0, bass_hit(1.3))                     # ~00:46 $17M bass hit
place(sfx, 47.0, riser_swell(2.0, 0.35))            # 00:49 emotional transition
place(sfx, 49.0, impact(0.35, sub=40))
place(sfx, 53.6, impact(0.45))                      # FIRED stamp
place(sfx, 59.0, whoosh(0.9, rising=False, level=0.4))   # zoom-out to warehouse
place(sfx, 64.3, impact(1.0))                       # 01:04 FULL EPISODE LIVE


def write(name, x, peak=0.89):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    # short fades so there's never a pop at the edges
    f = int(0.004 * SR)
    x[:f] *= np.linspace(0, 1, f)
    x[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# hard-zero the drop window so the pre-$17M silence is clean (no pop)
d0, d1 = int(45.6 * SR), int(46.0 * SR)
fade = int(0.03 * SR)
music[d0 - fade:d0] *= np.linspace(1, 0, fade)
music[d0:d1] = 0.0

OUT.mkdir(parents=True, exist_ok=True)
write("music_temp.wav", music, 0.8)
write("sfx.wav", sfx, 0.89)
print("wrote", OUT / "music_temp.wav", OUT / "sfx.wav")
