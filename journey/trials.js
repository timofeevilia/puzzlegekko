// 81 Trials: the playable trials. Each one has a story, rules, hints and a puzzle mounted into a panel.
// api: { tr, sfx, done({ good }), mistake(), status(html), moves(n) }
const rnd = n => Math.random() * n | 0;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const L = (ru, en, my) => ({ ru, en, my });
const my = n => String(n).replace(/\d/g, d => "၀၁၂၃၄၅၆၇၈၉"[d]); // Burmese digits

// ═════ 1. Five Elements Mountain: rotate the talisman pieces into one connected network
const N = 1, E = 2, S = 4, W = 8, DIRS = [[N, 0, -1, S], [E, 1, 0, W], [S, 0, 1, N], [W, -1, 0, E]];
const rot = m => ((m << 1) & 15) | (m >> 3);
function sealPuzzle(el, api) {
  const n = 5, c0 = 2 * n + 2, mask = Array(n * n).fill(0), seen = new Set([c0]), stack = [c0];
  while (stack.length) { // random depth-first spanning tree from the centre
    const c = stack[stack.length - 1], x = c % n, y = c / n | 0;
    const nb = shuffle(DIRS).filter(([, dx, dy]) => { const X = x + dx, Y = y + dy; return X >= 0 && Y >= 0 && X < n && Y < n && !seen.has(Y * n + X); });
    if (!nb.length) { stack.pop(); continue; }
    const [b, dx, dy, ob] = nb[0], d = (y + dy) * n + x + dx; mask[c] |= b; mask[d] |= ob; seen.add(d); stack.push(d);
  }
  const cur = mask.map(m => { let r = m; for (let k = rnd(4); k--;) r = rot(r); return r; });
  const turns = cur.map(() => 0);
  let par = 0; cur.forEach((m, i) => { let r = m, k = 0; while (r !== mask[i] && k < 4) { r = rot(r); k++; } par += k; });
  if (par < 8) return sealPuzzle(el, api);
  let moves = 0; el._t = { mask, cur, n };
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
  el.innerHTML = `<div class="net" style="--n:${n}">${cur.map((m, c) => `<button class="nt" data-c="${c}" aria-label="tile"><div class="ntr" style="transform:rotate(0deg)">${tile(mask[c] === m ? mask[c] : m, c)}</div></button>`).join("")}</div>`;
  // draw each tile from its solved shape, then turn it to the scrambled position, so rotation is a pure CSS turn
  el.querySelectorAll(".nt").forEach((b, c) => { let k = 0, r = mask[c]; while (r !== cur[c] && k < 4) { r = rot(r); k++; } turns[c] = k; b.querySelector(".ntr").innerHTML = tile(mask[c], c); b.querySelector(".ntr").style.transform = `rotate(${k * 90}deg)`; if (c === c0) b.insertAdjacentHTML("beforeend", `<span class="srcov">封</span>`); });
  const paint = () => { const on = lit(); el.querySelectorAll(".nt").forEach((b, c) => b.classList.toggle("lit", on.has(c))); api.status(`${api.tr("Поворотов", "Turns", "လှည့်ခဲ့တာ")}: <b>${moves}</b>`); };
  paint();
  el.querySelector(".net").onclick = e => {
    const b = e.target.closest(".nt"); if (!b || el.dataset.done) return;
    const c = +b.dataset.c; cur[c] = rot(cur[c]); turns[c]++; moves++;
    b.querySelector(".ntr").style.transform = `rotate(${turns[c] * 90}deg)`; api.sfx("wood");
    paint();
    if (solved()) { el.dataset.done = 1; el.querySelector(".net").classList.add("solved"); setTimeout(() => api.done({ good: moves <= par + 6, moves, par }), 900); }
  };
}

// ═════ 2. Ginseng fruit: find the fake with a balance; a sly garden spirit always picks the worst case for you
const FRUIT = (k, cls = "") => `<svg class="fruit ${cls}" viewBox="0 0 60 70"><path d="M30 10c-4-8 6-12 10-6" stroke="#4d7030" stroke-width="3" fill="none"/><path d="M33 8c8-6 18-2 18 4-8 4-14 2-18-4z" fill="#7aa04a"/><ellipse cx="30" cy="40" rx="22" ry="26" fill="#f2e3c2" stroke="#1b1a17" stroke-width="2.5"/><circle cx="23" cy="38" r="2.4" fill="#1b1a17"/><circle cx="37" cy="38" r="2.4" fill="#1b1a17"/><path d="M25 48q5 4 10 0" stroke="#1b1a17" stroke-width="2" fill="none"/><ellipse cx="20" cy="45" rx="4" ry="2.5" fill="#e8a0a0" opacity=".6"/><ellipse cx="40" cy="45" rx="4" ry="2.5" fill="#e8a0a0" opacity=".6"/><text x="30" y="64" text-anchor="middle" font-size="11" font-weight="700" fill="#7a5a2a" font-family="serif">${k}</text></svg>`;
function weighPuzzle(el, api) {
  const STAGES = [{ n: 9, w: 2, any: false }, { n: 12, w: 3, any: true }];
  let si = 0, mistakes = 0;
  const start = () => {
    const st = STAGES[si];
    let cand = st.any ? Array.from({ length: st.n }, (_, i) => [[i, -1], [i, 1]]).flat() : Array.from({ length: st.n }, (_, i) => [i, -1]);
    const pos = Array(st.n).fill(0); // 0 table, 1 left pan, 2 right pan
    const hist = []; let left = st.w, accuse = false, tilt = 0; el._t = { get cand() { return cand; }, stage: si, n: st.n, any: st.any };
    const draw = (msg = "") => {
      const pan = p => pos.map((v, i) => v === p ? i : -1).filter(i => i >= 0);
      el.innerHTML = `<div class="weigh">
        <p class="stagecap">${api.tr(`Сад ${si + 1} из 2: ${st.n} плодов, ${st.any ? "подделка легче или тяжелее" : "подделка легче"}, взвешиваний: ${st.w}`, `Garden ${si + 1} of 2: ${st.n} fruits, the fake is ${st.any ? "lighter or heavier" : "lighter"}, weighings: ${st.w}`, `ဥယျာဉ် ${my(si + 1)} / ၂: အသီး ${my(st.n)} လုံး၊ အတုက ${st.any ? "ပိုပေါ့ချင် ပေါ့မယ်၊ ပိုလေးချင် လေးမယ်" : "ပိုပေါ့တယ်"}၊ ချိန်ခွင့်: ${my(st.w)} ကြိမ်`)}</p>
        <svg class="balance" viewBox="0 0 400 210"><path d="M200 200V60" stroke="#5a3a1a" stroke-width="10"/><path d="M150 205h100" stroke="#5a3a1a" stroke-width="12" stroke-linecap="round"/>
          <g class="beam" style="transform:rotate(${tilt}deg)"><path d="M50 60h300" stroke="#8a5a2b" stroke-width="8" stroke-linecap="round"/><circle cx="200" cy="60" r="10" fill="#c9a24a" stroke="#1b1a17" stroke-width="3"/>
            <g class="pan" style="transform:rotate(${-tilt}deg);transform-origin:60px 60px"><path d="M60 60l-40 70M60 60l40 70" stroke="#5a3a1a" stroke-width="2"/><path d="M10 130h100q-10 22-50 22t-50-22z" fill="#c9a24a" stroke="#1b1a17" stroke-width="3"/></g>
            <g class="pan" style="transform:rotate(${-tilt}deg);transform-origin:340px 60px"><path d="M340 60l-40 70M340 60l40 70" stroke="#5a3a1a" stroke-width="2"/><path d="M290 130h100q-10 22-50 22t-50-22z" fill="#c9a24a" stroke="#1b1a17" stroke-width="3"/></g></g></svg>
        <div class="pans"><div class="panL">${pan(1).map(i => `<button class="fr" data-i="${i}">${FRUIT(i + 1, "sm")}</button>`).join("") || `<span class="dim">${api.tr("левая чаша", "left pan", "ဘယ်ဘက် ခွက်")}</span>`}</div><div class="panR">${pan(2).map(i => `<button class="fr" data-i="${i}">${FRUIT(i + 1, "sm")}</button>`).join("") || `<span class="dim">${api.tr("правая чаша", "right pan", "ညာဘက် ခွက်")}</span>`}</div></div>
        <div class="table">${pan(0).map(i => `<button class="fr" data-i="${i}">${FRUIT(i + 1)}</button>`).join("")}</div>
        <div class="row"><button class="btn primary" id="wg" ${left && !accuse && (pan(1).length || pan(2).length) ? "" : "disabled"}>⚖ ${api.tr("Взвесить", "Weigh", "ချိန်မယ်")} (${left})</button>
          <button class="btn ${accuse ? "on" : ""}" id="acc">☝ ${accuse ? api.tr("Отмена", "Cancel", "မလုပ်တော့ဘူး") : api.tr("Назвать подделку", "Name the fake", "အတုကို ညွှန်ပြမယ်")}</button></div>
        ${accuse ? `<p class="note">${api.tr("Нажмите на плод, который считаете подделкой.", "Tap the fruit you think is fake.", "အတုလို့ ထင်တဲ့ အသီးကို နှိပ်ပါ။")}</p>` : `<p class="dim small">${api.tr("Нажимайте на плод: стол → левая чаша → правая чаша → стол.", "Tap a fruit: table → left pan → right pan → table.", "အသီးကို နှိပ်ပါ: စားပွဲ → ဘယ်ခွက် → ညာခွက် → စားပွဲ။")}</p>`}
        ${msg ? `<p class="note">${msg}</p>` : ""}
        <ol class="hist">${hist.map(h => `<li>${h}</li>`).join("")}</ol></div>`;
      el.querySelectorAll(".fr").forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if (accuse) return st.any ? pickDir(i) : judge(i, -1);
        pos[i] = (pos[i] + 1) % 3; api.sfx("wood"); draw();
      });
      el.querySelector("#wg").onclick = weigh;
      el.querySelector("#acc").onclick = () => { accuse = !accuse; draw(); };
    };
    const pickDir = i => {
      el.querySelector(".table").insertAdjacentHTML("beforebegin", `<div class="row dir"><b>№${i + 1}:</b><button class="btn" data-d="-1">${api.tr("легче", "lighter", "ပိုပေါ့")}</button><button class="btn" data-d="1">${api.tr("тяжелее", "heavier", "ပိုလေး")}</button></div>`);
      el.querySelectorAll("[data-d]").forEach(b => b.onclick = () => judge(i, +b.dataset.d));
    };
    const weigh = () => {
      const Lp = pos.map((v, i) => v === 1 ? i : -1).filter(i => i >= 0), Rp = pos.map((v, i) => v === 2 ? i : -1).filter(i => i >= 0);
      left--; let out;
      if (Lp.length !== Rp.length) out = Math.sign(Lp.length - Rp.length);
      else {
        const res = c => { const [i, d] = c; return Lp.includes(i) ? d : Rp.includes(i) ? -d : 0; }; // +1: left heavier
        const groups = {}; cand.forEach(c => (groups[res(c)] = groups[res(c)] || []).push(c));
        const keys = Object.keys(groups), max = Math.max(...keys.map(k => groups[k].length));
        out = +shuffle(keys.filter(k => groups[k].length === max))[0]; cand = groups[out];
      }
      tilt = out * -10; api.sfx("wood");
      const word = out > 0 ? api.tr("левая тяжелее", "left is heavier", "ဘယ်ဘက် ပိုလေးတယ်") : out < 0 ? api.tr("правая тяжелее", "right is heavier", "ညာဘက် ပိုလေးတယ်") : api.tr("равновесие", "balance", "ညီမျှတယ်");
      hist.push(`[${Lp.map(i => i + 1).join(", ")}] ⚖ [${Rp.map(i => i + 1).join(", ")}] → <b>${word}</b>`);
      draw();
    };
    const judge = (i, d) => {
      const ok = cand.length === 1 && cand[0][0] === i && cand[0][1] === d;
      if (ok) { api.sfx("bell"); si++; if (si < STAGES.length) { start(); el.insertAdjacentHTML("afterbegin", `<p class="note good">${api.tr("Верно! Подделка найдена. Теперь второй сад.", "Right! The fake is found. Now the second garden.", "မှန်တယ်! အတုကို တွေ့ပြီ။ အခု ဒုတိယ ဥယျာဉ်။")}</p>`); } else { el.dataset.done = 1; api.done({ good: mistakes === 0 }); } return; }
      const real = cand.find(c => !(c[0] === i && c[1] === d)) || cand[0];
      mistakes++; api.mistake(); api.sfx("fail");
      draw(api.tr(`Дух сада смеётся: подделкой был №${real[0] + 1}${st.any ? (real[1] > 0 ? " (тяжелее)" : " (легче)") : ""}. Плоды перемешаны, попробуйте снова.`, `The garden spirit laughs: the fake was №${real[0] + 1}${st.any ? (real[1] > 0 ? " (heavier)" : " (lighter)") : ""}. The fruits are mixed again; try once more.`, `ဥယျာဉ်စောင့်နတ် ရယ်နေတယ်: အတုက အမှတ် ${my(real[0] + 1)}${st.any ? (real[1] > 0 ? " (ပိုလေး)" : " (ပိုပေါ့)") : ""}။ အသီးတွေကို ပြန်ရောလိုက်ပြီ၊ ထပ်ကြိုးစားပါ။`));
      setTimeout(start, 2600);
    };
    draw();
  };
  start();
}

// ═════ 3. White Bone Demon: demons always lie, people always tell the truth
const KK_NAMES = [["Ли-дровосек", "Li the woodcutter", "သစ်ခုတ်သမား လီ"], ["Ван-рыбак", "Wang the fisherman", "တံငါ ဝမ်"], ["Чжан-торговка", "Zhang the trader", "ကုန်သည်မ ကျန်း"], ["Лю-пастух", "Liu the herdsman", "နွားကျောင်းသား လျူ"], ["Чэнь-гончар", "Chen the potter", "အိုးထိန်းသည် ချန်"], ["Ян-ткачиха", "Yang the weaver", "ယက်ကန်းသည်မ ယန်"], ["Хуан-лекарь", "Huang the healer", "ဆေးဆရာ ဟွမ်"], ["Чжао-сборщица чая", "Zhao the tea picker", "လက်ဖက်ခူးသူ ကျောက်"]];
const evalS = (s, D) => s.t === "demon" ? D[s.a] : s.t === "human" ? !D[s.a] : s.t === "same" ? D[s.a] === D[s.b] : s.t === "diff" ? D[s.a] !== D[s.b] : (D[s.a] || D[s.b]);
function genKK(n, d) {
  const K = [];
  for (let a = 0; a < n; a++) { K.push({ t: "demon", a }, { t: "human", a }); for (let b = a + 1; b < n; b++) K.push({ t: "same", a, b }, { t: "diff", a, b }, { t: "oneOf", a, b }); }
  for (let tries = 0; tries < 50000; tries++) {
    const st = Array.from({ length: n }, (_, i) => { let s; do s = K[rnd(K.length)]; while ((s.t === "demon" || s.t === "human") && s.a === i); return s; });
    if (new Set(st.map(s => s.t)).size < Math.min(3, n)) continue;
    const sols = [];
    for (let m = 0; m < 1 << n; m++) { const D = Array.from({ length: n }, (_, i) => !!(m >> i & 1)); if (D.filter(Boolean).length !== d) continue; if (st.every((s, i) => evalS(s, D) === !D[i])) sols.push(D); }
    if (sols.length === 1) return { st, D: sols[0] };
  }
}
const PERSON = (k, demon) => { const robes = ["#7a8a5a", "#5a6f8a", "#8a5a4a", "#6a5a7a", "#8a7a4a"], hair = ["#1b1a17", "#3a2a1a", "#555", "#1b1a17", "#2a1a10"];
  return demon ? `<svg viewBox="0 0 80 90"><path d="M10 90c2-18 12-26 30-28 18 2 28 10 30 28z" fill="#efe8da" stroke="#1b1a17" stroke-width="2"/><circle cx="40" cy="38" r="22" fill="#f4efe4" stroke="#1b1a17" stroke-width="2.5"/><ellipse cx="32" cy="36" rx="6" ry="7" fill="#1b1a17"/><ellipse cx="48" cy="36" rx="6" ry="7" fill="#1b1a17"/><path d="M38 48l2-5 2 5z" fill="#1b1a17"/><path d="M30 54h20M34 54v4M40 54v4M46 54v4" stroke="#1b1a17" stroke-width="2"/></svg>`
    : `<svg viewBox="0 0 80 90"><path d="M10 90c2-18 12-26 30-28 18 2 28 10 30 28z" fill="${robes[k % 5]}" stroke="#1b1a17" stroke-width="2"/><circle cx="40" cy="40" r="20" fill="#f0d6bc" stroke="#1b1a17" stroke-width="2.5"/><path d="M20 36c0-14 10-20 20-20s20 6 20 20c-6-6-12-8-20-8s-14 2-20 8z" fill="${hair[k % 5]}"/>${k % 2 ? `<path d="M14 26q26-22 52 0z" fill="#c9a24a" stroke="#1b1a17" stroke-width="2"/>` : `<circle cx="40" cy="16" r="6" fill="${hair[k % 5]}"/>`}<path d="M33 42h2M45 42h2" stroke="#1b1a17" stroke-width="3" stroke-linecap="round"/><path d="M35 50q5 3 10 0" stroke="#1b1a17" stroke-width="2" fill="none"/></svg>`; };
function bonesPuzzle(el, api) {
  const ROUNDS = [{ n: 3, d: 1, cap: L("Первое обличье: девушка с корзинкой еды. На дороге трое, один из них — демон.", "First disguise: a girl with a basket of food. Three on the road, one is the demon.", "ပထမ အသွင်: အစားအစာခြင်း ကိုင်ထားတဲ့ မိန်းကလေး။ လမ်းပေါ်မှာ သုံးယောက်၊ တစ်ယောက်က နတ်ဆိုး။") },
    { n: 4, d: 1, cap: L("Второе обличье: старушка ищет дочь. Путников четверо, демон один.", "Second disguise: an old woman looking for her daughter. Four travellers, one demon.", "ဒုတိယ အသွင်: သမီးကို ရှာနေတဲ့ အဘွားအို။ ခရီးသွား လေးယောက်၊ နတ်ဆိုး တစ်ကောင်။") },
    { n: 5, d: 2, eyes: true, cap: L("Третье обличье: старик ищет жену и дочь. Путников пятеро, и демонов двое: Белая Кость привела подручного.", "Third disguise: an old man looking for his wife and daughter. Five travellers and two demons: the White Bone Demon brought a helper.", "တတိယ အသွင်: ဇနီးနဲ့ သမီးကို ရှာနေတဲ့ အဘိုးအို။ ခရီးသွား ငါးယောက်နဲ့ နတ်ဆိုး နှစ်ကောင်: အရိုးဖြူ နတ်ဆိုးမက အကူတစ်ကောင် ခေါ်လာတယ်။") }];
  let ri = 0, mistakes = 0;
  const round = () => {
    const R = ROUNDS[ri], P = genKK(R.n, R.d), names = shuffle(KK_NAMES).slice(0, R.n);
    const nm = i => api.tr(names[i][0], names[i][1], names[i][2]);
    const me = (i, j) => i === j;
    const say = (s, i) => { const X = a => me(a, i) ? api.tr("я", "I", "ကျွန်ုပ်") : nm(a), Xc = a => me(a, i) ? api.tr("Я", "I", "ကျွန်ုပ်") : nm(a);
      if (s.t === "demon") return api.tr(`${Xc(s.a)} — оборотень.`, `${X(s.a)} is the demon in disguise.`, `${X(s.a)} က အသွင်ယူထားတဲ့ နတ်ဆိုး။`);
      if (s.t === "human") return api.tr(`${Xc(s.a)} — обычный человек.`, `${X(s.a)} is an ordinary person.`, `${X(s.a)} က သာမန်လူ။`);
      if (s.t === "same") return api.tr(`${Xc(s.a)} и ${X(s.b)} — одного рода.`, `${X(s.a)} and ${X(s.b)} are the same kind.`, `${X(s.a)} နဲ့ ${X(s.b)} က အမျိုးတူတွေ။`);
      if (s.t === "diff") return api.tr(`${Xc(s.a)} и ${X(s.b)} — разного рода.`, `${X(s.a)} and ${X(s.b)} are different kinds.`, `${X(s.a)} နဲ့ ${X(s.b)} က အမျိုးမတူဘူး။`);
      return api.tr(`Хотя бы один из двоих — ${nm(s.a)} или ${nm(s.b)} — оборотень.`, `At least one of ${nm(s.a)} and ${nm(s.b)} is a demon.`, `${nm(s.a)} နဲ့ ${nm(s.b)} ထဲက အနည်းဆုံး တစ်ယောက်က နတ်ဆိုး။`).replace(nm(i), api.tr("я", "me", "ကျွန်ုပ်"));
    };
    const sel = new Set(), seen = {}; let eyes = R.eyes ? 1 : 0, eyeMode = false; el._t = { D: P.D };
    const draw = (msg = "") => {
      el.innerHTML = `<div class="bones"><p class="stagecap">${api.tr(`Обличье ${ri + 1} из 3`, `Disguise ${ri + 1} of 3`, `အသွင် ${my(ri + 1)} / ၃`)}</p><p>${api.tr(R.cap.ru, R.cap.en, R.cap.my)}</p>
        <div class="people">${P.st.map((s, i) => `<button class="person ${sel.has(i) ? "sel" : ""} ${seen[i] !== undefined ? (seen[i] ? "isdemon" : "ishuman") : ""}" data-i="${i}">
          <div class="pf">${PERSON(i, seen[i] === true)}</div><b>${nm(i)}</b><q>${say(s, i)}</q>${seen[i] !== undefined ? `<em>${seen[i] ? api.tr("оборотень!", "a demon!", "နတ်ဆိုး!") : api.tr("человек", "human", "လူ")}</em>` : ""}</button>`).join("")}</div>
        <div class="row"><button class="btn primary" id="strike" ${sel.size === R.d ? "" : "disabled"}>🔱 ${api.tr("Ударить посохом", "Strike with the staff", "တောင်ဝှေးနဲ့ ရိုက်မယ်")} (${sel.size}/${R.d})</button>
        ${eyes ? `<button class="btn ${eyeMode ? "on" : ""}" id="eyes">👁 ${api.tr("Огненные глаза (1 раз)", "Fiery eyes (once)", "မီးမျက်လုံး (တစ်ကြိမ်)")}</button>` : ""}</div>
        ${eyeMode ? `<p class="note">${api.tr("Нажмите на путника, чтобы увидеть его истинную суть.", "Tap a traveller to see their true nature.", "ခရီးသွားကို နှိပ်ပြီး သူ့ရဲ့ အစစ်အမှန်ကို ကြည့်ပါ။")}</p>` : ""}${msg ? `<p class="note bad">${msg}</p>` : ""}</div>`;
      el.querySelectorAll(".person").forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if (eyeMode) { seen[i] = P.D[i]; eyes = 0; eyeMode = false; api.sfx("bell"); return draw(); }
        sel.has(i) ? sel.delete(i) : sel.size < R.d && sel.add(i); api.sfx("wood"); draw();
      });
      el.querySelector("#eyes")?.addEventListener("click", () => { eyeMode = !eyeMode; draw(); });
      el.querySelector("#strike").onclick = () => {
        const ok = [...sel].every(i => P.D[i]) && sel.size === R.d;
        if (ok) { api.sfx("gong"); [...sel].forEach(i => seen[i] = true); draw(); el.querySelector(".bones").classList.add("hit");
          setTimeout(() => { ri++; if (ri < ROUNDS.length) round(); else { el.dataset.done = 1; api.done({ good: mistakes === 0 }); } }, 1600); return; }
        mistakes++; api.mistake(); api.sfx("chant"); document.body.classList.add("headache"); setTimeout(() => document.body.classList.remove("headache"), 900);
        sel.clear(); draw(api.tr("Вы ударили человека! Наставник читает заклинание, обруч сжимается. Подумайте ещё.", "You struck a human! The master recites the spell and the headband tightens. Think again.", "လူကို ရိုက်မိသွားပြီ! ဆရာက မန္တန်ရွတ်လို့ ခေါင်းစွပ်ကွင်း တင်းလာတယ်။ ထပ်စဉ်းစားပါ။"));
      };
    };
    draw();
  };
  round();
}

// ═════ 4. Tongtian River: three monks, three river demons, a raft for two
const TOK = { m0: "tang", m1: "bajie", m2: "sha" };
const MON = { tang: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#c8322b" stroke="#1b1a17" stroke-width="2"/><circle cx="30" cy="30" r="16" fill="#f3dcc4" stroke="#1b1a17" stroke-width="2"/><path d="M16 20l4-12 6 8 4-10 4 10 6-8 4 12z" fill="#e6c25a" stroke="#1b1a17" stroke-width="1.5"/><path d="M24 32h4M33 32h4" stroke="#1b1a17" stroke-width="2"/></svg>`,
  bajie: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#2b2b33" stroke="#1b1a17" stroke-width="2"/><circle cx="30" cy="30" r="17" fill="#f2b6a6" stroke="#1b1a17" stroke-width="2"/><path d="M14 20c-8 2-8 14-4 18M46 20c8 2 8 14 4 18" fill="#e79d8c" stroke="#1b1a17" stroke-width="2"/><ellipse cx="30" cy="36" rx="9" ry="6" fill="#f6c8ba" stroke="#1b1a17" stroke-width="1.5"/><circle cx="27" cy="36" r="1.6"/><circle cx="33" cy="36" r="1.6"/><circle cx="23" cy="26" r="2"/><circle cx="37" cy="26" r="2"/></svg>`,
  sha: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#6b4a2b" stroke="#1b1a17" stroke-width="2"/><circle cx="30" cy="30" r="16" fill="#6f8aa0" stroke="#1b1a17" stroke-width="2"/><path d="M15 34c2 12 8 16 15 16s13-4 15-16c-4 6-8 8-15 8s-11-2-15-8z" fill="#b8352b"/><circle cx="25" cy="28" r="2"/><circle cx="35" cy="28" r="2"/></svg>`,
  demon: `<svg viewBox="0 0 60 70"><path d="M8 70c2-16 10-22 22-24 12 2 20 8 22 24z" fill="#3f6f5a" stroke="#1b1a17" stroke-width="2"/><path d="M14 30c0-14 8-20 16-20s16 6 16 20-6 18-16 18-16-4-16-18z" fill="#6fae8a" stroke="#1b1a17" stroke-width="2"/><path d="M14 18l-6-10 12 6M46 18l6-10-12 6" fill="#c9a24a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="24" cy="28" r="4" fill="#f2e04a" stroke="#1b1a17" stroke-width="1.5"/><circle cx="36" cy="28" r="4" fill="#f2e04a" stroke="#1b1a17" stroke-width="1.5"/><path d="M22 40l4 3 4-3 4 3 4-3" stroke="#1b1a17" stroke-width="1.5" fill="none"/></svg>` };
function riverPuzzle(el, api) {
  const ids = ["m0", "m1", "m2", "d0", "d1", "d2"];
  let side = {}, raft = [], at = 0, moves = 0, fails = 0;
  const reset = () => { ids.forEach(i => side[i] = 0); raft = []; at = 0; moves = 0; };
  reset();
  const isM = i => i[0] === "m";
  const unsafe = () => { for (const b of [0, 1]) { const here = ids.filter(i => side[i] === b && !raft.includes(i)).concat(at === b ? raft : []); const m = here.filter(isM).length, d = here.length - m; if (m > 0 && d > m) return b; } return -1; };
  const tok = i => `<button class="tok ${raft.includes(i) ? "onraft" : ""}" data-i="${i}">${isM(i) ? MON[TOK[i]] : MON.demon}</button>`;
  const draw = (msg = "") => {
    const bank = b => ids.filter(i => side[i] === b && !raft.includes(i)).map(tok).join("");
    el.innerHTML = `<div class="river"><div class="bank left">${bank(0)}</div><div class="water"><div class="raft ${at ? "r" : "l"}">${raft.map(tok).join("")}<i class="logs"></i></div></div><div class="bank right">${bank(1)}</div></div>
      <div class="row"><button class="btn primary" id="go" ${raft.length ? "" : "disabled"}>⛵ ${api.tr("Переправиться", "Cross", "ကူးမယ်")}</button><span class="dim">${api.tr("Переправ", "Crossings", "ကူးဖြတ်မှု")}: <b>${moves}</b></span></div>${msg ? `<p class="note bad">${msg}</p>` : ""}`;
    el.querySelectorAll(".tok").forEach(b => b.onclick = () => {
      const i = b.dataset.i;
      if (raft.includes(i)) { raft = raft.filter(x => x !== i); side[i] = at; }
      else if (side[i] === at && raft.length < 2) raft.push(i);
      else return;
      api.sfx("wood"); draw();
    });
    el.querySelector("#go").onclick = () => {
      at = 1 - at; raft.forEach(i => side[i] = at); moves++; api.sfx("splash");
      const bad = unsafe();
      if (bad >= 0) { fails++; api.mistake(); api.sfx("fail"); draw(api.tr("Демонов на берегу оказалось больше, чем монахов, и они утащили монахов под воду! Всё сначала.", "There were more demons than monks on a bank, and they dragged the monks under! Start again.", "ကမ်းတစ်ဖက်မှာ နတ်ဆိုးတွေက ဘုန်းကြီးတွေထက် များသွားလို့ ဘုန်းကြီးတွေကို ရေထဲ ဆွဲချသွားပြီ! အစက ပြန်စပါ။")); setTimeout(() => { reset(); draw(); }, 2400); return; }
      draw();
      if (ids.every(i => side[i] === 1)) { el.dataset.done = 1; setTimeout(() => api.done({ good: moves <= 13 && fails === 0, moves, par: 11 }), 700); }
    };
  };
  draw();
}

// ═════ 5. Flaming Mountain: each wave of the fan flips a square and its four neighbours
function firePuzzle(el, api) {
  const n = 5; let on, par, moves = 0;
  let presses; do { on = Array(n * n).fill(false); presses = shuffle([...Array(n * n).keys()]).slice(0, 7); presses.forEach(c => flip(c)); par = presses.length; } while (on.filter(Boolean).length < 9);
  el._t = { presses };
  function flip(c) { const x = c % n, y = c / n | 0; [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < n && Y < n) on[Y * n + X] = !on[Y * n + X]; }); }
  const FL = `<svg viewBox="0 0 100 100" class="fl"><path d="M50 92c-22 0-32-14-28-32 4-14 14-18 16-34 10 10 10 22 8 30 6-4 10-12 8-22 16 12 26 30 20 44-4 10-12 14-24 14z" fill="#e0532e"/><path d="M50 92c-12 0-18-8-14-18 2-8 8-10 10-18 8 10 14 18 12 26-2 6-4 10-8 10z" fill="#f2a33a"/></svg>`;
  const draw = () => {
    el.innerHTML = `<div class="fire" style="--n:${n}">${on.map((v, c) => `<button class="fc ${v ? "burn" : ""}" data-c="${c}">${v ? FL : `<span class="ash"></span>`}</button>`).join("")}</div><p class="dim center">${api.tr("Взмахов", "Waves", "ယပ်ခတ်ခဲ့တာ")}: <b>${moves}</b> · ${api.tr("Огней", "Fires", "မီးတွေ")}: <b>${on.filter(Boolean).length}</b></p>`;
    el.querySelector(".fire").onclick = e => { const b = e.target.closest(".fc"); if (!b || el.dataset.done) return; flip(+b.dataset.c); moves++; api.sfx("wind"); draw(); el.querySelector(`.fc[data-c="${b.dataset.c}"]`).classList.add("fanned");
      if (on.every(v => !v)) { el.dataset.done = 1; el.querySelector(".fire").classList.add("solved"); setTimeout(() => api.done({ good: moves <= par + 3, moves, par }), 900); } };
  };
  draw();
}

// ═════ 6. Spider Cave: drag the knots so that no two threads cross
function webPuzzle(el, api) {
  const pts = [], E = [];
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) pts.push({ x, y });
  const id = (x, y) => y * 3 + x;
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { if (x < 2) E.push([id(x, y), id(x + 1, y)]); if (y < 2) E.push([id(x, y), id(x, y + 1)]); if (x < 2 && y < 2) E.push(Math.random() < .5 ? [id(x, y), id(x + 1, y + 1)] : [id(x + 1, y), id(x, y + 1)]); }
  const order = shuffle([...Array(9).keys()]);
  const P = pts.map((_, i) => { const k = order.indexOf(i), a = k / 9 * Math.PI * 2 - Math.PI / 2; return { x: 50 + 38 * Math.cos(a), y: 52 + 38 * Math.sin(a) }; });
  const cross = (a, b, c, d) => { if (a === c || a === d || b === c || b === d) return false; const o = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)); const A = P[a], B = P[b], C = P[c], D = P[d]; return o(A, B, C) !== o(A, B, D) && o(C, D, A) !== o(C, D, B); };
  const bad = () => { const s = new Set(); for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) if (cross(...E[i], ...E[j])) { s.add(i); s.add(j); } return s; };
  if (bad().size === 0) return webPuzzle(el, api);
  let moves = 0, drag = -1; el._t = { pts };
  el.innerHTML = `<div class="web"><svg viewBox="0 0 100 104" id="wsvg"><path d="M50 0v8" stroke="#bbb" stroke-width=".4"/><g id="lines"></g><g id="knots"></g></svg></div><p class="dim center" id="wst"></p>`;
  const svg = el.querySelector("#wsvg");
  const paint = () => {
    const b = bad();
    svg.querySelector("#lines").innerHTML = E.map(([a, c], i) => `<line x1="${P[a].x}" y1="${P[a].y}" x2="${P[c].x}" y2="${P[c].y}" class="${b.has(i) ? "x" : "ok"}"/>`).join("");
    svg.querySelector("#knots").innerHTML = P.map((p, i) => `<g class="knot ${drag === i ? "drag" : ""}" data-i="${i}" transform="translate(${p.x} ${p.y})"><circle r="4.2"/><circle r="1.6" class="in"/></g>`).join("");
    el.querySelector("#wst").innerHTML = `${api.tr("Перемещений", "Moves", "လှုပ်ရှားမှု")}: <b>${moves}</b> · ${api.tr("Пересечений", "Crossings", "ကူးဖြတ်မှု")}: <b>${b.size ? b.size : 0}</b>`;
    return b;
  };
  paint();
  const pt = e => { const r = svg.getBoundingClientRect(); return { x: Math.max(3, Math.min(97, (e.clientX - r.left) / r.width * 100)), y: Math.max(3, Math.min(101, (e.clientY - r.top) / r.height * 104)) }; };
  svg.addEventListener("pointerdown", e => { const k = e.target.closest(".knot"); if (!k || el.dataset.done) return; drag = +k.dataset.i; svg.setPointerCapture(e.pointerId); paint(); });
  svg.addEventListener("pointermove", e => { if (drag < 0) return; P[drag] = pt(e); paint(); });
  const up = () => { if (drag < 0) return; drag = -1; moves++; api.sfx("pluck"); const b = paint(); if (!b.size) { el.dataset.done = 1; el.querySelector(".web").classList.add("solved"); setTimeout(() => api.done({ good: moves <= 14, moves }), 900); } };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
}

export const TRIALS = [
  { id: "seal", zh: "五行山", scene: "mountain", name: L("Гора Пяти Стихий", "Five Elements Mountain", "ပဉ္စဓာတ်တောင်"),
    intro: [["tang", L("Под этой горой пятьсот лет томится Царь обезьян. Будда запечатал её талисманом.", "Under this mountain the Monkey King has been trapped for five hundred years. The Buddha sealed it with a talisman.", "ဒီတောင်အောက်မှာ မျောက်ဘုရင်ဟာ နှစ်ငါးရာ ပိတ်မိနေတယ်။ မြတ်စွာဘုရားက အင်းစာနဲ့ တံဆိပ်ခတ်ထားတယ်။")],
      ["wukong", L("Наставник! Сними печать, и я пойду с тобой хоть на край света!", "Master! Lift the seal and I'll follow you to the end of the world!", "ဆရာ! တံဆိပ်ကို ဖွင့်ပေးပါ၊ ကမ္ဘာ့အစွန်းထိ လိုက်ပါ့မယ်!")]],
    rules: L("Поворачивайте фрагменты талисмана, чтобы все золотые линии соединились в одну сеть без разрывов и свободных концов. Сила идёт от центральной печати: подключённые фрагменты загораются.", "Turn the talisman pieces so that all the golden lines join into one network with no gaps or loose ends. The power flows from the central seal: connected pieces light up.", "အင်းစာ အပိုင်းအစတွေကို လှည့်ပြီး ရွှေမျဉ်းအားလုံးကို အပြတ်မရှိ၊ အဆုံးလွတ် မရှိဘဲ ကွန်ရက်တစ်ခုတည်း ဖြစ်အောင် ဆက်ပါ။ စွမ်းအားက အလယ်တံဆိပ်ကနေ စီးတယ်: ချိတ်မိတဲ့ အပိုင်းတွေ လင်းလာမယ်။"),
    hints: [L("Фрагмент с одной линией — тупик. Он смотрит внутрь сети и никогда не смотрит в край поля.", "A piece with one line is a dead end. It points into the network and never at the edge of the board.", "မျဉ်းတစ်ကြောင်းတည်းပါတဲ့ အပိုင်းက အဆုံးသတ်။ ကွန်ရက်ထဲကို ညွှန်ရမယ်၊ ကွက်အစွန်းကို ဘယ်တော့မှ မညွှန်ဘူး။"),
      L("Начинайте с углов и краёв: у них меньше всего вариантов.", "Start with the corners and edges: they have the fewest options.", "ထောင့်တွေနဲ့ အစွန်းတွေကနေ စပါ: ရွေးစရာ အနည်းဆုံးပဲ။"),
      L("Прямая линия у края может лежать только вдоль края.", "A straight piece on the edge can only lie along the edge.", "အစွန်းမှာရှိတဲ့ မျဉ်းဖြောင့်က အစွန်းအတိုင်းပဲ လှဲနိုင်တယ်။")],
    outro: [["wukong", L("Свобода! Пятьсот лет я ждал этого дня. Наставник, теперь я твой ученик.", "Free! Five hundred years I waited for this day. Master, I am your disciple now.", "လွတ်ပြီ! ဒီနေ့ကို နှစ်ငါးရာ စောင့်ခဲ့တာ။ ဆရာ၊ အခုကစပြီး ကျွန်တော် ဆရာ့တပည့်ပါ။")], ["tang", L("Тогда в путь. До Запада далеко.", "Then let us go. The West is far away.", "ဒါဆို ခရီးဆက်ကြစို့။ အနောက်က ဝေးသေးတယ်။")]],
    mount: sealPuzzle },
  { id: "fruit", zh: "人参果", scene: "temple", name: L("Плоды женьшеня", "The Ginseng Fruit", "ဂျင်ဆင်းသီး"),
    intro: [["monk", L("Плоды женьшеня в моём саду зреют раз в девять тысяч лет. Один плод подменили пустышкой.", "The ginseng fruit in my garden ripens once in nine thousand years. One of them has been replaced with a fake.", "ကျွန်ုပ်ဥယျာဉ်က ဂျင်ဆင်းသီးတွေဟာ နှစ်ကိုးထောင်မှ တစ်ခါ မှည့်တယ်။ တစ်လုံးကို အတုနဲ့ လဲထားတယ်။")],
      ["bajie", L("Можно я съем все, а потом скажу, какой был невкусный?", "Can I eat them all and then tell you which one tasted wrong?", "အကုန်စားပြီးမှ ဘယ်တစ်လုံး အရသာမှားလဲ ပြောရင် ရမလား။")],
      ["wukong", L("Нельзя. Есть весы, а взвешиваний мало. И дух сада хитрит: он подменяет плод так, чтобы обмануть нас. Угадать не выйдет, только вычислить.", "No. We have scales, and only a few weighings. And the garden spirit is sly: it moves the fake to fool us. Guessing won't work; only reasoning will.", "မရဘူး။ ချိန်ခွင်ရှိတယ်၊ ချိန်ခွင့်က နည်းနည်းပဲ။ ဥယျာဉ်စောင့်နတ်ကလည်း ကလိမ်ကကျစ်ကျတယ်: ငါတို့ကို လှည့်စားဖို့ အတုကို ရွှေ့နေတယ်။ ကံစမ်းလို့ မရဘူး၊ ဆင်ခြင်မှပဲ ရမယ်။")]],
    rules: L("Первый сад: 9 плодов, подделка легче, 2 взвешивания. Второй сад: 12 плодов, подделка легче или тяжелее, 3 взвешивания. Положите плоды на чаши, взвесьте, а потом назовите подделку.", "First garden: 9 fruits, the fake is lighter, 2 weighings. Second garden: 12 fruits, the fake is lighter or heavier, 3 weighings. Put fruits on the pans, weigh, then name the fake.", "ပထမ ဥယျာဉ်: အသီး ၉ လုံး၊ အတုက ပိုပေါ့တယ်၊ ချိန်ခွင့် ၂ ကြိမ်။ ဒုတိယ ဥယျာဉ်: အသီး ၁၂ လုံး၊ အတုက ပိုပေါ့ချင် ပေါ့မယ်၊ ပိုလေးချင် လေးမယ်၊ ချိန်ခွင့် ၃ ကြိမ်။ အသီးတွေကို ခွက်ပေါ် တင်၊ ချိန်ပြီး အတုကို ညွှန်ပြပါ။"),
    hints: [L("Первый сад: делите плоды на три группы по три и сравните две из них.", "First garden: split the fruits into three groups of three and compare two of them.", "ပထမ ဥယျာဉ်: အသီးတွေကို သုံးလုံးစီ အုပ်စုသုံးစု ခွဲပြီး နှစ်စုကို ယှဉ်ချိန်ပါ။"),
      L("Второй сад: начните с 4 против 4. Если равновесие, подделка среди четырёх на столе, а восемь на весах настоящие и годятся как эталон.", "Second garden: start with 4 against 4. If they balance, the fake is among the four on the table, and the eight on the scales are genuine and can serve as a reference.", "ဒုတိယ ဥယျာဉ်: ၄ လုံးနဲ့ ၄ လုံး စချိန်ပါ။ ညီမျှရင် အတုက စားပွဲပေါ်က လေးလုံးထဲမှာ၊ ချိန်ခွင်ပေါ်က ရှစ်လုံးက အစစ်တွေ — နမူနာအဖြစ် သုံးနိုင်တယ်။"),
      L("Если левая чаша перевесила: подделка либо тяжёлая слева, либо лёгкая справа. Во втором взвешивании переложите часть плодов на другую чашу, часть уберите и добавьте эталонные.", "If the left pan is heavier: the fake is either heavy on the left or light on the right. For the second weighing, swap some fruits across, take some off and add reference ones.", "ဘယ်ခွက် ပိုလေးရင်: အတုက ဘယ်ဘက်မှာ လေးနေတာ ဒါမှမဟုတ် ညာဘက်မှာ ပေါ့နေတာ။ ဒုတိယ အကြိမ်မှာ အချို့ကို တစ်ဖက်ခွက်ကို ပြောင်း၊ အချို့ကို ဖယ်ပြီး နမူနာ အစစ်တွေ ထည့်ပါ။")],
    outro: [["monk", L("Вы честны и умны. Ешьте настоящие плоды: каждый продлевает жизнь на сорок семь тысяч лет.", "You are honest and clever. Eat the real fruit: each one adds forty-seven thousand years to your life.", "သင်တို့ ရိုးသားပြီး ဉာဏ်ကောင်းတယ်။ အစစ်တွေကို စားပါ: တစ်လုံးက သက်တမ်းကို နှစ်ပေါင်း လေးသောင်းခုနစ်ထောင် တိုးစေတယ်။")], ["bajie", L("Сорок семь тысяч лет… А можно ещё один?", "Forty-seven thousand years… Can I have another?", "လေးသောင်းခုနစ်ထောင်… နောက်တစ်လုံး ရမလား။")]],
    mount: weighPuzzle },
  { id: "bones", zh: "白骨精", scene: "bones", name: L("Трижды Белая Кость", "The White Bone Demon", "အရိုးဖြူ နတ်ဆိုးမ"),
    intro: [["baigu", L("Мясо танского монаха дарует бессмертие… Я войду к ним в доверие в чужом обличье.", "The flesh of the Tang monk grants immortality… I'll win their trust in a borrowed shape.", "ထန်ဘုန်းကြီးရဲ့ အသားက မသေမျိုး ဖြစ်စေတယ်… သူများအသွင်နဲ့ သူတို့ယုံကြည်မှုကို ရယူမယ်။")],
      ["wukong", L("Наставник, я вижу демона насквозь! А ты мне не веришь.", "Master, I can see right through the demon! And you don't believe me.", "ဆရာ၊ ကျွန်တော် နတ်ဆိုးကို ဖောက်မြင်တယ်! ဆရာက ကျွန်တော့်ကို မယုံဘူး။")],
      ["tang", L("Если ударишь невинного, я прочту заклинание обруча.", "If you strike an innocent, I will recite the headband spell.", "အပြစ်မဲ့သူကို ရိုက်ရင် ခေါင်းစွပ်ကွင်း မန္တန်ကို ရွတ်မယ်။")]],
    rules: L("Демоны всегда лгут, люди всегда говорят правду. По словам путников найдите демона и ударьте посохом. Ошибка — и обруч сожмётся.", "Demons always lie; people always tell the truth. From what the travellers say, find the demon and strike with the staff. Get it wrong and the headband tightens.", "နတ်ဆိုးတွေ အမြဲလိမ်တယ်၊ လူတွေ အမြဲ အမှန်ပြောတယ်။ ခရီးသွားတွေ ပြောတာကနေ နတ်ဆိုးကို ရှာပြီး တောင်ဝှေးနဲ့ ရိုက်ပါ။ မှားရင် ခေါင်းစွပ်ကွင်း တင်းလာမယ်။"),
    hints: [L("Предположите, что демон — вот этот, и проверьте: все честные должны говорить правду, а демон — ложь. Противоречие? Значит, не он.", "Assume this one is the demon and check: every honest person must speak the truth, and the demon must lie. A contradiction? Then it isn't them.", "ဒီလူက နတ်ဆိုးလို့ ယူဆပြီး စစ်ကြည့်ပါ: ရိုးသားသူတိုင်း အမှန်ပြောရမယ်၊ နတ်ဆိုးက လိမ်ရမယ်။ ဆန့်ကျင်နေရင် သူမဟုတ်ဘူး။"),
      L("«X и Y одного рода» — правда, если оба люди или оба демоны.", "'X and Y are the same kind' is true if both are human or both are demons.", "«X နဲ့ Y အမျိုးတူ» ဆိုတာ နှစ်ယောက်လုံး လူ ဒါမှမဟုတ် နှစ်ကောင်လုံး နတ်ဆိုးဆိုရင် မှန်တယ်။"),
      L("Слова демона ложны всегда, даже когда он говорит о себе.", "A demon's words are always false, even when it talks about itself.", "နတ်ဆိုးရဲ့ စကားက အမြဲ မှားတယ်၊ သူ့အကြောင်း သူပြောရင်တောင် မှားတယ်။")],
    outro: [["baigu", L("Нет! Кость к кости, прах к праху…", "No! Bone to bone, dust to dust…", "မဟုတ်ဘူး! အရိုးက အရိုးဆီ၊ ဖုန်က ဖုန်ဆီ…")], ["wukong", L("Белая Кость рассыпалась. Видишь, наставник, я был прав.", "The White Bone Demon is dust. You see, Master, I was right.", "အရိုးဖြူ နတ်ဆိုးမ ဖုန်မှုန့် ဖြစ်သွားပြီ။ မြင်လား ဆရာ၊ ကျွန်တော် မှန်တယ်။")], ["tang", L("Прости меня, ученик. Глаза обманывают, а логика нет.", "Forgive me, disciple. Eyes deceive, but logic does not.", "ခွင့်လွှတ်ပါ တပည့်။ မျက်လုံးက လှည့်စားတတ်တယ်၊ ယုတ္တိက မလှည့်စားဘူး။")]],
    mount: bonesPuzzle },
  { id: "river", zh: "通天河", scene: "river", name: L("Река Тунтянь", "The Tongtian River", "ထုံထျန်း မြစ်"),
    intro: [["sha", L("Река Тунтянь — восемьсот ли в ширину. Есть плот, но на нём помещаются только двое.", "The Tongtian River is eight hundred li wide. There's a raft, but it only holds two.", "ထုံထျန်းမြစ်က လီ ရှစ်ရာ ကျယ်တယ်။ ဖောင်ရှိတယ်၊ ဒါပေမယ့် နှစ်ယောက်ပဲ ဆံ့တယ်။")],
      ["bajie", L("А эти трое из реки предлагают помочь грести. Подозрительно добрые…", "And these three from the river offer to help us row. Suspiciously kind…", "မြစ်ထဲက ဒီသုံးကောင်က လှော်ကူမယ်တဲ့။ သံသယဖြစ်လောက်အောင် သဘောကောင်းနေတယ်…")],
      ["wukong", L("Это речные демоны. Если на каком-то берегу их окажется больше, чем монахов, они утащат монахов под воду.", "They're river demons. If on either bank they outnumber the monks, they'll drag the monks under.", "ဒါတွေက မြစ်နတ်ဆိုးတွေ။ ကမ်းတစ်ဖက်ဖက်မှာ ဘုန်းကြီးတွေထက် များသွားရင် ဘုန်းကြီးတွေကို ရေထဲ ဆွဲချလိမ့်မယ်။")]],
    rules: L("Переправьте трёх монахов и трёх демонов на другой берег. На плоту двое, пустой плот не плывёт. Ни на одном берегу демонов не должно быть больше, чем монахов (если монахи там есть). Те, кто на плоту, считаются на берегу, где стоит плот. Нажимайте на фигуры, чтобы посадить их на плот или высадить.", "Get three monks and three demons to the far bank. The raft holds two and won't cross empty. On neither bank may demons outnumber monks (if any monks are there). Those on the raft count as being on the bank where it's moored. Tap figures to put them on the raft or take them off.", "ဘုန်းကြီး သုံးပါးနဲ့ နတ်ဆိုး သုံးကောင်ကို တစ်ဖက်ကမ်းကို ပို့ပါ။ ဖောင်ပေါ်မှာ နှစ်ယောက်ပဲ ဆံ့ပြီး လူမပါဘဲ မကူးနိုင်ဘူး။ ဘယ်ကမ်းမှာမဆို နတ်ဆိုးက ဘုန်းကြီးထက် မများရဘူး (ဘုန်းကြီးရှိရင်)။ ဖောင်ပေါ်ကသူတွေကို ဖောင်ဆိုက်ထားတဲ့ ကမ်းမှာ ရေတွက်တယ်။ ရုပ်ပုံတွေကို နှိပ်ပြီး ဖောင်ပေါ် တင်ပါ ဒါမှမဟုတ် ချပါ။"),
    hints: [L("Первым рейсом удобно отправить двух демонов.", "On the first trip it helps to send two demons.", "ပထမ အကြိမ်မှာ နတ်ဆိုး နှစ်ကောင် ပို့တာ အဆင်ပြေတယ်။"),
      L("Ключевой момент — середина: на тот берег переходят два монаха, а обратно плывут монах и демон.", "The key moment is the middle: two monks go across, and a monk and a demon come back.", "အဓိကအချက်က အလယ်ပိုင်း: ဘုန်းကြီး နှစ်ပါး ကူးသွားပြီး ဘုန်းကြီး တစ်ပါးနဲ့ နတ်ဆိုး တစ်ကောင် ပြန်လာတယ်။"),
      L("Минимум — 11 переправ.", "The minimum is 11 crossings.", "အနည်းဆုံး ၁၁ ကြိမ် ကူးရတယ်။")],
    outro: [["sha", L("Все на месте, никого не утащили.", "Everyone's here, and nobody was dragged under.", "အားလုံး ရောက်ပြီ၊ ဘယ်သူမှ ရေထဲ မဆွဲချခံရဘူး။")], ["bajie", L("Я бы и сам доплыл… наверное.", "I could have swum it myself… probably.", "ကျွန်တော် ကိုယ်တိုင် ကူးနိုင်ပါတယ်… ထင်တာပဲ။")]],
    mount: riverPuzzle },
  { id: "fire", zh: "火焰山", scene: "fire", name: L("Огненная гора", "The Flaming Mountain", "မီးလျှံတောင်"),
    intro: [["fan", L("Мой банановый веер гасит Огненную гору. Но гора хитрая: взмах гасит огонь в клетке и задевает четырёх её соседей.", "My banana-leaf fan puts out the Flaming Mountain. But the mountain is tricky: a wave of the fan flips a square and its four neighbours.", "ငါ့ငှက်ပျောရွက် ယပ်တောင်က မီးလျှံတောင်ကို ငြိမ်းစေတယ်။ ဒါပေမယ့် တောင်က လှည့်ကွက်ရှိတယ်: ယပ်တစ်ချက် ခတ်ရင် အကွက်တစ်ကွက်နဲ့ ဘေးလေးကွက် ပြောင်းပြန် ဖြစ်တယ်။")],
      ["wukong", L("Потухшее вспыхивает, горящее гаснет. Принцесса, одолжи веер!", "What's out flares up, what's burning goes out. Princess, lend me the fan!", "ငြိမ်းနေတာက တောက်လာမယ်၊ တောက်နေတာက ငြိမ်းမယ်။ မင်းသမီး၊ ယပ်တောင် ငှားပါ!")],
      ["fan", L("Только на время. И не маши без толку.", "Only for a while. And don't wave it aimlessly.", "ခဏပဲ။ အလကား မခတ်နဲ့။")]],
    rules: L("Нажатие на клетку переключает её и четыре соседние (сверху, снизу, слева, справа): огонь гаснет, а потухшее вспыхивает. Погасите всю гору.", "Tapping a square flips it and its four neighbours (above, below, left and right): fire goes out and ash flares up. Put out the whole mountain.", "အကွက်ကို နှိပ်ရင် အဲဒီအကွက်နဲ့ ဘေးလေးကွက် (အပေါ်၊ အောက်၊ ဘယ်၊ ညာ) ပြောင်းပြန် ဖြစ်တယ်: မီးငြိမ်းပြီး ပြာက မီးတောက်လာတယ်။ တောင်တစ်ခုလုံးကို ငြိမ်းပါ။"),
    hints: [L("Порядок взмахов не важен, а два взмаха по одной клетке отменяют друг друга.", "The order of the waves doesn't matter, and two waves on the same square cancel out.", "ယပ်ခတ်တဲ့ အစဉ်က အရေးမကြီးဘူး၊ အကွက်တစ်ကွက်ကို နှစ်ခါခတ်ရင် ပြန်ပယ်ဖျက်သွားတယ်။"),
      L("Гасите построчно: взмах по клетке во втором ряду гасит огонь прямо над ней. Так огонь сгоняется вниз.", "Work row by row: a wave on a square in the second row puts out the fire directly above it. This chases the fire downwards.", "အတန်းလိုက် ငြိမ်းပါ: ဒုတိယ အတန်းက အကွက်ကို ခတ်ရင် အပေါ်တည့်တည့်က မီး ငြိမ်းတယ်။ ဒီလိုနဲ့ မီးကို အောက်ကို မောင်းချတယ်။"),
      L("Если огонь остался в нижнем ряду, запомните узор, начните заново и подберите взмахи в верхнем ряду.", "If fire is left in the bottom row, remember the pattern, start over and choose different waves in the top row.", "အောက်ဆုံးအတန်းမှာ မီးကျန်ရင် ပုံစံကို မှတ်ထား၊ ပြန်စပြီး အပေါ်ဆုံးအတန်းမှာ မတူတဲ့ ခတ်ချက်တွေ ရွေးပါ။")],
    outro: [["fan", L("Гора погасла… Верните веер.", "The mountain is out… Give me back my fan.", "တောင် ငြိမ်းသွားပြီ… ယပ်တောင် ပြန်ပေး။")], ["wukong", L("Возвращаю. Слово Царя обезьян.", "Here it is. The Monkey King's word.", "ပြန်ပေးပါတယ်။ မျောက်ဘုရင်ရဲ့ ကတိ။")]],
    mount: firePuzzle },
  { id: "web", zh: "盘丝洞", scene: "cave", name: L("Пещера Паутин", "The Cave of Silken Webs", "ပင့်ကူအိမ်ဂူ"),
    intro: [["tang", L("Ученики! Я попал в паутину…", "Disciples! I'm caught in a web…", "တပည့်တို့! ငါ ပင့်ကူအိမ်ထဲ ပိတ်မိနေပြီ…")],
      ["spider", L("Семь сестёр сплели паутину так, что нити держат друг друга. Распутай, если сможешь.", "Seven sisters wove this web so that the threads hold each other fast. Untangle it, if you can.", "ညီအစ်မ ခုနစ်ယောက်က ချည်မျှင်တွေ တစ်ခုနဲ့တစ်ခု ချုပ်ထားအောင် ရက်ထားတယ်။ ဖြေနိုင်ရင် ဖြေကြည့်။")],
      ["wukong", L("Если ни одна нить не пересекает другую, паутина ослабнет.", "If no thread crosses another, the web will go slack.", "ချည်မျှင်တစ်ခုမှ တစ်ခုကို မဖြတ်ရင် ပင့်ကူအိမ် လျော့သွားမယ်။")]],
    rules: L("Перетаскивайте узлы так, чтобы ни одна нить не пересекала другую. Пересекающиеся нити горят красным.", "Drag the knots so that no thread crosses another. Crossing threads glow red.", "ချည်ထုံးတွေကို ဆွဲရွှေ့ပြီး ချည်မျှင်တစ်ခုမှ တစ်ခုကို မဖြတ်အောင် လုပ်ပါ။ ဖြတ်နေတဲ့ ချည်မျှင်တွေ အနီရောင် တောက်နေတယ်။"),
    hints: [L("Распутанная паутина — сетка из треугольников.", "An untangled web is a mesh of triangles.", "ဖြေပြီးသား ပင့်ကူအိမ်က တြိဂံတွေနဲ့ ကွန်ရက်။"),
      L("Найдите узел с наибольшим числом нитей: это центр. Поставьте его в середину.", "Find the knot with the most threads: that's the centre. Put it in the middle.", "ချည်မျှင် အများဆုံး ချည်ထုံးက အလယ်။ အလယ်မှာ ထားပါ။"),
      L("Узлы с двумя-тремя нитями — края и углы сетки. Разведите их по кругу, а остальные поставьте внутрь.", "Knots with two or three threads are the edges and corners of the mesh. Spread them around the outside and put the rest inside.", "ချည်မျှင် နှစ်-သုံးခုပါတဲ့ ချည်ထုံးတွေက အစွန်းနဲ့ ထောင့်တွေ။ အပြင်ဘက်မှာ ဝိုင်းထားပြီး ကျန်တာကို အထဲမှာ ထားပါ။")],
    outro: [["spider", L("Нити… распустились.", "The threads… came undone.", "ချည်မျှင်တွေ… ပြေသွားပြီ။")], ["tang", L("Спасибо, ученики. Впереди ещё много испытаний.", "Thank you, disciples. Many trials still lie ahead.", "ကျေးဇူးပဲ တပည့်တို့။ ရှေ့မှာ စမ်းသပ်ချက်တွေ အများကြီး ကျန်သေးတယ်။")]],
    mount: webPuzzle },
];
