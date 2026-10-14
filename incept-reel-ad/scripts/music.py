"""Builds public/music.wav: a music bed and sound effects cued to the voiceover, ducked under the voice.
Tense and glitchy over the problem (0-10 s), warm and building once Incept enters, a hit on FREE, resolve on the CTA."""
import os, subprocess, wave
import numpy as np

SR, DUR = 48000, 39.0
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

# --- 0-10 s: tension ---
drone = pad([38, 45, 50], 10.4, a=.4, r=.6, bright=4)
place(drone * (1 + .25 * np.sin(2 * np.pi * 2 * np.arange(len(drone)) / SR)), 0, .5)
for k in range(int(10 / .25)):
    place(tick(), k * .25, .25 if k % 4 else .45, .4 if k % 2 else -.4)
for at in (1.66, 3.35):
    place(glitch(.55 if at > 3 else .25), at, .35)
place(whoosh(.5), 3.45, .6)
for at in (4.48, 5.84, 7.9):
    place(impact(1.0), at - .02, .5); place(whoosh(.35), at - .35, .35, .3)
# stall: a falling tone when "stalling" lands
n = int(.8 * SR); x = np.arange(n) / SR
place(np.sin(2 * np.pi * np.cumsum(420 * np.exp(-x * 2.5)) / SR) * env(n, .01, .4), 8.7, .18)

# --- 10-25 s: warm, building ---
place(impact(2.2), 10.0, .8); place(whoosh(.8), 9.25, .6)
BEAT = 60 / 110
prog = [(50, [62, 66, 69]), (45, [61, 64, 69]), (47, [62, 66, 71]), (43, [62, 67, 71])]  # D A Bm G
at = 10.0; b = 0
while at < 25.2:
    bass, ch = prog[b % 4]
    place(pad([bass - 12] + ch, BEAT * 8 + .6, a=.3, r=.6), at, .32)
    for k in range(16):
        m = [ch[0], ch[1], ch[2], ch[1] + 12][k % 4] + (12 if k >= 8 else 0)
        place(pluck(m), at + k * BEAT / 2, .16 if at > 13 else .1, -.3 + .2 * (k % 4))
    for k in range(4):
        if at > 11.5: place(kick(), at + k * BEAT * 2, .35)
    at += BEAT * 8; b += 1
for at in (V for V in (11.82, 13.6, 16.24, 17.84)): place(whoosh(.4), at - .4, .3)
for i, at in enumerate((20.62, 21.72, 23.02, 24.02)):
    place(pluck(74 + [0, 4, 7, 12][i], 1.2), at, .35, -.3 + .2 * i)

# --- 25-33 s: offer ---
n = int(1.3 * SR); x = np.linspace(0, 1, n)
place(fft_filter(rng.standard_normal(n), 300, 9000) * x ** 3, 26.58 - 1.3, .5)
place(impact(2.4), 26.56, 1.0)
at = 26.6; b = 0
while at < 32.9:
    bass, ch = prog[b % 4]
    place(pad([bass - 12] + [c + 12 for c in ch], BEAT * 8 + .5, a=.15, r=.5, bright=7), at, .3)
    for k in range(16): place(pluck([ch[0], ch[2], ch[1] + 12, ch[2] + 12][k % 4] + 12, .5), at + k * BEAT / 2, .14, -.4 + .25 * (k % 4))
    for k in range(4): place(kick(), at + k * BEAT * 2, .3)
    at += BEAT * 8; b += 1
for at in (28.6, 30.1): place(whoosh(.5), at - .45, .35)

# --- 33-39 s: reassurance and CTA ---
for at in (33.0, 34.2): place(pluck(86, 1.0), at, .3); place(pluck(93, 1.0), at + .02, .15)
place(pad([38, 50, 62, 66, 69, 74], 4.0, a=.4, r=1.5), 35.0, .4)
place(whoosh(.6), 35.0, .4)
place(pluck(98, 2.0), 36.54, .3); place(pluck(102, 2.0), 36.56, .16)

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
