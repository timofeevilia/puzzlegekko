// Gekko Party, the phone controller. It reads party/<ROOM>/game/state and writes only its own player and input documents.
import { L, esc, critter, critterColor, CRITTERS, REACTIONS, fmtNum, seeded, LANG_NAMES } from "./common.js";
import * as C from "./content.js";

const $ = s => document.querySelector(s);
let net, db = null, me = "", room = "", S = null, lang = guessLang(), renderedKey = "", skew = 0, cleanup = null, joined = false, sentStep = -1, lastSent = null;
const T = (k, v) => L(k, lang, v);
const tx = o => esc(o[lang] ?? o.en);
const P = id => S?.players.find(p => p.id === id);
const buzz = ms => navigator.vibrate?.(ms);
function guessLang() { const l = (navigator.language || "en").slice(0, 2); return l === "ru" ? "ru" : l === "my" ? "my" : "en"; }

export async function startPlayer(code = "") {
  net = await import("../shared/net.js");
  document.body.classList.add("is-phone");
  joinForm(code);
}

// ── joining
function joinForm(code, error = "") {
  const saved = JSON.parse(localStorage.getItem("gp-me") || "{}");
  const av = saved.av ?? (Math.random() * 12 | 0);
  $("#app").innerHTML = `<div class="phone join">
    <header class="ph-brand"><a href="../" class="home" aria-label="PuzzleGekko">←</a><b>${T("brand")}</b></header>
    <form id="jf" autocomplete="off">
      <h1 data-k="joinTitle">${T("joinTitle")}</h1>
      <label><span data-k="code">${T("code")}</span><input id="jcode" maxlength="4" inputmode="text" autocapitalize="characters" value="${esc(code)}" placeholder="ABCD" required></label>
      <label><span data-k="name">${T("name")}</span><input id="jname" maxlength="14" value="${esc(saved.name || "")}" required></label>
      <div id="jlang"></div>
      <fieldset><legend data-k="critter">${T("critter")}</legend><div class="crit-grid">${CRITTERS.map((c, i) => `<button type="button" class="crit ${i === av ? "sel" : ""}" data-av="${i}" style="--c:${c.c}">${critter(i, i === av ? "happy" : "idle")}</button>`).join("")}</div></fieldset>
      ${error ? `<p class="err">${esc(error)}</p>` : ""}
      <button class="go" type="submit">${T("joinBtn")} →</button>
    </form></div>`;
  let pick = av, pickLang = saved.lang || (lang === "my" ? "my" : "ru"), info = null;
  $(".crit-grid").onclick = e => { const b = e.target.closest(".crit"); if (!b || b.disabled) return; pick = +b.dataset.av; document.querySelectorAll(".crit").forEach(x => { x.classList.toggle("sel", x === b); x.innerHTML = critter(+x.dataset.av, x === b ? "happy" : "idle"); }); buzz(10); };
  const peek = async () => {
    const c = net.cleanRoomCode($("#jcode").value, 4, 4); if (!c) { info = null; $("#jlang").innerHTML = ""; return; }
    const r = await net.openRoom("party", c); const st = await r.db.doc("game/state").get().catch(() => null);
    info = st?.exists ? st.data() : null; if (!info) return;
    const taken = new Set(info.players.filter(p => p.id !== r.uid).map(p => p.av));
    document.querySelectorAll(".crit").forEach(b => b.disabled = taken.has(+b.dataset.av));
    if (taken.has(pick)) { const f = [...Array(12).keys()].find(i => !taken.has(i)); document.querySelector(`.crit[data-av="${f}"]`)?.click(); }
    if (info.ver === "pair") {
      $("#jlang").innerHTML = `<fieldset><legend data-k="lang">${T("lang")}</legend><div class="seg">${["ru", "my"].map(l => `<button type="button" data-l="${l}" class="${pickLang === l ? "sel" : ""}">${LANG_NAMES[l]}</button>`).join("")}</div></fieldset>`;
      $("#jlang").onclick = e => { const b = e.target.closest("[data-l]"); if (!b) return; pickLang = b.dataset.l; lang = pickLang; joinFormLabels(); document.querySelectorAll("#jlang [data-l]").forEach(x => x.classList.toggle("sel", x === b)); };
    } else { $("#jlang").innerHTML = ""; lang = info.ver; joinFormLabels(); }
  };
  const joinFormLabels = () => { const f = $("#jf"); f.querySelectorAll("[data-k]").forEach(n => n.textContent = T(n.dataset.k)); f.querySelector(".go").textContent = T("joinBtn") + " →"; document.documentElement.lang = lang; };
  $("#jcode").oninput = e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); if (e.target.value.length === 4) peek(); };
  if (code.length === 4) peek();
  $("#jf").onsubmit = async e => {
    e.preventDefault();
    const c = net.cleanRoomCode($("#jcode").value, 4, 4), nm = $("#jname").value.trim().slice(0, 14);
    if (!c || !nm) return;
    $(".go").disabled = true; $(".go").textContent = T("reconnect");
    try {
      const r = await net.openRoom("party", c); db = r.db; me = r.uid; room = c;
      const st = await db.doc("game/state").get();
      if (!st.exists) return joinForm(c, T("noRoom"));
      const s = st.data();
      const already = s.players.some(p => p.id === me);
      if (!already && !["lobby", "menu", "res"].includes(s.phase)) return joinForm(c, T("started"));
      if (!already && s.players.length >= (s.ver === "pair" ? 2 : 8)) return joinForm(c, T("full"));
      const myLang = s.ver === "pair" ? pickLang : s.ver;
      lang = myLang;
      localStorage.setItem("gp-me", JSON.stringify({ name: nm, av: pick, lang: pickLang }));
      await db.doc("players/" + me).set({ name: nm, av: pick, lang: myLang, t: Date.now() });
      sentStep = +(sessionStorage.getItem("gp-sent-" + room) || -1);
      location.hash = c; joined = true;
      db.doc("game/state").onSnapshot(snap => { if (snap.exists) onState(snap.data()); }, e => showErr(e));
    } catch (er) { showErr(er); joinForm(c, (er.code || "") + " " + (er.message || er)); }
  };
}
function showErr(e) { console.error(e); }

// ── state
function onState(s) {
  const d = Date.now() - s.now; if (Math.abs(d) < 4000) skew = skew ? Math.min(skew, d) : d; else if (!skew) skew = 0;
  S = s;
  const mp = P(me); if (mp) lang = mp.lang;
  const rej = S.phase === "dd_lie" && S.dd.reject && S.dd.reject[me] ? S.dd.reject[me] : "";
  const key = [S.step, sentStep === S.step ? 1 : 0, rej, mp ? 1 : 0, S.phase === "lobby" || S.phase === "menu" ? S.players.length + S.vip : ""].join("|");
  if (key !== renderedKey) { renderedKey = key; render(); } else paintTop();
}
const left = () => S.dl ? Math.max(0, S.dl + skew - Date.now()) : 0;
function send(data, docId = me) {
  sentStep = S.step; sessionStorage.setItem("gp-sent-" + room, S.step); lastSent = data;
  db.doc("input/" + docId).set({ k: S.step, ...data }).catch(showErr);
  buzz(20);
  renderedKey = ""; onState(S);
}
let lastReact = 0;
function react(e) { if (Date.now() - lastReact < 900) return; lastReact = Date.now(); db.doc("input/" + me + "_r").set({ e, t: Date.now() }).catch(showErr); buzz(8); }

// ── frame
function render() {
  if (cleanup) { cleanup(); cleanup = null; }
  const mp = P(me), c = mp ? critterColor(mp.av) : "#7ed957";
  document.documentElement.style.setProperty("--me", c); document.documentElement.lang = lang;
  const body = mp ? screen() : waitingToJoin();
  $("#app").innerHTML = `<div class="phone play ph-${S.phase} g-${S.g || "none"}">
    <header class="ph-top">${mp ? `<div class="me">${critter(mp.av, S.g === "train" && S.tr.alive && S.tr.alive[me] === false ? "dead" : "idle")}<b>${esc(mp.name)}</b></div><div class="pts">${fmtNum(S.score[me] || 0, lang)} <small>${T("pts")}</small></div>` : ""}<div class="rc">${esc(room)}</div></header>
    <div class="tbar"><i></i></div>
    <main class="ph-body">${body}</main></div>`;
  after?.(); after = null;
  paintTop(); tick();
}
let after = null, tickT = 0;
function paintTop() { const el = $(".pts"); if (el && S) el.innerHTML = `${fmtNum(S.score[me] || 0, lang)} <small>${T("pts")}</small>`; }
function tick() {
  cancelAnimationFrame(tickT);
  const bar = $(".tbar i"); if (!bar) return;
  const f = () => { const tot = PHASE_SECS[S.phase] || 20; const l = left(); bar.style.width = S.dl && TIMED.has(S.phase) ? (100 * Math.min(1, l / (tot * 1000))) + "%" : "0"; autoSend?.(l); tickT = requestAnimationFrame(f); };
  f();
}
let autoSend = null;
const TIMED = new Set(["tr_q", "tr_t", "tr_fq", "dd_draw", "dd_lie", "dd_vote", "dd_pick", "bp_q", "bp_bet"]);
const PHASE_SECS = { tr_q: 20, tr_t: 22, tr_fq: 15, dd_draw: 90, dd_lie: 50, dd_vote: 25, dd_pick: 25, bp_q: 30, bp_bet: 16 };
const sent = () => sentStep === S.step;
const watch = (msg = T("watch"), mood = "idle", extra = "") => { const mp = P(me); return `<div class="watch"><div class="big-av bob">${critter(mp.av, mood)}</div><h2>${msg}</h2>${extra}${reactions()}</div>`; };
const reactions = () => { after = chain(after, () => { const r = $(".reacts"); if (r) r.onclick = e => { const b = e.target.closest("[data-e]"); if (b) { react(b.dataset.e); b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit"); } }; }); return `<div class="reacts" aria-label="${esc(T("react"))}">${REACTIONS.map(e => `<button data-e="${e}">${e}</button>`).join("")}</div>`; };
const chain = (a, b) => a ? () => { a(); b(); } : b;
const waitingToJoin = () => `<div class="watch"><div class="spinner"></div><h2>${T("reconnect")}</h2></div>`;

// ── screens
function screen() {
  autoSend = null;
  const ph = S.phase, vip = S.vip === me;
  if (ph === "lobby") {
    const enough = S.players.length >= 2;
    return `<div class="watch"><div class="big-av bob">${critter(P(me).av, "happy")}</div><h2>${T("youIn")}</h2>
      ${vip ? `<p>${T("vipHint")}</p>${enough ? `<button class="go" id="startb">${T("start")}</button>` : `<p class="dim">${T("needMore", { n: 2 })}</p>`}` : `<p class="dim">${T("waitingFor")}</p>`}${reactions()}</div>` + bind(() => { $("#startb") && ($("#startb").onclick = () => send({ start: true })); });
  }
  if (ph === "menu") {
    if (!vip) return watch(T("vipPicks"));
    const games = [["train", "trName", "trTag"], ["doodle", "ddName", S.ver === "pair" ? "ddTagPair" : "ddTag"], ["ball", "bpName", "bpTag"]];
    return `<h2 class="h">${T("pickGame")}</h2><div class="gamelist">${games.map(([id, n, t]) => `<button class="gamebtn g-${id}" data-g="${id}"><b>${T(n)}</b><small>${T(t)}</small></button>`).join("")}</div>` +
      bind(() => { $(".gamelist").onclick = e => { const b = e.target.closest("[data-g]"); if (b) send({ game: b.dataset.g }); }; });
  }
  if (ph === "res") {
    const pos = S.res.rank.indexOf(me) + 1;
    return `<div class="watch"><div class="big-av bob">${critter(P(me).av, pos === 1 ? "happy" : "idle")}</div><h2 class="place">#${pos}</h2><p>${fmtNum(S.score[me] || 0, lang)} ${T("pts")}</p>
      ${vip ? `<button class="go" id="nextb">${T("playAgain")}</button>` : ""}${reactions()}</div>` + bind(() => { $("#nextb") && ($("#nextb").onclick = () => send({ next: true })); });
  }
  return (SCREENS[ph] || (() => watch()))();
}
const bind = f => { after = chain(after, f); return ""; };
const SCREENS = {};

// ═════ The Last Train
const dead = () => S.tr.alive && S.tr.alive[me] === false;
const ghostBadge = () => dead() ? `<div class="ghostbadge">👻 ${T("ghost")} · ${T("ghostHint")} (${S.tr.tickets[me] || 0})</div>` : "";
SCREENS.tr_intro = () => watch(T("trName"), "shock", `<p class="dim">${T("trIntro")}</p>`);
SCREENS.tr_q = () => {
  const q = C.trivia[S.tr.qs[S.tr.qi]];
  if (sent()) return watch(T("waitOthers"), "idle", `<div class="chosen o${lastSent?.a ?? 0}">${tx(q.a[S.tr.opts[lastSent?.a ?? 0]])}</div>`);
  return `${ghostBadge()}<h2 class="q">${tx(q.q)}</h2><div class="answers">${S.tr.opts.map((o, i) => `<button class="ans o${i}" data-a="${i}"><i>${"ABCD"[i]}</i>${tx(q.a[o])}</button>`).join("")}</div>` +
    bind(() => { $(".answers").onclick = e => { const b = e.target.closest("[data-a]"); if (b) send({ a: +b.dataset.a }); }; });
};
SCREENS.tr_rev = () => {
  const right = S.tr.opts.indexOf(0), a = S.tr.ans[me], ok = a === right;
  if (dead()) return watch(ok ? "👻 +1 " + T("ticket") : "👻", ok ? "happy" : "sad");
  return watch(ok ? T("correct") : T("wrong"), ok ? "happy" : "shock", ok ? "" : `<p class="dim">${T("wrongTrial")}</p>`) ;
};
SCREENS.tr_ti = () => {
  const tr = S.tr.trial, mine = tr.cond.includes(me);
  if (!mine) return watch(dead() ? "👻 " + T("ghost") : T("safe"), "happy");
  return `<div class="trial-card"><small>${T("trial")}</small><h2>${T("t_" + tr.type)}</h2><p>${T("t_" + tr.type + "R", { n: tr.n })}</p><div class="big-av shake">${critter(P(me).av, "shock")}</div></div>`;
};
SCREENS.tr_t = () => {
  const tr = S.tr.trial;
  if (!tr.cond.includes(me)) return watch(dead() ? "👻 " + T("ghost") : T("safe"), "happy");
  if (sent()) return watch(T("waitOthers"), "shock");
  return MINI[tr.type](tr);
};
SCREENS.tr_tr = () => {
  const r = S.tr.res[me];
  if (!r) return watch(dead() ? "👻 " + T("ghost") : T("watch"));
  return watch(r.ok ? T("survived") + "!" : T("youDied"), r.ok ? "happy" : "dead");
};
SCREENS.tr_fi = () => watch(T("finalRun"), "shock", `<p class="dim">${T("finalRules")}</p>`);
SCREENS.tr_fq = () => {
  const cat = C.finals[S.tr.fq.c];
  if (sent()) return watch(T("waitOthers"));
  const picks = [false, false, false];
  return `<small class="k">${T("pickFit")}</small><h2 class="q">${tx(cat.c)}</h2><div class="toggles">${S.tr.fq.items.map((ix, i) => `<button class="tog" data-i="${i}">${tx(cat.items[ix].t)}</button>`).join("")}</div><button class="go" id="fsend">${T("send")}</button>` +
    bind(() => {
      $(".toggles").onclick = e => { const b = e.target.closest("[data-i]"); if (!b) return; picks[+b.dataset.i] = !picks[+b.dataset.i]; b.classList.toggle("on"); buzz(8); };
      $("#fsend").onclick = () => send({ p: picks });
      autoSend = l => { if (l > 0 && l < 1200 && !sent() && picks.some(Boolean)) send({ p: picks }); };
    });
};
SCREENS.tr_fr = () => { const d = S.tr.fd[me] || 0; return watch((d > 0 ? "+" : "") + d + " 🚃", d > 0 ? "happy" : d < 0 ? "sad" : "idle"); };
SCREENS.tr_win = () => watch(esc(P(S.tr.win)?.name || "") + " " + T("escaped"), S.tr.win === me ? "happy" : "idle");

// trial mini-games, played on the phone and reported to the host
const MINI = {
  seats() {
    return `<h2 class="q">${T("t_seats")}</h2><p class="dim">${T("t_seatsR")}</p><div class="seat-pick">${[0, 1, 2, 3, 4].map(i => `<button data-s="${i}">💺<b>${i + 1}</b></button>`).join("")}</div>` +
      bind(() => { $(".seat-pick").onclick = e => { const b = e.target.closest("[data-s]"); if (b) send({ seat: +b.dataset.s }); }; });
  },
  math(tr) {
    const rnd = seeded(tr.seed ^ hash(me));
    let score = 0, typed = "", cur = null, end = Date.now() + 20000;
    const gen = () => { const op = rnd() * 3 | 0; let a, b, r; if (op === 0) { a = 2 + rnd() * 30 | 0; b = 2 + rnd() * 30 | 0; r = a + b; } else if (op === 1) { a = 10 + rnd() * 40 | 0; b = 1 + rnd() * a | 0; r = a - b; } else { a = 2 + rnd() * 8 | 0; b = 2 + rnd() * 8 | 0; r = a * b; } return { s: `${a} ${["+", "−", "×"][op]} ${b}`, r }; };
    cur = gen();
    const show = () => { $("#mq").textContent = cur.s + " = " + (typed || "?"); $("#mscore").textContent = score + " / " + tr.n; };
    bind(() => {
      show();
      $(".pad").onclick = e => { const b = e.target.closest("[data-k]"); if (!b) return; const k = b.dataset.k;
        if (k === "<") typed = typed.slice(0, -1); else typed += k;
        if (+typed === cur.r && typed.length === String(cur.r).length) { score++; buzz(15); typed = ""; cur = gen(); if (score >= tr.n) return send({ score }); }
        else if (typed.length >= String(cur.r).length) { buzz([30, 30, 30]); $("#mq").classList.add("bad"); setTimeout(() => $("#mq")?.classList.remove("bad"), 250); typed = ""; }
        show(); };
      const iv = setInterval(() => { const l = end - Date.now(); const el = $("#mtime"); if (el) el.textContent = Math.max(0, Math.ceil(l / 1000)); if (l <= 0) { clearInterval(iv); if (!sent()) send({ score }); } }, 200);
      cleanup = () => clearInterval(iv);
    });
    return `<div class="mini-head"><b id="mtime">20</b><span id="mscore"></span></div><div id="mq" class="mq"></div><div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "<", 0].map(k => `<button data-k="${k}">${k === "<" ? "⌫" : k}</button>`).join("")}</div>`;
  },
  lamps(tr) {
    const rnd = seeded(tr.seed ^ hash(me)), seq = Array.from({ length: tr.len }, () => rnd() * 4 | 0);
    let pos = 0, input = false;
    bind(() => {
      const lamps = [...document.querySelectorAll(".lamp4 button")];
      let t = 700; const timers = [];
      seq.forEach(n => { timers.push(setTimeout(() => lamps[n].classList.add("lit"), t)); timers.push(setTimeout(() => lamps[n].classList.remove("lit"), t + 520)); t += 760; });
      timers.push(setTimeout(() => { input = true; $("#lstat").textContent = T("repeat"); }, t));
      cleanup = () => timers.forEach(clearTimeout);
      $(".lamp4").onclick = e => { const b = e.target.closest("[data-n]"); if (!b || !input) return; const n = +b.dataset.n;
        b.classList.add("lit"); setTimeout(() => b.classList.remove("lit"), 180); buzz(10);
        if (n !== seq[pos]) { input = false; return send({ ok: false }); }
        pos++; if (pos >= seq.length) { input = false; send({ ok: true }); } };
    });
    return `<h2 class="q">${T("t_lamps")}</h2><p id="lstat" class="dim">${T("remember")}</p><div class="lamp4">${[0, 1, 2, 3].map(n => `<button data-n="${n}" class="l${n}"></button>`).join("")}</div>`;
  },
  brake() {
    let tries = 0, hits = 0, zone = 0, running = true, t0 = performance.now(), raf = 0, speed = 1.6;
    const newZone = () => { zone = .12 + Math.random() * .62; const z = $(".zone"); if (z) z.style.left = zone * 100 + "%"; };
    bind(() => {
      newZone();
      const needle = $(".needle"), loop = now => { if (!running) return; const x = (Math.sin((now - t0) / 1000 * speed * Math.PI) + 1) / 2; needle.style.left = x * 100 + "%"; needle.dataset.x = x; raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop); cleanup = () => cancelAnimationFrame(raf);
      $("#stop").onclick = () => {
        if (!running) return;
        const x = +needle.dataset.x, hit = x >= zone && x <= zone + .16; tries++; if (hit) hits++;
        buzz(hit ? 20 : [40, 30, 40]); $(".gauge").classList.toggle("hit", hit); $(".gauge").classList.toggle("miss", !hit);
        $("#bstat").textContent = `${hits} ${T("hits")} · ${tries}/3`;
        if (hits >= 2 || tries >= 3 || tries - hits >= 2) { running = false; return send({ score: hits }); }
        speed += .35; newZone();
      };
    });
    return `<h2 class="q">${T("t_brake")}</h2><p class="dim">${T("t_brakeR")}</p><div class="gauge"><div class="zone"></div><div class="needle"></div></div><p id="bstat" class="dim">0 ${T("hits")} · 0/3</p><button class="go stop" id="stop">${T("tapStop")}</button>`;
  },
};
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

// ═════ Doodle Lies
const artist = () => S.dd.order[S.dd.di];
SCREENS.dd_intro = () => watch(T("ddName"), "happy", `<p class="dim">${T(S.dd.mode === "pick" ? "ddIntroPair" : "ddIntro")}</p>`);
SCREENS.dd_draw = () => {
  if (sent()) return watch(T("waitOthers"), "happy");
  const pr = C.prompts[S.dd.prompts[me]], cols = S.dd.cols[me];
  return `<div class="draw-head"><small>${T("drawThis")}</small><h2>${tx(pr)}</h2></div><div class="canvas-wrap"><canvas id="pad"></canvas></div>
    <div class="tools"><button class="col sel" data-c="0" style="--c:${cols[0]}"></button><button class="col" data-c="1" style="--c:${cols[1]}"></button>
    <button class="wid" data-w="0">•</button><button class="wid sel" data-w="1">●</button><button id="undo">${T("undo")}</button><button class="go small" id="dsend">${T("done")}</button></div>` + bind(() => drawPad(cols));
};
function drawPad(cols) {
  const cv = $("#pad"), wrap = $(".canvas-wrap");
  const size = Math.min(wrap.clientWidth, innerHeight - 290, 560), dpr = devicePixelRatio || 1;
  cv.style.width = cv.style.height = size + "px"; cv.width = cv.height = size * dpr;
  const g = cv.getContext("2d"), K = cv.width / 1000;
  let strokes = [], cur = null, c = 0, w = 1;
  const redraw = () => { g.fillStyle = "#fffdf7"; g.fillRect(0, 0, cv.width, cv.width); g.lineCap = g.lineJoin = "round";
    for (const s of strokes) { g.strokeStyle = cols[s.c]; g.lineWidth = (s.w ? 22 : 8) * K; g.beginPath(); g.moveTo(s.p[0] * K, s.p[1] * K); if (s.p.length === 2) g.lineTo(s.p[0] * K + .1, s.p[1] * K); for (let i = 2; i < s.p.length; i += 2) g.lineTo(s.p[i] * K, s.p[i + 1] * K); g.stroke(); } };
  redraw();
  const pt = e => { const r = cv.getBoundingClientRect(); return [Math.round(Math.max(0, Math.min(1000, (e.clientX - r.left) / r.width * 1000))), Math.round(Math.max(0, Math.min(1000, (e.clientY - r.top) / r.height * 1000)))]; };
  cv.onpointerdown = e => { cv.setPointerCapture(e.pointerId); cur = { c, w, p: pt(e) }; strokes.push(cur); redraw(); };
  cv.onpointermove = e => { if (!cur) return; const [x, y] = pt(e), n = cur.p.length; if (Math.hypot(x - cur.p[n - 2], y - cur.p[n - 1]) < 5) return; cur.p.push(x, y);
    g.strokeStyle = cols[cur.c]; g.lineWidth = (cur.w ? 22 : 8) * K; g.beginPath(); g.moveTo(cur.p[n - 2] * K, cur.p[n - 1] * K); g.lineTo(x * K, y * K); g.stroke(); };
  cv.onpointerup = cv.onpointercancel = () => { cur = null; };
  document.querySelectorAll(".col").forEach(b => b.onclick = () => { c = +b.dataset.c; document.querySelectorAll(".col").forEach(x => x.classList.toggle("sel", x === b)); });
  document.querySelectorAll(".wid").forEach(b => b.onclick = () => { w = +b.dataset.w; document.querySelectorAll(".wid").forEach(x => x.classList.toggle("sel", x === b)); });
  $("#undo").onclick = () => { strokes.pop(); redraw(); };
  const encode = () => { let pts = strokes; let s = pts.map(x => `${x.c}${x.w}:${x.p.join(",")}`).join(";");
    while (s.length > 400000) { pts = pts.map(x => ({ ...x, p: x.p.filter((_, i) => i % 4 < 2 || i >= x.p.length - 2) })); s = pts.map(x => `${x.c}${x.w}:${x.p.join(",")}`).join(";"); }
    return s; };
  const submit = () => { if (sent()) return; send({ s: encode(), r: S.dd.round }, me + "_d" + S.dd.round); };
  $("#dsend").onclick = () => { if (strokes.length) submit(); };
  autoSend = l => { if (l > 0 && l < 1500 && strokes.length) submit(); };
}
SCREENS.dd_lie = () => {
  if (artist() === me) return watch(T("yourDrawing"), "happy");
  const rej = S.dd.reject && S.dd.reject[me];
  if (sent() && !(rej && lastSent && rej === lastSent.t)) return watch(T("waitOthers"), "happy");
  return `<h2 class="q">${T("writeLie")}</h2>${rej ? `<p class="err">${T("tooClose")}</p>` : ""}<textarea id="lie" maxlength="60" rows="2" enterkeyhint="send"></textarea><button class="go" id="lsend">${T("send")}</button>` +
    bind(() => { const ta = $("#lie"); ta.focus(); const go = () => { const t = ta.value.trim(); if (t) send({ t }); };
      $("#lsend").onclick = go; ta.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); go(); } };
      autoSend = l => { if (l > 0 && l < 1200 && ta.value.trim() && !sent()) go(); }; });
};
SCREENS.dd_vote = () => {
  if (artist() === me) return watch(T("yourDrawing"), "happy");
  if (sent()) return watch(T("waitOthers"));
  return `<h2 class="q">${T("findTruth")}</h2><div class="votes">${S.dd.opts.map((o, i) => o.by.includes(me) && !o.truth ? "" : `<button data-v="${i}">${esc(o.t)}</button>`).join("")}</div>` +
    bind(() => { $(".votes").onclick = e => { const b = e.target.closest("[data-v]"); if (b) send({ v: +b.dataset.v }); }; });
};
SCREENS.dd_pick = () => {
  if (artist() === me) return watch(T("yourDrawing"), "happy");
  if (sent()) return watch(T("waitOthers"));
  return `<h2 class="q">${T("findTruth")}</h2><div class="votes">${S.dd.popts.map((p, i) => `<button data-v="${i}">${tx(C.prompts[p])}</button>`).join("")}</div>` +
    bind(() => { $(".votes").onclick = e => { const b = e.target.closest("[data-v]"); if (b) send({ v: +b.dataset.v }); }; });
};
SCREENS.dd_rev = () => {
  const d = S.dd;
  if (d.mode === "pick") { if (artist() === me) return watch(T("watch")); const ok = d.popts[d.votes[me]] === d.prompts[artist()]; return watch(ok ? T("correct") : T("wrong"), ok ? "happy" : "sad", `<p class="dim">${T("truth")}: ${tx(C.prompts[d.prompts[artist()]])}</p>`); }
  return watch(T("watch"), "shock");
};
SCREENS.dd_sc = () => watch(T("scores"), "happy");

// ═════ Ballpark
const BQ = () => C.estimates[S.bp.qs[S.bp.qi]];
SCREENS.bp_intro = () => watch(T("bpName"), "happy", `<p class="dim">${T("bpIntro")}</p>`);
SCREENS.bp_q = () => {
  if (sent()) return watch(T("waitOthers"), "idle", `<div class="chosen">${fmtNum(lastSent?.n ?? 0, lang)}</div>`);
  return `<h2 class="q">${tx(BQ().q)}</h2><label class="numin"><span>${T("yourGuess")}</span><input id="num" inputmode="decimal" autocomplete="off" placeholder="0"></label><button class="go" id="nsend">${T("send")}</button>` +
    bind(() => { const i = $("#num"); i.focus();
      const val = () => Number(i.value.replace(/\s/g, "").replace(",", ".").replace(/[၀-၉]/g, d => "၀၁၂၃၄၅၆၇၈၉".indexOf(d)));
      const go = () => { const n = val(); if (i.value.trim() && Number.isFinite(n)) send({ n }); else { i.classList.add("bad"); setTimeout(() => i.classList.remove("bad"), 400); } };
      $("#nsend").onclick = go; i.onkeydown = e => { if (e.key === "Enter") go(); };
      autoSend = l => { if (l > 0 && l < 1200 && i.value.trim() && Number.isFinite(val()) && !sent()) go(); }; });
};
SCREENS.bp_bet = () => {
  if (sent()) return watch(T("waitOthers"));
  const g = S.bp.g, list = Object.keys(g).sort((a, b) => g[a] - g[b]);
  return `<h2 class="q">${T("betOn")}</h2><div class="votes bets">${list.map(id => `<button data-b="${id}">${critter(P(id).av, "idle")}<b>${fmtNum(g[id], lang)}</b><small>${esc(P(id).name)}${id === me ? " (" + T("you") + ")" : ""}</small></button>`).join("")}</div>` +
    bind(() => { $(".bets").onclick = e => { const b = e.target.closest("[data-b]"); if (b) send({ b: b.dataset.b }); }; });
};
SCREENS.bp_rev = () => {
  const b = S.bp, best = b.best.includes(me), bet = b.best.includes(b.b[me]);
  return watch(`${T("answerIs")}: ${fmtNum(BQ().n, lang)}`, best ? "happy" : "idle", `<p class="dim">${best ? T("closest") + "! " : ""}${bet ? T("goodBet") + " +500" : ""}</p>`);
};
