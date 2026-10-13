"""Synthesizes the soundtrack: soft piano over a warm string pad, about 80 BPM, no drums.
Cues follow the scene timings in index.html. Writes audio.wav."""
import wave, os
import numpy as np

SR, DUR = 48000, 30.0
N = int(SR * DUR)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(121)

def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2); R[i:j] += s * np.sqrt((1 + pan) / 2)

def hz(note):  # MIDI note -> Hz
    return 440.0 * 2 ** ((note - 69) / 12)

def piano(note, dur=3.0, vel=1.0):
    n = int(dur * SR); x = np.arange(n) / SR; f = hz(note)
    s = np.zeros(n)
    for k in range(1, 8):
        fk = f * k * (1 + .0004 * k * k)
        if fk > SR / 2.2: break
        s += np.sin(2 * np.pi * fk * x) * (1 / k ** 1.6) * np.exp(-x * (1.1 + .7 * k) * (f / 400) ** .3)
    att = np.minimum(1, x / .004)
    hammer = rng.standard_normal(n) * np.exp(-x * 400) * .02
    return (s * att + hammer) * vel * np.minimum(1, (dur - x) / .3)

def strings(notes, dur, a=1.8, r=2.0):
    n = int(dur * SR); x = np.arange(n) / SR
    s = np.zeros(n)
    for j, note in enumerate(notes):
        for det in (-.004, 0, .005):
            f = hz(note) * (1 + det)
            vib = 1 + .002 * np.sin(2 * np.pi * 5.2 * x + j)
            ph = 2 * np.pi * np.cumsum(np.full(n, f) * vib) / SR
            for k in range(1, 7):  # band-limited soft saw
                s += np.sin(k * ph + j) / k ** 1.4
    env = np.minimum(1, x / a) * np.minimum(1, np.maximum(0, dur - x) / r)
    return s * env / (len(notes) * 3)

def bell(note, dur=3.0):
    n = int(dur * SR); x = np.arange(n) / SR; f = hz(note)
    s = np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 3) + .2 * np.sin(2 * np.pi * f * 5.4 * x) * np.exp(-x * 6)
    return s * np.minimum(1, x / .003) * np.exp(-x * 1.6)

def swell(dur, at_peak=.8):
    n = int(dur * SR); x = np.linspace(0, 1, n)
    s = rng.standard_normal(n)
    S = np.fft.rfft(s); fr = np.fft.rfftfreq(n, 1 / SR)
    S *= np.exp(-fr / 900)  # dark, airy
    s = np.fft.irfft(S, n)
    env = np.where(x < at_peak, (x / at_peak) ** 2, np.exp(-(x - at_peak) * 12))
    return s / np.max(np.abs(s)) * env

# chord per 3 s bar (80 BPM, 4/4): bass, then voicing
BARS = [
    (38, [62, 66, 69, 76]),  # D add9
    (35, [62, 66, 69, 73]),  # Bm7
    (31, [62, 67, 71, 74]),  # Gmaj7
    (33, [61, 64, 69, 71]),  # A add9
    (30, [62, 66, 69, 74]),  # D/F#
    (31, [62, 67, 71, 78]),  # Gmaj7  (partner card swell)
    (35, [62, 66, 71, 73]),  # Bm7
    (31, [62, 67, 71, 74]),  # G
    (33, [62, 64, 69, 71]),  # A sus
    (38, [62, 66, 69, 74]),  # D, end card
]
BAR = 3.0; E8 = BAR / 8

for b, (bass, voice) in enumerate(BARS):
    at = b * BAR
    last = b == len(BARS) - 1
    place(strings([bass + 12] + voice[:3], BAR + (2.0 if not last else 0) if not last else DUR - at, a=1.4 if b else 2.5, r=1.6 if not last else 2.5),
          at, .16 if b in (5, 9) else .12)
    place(piano(bass, 4.0, .55), at, .5)
    if b == 0:
        for k, note in enumerate([voice[0], voice[2], voice[3]]):  # sparse intro
            place(piano(note + 12, 3.5, .5), 1.0 + k * E8 * 2, .32, .2)
        continue
    if last:
        # final chord, rolled, held under the end card
        for k, note in enumerate(sorted(voice + [voice[0] + 12])):
            place(piano(note, DUR - at - .1, .7), at + .5 + k * .06, .38, -.3 + k * .15)
        continue
    pattern = [voice[0], voice[2], voice[3] + 12 - 12, voice[1] + 12, voice[2] + 12, voice[1] + 12, voice[3], voice[2]]
    for k, note in enumerate(pattern):
        vel = .75 if k == 0 else .5 + .08 * (k % 2)
        place(piano(note, 2.6, vel), at + k * E8, .3, -.35 + .1 * k)

# melody: a few long notes over the changes
for at, note in [(6.0, 81), (7.5, 79), (12.0, 78), (14.7, 83), (16.2, 81), (18.0, 78), (21.0, 79), (24.0, 76), (25.5, 78)]:
    place(piano(note, 3.0, .7), at, .26, .25)

# soft bells as each governance area lights up (scene 3)
for i, note in enumerate([74, 76, 78, 81, 83, 86, 88]):
    place(bell(note, 2.0), 6.6 + .9 + i * .45 + .1, .045, -.6 + i * .2)
# agents: quicker, quieter run
for i, note in enumerate([81, 83, 86, 88, 90, 93, 95, 98, 100]):
    place(bell(note, 1.2), 20.7 + .35 + i * .08 + .15, .02, -.7 + i * .17)
# swells into the partner card and into the end card
place(swell(1.6), 14.7 - 1.3, .05)
place(swell(1.8), 26.6 - 1.2, .06)
# chime as the i-dot settles
place(bell(86, 4.0), 27.1 + 1.25, .08)
place(bell(93, 4.0), 27.1 + 1.27, .04, .3)

# reverb: convolve with a decaying noise tail
ir_n = int(2.6 * SR); xi = np.arange(ir_n) / SR
ir = rng.standard_normal((2, ir_n)) * np.exp(-xi * 2.4)
IRf = np.fft.rfftfreq(ir_n, 1 / SR)
ir = np.fft.irfft(np.fft.rfft(ir, axis=1) * np.exp(-IRf / 5000), ir_n, axis=1)
ir /= np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))
def conv(a, b):
    m = len(a) + len(b) - 1; nfft = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(a, nfft) * np.fft.rfft(b, nfft), nfft)[:len(a)]
dry = np.stack([L, R])
wet = np.stack([conv(L, ir[0]), conv(R, ir[1])])
mix = dry + .35 * wet

fade = np.clip((DUR - t) / 1.8, 0, 1) * np.clip(t / .3, 0, 1)
mix *= fade
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.2)
mix *= .85 / np.max(np.abs(mix))
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'audio.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype('<i2').tobytes())
print('wrote', out)
