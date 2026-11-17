// 81 Trials: the puzzle engines of trials seven to twelve. Same contract as puzzles.js.
import { rint, shuf, my, MON } from "./puzzles.js";
const own = (api, w) => api.coop ? ` own${w} ${w === api.me ? "mine" : "theirs"}` : "";

// ═════ Yellow Wind Ridge: the demon's wind carries each pilgrim until something stops him
const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
function slide(w, h, rock, p, o, d) { let x = p % w, y = p / w | 0; for (; ;) { const X = x + DX[d], Y = y + DY[d]; if (X < 0 || Y < 0 || X >= w || Y >= h) break; const c = Y * w + X; if (rock[c] || c === o) break; x = X; y = Y; } return y * w + x; }
function windBfs(w, h, rock, s, t) {
  const N = w * h, dist = new Int16Array(N * N).fill(-1), q = [s[0] * N + s[1]]; dist[q[0]] = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const k = q[qi], a = k / N | 0, b = k % N; if (a === t[0] && b === t[1]) return dist[k];
    for (let hh = 0; hh < 2; hh++) for (let d = 0; d < 4; d++) { const p = hh ? b : a, o = hh ? a : b, np = slide(w, h, rock, p, o, d); if (np === p) continue; const nk = hh ? a * N + np : np * N + b; if (dist[nk] < 0) { dist[nk] = dist[k] + 1; q.push(nk); } }
  }
  return -1;
}
const PILL = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="#c23a2b" stroke="#1b1a17" stroke-width="2"/><circle cx="15" cy="15" r="4" fill="#f6b0a0" opacity=".8"/><text x="20" y="26" text-anchor="middle" font-size="15" fill="#f6e7d0" font-family="'Ma Shan Zheng',serif">丹</text></svg>`;
const ROCK = `<svg viewBox="0 0 40 40"><path d="M5 34c-2-10 4-22 14-26 9-2 16 6 17 14 1 7-2 12-6 14z" fill="#5d5a52" stroke="#1b1a17" stroke-width="2"/><path d="M12 22c4-6 8-8 14-6" stroke="#8a867a" stroke-width="2" fill="none"/></svg>`;
export function windPuzzle(el, api) {
  const R = api.rnd, STAGES = [{ w: 6, h: 6, min: 6, max: 9 }, { w: 7, h: 7, min: 9, max: 13 }];
  let si = 0, S, moves = 0, totalPar = 0, totalMoves = 0, selH = api.coop ? api.me : 0, msg = "";
  const gen = () => {
    const st = STAGES[si];
    for (; ;) {
      const n = st.w * st.h, rock = Array.from({ length: n }, () => R() < .2);
      const free = [...Array(n).keys()].filter(c => !rock[c]); if (free.length < 8) continue;
      const [h0, h1, t0, t1] = shuf(R, free).slice(0, 4), par = windBfs(st.w, st.h, rock, [h0, h1], [t0, t1]);
      if (par >= st.min && par <= st.max) { S = { ...st, rock, pos: [h0, h1], start: [h0, h1], tgt: [t0, t1], par }; moves = 0; el._t = { S }; return; }
    }
  };
  const cell = (c, html, cls = "") => `<div class="wc ${cls}" style="left:${(c % S.w) * 100 / S.w}%;top:${(c / S.w | 0) * 100 / S.h}%;width:${100 / S.w}%;height:${100 / S.h}%">${html}</div>`;
  const draw = () => {
    el.innerHTML = `<p class="stagecap">${api.tr(`Ущелье ${si + 1} из 2 · минимум ходов: ${S.par}`, `Gorge ${si + 1} of 2 · fewest moves: ${S.par}`, `ချောက် ${my(si + 1)} / ၂ · အနည်းဆုံး ${my(S.par)} ကြိမ်`)}</p>${msg}
      <div class="windb" style="aspect-ratio:${S.w}/${S.h};--w:${S.w};--h:${S.h}"><i class="gust"></i><i class="gust g2"></i>
        ${S.rock.map((r, c) => r ? cell(c, ROCK, "rock") : "").join("")}
        ${cell(S.tgt[0], PILL, "tgt t0")}${cell(S.tgt[1], `<div class="cage">${MON.tang}</div>`, "tgt t1")}
        ${[0, 1].map(h => cell(S.pos[h], `<button class="hero ${selH === h ? "sel" : ""}" data-h="${h}" aria-label="${h ? "Bajie" : "Wukong"}">${MON[h ? "bajie" : "wukong"]}</button>`, `hc h${h}${own(api, h)}`)).join("")}
      </div>
      <div class="pad">${api.coop ? `<span class="padwho">${api.who(api.me)}: ${api.me ? api.tr("Бацзе", "Bajie", "ပါကျဲ") : api.tr("Укун", "Wukong", "ဝူခုန်း")}</span>` : `<div class="seg"><button class="${selH ? "" : "on"}" data-sel="0">${api.tr("Укун", "Wukong", "ဝူခုန်း")} → 丹</button><button class="${selH ? "on" : ""}" data-sel="1">${api.tr("Бацзе", "Bajie", "ပါကျဲ")} → ${api.tr("учитель", "master", "ဆရာ")}</button></div>`}
        <div class="arrows"><button data-d="0" aria-label="up">▲</button><button data-d="3" aria-label="left">◀</button><button data-d="2" aria-label="down">▼</button><button data-d="1" aria-label="right">▶</button></div>
        <button class="btn" id="wreset">↺ ${api.tr("Сначала", "Restart", "အစက ပြန်စ")}</button></div>
      <p class="dim center">${api.tr("Ходов", "Moves", "လှုပ်ရှားမှု")}: <b>${moves}</b></p>`;
    el.querySelectorAll("[data-sel]").forEach(b => b.onclick = () => { selH = +b.dataset.sel; draw(); });
    el.querySelectorAll(".hero").forEach(b => b.onclick = () => { if (api.coop) return; selH = +b.dataset.h; draw(); });
    el.querySelectorAll("[data-d]").forEach(b => b.onclick = () => move(+b.dataset.d));
    el.querySelector("#wreset").onclick = () => api.act({ k: "reset" });
    const board = el.querySelector(".windb"); let p0 = null;
    board.addEventListener("pointerdown", e => { p0 = { x: e.clientX, y: e.clientY }; });
    board.addEventListener("pointerup", e => { if (!p0) return; const dx = e.clientX - p0.x, dy = e.clientY - p0.y; p0 = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0)); });
  };
  const move = d => { if (el.dataset.done) return; api.act({ k: "mv", h: selH, d }); };
  const onKey = e => { if (!el.isConnected) return document.removeEventListener("keydown", onKey); const d = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key]; if (d === undefined) return; e.preventDefault(); move(d); };
  document.addEventListener("keydown", onKey);
  api.on(a => {
    if (el.dataset.done) return;
    if (a.k === "reset") { S.pos = S.start.slice(); totalMoves += moves; moves = 0; msg = ""; api.sfx("pluck"); return draw(); }
    if (a.k !== "mv") return;
    const h = a.h, np = slide(S.w, S.h, S.rock, S.pos[h], S.pos[1 - h], a.d);
    if (np === S.pos[h]) return;
    S.pos[h] = np; moves++; msg = ""; api.sfx("wind");
    const hc = el.querySelector(`.hc.h${h}`); // move the hero smoothly instead of redrawing at once
    if (hc) { hc.style.left = `${(np % S.w) * 100 / S.w}%`; hc.style.top = `${(np / S.w | 0) * 100 / S.h}%`; el.querySelector("p.dim.center b").textContent = moves; }
    else draw();
    if (S.pos[0] === S.tgt[0] && S.pos[1] === S.tgt[1]) {
      api.sfx("bell"); totalMoves += moves; totalPar += S.par; si++;
      if (si < STAGES.length) { const best = moves; gen(); msg = `<p class="note good">${api.tr(`Оба на месте за ${best} ходов. Ветер крепчает: второе ущелье.`, `Both are in place in ${best} moves. The wind is rising: the second gorge.`, `လှုပ်ရှားမှု ${my(best)} ကြိမ်နဲ့ နှစ်ယောက်လုံး ရောက်ပြီ။ လေ ပိုပြင်းလာပြီ: ဒုတိယ ချောက်။`)}</p>`; setTimeout(() => el.isConnected && draw(), 500); }
      else { el.dataset.done = 1; el.querySelector(".windb")?.classList.add("solved"); setTimeout(() => api.done({ good: totalMoves <= totalPar + 4, moves: totalMoves, par: totalPar }), 900); }
    }
  });
  gen(); draw();
}

// ═════ Cart-Slow Kingdom: guess the four treasures hidden in the king's cabinet
const TREASURES = [
  ["#f08a7e", `<path d="M20 34c-9 0-14-7-13-14 1-6 6-10 13-8 7-2 12 2 13 8 1 7-4 14-13 14z" fill="#f4a08f"/><path d="M20 12c-1 8 1 16 4 22" stroke="#d96a5c" stroke-width="1.5" fill="none"/><path d="M20 12c4-6 10-6 12-4-3 4-8 5-12 4z" fill="#6aa84f"/>`, "桃"],
  ["#e6b84a", `<path d="M10 30c0-12 4-20 10-20s10 8 10 20z" fill="#e6b84a"/><path d="M7 30h26" stroke="#8a6a2a" stroke-width="3"/><circle cx="20" cy="33" r="3" fill="#8a6a2a"/><path d="M20 6v4" stroke="#8a6a2a" stroke-width="3"/>`, "铃"],
  ["#6aa84f", `<circle cx="20" cy="27" r="9" fill="#9ccc65"/><circle cx="20" cy="14" r="6" fill="#9ccc65"/><path d="M14 20h12" stroke="#c23a2b" stroke-width="2.5"/><path d="M20 8V4" stroke="#6a4a2a" stroke-width="2.5"/>`, "葫"],
  ["#9ecae1", `<circle cx="20" cy="21" r="12" fill="#d8ecf6"/><circle cx="16" cy="17" r="4" fill="#fff"/><circle cx="20" cy="21" r="12" fill="none" stroke="#7aa6c2" stroke-width="2"/>`, "珠"],
  ["#b98b5e", `<rect x="8" y="10" width="24" height="20" fill="#f1e3c3"/><rect x="5" y="8" width="5" height="24" rx="2" fill="#8a5a2b"/><rect x="30" y="8" width="5" height="24" rx="2" fill="#8a5a2b"/><path d="M13 16h14M13 21h14M13 26h10" stroke="#7a6a50" stroke-width="1.5"/>`, "经"],
  ["#b07cc6", `<path d="M20 32c-6-4-8-12-6-18 4 2 6 8 6 18zM20 32c6-4 8-12 6-18-4 2-6 8-6 18zM20 32c-10 0-14-6-14-12 6 0 12 6 14 12zM20 32c10 0 14-6 14-12-6 0-12 6-14 12z" fill="#d9b3e6"/><path d="M20 32c-3-6-3-14 0-22 3 8 3 16 0 22z" fill="#c792d9"/>`, "莲"]];
const trs = (v, cls = "") => v < 0 ? `<span class="tre empty ${cls}"></span>` : `<span class="tre ${cls}" style="--c:${TREASURES[v][0]}"><svg viewBox="0 0 40 40">${TREASURES[v][1]}</svg></span>`;
const BELL = (gold) => `<svg viewBox="0 0 20 20" class="bellic ${gold ? "g" : "s"}"><path d="M4 15c0-7 2-11 6-11s6 4 6 11z" fill="${gold ? "#e6b84a" : "#c9ccd1"}" stroke="#1b1a17" stroke-width="1.4"/><path d="M3 15h14" stroke="#1b1a17" stroke-width="1.6"/><circle cx="10" cy="17" r="1.6" fill="#1b1a17"/></svg>`;
export function casketPuzzle(el, api) {
  const R = api.rnd, K = 6, SL = 4, MAXG = 8;
  let secret, rows, cur, fails = 0, msg = "", guesses = 0;
  const fresh = () => { secret = shuf(R, [...Array(K).keys()]).slice(0, SL); rows = []; cur = Array(SL).fill(-1); el._t = { secret }; };
  const seeGold = () => !api.coop || api.me === 0, seeSilver = () => !api.coop || api.me === 1;
  const draw = () => {
    el.innerHTML = `<div class="casket">${msg}
      <div class="cab"><div class="cabdoors">${Array.from({ length: SL }, (_, s) => `<span class="door">${"一二三四"[s]}</span>`).join("")}</div></div>
      <ol class="guesses">${rows.map((r, k) => `<li><span class="gno">${api.tr(`${k + 1}`, `${k + 1}`, my(k + 1))}</span><span class="gtre">${r.g.map(v => trs(v, "sm")).join("")}</span>
        <span class="fb"><span class="fbg ${seeGold() ? "" : "hid"}">${seeGold() ? BELL(true).repeat(r.b) + (r.b ? "" : "<i>0</i>") : `<i title="${api.who(0)}">?</i>`}</span><span class="fbs ${seeSilver() ? "" : "hid"}">${seeSilver() ? BELL(false).repeat(r.s) + (r.s ? "" : "<i>0</i>") : `<i title="${api.who(1)}">?</i>`}</span></span></li>`).join("")}</ol>
      <div class="slots">${cur.map((v, s) => `<button class="slot" data-s="${s}" aria-label="slot ${s + 1}">${trs(v)}</button>`).join("")}</div>
      <div class="palette">${TREASURES.map((t, v) => `<button class="pv" data-v="${v}" aria-label="${t[2]}">${trs(v)}</button>`).join("")}</div>
      <div class="row"><button class="btn primary" id="try" ${cur.every(v => v >= 0) ? "" : "disabled"}>🔔 ${api.tr("Открыть створки", "Open the doors", "တံခါး ဖွင့်မယ်")}</button><span class="dim">${api.tr("Попыток осталось", "Tries left", "ကျန်တဲ့ အကြိမ်")}: <b>${MAXG - rows.length}</b></span></div>
      ${api.coop ? `<p class="dim small center">${api.me === 0 ? api.tr("Вы слышите только золотые колокольчики, спутник — только серебряные.", "You hear only the gold bells; your partner hears only the silver ones.", "ကိုယ်က ရွှေခေါင်းလောင်းပဲ ကြားရတယ်၊ အဖော်က ငွေခေါင်းလောင်းပဲ ကြားရတယ်။") : api.tr("Вы слышите только серебряные колокольчики, спутник — только золотые.", "You hear only the silver bells; your partner hears only the gold ones.", "ကိုယ်က ငွေခေါင်းလောင်းပဲ ကြားရတယ်၊ အဖော်က ရွှေခေါင်းလောင်းပဲ ကြားရတယ်။")}</p>` : ""}</div>`;
    el.querySelectorAll(".pv").forEach(b => b.onclick = () => { const s = cur.indexOf(-1); if (s >= 0) api.act({ k: "put", s, v: +b.dataset.v }); });
    el.querySelectorAll(".slot").forEach(b => b.onclick = () => { const s = +b.dataset.s; if (cur[s] >= 0) api.act({ k: "put", s, v: -1 }); });
    el.querySelector("#try").onclick = () => api.act({ k: "try" });
  };
  api.on(a => {
    if (el.dataset.done) return;
    if (a.k === "put") { cur[a.s] = a.v; msg = ""; api.sfx("wood"); return draw(); }
    if (a.k !== "try" || !cur.every(v => v >= 0)) return;
    const b = cur.filter((v, s) => v === secret[s]).length, common = TREASURES.reduce((n, _, v) => n + Math.min(cur.filter(x => x === v).length, secret.filter(x => x === v).length), 0);
    rows.push({ g: cur.slice(), b, s: common - b }); cur = Array(SL).fill(-1); guesses++; api.sfx(b === SL ? "gong" : "bell");
    if (b === SL) {
      draw(); el.querySelector(".cab").classList.add("open"); el.querySelector(".cabdoors").innerHTML = secret.map(v => `<span class="door open">${trs(v)}</span>`).join("");
      el.dataset.done = 1; setTimeout(() => api.done({ good: fails === 0 && rows.length <= 6, moves: rows.length }), 1100); return;
    }
    if (rows.length >= MAXG) {
      const was = secret.map(v => trs(v, "sm")).join(""); fails++; api.mistake(); api.sfx("fail"); fresh();
      msg = `<p class="note bad">${api.tr("Попытки кончились. В шкафу было:", "Out of tries. The cabinet held:", "အကြိမ်တွေ ကုန်ပြီ။ ဗီရိုထဲမှာ ရှိခဲ့တာ:")} ${was} ${api.tr("Даос прячет новые сокровища.", "The Taoist hides new treasures.", "တာအိုဆရာက ရတနာအသစ် ဝှက်လိုက်ပြီ။")}</p>`;
    }
    draw();
  });
  fresh(); draw();
}

// ═════ Golden Light Temple: a forest of pagodas, and from each gate you count how many you can see
const PAGODA = h => `<svg viewBox="0 0 40 48" class="pg">${Array.from({ length: h }, (_, k) => { const y = 44 - k * 8, w = 30 - k * 4; return `<path d="M${20 - w / 2 - 3} ${y - 4}q${w / 2 + 3} -5 ${w + 6} 0z" fill="#8f2219"/><rect x="${20 - w / 2 + 2}" y="${y - 4}" width="${w - 4}" height="5" fill="#c9a24a" stroke="#5a3a1a" stroke-width=".8"/>`; }).join("")}<path d="M20 ${44 - h * 8 - 1}v-5" stroke="#5a3a1a" stroke-width="1.6"/></svg>`;
const visible = s => { let m = 0, c = 0; for (const v of s) if (v > m) { m = v; c++; } return c; };
function pagodaClues(g, n) { const col = c => g.map(r => r[c]), cl = []; for (let c = 0; c < n; c++) cl.push(visible(col(c))); for (let r = 0; r < n; r++) cl.push(visible([...g[r]].reverse())); for (let c = 0; c < n; c++) cl.push(visible(col(c).reverse())); for (let r = 0; r < n; r++) cl.push(visible(g[r])); return cl; }
function perms(n) { const out = [], p = (a, r) => { if (!r.length) return out.push(a); r.forEach((x, i) => p([...a, x], r.filter((_, j) => j !== i))); }; p([], [...Array(n).keys()].map(i => i + 1)); return out; }
function pagodaCount(n, cl, P, limit = 2) { // clue order: top (columns), right (rows), bottom (columns), left (rows)
  let cnt = 0; const g = [], used = Array.from({ length: n }, () => new Set());
  const rowOK = p => {
    const r = g.length, Lc = cl[3 * n + r], Rc = cl[n + r];
    if (Lc && visible(p) !== Lc) return false; if (Rc && visible([...p].reverse()) !== Rc) return false;
    for (let c = 0; c < n; c++) if (used[c].has(p[c])) return false;
    for (let c = 0; c < n; c++) { const T = cl[c]; if (!T) continue; let m = 0, k = 0; for (const row of g) if (row[c] > m) { m = row[c]; k++; } if (p[c] > m) { m = p[c]; k++; } if (k > T || (m === n && k !== T)) return false; }
    return true;
  };
  const rec = () => {
    if (cnt >= limit) return;
    if (g.length === n) { const c2 = pagodaClues(g, n); for (let i = 0; i < 4 * n; i++) if (cl[i] && cl[i] !== c2[i]) return; cnt++; return; }
    for (const p of P) { if (!rowOK(p)) continue; g.push(p); p.forEach((v, c) => used[c].add(v)); rec(); g.pop(); p.forEach((v, c) => used[c].delete(v)); }
  };
  rec(); return cnt;
}
export function pagodaPuzzle(el, api) {
  const R = api.rnd, STAGES = [{ n: 4, keep: 7 }, { n: 5, keep: 10 }];
  let si = 0, n, cl, sol, grid, sel = -1, mistakes = 0, wrongFull = false, msg = "";
  const gen = () => {
    const st = STAGES[si]; n = st.n; const P = perms(n);
    for (; ;) {
      const rows = shuf(R, [...Array(n).keys()]), cols = shuf(R, [...Array(n).keys()]), sym = shuf(R, [...Array(n).keys()].map(i => i + 1));
      const g = rows.map(r => cols.map(c => sym[(r + c) % n])); const c0 = pagodaClues(g, n);
      if (pagodaCount(n, c0, P) !== 1) continue;
      let left = 4 * n;
      for (const i of shuf(R, [...Array(4 * n).keys()])) { if (left <= st.keep) break; const v = c0[i]; c0[i] = 0; if (pagodaCount(n, c0, P) !== 1) c0[i] = v; else left--; }
      cl = c0; sol = g.flat(); grid = Array(n * n).fill(0); sel = -1; wrongFull = false; el._t = { sol, n }; return;
    }
  };
  // in a game for two one player stands at the north and west gates, the other at the south and east gates
  const sideOwner = side => side === 0 || side === 3 ? 0 : 1;
  const clue = (side, k) => { const v = cl[side * n + k]; if (!v) return `<span class="clue"></span>`; if (api.coop && sideOwner(side) !== api.me) return `<span class="clue hid" title="${api.who(1 - api.me)}">?</span>`; return `<span class="clue">${api.tr(v, v, my(v))}</span>`; };
  const dup = c => { const v = grid[c]; if (!v) return false; const r = c / n | 0, k = c % n; for (let j = 0; j < n; j++) { if (j !== k && grid[r * n + j] === v) return true; if (j !== r && grid[j * n + k] === v) return true; } return false; };
  const draw = () => {
    const sn = Math.min(si, STAGES.length - 1) + 1, top = Array.from({ length: n }, (_, c) => clue(0, c)).join(""), bot = Array.from({ length: n }, (_, c) => clue(2, c)).join("");
    el.innerHTML = `<p class="stagecap">${api.tr(`Двор ${sn} из 2 · ${n}×${n}, высота пагод от 1 до ${n}`, `Courtyard ${sn} of 2 · ${n}×${n}, pagodas 1 to ${n} storeys tall`, `ဝင်း ${my(sn)} / ၂ · ${my(n)}×${my(n)}၊ စေတီ အထပ် ${my(1)} မှ ${my(n)} ထိ`)}</p>${msg}
      <div class="pagb" style="--n:${n}"><span></span>${top}<span></span>
        ${Array.from({ length: n }, (_, r) => `${clue(3, r)}${Array.from({ length: n }, (_, k) => { const c = r * n + k, v = grid[c]; return `<button class="pc ${sel === c ? "sel" : ""} ${dup(c) ? "dup" : ""}" data-c="${c}">${v ? PAGODA(v) + `<b>${api.tr(v, v, my(v))}</b>` : ""}</button>`; }).join("")}${clue(1, r)}`).join("")}
        <span></span>${bot}<span></span></div>
      <div class="numpad">${Array.from({ length: n }, (_, k) => `<button class="btn" data-v="${k + 1}">${PAGODA(k + 1)}<b>${api.tr(k + 1, k + 1, my(k + 1))}</b></button>`).join("")}<button class="btn" data-v="0">✕</button></div>`;
    el.querySelectorAll(".pc").forEach(b => b.onclick = () => { sel = +b.dataset.c; draw(); });
    el.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { if (sel < 0) return; api.act({ k: "set", c: sel, v: +b.dataset.v }); });
  };
  api.on(a => {
    if (a.k !== "set" || el.dataset.done) return;
    grid[a.c] = a.v; msg = ""; api.sfx("wood");
    if (grid.every(Boolean)) {
      if (grid.every((v, c) => v === sol[c])) {
        api.sfx("bell"); si++;
        if (si < STAGES.length) { gen(); msg = `<p class="note good">${api.tr("Двор выметен, все пагоды на месте. Следующий двор больше.", "This courtyard is swept and every pagoda is in place. The next one is larger.", "ဒီဝင်းကို လှည်းပြီးပြီ၊ စေတီတိုင်း နေရာမှန်မှာ ရှိတယ်။ နောက်ဝင်းက ပိုကြီးတယ်။")}</p>`; }
        else { draw(); el.dataset.done = 1; el.querySelector(".pagb").classList.add("solved"); setTimeout(() => api.done({ good: mistakes === 0 }), 900); return; }
      } else if (!wrongFull) { wrongFull = true; mistakes++; api.mistake(); api.sfx("fail"); msg = `<p class="note bad">${api.tr("Двор заполнен, но настоятель качает головой: где-то пагоды стоят не так.", "The courtyard is full, but the abbot shakes his head: some pagodas are wrong.", "ဝင်း ပြည့်သွားပြီ၊ ဒါပေမယ့် ကျောင်းထိုင်ဆရာတော်က ခေါင်းခါတယ်: တချို့ စေတီတွေ မှားနေတယ်။")}</p>`; }
    } else wrongFull = false;
    draw();
  });
  gen(); draw();
}

// ═════ Real and False Monkey Kings: spot what differs between the two Wukongs
// Each feature is drawn one way on the true Wukong and, if chosen, another way on the false one. [x, y, radius, A, B]
const FEAT = {
  sun: [250, 44, 24, `<circle cx="250" cy="44" r="17" fill="#c23a2b"/>`, `<circle cx="250" cy="44" r="17" fill="#c23a2b"/><circle cx="258" cy="38" r="15" fill="#f3ead6"/>`],
  bird: [62, 40, 20, `<path d="M48 40q7-8 14 0q7-8 14 0" stroke="#1b1a17" stroke-width="2.5" fill="none"/>`, ``],
  pagoda: [40, 112, 20, `<g fill="#4b5a45"><path d="M34 120h12v-6h-12z"/><path d="M30 114h20l-10-8z"/><path d="M36 106h8v-5h-8z"/><path d="M32 101h16l-8-7z"/></g>`, ``],
  peach: [276, 160, 13, `<circle cx="276" cy="160" r="7" fill="#f08a7e" stroke="#1b1a17" stroke-width="1.5"/>`, ``],
  curl: [196, 270, 16, `<path d="M186 272q2-12 12-10q8 2 4 10" stroke="#9aa6b8" stroke-width="3" fill="none"/>`, ``],
  eyes: [150, 106, 13, `<circle cx="141" cy="106" r="2.6" fill="#1b1a17"/><circle cx="159" cy="106" r="2.6" fill="#1b1a17"/>`, `<circle cx="138" cy="106" r="2.6" fill="#1b1a17"/><circle cx="156" cy="106" r="2.6" fill="#1b1a17"/>`],
  band: [150, 84, 17, `<path d="M127 86q23-12 46 0" stroke="#e6c25a" stroke-width="5" fill="none"/>`, `<path d="M127 86q23-12 46 0" stroke="#aeb3ba" stroke-width="5" fill="none"/>`],
  plume: [176, 44, 20, `<path d="M162 76q8-34 30-50" stroke="#c23a2b" stroke-width="3" fill="none"/>`, ``],
  belt: [150, 172, 18, `<rect x="128" y="166" width="44" height="9" rx="3" fill="#c23a2b" stroke="#1b1a17" stroke-width="1.5"/>`, `<rect x="128" y="166" width="44" height="9" rx="3" fill="#4d8a4a" stroke="#1b1a17" stroke-width="1.5"/>`],
  staff: [222, 96, 13, `<rect x="216" y="88" width="13" height="16" rx="3" fill="#e6c25a" stroke="#1b1a17" stroke-width="1.5" transform="rotate(40 222 96)"/>`, `<rect x="216" y="88" width="13" height="16" rx="3" fill="#c23a2b" stroke="#1b1a17" stroke-width="1.5" transform="rotate(40 222 96)"/>`],
  tail: [98, 214, 20, `<path d="M118 206q-30 4-26-18q4-10 12-4" stroke="#c98a3a" stroke-width="5" fill="none" stroke-linecap="round"/>`, `<path d="M118 206q-30 4-26 22q4 10 12 4" stroke="#c98a3a" stroke-width="5" fill="none" stroke-linecap="round"/>`],
  boots: [150, 246, 22, `<path d="M128 240h18v10h-22zM154 240h18l4 10h-22z" fill="#1b1a17"/>`, `<path d="M128 240h18v10h-22zM154 240h18l4 10h-22z" fill="#8f2219" stroke="#1b1a17" stroke-width="1.5"/>`],
  mouth: [150, 124, 10, `<path d="M143 122q7 6 14 0" stroke="#1b1a17" stroke-width="2.2" fill="none"/>`, `<ellipse cx="150" cy="124" rx="4" ry="5" fill="#7a1f1a" stroke="#1b1a17" stroke-width="1.5"/>`],
  ring: [118, 120, 11, ``, `<circle cx="118" cy="120" r="5" fill="none" stroke="#e6c25a" stroke-width="2.5"/>`],
};
const FKEYS = Object.keys(FEAT);
function monkeyScene(alt, found) {
  const f = k => FEAT[k][alt.has(k) ? 4 : 3];
  return `<svg viewBox="0 0 300 300" class="mscene"><rect width="300" height="300" fill="#f3ead6"/>
    ${f("sun")}${f("bird")}
    <path d="M0 160q30-50 60-30t50-40q30 40 60 30t60-36q40 30 70 56v120H0z" fill="#aab3a2" opacity=".75"/>${f("pagoda")}
    <path d="M0 210q60-30 120-10t110-12q40 6 70 20v92H0z" fill="#7d8a74" opacity=".8"/>
    <path d="M262 290v-110" stroke="#5a3a1a" stroke-width="7"/><circle cx="262" cy="150" r="28" fill="#6f9a5a"/><circle cx="250" cy="146" r="7" fill="#f08a7e" stroke="#1b1a17" stroke-width="1.5"/><circle cx="262" cy="134" r="7" fill="#f08a7e" stroke="#1b1a17" stroke-width="1.5"/>${f("peach")}
    <path d="M86 262q-6-14 14-16q8-14 30-8q20-12 44-2q22-4 30 10q18 2 14 16z" fill="#eef2f6" stroke="#9aa6b8" stroke-width="2"/><path d="M110 266q2-10 10-8M140 266q2-12 12-10" stroke="#9aa6b8" stroke-width="3" fill="none"/>${f("curl")}
    ${f("tail")}${f("boots")}
    <path d="M122 240c-2-30 2-62 28-66 26 4 30 36 28 66z" fill="#e2a93b" stroke="#1b1a17" stroke-width="2.5"/><path d="M150 176v64" stroke="#8a3b1f" stroke-width="3"/>${f("belt")}
    <path d="M78 262L222 96" stroke="#5a3a1a" stroke-width="7" stroke-linecap="round"/><rect x="72" y="254" width="13" height="16" rx="3" fill="#e6c25a" stroke="#1b1a17" stroke-width="1.5" transform="rotate(40 78 262)"/>${f("staff")}
    <path d="M126 180q-12 20 -22 46M174 180q18 -10 26 -40" stroke="#e2a93b" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="104" cy="226" r="6" fill="#c98a3a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="200" cy="138" r="6" fill="#c98a3a" stroke="#1b1a17" stroke-width="1.5"/>
    <circle cx="121" cy="110" r="9" fill="#c98a3a" stroke="#1b1a17" stroke-width="2"/><circle cx="179" cy="110" r="9" fill="#c98a3a" stroke="#1b1a17" stroke-width="2"/>${f("ring")}
    <path d="M124 104c-4-24 10-34 26-34s30 10 26 34c-2 18-12 30-26 30s-24-12-26-30z" fill="#c98a3a" stroke="#1b1a17" stroke-width="2.5"/>
    <path d="M132 104c0-12 8-16 18-16s18 4 18 16c0 16-8 26-18 26s-18-10-18-26z" fill="#f1c9a5"/><path d="M134 102c4-8 10-9 16-4 6-5 12-4 16 4-1 10-8 16-16 19-8-3-15-9-16-19z" fill="#c8322b"/>
    <ellipse cx="141" cy="106" rx="5" ry="4" fill="#fff" stroke="#1b1a17" stroke-width="1.5"/><ellipse cx="159" cy="106" rx="5" ry="4" fill="#fff" stroke="#1b1a17" stroke-width="1.5"/>${f("eyes")}${f("mouth")}
    ${f("band")}<path d="M138 76q-10-34-28-46" stroke="#c23a2b" stroke-width="3" fill="none"/>${f("plume")}
    ${[...found].map(k => `<circle cx="${FEAT[k][0]}" cy="${FEAT[k][1]}" r="${FEAT[k][2] + 3}" class="found"/>`).join("")}</svg>`;
}
export function mirrorPuzzle(el, api) {
  const R = api.rnd, COUNT = 6;
  const alt = new Set(shuf(R, FKEYS).slice(0, COUNT)), found = new Set(), fakeSide = rint(R, 2);
  let misses = 0, marks = [];
  el._t = { alt: [...alt], FEAT, fakeSide };
  // in a game for two each player sees only one of the Wukongs: the left one goes to the first player
  const showSide = s => !api.coop || s === api.me;
  const draw = () => {
    el.innerHTML = `${api.coop ? `<p class="dim small center">${api.tr(`Второй Укун у спутника (${api.who(1 - api.me)}). Описывайте друг другу, что видите.`, `The other Wukong is with your partner (${api.who(1 - api.me)}). Describe to each other what you see.`, `နောက် ဝူခုန်းက အဖော် (${api.who(1 - api.me)}) ဆီမှာ။ မြင်တာကို အချင်းချင်း ပြောပြပါ။`)}</p>` : ""}
      <div class="mirror ${api.coop ? "one" : ""}">${[0, 1].filter(showSide).map(s => `<div class="mside${own(api, s)}"><div class="mpic" data-s="${s}">${monkeyScene(s === fakeSide ? alt : new Set(), found)}${marks.filter(m => m.s === s).map(m => `<i class="miss" style="left:${m.x / 3}%;top:${m.y / 3}%"></i>`).join("")}</div></div>`).join("")}</div>
      <p class="dim center">${api.tr("Найдено", "Found", "တွေ့ပြီ")}: <b>${found.size} / ${COUNT}</b> · ${api.tr("Промахов", "Misses", "လွဲတာ")}: <b>${misses}</b></p>`;
    el.querySelectorAll(".mpic[data-s]").forEach(p => p.onclick = e => {
      if (el.dataset.done) return;
      const r = p.getBoundingClientRect();
      api.act({ k: "tap", s: +p.dataset.s, x: Math.round((e.clientX - r.left) / r.width * 300), y: Math.round((e.clientY - r.top) / r.height * 300) });
    });
  };
  api.on(a => {
    if (a.k !== "tap" || el.dataset.done) return;
    let best = null, bd = 1e9;
    for (const k of alt) { if (found.has(k)) continue; const [x, y, r] = FEAT[k], d = Math.hypot(a.x - x, a.y - y); if (d <= r + 10 && d < bd) { bd = d; best = k; } }
    if (best) { found.add(best); api.sfx("bell"); }
    else { misses++; marks.push({ s: a.s, x: a.x, y: a.y }); marks = marks.slice(-3); api.sfx("fail"); if (misses > 3) api.mistake(); }
    draw();
    if (found.size === COUNT) { el.dataset.done = 1; el.querySelector(".mirror").classList.add("solved"); setTimeout(() => api.done({ good: misses <= 3 }), 1000); }
  });
  draw();
}

// ═════ Flat-Top Mountain: Golden Horn and Silver Horn's treasures, taken in turns; whoever takes the last wins the gourd
const NIMT = [
  `<svg viewBox="0 0 40 48"><circle cx="20" cy="33" r="12" fill="#b03a6a" stroke="#1b1a17" stroke-width="2"/><circle cx="20" cy="15" r="8" fill="#b03a6a" stroke="#1b1a17" stroke-width="2"/><path d="M12 24h16" stroke="#e6c25a" stroke-width="3"/><path d="M20 7V2" stroke="#5a3a1a" stroke-width="3"/></svg>`,
  `<svg viewBox="0 0 40 48"><path d="M14 6h12v8c8 4 10 12 8 20-2 8-8 12-14 12s-12-4-14-12c-2-8 0-16 8-20z" fill="#eef2ea" stroke="#1b1a17" stroke-width="2"/><path d="M14 6h12" stroke="#7aa04a" stroke-width="4"/><path d="M10 28q10 6 20 0" stroke="#9ab" stroke-width="1.5" fill="none"/></svg>`,
  `<svg viewBox="0 0 40 48"><path d="M20 6c10 0 14 8 10 14s-14 6-16 14 6 12 12 8" stroke="#e6b84a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M20 6c10 0 14 8 10 14s-14 6-16 14 6 12 12 8" stroke="#8a6a2a" stroke-width="1.2" fill="none" stroke-dasharray="2 3"/></svg>`,
  `<svg viewBox="0 0 40 48"><path d="M20 2l4 30h-8z" fill="#cfd6dc" stroke="#1b1a17" stroke-width="1.8"/><path d="M10 32h20" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/><path d="M20 34v10" stroke="#5a3a1a" stroke-width="4"/>${[10, 15, 20, 25].map(y => `<circle cx="20" cy="${y}" r="1.2" fill="#c23a2b"/>`).join("")}</svg>`];
export function gourdPuzzle(el, api) {
  const R = api.rnd, GAMES = [{ p: 3, max: 5 }, { p: 3, max: 7 }, { p: 4, max: 7 }];
  let gi = 0, piles, tm = 0, losses = 0, sel = null, msg = "", taken = [];
  const xor = a => a.reduce((x, v) => x ^ v, 0);
  const deal = () => { const g = GAMES[gi]; do { piles = Array.from({ length: g.p }, () => 1 + rint(R, g.max)); } while (!xor(piles) || piles.filter(v => v > 1).length < 2); tm = 0; sel = null; taken = []; el._t = { get piles() { return piles; } }; };
  const turn = () => tm % 2; // whose turn it is in a game for two: the team moves alternate between the players
  const myTurn = () => !api.coop || turn() === api.me;
  const draw = () => {
    el.innerHTML = `<div class="nim"><p class="stagecap">${api.tr(`Поединок ${Math.min(gi, 2) + 1} из 3`, `Contest ${Math.min(gi, 2) + 1} of 3`, `ပြိုင်ပွဲ ${my(Math.min(gi, 2) + 1)} / ၃`)}</p>${msg}
      ${piles.map((v, p) => `<div class="cave"><span class="cvn">${"一二三四"[p]}</span><div class="items">${Array.from({ length: v }, (_, j) => `<button class="it ${sel && sel.p === p && j >= v - sel.n ? "sel" : ""}" data-p="${p}" data-j="${j}">${NIMT[p]}</button>`).join("")}${(taken[p] || []).map(w => `<span class="it gone ${w ? "ai" : ""}">${NIMT[p]}</span>`).join("")}</div></div>`).join("")}
      <div class="row"><button class="btn primary" id="take" ${sel && myTurn() ? "" : "disabled"}>✋ ${sel ? api.tr(`Взять ${sel.n}`, `Take ${sel.n}`, `${my(sel.n)} ခု ယူမယ်`) : api.tr("Выберите сокровища", "Pick treasures", "ရတနာ ရွေးပါ")}</button></div>
      <p class="dim small center">${api.coop ? (myTurn() ? api.tr("Ваш ход.", "Your move.", "ကိုယ့်အလှည့်။") : api.tr(`Ходит ${api.who(turn())}.`, `${api.who(turn())} moves.`, `${api.who(turn())} ရဲ့ အလှည့်။`)) + " " : ""}${api.tr("Можно брать сколько угодно, но только из одной пещеры.", "Take as many as you like, but from one cave only.", "ကြိုက်သလောက် ယူနိုင်တယ်၊ ဒါပေမယ့် ဂူတစ်ခုတည်းကပဲ။")}</p></div>`;
    el.querySelectorAll(".it[data-p]").forEach(b => b.onclick = () => { if (!myTurn()) return api.nope(); const p = +b.dataset.p, j = +b.dataset.j; sel = { p, n: piles[p] - j }; api.sfx("wood"); draw(); });
    el.querySelector("#take").onclick = () => { if (sel) api.act({ k: "take", p: sel.p, n: sel.n }); };
  };
  const aiMove = () => {
    const x = xor(piles);
    if (x) { for (let p = 0; p < piles.length; p++) { const t = piles[p] ^ x; if (t < piles[p]) return { p, n: piles[p] - t }; } }
    const ps = piles.map((v, p) => v ? p : -1).filter(p => p >= 0), p = ps[rint(R, ps.length)];
    return { p, n: 1 + rint(R, Math.min(2, piles[p])) };
  };
  api.on(a => {
    if (a.k !== "take" || el.dataset.done || !(a.n >= 1 && piles[a.p] >= a.n)) return;
    sel = null; taken = []; piles[a.p] -= a.n; taken[a.p] = Array(a.n).fill(0); tm++; api.sfx("pluck");
    const cave = p => api.tr(`из ${"первой второй третьей четвёртой".split(" ")[p]} пещеры`, `from the ${"first second third fourth".split(" ")[p]} cave`, `${"ပထမ ဒုတိယ တတိယ စတုတ္ထ".split(" ")[p]} ဂူက`);
    if (piles.every(v => !v)) {
      gi++; api.sfx("gong");
      if (gi >= GAMES.length) { msg = ""; draw(); el.dataset.done = 1; setTimeout(() => api.done({ good: losses === 0 }), 900); return; }
      deal(); msg = `<p class="note good">${api.tr("Последнее сокровище ваше! Серебряный Рог требует реванша.", "The last treasure is yours! Silver Horn demands a rematch.", "နောက်ဆုံး ရတနာက ကိုယ့်ဟာ! ငွေဦးချိုက ပြန်ပြိုင်ချင်တယ်။")}</p>`;
      return draw();
    }
    const m = aiMove(); piles[m.p] -= m.n; taken[m.p] = (taken[m.p] || []).concat(Array(m.n).fill(1));
    msg = `<p class="note">${api.tr(`Серебряный Рог берёт ${m.n} ${cave(m.p)}.`, `Silver Horn takes ${m.n} ${cave(m.p)}.`, `ငွေဦးချိုက ${cave(m.p)} ${my(m.n)} ခု ယူတယ်။`)}</p>`;
    if (piles.every(v => !v)) {
      losses++; api.mistake(); api.sfx("fail"); deal();
      msg = `<p class="note bad">${api.tr("Последнее сокровище взял Серебряный Рог. Он зовёт вас по имени, и вы отзываетесь… Тыква втягивает вас! Укун выручает, начинаем поединок заново.", "Silver Horn took the last treasure. He calls your name, you answer… and the gourd sucks you in! Wukong gets you out; the contest starts again.", "နောက်ဆုံး ရတနာကို ငွေဦးချို ယူသွားပြီ။ သူက နာမည်ခေါ်တော့ ထူးမိတယ်… ဘူးသီးက စုပ်ယူသွားတယ်! ဝူခုန်းက ကယ်ထုတ်တယ်၊ ပြိုင်ပွဲ ပြန်စမယ်။")}</p>`;
    }
    draw();
  });
  deal(); draw();
}

// ═════ The Bottomless Pit: the mouse spirit's tunnels are full of pitfalls; numbers tell how many lie around
export function pitPuzzle(el, api) {
  const R = api.rnd, w = 9, h = 9, M = 12, NN = w * h;
  const nb = c => { const x = c % w, y = c / w | 0, o = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < w && Y < h) o.push(Y * w + X); } return o; };
  let mine, num, open, flag, boom, mistakes = 0, flagMode = false;
  const flood = (c, op) => { const q = [c]; while (q.length) { const k = q.pop(); if (op[k]) continue; op[k] = true; if (!num[k]) nb(k).forEach(j => !op[j] && !mine[j] && q.push(j)); } };
  const solvable = start => { // can it be cleared by pure deduction from the starting opening?
    const op = Array(NN).fill(false), mk = Array(NN).fill(false); flood(start, op);
    for (let changed = true; changed;) {
      changed = false;
      const cons = [];
      for (let c = 0; c < NN; c++) { if (!op[c] || !num[c]) continue; const u = nb(c).filter(j => !op[j] && !mk[j]); if (!u.length) continue; cons.push({ u, k: num[c] - nb(c).filter(j => mk[j]).length }); }
      for (const { u, k } of cons) { if (k === 0) { u.forEach(j => { if (!op[j]) { flood(j, op); changed = true; } }); } else if (k === u.length) { u.forEach(j => { if (!mk[j]) { mk[j] = true; changed = true; } }); } }
      if (changed) continue;
      for (const A of cons) for (const B of cons) { // subset rule
        if (A === B || A.u.length >= B.u.length || !A.u.every(j => B.u.includes(j))) continue;
        const rest = B.u.filter(j => !A.u.includes(j)), k = B.k - A.k;
        if (k === 0) rest.forEach(j => { if (!op[j]) { flood(j, op); changed = true; } });
        else if (k === rest.length) rest.forEach(j => { if (!mk[j]) { mk[j] = true; changed = true; } });
      }
    }
    return op.filter(Boolean).length === NN - M;
  };
  for (; ;) {
    const start = rint(R, NN), safe = new Set([start, ...nb(start)]);
    mine = Array(NN).fill(false); shuf(R, [...Array(NN).keys()].filter(c => !safe.has(c))).slice(0, M).forEach(c => mine[c] = true);
    num = Array.from({ length: NN }, (_, c) => nb(c).filter(j => mine[j]).length);
    if (!solvable(start)) continue;
    open = Array(NN).fill(false); flag = Array(NN).fill(false); boom = Array(NN).fill(false); flood(start, open); break;
  }
  el._t = { mine, w };
  const owner = c => (c % w) < 5 ? 0 : 1; // in a game for two: the left tunnels are the first player's, the right ones the second's
  const left = () => NN - M - open.filter(Boolean).length;
  const TRAP = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#1b1a17"/><path d="M8 20h24M20 8v24M11 11l18 18M29 11L11 29" stroke="#8a867a" stroke-width="2"/><circle cx="20" cy="20" r="5" fill="#c23a2b"/></svg>`;
  const draw = () => {
    el.innerHTML = `<div class="pit" style="--w:${w}">${Array.from({ length: NN }, (_, c) => `<button class="pcell ${open[c] ? "op n" + num[c] : ""} ${boom[c] ? "boom" : ""} ${flag[c] && !open[c] ? "fl" : ""}${own(api, owner(c))}" data-c="${c}">${boom[c] ? TRAP : open[c] ? (num[c] ? api.tr(num[c], num[c], my(num[c])) : "") : flag[c] ? "🚩" : ""}</button>`).join("")}</div>
      <div class="row"><div class="seg"><button class="${flagMode ? "" : "on"}" data-m="0">⛏ ${api.tr("Копать", "Dig", "တူးမယ်")}</button><button class="${flagMode ? "on" : ""}" data-m="1">🚩 ${api.tr("Отметить ловушку", "Mark a trap", "ထောင်ချောက် မှတ်မယ်")}</button></div></div>
      <p class="dim center">${api.tr("Ловушек", "Traps", "ထောင်ချောက်")}: <b>${M}</b> · ${api.tr("Отмечено", "Marked", "မှတ်ပြီး")}: <b>${flag.filter((f, c) => f && !open[c]).length + boom.filter(Boolean).length}</b> · ${api.tr("Осталось открыть", "Left to open", "ဖွင့်ရန် ကျန်")}: <b>${left()}</b></p>`;
    el.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { flagMode = !!+b.dataset.m; draw(); });
    el.querySelectorAll(".pcell").forEach(b => {
      const c = +b.dataset.c; let lp = null, longed = false;
      const go = f => { if (el.dataset.done || open[c] || boom[c]) return; if (!api.mine(owner(c))) return api.nope(); api.act({ k: f ? "flag" : "open", c }); };
      b.onpointerdown = () => { longed = false; lp = setTimeout(() => { longed = true; go(true); }, 450); };
      b.onpointerup = b.onpointerleave = () => clearTimeout(lp);
      b.onclick = () => { if (!longed) go(flagMode); };
      b.oncontextmenu = e => { e.preventDefault(); clearTimeout(lp); if (!longed) go(true); longed = true; };
    });
  };
  api.on(a => {
    if (el.dataset.done) return; const c = a.c;
    if (a.k === "flag") { if (!open[c] && !boom[c]) { flag[c] = !flag[c]; api.sfx("wood"); } }
    else if (a.k === "open") {
      if (open[c] || flag[c] || boom[c]) return;
      if (mine[c]) { boom[c] = true; mistakes++; api.mistake(); api.sfx("fail"); el.classList.add("quake"); setTimeout(() => el.classList.remove("quake"), 500); }
      else { flood(c, open); api.sfx("pluck"); }
    }
    draw();
    if (!left()) { el.dataset.done = 1; el.querySelector(".pit").classList.add("solved"); setTimeout(() => api.done({ good: mistakes === 0 }), 900); }
  });
  draw();
}
