// Exam 4: Class Duel. Class D against the class just above it. Each side nominates four events, seven are played.
// You assign the line-up (everyone at most twice) and, as commander, may step in three times with a mini-game.
// The first class to four wins takes 100 class points from the other.
import { G, tr, nm, face, me, classmates, classOf, byId, rnd, pick, shuffle, clamp, line, brief, toast, CLASSES, esc, trust, $ } from "./game.js";
import { trivia } from "../party/content.js";

const EVENTS = {
  code: { ru: "Взлом кода", en: "Code breaking", icon: "🔐", w: { int: 1 }, n: 1, game: "code" },
  quiz: { ru: "Викторина", en: "Quiz", icon: "❓", w: { int: .8, soc: .2 }, n: 3, game: "quiz" },
  math: { ru: "Устный счёт", en: "Mental maths", icon: "➗", w: { int: 1 }, n: 2 },
  relay: { ru: "Эстафета", en: "Relay", icon: "🏃", w: { phy: 1 }, n: 4 },
  tug: { ru: "Перетягивание каната", en: "Tug of war", icon: "🪢", w: { phy: 1 }, n: 5 },
  ball: { ru: "Баскетбол", en: "Basketball", icon: "🏀", w: { phy: .7, soc: .3 }, n: 3 },
  debate: { ru: "Дебаты", en: "Debate", icon: "🎙️", w: { soc: .6, int: .4 }, n: 2 },
  deal: { ru: "Переговоры", en: "Negotiation", icon: "🤝", w: { soc: 1 }, n: 1 },
  rps: { ru: "Камень, ножницы, бумага", en: "Rock, paper, scissors", icon: "✊", w: { soc: .2 }, n: 1, game: "rps" },
  swim: { ru: "Плавание", en: "Swimming", icon: "🏊", w: { phy: .9, int: .1 }, n: 2 },
};
const STYLE = { A: { int: 7, phy: 5, soc: 5, likes: ["code", "math", "quiz", "debate"] }, B: { int: 5, phy: 5, soc: 7, likes: ["deal", "debate", "ball", "quiz"] }, C: { int: 4, phy: 7, soc: 5, likes: ["tug", "relay", "ball", "swim"] } };
const LEADER = { A: "viktor", B: "hana", C: "rex" };
const en = k => tr(EVENTS[k].ru, EVENTS[k].en);

let D, ctx;
export function run(c) {
  ctx = c;
  const order = Object.keys(G.cp).filter(k => k !== "D").sort((a, b) => G.cp[a] - G.cp[b]);
  let opp = order.find(k => G.cp[k] >= G.cp.D) || order[order.length - 1];
  if (G.flags?.noA && opp === "A") opp = order.find(k => k !== "A") || "B";
  D = { opp, mine: [], theirs: [], list: [], idx: 0, lineup: {}, wins: { D: 0, O: 0 }, tokens: 3, results: [], usedIntel: false };
  const leader = byId(LEADER[opp]);
  brief(ctx, { icon: "♟️", name: tr("Дуэль классов", "Class Duel"), rules: [
    tr(`Соперник — <b>класс ${opp}</b>, ближайший к вам в таблице. Командир соперника — ${nm(leader)}.`, `Your opponent is <b>Class ${opp}</b>, the nearest class above you. Their commander is ${nm(leader)}.`),
    tr("Каждый класс выбирает 4 дисциплины из 10. Проводятся 7 из них.", "Each class nominates 4 of 10 events. Seven are played."),
    tr("Вы расставляете состав: каждый ученик участвует не больше чем в двух дисциплинах.", "You set the line-up: each student competes in at most two events."),
    tr("Трижды за дуэль командир может вмешаться: в «Взломе кода», «Викторине» и «Камень, ножницы, бумага» вы играете сами и усиливаете команду.", "Three times per duel the commander may step in: in Code breaking, Quiz and Rock-paper-scissors you play yourself and boost the team."),
    tr("Кто первым выиграет 4 дисциплины, забирает у соперника 100 очков класса.", "The first class to win four events takes 100 class points from the other."),
  ], extra: (G.flags?.noTom ? `<p class="note danger">${tr("Том отстранён от дуэли.", "Tom is barred from the duel.")}</p>` : "") + (G.flags?.tutor ? `<p class="note">${tr("Репетитор: +1 к интеллекту всего класса в этой дуэли.", "Tutor: +1 Intellect for the whole class in this duel.")}</p>` : "") + (G.items.intel ? `<p class="note">🕵️ ${tr("Информатор узнает, какие дисциплины выберет соперник.", "Your informant will tell you which events the opponent picks.")}</p>` : "") }, draft);
  ctx.leader = leader;
}

function draft() {
  ctx.setRerender(draft);
  const st = STYLE[D.opp];
  if (!D.theirs.length) D.theirs = shuffle(st.likes).slice(0, 3).concat(pick(Object.keys(EVENTS).filter(k => !st.likes.includes(k))));
  const spy = !!G.items.intel;
  ctx.frame(`<div class="exam-bar"><span>♟️ ${tr("Выбор дисциплин", "Event draft")}</span><span>${tr("Выбрано", "Chosen")} <b>${D.mine.length}/4</b></span><span>${tr("Соперник", "Opponent")}: <b style="color:${CLASSES[D.opp].color}">${D.opp}</b></span></div>
  <section class="paper">
    <h2>${tr("Выберите 4 дисциплины", "Pick four events")}</h2>
    <p class="dim">${tr("Смотрите на сильные стороны своего класса. Класс", "Play to your class's strengths. Class")} ${D.opp} ${tr("силён в", "is strong in")}: ${D.opp === "A" ? tr("интеллекте", "intellect") : D.opp === "B" ? tr("общении", "social skills") : tr("физике", "physique")}.</p>
    ${spy ? `<p class="note">🕵️ ${tr("Соперник выбрал:", "The opponent picked:")} ${D.theirs.map(k => EVENTS[k].icon + " " + en(k)).join(", ")}</p>` : ""}
    <div class="events">${Object.keys(EVENTS).map(k => { const e = EVENTS[k];
      return `<button class="evt ${D.mine.includes(k) ? "sel" : ""}" data-e="${k}"><span class="ei">${e.icon}</span><b>${en(k)}</b><small>${Object.entries(e.w).map(([s, v]) => (s === "int" ? "🧠" : s === "phy" ? "💪" : "💬") + Math.round(v * 100) + "%").join(" ")} · ${e.n} ${tr("чел.", "ppl")}${e.game ? " · 🎮" : ""}</small></button>`; }).join("")}</div>
    <button class="btn primary" id="go" ${D.mine.length === 4 ? "" : "disabled"}>${tr("Утвердить", "Confirm")} →</button></section>`);
  document.querySelector(".events").onclick = e => { const b = e.target.closest("[data-e]"); if (!b) return; const k = b.dataset.e; D.mine.includes(k) ? D.mine.splice(D.mine.indexOf(k), 1) : D.mine.length < 4 && D.mine.push(k); draft(); };
  $("#go").onclick = () => {
    D.usedIntel = spy;
    let all = [...new Set([...D.mine, ...D.theirs])];
    while (all.length < 7) all.push(pick(Object.keys(EVENTS).filter(k => !all.includes(k))));
    D.list = shuffle(all).slice(0, 7);
    autoAssign(); lineup();
  };
}

const roster = () => [me(), ...classmates().filter(p => !(G.flags?.noTom && p.id === "tom"))];
const stat = (p, k) => (p[k] || 0) + (k === "int" && G.flags?.tutor ? 1 : 0);
const fit = (p, ev) => Object.entries(EVENTS[ev].w).reduce((s, [k, v]) => s + stat(p, k) * v, 0);
function uses(id) { return Object.values(D.lineup).filter(l => l.includes(id)).length; }
function autoAssign() {
  D.lineup = {};
  for (const ev of D.list.slice().sort((a, b) => EVENTS[b].n - EVENTS[a].n)) {
    D.lineup[ev] = [];
    const pool = roster().sort((a, b) => fit(b, ev) - fit(a, ev));
    for (const p of pool) { if (D.lineup[ev].length >= EVENTS[ev].n) break; if (uses(p.id) < 2) D.lineup[ev].push(p.id); }
  }
}
function lineup() {
  ctx.setRerender(lineup);
  const R = roster();
  ctx.frame(`<div class="exam-bar"><span>♟️ ${tr("Состав", "Line-up")}</span><span>${tr("Каждый — не больше двух дисциплин", "Everyone at most twice")}</span></div>
  <section class="paper">
    <h2>${tr("Расставьте класс", "Set your line-up")}</h2>
    <p class="dim">${tr("Нажмите на ученика в дисциплине, чтобы убрать его, или на свободное место, чтобы добавить.", "Tap a student in an event to remove them, or an empty slot to add someone.")}</p>
    <div class="lineup">${D.list.map(ev => `<div class="lu"><b>${EVENTS[ev].icon} ${en(ev)}</b><div class="lus">${Array.from({ length: EVENTS[ev].n }, (_, i) => { const id = D.lineup[ev][i];
      return id ? `<button class="slot-p" data-ev="${ev}" data-rm="${id}">${face(id === "you" ? me() : byId(id), { size: "xs" })}<span>${id === "you" ? esc(G.name) : nm(byId(id))}</span><em>${Math.round(fit(id === "you" ? me() : byId(id), ev))}</em></button>`
        : `<select class="slot-add" data-ev="${ev}"><option value="">+</option>${R.filter(p => uses(p.id) < 2 && !D.lineup[ev].includes(p.id)).map(p => `<option value="${p.id}">${p.id === "you" ? esc(G.name) : nm(p)} · ${Math.round(fit(p, ev))}</option>`).join("")}</select>`; }).join("")}</div></div>`).join("")}</div>
    <div class="choices"><button class="btn" id="auto">${tr("Расставить автоматически", "Auto-assign")}</button><button class="btn primary" id="go">${tr("К дуэли", "To the duel")} →</button></div></section>`);
  const root = $(".lineup");
  root.onclick = e => { const b = e.target.closest("[data-rm]"); if (!b) return; const l = D.lineup[b.dataset.ev]; l.splice(l.indexOf(b.dataset.rm), 1); lineup(); };
  root.onchange = e => { const s = e.target.closest("[data-ev]"); if (s && s.value) { D.lineup[s.dataset.ev].push(s.value); lineup(); } };
  $("#auto").onclick = () => { autoAssign(); lineup(); };
  $("#go").onclick = () => event();
}

// the other class's team for an event: its named students plus anonymous classmates of that class's style
function oppPower(ev) {
  const st = STYLE[D.opp];
  const named = classOf(D.opp).map(p => p);
  const generic = Array.from({ length: 6 }, () => ({ int: st.int + rnd(3) - 1, phy: st.phy + rnd(3) - 1, soc: st.soc + rnd(3) - 1 }));
  const pool = [...named, ...generic].sort((a, b) => fit(b, ev) - fit(a, ev)).slice(0, EVENTS[ev].n);
  return pool.reduce((s, p) => s + fit(p, ev), 0) * (G.diff === "hard" ? 1.08 : 1) * (D.opp === "C" && !G.flags?.noLeak ? 1.06 : 1);
}
function event(note = "", bonus = 0) {
  ctx.setRerender(() => event(note, bonus));
  const ev = D.list[D.idx], E = EVENTS[ev], team = D.lineup[ev] || [];
  const mine = team.reduce((s, id) => s + fit(id === "you" ? me() : byId(id), ev), 0);
  ctx.frame(`<div class="exam-bar"><span>♟️ ${tr("Дисциплина", "Event")} <b>${D.idx + 1}/7</b></span><span>D <b>${D.wins.D}</b> : <b>${D.wins.O}</b> ${D.opp}</span><span>🎖️ ${tr("Вмешательств", "Interventions")} <b>${D.tokens}</b></span></div>
  <section class="paper duel">
    <div class="vs"><div class="side"><b style="color:${CLASSES.D.color}">${tr("Класс", "Class")} D</b><div class="faces">${team.map(id => face(id === "you" ? me() : byId(id), { size: "xs" })).join("")}</div><span class="pow">${Math.round(mine)}${bonus ? ` <em>+${Math.round(bonus * 100)}%</em>` : ""}</span></div>
      <div class="mid"><span class="ei big">${E.icon}</span><h2>${en(ev)}</h2></div>
      <div class="side"><b style="color:${CLASSES[D.opp].color}">${tr("Класс", "Class")} ${D.opp}</b><div class="faces">${face(ctx.leader, { size: "xs" })}</div><span class="pow">?</span></div></div>
    ${note ? `<div class="note">${note}</div>` : ""}
    <div class="choices">
      ${E.game && D.tokens && !bonus ? `<button class="btn" id="step">🎖️ ${tr("Вмешаться самому", "Step in yourself")}</button>` : ""}
      <button class="btn primary" id="play">${tr("Начать", "Start")} →</button></div>
    <div class="results-row">${D.results.map(r => `<span class="${r.win ? "w" : "l"}">${EVENTS[r.ev].icon}</span>`).join("")}</div>
  </section>`);
  $("#play").onclick = () => resolveEvent(ev, mine, bonus);
  $("#step")?.addEventListener("click", () => { D.tokens--; GAMES[E.game](b => event(b > 0 ? tr(`Командир добавил команде ${Math.round(b * 100)}%.`, `The commander boosted the team by ${Math.round(b * 100)}%.`) : tr("Вмешательство не помогло.", "Stepping in didn't help."), b)); });
}
function resolveEvent(ev, mine, bonus) {
  const me_ = mine * (1 + bonus) * (.85 + Math.random() * .3), them = oppPower(ev) * (.85 + Math.random() * .3);
  const win = me_ >= them;
  D.wins[win ? "D" : "O"]++; D.results.push({ ev, win, a: Math.round(me_), b: Math.round(them) });
  const done = D.wins.D >= 4 || D.wins.O >= 4 || D.idx >= 6;
  const leader = ctx.leader;
  ctx.frame(`<div class="exam-bar"><span>♟️ ${tr("Дисциплина", "Event")} <b>${D.idx + 1}/7</b></span><span>D <b>${D.wins.D}</b> : <b>${D.wins.O}</b> ${D.opp}</span></div>
    <section class="paper duel"><div class="vs"><div class="side"><b>D</b><span class="pow">${Math.round(me_)}</span></div><div class="mid"><span class="ei big">${EVENTS[ev].icon}</span><h2 class="${win ? "good" : "bad"}">${win ? tr("Победа класса D", "Class D wins") : tr(`Победа класса ${D.opp}`, `Class ${D.opp} wins`)}</h2></div><div class="side"><b>${D.opp}</b><span class="pow">${Math.round(them)}</span></div></div>
    ${line(leader, win ? tr("Неплохо. Но это ещё не конец.", "Not bad. But it isn't over.") : tr("Как я и рассчитывал.", "Just as I calculated."), win ? "angry" : "smile")}
    <button class="btn primary" id="next">${done ? tr("Итоги дуэли", "Duel results") : tr("Следующая дисциплина", "Next event")} →</button></section>`);
  $("#next").onclick = () => { if (done) return finish(); D.idx++; event(); };
}

// ── commander mini-games: call back(bonus) with 0 … .35
const GAMES = {
  code(back) {
    const digits = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3), tries = [];
    const draw = (cur = []) => {
      ctx.frame(`<section class="paper mini-g"><h2>🔐 ${tr("Взломайте код", "Crack the code")}</h2><p class="dim">${tr("Три разные цифры от 1 до 6. ● — цифра на своём месте, ○ — цифра есть, но не там. Шесть попыток.", "Three different digits from 1 to 6. ● right digit, right place; ○ right digit, wrong place. Six tries.")}</p>
        <div class="tries">${tries.map(t => `<div class="try">${t.g.join(" ")} <span>${"●".repeat(t.b)}${"○".repeat(t.w)}</span></div>`).join("")}</div>
        <div class="cur">${[0, 1, 2].map(i => `<b>${cur[i] ?? "_"}</b>`).join("")}</div>
        <div class="pad6">${[1, 2, 3, 4, 5, 6].map(d => `<button data-d="${d}" ${cur.includes(d) ? "disabled" : ""}>${d}</button>`).join("")}<button data-d="x">⌫</button></div></section>`);
      $(".pad6").onclick = e => { const b = e.target.closest("[data-d]"); if (!b) return; if (b.dataset.d === "x") return draw(cur.slice(0, -1)); const c = [...cur, +b.dataset.d];
        if (c.length < 3) return draw(c);
        const bl = c.filter((d, i) => digits[i] === d).length, wh = c.filter(d => digits.includes(d)).length - bl; tries.push({ g: c, b: bl, w: wh });
        if (bl === 3) return back(clamp(.4 - tries.length * .05, .1, .35));
        if (tries.length >= 6) return back(0);
        draw(); };
    };
    draw();
  },
  quiz(back) {
    const qs = shuffle(trivia).slice(0, 3); let i = 0, ok = 0;
    const draw = () => {
      const q = qs[i], opts = shuffle([0, 1, 2, 3]), L = G.lang === "ru" ? "ru" : "en";
      ctx.frame(`<section class="paper mini-g"><h2>❓ ${tr("Вопрос", "Question")} ${i + 1}/3</h2><p class="q">${esc(q.q[L])}</p><div class="pills col">${opts.map(o => `<button class="pill" data-o="${o}">${esc(q.a[o][L])}</button>`).join("")}</div></section>`);
      $(".pills").onclick = e => { const b = e.target.closest("[data-o]"); if (!b) return; if (+b.dataset.o === 0) ok++; toast(+b.dataset.o === 0 ? "✓" : "✗ " + esc(q.a[0][L])); i++; i < 3 ? draw() : back(ok * .11); };
    };
    draw();
  },
  rps(back) {
    const opp = D.opp, moves = ["rock", "paper", "scissors"], icon = { rock: "✊", paper: "✋", scissors: "✌️" }, beats = { rock: "scissors", paper: "rock", scissors: "paper" };
    let round = 0, w = 0, l = 0, last = "", hist = [];
    const aiMove = () => opp === "C" ? (Math.random() < .5 ? "rock" : pick(moves)) : opp === "A" ? (last ? Object.keys(beats).find(k => beats[k] === last) : pick(moves)) : moves[round % 3];
    const draw = (msg = "") => {
      ctx.frame(`<section class="paper mini-g"><h2>✊ ${tr("Раунд", "Round")} ${Math.min(round + 1, 5)}/5 · ${w}:${l}</h2><p class="dim">${tr("У каждого командира есть привычка. Заметьте её.", "Every commander has a habit. Spot it.")}</p>${msg ? `<p class="note">${msg}</p>` : ""}<div class="hist">${hist.join(" ")}</div>
        <div class="pills">${moves.map(m => `<button class="pill big" data-m="${m}">${icon[m]}</button>`).join("")}</div></section>`);
      $(".pills").onclick = e => { const b = e.target.closest("[data-m]"); if (!b) return; const m = b.dataset.m, a = aiMove();
        const r = beats[m] === a ? 1 : beats[a] === m ? -1 : 0; if (r > 0) w++; if (r < 0) l++; last = m; round++;
        hist.push(`<span class="${r > 0 ? "w" : r < 0 ? "l" : ""}">${icon[m]}${icon[a]}</span>`);
        if (round >= 5) return back(clamp((w - l) * .09, 0, .35));
        draw(r > 0 ? tr("Победа!", "Win!") : r < 0 ? tr("Поражение.", "Loss.") : tr("Ничья.", "Draw.")); };
    };
    draw();
  },
};

function finish() {
  const win = D.wins.D > D.wins.O, cp = { D: win ? 100 : -100 }; cp[D.opp] = win ? -100 : 100;
  const lines = D.results.map(r => `${EVENTS[r.ev].icon} ${en(r.ev)}: ${r.a} — ${r.b} ${r.win ? "✅" : "❌"}`);
  const trustD = {}; Object.values(D.lineup).flat().forEach(id => { if (id !== "you") trustD[id] = (trustD[id] || 0) + (win ? 4 : 1); });
  ctx.done({ headline: win ? tr(`Класс D победил класс ${D.opp} со счётом ${D.wins.D}:${D.wins.O}`, `Class D beat Class ${D.opp} ${D.wins.D}:${D.wins.O}`) : tr(`Класс ${D.opp} победил со счётом ${D.wins.O}:${D.wins.D}`, `Class ${D.opp} won ${D.wins.O}:${D.wins.D}`),
    lines, cp, pp: win ? 200 : 0, trust: trustD, usedIntel: D.usedIntel });
}
