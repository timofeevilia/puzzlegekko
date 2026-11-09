// 81 Trials sound: plucked pentatonic strings, a gong, a bell and a wooden clapper, synthesised with Web Audio.
let ctx = null, out = null, on = true, musicT = 0;
export function initSound() {
  if (ctx) { ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC(); out = ctx.createGain(); out.gain.value = .7;
  const rev = ctx.createConvolver(), len = ctx.sampleRate * 2.2, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  rev.buffer = buf; const wet = ctx.createGain(); wet.gain.value = .28;
  out.connect(ctx.destination); out.connect(rev); rev.connect(wet); wet.connect(ctx.destination);
}
export const soundOn = () => on;
export function setSound(v) { on = v; if (out) out.gain.setTargetAtTime(v ? .7 : 0, ctx.currentTime, .05); if (!v) stopMusic(); }
const midi = n => 440 * Math.pow(2, (n - 69) / 12);
// a plucked string: a bright attack falling into a soft triangle tone
function pluck(t, f, vol = .25, dur = 1.6) {
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = "triangle"; o.frequency.value = f; o2.type = "sawtooth"; o2.frequency.value = f * 2.003;
  lp.type = "lowpass"; lp.frequency.setValueAtTime(f * 8, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + .4);
  const g2 = ctx.createGain(); g2.gain.value = .25;
  o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(out);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .005); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
  o.start(t); o2.start(t); o.stop(t + dur); o2.stop(t + dur);
}
function partial(t, f, vol, dur, type = "sine") { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; o.connect(g); g.connect(out); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0005, t + dur); o.start(t); o.stop(t + dur); }
const FX = {
  pluck: t => pluck(t, midi(67 + [0, 2, 4, 7, 9][Math.random() * 5 | 0]), .18, 1),
  wood: t => { partial(t, 1180, .25, .08, "square"); partial(t, 760, .2, .06); },
  gong: t => { [1, 1.48, 2.1, 2.76, 3.4].forEach((m, i) => partial(t, 98 * m, .22 / (i + 1), 4.5 - i * .5)); },
  bell: t => { [1, 2.76, 5.4].forEach((m, i) => partial(t, 880 * m, .12 / (i + 1), 2.2 - i * .4)); },
  win: t => [62, 64, 67, 69, 74, 76, 79].forEach((n, i) => pluck(t + i * .11, midi(n), .2, 2)),
  fail: t => { pluck(t, midi(55), .25, 1.2); pluck(t + .18, midi(54), .2, 1.4); },
  wind: t => { const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b; f.type = "bandpass"; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(2400, t + .5); f.Q.value = 1.5; s.connect(f); f.connect(g); g.connect(out); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.3, t + .15); g.gain.exponentialRampToValueAtTime(.001, t + .8); s.start(t); s.stop(t + .9); },
  splash: t => FX.wind(t),
  chant: t => { [0, .35, .7].forEach(o => partial(t + o, 196, .15, .5, "triangle")); },
};
export function sfx(n) { if (!ctx || !on || !FX[n]) return; FX[n](ctx.currentTime + .01); }
// a slow, sparse melody over a drone
export function music() {
  if (!ctx || !on || musicT) return;
  const scale = [62, 64, 67, 69, 71, 74, 76, 79, 81];
  let i = 4;
  const step = () => {
    if (!on) return;
    const t = ctx.currentTime + .05;
    i = Math.max(0, Math.min(scale.length - 1, i + [-2, -1, -1, 1, 1, 2][Math.random() * 6 | 0]));
    pluck(t, midi(scale[i]), .09, 2.4);
    if (Math.random() < .3) pluck(t + .25, midi(scale[Math.max(0, i - 2)]), .06, 2);
    if (Math.random() < .12) partial(t, midi(38), .05, 6);
    musicT = setTimeout(step, 900 + Math.random() * 1400);
  };
  step();
}
export function stopMusic() { clearTimeout(musicT); musicT = 0; }
