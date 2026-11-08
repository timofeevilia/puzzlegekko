// Gekko Party, the big screen. It owns the game: phones only send inputs, the host decides and writes party/<ROOM>/game/state.
import { L, HT, esc, shuffle, critter, tooClose, norm, fmtNum, hostLangs, REACTIONS, paintStrokes, COLOR_PAIRS } from "./common.js";
import * as C from "./content.js";
import { CONDUCTOR, PAINTER, OWL, MASCOT, TRAIN_LAYERS, CARRIAGE, trainTrack, DOODLES, PENCIL, COPIER, CHALK } from "./art.js";
import { initSound, sfx, music, say, setSound, setVoice, soundOn, voiceEnabled } from "./sound.js";

const $ = s => document.querySelector(s);
let net, db, me, room, S = null, IN = {}, ART = {}, ARTX = {}, LIVE = "", FIRST = {}, docsInput = [], PL = [], lastReact = {}, endedStep = -1, curScene = "", lastInCount = 0, tickedSec = -1;
const ri = n => Math.random() * n | 0;
export { COLOR_PAIRS };
const MAXP = () => S.ver === "pair" ? 2 : 8;
const MINP = 2;
const TIMED = new Set(["tr_q", "tr_t", "tr_fq", "dd_draw", "dd_lie", "dd_vote", "dd_pick", "bp_q", "bp_bet", "qs_draw", "cc_draw", "cc_copy", "cc_guess"]);
const clean = o => JSON.parse(JSON.stringify(o));
const name = id => esc(S.players.find(p => p.id === id)?.name || "?");
const P = id => S.players.find(p => p.id === id);
const H = (x, vars) => HT(x, S.ver, vars);
const H1 = (k, vars) => esc(L(k, hostLangs(S.ver)[0], vars)); // short labels: first language only
const speakLang = () => S.ver === "pair" ? "ru" : S.ver;

// ── boot
export async function startHost(ver, code) {
  net = await import("../shared/net.js");
  document.body.classList.add("is-host");
  $("#app").innerHTML = `<div id="viewport"><div id="stage"><div id="bg"></div><div id="fg"></div><div id="strip"></div><div id="hud"></div><div id="fx"></div></div></div>`;
  fit(); addEventListener("resize", fit);
  let resumed = false;
  for (let tries = 0; tries < 5; tries++) {
    room = code || net.newRoomCode(4);
    const r = await net.openRoom("party", room); db = r.db; me = r.uid;
    const old = await db.doc("game/state").get().catch(() => null);
    if (old?.exists && old.data().host === me && code) { S = old.data(); resumed = true; break; }
    if (old?.exists) { code = null; continue; } // someone else's room: take another code
    S = { host: me, ver, room, phase: "lobby", step: 1, dl: 0, now: Date.now(), players: [], vip: "", score: {}, wins: {}, g: "", tr: {}, dd: {}, bp: {}, res: {} };
    break;
  }
  location.hash = "host=" + room;
  document.title = "Gekko Party · " + room;
  db.col("players").onSnapshot(list => { PL = list; syncPlayers(); }, err);
  db.col("input").onSnapshot(list => { docsInput = list; readInputs(); }, err);
  if (!resumed) push();
  paint();
  setVoice(S.ver !== "pair");
  setInterval(loop, 200);
  window.__gp = () => S; window.__gpSkip = skip; // handy in the console and for tests
  addEventListener("keydown", e => { if (e.key === "ArrowRight" && e.shiftKey) skip(); });
  document.addEventListener("pointerdown", () => initSound(), { once: true });
}
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  const st = $("#stage"); if (st) st.style.transform = `translate(-50%,-50%) scale(${s})`;
}
function err(e) { console.error(e); $("#hud") && ($("#hud").insertAdjacentHTML("beforeend", `<div class="neterr">${esc(e.code || "")} ${esc(e.message || "")}</div>`)); }
function push() { S.now = Date.now(); db.doc("game/state").set(clean(S)).catch(err); }

// ── phase engine
function go(phase, secs = 0) {
  S.phase = phase; S.step++; S.dl = secs ? Date.now() + secs * 1000 : 0;
  IN = {}; lastInCount = 0; tickedSec = -1;
  push(); paint(); G[phase]?.enter?.();
  readInputs();
}
function endPhase() { if (endedStep === S.step) return; endedStep = S.step; G[S.phase]?.end?.(); }
export function skip() { endPhase(); }
function loop() {
  if (!S) return;
  if (S.dl && Date.now() >= S.dl) endPhase();
  const left = S.dl ? Math.max(0, S.dl - Date.now()) : 0, el = $("#timer");
  if (el) {
    const tot = (G[S.phase]?.secs || 20) * 1000;
    el.style.setProperty("--p", Math.min(1, left / tot));
    el.querySelector("b").textContent = Math.ceil(left / 1000);
    el.classList.toggle("hurry", left < 5500 && left > 0);
    const sec = Math.ceil(left / 1000);
    if (left > 0 && sec <= 5 && sec !== tickedSec) { tickedSec = sec; sfx(sec % 2 ? "tick" : "tock"); }
  }
}
const valid = id => !!IN[id] && (G[S.phase]?.valid ? G[S.phase].valid(id) : true);
function readInputs() {
  if (!S) return;
  IN = {};
  for (const d of docsInput) {
    const owner = d.id.split("_")[0];
    if (d.id.endsWith("_r")) { if (d.data.t && d.data.t !== lastReact[owner]) { const first = lastReact[owner] === undefined; lastReact[owner] = d.data.t; if (!first && Date.now() - d.data.t < 8000) floatReaction(owner, d.data.e); } continue; }
    if (d.id.endsWith("_lv")) { if (d.data.k === S.step && d.data.s !== LIVE) { LIVE = d.data.s; paintLive(); } continue; }
    const m = d.id.match(/_d(\d+)$/); if (m && d.data.s) ART[owner + ":" + m[1]] = d.data.s;
    if (d.data.s) ARTX[d.id] = d.data.s;
    if (d.data.k === S.step && S.players.some(p => p.id === owner)) IN[owner] = d.data;
  }
  G[S.phase]?.onInput?.();
  const n = Object.keys(IN).filter(valid).length;
  if (n > lastInCount) sfx("pop");
  lastInCount = n;
  paintStrip();
  const need = G[S.phase]?.need?.();
  if (need && need.length && need.every(valid)) { const st = S.step; setTimeout(() => { if (S.step === st) endPhase(); }, 900); }
}

// ── players
function syncPlayers() {
  if (!S) return;
  const open = ["lobby", "menu", "res"].includes(S.phase);
  let changed = false;
  for (const d of PL.slice().sort((a, b) => (a.data.t || 0) - (b.data.t || 0))) {
    const nm = String(d.data.name || "").trim().slice(0, 14) || "Player";
    let p = P(d.id);
    const lang = S.ver === "pair" ? (d.data.lang === "my" ? "my" : "ru") : S.ver;
    if (p) {
      if (open && (p.name !== nm || p.av !== (d.data.av | 0) || p.lang !== lang)) { p.name = nm; p.av = freeAv(d.data.av | 0, d.id); p.lang = lang; changed = true; }
    } else if (open && S.players.length < MAXP()) {
      S.players.push({ id: d.id, name: nm, av: freeAv(d.data.av | 0, d.id), lang }); S.score[d.id] = 0; S.wins[d.id] = S.wins[d.id] || 0; changed = true; sfx("join");
    }
  }
  if (!S.vip || !P(S.vip)) { S.vip = S.players[0]?.id || ""; changed = true; }
  if (changed) { push(); if (open) paint(); else paintStrip(); }
}
function freeAv(av, id) {
  const taken = new Set(S.players.filter(p => p.id !== id).map(p => p.av));
  for (let k = 0; k < 12; k++) { const a = (av + k) % 12; if (!taken.has(a)) return a; }
  return av;
}
const ids = () => S.players.map(p => p.id);
const zeroScores = () => { S.score = {}; ids().forEach(id => S.score[id] = 0); };
const add = (id, n) => { S.score[id] = (S.score[id] || 0) + n; };

// ── rendering
const SCENE = ph => ph === "lobby" ? "lobby" : ph === "menu" ? "menu" : ph === "res" ? "res" : ph.startsWith("tr_") ? "train" : ph.startsWith("dd_") || ph.startsWith("cc_") ? "doodle" : ph.startsWith("qs_") ? "chalk" : "ball";
function paint() {
  const sc = SCENE(S.phase);
  if (sc !== curScene) { curScene = sc; $("#bg").innerHTML = BG[sc](); $("#stage").dataset.scene = sc; music(sc === "res" ? "results" : sc === "chalk" ? "ball" : sc); }
  const fg = $("#fg"), html = (VIEW[S.phase] || (() => ""))();
  fg.innerHTML = `<div class="phase ph-${S.phase}">${html}</div>`;
  paintHud(); paintStrip();
  VIEW_AFTER[S.phase]?.();
}
function paintHud() {
  const timed = TIMED.has(S.phase) && S.dl;
  $("#hud").innerHTML = `
    <div class="roomchip"><span>${esc(joinHost())}</span><b>${esc(room)}</b></div>
    ${timed ? `<div id="timer" class="timer"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><circle class="arc" cx="50" cy="50" r="44"/></svg><b></b></div>` : ""}
    <div class="hostmenu">
      <button data-h="sound" class="${soundOn() ? "on" : ""}" title="${esc(L("sound", speakLang()))}">${soundOn() ? "🔊" : "🔇"}</button>
      <button data-h="voice" class="${voiceEnabled() ? "on" : ""}" title="${esc(L("voice", speakLang()))}">🗣️</button>
      <button data-h="full" title="${esc(L("fullscreen", speakLang()))}">⛶</button>
      ${S.phase !== "lobby" && S.phase !== "menu" ? `<button data-h="menu" title="${esc(L("back", speakLang()))}">☰</button>` : ""}
      ${S.dl ? `<button data-h="skip" title="Skip">⏭</button>` : ""}
    </div>`;
  $("#hud").onclick = e => {
    const b = e.target.closest("[data-h]"); if (!b) return; initSound();
    const h = b.dataset.h;
    if (h === "sound") setSound(!soundOn());
    if (h === "voice") setVoice(!voiceEnabled());
    if (h === "full") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    if (h === "menu") { S.g = ""; go("menu"); return; }
    if (h === "skip") skip();
    paintHud(); loop();
  };
  loop();
}
const joinHost = () => (location.host + location.pathname).replace(/index\.html$/, "").replace(/\/$/, "");
function paintStrip() {
  const el = $("#strip"); if (!el || !S) return;
  if (["lobby", "res"].includes(S.phase)) { el.innerHTML = ""; return; }
  const need = new Set(G[S.phase]?.need?.() || []);
  el.innerHTML = S.players.map(p => {
    const dead = S.g === "train" && S.tr.alive && S.tr.alive[p.id] === false;
    const done = need.has(p.id) && valid(p.id);
    return `<div class="pl ${dead ? "ghost" : ""} ${need.has(p.id) ? "waiting" : ""} ${done ? "done" : ""}" data-id="${p.id}">
      <div class="av">${critter(p.av, dead ? "dead" : done ? "happy" : "idle")}${done ? `<i class="ok">✓</i>` : ""}${p.id === S.vip ? `<i class="vipb">VIP</i>` : ""}</div>
      <span class="nm">${esc(p.name)}</span><span class="sc">${fmtNum(S.score[p.id] || 0, "en")}</span></div>`;
  }).join("");
}
function floatReaction(id, e) {
  if (!REACTIONS.includes(e)) return;
  const src = document.querySelector(`#strip .pl[data-id="${id}"]`), fx = $("#fx");
  const x = src ? src.offsetLeft + src.offsetWidth / 2 : 960 + (Math.random() - .5) * 600;
  const n = document.createElement("div"); n.className = "react"; n.textContent = e;
  n.style.left = x + "px"; n.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
  fx.append(n); setTimeout(() => n.remove(), 2600); sfx("pop");
}
function confetti(n = 120) {
  const fx = $("#fx"), cols = ["#ffd23f", "#ff5fa2", "#2fb5ff", "#7ed957", "#ff7a59", "#9a7bff"];
  for (let i = 0; i < n; i++) { const c = document.createElement("i"); c.className = "conf"; c.style.left = Math.random() * 1920 + "px"; c.style.background = cols[i % cols.length]; c.style.setProperty("--d", (2 + Math.random() * 2.5) + "s"); c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg"); c.style.animationDelay = Math.random() * .8 + "s"; fx.append(c); setTimeout(() => c.remove(), 5500); }
}
function hostLine(text, { pitch = 1, rate = 1 } = {}) {
  const t = typeof text === "string" ? L(text, speakLang()) : text[speakLang()];
  say(t, speakLang(), { pitch, rate });
  const n = document.querySelector(".host"); if (n) { n.classList.add("talk"); setTimeout(() => n.classList.remove("talk"), Math.min(9000, 900 + t.length * 55)); }
}
const hostSvg = { train: CONDUCTOR, doodle: PAINTER, ball: OWL, chalk: PENCIL, lobby: MASCOT, menu: MASCOT, res: MASCOT };
const GAME_HOST = { train: CONDUCTOR, doodle: PAINTER, ball: OWL, quick: PENCIL, copy: COPIER };
const bubble = (key, cls = "") => `<div class="host ${cls}">${(GAME_HOST[S.g] || hostSvg[curScene])}<div class="bubble">${H(key)}</div></div>`;

// ── backgrounds per scene
const BG = {
  lobby: () => `<div class="bg-party"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="leaves">${"<i></i>".repeat(14)}</div></div>`,
  menu: () => BG.lobby(),
  res: () => `<div class="bg-party res"><div class="rays"></div><div class="blob b1"></div><div class="blob b2"></div></div>`,
  train: () => `<div class="bg-train"><div class="sky"><div class="moon"></div><div class="stars"></div></div>
     <div class="layer hills" style="background-image:${TRAIN_LAYERS.hills}"></div>
     <div class="layer trees" style="background-image:${TRAIN_LAYERS.trees}"></div>
     <div class="layer poles" style="background-image:${TRAIN_LAYERS.poles}"></div>
     <div class="rain"></div>${CARRIAGE}<div class="flash"></div><div class="vignette"></div></div>`,
  doodle: () => `<div class="bg-doodle">${DOODLES}<div class="grain"></div></div>`,
  chalk: () => `<div class="bg-chalk">${CHALK}<div class="dust"></div></div>`,
  ball: () => `<div class="bg-ball"><div class="burst"></div><div class="lights">${"<i></i>".repeat(9)}</div><div class="floor"></div></div>`,
};

// ── views per phase
const VIEW = {}, VIEW_AFTER = {}, G = {};

// lobby
VIEW.lobby = () => {
  const max = MAXP(), url = joinHost();
  const slots = Array.from({ length: max }, (_, i) => {
    const p = S.players[i];
    return p ? `<div class="slot full" style="--d:${i * 60}ms"><div class="av bob">${critter(p.av, "happy")}</div><b>${esc(p.name)}</b>${p.id === S.vip ? `<i class="vipb">VIP</i>` : ""}${S.ver === "pair" ? `<small>${p.lang === "my" ? "မြန်မာ" : "Русский"}</small>` : ""}</div>`
      : `<div class="slot"><div class="q">?</div></div>`;
  }).join("");
  const enough = S.players.length >= MINP;
  return `<div class="lobby ${S.ver === "pair" ? "pair" : ""}">
    <div class="lobby-l">
      <div class="logo">${MASCOT}<h1>${H("brand")}</h1></div>
      <div class="joincard">
        <p>${H("joinAt")}</p>
        <div class="url">${esc(url)}</div>
        <div class="code">${[...room].map((c, i) => `<span style="--i:${i}">${c}</span>`).join("")}</div>
        <div class="qr-row"><div id="qr"></div><small>${H("scan")}</small></div>
      </div>
      <div class="ver">${esc(S.ver === "pair" ? L("vPair", "ru") + " · " + L("vPair", "my") : L(S.ver === "en" ? "vEn" : "vRu", S.ver))}</div>
    </div>
    <div class="lobby-r">
      <h2>${S.players.length ? H(enough ? "vipHint" : "needMore", { n: MINP }) : H("waitingFor")}</h2>
      <div class="slots cap${max}">${slots}</div>
      ${enough ? `<button class="bigbtn" data-act="start">${H("start")} →</button>` : ""}
    </div></div>`;
};
VIEW_AFTER.lobby = () => {
  const el = $("#qr");
  if (el && window.qrcode) { const q = window.qrcode(0, "M"); q.addData(location.origin + location.pathname + "#" + room); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); }
  bindActs();
};
G.lobby = {
  onInput() { if (IN[S.vip]?.start && S.players.length >= MINP) go("menu"); },
};
function bindActs() {
  $("#fg").onclick = e => {
    const b = e.target.closest("[data-act]"); if (!b) return; initSound();
    const a = b.dataset.act;
    if (a === "start" && S.players.length >= MINP) go("menu");
    if (a.startsWith("game:")) startGame(a.slice(5));
    if (a === "next") { S.g = ""; go("menu"); }
  };
}

// menu
const GAMES = [
  { id: "train", nm: "trName", tag: "trTag", art: CONDUCTOR, cls: "poster-train" },
  { id: "doodle", nm: "ddName", tag: "ddTag", tagPair: "ddTagPair", art: PAINTER, cls: "poster-doodle" },
  { id: "ball", nm: "bpName", tag: "bpTag", art: OWL, cls: "poster-ball" },
  { id: "quick", nm: "qsName", tag: "qsTag", art: PENCIL, cls: "poster-quick" },
  { id: "copy", nm: "ccName", tag: "ccTag", art: COPIER, cls: "poster-copy" },
];
VIEW.menu = () => `<div class="menu"><h2>${H("pickGame")}</h2><p class="sub">${H1("vipPicks")}: <b>${name(S.vip)}</b></p>
  <div class="posters">${GAMES.map((g, i) => `<button class="poster ${g.cls}" data-act="game:${g.id}" style="--d:${i * 90}ms">
    <div class="pa">${g.art}</div><h3>${H(g.nm)}</h3><p>${H(S.ver === "pair" && g.tagPair ? g.tagPair : g.tag)}</p></button>`).join("")}</div></div>`;
VIEW_AFTER.menu = bindActs;
G.menu = { enter() { sfx("whoosh"); }, onInput() { const g = IN[S.vip]?.game; if (g && GAMES.some(x => x.id === g)) startGame(g); } };
function startGame(g) {
  zeroScores(); S.g = g; sfx("horn");
  if (g === "train") startTrain(); else if (g === "doodle") startDoodle(); else if (g === "quick") startQuick(); else if (g === "copy") startCopy(); else startBall();
}

// results
function results() {
  const rank = ids().sort((a, b) => (S.score[b] || 0) - (S.score[a] || 0));
  let win = rank[0];
  if (S.g === "train" && S.tr.win) win = S.tr.win;
  if (win) S.wins[win] = (S.wins[win] || 0) + 1;
  S.res = { rank: win ? [win, ...rank.filter(x => x !== win)] : rank, g: S.g };
  go("res");
}
VIEW.res = () => {
  const r = S.res.rank, podium = [r[1], r[0], r[2]];
  const gname = GAMES.find(g => g.id === S.res.g)?.nm;
  return `<div class="results"><h2>${gname ? H1(gname) + " · " : ""}${H1("final")}</h2>
    <div class="podium">${podium.map((id, i) => id ? `<div class="pod p${[2, 1, 3][i]}" style="--d:${[600, 1200, 200][i]}ms"><div class="av bob">${critter(P(id).av, i === 1 ? "happy" : "idle")}</div>${i === 1 ? `<div class="crown">👑</div>` : ""}<b>${name(id)}</b><span>${fmtNum(S.score[id] || 0, "en")}</span><div class="step">${[2, 1, 3][i]}</div></div>` : `<div class="pod empty"></div>`).join("")}</div>
    <div class="rest">${r.slice(3).map((id, i) => `<div><b>${i + 4}.</b> ${name(id)} <span>${fmtNum(S.score[id] || 0, "en")}</span></div>`).join("")}</div>
    <div class="crowns">${S.players.filter(p => S.wins[p.id]).map(p => `<span>${esc(p.name)} ${"👑".repeat(Math.min(5, S.wins[p.id]))}</span>`).join("")}</div>
    <button class="bigbtn" data-act="next">${H("playAgain")} →</button></div>`;
};
VIEW_AFTER.res = () => { bindActs(); sfx("cheer"); confetti(); };
G.res = { onInput() { if (IN[S.vip]?.next) { S.g = ""; go("menu"); } } };

// ═════════ THE LAST TRAIN ═════════
const TRIALS = ["seats", "math", "lamps", "brake"];
const TRIAL_SECS = { seats: 14, math: 25, lamps: 26, brake: 22 };
const FIN = 10, MAXF = 9;
function startTrain() {
  const n = 8;
  S.tr = { qs: shuffle([...C.trivia.keys()]).slice(0, n), qi: -1, alive: {}, tickets: {}, order: shuffle(TRIALS), tn: 0, cond: [], ans: {}, res: {}, pos: {}, fd: {}, fn: 0, cats: shuffle([...C.finals.keys()]), win: "" };
  ids().forEach(id => { S.tr.alive[id] = true; S.tr.tickets[id] = 0; });
  go("tr_intro", 12);
}
const TQ = () => C.trivia[S.tr.qs[S.tr.qi]];
G.tr_intro = { enter() { setTimeout(() => hostLine("trIntro", { pitch: .7, rate: .95 }), 600); }, end: trNext };
VIEW.tr_intro = () => `<div class="tr-intro"><div class="title-card"><h1 class="drip">${H("trName")}</h1></div>${bubble("trIntro", "big")}</div>`;
function trNext() {
  const t = S.tr; t.qi++;
  if (t.qi >= t.qs.length) return go("tr_fi", 14);
  t.opts = shuffle([0, 1, 2, 3]); t.ans = {}; t.cond = [];
  go("tr_q", 20);
}
const optCls = ["oa", "ob", "oc", "od"];
VIEW.tr_q = () => { const q = TQ(), t = S.tr;
  return `<div class="tr-q"><div class="ticket"><div class="tno">${H1("question")} ${t.qi + 1} ${H1("of")} ${t.qs.length}</div><h2>${H(q.q)}</h2></div>
    <div class="opts">${t.opts.map((o, i) => `<div class="opt ${optCls[i]}" style="--d:${300 + i * 120}ms"><i>${"ABCD"[i]}</i><span>${H(q.a[o])}</span><div class="who"></div></div>`).join("")}</div>
    <div class="host small">${CONDUCTOR}</div></div>`; };
G.tr_q = { secs: 20, need: ids, enter() { sfx("bell"); }, end() {
  const t = S.tr, right = t.opts.indexOf(0);
  ids().forEach(id => {
    const a = IN[id] ? IN[id].a : -1; t.ans[id] = a;
    if (a === right) { if (t.alive[id]) add(id, 1000); else t.tickets[id] = Math.min(3, (t.tickets[id] || 0) + 1); }
    else if (t.alive[id]) t.cond.push(id);
  });
  go("tr_rev", 7);
} };
VIEW.tr_rev = () => { const q = TQ(), t = S.tr, right = t.opts.indexOf(0);
  return `<div class="tr-q rev"><div class="ticket"><div class="tno">${H1("question")} ${t.qi + 1} ${H1("of")} ${t.qs.length}</div><h2>${H(q.q)}</h2></div>
    <div class="opts">${t.opts.map((o, i) => `<div class="opt ${optCls[i]} ${i === right ? "right" : "wrong"}"><i>${"ABCD"[i]}</i><span>${H(q.a[o])}</span>
      <div class="who">${ids().filter(id => t.ans[id] === i).map(id => `<span class="mini ${t.alive[id] ? "" : "ghost"}">${critter(P(id).av, i === right ? "happy" : "shock")}</span>`).join("")}</div></div>`).join("")}</div>
    <div class="verdict ${t.cond.length ? "bad" : "good"}">${t.cond.length ? H("wrongTrial") : H("allRight")}</div>
    <div class="host small">${CONDUCTOR}</div></div>`; };
G.tr_rev = { enter() { setTimeout(() => sfx(S.tr.cond.length ? "buzz" : "ding"), 300); }, end() {
  const t = S.tr;
  if (!t.cond.length) return trNext();
  const type = t.order[t.tn++ % t.order.length];
  const broken = shuffle([0, 1, 2, 3, 4]).slice(0, 2);
  t.trial = { type, seed: ri(1e9), n: 7, len: 5, broken, cond: t.cond.slice() };
  go("tr_ti", 9);
} };
const trialKey = type => "t_" + type;
VIEW.tr_ti = () => { const tr = S.tr.trial;
  return `<div class="tr-trial"><div class="trial-banner"><small>${H("trial")}</small><h1 class="drip">${H(trialKey(tr.type))}</h1><p>${H(trialKey(tr.type) + "R", { n: tr.n })}</p></div>
    <div class="spot">${tr.cond.map(id => `<div class="cond"><div class="av shake">${critter(P(id).av, "shock")}</div><b>${name(id)}</b></div>`).join("")}</div>
    <div class="host small">${CONDUCTOR}</div></div>`; };
G.tr_ti = { enter() { sfx("thunder"); flash(); setTimeout(() => hostLine(trialKey(S.tr.trial.type) + "R", { pitch: .7 }), 900); }, end() { go("tr_t", TRIAL_SECS[S.tr.trial.type]); } };
VIEW.tr_t = () => { const tr = S.tr.trial;
  const seats = tr.type === "seats" ? `<div class="seats">${[0, 1, 2, 3, 4].map(i => `<div class="seatbox"><svg viewBox="0 0 100 100"><path d="M20 20h60v50H20z" fill="#7d2340" stroke="#1a0818" stroke-width="5"/><path d="M14 66h72v14H14z" fill="#5c1730" stroke="#1a0818" stroke-width="5"/><path d="M22 80v14M78 80v14" stroke="#1a0818" stroke-width="6"/></svg><b>${i + 1}</b></div>`).join("")}</div>` : "";
  return `<div class="tr-trial live"><div class="trial-banner small"><h1 class="drip">${H(trialKey(tr.type))}</h1><p>${H(trialKey(tr.type) + "R", { n: tr.n })}</p></div>${seats}
    <div class="spot">${tr.cond.map(id => `<div class="cond"><div class="av shake">${critter(P(id).av, "shock")}</div><b>${name(id)}</b></div>`).join("")}</div></div>`; };
G.tr_t = { secs: 20, need: () => S.tr.trial.cond, enter() { G.tr_t.secs = TRIAL_SECS[S.tr.trial.type]; }, end() {
  const t = S.tr, tr = t.trial; t.res = {};
  tr.cond.forEach(id => {
    const x = IN[id] || {};
    let ok = false, v = "";
    if (tr.type === "seats") { ok = x.seat !== undefined && !tr.broken.includes(x.seat); v = x.seat !== undefined ? L("seat", S.ver === "pair" ? "ru" : S.ver) + " " + (x.seat + 1) : "—"; }
    if (tr.type === "math") { ok = (x.score | 0) >= tr.n; v = (x.score | 0) + " / " + tr.n; }
    if (tr.type === "lamps") { ok = !!x.ok; v = x.ok ? "✓" : "✗"; }
    if (tr.type === "brake") { ok = (x.score | 0) >= 2; v = (x.score | 0) + " / 3"; }
    t.res[id] = { ok, v, seat: x.seat ?? -1 };
    if (!ok) t.alive[id] = false; else add(id, 250);
  });
  go("tr_tr", 9);
} };
VIEW.tr_tr = () => { const t = S.tr, tr = t.trial;
  const seats = tr.type === "seats" ? `<div class="seats">${[0, 1, 2, 3, 4].map(i => `<div class="seatbox ${tr.broken.includes(i) ? "broken" : ""}" style="--d:${800 + i * 150}ms"><svg viewBox="0 0 100 100"><path d="M20 20h60v50H20z" fill="#7d2340" stroke="#1a0818" stroke-width="5"/><path d="M14 66h72v14H14z" fill="#5c1730" stroke="#1a0818" stroke-width="5"/><path d="M22 80v14M78 80v14" stroke="#1a0818" stroke-width="6"/></svg><b>${i + 1}</b>
      <div class="who">${tr.cond.filter(id => t.res[id].seat === i).map(id => `<span class="mini">${critter(P(id).av, "shock")}</span>`).join("")}</div></div>`).join("")}</div>` : "";
  return `<div class="tr-trial res"><div class="trial-banner small"><h1 class="drip">${H(trialKey(tr.type))}</h1></div>${seats}
    <div class="spot">${tr.cond.map((id, i) => `<div class="cond ${t.res[id].ok ? "lives" : "dies"}" style="--d:${1600 + i * 500}ms"><div class="av">${critter(P(id).av, t.res[id].ok ? "happy" : "dead")}</div><b>${name(id)}</b><span class="v">${esc(t.res[id].v)}</span><em>${t.res[id].ok ? H("survived") : H("died")}</em></div>`).join("")}</div></div>`; };
G.tr_tr = { enter() { const dies = S.tr.trial.cond.some(id => !S.tr.res[id].ok); setTimeout(() => { if (S.tr.trial.type === "seats") sfx("crack"); }, 800); setTimeout(() => { sfx(dies ? "sting" : "ding"); if (dies) { flash(); sfx("ghost", .6); } }, 1700); }, end: trNext };
function flash() { const f = document.querySelector(".bg-train .flash"); if (f) { f.classList.remove("on"); void f.offsetWidth; f.classList.add("on"); } }

// final run
function trFinalPositions() { const t = S.tr; ids().forEach(id => { t.pos[id] = t.alive[id] ? 3 : Math.min(2, t.tickets[id] || 0); }); }
VIEW.tr_fi = () => `<div class="tr-final intro"><div class="trial-banner"><h1 class="drip">${H("finalRun")}</h1><p>${H("finalRules")}</p></div>${trackView()}<div class="host small">${CONDUCTOR}</div></div>`;
G.tr_fi = { enter() { trFinalPositions(); push(); paint(); sfx("horn"); setTimeout(() => hostLine("finalRules", { pitch: .7 }), 800); }, end: trFinalNext };
function trackView() {
  const t = S.tr;
  return `<div class="track">${trainTrack(FIN)}<div class="runners">${ids().map((id, i) => `<div class="runner ${t.alive[id] ? "" : "ghost"}" style="--x:${Math.min(FIN, t.pos[id] || 0)};--row:${i % 4}"><div class="av">${critter(P(id).av, t.alive[id] ? "happy" : "dead")}</div><b>${name(id)}</b>${t.fd && t.fd[id] ? `<em class="${t.fd[id] > 0 ? "up" : "down"}">${t.fd[id] > 0 ? "+" : ""}${t.fd[id]}</em>` : ""}</div>`).join("")}</div></div>`;
}
function trFinalNext() {
  const t = S.tr; t.fn++;
  const cat = C.finals[t.cats[(t.fn - 1) % t.cats.length]];
  const yes = shuffle(cat.items.map((x, i) => x.ok ? i : -1).filter(i => i >= 0)), no = shuffle(cat.items.map((x, i) => !x.ok ? i : -1).filter(i => i >= 0));
  const k = 1 + ri(3);
  t.fq = { c: t.cats[(t.fn - 1) % t.cats.length], items: shuffle([...yes.slice(0, k), ...no.slice(0, 3 - k)]) };
  t.fd = {};
  go("tr_fq", 15);
}
const FQ = () => C.finals[S.tr.fq.c];
VIEW.tr_fq = () => `<div class="tr-final"><div class="cat-card"><small>${H("pickFit")}</small><h2>${H(FQ().c)}</h2>
  <div class="items">${S.tr.fq.items.map((ix, i) => `<span style="--d:${200 + i * 150}ms">${H(FQ().items[ix].t)}</span>`).join("")}</div></div>${trackView()}</div>`;
G.tr_fq = { secs: 15, need: ids, enter() { sfx("bell"); }, end() {
  const t = S.tr, cat = FQ();
  ids().forEach(id => {
    const p = (IN[id] && IN[id].p) || [];
    let d = 0; t.fq.items.forEach((ix, i) => { if (p[i]) d += cat.items[ix].ok ? 1 : -1; });
    t.fd[id] = d; t.pos[id] = Math.max(0, (t.pos[id] || 0) + d);
    if (d > 0) add(id, d * 300);
  });
  go("tr_fr", 7);
} };
VIEW.tr_fr = () => `<div class="tr-final"><div class="cat-card"><h2>${H(FQ().c)}</h2>
  <div class="items">${S.tr.fq.items.map(ix => `<span class="${FQ().items[ix].ok ? "yes" : "no"}">${H(FQ().items[ix].t)}</span>`).join("")}</div></div>${trackView()}</div>`;
G.tr_fr = { enter() { sfx("whoosh"); }, end() {
  const t = S.tr, done = ids().filter(id => t.pos[id] >= FIN);
  if (done.length || t.fn >= MAXF) {
    const best = ids().sort((a, b) => (t.pos[b] - t.pos[a]) || ((t.alive[b] ? 1 : 0) - (t.alive[a] ? 1 : 0)) || ((S.score[b] || 0) - (S.score[a] || 0)));
    t.win = best[0]; add(t.win, 3000); t.alive[t.win] = true;
    return go("tr_win", 10);
  }
  trFinalNext();
} };
VIEW.tr_win = () => `<div class="tr-win"><div class="av big bob">${critter(P(S.tr.win).av, "happy")}</div><h1 class="drip">${name(S.tr.win)}</h1><p>${H("escaped")}</p><div class="host small">${CONDUCTOR}</div></div>`;
G.tr_win = { enter() { sfx("horn"); setTimeout(() => sfx("cheer"), 600); confetti(80); }, end: results };

// ═════════ DOODLE LIES ═════════
function startDoodle() {
  const n = S.players.length, mode = n < 3 ? "pick" : "lie";
  S.dd = { mode, round: 0, rounds: mode === "pick" ? 3 : n <= 4 ? 2 : 1, used: [], prompts: {}, cols: {}, order: [], di: -1, opts: [], votes: {}, reject: {}, popts: [] };
  go("dd_intro", 10);
}
G.dd_intro = { enter() { setTimeout(() => hostLine(S.dd.mode === "pick" ? "ddIntroPair" : "ddIntro"), 600); }, end: ddRound };
VIEW.dd_intro = () => `<div class="dd-intro"><div class="title-card doodle"><h1>${H("ddName")}</h1></div>${bubble(S.dd.mode === "pick" ? "ddIntroPair" : "ddIntro", "big")}</div>`;
function ddRound() {
  const d = S.dd; d.round++;
  const free = shuffle([...C.prompts.keys()].filter(i => !d.used.includes(i)));
  const pairs = shuffle(COLOR_PAIRS);
  ids().forEach((id, i) => { d.prompts[id] = free[i]; d.used.push(free[i]); d.cols[id] = pairs[i % pairs.length]; });
  go("dd_draw", 90);
}
VIEW.dd_draw = () => `<div class="dd-draw"><div class="easel big">${PAINTER}</div><h2>${H("drawing")}</h2>
  <div class="sketchers">${S.players.map((p, i) => `<div class="sk" style="--d:${i * 80}ms"><div class="av">${critter(p.av, "idle")}</div><div class="pencil">✏️</div></div>`).join("")}</div></div>`;
G.dd_draw = { secs: 90, need: ids, enter() { sfx("scribble"); }, end() {
  const d = S.dd;
  d.order = shuffle(ids().filter(id => ART[id + ":" + d.round]));
  d.di = -1; ddNext();
} };
const artist = () => S.dd.order[S.dd.di];
const truthIdx = () => S.dd.prompts[artist()];
const truthText = (lang) => C.prompts[truthIdx()][lang];
function ddNext() {
  const d = S.dd; d.di++;
  if (d.di >= d.order.length) return go("dd_sc", 8);
  d.votes = {}; d.reject = {}; d.opts = [];
  if (d.mode === "pick") {
    const others = shuffle([...C.prompts.keys()].filter(i => i !== truthIdx())).slice(0, 3);
    d.popts = shuffle([truthIdx(), ...others]);
    go("dd_pick", 25);
  } else go("dd_lie", 50);
}
const frame = (big = false) => `<div class="polaroid ${big ? "big" : ""}"><canvas id="art" width="800" height="800"></canvas><div class="tape"></div><div class="by">${critter(P(artist()).av, "idle")}<b>${name(artist())}</b></div></div>`;
function drawArt(animate) {
  const cv = document.getElementById("art"); if (!cv) return;
  const s = ART[artist() + ":" + S.dd.round] || "", cols = S.dd.cols[artist()] || COLOR_PAIRS[0];
  replay(cv, s, cols, animate);
}
VIEW.dd_lie = () => `<div class="dd-lie">${frame(true)}<div class="side"><h2>${H("writeLie")}</h2>${bubble("writeLie", "inline")}</div></div>`;
VIEW_AFTER.dd_lie = () => drawArt(true);
G.dd_lie = { secs: 50, need: () => ids().filter(id => id !== artist()),
  valid: id => !S.dd.reject[id] || S.dd.reject[id] !== IN[id].t,
  onInput() {
    let ch = false;
    for (const id in IN) { const t = String(IN[id].t || ""); if (id !== artist() && t && S.dd.reject[id] !== t && tooClose(t, truthText(S.ver))) { S.dd.reject[id] = t; ch = true; } }
    if (ch) push();
  },
  end() {
    const d = S.dd, opts = [{ t: truthText(S.ver), truth: true, by: [artist()] }];
    ids().filter(id => id !== artist() && valid(id)).forEach(id => {
      const t = String(IN[id].t).trim().slice(0, 60); const same = opts.find(o => norm(o.t) === norm(t));
      if (same && !same.truth) same.by.push(id); else if (!same) opts.push({ t, truth: false, by: [id] });
    });
    while (opts.length < 4) { const x = C.prompts[ri(C.prompts.length)][S.ver]; if (!opts.some(o => norm(o.t) === norm(x))) opts.push({ t: x, truth: false, by: [], house: true }); }
    d.opts = shuffle(opts);
    go("dd_vote", 25);
  } };
VIEW.dd_vote = () => `<div class="dd-vote">${frame()}<div class="notes">${S.dd.opts.map((o, i) => `<div class="note n${i % 6}" style="--d:${i * 110}ms;--r:${(i % 3 - 1) * 2}deg">${esc(o.t)}</div>`).join("")}</div><h2 class="cap">${H("findTruth")}</h2></div>`;
VIEW_AFTER.dd_vote = () => drawArt(false);
G.dd_vote = { secs: 25, need: () => ids().filter(id => id !== artist()), enter() { sfx("whoosh"); }, end() {
  const d = S.dd, a = artist();
  ids().filter(id => id !== a).forEach(id => {
    const v = IN[id] ? IN[id].v : -1; if (v < 0 || v >= d.opts.length) return;
    if (d.opts[v].by.includes(id)) return; // no voting for your own lie
    d.votes[id] = v;
    const o = d.opts[v];
    if (o.truth) { add(id, 1000); add(a, 1000); } else o.by.forEach(b => add(b, 500));
  });
  // reveal the lies that fooled someone (fewest votes first), then the truth
  const lies = d.opts.map((o, i) => i).filter(i => !d.opts[i].truth && Object.values(d.votes).includes(i));
  lies.sort((x, y) => Object.values(d.votes).filter(v => v === x).length - Object.values(d.votes).filter(v => v === y).length);
  d.rev = [...lies, d.opts.findIndex(o => o.truth)];
  go("dd_rev", 3 + d.rev.length * 3.2);
} };
VIEW.dd_rev = () => {
  const d = S.dd;
  if (d.mode === "pick") {
    const g = Object.keys(d.votes)[0], ok = g && d.popts[d.votes[g]] === truthIdx();
    return `<div class="dd-rev pick">${frame()}<div class="reveal-pick"><div class="note truth n2"><small>${H("truth")}</small>${H(C.prompts[truthIdx()])}</div>
      ${g ? `<div class="verdict ${ok ? "good" : "bad"}">${critter(P(g).av, ok ? "happy" : "sad")} <span>${ok ? H("foundIt") : "✗ " + H(C.prompts[d.popts[d.votes[g]]])}</span></div>` : ""}</div></div>`;
  }
  return `<div class="dd-rev">${frame()}<div class="revs">${d.rev.map((oi, k) => { const o = d.opts[oi], voters = Object.keys(d.votes).filter(id => d.votes[id] === oi);
    return `<div class="rv ${o.truth ? "truth" : "lie"}" style="--d:${600 + k * 3200}ms"><div class="note n${oi % 6}">${esc(o.t)}</div>
      <div class="rv-meta"><div class="voters">${voters.map(id => `<span class="mini">${critter(P(id).av, o.truth ? "happy" : "shock")}</span>`).join("") || `<em>${H("nobody")}</em>`}</div>
      <div class="stamp">${o.truth ? H("truth") : o.house ? "Gekko" : H1("lieBy") + " " + o.by.map(name).join(", ")}</div>
      <div class="gain">${o.truth ? (voters.length ? `+${voters.length * 1000} ${name(artist())}` : "") : o.by.length ? `+${voters.length * 500}` : ""}</div></div></div>`; }).join("")}</div></div>`;
};
VIEW_AFTER.dd_rev = () => { drawArt(false); S.dd.mode !== "pick" && S.dd.rev.forEach((_, k) => setTimeout(() => sfx(k === S.dd.rev.length - 1 ? "ding" : "reveal"), 600 + k * 3200)); };
G.dd_rev = { end: ddNext };
VIEW.dd_pick = () => `<div class="dd-vote pick">${frame(true)}<div class="side"><h2>${H("findTruth")}</h2><div class="notes four">${S.dd.popts.map((p, i) => `<div class="note n${i}" style="--d:${i * 120}ms">${H(C.prompts[p])}</div>`).join("")}</div></div></div>`;
VIEW_AFTER.dd_pick = () => drawArt(true);
G.dd_pick = { secs: 25, need: () => ids().filter(id => id !== artist()), end() {
  const d = S.dd, a = artist();
  ids().filter(id => id !== a).forEach(id => { const v = IN[id] ? IN[id].v : -1; if (v < 0) return; d.votes[id] = v; if (d.popts[v] === truthIdx()) { add(id, 1000); add(a, 1000); } });
  go("dd_rev", 8);
} };
VIEW.dd_sc = () => scoreboard();
G.dd_sc = { enter() { sfx("drum"); }, end() { if (S.dd.round < S.dd.rounds) ddRound(); else results(); } };
function scoreboard() {
  const r = ids().sort((a, b) => (S.score[b] || 0) - (S.score[a] || 0)), max = Math.max(1, ...r.map(id => S.score[id] || 0));
  return `<div class="scoreboard"><h2>${H("scores")}</h2>${r.map((id, i) => `<div class="row" style="--d:${i * 120}ms;--w:${(S.score[id] || 0) / max}"><div class="av">${critter(P(id).av, i ? "idle" : "happy")}</div><b>${name(id)}</b><div class="bar"><i></i></div><span>${fmtNum(S.score[id] || 0, "en")}</span></div>`).join("")}</div>`;
}

// replay a drawing on a canvas: "c w x,y,x,y…" strokes joined with ";", coordinates 0..1000
export function replay(cv, s, cols, animate) {
  const g = cv.getContext("2d"), W = cv.width;
  g.fillStyle = "#fffdf7"; g.fillRect(0, 0, W, W);
  const strokes = String(s || "").split(";").filter(Boolean).map(x => { const [h, pts] = x.split(":"); return { c: +h[0], w: +h[1], p: (pts || "").split(",").map(Number) }; });
  g.lineCap = "round"; g.lineJoin = "round";
  const seg = (st, upto) => { g.strokeStyle = cols[st.c] || "#1d1233"; g.lineWidth = (st.w ? 22 : 8) * W / 1000; g.beginPath(); const p = st.p;
    g.moveTo(p[0] * W / 1000, p[1] * W / 1000); if (p.length === 2) g.lineTo(p[0] * W / 1000 + .1, p[1] * W / 1000); for (let i = 2; i < Math.min(p.length, upto); i += 2) g.lineTo(p[i] * W / 1000, p[i + 1] * W / 1000); g.stroke(); };
  if (!animate) { strokes.forEach(st => seg(st, st.p.length)); return; }
  const total = strokes.reduce((n, st) => n + st.p.length, 0), dur = 2600, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), upto = k * total;
    g.fillStyle = "#fffdf7"; g.fillRect(0, 0, W, W);
    let n = 0; for (const st of strokes) { if (n >= upto) break; seg(st, Math.max(2, Math.floor(upto - n) & ~1)); n += st.p.length; }
    if (k < 1 && cv.isConnected) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ═════════ BALLPARK ═════════
function startBall() { S.bp = { qs: shuffle([...C.estimates.keys()]).slice(0, 6), qi: -1, g: {}, b: {}, best: [] }; go("bp_intro", 10); }
G.bp_intro = { enter() { setTimeout(() => hostLine("bpIntro"), 600); }, end: bpNext };
VIEW.bp_intro = () => `<div class="bp-intro"><div class="title-card ball"><h1>${H("bpName")}</h1></div>${bubble("bpIntro", "big")}</div>`;
const BQ = () => C.estimates[S.bp.qs[S.bp.qi]];
function bpNext() { const b = S.bp; b.qi++; if (b.qi >= b.qs.length) return results(); b.g = {}; b.b = {}; b.best = []; go("bp_q", 30); }
VIEW.bp_q = () => `<div class="bp-q"><div class="marquee"><small>${S.bp.qi + 1} / ${S.bp.qs.length}</small><h2>${H(BQ().q)}</h2></div>
  <div class="guessers">${S.players.map((p, i) => `<div class="gs" data-id="${p.id}" style="--d:${i * 80}ms"><div class="card">?</div><div class="av">${critter(p.av, "idle")}</div><b>${esc(p.name)}</b></div>`).join("")}</div><div class="host small">${OWL}</div></div>`;
G.bp_q = { secs: 30, need: ids, enter() { sfx("bell"); }, onInput() { for (const id in IN) document.querySelector(`.gs[data-id="${id}"]`)?.classList.add("in"); }, end() {
  const b = S.bp; ids().forEach(id => { const n = Number(IN[id] && IN[id].n); if (IN[id] && Number.isFinite(n)) b.g[id] = n; });
  if (!Object.keys(b.g).length) return bpReveal();
  go("bp_bet", 16);
} };
function lineView(showAns) {
  // guesses are spaced by rank, not by value, so one wild guess cannot squash the others
  const b = S.bp, ans = BQ().n, lang = hostLangs(S.ver)[0];
  const marks = Object.keys(b.g).map(id => ({ id, v: b.g[id] }));
  if (showAns) marks.push({ id: "", v: ans });
  marks.sort((x, y) => x.v - y.v || (x.id ? 1 : -1));
  const X = i => marks.length === 1 ? 900 : 120 + i * 1560 / (marks.length - 1);
  let row = 0;
  return `<div class="numline"><div class="axis"></div>${marks.map((m, i) => {
    if (!m.id) return `<div class="ansflag" style="left:${X(i)}px"><div class="drop"><small>${H("answerIs")}</small><b>${fmtNum(ans, lang)}</b></div><div class="pole"></div></div>`;
    const best = showAns && b.best.includes(m.id), r = row++ % 2;
    return `<div class="flag ${best ? "best" : ""}" style="left:${X(i)}px;--row:${r};--d:${i * 120}ms"><div class="pole"></div><div class="tag">${critter(P(m.id).av, best ? "happy" : "idle")}<b>${fmtNum(m.v, lang)}</b><span>${name(m.id)}</span>
      <div class="betchips">${Object.keys(b.b).filter(x => b.b[x] === m.id).map(x => `<i class="chip">${critter(P(x).av, "idle")}</i>`).join("")}</div></div></div>`;
  }).join("")}</div>`;
}
VIEW.bp_bet = () => `<div class="bp-bet"><div class="marquee small"><h2>${H(BQ().q)}</h2></div><h3>${H("betOn")}</h3>${lineView(false)}</div>`;
G.bp_bet = { secs: 16, need: ids, end: bpReveal };
function bpReveal() {
  const b = S.bp, ans = BQ().n;
  ids().forEach(id => { if (IN[id] && IN[id].b && b.g[IN[id].b] !== undefined) b.b[id] = IN[id].b; });
  const diffs = Object.keys(b.g).map(id => [id, Math.abs(b.g[id] - ans)]);
  const min = Math.min(...diffs.map(d => d[1]));
  b.best = diffs.filter(d => d[1] === min).map(d => d[0]);
  b.exact = min <= Math.abs(ans) * .005;
  b.best.forEach(id => add(id, 1000 + (b.exact ? 1000 : 0)));
  Object.keys(b.b).forEach(id => { if (b.best.includes(b.b[id])) add(id, 500); });
  go("bp_rev", 10);
}
VIEW.bp_rev = () => `<div class="bp-bet rev"><div class="marquee small"><h2>${H(BQ().q)}</h2></div>${Object.keys(S.bp.g).length ? lineView(true) : `<h3>${H1("answerIs")}: ${fmtNum(BQ().n, hostLangs(S.ver)[0])}</h3>`}
  ${S.bp.best.length ? `<div class="verdict good">${H1(S.bp.exact ? "exact" : "closest")}: ${S.bp.best.map(name).join(", ")}</div>` : ""}</div>`;
G.bp_rev = { enter() { sfx("drum"); setTimeout(() => sfx("cheer"), 1300); }, end: bpNext };

// ═════════ QUICK SKETCH ═════════
// One player draws live; the strokes stream to the big screen. Everyone else races to pick the answer.
const QS_SECS = 60;
function startQuick() {
  const n = S.players.length, per = n <= 2 ? 3 : n <= 4 ? 2 : 1;
  const order = []; for (let r = 0; r < per; r++) order.push(...shuffle(ids()));
  S.qs = { order, i: -1, word: 0, opts: [], used: [], col: 0, got: {}, dpts: 0 };
  go("qs_intro", 10);
}
G.qs_intro = { enter() { setTimeout(() => hostLine("qsIntro"), 600); }, end: qsNext };
VIEW.qs_intro = () => `<div class="dd-intro"><div class="title-card chalk"><h1>${H("qsName")}</h1></div>${bubble("qsIntro", "big")}</div>`;
const drawer = () => S.qs.order[S.qs.i];
function qsNext() {
  const q = S.qs; q.i++;
  if (q.i >= q.order.length) return results();
  const free = shuffle([...C.words.keys()].filter(i => !q.used.includes(i)));
  q.word = free[0]; q.used.push(q.word); q.opts = shuffle([q.word, ...free.slice(1, 6)]);
  q.col = (q.i * 3 + 1) % COLOR_PAIRS.length; q.got = {}; q.dpts = 0; LIVE = ""; FIRST = {};
  go("qs_draw", QS_SECS);
}
function paintLive() { const cv = document.getElementById("live"); if (cv && S.qs) paintStrokes(cv, LIVE, COLOR_PAIRS[S.qs.col]); }
VIEW.qs_draw = () => `<div class="qs"><div class="board"><canvas id="live" width="900" height="900"></canvas><div class="by">${critter(P(drawer()).av, "happy")}<b>${name(drawer())}</b></div></div>
  <div class="side"><h2>${H("guessIt")}</h2><p class="sub">${S.qs.i + 1} / ${S.qs.order.length}</p>
  <div class="racers">${ids().filter(id => id !== drawer()).map(id => `<div class="gq" data-id="${id}">${critter(P(id).av, "idle")}<b>${name(id)}</b><i>?</i></div>`).join("")}</div></div></div>`;
VIEW_AFTER.qs_draw = () => paintLive();
G.qs_draw = { secs: QS_SECS, need: () => ids().filter(id => id !== drawer()), enter() { sfx("scribble"); },
  onInput() { for (const id in IN) if (id !== drawer() && FIRST[id] === undefined) { FIRST[id] = Date.now(); const el = document.querySelector(`.gq[data-id="${id}"]`); if (el) { el.classList.add("in"); el.querySelector("i").textContent = Object.keys(FIRST).length; } } },
  end() {
    const q = S.qs; let sum = 0;
    ids().filter(id => id !== drawer()).forEach(id => {
      const g = IN[id]; if (!g) return;
      if (q.opts[g.o] === q.word) { const frac = Math.max(0, Math.min(1, (S.dl - (FIRST[id] || S.dl)) / (QS_SECS * 1000))); const pts = Math.round((300 + 700 * frac) / 10) * 10; q.got[id] = pts; add(id, pts); sum += pts; }
      else q.got[id] = 0;
    });
    q.dpts = Math.round(sum * .5 / 10) * 10; if (q.dpts) add(drawer(), q.dpts);
    go("qs_rev", 7);
  } };
VIEW.qs_rev = () => { const q = S.qs;
  return `<div class="qs rev"><div class="board"><canvas id="live" width="900" height="900"></canvas><div class="by">${critter(P(drawer()).av, q.dpts ? "happy" : "sad")}<b>${name(drawer())}</b>${q.dpts ? `<em>+${q.dpts}</em>` : ""}</div></div>
  <div class="side"><p class="sub">${H("theWord")}</p><h2 class="word">${H(C.words[q.word])}</h2>
  <div class="racers">${ids().filter(id => id !== drawer()).map(id => `<div class="gq ${q.got[id] ? "ok" : "no"}">${critter(P(id).av, q.got[id] ? "happy" : "sad")}<b>${name(id)}</b><i>${q.got[id] ? "+" + q.got[id] : "✗"}</i></div>`).join("")}</div></div></div>`; };
VIEW_AFTER.qs_rev = () => paintLive();
G.qs_rev = { enter() { sfx(Object.values(S.qs.got).some(Boolean) ? "ding" : "buzz"); }, end: qsNext };

// ═════════ COPYCAT ═════════
// Every player starts a chain with a secret title. The drawings rotate: look for six seconds, redraw from memory.
// At the end everyone except the chain's first artist guesses the original title from the last copy.
const CC_DRAW = 50, CC_COPY = 51;
function startCopy() {
  const order = shuffle(ids()), n = order.length, pr = shuffle([...C.prompts.keys()]);
  S.cc = { order, L: n === 2 ? 4 : Math.min(n, 4), j: 0, prompts: order.map((_, i) => pr[i]), cols: order.map((_, i) => (i * 3 + 2) % COLOR_PAIRS.length), docs: {}, assign: {}, ci: -1, opts: [], got: {} };
  order.forEach((_, c) => S.cc.docs["c" + c] = []);
  go("cc_intro", 11);
}
G.cc_intro = { enter() { setTimeout(() => hostLine("ccIntro"), 600); }, end: () => ccStep(0) };
VIEW.cc_intro = () => `<div class="dd-intro"><div class="title-card doodle"><h1>${H("ccName")}</h1></div>${bubble("ccIntro", "big")}</div>`;
const lastDoc = c => [...S.cc.docs["c" + c]].reverse().find(Boolean) || "";
function ccStep(j) {
  const cc = S.cc, n = cc.order.length; cc.j = j; cc.assign = {};
  cc.order.forEach((id, i) => { const c = ((i - j) % n + n) % n; cc.assign[id] = { c, prev: j ? lastDoc(c) : "", doc: `${id}_c${c}s${j}` }; });
  go(j ? "cc_copy" : "cc_draw", j ? CC_COPY : CC_DRAW);
}
function ccCollect() { const cc = S.cc; for (const id in cc.assign) { const a = cc.assign[id]; cc.docs["c" + a.c].push(ARTX[a.doc] ? a.doc : ""); } }
const ccEnd = () => { ccCollect(); if (S.cc.j + 1 < S.cc.L) ccStep(S.cc.j + 1); else { S.cc.ci = -1; ccNext(); } };
VIEW.cc_draw = () => `<div class="dd-draw"><div class="easel big">${COPIER}</div><h2>${H("drawing")}</h2>
  <div class="sketchers">${S.players.map((p, i) => `<div class="sk" style="--d:${i * 80}ms"><div class="av">${critter(p.av, "idle")}</div><div class="pencil">✏️</div></div>`).join("")}</div></div>`;
VIEW.cc_copy = () => `<div class="dd-draw"><div class="easel big">${COPIER}</div><h2>${H("copying")}</h2><p class="steplbl">${H1("step")} ${S.cc.j + 1} / ${S.cc.L}</p>
  <div class="sketchers">${S.players.map((p, i) => `<div class="sk" style="--d:${i * 80}ms"><div class="av">${critter(p.av, "shock")}</div><div class="pencil">👀</div></div>`).join("")}</div></div>`;
G.cc_draw = { secs: CC_DRAW, need: ids, enter() { sfx("scribble"); }, end: ccEnd };
G.cc_copy = { secs: CC_COPY, need: ids, enter() { sfx("whoosh"); }, end: ccEnd };
function ccNext() {
  const cc = S.cc; cc.ci++;
  while (cc.ci < cc.order.length && !lastDoc(cc.ci)) cc.ci++;
  if (cc.ci >= cc.order.length) return results();
  const truth = cc.prompts[cc.ci];
  cc.opts = shuffle([truth, ...shuffle([...C.prompts.keys()].filter(i => i !== truth)).slice(0, 3)]); cc.got = {};
  go("cc_guess", 20);
}
const chainCols = c => COLOR_PAIRS[S.cc.cols[c]];
VIEW.cc_guess = () => `<div class="dd-vote pick"><div class="polaroid big"><canvas id="art" width="800" height="800"></canvas><div class="tape"></div><div class="by"><b>${H1("step")} ${S.cc.L} / ${S.cc.L}</b></div></div>
  <div class="side"><h2>${H("guessOrig")}</h2><div class="notes four">${S.cc.opts.map((p, i) => `<div class="note n${i}" style="--d:${i * 120}ms">${H(C.prompts[p])}</div>`).join("")}</div></div></div>`;
VIEW_AFTER.cc_guess = () => { const cv = document.getElementById("art"); if (cv) replay(cv, ARTX[lastDoc(S.cc.ci)], chainCols(S.cc.ci), true); };
G.cc_guess = { secs: 20, need: () => ids().filter(id => id !== S.cc.order[S.cc.ci]), end() {
  const cc = S.cc, truth = cc.prompts[cc.ci], artists = [...new Set(cc.docs["c" + cc.ci].filter(Boolean).map(d => d.split("_")[0]))];
  ids().filter(id => id !== cc.order[cc.ci]).forEach(id => { const g = IN[id]; if (!g) return; const ok = cc.opts[g.v] === truth; cc.got[id] = ok ? 500 : 0; if (ok) { add(id, 500); artists.forEach(a => add(a, 200)); } });
  go("cc_rev", 4 + cc.docs["c" + cc.ci].filter(Boolean).length * 2.4);
} };
VIEW.cc_rev = () => { const cc = S.cc, docs = cc.docs["c" + cc.ci].filter(Boolean);
  return `<div class="cc-rev"><div class="chain">
    <div class="link prompt" style="--d:0ms"><small>${H1("original")}</small><b>${H(C.prompts[cc.prompts[cc.ci]])}</b><span>${critter(P(cc.order[cc.ci]).av, "happy")}${name(cc.order[cc.ci])}</span></div>
    ${docs.map((d, k) => `<div class="link" style="--d:${800 + k * 2400}ms"><canvas data-doc="${d}" width="420" height="420"></canvas><span>${critter(P(d.split("_")[0]).av, "idle")}${name(d.split("_")[0])}</span></div>`).join("")}</div>
    <div class="guessline" style="--d:${800 + docs.length * 2400}ms">${ids().filter(id => id !== cc.order[cc.ci]).map(id => `<span class="${cc.got[id] ? "ok" : "no"}">${critter(P(id).av, cc.got[id] ? "happy" : "sad")}${name(id)} ${cc.got[id] ? "✓" : "✗"}</span>`).join("")}</div></div>`; };
VIEW_AFTER.cc_rev = () => { const cols = chainCols(S.cc.ci); document.querySelectorAll(".cc-rev canvas[data-doc]").forEach((cv, k) => setTimeout(() => { if (!cv.isConnected) return; replay(cv, ARTX[cv.dataset.doc], cols, true); sfx("reveal"); }, 800 + k * 2400)); };
G.cc_rev = { end: ccNext };
