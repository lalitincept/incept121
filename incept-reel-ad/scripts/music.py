"""Builds public/music.wav: a music bed and sound effects cued to the voiceover, ducked under the voice.
A quiet, tense hook, warm and building from the promise onward, a hit on FREE, resolve on the CTA."""
import os, subprocess, wave
import numpy as np

SR, DUR = 48000, 32.0
V_FREE = 19.56  # "free" in the voiceover
N = int(SR * DUR); t = np.arange(N) / SR
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2); R[i:j] += s * np.sqrt((1 + pan) / 2)

hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def fft_filter(s, lo=0, hi=20000):
    S = np.fft.rfft(s); f = np.fft.rfftfreq(len(s), 1 / SR); S[(f < lo) | (f > hi)] = 0; return np.fft.irfft(S, len(s))

def pad(notes, dur, a=.8, r=1.2, bright=6):
    n = int(dur * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for j, m in enumerate(notes):
        for det in (-.005, .004):
            ph = 2 * np.pi * hz(m) * (1 + det) * x
            for k in range(1, bright): s += np.sin(k * ph + j) / k ** 1.5
    return s * np.minimum(1, x / a) * np.minimum(1, np.maximum(0, dur - x) / r) / (len(notes) * 2)

def pluck(m, dur=.6):
    n = int(dur * SR); x = np.arange(n) / SR; f = hz(m)
    s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (6 + 5 * k)) / k for k in range(1, 6))
    return s * np.minimum(1, x / .002)

def kick(gain=1):
    n = int(.4 * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-x * 30)) / SR) * env(n, .002, .12) * gain

def impact(dur=1.8):
    n = int(dur * SR); x = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(30 + 70 * np.exp(-x * 9)) / SR) * env(n, .002, .55)
    noise = fft_filter(rng.standard_normal(n), 60, 2500) * env(n, .001, .12) * .5
    return sub + noise

def whoosh(dur=.6, rise=True):
    n = int(dur * SR); x = np.linspace(0, 1, n)
    s = fft_filter(rng.standard_normal(n), 400, 6000)
    return s * ((x ** 2.5) if rise else (1 - x) ** 2) * 1.5

def glitch(dur=.5):
    n = int(dur * SR); s = np.zeros(n); k = 0
    while k < n:
        seg = int(rng.uniform(.01, .05) * SR); f = rng.uniform(200, 2400)
        x = np.arange(min(seg, n - k)) / SR
        s[k:k + len(x)] = np.sign(np.sin(2 * np.pi * f * x)) * rng.uniform(.2, .7) if rng.random() < .6 else rng.standard_normal(len(x)) * .4
        k += seg
    return fft_filter(s, 100, 7000)

def tick():
    n = int(.03 * SR); return fft_filter(rng.standard_normal(n), 3000, 12000) * env(n, .0005, .006)

# Cues follow the version 2 voiceover (word times as in src/Reel.tsx).
# --- 0-3.4 s: hook. Just a low drone and a ticking clock: no hits or glitches here ---
drone = pad([38, 45, 50], 3.9, a=.3, r=.6, bright=4)
place(drone * (1 + .25 * np.sin(2 * np.pi * 2 * np.arange(len(drone)) / SR)), 0, .5)
for k in range(int(3.4 / .25)):
    place(tick(), k * .25, .22 if k % 4 else .4, .4 if k % 2 else -.4)

# --- 3.4-19 s: warm and building from the promise onward ---
BEAT = 60 / 110
prog = [(50, [62, 66, 69]), (45, [61, 64, 69]), (47, [62, 66, 71]), (43, [62, 67, 71])]  # D A Bm G
def section(start, stop, pluck_gain, kick_from, octave=0, pad_gain=.3):
    at = start; b = 0
    while at < stop:
        bass, ch = prog[b % 4]
        place(pad([bass - 12] + [c + octave for c in ch], BEAT * 8 + .6, a=.3, r=.6), at, pad_gain)
        for k in range(16):
            m = [ch[0], ch[1], ch[2], ch[1] + 12][k % 4] + (12 if k >= 8 else 0) + octave
            place(pluck(m), at + k * BEAT / 2, pluck_gain, -.3 + .2 * (k % 4))
        for k in range(4):
            if at + k * BEAT * 2 > kick_from: place(kick(), at + k * BEAT * 2, .3)
        at += BEAT * 8; b += 1
section(3.45, 19.1, .13, 6.2)
place(impact(2.0), 6.2, .55)  # authority section lands
for i, at in enumerate((15.18, 16.06, 17.14, 18.0)):
    place(pluck(74 + [0, 4, 7, 12][i], 1.2), at, .35, -.3 + .2 * i)

# --- 19-26.6 s: the offer ---

place(impact(2.4), V_FREE - .02, .9)
section(V_FREE, 26.6, .14, V_FREE, octave=12)

# --- 26.6-32 s: reassurance and call to action ---
for at in (26.88, 27.76): place(pluck(86, 1.0), at, .3); place(pluck(93, 1.0), at + .02, .15)
place(pad([38, 50, 62, 66, 69, 74], 3.6, a=.4, r=1.5), 28.4, .4)
place(pluck(98, 2.0), 29.6, .3); place(pluck(102, 2.0), 29.62, .16)

# --- duck under the voice ---
vo = np.frombuffer(subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(here, 'public/vo.mp3'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                                  capture_output=True, check=True).stdout, dtype=np.float32)
vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
win = int(.05 * SR)
level = np.sqrt(np.convolve(vo.astype(np.float64) ** 2, np.ones(win) / win, 'same'))
speech = np.clip(level / (level.max() * .15), 0, 1)
# smooth: fast attack, slow release
g = np.empty(N); cur = 0.0
att, rel = 1 - np.exp(-1 / (.03 * SR)), 1 - np.exp(-1 / (.35 * SR))
for i in range(0, N, 48):
    target = speech[i]; cur += (target - cur) * (1 - (1 - (att if target > cur else rel)) ** 48); g[i:i + 48] = cur
duck = 1 - .5 * g

mix = np.stack([L, R]) * duck
mix *= np.clip((DUR - t) / 1.2, 0, 1)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.3)
mix *= .5 / np.max(np.abs(mix))  # bed sits well under the voice
with wave.open(os.path.join(here, 'public/music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype('<i2').tobytes())
print('wrote public/music.wav')
