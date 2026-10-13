"""Synthesizes the soundtrack for the reel, cued to the scene timings in index.html. Writes audio.wav."""
import wave, os
import numpy as np

SR, DUR = 48000, 15.0
N = int(SR * DUR)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(121)

def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2); R[i:j] += s * np.sqrt((1 + pan) / 2)

def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)

def lowpass(x, cutoff):
    # one-pole, cutoff may be an array
    a = np.exp(-2 * np.pi * np.broadcast_to(cutoff, x.shape) / SR)
    y = np.empty_like(x); acc = 0.0
    for k in range(len(x)):
        acc = (1 - a[k]) * x[k] + a[k] * acc; y[k] = acc
    return y

def boom(dur=1.6, f0=120, f1=38):
    n = int(dur * SR); x = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-x * 14)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = rng.standard_normal(n) * np.exp(-x * 120) * .25
    return (np.sin(ph) * env(n, .002, .5) + click) 

def kick():
    n = int(.35 * SR); x = np.arange(n) / SR
    f = 48 + 110 * np.exp(-x * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .09)

def hat():
    n = int(.08 * SR); s = rng.standard_normal(n)
    s = s - lowpass(s, 7000)
    return s * env(n, .0005, .018)

def whoosh(dur, rise=True):
    n = int(dur * SR); x = np.linspace(0, 1, n)
    s = rng.standard_normal(n)
    cut = 300 + 7000 * (x ** 2 if rise else (1 - x) ** 2)
    s = lowpass(s, cut) - lowpass(s, cut * .25)
    shape = (x ** 2.2 if rise else (1 - x) ** 1.5)
    return s * shape * 2.2

def blip(freq, dur=.25, bright=1.0):
    n = int(dur * SR); x = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * x) + .3 * bright * np.sin(2 * np.pi * freq * 2 * x) + .12 * np.sin(2 * np.pi * freq * 3.01 * x)
    return s * env(n, .002, dur / 4)

def pad(freqs, dur, a=1.2, r=1.5):
    n = int(dur * SR); x = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * x + i) + .5 * np.sin(2 * np.pi * f * 1.003 * x) for i, f in enumerate(freqs))
    e = np.minimum(1, x / a) * np.minimum(1, (dur - x) / r)
    return s * e / len(freqs)

# --- arrangement (times match T in index.html) ---
D = [73.42, 110.0, 146.83, 185.0, 220.0, 329.63]       # D add9 voicing
G = [98.0, 146.83, 196.0, 246.94, 293.66, 369.99]       # Gmaj9
A = [110.0, 164.81, 220.0, 277.18, 329.63, 440.0]       # A6/9
place(pad(D, 4.6, a=2.0), 0.0, .16)
place(pad(G, 3.6), 4.4, .14)
place(pad(A, 4.0), 7.6, .14)
place(pad(D + [587.33], 3.6, a=.4, r=2.4), 11.4, .2)

place(blip(880, .5), .12, .25)                        # dot pop
place(whoosh(.75), .27, .35)                          # stretch riser
for at, g in [(1.0, 1.0), (2.2, .6), (4.75, .55), (8.05, .6), (12.0, .9)]:
    place(boom(), at, g)
place(whoosh(1.2, rise=False), 1.0, .35, -.2)

beat = .5
for k in range(int((11.4 - 2.25) / beat)):
    at = 2.25 + k * beat
    if abs(at - 4.75) < .2 or abs(at - 8.05) < .2: continue
    place(kick(), at, .55)
    place(hat(), at + beat / 2, .35, .3 if k % 2 else -.3)
    if k % 2: place(hat(), at + beat * .75, .18, .5)

# type letters landing
for i in range(5):
    place(blip(440 * 2 ** (i * 2 / 12), .12, .3), 2.1 + i * .05, .08, -.4 + i * .2)

for at in [4.3, 7.4, 11.15]:                          # risers into each transition
    place(whoosh(.6), at, .45)
place(whoosh(.7, rise=False), 4.85, .25, .3)

# counter ticks: fast then slowing
tt = 5.0
while tt < 6.6:
    place(blip(2600, .03, .2), tt, .06, rng.uniform(-.5, .5)); tt += .025 + (tt - 5.0) * .06

# agent nodes popping in, pentatonic run
penta = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66, 1318.51, 1479.98, 1760.0]
for i, f in enumerate(penta):
    place(blip(f, .3), 8.05 + .25 + i * .11 + .15, .12, -.7 + i * .17)

# dot drops and bounces on the i
for at, g in [(12.805, .3), (13.12, .14), (13.22, .07)]:
    place(blip(1318.5, .5), at, g)
place(blip(1975.5, 1.2, .2), 12.805, .08)

# master: gentle tail fade, soft clip, normalize
fade = np.clip((DURATION - t) / 1.4 if (DURATION := DUR) else 1, 0, 1)
L *= fade; R *= fade
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.4)
mix *= .89 / np.max(np.abs(mix))
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'audio.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out)
