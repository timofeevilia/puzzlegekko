// Exam 2: The Target. A group of eight from all four classes. One member is secretly the Target.
// Each member holds one fact about the Target; the Target's own card is a decoy. Three rounds of talk.
// Endings: everyone names the Target together (all classes gain), someone is wrong or silent (the Target's class gains),
// or someone betrays the group early: right takes 50 CP from the Target's class, wrong gives the Target's class 50.
import { G, tr, nm, face, me, classmates, byId, rnd, pick, shuffle, clamp, line, brief, toast, CLASSES, esc, trust, addTrust, $ } from "./game.js";

const CLUBS = ["chess", "track", "art", "music"];
const CLUB = { chess: ["♟️", "шахматы", "chess"], track: ["🏃", "лёгкая атлетика", "track"], art: ["🎨", "рисование", "art"], music: ["🎻", "музыка", "music"] };
const clubName = c => `${CLUB[c][0]} ${tr(CLUB[c][1], CLUB[c][2])}`;
const LIE = { A: .2, B: .05, C: .4, D: 0 };
const BETRAY = { A: .45, B: .08, C: .7, D: 0 };

let T, ctx;
const who = id => id === "you" ? me() : byId(id);
const pname = id => id === "you" ? esc(G.name) + " (" + tr("вы", "you") + ")" : nm(byId(id));

// facts: { k: "cls"|"club"|"floor"|"hand", not: bool, v }
const holds = (f, m) => (m[f.k] === f.v) !== f.not;
function factText(f) {
  const v = f.k === "cls" ? tr("класса ", "Class ") + f.v : f.k === "club" ? clubName(f.v) : f.k === "floor" ? f.v + tr("-й этаж", " floor") : f.v === "L" ? tr("левша", "left-handed") : tr("правша", "right-handed");
  if (f.k === "cls") return f.not ? tr(`Цель — не из ${v}`, `The Target is not from ${v}`) : tr(`Цель — из ${v}`, `The Target is from ${v}`);
  if (f.k === "club") return f.not ? tr(`Цель не ходит в кружок: ${v}`, `The Target is not in the ${v} club`) : tr(`Цель ходит в кружок: ${v}`, `The Target is in the ${v} club`);
  if (f.k === "floor") return f.not ? tr(`Цель живёт не на ${f.v}-м этаже`, `The Target does not live on floor ${f.v}`) : tr(`Цель живёт на ${f.v}-м этаже`, `The Target lives on floor ${f.v}`);
  return tr(`Цель — ${v}`, `The Target is ${v}`);
}
const factsOf = m => [
  { k: "cls", not: false, v: m.cls }, ...["A", "B", "C", "D"].filter(c => c !== m.cls).map(v => ({ k: "cls", not: true, v })),
  { k: "club", not: false, v: m.club }, ...CLUBS.filter(c => c !== m.club).map(v => ({ k: "club", not: true, v })),
  { k: "floor", not: false, v: m.floor }, ...[2, 3, 4].filter(f => f !== m.floor).map(v => ({ k: "floor", not: true, v })),
  { k: "hand", not: false, v: m.hand },
];
const sat = (facts, members) => members.filter(m => facts.every(f => holds(f, m)));
function falseFact(target, members) {
  const others = members.filter(m => m.id !== target.id);
  const cands = others.flatMap(factsOf).filter(f => !holds(f, target));
  return pick(cands);
}

export function run(c) {
  ctx = c;
  const mate = classmates().sort((a, b) => trust(b.id) - trust(a.id))[0];
  const ids = ["you", mate.id, "viktor", "elise", "hana", pick(["ravi", "ivy"]), "rex", "mila"];
  let members, target, cards;
  for (let tries = 0; tries < 400; tries++) {
    members = ids.map(id => ({ id, cls: who(id).cls, club: pick(CLUBS), floor: 2 + rnd(3), hand: Math.random() < .3 ? "L" : "R" }));
    target = Math.random() < (G.diff === "hard" ? .2 : .15) ? members[0] : pick(members.slice(1));
    const truths = shuffle(factsOf(target));
    const holders = members.filter(m => m.id !== target.id);
    if (truths.length < holders.length) continue;
    const set = truths.slice(0, holders.length);
    if (sat(set, members).length !== 1) continue;
    if (set.some(f => sat([f], members).length === 1)) continue; // no single card gives it away
    cards = {}; holders.forEach((m, i) => cards[m.id] = set[i]);
    cards[target.id] = falseFact(target, members);
    break;
  }
  T = { members, target: target.id, cards, round: 1, said: {}, pub: [], mine: [], pacts: [], out: {}, betrayed: null, usedIntel: false, distrust: {}, crossed: {}, acted: false, log: [] };
  T.mine.push({ by: "you", f: cards.you, own: true });
  if (G.items.intel) { T.usedIntel = true; const extra = factsOf(target).find(f => !Object.values(cards).some(x => x.k === f.k && x.v === f.v && x.not === f.not)); if (extra) T.mine.push({ by: "intel", f: extra, own: true }); }
  const youTarget = T.target === "you";
  brief(ctx, { icon: "🎯", name: tr("Цель", "The Target"), rules: [
    tr("Вас поместили в группу из восьми: по двое из каждого класса. Один из группы — тайная <b>Цель</b>.", "You're in a group of eight, two from each class. One of them is the secret <b>Target</b>."),
    tr("У каждого есть карточка с правдивым фактом о Цели. Только у самой Цели карточка ложная. Делиться карточками можно — и можно врать.", "Everyone holds a card with a true fact about the Target. Only the Target's own card is false. You may share cards, and you may lie."),
    tr("Три раунда обсуждения. В каждом раунде вы делаете одно действие: спросить кого-то наедине, заключить союз или огласить свою карточку.", "Three rounds of talk. Each round you take one action: ask someone in private, make a pact, or announce your card."),
    tr("<b>Все назвали Цель верно</b> — каждый класс группы получает +25. <b>Кто-то ошибся или промолчал</b> — класс Цели получает +50.", "<b>Everyone names the Target correctly</b>: every class in the group gets +25. <b>Someone is wrong or silent</b>: the Target's class gets +50."),
    tr("<b>Предательство:</b> после любого раунда можно сдать ответ досрочно. Верно — ваш класс +50, класс Цели −50, экзамен для группы окончен. Ошибка — наоборот. Другие тоже могут предать.", "<b>Betrayal:</b> after any round you may answer early. Right: your class +50 and the Target's class −50, and the group's exam is over. Wrong: the reverse. Others may betray too."),
  ], extra: youTarget ? `<p class="note danger">🎯 ${tr("<b>Цель — вы.</b> Ваша карточка ложная. Сделайте так, чтобы группа ошиблась, и никто не вычислил вас раньше времени.", "<b>You are the Target.</b> Your card is false. Make the group get it wrong, and don't let anyone catch you early.")}</p>`
    : T.usedIntel ? `<p class="note">🕵️ ${tr("Информатор принёс вам второй правдивый факт.", "Your informant brought you a second true fact.")}</p>` : "" }, () => { aiTalk(); roundView(); });
}

// what an AI member believes: candidates consistent with the facts it trusts
function believe(id) {
  const m = T.members.find(x => x.id === id);
  let facts = [T.cards[id]]; // its own card (the Target knows its card is fake)
  if (id === T.target) return [T.target];
  T.pub.forEach(s => { if (s.by !== id && !s.priv) facts.push({ ...s.f, by: s.by }); });
  T.pacts.filter(p => p.with === id).forEach(p => facts.push({ ...p.f, by: "you" }));
  const others = T.members.filter(x => x.id !== id);
  let set = sat(facts, others);
  // contradictions: drop statements from the least trusted classes first
  const order = ["C", "A", "B", "D"].filter(c => c !== m.cls);
  for (const cls of order) { if (set.length) break; facts = facts.filter(f => !f.by || who(f.by).cls !== cls); set = sat(facts, others); }
  return set.length ? set : others.map(x => x.id && x).filter(Boolean);
}

function aiTalk() {
  const msgs = [];
  for (const m of shuffle(T.members.filter(x => x.id !== "you" && !T.said[x.id] && !T.out[x.id]))) {
    const p = byId(m.id);
    if (Math.random() > .35 + p.soc * .05) continue;
    const isT = m.id === T.target, tcls = T.members.find(x => x.id === T.target).cls;
    let f = T.cards[m.id], lie = false;
    if (!isT && m.cls === tcls && Math.random() < .5) { f = falseFact(T.members.find(x => x.id === T.target), T.members); lie = true; }
    else if (!isT && Math.random() < LIE[m.cls] * (G.diff === "hard" ? 1.4 : 1)) { f = falseFact(T.members.find(x => x.id === T.target), T.members); lie = true; }
    T.said[m.id] = true; T.pub.push({ by: m.id, f, lie: lie || isT });
    msgs.push({ by: m.id, f });
  }
  T.log.push({ round: T.round, msgs });
}

function candidates() {
  const facts = [...T.mine.map(s => s.f), ...T.pub.filter(s => !T.distrust[s.by + ":" + s.f.k + s.f.v]).map(s => s.f)];
  const pool = T.target === "you" ? T.members : T.members.filter(m => m.id !== "you");
  return sat(facts, pool).map(m => m.id);
}

function roundView(note = "") {
  ctx.setRerender(() => roundView(note));
  const youT = T.target === "you", cand = new Set(youT ? T.members.map(m => m.id) : candidates());
  const others = T.members.filter(m => m.id !== "you" && !T.out[m.id]);
  ctx.frame(`<div class="exam-bar"><span>🎯 ${tr("Раунд", "Round")} <b>${Math.min(T.round, 3)}/3</b></span><span>${youT ? "🎯 " + tr("Вы — Цель", "You are the Target") : "🃏 " + tr("Ваша карточка:", "Your card:") + " " + factText(T.cards.you)}</span></div>
  <section class="target-grid">
    <div class="paper">
      <h3>${tr("Досье группы", "Group dossier")}</h3>
      <table class="dossier"><thead><tr><th></th><th>${tr("Класс", "Class")}</th><th>${tr("Кружок", "Club")}</th><th>${tr("Этаж", "Floor")}</th><th>${tr("Рука", "Hand")}</th></tr></thead><tbody>
      ${T.members.map(m => `<tr class="${cand.has(m.id) ? "cand" : "out"} ${T.crossed[m.id] ? "crossed" : ""} ${T.out[m.id] ? "gone" : ""}" data-x="${m.id}">
        <td class="who">${face(who(m.id), { size: "xs" })}<span>${pname(m.id)}</span></td><td><b style="color:${CLASSES[m.cls].color}">${m.cls}</b></td><td>${clubName(m.club)}</td><td>${m.floor}</td><td>${m.hand === "L" ? tr("левша", "left") : tr("правша", "right")}</td></tr>`).join("")}
      </tbody></table>
      <p class="dim small">${youT ? tr("Вы знаете ответ. Следите, какие факты звучат против вас, и уводите группу в сторону.", "You know the answer. Watch which facts point at you and lead the group astray.") : tr("Яркие строки подходят под все факты, которым вы доверяете. Нажмите на строку, чтобы вычеркнуть её вручную.", "Bright rows fit every fact you trust. Tap a row to cross it out by hand.")}</p>
      <h3>${tr("Что известно", "What is known")}</h3>
      <div class="facts">
        ${T.mine.map(s => `<div class="fact mine">🃏 ${s.by === "intel" ? "🕵️ " : ""}${factText(s.f)}${youT && s.by === "you" ? ` <em>(${tr("ложь", "false")})</em>` : ""}</div>`).join("")}
        ${T.pub.map(s => { const key = s.by + ":" + s.f.k + s.f.v, off = T.distrust[key];
          return `<div class="fact ${off ? "off" : ""}"><span class="by">${s.by === "you" ? "📣 " + esc(G.name) : nm(byId(s.by))}${s.priv ? " · " + tr("наедине", "in private") : ""}</span> ${factText(s.f)} <button class="mini" data-trust="${key}">${off ? tr("не верю", "don't trust") : tr("верю", "trust")}</button></div>`; }).join("") || `<p class="dim">${tr("Пока никто ничего не сказал.", "Nobody has said anything yet.")}</p>`}
      </div>
    </div>
    <div class="paper">
      <h3>${tr("Разговоры", "The talk")}</h3>
      <div class="talk">${T.log.slice(-3).map(r => r.msgs.map(m => line(byId(m.by), (m.by === T.target && youT ? "" : "") + "«" + factText(m.f) + "»")).join("")).join("") || ""}</div>
      ${note ? `<div class="note">${note}</div>` : ""}
      ${T.betrayed ? "" : T.acted ? `<p class="dim">${tr("Действие на этот раунд сделано.", "You've taken this round's action.")}</p>` : `
      <h3>${tr("Ваше действие", "Your action")}</h3>
      <div class="opt-group"><b>🤫 ${tr("Спросить наедине", "Ask in private")}</b><div class="pills">${others.map(m => `<button class="pill" data-ask="${m.id}">${face(byId(m.id), { size: "xs" })}${nm(byId(m.id))}</button>`).join("")}</div></div>
      <div class="opt-group"><b>🤝 ${tr("Союз: обменяться карточками честно", "Pact: swap cards honestly")}</b><div class="pills">${others.map(m => `<button class="pill" data-pact="${m.id}">${nm(byId(m.id))}${m.cls === "C" ? " ◈200" : ""}</button>`).join("")}</div></div>
      <div class="opt-group"><b>📣 ${tr("Огласить карточку всем", "Announce a card to everyone")}</b><div class="pills">
        <button class="pill" data-say="true">${youT ? tr("Свою ложную карточку", "My false card") : tr("Правду", "The truth")}: ${factText(T.cards.you)}</button>
        <button class="pill" data-say="bluff">${tr("Блеф: выдумать факт", "Bluff: invent a fact")}</button></div></div>`}
      <div class="choices">
        ${T.betrayed ? "" : `<button class="btn" id="next">${T.round >= 3 ? tr("К финальному ответу", "To the final answer") : tr("Следующий раунд", "Next round")} →</button>`}
        ${T.betrayed || youT ? "" : `<button class="btn danger" id="betray">⚡ ${tr("Предать группу: ответить сейчас", "Betray the group: answer now")}</button>`}
      </div>
    </div></section>`);
  const root = $(".target-grid");
  root.onclick = e => {
    const tr_ = e.target.closest("[data-x]"), tb = e.target.closest("[data-trust]"), a = e.target.closest("[data-ask]"), p = e.target.closest("[data-pact]"), s = e.target.closest("[data-say]");
    if (tb) { const k = tb.dataset.trust; T.distrust[k] = !T.distrust[k]; return roundView(note); }
    if (tr_ && !e.target.closest("button")) { const id = tr_.dataset.x; T.crossed[id] = !T.crossed[id]; return roundView(note); }
    if (a) return ask(a.dataset.ask);
    if (p) return pact(p.dataset.pact);
    if (s) return announce(s.dataset.say === "bluff");
  };
  $("#next")?.addEventListener("click", () => nextRound());
  $("#betray")?.addEventListener("click", () => choose(true));
}

function ask(id) {
  const m = T.members.find(x => x.id === id), p = byId(id), isT = id === T.target, tcls = T.members.find(x => x.id === T.target).cls;
  let f = T.cards[id], lie = isT;
  const friendly = m.cls === "D" || trust(id) >= 60 || (m.cls === "B" && Math.random() < .9);
  if (!isT && (m.cls === tcls && m.cls !== "D" ? Math.random() < .6 : !friendly && Math.random() < LIE[m.cls] * 1.5 + (G.stats.soc < 5 ? .1 : 0))) { f = falseFact(T.members.find(x => x.id === T.target), T.members); lie = true; }
  if (!friendly && Math.random() < .25 - G.stats.soc * .02) { T.acted = true; return roundView(line(p, tr("С чего мне с тобой откровенничать?", "Why would I tell you anything?"), "angry")); }
  T.pub.push({ by: id, f, lie, priv: true }); T.acted = true;
  roundView(line(p, tr("Только между нами: ", "Just between us: ") + "«" + factText(f) + "»"));
}
function pact(id) {
  const m = T.members.find(x => x.id === id), p = byId(id);
  const ok = m.cls === "D" || m.cls === "B" || (m.cls === "A" && G.stats.int >= 7) || (m.cls === "C" && G.pp >= 200);
  T.acted = true;
  if (!ok) return roundView(line(p, m.cls === "A" ? tr("Союз? Сначала докажи, что ты чего-то стоишь.", "A pact? Prove you're worth something first.") : tr("Без денег я не договариваюсь.", "No money, no deal."), "angry"));
  if (m.cls === "C") G.pp -= 200;
  const f = id === T.target ? T.cards[id] : T.cards[id];
  T.pub.push({ by: id, f, lie: id === T.target, priv: true });
  T.pacts.push({ with: id, f: T.cards.you });
  roundView(line(p, tr("Договорились. Моя карточка: ", "Deal. My card: ") + "«" + factText(f) + "»", "smile"));
}
function announce(bluff) {
  const tgt = T.members.find(x => x.id === T.target);
  let f = T.cards.you;
  if (bluff) { f = T.target === "you" ? falseFact(tgt, T.members) : falseFact(tgt, T.members); }
  T.pub.push({ by: "you", f, lie: bluff || T.target === "you" }); T.acted = true;
  roundView(`📣 ${tr("Вы объявили:", "You announced:")} «${factText(f)}»`);
}

function aiBetray() {
  for (const m of shuffle(T.members.filter(x => x.id !== "you" && x.id !== T.target && !T.out[x.id]))) {
    const tcls = T.members.find(x => x.id === T.target).cls;
    if (m.cls === tcls) continue; // the Target's classmates know and protect it
    const set = believe(m.id);
    if (set.length !== 1 || Math.random() > BETRAY[m.cls] * (G.diff === "hard" ? 1.2 : 1)) continue;
    const guess = set[0].id || set[0];
    T.out[m.id] = true;
    if (guess === T.target) { T.betrayed = { by: m.id, right: true }; return true; }
    T.wrongBetrayals = T.wrongBetrayals || []; T.wrongBetrayals.push(m.id);
  }
  return false;
}

function nextRound() {
  if (aiBetray()) return end();
  if (T.round >= 3) return choose(false);
  T.round++; T.acted = false; aiTalk(); roundView();
}

function choose(early) {
  ctx.setRerender(() => choose(early));
  const pool = T.members.filter(m => m.id !== "you");
  ctx.frame(`<section class="paper">
    <p class="kicker">${early ? tr("Досрочный ответ", "Early answer") : tr("Финальный ответ", "Final answer")}</p>
    <h2>${T.target === "you" ? tr("Вы — Цель. Ответ за вас сдаст школа.", "You are the Target. The school answers for you.") : tr("Кто Цель?", "Who is the Target?")}</h2>
    ${early ? `<p class="note danger">${tr("Если ошибётесь, класс D потеряет 50 очков.", "If you're wrong, Class D loses 50 points.")}</p>` : `<p class="dim">${tr("Результат 1 возможен, только если ответят все и все верно.", "Result 1 only happens if everyone answers and everyone is right.")}</p>`}
    <div class="gopts">${T.target === "you" ? "" : pool.map(m => `<button class="gopt" data-g="${m.id}">${face(byId(m.id), { size: "xs" })}${nm(byId(m.id))}</button>`).join("")}
      ${early ? `<button class="gopt" data-g="back">← ${tr("Передумать", "Change my mind")}</button>` : `<button class="gopt" data-g="">${T.target === "you" ? tr("Сдать", "Submit") : tr("Не отвечать", "Don't answer")}</button>`}</div></section>`);
  $(".gopts").onclick = e => { const b = e.target.closest("[data-g]"); if (!b) return; if (b.dataset.g === "back") return roundView(); early ? earlyAnswer(b.dataset.g) : finalAnswer(b.dataset.g); };
}
function earlyAnswer(id) { T.out.you = true; T.betrayed = { by: "you", right: id === T.target, guess: id }; end(); }

function finalAnswer(mine) {
  const answers = { you: mine };
  for (const m of T.members) {
    if (m.id === "you" || m.id === T.target || T.out[m.id]) continue;
    const tcls = T.members.find(x => x.id === T.target).cls;
    if (m.cls === tcls && m.cls !== "D") { answers[m.id] = Math.random() < .5 ? T.target : pick(T.members.filter(x => x.id !== m.id && x.id !== T.target)).id; continue; }
    const set = believe(m.id);
    answers[m.id] = set.length > 3 && Math.random() < .3 ? "" : (pick(set).id || "");
  }
  T.answers = answers; end();
}

function end() {
  const tgt = T.members.find(x => x.id === T.target), tcls = tgt.cls, cp = { A: 0, B: 0, C: 0, D: 0 }, lines = [];
  let pp = 0, trustD = {};
  const reveal = tr(`Целью был(а) ${pname(T.target)} (класс ${tcls}).`, `The Target was ${pname(T.target)} (Class ${tcls}).`);
  (T.wrongBetrayals || []).forEach(id => { const c = byId(id).cls; cp[c] -= 50; cp[tcls] += 50; lines.push(`⚡ ${tr(`${nm(byId(id))} предал(а) группу и ошибся(лась): класс ${c} −50, класс ${tcls} +50.`, `${nm(byId(id))} betrayed the group and was wrong: Class ${c} −50, Class ${tcls} +50.`)}`); });
  let headline;
  if (T.betrayed) {
    const b = T.betrayed, bc = b.by === "you" ? "D" : byId(b.by).cls;
    if (b.right) { cp[bc] += 50; cp[tcls] -= 50; headline = b.by === "you" ? tr("Вы предали группу — и попали", "You betrayed the group, and you were right") : tr(`${nm(byId(b.by))} предал(а) группу первым(ой)`, `${nm(byId(b.by))} betrayed the group first`); if (b.by === "you") { pp += 300; classmates().forEach(p => trustD[p.id] = 2); } }
    else { cp[bc] -= 50; cp[tcls] += 50; headline = tr("Предательство провалилось", "The betrayal failed"); classmates().forEach(p => trustD[p.id] = -3); }
    lines.unshift(reveal);
  } else {
    const ans = T.answers, all = Object.keys(ans).every(k => ans[k] === T.target) && T.target !== "you" || (T.target === "you" && Object.keys(ans).filter(k => k !== "you").every(k => ans[k] === "you"));
    if (all) { ["A", "B", "C", "D"].forEach(c => cp[c] += 25); pp += T.target === "you" ? 600 : 300; headline = tr("Результат 1: группа нашла Цель вместе", "Result 1: the group found the Target together"); }
    else { cp[tcls] += 50; if (T.target === "you") pp += 600; headline = tr(`Результат 2: группа ошиблась — класс ${tcls} получает 50`, `Result 2: the group was wrong, Class ${tcls} gets 50`); }
    lines.unshift(reveal);
    const wrong = Object.keys(ans).filter(k => ans[k] !== T.target && k !== T.target);
    if (wrong.length) lines.push(tr("Ошиблись или промолчали: ", "Wrong or silent: ") + wrong.map(pname).join(", "));
  }
  const liars = T.pub.filter(s => s.lie && s.by !== "you").map(s => s.by);
  if (liars.length) lines.push(tr("Солгали: ", "Lied: ") + [...new Set(liars)].map(pname).join(", "));
  ctx.done({ headline, lines, cp, pp, trust: trustD, usedIntel: T.usedIntel });
}
