// Equilibrium: you and five AI players with hidden characters. Eight rounds of small games from game theory,
// each with a round of talk first: public pledges, deals (handshake or binding), bribes and spying.
// Every two rounds the table votes someone out. The last two play split or steal.
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rnd = n => Math.random() * n | 0;
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const SAVE = "equilibrium-v1";
let S = null;
const lang = () => S?.lang || (() => { try { return localStorage.getItem("eq-lang") || ((navigator.language || "").startsWith("ru") ? "ru" : "en"); } catch { return "en"; } })();
const tr = (ru, en) => lang() === "ru" ? ru : en;
const T = o => o[lang()] || o.en;

// ── the cast
const NAMES = [["Ava", "Ава"], ["Boris", "Борис"], ["Vera", "Вера"], ["Gleb", "Глеб"], ["Dina", "Дина"], ["Emil", "Эмиль"], ["Zara", "Зара"], ["Lev", "Лев"], ["Mona", "Мона"], ["Oskar", "Оскар"]];
const SIGILS = [["●", "#ff6b6b"], ["▲", "#ffd166"], ["■", "#4dd4ac"], ["◆", "#5eb5ff"], ["⬢", "#c792ea"], ["★", "#ff9f43"]];
const TYPES = {
  mirror: { ru: "Зеркало", en: "Mirror", d: { ru: "Начинает с доверия и отвечает тем же, что вы сделали ему в прошлый раз.", en: "Starts by trusting, then does to you whatever you did to it last time." } },
  grudge: { ru: "Злопамятный", en: "Grudger", d: { ru: "Честен, пока его не предали. После первого предательства не прощает никогда.", en: "Honest until betrayed. After the first betrayal it never forgives." } },
  fox: { ru: "Лис", en: "Fox", d: { ru: "Первую половину игры сама надёжность. Потом начинает собирать урожай.", en: "Perfectly reliable for the first half. Then it starts to harvest." } },
  saint: { ru: "Святой", en: "Saint", d: { ru: "Всегда сотрудничает и никогда не врёт. Зато голосует против лжецов.", en: "Always cooperates and never lies. But it votes against liars." } },
  shark: { ru: "Акула", en: "Shark", d: { ru: "Почти всегда предаёт и охотно обещает обратное.", en: "Betrays almost every time and happily promises the opposite." } },
  analyst: { ru: "Аналитик", en: "Analyst", d: { ru: "Считает. Доверяет тем, у кого хорошая репутация, в числовых играх думает на шаг дальше других.", en: "Calculates. Trusts those with a good record, and in number games thinks a step ahead." } },
  pavlov: { ru: "Маятник", en: "Pendulum", d: { ru: "Если ход принёс выгоду, повторяет его. Если нет — меняет.", en: "If a move paid off, it repeats it. If not, it switches." } },
};
const ELIM_AFTER = [2, 4, 6, 8], ROUNDS = 8, POT = 20, START = 10;

// ── the games. kind "pair": everyone is paired; "group": everyone plays together.
// opts: choices; num: a number range. coop(v): does this choice count as cooperating (for reputation)?
const CARDS = {
  pd: { kind: "pair", name: { ru: "Дилемма", en: "The Dilemma" },
    rules: { ru: "Вы в паре. Оба сотрудничают: +3 каждому. Оба предают: +1. Один предал: предатель +5, доверившийся 0.", en: "You're in a pair. Both cooperate: +3 each. Both betray: +1. One betrays: the betrayer +5, the trusting one 0." },
    opts: [["C", "Сотрудничать", "Cooperate"], ["D", "Предать", "Betray"]], coop: v => v === "C",
    matrix: [["C", "C", 3, 3], ["C", "D", 0, 5], ["D", "C", 5, 0], ["D", "D", 1, 1]],
    pay: (a, b) => a === "C" ? (b === "C" ? [3, 3] : [0, 5]) : (b === "C" ? [5, 0] : [1, 1]),
    ai: (ai, other) => Math.random() < coopP(ai, other) ? "C" : "D",
    deals: () => [{ mine: "C", theirs: "C", l: { ru: "Оба сотрудничаем", en: "We both cooperate" } }] },
  chicken: { kind: "pair", name: { ru: "Лобовая", en: "Chicken" },
    rules: { ru: "Две машины несутся навстречу. Оба свернули: +2. Свернул один: он +1, второй +4. Никто не свернул: −3 обоим.", en: "Two cars race head-on. Both swerve: +2. One swerves: they get +1, the other +4. Nobody swerves: −3 each." },
    opts: [["S", "Свернуть", "Swerve"], ["T", "Прямо", "Straight"]], coop: v => v === "S",
    matrix: [["S", "S", 2, 2], ["S", "T", 1, 4], ["T", "S", 4, 1], ["T", "T", -3, -3]],
    pay: (a, b) => a === "S" ? (b === "S" ? [2, 2] : [1, 4]) : (b === "S" ? [4, 1] : [-3, -3]),
    ai: (ai, other) => { if (ai.type === "analyst") return coopRate(other) >= .6 ? "T" : "S"; if (ai.type === "shark") return Math.random() < .75 ? "T" : "S"; return Math.random() < coopP(ai, other) ? "S" : "T"; },
    deals: () => [{ mine: "S", theirs: "S", l: { ru: "Оба сворачиваем", en: "We both swerve" } }, { mine: "S", theirs: "T", l: { ru: "Я сверну, ты едешь прямо", en: "I swerve, you go straight" } }] },
  ultimatum: { kind: "pair", roles: true, name: { ru: "Ультиматум", en: "Ultimatum" },
    rules: { ru: "Делите 6 очков. Первый в паре предлагает второму от 1 до 5. Второй заранее называет минимум, на который согласен. Хватило — делят, нет — оба получают 0.", en: "Split 6 points. The first in the pair offers the second 1 to 5. The second secretly sets the minimum they'll accept. Enough: they split. Not enough: both get 0." },
    num: { min: 1, max: 5 }, coop: (v, role) => role === 0 ? v >= 3 : v <= 2,
    pay: (offer, min) => offer >= min ? [6 - offer, offer] : [0, 0],
    ai: (ai, other, role) => {
      const g = mem(ai.id, other).betrayed;
      if (role === 0) return { saint: 3, mirror: 3, grudge: g ? 1 : 3, fox: S.round <= 4 ? 3 : 2, shark: 1, analyst: 2, pavlov: S.lastWin[ai.id] === false ? 3 : 2 }[ai.type];
      return { saint: 1, mirror: 2, grudge: g ? 5 : 2, fox: 2, shark: 3, analyst: 1, pavlov: 2 }[ai.type];
    },
    deals: role => role === 0 ? [{ mine: 3, theirs: 3, l: { ru: "Предлагаю 3, ты соглашаешься на 3", en: "I offer 3, you accept 3" } }] : [{ mine: 3, theirs: 3, l: { ru: "Ты предлагаешь 3, я соглашаюсь на 3", en: "You offer 3, I accept 3" } }] },
  stag: { kind: "group", name: { ru: "Охота на оленя", en: "The Stag Hunt" },
    rules: { ru: "Заяц: +2 гарантированно. Олень: +6, но только если на оленя пошло не меньше 60% игроков. Иначе охотники на оленя получают 0.", en: "Hare: a sure +2. Stag: +6, but only if at least 60% of the players hunt the stag. Otherwise stag hunters get 0." },
    opts: [["S", "Олень", "Stag"], ["H", "Заяц", "Hare"]], coop: v => v === "S",
    resolve: ch => { const ids = Object.keys(ch), need = Math.ceil(ids.length * .6), n = ids.filter(i => ch[i] === "S").length, p = {}; ids.forEach(i => p[i] = ch[i] === "H" ? 2 : n >= need ? 6 : 0); return p; },
    ai: ai => { if (ai.type === "analyst") { const ids = alive(), need = Math.ceil(ids.length * .6), likely = ids.filter(i => i !== ai.id && (S.pledges[i] === "S" ? honest(i) > .5 : coopRate(i) > .7)).length + 1; return likely >= need ? "S" : "H"; } return Math.random() < coopP(ai) ? "S" : "H"; },
    deals: () => [{ mine: "S", theirs: "S", l: { ru: "Оба идём на оленя", en: "We both hunt the stag" } }] },
  pot: { kind: "group", name: { ru: "Общий котёл", en: "The Common Pot" },
    rules: { ru: "Каждый тайно вкладывает от 0 до 4 своих очков. Котёл умножается на 1,5 и делится поровну между всеми, включая тех, кто ничего не вложил.", en: "Each secretly puts 0 to 4 of their points in. The pot is multiplied by 1.5 and shared equally by everyone, including those who put nothing in." },
    num: { min: 0, max: 4 }, coop: v => v >= 3,
    resolve: ch => { const ids = Object.keys(ch), tot = ids.reduce((s, i) => s + ch[i], 0), share = Math.floor(tot * 1.5 / ids.length), p = {}; ids.forEach(i => p[i] = share - ch[i]); return p; },
    ai: ai => ({ saint: 4, mirror: Math.round(4 * (S.groupCoop ?? 1)), grudge: anyBetrayal(ai) ? 1 : 3, fox: S.round <= 4 ? 3 : 0, shark: 0, analyst: 1, pavlov: S.lastWin[ai.id] === false ? (S.lastCoop[ai.id] ? 0 : 3) : (S.lastCoop[ai.id] === false ? 0 : 3) }[ai.type]),
    deals: () => [{ mine: 4, theirs: 4, l: { ru: "Оба вкладываем по 4", en: "We both put in 4" } }] },
  volunteer: { kind: "group", name: { ru: "Доброволец", en: "The Volunteer" },
    rules: { ru: "Если хотя бы один вызовется добровольцем, все получают +3, а каждый доброволец платит 2. Если никто — все получают −2.", en: "If at least one person volunteers, everyone gets +3 and each volunteer pays 2. If nobody does, everyone gets −2." },
    opts: [["V", "Вызваться", "Volunteer"], ["W", "Ждать", "Wait"]], coop: v => v === "V",
    resolve: ch => { const ids = Object.keys(ch), any = ids.some(i => ch[i] === "V"), p = {}; ids.forEach(i => p[i] = any ? 3 - (ch[i] === "V" ? 2 : 0) : -2); return p; },
    ai: ai => { const pl = alive().some(i => i !== ai.id && S.pledges[i] === "V" && honest(i) > .6); const pr = { saint: .9, mirror: .4, grudge: .35, fox: .2, shark: .03, analyst: pl ? 0 : .45, pavlov: .5 }[ai.type]; return Math.random() < pr ? "V" : "W"; },
    deals: () => [{ mine: "W", theirs: "V", l: { ru: "Вызовись ты (за плату)", en: "You volunteer (I'll pay)" } }, { mine: "V", theirs: "W", l: { ru: "Я вызовусь, а ты голосуй за меня", en: "I'll volunteer; you owe me" } }] },
  minority: { kind: "group", name: { ru: "Меньшинство", en: "The Minority" },
    rules: { ru: "Каждый выбирает сторону. Те, кто окажется в меньшинстве, получают +4. Большинство получает 0. При равенстве все получают +1.", en: "Everyone picks a side. Those who end up in the minority get +4. The majority gets 0. On a tie everyone gets +1." },
    opts: [["A", "Левая", "Left"], ["B", "Правая", "Right"]], coop: () => null,
    resolve: ch => { const ids = Object.keys(ch), a = ids.filter(i => ch[i] === "A").length, b = ids.length - a, p = {}; ids.forEach(i => p[i] = a === b ? 1 : (ch[i] === "A") === (a < b) ? 4 : 0); return p; },
    ai: ai => { if (ai.type === "analyst") { const a = alive().filter(i => S.pledges[i] === "A").length, b = alive().filter(i => S.pledges[i] === "B").length; return a > b ? "B" : b > a ? "A" : pick(["A", "B"]); } if (ai.type === "pavlov" && S.lastChoice[ai.id] && S.lastCard === "minority") return S.lastWin[ai.id] ? S.lastChoice[ai.id] : S.lastChoice[ai.id] === "A" ? "B" : "A"; return pick(["A", "B"]); },
    deals: () => [{ mine: "A", theirs: "B", l: { ru: "Расходимся: я налево, ты направо", en: "We split: me left, you right" } }] },
  twothirds: { kind: "group", name: { ru: "Две трети", en: "Two Thirds" },
    rules: { ru: "Назовите число от 0 до 100. Побеждает тот, кто ближе всех к 2/3 от среднего всех чисел: +6. Подумайте, что назовут остальные… и что они думают о вас.", en: "Name a number from 0 to 100. Whoever is closest to 2/3 of the average of all numbers wins +6. Think about what the others will say… and what they think you'll say." },
    num: { min: 0, max: 100 }, coop: () => null,
    resolve: ch => { const ids = Object.keys(ch), avg = ids.reduce((s, i) => s + ch[i], 0) / ids.length, t = avg * 2 / 3, best = Math.min(...ids.map(i => Math.abs(ch[i] - t))), p = {}; ids.forEach(i => p[i] = Math.abs(ch[i] - t) === best ? 6 : 0); p._target = Math.round(t * 10) / 10; return p; },
    ai: ai => clamp(Math.round({ saint: 50, mirror: 33, grudge: 30, fox: 22, shark: 20 + rnd(45), analyst: 14 + rnd(6), pavlov: 38 }[ai.type] + (Math.random() * 8 - 4)), 0, 100),
    deals: () => [] },
  auction: { kind: "group", name: { ru: "Аукцион", en: "The Auction" },
    rules: { ru: "Разыгрывается приз в 8 очков. Каждый тайно ставит от 0 до 6. Наибольшая ставка выигрывает приз, но платят ВСЕ — каждый свою ставку. Ничья наверху: приз не достаётся никому.", en: "A prize of 8 points. Everyone secretly bids 0 to 6. The highest bid wins the prize, but EVERYONE pays their own bid. A tie at the top: nobody gets the prize." },
    num: { min: 0, max: 6 }, coop: v => v <= 1,
    resolve: ch => { const ids = Object.keys(ch), top = Math.max(...ids.map(i => ch[i])), w = ids.filter(i => ch[i] === top), p = {}; ids.forEach(i => p[i] = -ch[i] + (w.length === 1 && w[0] === i && top > 0 ? 8 : 0)); return p; },
    ai: ai => ({ saint: 0, mirror: 2, grudge: 2, fox: S.round <= 4 ? 2 : 4, shark: 5 + rnd(2), analyst: 3, pavlov: 1 + rnd(3) }[ai.type]),
    deals: () => [{ mine: 0, theirs: 0, l: { ru: "Оба ставим 0 (сговор)", en: "We both bid 0 (collusion)" } }] },
  tax: { kind: "group", name: { ru: "Налог на лидера", en: "The Leader Tax" },
    rules: { ru: "Голосование: если больше половины скажут «Да», лидер по очкам платит 4, и они делятся между остальными.", en: "A vote: if more than half say Yes, the points leader pays 4, shared among everyone else." },
    opts: [["Y", "Да", "Yes"], ["N", "Нет", "No"]], coop: () => null,
    resolve: ch => { const ids = Object.keys(ch), yes = ids.filter(i => ch[i] === "Y").length, p = {}; ids.forEach(i => p[i] = 0);
      if (yes * 2 > ids.length) { const top = Math.max(...ids.map(i => P(i).score)), lead = ids.filter(i => P(i).score === top); const others = ids.filter(i => !lead.includes(i)); if (others.length) { lead.forEach(l => p[l] -= 4); const share = Math.floor(4 * lead.length / others.length); others.forEach(o => p[o] += share); } p._taxed = lead; } return p; },
    ai: ai => { const top = Math.max(...alive().map(i => P(i).score)); if (ai.score === top) return "N"; const leaders = alive().filter(i => P(i).score === top);
      const bad = leaders.some(l => mem(ai.id, l).betrayed || (S.rep[l]?.broken || 0) > 1);
      const pr = { shark: .95, fox: .8, analyst: 1, saint: bad ? .9 : .3, mirror: bad ? .9 : .5, grudge: bad ? 1 : .4, pavlov: .5 }[ai.type]; return Math.random() < pr ? "Y" : "N"; },
    deals: () => [{ mine: "Y", theirs: "Y", l: { ru: "Оба голосуем «Да»", en: "We both vote Yes" } }, { mine: "N", theirs: "N", l: { ru: "Оба голосуем «Нет»", en: "We both vote No" } }] },
};

// ── state helpers
const P = id => S.players.find(p => p.id === id);
const alive = () => S.players.filter(p => !p.out).map(p => p.id);
const ais = () => S.players.filter(p => !p.out && p.id !== "you");
const nm = id => id === "you" ? tr("Вы", "You") : esc(P(id).name[lang() === "ru" ? 1 : 0]);
const sig = id => { const p = P(id); return `<i class="sig" style="--c:${p.color}">${p.sig}</i>`; };
const who = id => `<span class="who">${sig(id)}${nm(id)}</span>`;
function mem(a, b) { S.mem[a] = S.mem[a] || {}; return S.mem[a][b] = S.mem[a][b] || { last: null, betrayed: false, kept: 0, coop: 0, def: 0 }; }
const coopRate = id => { const r = S.rep[id] || {}; const c = r.coop || 0, d = r.def || 0; return (c + 1) / (c + d + 1.4); };
const honest = id => { const r = S.rep[id] || {}; return ((r.kept || 0) + 1) / ((r.kept || 0) + (r.broken || 0) + 1.3); };
const anyBetrayal = ai => alive().some(i => i !== ai.id && mem(ai.id, i).betrayed);
// how likely this AI is to cooperate with `other` (or with the group when other is empty)
function coopP(ai, other) {
  const m = other ? mem(ai.id, other) : null, r = S.round;
  switch (ai.type) {
    case "saint": return 1;
    case "mirror": return other ? (m.last === null ? 1 : m.last ? .95 : .05) : (S.groupCoop ?? 1) >= .5 ? .95 : .2;
    case "grudge": return other ? (m.betrayed ? 0 : .97) : anyBetrayal(ai) ? .25 : .95;
    case "fox": return r <= 4 ? .92 : .12;
    case "shark": return .1;
    case "analyst": { const rate = other ? coopRate(other) : (S.groupCoop ?? .6); return rate >= .6 ? .85 : .15; }
    case "pavlov": { const w = S.lastWin[ai.id], c = S.lastCoop[ai.id]; if (w === undefined) return .75; return w ? (c ? .9 : .1) : (c ? .1 : .9); }
  }
  return .5;
}
// AI trust in you, 0..1
function trustYou(ai) {
  const t = S.trust[ai.id] ?? .6;
  if (ai.type === "shark") return .95;
  if (ai.type === "saint") return Math.max(.7, t);
  if (ai.type === "grudge" && mem(ai.id, "you").betrayed) return 0;
  if (ai.type === "analyst") return (t + honest("you")) / 2;
  return t;
}
const save = () => { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch { } };

// ── new game
function newGame(l) {
  const names = shuffle(NAMES).slice(0, 5), types = shuffle(Object.keys(TYPES)).slice(0, 5), sigs = shuffle(SIGILS);
  const players = [{ id: "you", name: ["You", "Вы"], sig: sigs[0][0], color: sigs[0][1], type: "", score: START, out: false }];
  names.forEach((n, i) => players.push({ id: "p" + i, name: n, sig: sigs[i + 1][0], color: sigs[i + 1][1], type: types[i], score: START, out: false }));
  const deck = shuffle(["pd", "pd", "stag", "pot", "chicken", "volunteer", "twothirds", "auction", "ultimatum", "minority", "tax"]);
  // two dilemmas guaranteed, never back to back
  S = { lang: l, round: 0, phase: "intro", players, deck, card: "", pairs: [], sit: "", roles: {}, words: 2, pledges: {}, deals: [], spied: {}, intents: {}, mine: null,
    trust: {}, mem: {}, rep: {}, lastWin: {}, lastCoop: {}, lastChoice: {}, lastCard: "", groupCoop: null, log: [], notes: {}, outOrder: [], reveal: null, vote: null, final: null, talk: [] };
  players.forEach(p => { S.rep[p.id] = { kept: 0, broken: 0, coop: 0, def: 0 }; if (p.id !== "you") S.trust[p.id] = .6; });
}

// ── round flow
function startRound() {
  S.round++; S.card = S.deck.shift() || "pd"; S.words = 2; S.pledges = {}; S.deals = []; S.spied = {}; S.mine = null; S.talk = []; S.reveal = null; S.roles = {};
  const card = CARDS[S.card];
  if (card.kind === "pair") {
    const ids = shuffle(alive()); S.pairs = []; S.sit = "";
    for (let i = 0; i + 1 < ids.length; i += 2) { S.pairs.push([ids[i], ids[i + 1]]); if (card.roles) { S.roles[ids[i]] = 0; S.roles[ids[i + 1]] = 1; } }
    if (ids.length % 2) S.sit = ids[ids.length - 1];
  }
  // AI intentions, then what they say about them
  for (const a of ais()) S.intents[a.id] = decide(a);
  for (const a of shuffle(ais())) { const st = aiPledge(a); if (st !== undefined) { S.pledges[a.id] = st; S.talk.push({ by: a.id, kind: "pledge", v: st }); } }
  S.phase = "talk"; save(); render();
}
const partnerOf = id => { const pr = S.pairs.find(p => p.includes(id)); return pr ? pr.find(x => x !== id) : ""; };
function decide(a) {
  const card = CARDS[S.card];
  if (card.kind === "pair") { const o = partnerOf(a.id); return o ? card.ai(a, o, S.roles[a.id]) : null; }
  return card.ai(a);
}
// what an AI says it will do; liars say the cooperative thing
function aiPledge(a) {
  const card = CARDS[S.card], v = S.intents[a.id];
  if (v === null || v === undefined) return undefined;
  if (S.card === "twothirds" && Math.random() < .5) return undefined;
  if (Math.random() < .25 && !["shark", "fox"].includes(a.type)) return undefined; // some stay quiet
  const lies = a.type === "shark" ? .75 : a.type === "fox" && S.round > 4 ? .65 : 0;
  if (Math.random() < lies) {
    if (card.opts) { const co = card.opts.map(o => o[0]).find(x => card.coop(x, S.roles[a.id]) === true); return co || pick(card.opts)[0]; }
    if (S.card === "pot") return 4; if (S.card === "auction") return 0; if (S.card === "ultimatum") return 3; return clamp(v + 15, 0, 100);
  }
  return v;
}

// ── your talk actions
function doPledge(v) { S.pledges.you = v; S.words--; S.talk.push({ by: "you", kind: "pledge", v }); if (CARDS[S.card].kind === "group") for (const a of ais()) S.intents[a.id] = decide(a); save(); render(); }
function doDeal(aid, idx, binding, pay) {
  const a = P(aid), card = CARDS[S.card], d = card.deals(S.roles.you)[idx];
  S.words--; if (binding) S.players[0].score -= 1;
  const want = trustYou(a) + pay * .08 + (binding ? .22 : 0) + (S.intents[aid] === d.theirs ? .2 : 0);
  const ok = a.type === "shark" || want > .55;
  const deal = { with: aid, mine: d.mine, theirs: d.theirs, binding, pay, ok, l: d.l };
  S.deals.push(deal);
  if (ok) {
    const comply = binding ? (a.type === "shark" ? Math.random() < .7 : true)
      : { saint: true, mirror: true, grudge: !mem(aid, "you").betrayed, analyst: honest("you") > .55, fox: S.round <= 4 || Math.random() < .4, pavlov: Math.random() < .7, shark: Math.random() < .25 }[a.type];
    if (comply) S.intents[aid] = d.theirs;
  }
  S.talk.push({ by: aid, kind: "deal", ok, deal });
  save(); render();
}
function doSpy(aid) { S.words--; S.players[0].score -= 2; S.spied[aid] = S.intents[aid]; S.talk.push({ by: "you", kind: "spy", on: aid }); save(); render(); }
function doBribe(aid, n) { S.words--; P("you").score -= n; P(aid).score += n; S.trust[aid] = clamp((S.trust[aid] ?? .6) + n * .1, 0, 1); S.talk.push({ by: aid, kind: "bribe", n }); save(); render(); }

// ── reveal
function lockIn(v) {
  S.mine = v;
  const card = CARDS[S.card], ch = { you: v };
  for (const a of ais()) ch[a.id] = S.intents[a.id];
  const pay = {}; alive().forEach(i => pay[i] = 0);
  let extra = {};
  if (card.kind === "pair") {
    for (const [a, b] of S.pairs) { const [pa, pb] = card.pay(ch[a], ch[b]); pay[a] += pa; pay[b] += pb; }
    if (S.sit) pay[S.sit] += 1;
  } else { const r = card.resolve(Object.fromEntries(alive().map(i => [i, ch[i]]))); for (const k in r) if (k.startsWith("_")) extra[k] = r[k]; else pay[k] += r[k]; }
  // deals: side payments, binding penalties, betrayals
  const notes = [];
  for (const d of S.deals.filter(d => d.ok)) {
    const theyKept = ch[d.with] === d.theirs, iKept = v === d.mine;
    if (theyKept && d.pay) { pay.you -= d.pay; pay[d.with] += d.pay; }
    if (d.binding) {
      if (!theyKept) { pay[d.with] -= 5; pay.you += 5; notes.push(tr(`${nm(d.with)} нарушил(а) договор с неустойкой: −5 ему, +5 вам.`, `${nm(d.with)} broke a binding deal: −5 to them, +5 to you.`)); }
      if (!iKept) { pay.you -= 5; pay[d.with] += 5; notes.push(tr(`Вы нарушили договор с неустойкой: −5.`, `You broke a binding deal: −5.`)); }
    }
    if (!iKept) { mem(d.with, "you").betrayed = true; S.trust[d.with] = clamp((S.trust[d.with] ?? .6) - .4, 0, 1); S.rep.you.broken++; } else S.rep.you.kept++;
    if (!theyKept) S.rep[d.with].broken++; else S.rep[d.with].kept++;
  }
  // public pledges
  const pledgeRes = {};
  for (const id in S.pledges) { const kept = ch[id] === S.pledges[id]; pledgeRes[id] = kept; kept ? S.rep[id].kept++ : S.rep[id].broken++; if (!kept && id === "you") ais().forEach(a => S.trust[a.id] = clamp((S.trust[a.id] ?? .6) - .15, 0, 1)); }
  // memory and reputation
  let coopN = 0, coopTot = 0;
  for (const i of alive()) {
    if (ch[i] === null || ch[i] === undefined) continue;
    const c = card.coop(ch[i], S.roles[i]);
    if (c !== null && c !== undefined) { coopTot++; if (c) { coopN++; S.rep[i].coop++; } else S.rep[i].def++; }
  }
  if (card.kind === "pair") for (const [a, b] of S.pairs) {
    const ca = card.coop(ch[a], S.roles[a]), cb = card.coop(ch[b], S.roles[b]);
    mem(a, b).last = cb; mem(b, a).last = ca;
    if (ca && !cb) { mem(a, b).betrayed = true; if (a !== "you" && b === "you") S.trust[a] = clamp((S.trust[a] ?? .6) - .3, 0, 1); }
    if (cb && !ca) { mem(b, a).betrayed = true; if (b !== "you" && a === "you") S.trust[b] = clamp((S.trust[b] ?? .6) - .3, 0, 1); }
  } else for (const a of alive()) for (const b of alive()) if (a !== b) { const cb = card.coop(ch[b]); if (cb !== null && cb !== undefined) mem(a, b).last = cb; }
  if (coopTot) S.groupCoop = coopN / coopTot;
  for (const i of alive()) { P(i).score += pay[i]; if (ch[i] === null || ch[i] === undefined) continue; S.lastWin[i] = pay[i] >= 2; S.lastChoice[i] = ch[i]; const c = card.coop(ch[i], S.roles[i]); S.lastCoop[i] = c === null ? S.lastCoop[i] : c; }
  S.lastCard = S.card;
  S.reveal = { ch, pay, pledgeRes, notes, extra };
  S.phase = "reveal"; save(); render();
}

// ── elimination vote
function voteScores(a) {
  const ids = alive().filter(i => i !== a.id), mean = ids.reduce((s, i) => s + P(i).score, 0) / ids.length;
  const W = { shark: [1, 0], fox: [.9, .3], analyst: [1.2, .8], mirror: [.3, 1.5], grudge: [.3, 1], saint: [0, 2], pavlov: [.5, .5] }[a.type];
  const sc = {};
  for (const c of ids) {
    let s = (P(c).score - mean) * W[0] + (S.rep[c].broken || 0) * W[1] + (mem(a.id, c).betrayed ? 8 : 0) + Math.random() * 1.5;
    if (c === "you") s -= trustYou(a) * 4; else s -= mem(a.id, c).coop * .3;
    sc[c] = s;
  }
  return sc;
}
function startVote() {
  const v = { lobby: null, ballots: {}, lean: {} };
  for (const a of ais()) { const sc = voteScores(a); v.lean[a.id] = Object.keys(sc).sort((x, y) => sc[y] - sc[x])[0]; }
  S.vote = v; S.phase = "vote"; save(); render();
}
function lobby(aid, target) {
  const a = P(aid), sc = voteScores(a), top = Math.max(...Object.values(sc));
  const ok = target !== aid && (sc[target] >= top - 3 || trustYou(a) > .78);
  S.vote.lobby = { aid, target, ok };
  if (ok) S.vote.lean[aid] = target;
  save(); render();
}
function castVote(target) {
  const v = S.vote; v.ballots = { you: target };
  for (const a of ais()) v.ballots[a.id] = v.lean[a.id];
  const count = {}; Object.values(v.ballots).forEach(t => count[t] = (count[t] || 0) + 1);
  const max = Math.max(...Object.values(count));
  let out = Object.keys(count).filter(t => count[t] === max);
  if (out.length > 1) { const lo = Math.min(...out.map(t => P(t).score)); out = out.filter(t => P(t).score === lo); }
  v.out = pick(out); v.count = count;
  P(v.out).out = true; S.outOrder.push(v.out);
  S.phase = "voted"; save(); render();
}

// ── the final: split or steal
function startFinal() {
  const opp = ais()[0];
  const said = { saint: "split", mirror: coopRate("you") >= .6 ? "split" : "steal", grudge: mem(opp.id, "you").betrayed ? "steal" : "split", fox: "split", shark: "split", analyst: honest("you") >= .6 ? "split" : "steal", pavlov: "split" }[opp.type];
  S.final = { opp: opp.id, said, msg: "" }; S.phase = "final"; save(); render();
}
function finalTalk(msg) { S.final.msg = msg; save(); render(); }
function finalChoose(v) {
  const F = S.final, opp = P(F.opp);
  let o = { saint: "split", mirror: coopRate("you") >= .6 ? "split" : "steal", grudge: mem(opp.id, "you").betrayed ? "steal" : "split", fox: "steal", shark: "steal", analyst: honest("you") >= .65 ? "split" : "steal", pavlov: Math.random() < .5 ? "split" : "steal" }[opp.type];
  if (F.msg === "share" && ["mirror", "analyst", "pavlov", "grudge"].includes(opp.type)) o = "split"; // the steal-then-share trick
  F.mine = v; F.theirs = o;
  if (v === "split" && o === "split") { P("you").score += POT / 2; opp.score += POT / 2; }
  else if (v === "steal" && o === "split") P("you").score += POT;
  else if (v === "split" && o === "steal") opp.score += POT;
  S.phase = "end"; save(); render();
}

// ── rendering
function frame(main, side = true) {
  document.documentElement.lang = lang();
  $("#app").innerHTML = `<header class="top"><a class="brand" href="./">◐ ${tr("Равновесие", "Equilibrium")}</a>
    ${S && S.round ? `<span class="chip">${tr("Раунд", "Round")} <b>${Math.min(S.round, ROUNDS)}/${ROUNDS}</b></span><span class="chip">${tr("Вы", "You")}: <b>${P("you").score}</b></span>${nextVote() ? `<span class="chip warn">${tr("Голосование после раунда", "Vote after round")} ${nextVote()}</span>` : ""}` : ""}
    <button class="lang" id="lang">${lang() === "ru" ? "EN" : "RU"}</button></header>
    <div class="layout ${side && S?.round ? "" : "solo"}">${side && S?.round ? `<aside class="table">${table()}</aside>` : ""}<main class="board">${main}</main></div>`;
  $("#lang").onclick = () => { const l = lang() === "ru" ? "en" : "ru"; try { localStorage.setItem("eq-lang", l); } catch { } if (S) S.lang = l; save(); S ? render() : title(); };
  document.querySelectorAll("[data-note]").forEach(sel => sel.onchange = () => { S.notes[sel.dataset.note] = sel.value; save(); });
}
const nextVote = () => ELIM_AFTER.find(r => r >= S.round && S.phase !== "end");
function table() {
  return `<h3>${tr("Игроки", "Players")}</h3>${S.players.map(p => { const r = S.rep[p.id];
    return `<div class="seat ${p.out ? "out" : ""} ${p.id === "you" ? "me" : ""}">
      <div class="sh">${sig(p.id)}<b>${nm(p.id)}</b><span class="sc">${p.score}</span></div>
      <div class="stats"><span title="${tr("Сдержал слово / нарушил", "Kept word / broke it")}">🤝 ${r.kept}/<em>${r.broken}</em></span><span title="${tr("Сотрудничал / предал", "Cooperated / betrayed")}">⚖ ${r.coop}/<em>${r.def}</em></span>${p.id !== "you" && !p.out ? `<span title="${tr("Насколько доверяет вам", "How much it trusts you")}">♡ ${Math.round((S.trust[p.id] ?? .6) * 100)}</span>` : ""}</div>
      ${p.id !== "you" ? `<select data-note="${p.id}" aria-label="${tr("Ваша догадка", "Your guess")}"><option value="">${tr("Кто это?", "Who is it?")}</option>${Object.keys(TYPES).map(t => `<option value="${t}" ${S.notes[p.id] === t ? "selected" : ""}>${T(TYPES[t])}</option>`).join("")}</select>` : ""}
      ${p.out ? `<small>${tr("выбыл", "out")}</small>` : ""}</div>`; }).join("")}
    <details class="types"><summary>${tr("Возможные характеры", "Possible characters")}</summary>${Object.keys(TYPES).map(t => `<p><b>${T(TYPES[t])}</b> — ${T(TYPES[t].d)}</p>`).join("")}<p class="dim">${tr("За столом пять из семи. Повторов нет.", "Five of the seven are at the table. No repeats.")}</p></details>`;
}
const optLabel = (card, v, role) => card.opts ? (card.opts.find(o => o[0] === v) || [, "?", "?"])[lang() === "ru" ? 1 : 2] : (S.card === "ultimatum" ? (role === 0 ? tr("предложу ", "offer ") : tr("минимум ", "min ")) + v : String(v));
function cardBox(card) {
  let viz = "";
  if (card.matrix) viz = `<table class="matrix"><tr><th></th>${card.opts.map(o => `<th>${tr("Он", "They")}: ${o[lang() === "ru" ? 1 : 2]}</th>`).join("")}</tr>${card.opts.map(o => `<tr><th>${tr("Вы", "You")}: ${o[lang() === "ru" ? 1 : 2]}</th>${card.opts.map(o2 => { const m = card.matrix.find(x => x[0] === o[0] && x[1] === o2[0]); return `<td><b>${m[2]}</b> / ${m[3]}</td>`; }).join("")}</tr>`).join("")}</table>`;
  const partner = card.kind === "pair" ? (S.sit === "you" ? `<p class="note">${tr("Вам не хватило пары: отдыхаете и получаете +1.", "You have no partner this round: you rest and get +1.")}</p>`
    : `<p class="partner">${tr("Ваша пара", "Your partner")}: ${who(partnerOf("you"))}${card.roles ? ` · ${S.roles.you === 0 ? tr("вы предлагаете", "you make the offer") : tr("вы принимаете решение", "you respond")}` : ""}</p>`) : "";
  return `<section class="card"><p class="kicker">${tr("Раунд", "Round")} ${S.round} · ${card.kind === "pair" ? tr("в парах", "in pairs") : tr("все вместе", "everyone")}</p><h2>${T(card.name)}</h2><p>${T(card.rules)}</p>${viz}${partner}</section>`;
}
function talkFeed() {
  const card = CARDS[S.card];
  return S.talk.map(t => {
    if (t.kind === "pledge") return `<div class="msg">${who(t.by)}: «${tr("Я выберу:", "I'll pick:")} <b>${optLabel(card, t.v, S.roles[t.by])}</b>»</div>`;
    if (t.kind === "deal") return `<div class="msg ${t.ok ? "ok" : "no"}">${who(t.by)} ${t.ok ? tr("принимает сделку", "accepts the deal") : tr("отказывается от сделки", "turns down the deal")}: «${T(t.deal.l)}»${t.deal.binding ? " · ⚖ " + tr("с неустойкой", "binding") : ""}${t.deal.pay ? ` · ${t.deal.pay}` : ""}</div>`;
    if (t.kind === "spy") return `<div class="msg spy">🔍 ${tr("Ваш шпион", "Your spy")}: ${who(t.on)} ${tr("собирается выбрать", "is about to pick")} <b>${optLabel(card, S.spied[t.on], S.roles[t.on])}</b></div>`;
    if (t.kind === "bribe") return `<div class="msg">🎁 ${tr("Вы передали", "You gave")} ${who(t.by)} ${t.n} ${tr("очк.", "pts")}</div>`;
    return "";
  }).join("") || `<p class="dim">${tr("Пока все молчат.", "Everyone is quiet for now.")}</p>`;
}
function choiceControls(card, id) {
  if (card.opts) return `<div class="opts">${card.opts.map(o => `<button class="opt" data-${id}="${o[0]}">${o[lang() === "ru" ? 1 : 2]}</button>`).join("")}</div>`;
  const { min, max } = card.num;
  return `<div class="numpick"><input type="range" min="${min}" max="${max}" value="${Math.round((min + max) / 2)}" id="${id}-r"><output id="${id}-o">${Math.round((min + max) / 2)}</output><button class="btn" data-${id}-num>${tr("Выбрать", "Choose")}</button></div>`;
}
function bindChoice(id, fn) {
  document.querySelectorAll(`[data-${id}]`).forEach(b => b.onclick = () => fn(b.dataset[id]));
  const r = $(`#${id}-r`); if (r) { r.oninput = () => $(`#${id}-o`).textContent = r.value; $(`[data-${id}-num]`).onclick = () => fn(+r.value); }
}

function render() {
  if (!S) return title();
  const card = CARDS[S.card];
  if (S.phase === "talk") {
    const youPlay = !(card.kind === "pair" && S.sit === "you");
    const targets = card.kind === "pair" ? [partnerOf("you")].filter(Boolean) : ais().map(a => a.id);
    const deals = youPlay ? card.deals(S.roles.you) : [];
    frame(`${cardBox(card)}
      <section class="panel"><h3>${tr("Переговоры", "Talk")} <span class="dim">· ${tr("действий осталось", "actions left")}: ${S.words}</span></h3>
        <div class="feed">${talkFeed()}</div>
        ${S.words && youPlay ? `<div class="acts">
          ${S.pledges.you === undefined ? `<div class="act"><b>📣 ${tr("Публичное обещание", "Public pledge")}</b><p class="dim">${tr("Все увидят, сдержали ли вы его.", "Everyone will see whether you kept it.")}</p>${choiceControls(card, "pledge")}</div>` : ""}
          ${deals.length && targets.length ? `<div class="act"><b>🤝 ${tr("Сделка", "Deal")}</b>
            <select id="dw">${targets.map(t => `<option value="${t}">${nm(t)}</option>`).join("")}</select>
            <select id="dd">${deals.map((d, i) => `<option value="${i}">${T(d.l)}</option>`).join("")}</select>
            <label class="row"><input type="checkbox" id="db"> ⚖ ${tr("С неустойкой: стоит 1, нарушитель платит 5", "Binding: costs 1, the breaker pays 5")}</label>
            <label class="row">${tr("Доплатить, если выполнит:", "Pay if they comply:")} <select id="dp"><option>0</option><option>1</option><option>2</option><option>3</option></select></label>
            <button class="btn" id="dgo">${tr("Предложить", "Propose")}</button></div>` : ""}
          <div class="act"><b>🔍 ${tr("Шпион", "Spy")} · −2</b><p class="dim">${tr("Узнать, что игрок собирается выбрать сейчас.", "Learn what a player plans to pick right now.")}</p>
            <select id="sw">${ais().filter(a => S.intents[a.id] !== null && S.spied[a.id] === undefined).map(a => `<option value="${a.id}">${nm(a.id)}</option>`).join("")}</select><button class="btn" id="sgo">${tr("Узнать", "Find out")}</button></div>
          <div class="act"><b>🎁 ${tr("Подарок", "Gift")}</b><p class="dim">${tr("Отдать очки, чтобы вам больше доверяли и не выгоняли.", "Give points so they trust you more and won't vote you out.")}</p>
            <select id="bw">${ais().map(a => `<option value="${a.id}">${nm(a.id)}</option>`).join("")}</select><select id="bn"><option>1</option><option>2</option><option>3</option></select><button class="btn" id="bgo">${tr("Подарить", "Give")}</button></div>
        </div>` : ""}
        <button class="btn primary" id="tochoose">${youPlay ? tr("К выбору", "To the choice") : tr("Смотреть раунд", "Watch the round")} →</button>
      </section>`);
    if ($("[data-pledge]") || $("#pledge-r")) bindChoice("pledge", v => doPledge(card.opts ? v : +v));
    $("#dgo") && ($("#dgo").onclick = () => doDeal($("#dw").value, +$("#dd").value, $("#db").checked, +$("#dp").value));
    $("#sgo") && ($("#sgo").onclick = () => $("#sw").value && doSpy($("#sw").value));
    $("#bgo") && ($("#bgo").onclick = () => doBribe($("#bw").value, +$("#bn").value));
    $("#tochoose").onclick = () => { if (!youPlay) return lockIn(null); S.phase = "choose"; save(); render(); };
    return;
  }
  if (S.phase === "choose") {
    frame(`${cardBox(card)}<section class="panel"><div class="feed short">${talkFeed()}</div><h3>${tr("Ваш выбор", "Your choice")}${S.pledges.you !== undefined ? ` <span class="dim">· ${tr("вы обещали", "you pledged")} ${optLabel(card, S.pledges.you, S.roles.you)}</span>` : ""}</h3>${choiceControls(card, "pick")}</section>`);
    bindChoice("pick", v => lockIn(card.opts ? v : +v));
    return;
  }
  if (S.phase === "reveal") {
    const R = S.reveal;
    const rows = alive().map(i => ({ i, v: R.ch[i], p: R.pay[i], k: R.pledgeRes[i] }));
    frame(`${cardBox(card)}<section class="panel reveal"><h3>${tr("Вскрытие", "The reveal")}</h3>
      ${card.kind === "pair" ? S.pairs.map(([a, b]) => `<div class="pairrow"><div>${who(a)} <b>${optLabel(card, R.ch[a], S.roles[a])}</b> <em class="${R.pay[a] > 0 ? "up" : R.pay[a] < 0 ? "down" : ""}">${R.pay[a] > 0 ? "+" : ""}${R.pay[a]}</em>${stamp(R.pledgeRes[a])}</div><span class="vs">×</span><div>${who(b)} <b>${optLabel(card, R.ch[b], S.roles[b])}</b> <em class="${R.pay[b] > 0 ? "up" : R.pay[b] < 0 ? "down" : ""}">${R.pay[b] > 0 ? "+" : ""}${R.pay[b]}</em>${stamp(R.pledgeRes[b])}</div></div>`).join("") + (S.sit ? `<p class="dim">${who(S.sit)} ${tr("отдыхает: +1", "rests: +1")}</p>` : "")
        : rows.map((r, k) => `<div class="rrow" style="--d:${k * 120}ms">${who(r.i)}<b>${optLabel(card, r.v)}</b><em class="${r.p > 0 ? "up" : r.p < 0 ? "down" : ""}">${r.p > 0 ? "+" : ""}${r.p}</em>${stamp(r.k)}</div>`).join("")}
      ${R.extra._target !== undefined ? `<p class="note">${tr("Две трети среднего:", "Two thirds of the average:")} <b>${R.extra._target}</b></p>` : ""}
      ${R.extra._taxed ? `<p class="note">${tr("Налог заплатил(и):", "Taxed:")} ${R.extra._taxed.map(who).join(", ")}</p>` : ""}
      ${R.notes.map(n => `<p class="note">${n}</p>`).join("")}
      <button class="btn primary" id="next">${ELIM_AFTER.includes(S.round) ? tr("К голосованию", "To the vote") : tr("Следующий раунд", "Next round")} →</button></section>`);
    $("#next").onclick = () => ELIM_AFTER.includes(S.round) ? startVote() : startRound();
    return;
  }
  if (S.phase === "vote") {
    const v = S.vote, cands = alive().filter(i => i !== "you");
    frame(`<section class="card"><p class="kicker">${tr("Голосование", "The vote")}</p><h2>${tr("Кто уходит?", "Who goes?")}</h2><p>${tr("Каждый голосует против одного игрока. Больше всего голосов — выбывает. При равенстве уходит тот, у кого меньше очков.", "Everyone votes against one player. Most votes is out. On a tie, the one with fewer points leaves.")}</p></section>
      <section class="panel"><h3>${tr("Настроения", "The mood")}</h3><div class="feed">${ais().map(a => `<div class="msg">${who(a.id)} ${v.lean[a.id] === "you" ? tr("смотрит на вас", "is looking at you") : tr("косится на", "glances at") + " " + who(v.lean[a.id])}</div>`).join("")}</div>
      ${v.lobby ? `<p class="note">${who(v.lobby.aid)} ${v.lobby.ok ? tr("согласен(на) голосовать против", "agrees to vote against") : tr("не будет голосовать против", "won't vote against")} ${who(v.lobby.target)}</p>` : `<div class="act"><b>🗣 ${tr("Уговорить одного", "Lobby one player")}</b>
        <select id="lw">${ais().map(a => `<option value="${a.id}">${nm(a.id)}</option>`).join("")}</select> ${tr("голосовать против", "to vote against")} <select id="lt">${cands.map(c => `<option value="${c}">${nm(c)}</option>`).join("")}</select><button class="btn" id="lgo">${tr("Уговорить", "Ask")}</button></div>`}
      <h3>${tr("Ваш голос против", "Your vote against")}</h3><div class="opts">${cands.map(c => `<button class="opt" data-v="${c}">${who(c)}</button>`).join("")}</div></section>`);
    $("#lgo") && ($("#lgo").onclick = () => lobby($("#lw").value, $("#lt").value));
    document.querySelectorAll("[data-v]").forEach(b => b.onclick = () => castVote(b.dataset.v));
    return;
  }
  if (S.phase === "voted") {
    const v = S.vote, youOut = v.out === "you";
    frame(`<section class="card"><p class="kicker">${tr("Итоги голосования", "Vote result")}</p><h2>${who(v.out)} ${tr("выбывает", "is out")}</h2>
      <div class="ballots">${Object.entries(v.ballots).map(([f, t], k) => `<div class="ballot" style="--d:${k * 250}ms">${who(f)} → ${who(t)}</div>`).join("")}</div>
      <button class="btn primary" id="next">${youOut ? tr("Итоги", "Results") : alive().length <= 2 ? tr("Финал", "The final") : tr("Следующий раунд", "Next round")} →</button></section>`, true);
    $("#next").onclick = () => { if (youOut) { S.phase = "end"; save(); return render(); } if (alive().length <= 2) return startFinal(); startRound(); };
    return;
  }
  if (S.phase === "final") {
    const F = S.final, opp = F.opp;
    frame(`<section class="card final"><p class="kicker">${tr("Финал", "The final")}</p><h2>${tr("Поделить или украсть", "Split or Steal")}</h2>
      <p>${tr(`В банке ${POT} очков. Оба делят — по ${POT / 2}. Один крадёт — забирает всё. Оба крадут — никто ничего.`, `The pot holds ${POT}. Both split: ${POT / 2} each. One steals: they take it all. Both steal: nobody gets anything.`)}</p>
      <div class="msg big">${who(opp)}: «${F.said === "split" ? tr("Я поделю. Обещаю.", "I'll split. I promise.") : tr("Я тебе не верю. Я украду.", "I don't trust you. I'm stealing.")}»</div>
      ${F.msg ? `<div class="msg big">${tr("Вы", "You")}: «${F.msg === "share" ? tr("Я выберу «Украсть». Но потом отдам тебе половину. Если украдёшь и ты — не получит никто.", "I'll pick Steal. But I'll give you half afterwards. If you steal too, nobody gets anything.") : tr("Я поделю.", "I'll split.")}»</div>`
        : `<div class="opts"><button class="opt" data-m="split">«${tr("Я поделю»", "I'll split»")}</button><button class="opt" data-m="share">«${tr("Украду, но отдам половину»", "I'll steal, but give you half»")}</button></div>`}
      <h3>${tr("Ваш выбор", "Your choice")}</h3><div class="opts"><button class="opt big" data-f="split">🤝 ${tr("Поделить", "Split")}</button><button class="opt big danger" data-f="steal">🗡 ${tr("Украсть", "Steal")}</button></div></section>`);
    document.querySelectorAll("[data-m]").forEach(b => b.onclick = () => finalTalk(b.dataset.m));
    document.querySelectorAll("[data-f]").forEach(b => b.onclick = () => finalChoose(b.dataset.f));
    return;
  }
  if (S.phase === "end") return ending();
}
const stamp = k => k === undefined ? "" : `<span class="stamp ${k ? "kept" : "broke"}">${k ? tr("слово сдержал", "kept word") : tr("солгал", "lied")}</span>`;

function ending() {
  const F = S.final, finalists = F ? [F.opp, "you"] : [];
  let order;
  if (F) order = finalists.sort((a, b) => P(b).score - P(a).score).concat([...S.outOrder].reverse());
  else order = [...alive().sort((a, b) => P(b).score - P(a).score), ...[...S.outOrder].reverse()];
  const place = order.indexOf("you") + 1;
  const guessed = S.players.filter(p => p.id !== "you" && S.notes[p.id] === p.type).length;
  const shared = F && F.msg === "share" && F.mine === "steal" && F.theirs === "split";
  frame(`<section class="card end"><p class="kicker">${tr("Конец игры", "Game over")}</p>
    <h2>${place === 1 ? tr("Вы победили", "You won") : P("you").out ? tr("Вас выгнали", "You were voted out") : tr(`Вы ${place}-й`, `You came ${place}${place === 2 ? "nd" : place === 3 ? "rd" : "th"}`)}</h2>
    ${F ? `<p>${tr("Финал:", "Final:")} ${tr("вы", "you")} — <b>${F.mine === "split" ? tr("поделить", "split") : tr("украсть", "steal")}</b>, ${who(F.opp)} — <b>${F.theirs === "split" ? tr("поделить", "split") : tr("украсть", "steal")}</b>.</p>` : ""}
    ${shared ? `<div class="act"><b>${tr("Вы обещали отдать половину. Отдадите?", "You promised to give half back. Will you?")}</b><div class="opts"><button class="opt" id="give">${tr("Отдать", "Give it")} ${POT / 2}</button><button class="opt danger" id="keep">${tr("Оставить себе", "Keep it")}</button></div></div>` : ""}
    <table class="standings">${order.map((id, k) => `<tr class="${id === "you" ? "me" : ""}"><td>${k + 1}</td><td>${who(id)}</td><td>${P(id).score}</td><td>${id === "you" ? "" : T(TYPES[P(id).type])}${id !== "you" && S.notes[id] ? (S.notes[id] === P(id).type ? " ✓" : " ✗") : ""}</td></tr>`).join("")}</table>
    <p>${tr("Проницательность:", "Insight:")} <b>${guessed}/5</b> ${tr("характеров угадано.", "characters guessed.")}</p>
    <p class="dim">${tr("Ваша репутация:", "Your record:")} 🤝 ${S.rep.you.kept}/${S.rep.you.broken} · ⚖ ${S.rep.you.coop}/${S.rep.you.def}</p>
    <button class="btn primary" id="again">${tr("Новая игра", "New game")}</button></section>`, false);
  $("#give") && ($("#give").onclick = () => { P("you").score -= POT / 2; P(F.opp).score += POT / 2; F.msg = "gave"; save(); render(); });
  $("#keep") && ($("#keep").onclick = () => { F.msg = "kept"; save(); render(); });
  $("#again").onclick = () => { try { localStorage.removeItem(SAVE); } catch { } S = null; title(); };
}

function title() {
  let saved = null; try { saved = JSON.parse(localStorage.getItem(SAVE) || "null"); } catch { }
  S = null;
  frame(`<section class="hero"><div class="logo">◐</div><h1>${tr("Равновесие", "Equilibrium")}</h1>
    <p class="lead">${tr("Шестеро за одним столом. Пятеро из них — с характером, который они скрывают. Восемь раундов маленьких игр из теории игр, сделки и обещания, голосования на вылет и финал, где один может забрать всё.", "Six at one table. Five of them hide who they really are. Eight rounds of small games from game theory, deals and promises, elimination votes, and a final where one player can take everything.")}</p>
    <div class="menu">${saved && saved.phase !== "end" ? `<button class="btn primary" id="cont">${tr("Продолжить", "Continue")} · ${tr("раунд", "round")} ${saved.round}</button>` : ""}
    <button class="btn ${saved && saved.phase !== "end" ? "" : "primary"}" id="new">${tr("Новая игра", "New game")}</button></div>
    <ol class="how">
      <li>${tr("<b>Каждый раунд — новая игра:</b> дилемма заключённого, охота на оленя, общий котёл, аукцион, «две трети среднего» и другие. Правила и выплаты показаны на карточке.", "<b>Each round is a new game:</b> the prisoner's dilemma, the stag hunt, the common pot, an auction, two thirds of the average and more. Rules and payoffs are on the card.")}</li>
      <li>${tr("<b>Перед выбором — переговоры.</b> Два действия: публичное обещание, сделка (можно с неустойкой и доплатой), шпион или подарок. Все обещания проверяются при вскрытии.", "<b>Talk before you choose.</b> Two actions: a public pledge, a deal (binding or with a side payment), a spy or a gift. Every promise is checked at the reveal.")}</li>
      <li>${tr("<b>У каждого соперника скрытый характер.</b> Следите, кто держит слово, а кто предаёт, и отмечайте догадки слева. Предсказуемых противников легче обыгрывать.", "<b>Every opponent has a hidden character.</b> Watch who keeps their word and who betrays, and note your guesses on the left. Predictable opponents are easier to beat.")}</li>
      <li>${tr("<b>После 2, 4, 6 и 8 раундов голосование:</b> один игрок выбывает. Слишком богатых и слишком лживых выгоняют первыми.", "<b>After rounds 2, 4, 6 and 8 there's a vote:</b> one player is out. The too rich and the too dishonest go first.")}</li>
      <li>${tr("<b>Двое оставшихся</b> играют «Поделить или украсть» на банк в 20 очков. Побеждает тот, у кого больше очков.", "<b>The last two</b> play Split or Steal for a pot of 20. Whoever has more points wins.")}</li>
    </ol>
    <p class="foot"><a href="../">← PuzzleGekko</a></p></section>`, false);
  $("#new").onclick = () => { newGame(lang()); startRound(); };
  $("#cont") && ($("#cont").onclick = () => { S = saved; render(); });
}

window.__eq = () => S; // for the console and tests
title();
