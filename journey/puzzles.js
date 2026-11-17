// 81 Trials: the puzzle engines. Every change of a puzzle goes through api.act(action), which in a solo game is applied
// at once and in a game for two travels through the shared room, so both screens replay the same actions in the same order.
// Puzzles draw their randomness only from api.rnd (seeded per run) and only while mounting or inside an action handler.
// api: { tr, sfx, rnd, coop, me, act(a), on(fn), mine(owner), nope(), who(w), status(html), mistake(), done(stats) }
export const rint = (R, n) => R() * n | 0;
export const shuf = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rint(R, i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const my = n => String(n).replace(/\d/g, d => "၀၁၂၃၄၅၆၇၈၉"[d]); // Burmese digits
const own = (api, w) => api.coop ? ` own${w} ${w === api.me ? "mine" : "theirs"}` : "";

// ═════ 1. Five Elements Mountain: rotate the talisman pieces into one connected network
const N = 1, E = 2, S = 4, W = 8, DIRS = [[N, 0, -1, S], [E, 1, 0, W], [S, 0, 1, N], [W, -1, 0, E]];
const rot = m => ((m << 1) & 15) | (m >> 3);
export function sealPuzzle(el, api) {
  const R = api.rnd, n = 5, c0 = 2 * n + 2;
  let mask, cur, par;
  do {
    mask = Array(n * n).fill(0); const seen = new Set([c0]), stack = [c0];
    while (stack.length) { // random depth-first spanning tree from the centre
      const c = stack[stack.length - 1], x = c % n, y = c / n | 0;
      const nb = shuf(R, DIRS).filter(([, dx, dy]) => { const X = x + dx, Y = y + dy; return X >= 0 && Y >= 0 && X < n && Y < n && !seen.has(Y * n + X); });
      if (!nb.length) { stack.pop(); continue; }
      const [b, dx, dy, ob] = nb[0], d = (y + dy) * n + x + dx; mask[c] |= b; mask[d] |= ob; seen.add(d); stack.push(d);
    }
    cur = mask.map(m => { let r = m; for (let k = rint(R, 4); k--;) r = rot(r); return r; });
    par = 0; cur.forEach((m, i) => { let r = m, k = 0; while (r !== mask[i] && k < 4) { r = rot(r); k++; } par += k; });
  } while (par < 8);
  const turns = cur.map((m, c) => { let k = 0, r = mask[c]; while (r !== m && k < 4) { r = rot(r); k++; } return k; });
  const owner = c => ((c % n) + (c / n | 0)) % 2;
  let moves = 0; el._t = { mask, cur, n, owner };
  const lit = () => { // tiles connected to the centre seal
    const on = new Set([c0]), q = [c0];
    while (q.length) { const c = q.pop(), x = c % n, y = c / n | 0; for (const [b, dx, dy, ob] of DIRS) { const X = x + dx, Y = y + dy, d = Y * n + X; if (cur[c] & b && X >= 0 && Y >= 0 && X < n && Y < n && cur[d] & ob && !on.has(d)) { on.add(d); q.push(d); } } }
    return on;
  };
  const solved = () => { for (let c = 0; c < n * n; c++) { const x = c % n, y = c / n | 0; for (const [b, dx, dy, ob] of DIRS) { const X = x + dx, Y = y + dy, inside = X >= 0 && Y >= 0 && X < n && Y < n; if (!!(cur[c] & b) !== (inside && !!(cur[Y * n + X] & ob))) return false; } } return lit().size === n * n; };
  const tile = (m, c) => {
    const ends = [N, E, S, W].filter(b => m & b), deg = ends.length;
    const ln = { [N]: "M50 50V0", [E]: "M50 50H100", [S]: "M50 50V100", [W]: "M50 50H0" };
    return `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="6" class="tbg"/>${ends.map(b => `<path d="${ln[b]}" class="ln"/>`).join("")}
      ${c === c0 ? "" : deg === 1 ? `<circle cx="50" cy="50" r="13" class="end"/>` : `<circle cx="50" cy="50" r="7" class="dot"/>`}</svg>`;
  };
  // each tile is drawn in its solved shape and turned by CSS, so a rotation is a pure CSS turn
  el.innerHTML = `<div class="net" style="--n:${n}">${cur.map((m, c) => `<button class="nt${own(api, owner(c))}" data-c="${c}" aria-label="tile"><div class="ntr" style="transform:rotate(${turns[c] * 90}deg)">${tile(mask[c], c)}</div>${c === c0 ? `<span class="srcov">封</span>` : ""}</button>`).join("")}</div>`;
  const paint = () => { const on = lit(); el.querySelectorAll(".nt").forEach((b, c) => b.classList.toggle("lit", on.has(c))); api.status(`${api.tr("Поворотов", "Turns", "လှည့်ခဲ့တာ")}: <b>${moves}</b>`); };
  paint();
  el.querySelector(".net").onclick = e => {
    const b = e.target.closest(".nt"); if (!b || el.dataset.done) return;
    const c = +b.dataset.c; if (!api.mine(owner(c))) return api.nope();
    api.act({ k: "rot", c });
  };
  api.on(a => {
    if (a.k !== "rot" || el.dataset.done) return;
    const c = a.c; cur[c] = rot(cur[c]); turns[c]++; moves++;
    el.querySelector(`.nt[data-c="${c}"] .ntr`).style.transform = `rotate(${turns[c] * 90}deg)`; api.sfx("wood");
    paint();
    if (solved()) { el.dataset.done = 1; el.querySelector(".net").classList.add("solved"); setTimeout(() => api.done({ good: moves <= par + 6, moves, par }), 900); }
  });
}

// ═════ 2. Ginseng fruit: find the fake with a balance; a sly garden spirit always picks the worst case for you
const FRUIT = (k, cls = "") => `<svg class="fruit ${cls}" viewBox="0 0 60 70"><path d="M30 10c-4-8 6-12 10-6" stroke="#4d7030" stroke-width="3" fill="none"/><path d="M33 8c8-6 18-2 18 4-8 4-14 2-18-4z" fill="#7aa04a"/><ellipse cx="30" cy="40" rx="22" ry="26" fill="#f2e3c2" stroke="#1b1a17" stroke-width="2.5"/><circle cx="23" cy="38" r="2.4" fill="#1b1a17"/><circle cx="37" cy="38" r="2.4" fill="#1b1a17"/><path d="M25 48q5 4 10 0" stroke="#1b1a17" stroke-width="2" fill="none"/><ellipse cx="20" cy="45" rx="4" ry="2.5" fill="#e8a0a0" opacity=".6"/><ellipse cx="40" cy="45" rx="4" ry="2.5" fill="#e8a0a0" opacity=".6"/><text x="30" y="64" text-anchor="middle" font-size="11" font-weight="700" fill="#7a5a2a" font-family="serif">${k}</text></svg>`;
export function weighPuzzle(el, api) {
  const R = api.rnd, STAGES = [{ n: 9, w: 2, any: false }, { n: 12, w: 3, any: true }];
  let si = 0, mistakes = 0, st, cand, pos, hist, left, tilt, msg = "", accuse = false, dirFor = -1;
  const start = (note = "") => {
    st = STAGES[si];
    cand = st.any ? Array.from({ length: st.n }, (_, i) => [[i, -1], [i, 1]]).flat() : Array.from({ length: st.n }, (_, i) => [i, -1]);
    pos = Array(st.n).fill(0); // 0 table, 1 left pan, 2 right pan
    hist = []; left = st.w; tilt = 0; msg = note; accuse = false; dirFor = -1;
    el._t = { get cand() { return cand; }, stage: si, n: st.n, any: st.any };
  };
  const pan = p => pos.map((v, i) => v === p ? i : -1).filter(i => i >= 0);
  const draw = () => {
    const co = api.coop;
    el.innerHTML = `<div class="weigh">
      ${msg}
      <p class="stagecap">${api.tr(`Сад ${si + 1} из 2: ${st.n} плодов, ${st.any ? "подделка легче или тяжелее" : "подделка легче"}, взвешиваний: ${st.w}`, `Garden ${si + 1} of 2: ${st.n} fruits, the fake is ${st.any ? "lighter or heavier" : "lighter"}, weighings: ${st.w}`, `ဥယျာဉ် ${my(si + 1)} / ၂: အသီး ${my(st.n)} လုံး၊ အတုက ${st.any ? "ပိုပေါ့ချင် ပေါ့မယ်၊ ပိုလေးချင် လေးမယ်" : "ပိုပေါ့တယ်"}၊ ချိန်ခွင့်: ${my(st.w)} ကြိမ်`)}</p>
      <svg class="balance" viewBox="0 0 400 210"><path d="M200 200V60" stroke="#5a3a1a" stroke-width="10"/><path d="M150 205h100" stroke="#5a3a1a" stroke-width="12" stroke-linecap="round"/>
        <g class="beam" style="transform:rotate(${tilt}deg)"><path d="M50 60h300" stroke="#8a5a2b" stroke-width="8" stroke-linecap="round"/><circle cx="200" cy="60" r="10" fill="#c9a24a" stroke="#1b1a17" stroke-width="3"/>
          <g class="pan" style="transform:rotate(${-tilt}deg);transform-origin:60px 60px"><path d="M60 60l-40 70M60 60l40 70" stroke="#5a3a1a" stroke-width="2"/><path d="M10 130h100q-10 22-50 22t-50-22z" fill="${co ? "var(--p0)" : "#c9a24a"}" stroke="#1b1a17" stroke-width="3"/></g>
          <g class="pan" style="transform:rotate(${-tilt}deg);transform-origin:340px 60px"><path d="M340 60l-40 70M340 60l40 70" stroke="#5a3a1a" stroke-width="2"/><path d="M290 130h100q-10 22-50 22t-50-22z" fill="${co ? "var(--p1)" : "#c9a24a"}" stroke="#1b1a17" stroke-width="3"/></g></g></svg>
      <div class="pans"><div class="panL${own(api, 0)}">${pan(1).map(i => `<button class="fr" data-i="${i}">${FRUIT(i + 1, "sm")}</button>`).join("") || `<span class="dim">${co ? api.who(0) : api.tr("левая чаша", "left pan", "ဘယ်ဘက် ခွက်")}</span>`}</div><div class="panR${own(api, 1)}">${pan(2).map(i => `<button class="fr" data-i="${i}">${FRUIT(i + 1, "sm")}</button>`).join("") || `<span class="dim">${co ? api.who(1) : api.tr("правая чаша", "right pan", "ညာဘက် ခွက်")}</span>`}</div></div>
      ${dirFor >= 0 ? `<div class="row dir"><b>№${dirFor + 1}:</b><button class="btn" data-d="-1">${api.tr("легче", "lighter", "ပိုပေါ့")}</button><button class="btn" data-d="1">${api.tr("тяжелее", "heavier", "ပိုလေး")}</button></div>` : ""}
      <div class="table">${pan(0).map(i => `<button class="fr" data-i="${i}">${FRUIT(i + 1)}</button>`).join("")}</div>
      <div class="row"><button class="btn primary" id="wg" ${left && !accuse && (pan(1).length || pan(2).length) ? "" : "disabled"}>⚖ ${api.tr("Взвесить", "Weigh", "ချိန်မယ်")} (${left})</button>
        <button class="btn ${accuse ? "on" : ""}" id="acc">☝ ${accuse ? api.tr("Отмена", "Cancel", "မလုပ်တော့ဘူး") : api.tr("Назвать подделку", "Name the fake", "အတုကို ညွှန်ပြမယ်")}</button></div>
      ${accuse ? `<p class="note">${api.tr("Нажмите на плод, который считаете подделкой.", "Tap the fruit you think is fake.", "အတုလို့ ထင်တဲ့ အသီးကို နှိပ်ပါ။")}</p>`
        : `<p class="dim small">${co ? api.tr("Нажмите на плод на столе, чтобы положить его на свою чашу, и на плод в своей чаше, чтобы вернуть его на стол. Чужую чашу заполняет спутник.", "Tap a fruit on the table to put it on your pan, and a fruit on your pan to take it back. Your partner fills the other pan.", "စားပွဲပေါ်က အသီးကို နှိပ်ရင် ကိုယ့်ခွက်ပေါ် ရောက်မယ်၊ ကိုယ့်ခွက်ထဲက အသီးကို နှိပ်ရင် စားပွဲပေါ် ပြန်ရောက်မယ်။ တစ်ဖက်ခွက်ကို အဖော်က ဖြည့်တယ်။")
          : api.tr("Нажимайте на плод: стол → левая чаша → правая чаша → стол.", "Tap a fruit: table → left pan → right pan → table.", "အသီးကို နှိပ်ပါ: စားပွဲ → ဘယ်ခွက် → ညာခွက် → စားပွဲ။")}</p>`}
      <ol class="hist">${hist.map(h => `<li>${h}</li>`).join("")}</ol></div>`;
    el.querySelectorAll(".fr").forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (accuse) { if (st.any) { dirFor = i; draw(); } else api.act({ k: "acc", i, d: -1 }); return; }
      let to;
      if (!co) to = (pos[i] + 1) % 3;
      else { const p = 1 + api.me; if (pos[i] === 0) to = p; else if (pos[i] === p) to = 0; else return api.nope(); }
      api.act({ k: "mv", i, to });
    });
    el.querySelectorAll("[data-d]").forEach(b => b.onclick = () => api.act({ k: "acc", i: dirFor, d: +b.dataset.d }));
    el.querySelector("#wg").onclick = () => api.act({ k: "wg" });
    el.querySelector("#acc").onclick = () => { accuse = !accuse; dirFor = -1; draw(); };
  };
  const weigh = () => {
    const Lp = pan(1), Rp = pan(2); if (!left || !(Lp.length || Rp.length)) return;
    left--; let out;
    if (Lp.length !== Rp.length) out = Math.sign(Lp.length - Rp.length);
    else {
      const res = c => { const [i, d] = c; return Lp.includes(i) ? d : Rp.includes(i) ? -d : 0; }; // +1: left heavier
      const groups = {}; cand.forEach(c => (groups[res(c)] = groups[res(c)] || []).push(c));
      const keys = Object.keys(groups), max = Math.max(...keys.map(k => groups[k].length));
      out = +shuf(R, keys.filter(k => groups[k].length === max))[0]; cand = groups[out];
    }
    tilt = out * -10; api.sfx("wood");
    const word = out > 0 ? api.tr("левая тяжелее", "left is heavier", "ဘယ်ဘက် ပိုလေးတယ်") : out < 0 ? api.tr("правая тяжелее", "right is heavier", "ညာဘက် ပိုလေးတယ်") : api.tr("равновесие", "balance", "ညီမျှတယ်");
    hist.push(`[${Lp.map(i => i + 1).join(", ")}] ⚖ [${Rp.map(i => i + 1).join(", ")}] → <b>${word}</b>`);
  };
  const judge = (i, d) => {
    accuse = false; dirFor = -1;
    const ok = cand.length === 1 && cand[0][0] === i && cand[0][1] === d;
    if (ok) {
      api.sfx("bell"); si++;
      if (si < STAGES.length) start(`<p class="note good">${api.tr("Верно! Подделка найдена. Теперь второй сад.", "Right! The fake is found. Now the second garden.", "မှန်တယ်! အတုကို တွေ့ပြီ။ အခု ဒုတိယ ဥယျာဉ်။")}</p>`);
      else { el.dataset.done = 1; api.done({ good: mistakes === 0 }); }
      return;
    }
    const real = cand.find(c => !(c[0] === i && c[1] === d)) || cand[0];
    mistakes++; api.mistake(); api.sfx("fail");
    start(`<p class="note bad">${api.tr(`Дух сада смеётся: подделкой был №${real[0] + 1}${st.any ? (real[1] > 0 ? " (тяжелее)" : " (легче)") : ""}. Плоды перемешаны, попробуйте снова.`, `The garden spirit laughs: the fake was №${real[0] + 1}${st.any ? (real[1] > 0 ? " (heavier)" : " (lighter)") : ""}. The fruits are mixed again; try once more.`, `ဥယျာဉ်စောင့်နတ် ရယ်နေတယ်: အတုက အမှတ် ${my(real[0] + 1)}${st.any ? (real[1] > 0 ? " (ပိုလေး)" : " (ပိုပေါ့)") : ""}။ အသီးတွေကို ပြန်ရောလိုက်ပြီ၊ ထပ်ကြိုးစားပါ။`)}</p>`);
  };
  api.on(a => {
    if (el.dataset.done) return;
    if (a.k === "mv") { pos[a.i] = a.to; msg = ""; api.sfx("wood"); }
    else if (a.k === "wg") { msg = ""; weigh(); }
    else if (a.k === "acc") judge(a.i, a.d);
    if (!el.dataset.done) draw();
  });
  start(); draw();
}

// ═════ 3. White Bone Demon: demons always lie, people always tell the truth
const KK_NAMES = [["Ли-дровосек", "Li the woodcutter", "သစ်ခုတ်သမား လီ"], ["Ван-рыбак", "Wang the fisherman", "တံငါ ဝမ်"], ["Чжан-торговка", "Zhang the trader", "ကုန်သည်မ ကျန်း"], ["Лю-пастух", "Liu the herdsman", "နွားကျောင်းသား လျူ"], ["Чэнь-гончар", "Chen the potter", "အိုးထိန်းသည် ချန်"], ["Ян-ткачиха", "Yang the weaver", "ယက်ကန်းသည်မ ယန်"], ["Хуан-лекарь", "Huang the healer", "ဆေးဆရာ ဟွမ်"], ["Чжао-сборщица чая", "Zhao the tea picker", "လက်ဖက်ခူးသူ ကျောက်"]];
const evalS = (s, D) => s.t === "demon" ? D[s.a] : s.t === "human" ? !D[s.a] : s.t === "same" ? D[s.a] === D[s.b] : s.t === "diff" ? D[s.a] !== D[s.b] : (D[s.a] || D[s.b]);
function genKK(R, n, d) {
  const K = [];
  for (let a = 0; a < n; a++) { K.push({ t: "demon", a }, { t: "human", a }); for (let b = a + 1; b < n; b++) K.push({ t: "same", a, b }, { t: "diff", a, b }, { t: "oneOf", a, b }); }
  for (let tries = 0; tries < 50000; tries++) {
    const st = Array.from({ length: n }, (_, i) => { let s; do s = K[rint(R, K.length)]; while ((s.t === "demon" || s.t === "human") && s.a === i); return s; });
    if (new Set(st.map(s => s.t)).size < Math.min(3, n)) continue;
    const sols = [];
    for (let m = 0; m < 1 << n; m++) { const D = Array.from({ length: n }, (_, i) => !!(m >> i & 1)); if (D.filter(Boolean).length !== d) continue; if (st.every((s, i) => evalS(s, D) === !D[i])) sols.push(D); }
    if (sols.length === 1) return { st, D: sols[0] };
  }
}
const PERSON = (k, demon) => { const robes = ["#7a8a5a", "#5a6f8a", "#8a5a4a", "#6a5a7a", "#8a7a4a"], hair = ["#1b1a17", "#3a2a1a", "#555", "#1b1a17", "#2a1a10"];
  return demon ? `<svg viewBox="0 0 80 90"><path d="M10 90c2-18 12-26 30-28 18 2 28 10 30 28z" fill="#efe8da" stroke="#1b1a17" stroke-width="2"/><circle cx="40" cy="38" r="22" fill="#f4efe4" stroke="#1b1a17" stroke-width="2.5"/><ellipse cx="32" cy="36" rx="6" ry="7" fill="#1b1a17"/><ellipse cx="48" cy="36" rx="6" ry="7" fill="#1b1a17"/><path d="M38 48l2-5 2 5z" fill="#1b1a17"/><path d="M30 54h20M34 54v4M40 54v4M46 54v4" stroke="#1b1a17" stroke-width="2"/></svg>`
    : `<svg viewBox="0 0 80 90"><path d="M10 90c2-18 12-26 30-28 18 2 28 10 30 28z" fill="${robes[k % 5]}" stroke="#1b1a17" stroke-width="2"/><circle cx="40" cy="40" r="20" fill="#f0d6bc" stroke="#1b1a17" stroke-width="2.5"/><path d="M20 36c0-14 10-20 20-20s20 6 20 20c-6-6-12-8-20-8s-14 2-20 8z" fill="${hair[k % 5]}"/>${k % 2 ? `<path d="M14 26q26-22 52 0z" fill="#c9a24a" stroke="#1b1a17" stroke-width="2"/>` : `<circle cx="40" cy="16" r="6" fill="${hair[k % 5]}"/>`}<path d="M33 42h2M45 42h2" stroke="#1b1a17" stroke-width="3" stroke-linecap="round"/><path d="M35 50q5 3 10 0" stroke="#1b1a17" stroke-width="2" fill="none"/></svg>`; };
const L = (ru, en, my) => ({ ru, en, my });
export function bonesPuzzle(el, api) {
  const R = api.rnd;
  const ROUNDS = [{ n: 3, d: 1, cap: L("Первое обличье: девушка с корзинкой еды. На дороге трое, один из них — демон.", "First disguise: a girl with a basket of food. Three on the road, one is the demon.", "ပထမ အသွင်: အစားအစာခြင်း ကိုင်ထားတဲ့ မိန်းကလေး။ လမ်းပေါ်မှာ သုံးယောက်၊ တစ်ယောက်က နတ်ဆိုး။") },
    { n: 4, d: 1, cap: L("Второе обличье: старушка ищет дочь. Путников четверо, демон один.", "Second disguise: an old woman looking for her daughter. Four travellers, one demon.", "ဒုတိယ အသွင်: သမီးကို ရှာနေတဲ့ အဘွားအို။ ခရီးသွား လေးယောက်၊ နတ်ဆိုး တစ်ကောင်။") },
    { n: 5, d: 2, eyes: true, cap: L("Третье обличье: старик ищет жену и дочь. Путников пятеро, и демонов двое: Белая Кость привела подручного.", "Third disguise: an old man looking for his wife and daughter. Five travellers and two demons: the White Bone Demon brought a helper.", "တတိယ အသွင်: ဇနီးနဲ့ သမီးကို ရှာနေတဲ့ အဘိုးအို။ ခရီးသွား ငါးယောက်နဲ့ နတ်ဆိုး နှစ်ကောင်: အရိုးဖြူ နတ်ဆိုးမက အကူတစ်ကောင် ခေါ်လာတယ်။") }];
  let ri = 0, mistakes = 0, Rd, P, names, sel, seen, eyes, msg = "", eyeMode = false;
  const round = () => { Rd = ROUNDS[ri]; P = genKK(R, Rd.n, Rd.d); names = shuf(R, KK_NAMES).slice(0, Rd.n); sel = new Set(); seen = {}; eyes = Rd.eyes ? 1 : 0; msg = ""; eyeMode = false; el._t = { D: P.D }; };
  const nm = i => api.tr(names[i][0], names[i][1], names[i][2]);
  const say = (s, i) => { const X = a => a === i ? api.tr("я", "I", "ကျွန်ုပ်") : nm(a), Xc = a => a === i ? api.tr("Я", "I", "ကျွန်ုပ်") : nm(a);
    if (s.t === "demon") return api.tr(`${Xc(s.a)} — оборотень.`, `${X(s.a)} is the demon in disguise.`, `${X(s.a)} က အသွင်ယူထားတဲ့ နတ်ဆိုး။`);
    if (s.t === "human") return api.tr(`${Xc(s.a)} — обычный человек.`, `${X(s.a)} is an ordinary person.`, `${X(s.a)} က သာမန်လူ။`);
    if (s.t === "same") return api.tr(`${Xc(s.a)} и ${X(s.b)} — одного рода.`, `${X(s.a)} and ${X(s.b)} are the same kind.`, `${X(s.a)} နဲ့ ${X(s.b)} က အမျိုးတူတွေ။`);
    if (s.t === "diff") return api.tr(`${Xc(s.a)} и ${X(s.b)} — разного рода.`, `${X(s.a)} and ${X(s.b)} are different kinds.`, `${X(s.a)} နဲ့ ${X(s.b)} က အမျိုးမတူဘူး။`);
    return api.tr(`Хотя бы один из двоих — ${nm(s.a)} или ${nm(s.b)} — оборотень.`, `At least one of ${nm(s.a)} and ${nm(s.b)} is a demon.`, `${nm(s.a)} နဲ့ ${nm(s.b)} ထဲက အနည်းဆုံး တစ်ယောက်က နတ်ဆိုး။`).replace(nm(i), api.tr("я", "me", "ကျွန်ုပ်"));
  };
  // in a game for two each hears only the travellers standing on their side of the road
  const hears = i => !api.coop || i % 2 === api.me;
  const shown = i => seen[i] && (seen[i].hit || !api.coop || seen[i].w === api.me);
  const draw = (hit = false) => {
    el.innerHTML = `<div class="bones ${hit ? "hit" : ""}"><p class="stagecap">${api.tr(`Обличье ${ri + 1} из 3`, `Disguise ${ri + 1} of 3`, `အသွင် ${my(ri + 1)} / ၃`)}</p><p>${api.tr(Rd.cap.ru, Rd.cap.en, Rd.cap.my)}</p>
      <div class="people">${P.st.map((s, i) => `<button class="person ${sel.has(i) ? "sel" : ""} ${shown(i) ? (seen[i].v ? "isdemon" : "ishuman") : ""}${api.coop ? ` side${i % 2}` : ""}" data-i="${i}">
        <div class="pf">${PERSON(i, shown(i) && seen[i].v)}</div><b>${nm(i)}</b>${hears(i) ? `<q>${say(s, i)}</q>` : `<q class="whisper">🤫 ${api.tr(`Говорит так, что слышит только ${api.who(1 - api.me)}`, `Speaks so that only ${api.who(1 - api.me)} can hear`, `${api.who(1 - api.me)} ပဲ ကြားအောင် ပြောတယ်`)}</q>`}
        ${shown(i) ? `<em>${seen[i].v ? api.tr("оборотень!", "a demon!", "နတ်ဆိုး!") : api.tr("человек", "human", "လူ")}</em>` : seen[i] ? `<em class="dim">👁 ${api.tr("смотрел спутник", "your partner looked", "အဖော် ကြည့်ပြီး")}</em>` : ""}</button>`).join("")}</div>
      <div class="row"><button class="btn primary" id="strike" ${sel.size === Rd.d ? "" : "disabled"}>🔱 ${api.tr("Ударить посохом", "Strike with the staff", "တောင်ဝှေးနဲ့ ရိုက်မယ်")} (${sel.size}/${Rd.d})</button>
      ${eyes ? `<button class="btn ${eyeMode ? "on" : ""}" id="eyes">👁 ${api.tr("Огненные глаза (1 раз)", "Fiery eyes (once)", "မီးမျက်လုံး (တစ်ကြိမ်)")}</button>` : ""}</div>
      ${eyeMode ? `<p class="note">${api.tr("Нажмите на путника, чтобы увидеть его истинную суть.", "Tap a traveller to see their true nature.", "ခရီးသွားကို နှိပ်ပြီး သူ့ရဲ့ အစစ်အမှန်ကို ကြည့်ပါ။")}${api.coop ? " " + api.tr("Увидите только вы.", "Only you will see it.", "ကိုယ်တိုင်ပဲ မြင်ရမယ်။") : ""}</p>` : ""}${msg ? `<p class="note bad">${msg}</p>` : ""}</div>`;
    el.querySelectorAll(".person").forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (eyeMode) { eyeMode = false; return api.act({ k: "eye", i }); }
      api.act({ k: "sel", i });
    });
    el.querySelector("#eyes")?.addEventListener("click", () => { eyeMode = !eyeMode; draw(); });
    el.querySelector("#strike").onclick = () => api.act({ k: "strike" });
  };
  api.on((a, w) => {
    if (el.dataset.done) return;
    if (a.k === "sel") { sel.has(a.i) ? sel.delete(a.i) : sel.size < Rd.d && sel.add(a.i); api.sfx("wood"); msg = ""; return draw(); }
    if (a.k === "eye") { if (!eyes) return; eyes = 0; seen[a.i] = { v: P.D[a.i], w }; api.sfx("bell"); return draw(); }
    if (a.k === "strike") {
      if (sel.size !== Rd.d) return;
      if ([...sel].every(i => P.D[i])) {
        api.sfx("gong"); [...sel].forEach(i => seen[i] = { v: true, hit: true }); draw(true);
        ri++;
        if (ri < ROUNDS.length) { round(); setTimeout(() => { if (!el.dataset.done && el.isConnected) draw(); }, 1600); }
        else { el.dataset.done = 1; setTimeout(() => api.done({ good: mistakes === 0 }), 1200); }
        return;
      }
      mistakes++; api.mistake(); api.sfx("chant"); document.body.classList.add("headache"); setTimeout(() => document.body.classList.remove("headache"), 900);
      sel.clear(); msg = api.tr("Вы ударили человека! Наставник читает заклинание, обруч сжимается. Подумайте ещё.", "You struck a human! The master recites the spell and the headband tightens. Think again.", "လူကို ရိုက်မိသွားပြီ! ဆရာက မန္တန်ရွတ်လို့ ခေါင်းစွပ်ကွင်း တင်းလာတယ်။ ထပ်စဉ်းစားပါ။");
      draw();
    }
  });
  round(); draw();
}

// ═════ 4. Tongtian River: three monks, three river demons, a raft for two
const TOK = { m0: "tang", m1: "bajie", m2: "sha" };
export const MON = { tang: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#c8322b" stroke="#1b1a17" stroke-width="2"/><circle cx="30" cy="30" r="16" fill="#f3dcc4" stroke="#1b1a17" stroke-width="2"/><path d="M16 20l4-12 6 8 4-10 4 10 6-8 4 12z" fill="#e6c25a" stroke="#1b1a17" stroke-width="1.5"/><path d="M24 32h4M33 32h4" stroke="#1b1a17" stroke-width="2"/></svg>`,
  bajie: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#2b2b33" stroke="#1b1a17" stroke-width="2"/><circle cx="30" cy="30" r="17" fill="#f2b6a6" stroke="#1b1a17" stroke-width="2"/><path d="M14 20c-8 2-8 14-4 18M46 20c8 2 8 14 4 18" fill="#e79d8c" stroke="#1b1a17" stroke-width="2"/><ellipse cx="30" cy="36" rx="9" ry="6" fill="#f6c8ba" stroke="#1b1a17" stroke-width="1.5"/><circle cx="27" cy="36" r="1.6"/><circle cx="33" cy="36" r="1.6"/><circle cx="23" cy="26" r="2"/><circle cx="37" cy="26" r="2"/></svg>`,
  sha: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#6b4a2b" stroke="#1b1a17" stroke-width="2"/><circle cx="30" cy="30" r="16" fill="#6f8aa0" stroke="#1b1a17" stroke-width="2"/><path d="M15 34c2 12 8 16 15 16s13-4 15-16c-4 6-8 8-15 8s-11-2-15-8z" fill="#b8352b"/><circle cx="25" cy="28" r="2"/><circle cx="35" cy="28" r="2"/></svg>`,
  wukong: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#e2a93b" stroke="#1b1a17" stroke-width="2"/><circle cx="12" cy="30" r="5" fill="#c98a3a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="48" cy="30" r="5" fill="#c98a3a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="30" cy="30" r="17" fill="#c98a3a" stroke="#1b1a17" stroke-width="2"/><path d="M19 30c0-8 5-12 11-12s11 4 11 12c0 9-5 14-11 14s-11-5-11-14z" fill="#f1c9a5"/><path d="M20 28c3-5 7-6 10-3 3-3 7-2 10 3-1 6-5 9-10 11-5-2-9-5-10-11z" fill="#c8322b"/><circle cx="26" cy="29" r="2.2" fill="#fff" stroke="#1b1a17"/><circle cx="34" cy="29" r="2.2" fill="#fff" stroke="#1b1a17"/><path d="M14 20c6-5 26-5 32 0" stroke="#e6c25a" stroke-width="3.5" fill="none"/></svg>`,
  demon: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#3f6f5a" stroke="#1b1a17" stroke-width="2"/><path d="M14 30c0-14 8-20 16-20s16 6 16 20-6 18-16 18-16-4-16-18z" fill="#6fae8a" stroke="#1b1a17" stroke-width="2"/><path d="M14 18l-6-10 12 6M46 18l6-10-12 6" fill="#c9a24a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="24" cy="28" r="4" fill="#f2e04a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="36" cy="28" r="4" fill="#f2e04a" stroke="#1b1a17" stroke-width="1.5"/><path d="M22 40l4 3 4-3 4 3 4-3" stroke="#1b1a17" stroke-width="1.5" fill="none"/></svg>` };
export function riverPuzzle(el, api) {
  const ids = ["m0", "m1", "m2", "d0", "d1", "d2"];
  let side = {}, raft = [], at = 0, moves = 0, fails = 0, msg = "";
  const reset = () => { ids.forEach(i => side[i] = 0); raft = []; at = 0; moves = 0; };
  reset();
  const isM = i => i[0] === "m";
  const unsafe = () => { for (const b of [0, 1]) { const here = ids.filter(i => side[i] === b && !raft.includes(i)).concat(at === b ? raft : []); const m = here.filter(isM).length, d = here.length - m; if (m > 0 && d > m) return b; } return -1; };
  // in a game for two each looks after one bank: whoever's bank the raft is moored at loads it and pushes off
  const ctrl = () => api.mine(at);
  const tok = i => `<button class="tok ${raft.includes(i) ? "onraft" : ""}" data-i="${i}">${isM(i) ? MON[TOK[i]] : MON.demon}</button>`;
  const draw = () => {
    const bank = b => ids.filter(i => side[i] === b && !raft.includes(i)).map(tok).join("");
    el.innerHTML = `<div class="river"><div class="bank left${own(api, 0)}">${bank(0)}${api.coop ? `<span class="bankname">${api.who(0)}</span>` : ""}</div><div class="water"><div class="raft ${at ? "r" : "l"}">${raft.map(tok).join("")}<i class="logs"></i></div></div><div class="bank right${own(api, 1)}">${bank(1)}${api.coop ? `<span class="bankname">${api.who(1)}</span>` : ""}</div></div>
      <div class="row"><button class="btn primary" id="go" ${raft.length && ctrl() ? "" : "disabled"}>⛵ ${api.tr("Переправиться", "Cross", "ကူးမယ်")}</button><span class="dim">${api.tr("Переправ", "Crossings", "ကူးဖြတ်မှု")}: <b>${moves}</b></span></div>
      ${api.coop ? `<p class="dim small center">${ctrl() ? api.tr("Плот у вашего берега: сажайте и отправляйте.", "The raft is at your bank: load it and push off.", "ဖောင်က ကိုယ့်ကမ်းမှာ ရှိတယ်: တင်ပြီး လွှတ်ပါ။") : api.tr("Плот у берега спутника: сейчас его ход.", "The raft is at your partner's bank: it's their move.", "ဖောင်က အဖော့်ကမ်းမှာ: အခု သူ့အလှည့်။")}</p>` : ""}
      ${msg ? `<p class="note bad">${msg}</p>` : ""}`;
    el.querySelectorAll(".tok").forEach(b => b.onclick = () => {
      if (!ctrl()) return api.nope();
      const i = b.dataset.i;
      if (raft.includes(i) || (side[i] === at && raft.length < 2)) api.act({ k: "tok", i });
    });
    el.querySelector("#go").onclick = () => api.act({ k: "go" });
  };
  api.on(a => {
    if (el.dataset.done) return;
    if (a.k === "tok") {
      const i = a.i;
      if (raft.includes(i)) { raft = raft.filter(x => x !== i); side[i] = at; }
      else if (side[i] === at && raft.length < 2) raft.push(i);
      else return;
      msg = ""; api.sfx("wood"); return draw();
    }
    if (a.k === "go" && raft.length) {
      at = 1 - at; raft.forEach(i => side[i] = at); moves++; api.sfx("splash"); msg = "";
      if (unsafe() >= 0) {
        fails++; api.mistake(); api.sfx("fail"); reset();
        msg = api.tr("Демонов на берегу оказалось больше, чем монахов, и они утащили монахов под воду! Всё сначала.", "There were more demons than monks on a bank, and they dragged the monks under! Start again.", "ကမ်းတစ်ဖက်မှာ နတ်ဆိုးတွေက ဘုန်းကြီးတွေထက် များသွားလို့ ဘုန်းကြီးတွေကို ရေထဲ ဆွဲချသွားပြီ! အစက ပြန်စပါ။");
        return draw();
      }
      draw();
      if (ids.every(i => side[i] === 1)) { el.dataset.done = 1; setTimeout(() => api.done({ good: moves <= 13 && fails === 0, moves, par: 11 }), 700); }
    }
  });
  draw();
}

// ═════ 5. Flaming Mountain: each wave of the fan flips a square and its four neighbours
export function firePuzzle(el, api) {
  const R = api.rnd, n = 5; let on, par, moves = 0, presses;
  function flip(c) { const x = c % n, y = c / n | 0; [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < n && Y < n) on[Y * n + X] = !on[Y * n + X]; }); }
  do { on = Array(n * n).fill(false); presses = shuf(R, [...Array(n * n).keys()]).slice(0, 7); presses.forEach(flip); par = presses.length; } while (on.filter(Boolean).length < 9);
  const owner = c => ((c % n) + (c / n | 0)) % 2;
  el._t = { presses, owner };
  const FL = `<svg viewBox="0 0 100 100" class="fl"><path d="M50 92c-22 0-32-14-28-32 4-14 14-18 16-34 10 10 10 22 8 30 6-4 10-12 8-22 16 12 26 30 20 44-4 10-12 14-24 14z" fill="#e0532e"/><path d="M50 92c-12 0-18-8-14-18 2-8 8-10 10-18 8 10 14 18 12 26-2 6-4 10-8 10z" fill="#f2a33a"/></svg>`;
  const draw = last => {
    el.innerHTML = `<div class="fire" style="--n:${n}">${on.map((v, c) => `<button class="fc ${v ? "burn" : ""}${own(api, owner(c))} ${c === last ? "fanned" : ""}" data-c="${c}">${v ? FL : `<span class="ash"></span>`}</button>`).join("")}</div><p class="dim center">${api.tr("Взмахов", "Waves", "ယပ်ခတ်ခဲ့တာ")}: <b>${moves}</b> · ${api.tr("Огней", "Fires", "မီးတွေ")}: <b>${on.filter(Boolean).length}</b></p>`;
    el.querySelector(".fire").onclick = e => { const b = e.target.closest(".fc"); if (!b || el.dataset.done) return; const c = +b.dataset.c; if (!api.mine(owner(c))) return api.nope(); api.act({ k: "wave", c }); };
  };
  api.on(a => {
    if (a.k !== "wave" || el.dataset.done) return;
    flip(a.c); moves++; api.sfx("wind"); draw(a.c);
    if (on.every(v => !v)) { el.dataset.done = 1; el.querySelector(".fire").classList.add("solved"); setTimeout(() => api.done({ good: moves <= par + 3, moves, par }), 900); }
  });
  draw();
}

// ═════ 6. Spider Cave: drag the knots so that no two threads cross
export function webPuzzle(el, api) {
  const R = api.rnd; let pts, E, P;
  const id = (x, y) => y * 3 + x;
  const cross = (a, b, c, d) => { if (a === c || a === d || b === c || b === d) return false; const o = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)); const A = P[a], B = P[b], C = P[c], D = P[d]; return o(A, B, C) !== o(A, B, D) && o(C, D, A) !== o(C, D, B); };
  const bad = () => { const s = new Set(); for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) if (cross(...E[i], ...E[j])) { s.add(i); s.add(j); } return s; };
  do {
    pts = []; E = [];
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) pts.push({ x, y });
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { if (x < 2) E.push([id(x, y), id(x + 1, y)]); if (y < 2) E.push([id(x, y), id(x, y + 1)]); if (x < 2 && y < 2) E.push(R() < .5 ? [id(x, y), id(x + 1, y + 1)] : [id(x + 1, y), id(x, y + 1)]); }
    const order = shuf(R, [...Array(9).keys()]);
    P = pts.map((_, i) => { const k = order.indexOf(i), a = k / 9 * Math.PI * 2 - Math.PI / 2; return { x: 50 + 38 * Math.cos(a), y: 52 + 38 * Math.sin(a) }; });
  } while (bad().size === 0);
  const owner = i => i % 2;
  let moves = 0, drag = -1; el._t = { pts, owner };
  el.innerHTML = `<div class="web"><svg viewBox="0 0 100 104" id="wsvg"><path d="M50 0v8" stroke="#bbb" stroke-width=".4"/><g id="lines"></g><g id="knots"></g></svg></div><p class="dim center" id="wst"></p>`;
  const svg = el.querySelector("#wsvg");
  const paint = () => {
    const b = bad();
    svg.querySelector("#lines").innerHTML = E.map(([a, c], i) => `<line x1="${P[a].x}" y1="${P[a].y}" x2="${P[c].x}" y2="${P[c].y}" class="${b.has(i) ? "x" : "ok"}"/>`).join("");
    svg.querySelector("#knots").innerHTML = P.map((p, i) => `<g class="knot ${drag === i ? "drag" : ""}${own(api, owner(i))}" data-i="${i}" transform="translate(${p.x} ${p.y})"><circle r="4.2"/><circle r="1.6" class="in"/></g>`).join("");
    el.querySelector("#wst").innerHTML = `${api.tr("Перемещений", "Moves", "လှုပ်ရှားမှု")}: <b>${moves}</b> · ${api.tr("Пересечений", "Crossings", "ကူးဖြတ်မှု")}: <b>${b.size}</b>`;
    return b;
  };
  paint();
  const pt = e => { const r = svg.getBoundingClientRect(); return { x: Math.max(3, Math.min(97, (e.clientX - r.left) / r.width * 100)), y: Math.max(3, Math.min(101, (e.clientY - r.top) / r.height * 104)) }; };
  let from = null;
  svg.addEventListener("pointerdown", e => { const k = e.target.closest(".knot"); if (!k || el.dataset.done) return; const i = +k.dataset.i; if (!api.mine(owner(i))) return api.nope(); drag = i; from = { ...P[i] }; svg.setPointerCapture(e.pointerId); paint(); });
  svg.addEventListener("pointermove", e => { if (drag < 0) return; P[drag] = pt(e); paint(); });
  const up = () => {
    if (drag < 0) return; const i = drag, p = P[i]; drag = -1;
    P[i] = from; // the move itself arrives through the action, the same way on both screens
    api.act({ k: "mv", i, x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 });
    if (api.coop) { P[i] = p; paint(); } // show it in place while the action makes its round trip
  };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
  api.on(a => {
    if (a.k !== "mv" || el.dataset.done) return;
    P[a.i] = { x: a.x, y: a.y }; moves++; api.sfx("pluck");
    if (!paint().size) { el.dataset.done = 1; el.querySelector(".web").classList.add("solved"); setTimeout(() => api.done({ good: moves <= 14, moves }), 900); }
  });
}
