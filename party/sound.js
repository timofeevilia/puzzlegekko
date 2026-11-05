// Gekko Party sound: every effect and music loop is synthesised with Web Audio, so there are no files to load.
let ctx = null, master = null, musicBus = null, sfxBus = null, comp = null;
let enabled = true, current = null, timer = null, nextBar = 0, bar = 0;

export function initSound() {
  if (ctx) { ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(ctx.destination);
  master = ctx.createGain(); master.gain.value = .8; master.connect(comp);
  musicBus = ctx.createGain(); musicBus.gain.value = .32; musicBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.gain.value = .9; sfxBus.connect(master);
}
export function setSound(on) { enabled = on; if (master) master.gain.setTargetAtTime(on ? .8 : 0, ctx.currentTime, .05); }
export const soundOn = () => enabled;
export function duck(on) { if (musicBus) musicBus.gain.setTargetAtTime(on ? .12 : .32, ctx.currentTime, .15); }

const midi = n => 440 * Math.pow(2, (n - 69) / 12);
let noiseBuf = null;
function noise() {
  if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; return s;
}
function env(g, t, a, peak, d, sus = 0, r = .05) {
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(Math.max(sus, .0001), t + a + d);
  if (!sus) g.gain.setValueAtTime(0, t + a + d + r);
}
function tone(t, freq, { type = "sine", a = .005, d = .25, vol = .3, bus = sfxBus, glide = 0, filter = 0, q = 1, detune = 0 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t); o.detune.value = detune;
  if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, glide), t + a + d);
  let node = o;
  if (filter) { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = filter; f.Q.value = q; o.connect(f); node = f; }
  node.connect(g); g.connect(bus); env(g, t, a, vol, d); o.start(t); o.stop(t + a + d + .1);
}
function hiss(t, { d = .05, vol = .2, hp = 6000, lp = 0, bus = sfxBus, a = .002, sweep = 0 } = {}) {
  const s = noise(), g = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = lp ? "lowpass" : "highpass"; f.frequency.setValueAtTime(lp || hp, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + d);
  s.connect(f); f.connect(g); g.connect(bus); env(g, t, a, vol, d); s.start(t); s.stop(t + a + d + .1);
}
const kick = (t, bus = musicBus, v = .9) => tone(t, 150, { glide: 40, d: .22, vol: v, bus });
const snare = (t, bus = musicBus, v = .35) => { hiss(t, { d: .14, vol: v, hp: 1800, bus }); tone(t, 220, { glide: 120, d: .08, vol: v * .6, bus, type: "triangle" }); };
const hat = (t, bus = musicBus, v = .12) => hiss(t, { d: .03, vol: v, hp: 8000, bus });

// ── sound effects
const FX = {
  pop: t => tone(t, 520, { glide: 980, d: .09, vol: .35, type: "triangle" }),
  join: t => { tone(t, 660, { d: .1, vol: .25, type: "square", filter: 2400 }); tone(t + .08, 990, { d: .16, vol: .25, type: "square", filter: 2400 }); },
  tick: t => tone(t, 1800, { d: .03, vol: .18, type: "square", filter: 4000 }),
  tock: t => tone(t, 1200, { d: .03, vol: .14, type: "square", filter: 3000 }),
  whoosh: t => hiss(t, { d: .45, vol: .28, hp: 400, sweep: 5000, a: .15 }),
  ding: t => { [0, 4, 7, 12].forEach((n, i) => tone(t + i * .07, midi(72 + n), { d: .5, vol: .2, type: "triangle" })); },
  buzz: t => { tone(t, 110, { type: "sawtooth", d: .45, vol: .25, filter: 900 }); tone(t, 116, { type: "sawtooth", d: .45, vol: .22, filter: 900 }); },
  sting: t => { [0, -1, -6].forEach((n, i) => { tone(t + i * .28, midi(58 + n), { type: "sawtooth", d: .9, vol: .2, filter: 1400 }); tone(t + i * .28, midi(46 + n), { type: "sawtooth", d: .9, vol: .2, filter: 900 }); }); hiss(t + .8, { d: 1.2, vol: .2, lp: 600 }); },
  thunder: t => { hiss(t, { d: 2.2, vol: .5, lp: 300, a: .02 }); kick(t, sfxBus, .9); },
  drum: t => { for (let i = 0; i < 22; i++) snare(t + i * .055, sfxBus, .1 + i * .012); kick(t + 1.25, sfxBus); hiss(t + 1.25, { d: .6, vol: .25, hp: 5000 }); },
  cheer: t => { for (let i = 0; i < 40; i++) hiss(t + Math.random() * 1.4, { d: .05 + Math.random() * .08, vol: .08, hp: 1500 + Math.random() * 3000 }); FX.ding(t); },
  reveal: t => { tone(t, midi(67), { d: .14, vol: .2, type: "square", filter: 2000 }); tone(t + .12, midi(74), { d: .3, vol: .2, type: "square", filter: 2000 }); },
  scribble: t => { for (let i = 0; i < 6; i++) hiss(t + i * .07, { d: .05, vol: .1, hp: 2500, lp: 0 }); },
  crack: t => { hiss(t, { d: .3, vol: .45, hp: 500, a: .001 }); tone(t, 90, { glide: 40, d: .4, vol: .5 }); },
  ghost: t => { const o = ctx.createOscillator(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain(); o.type = "sine"; o.frequency.value = 520; l.frequency.value = 6; lg.gain.value = 18; l.connect(lg); lg.connect(o.frequency); o.frequency.linearRampToValueAtTime(300, t + 1.6); o.connect(g); g.connect(sfxBus); env(g, t, .3, .18, 1.4); o.start(t); l.start(t); o.stop(t + 2); l.stop(t + 2); },
  coin: t => { tone(t, midi(83), { d: .07, vol: .2, type: "square", filter: 5000 }); tone(t + .07, midi(88), { d: .25, vol: .2, type: "square", filter: 5000 }); },
  horn: t => { [0, .5].forEach(o => { tone(t + o, midi(57), { type: "sawtooth", d: .42, vol: .2, filter: 1100, a: .04 }); tone(t + o, midi(61), { type: "sawtooth", d: .42, vol: .16, filter: 1100, a: .04 }); tone(t + o, midi(64), { type: "sawtooth", d: .42, vol: .16, filter: 1100, a: .04 }); }); },
  bell: t => { tone(t, midi(84), { d: 1.2, vol: .18 }); tone(t, midi(84) * 2.76, { d: .6, vol: .06 }); },
};
export function sfx(name, delay = 0) { if (!ctx || !enabled || !FX[name]) return; FX[name](ctx.currentTime + .01 + delay); }

// ── music: each track is a function that schedules one bar starting at time t
const BPM = { lobby: 104, menu: 104, train: 84, doodle: 112, ball: 124, results: 120 };
const prog = (b, list) => list[b % list.length];
const TRACKS = {
  // laid-back groove: bass, electric-piano chords, hats
  lobby(t, b, q) {
    const ch = prog(b, [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62]]);
    [0, 8].forEach(s => kick(t + s * q, musicBus, .55)); [4, 12].forEach(s => snare(t + s * q, musicBus, .14));
    for (let s = 0; s < 16; s += 2) hat(t + s * q, musicBus, s % 4 ? .06 : .09);
    [0, 3, 6, 10, 12].forEach((s, i) => tone(t + s * q, midi(ch[0] - 24 + (i === 3 ? 7 : 0)), { type: "triangle", d: q * 1.6, vol: .5, bus: musicBus }));
    [2, 6, 11, 14].forEach(s => ch.forEach(n => tone(t + s * q, midi(n), { type: "sine", d: q * 1.2, vol: .06, bus: musicBus })));
  },
  // the haunted train: wheel rhythm in brushed noise, minor drone, music-box melody
  train(t, b, q) {
    for (let s = 0; s < 16; s++) hiss(t + s * q, { d: .05, vol: s % 4 === 0 ? .1 : s % 2 ? .035 : .06, hp: 2500, bus: musicBus });
    [0, 6, 8, 14].forEach(s => kick(t + s * q, musicBus, .35));
    const root = prog(b, [45, 45, 41, 40]);
    tone(t, midi(root - 12), { type: "sawtooth", a: .3, d: q * 15, vol: .1, bus: musicBus, filter: 380 });
    tone(t, midi(root + 3), { type: "triangle", a: .4, d: q * 15, vol: .05, bus: musicBus });
    const mel = prog(b, [[69, 72, 76, 75], [69, 72, 71, 68], [65, 69, 72, 71], [64, 68, 71, 74]]);
    mel.forEach((n, i) => tone(t + i * 4 * q + (i % 2 ? q : 0), midi(n + 12), { d: .9, vol: .045, bus: musicBus }));
  },
  // the studio: marimba over pizzicato bass and shaker
  doodle(t, b, q) {
    const ch = prog(b, [[60, 64, 67], [65, 69, 72], [62, 65, 69], [67, 71, 74]]);
    [0, 7, 10].forEach(s => kick(t + s * q, musicBus, .4)); [4, 12].forEach(s => snare(t + s * q, musicBus, .1));
    for (let s = 0; s < 16; s++) hiss(t + s * q, { d: .03, vol: s % 2 ? .03 : .05, hp: 6000, bus: musicBus });
    [0, 4, 8, 12].forEach((s, i) => tone(t + s * q, midi(ch[0] - 24 + [0, 7, 12, 7][i]), { type: "triangle", d: .18, vol: .45, bus: musicBus }));
    const pent = [0, 2, 4, 7, 9];
    for (let s = 0; s < 16; s++) if ((s * 7 + b * 3) % 5 < 2) { const n = ch[0] + 12 + pent[(s + b) % 5]; tone(t + s * q, midi(n), { d: .22, vol: .1, bus: musicBus }); tone(t + s * q, midi(n) * 4, { d: .05, vol: .02, bus: musicBus }); }
  },
  // the game show: four-on-the-floor, brass stabs, walking bass
  ball(t, b, q) {
    const ch = prog(b, [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]);
    [0, 4, 8, 12].forEach(s => kick(t + s * q, musicBus, .55)); [4, 12].forEach(s => snare(t + s * q, musicBus, .18));
    for (let s = 2; s < 16; s += 4) hat(t + s * q, musicBus, .1);
    [0, 2, 4, 6, 8, 10, 12, 14].forEach((s, i) => tone(t + s * q, midi(ch[0] - 24 + [0, 7, 12, 7, 0, 4, 7, 9][i]), { type: "sawtooth", d: q * 1.5, vol: .14, bus: musicBus, filter: 700 }));
    [3, 6, 14].forEach(s => ch.forEach(n => tone(t + s * q, midi(n + 12), { type: "sawtooth", d: .12, vol: .035, bus: musicBus, filter: 2200, a: .01 })));
  },
};
TRACKS.menu = TRACKS.lobby; TRACKS.results = TRACKS.ball;

export function music(name) {
  if (!ctx || current === name) return;
  current = name; clearInterval(timer); if (!name || !TRACKS[name]) return;
  bar = 0; nextBar = ctx.currentTime + .1;
  const q = 60 / BPM[name] / 4; // one 16th
  const sched = () => { while (nextBar < ctx.currentTime + .6) { if (enabled) TRACKS[name](nextBar, bar, q); bar++; nextBar += q * 16; } };
  sched(); timer = setInterval(sched, 150);
}

// ── host voice through the browser's speech synthesiser (English and Russian only; Burmese voices are rare)
let voiceOn = true;
export function setVoice(on) { voiceOn = on; if (!on) speechSynthesis?.cancel(); }
export const voiceEnabled = () => voiceOn;
export function say(text, lang, { pitch = 1, rate = 1 } = {}) {
  if (!voiceOn || !enabled || !window.speechSynthesis || !text || lang === "my") return 0;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "ru" ? "ru-RU" : "en-US"; u.pitch = pitch; u.rate = rate;
  const v = speechSynthesis.getVoices().find(v => v.lang.replace("_", "-").startsWith(u.lang.slice(0, 2)));
  if (v) u.voice = v;
  speechSynthesis.cancel(); duck(true); u.onend = () => duck(false); speechSynthesis.speak(u);
  return 1;
}
