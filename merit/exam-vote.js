// Exam 3: Unanimous. Class D votes on five questions; each one must pass unanimously within three votes.
// Between votes you try to change minds with logic, empathy, private points or pressure.
// The last question is the school's offer: expel one classmate for 100 class points.
import { G, tr, nm, face, me, classmates, byId, rnd, pick, shuffle, clamp, line, brief, toast, CLASSES, esc, trust, addTrust, $ } from "./game.js";

// lean: −100 (firm no) … +100 (firm yes). flavor scales how well each approach works on this question.
const ISSUES = [
  { id: "tutor", q: { ru: "Каждый сдаёт по ◈100 в фонд, чтобы нанять репетитора для всего класса?", en: "Should everyone put ◈100 into a fund to hire a tutor for the whole class?" },
    yes: { ru: "Нанять", en: "Hire" }, no: { ru: "Не платить", en: "Don't pay" },
    lean: { mira: 60, lin: 20, aye: 50, dev: -70, tom: -30, ken: -40, sasha: 10, yuki: 20, oleg: -10 }, flavor: { logic: 1.3, heart: .8, pay: 1.2, push: .8 } },
  { id: "deal", q: { ru: "Класс A предлагает 40 очков класса сейчас, если мы на финальной дуэли не выберем их соперником. Соглашаемся?", en: "Class A offers 40 class points now if we don't pick them as our opponent in the final duel. Do we accept?" },
    yes: { ru: "Принять сделку", en: "Take the deal" }, no: { ru: "Отказать", en: "Refuse" },
    lean: { dev: 60, mira: -50, oleg: -30, tom: 0, sasha: 20, ken: 30, yuki: 10, lin: -20, aye: -10 }, flavor: { logic: 1.2, heart: .7, pay: 1, push: 1 } },
  { id: "fight", q: { ru: "Том подрался с Бо из класса C. Школа даёт выбор: класс получает штраф −40, или Тома отстраняют от финальной дуэли. Берём штраф на весь класс?", en: "Tom fought Bo from Class C. The school offers a choice: the class takes a −40 penalty, or Tom is barred from the final duel. Does the whole class take the penalty?" },
    yes: { ru: "Штраф всем", en: "Penalty for all" }, no: { ru: "Отстранить Тома", en: "Bar Tom" },
    lean: { tom: 85, oleg: 30, sasha: 20, ken: 40, yuki: 10, dev: -60, mira: -30, lin: -10, aye: 0 }, flavor: { logic: .8, heart: 1.4, pay: .8, push: 1 } },
  { id: "leak", q: { ru: "Кто-то сливает наши планы классу C. Разрешаем старосте проверить переписки всех, чтобы найти крота?", en: "Someone is leaking our plans to Class C. Do we let the class rep check everyone's messages to find the mole?" },
    yes: { ru: "Проверить всех", en: "Check everyone" }, no: { ru: "Не трогать", en: "Leave it" },
    lean: { mira: 40, lin: 30, oleg: 20, sasha: -40, ken: -60, dev: -30, tom: -10, yuki: -20, aye: 10 }, flavor: { logic: 1.1, heart: 1, pay: .6, push: 1.3 } },
  { id: "expel", q: { ru: "Предложение школы: класс исключает одного ученика и получает 100 очков. Принимаем?", en: "The school's offer: the class expels one student and gets 100 points. Do we accept?" },
    yes: { ru: "Исключить одного", en: "Expel one" }, no: { ru: "Никого", en: "Nobody" },
    lean: { dev: 60, mira: 30, lin: 10, oleg: 20, tom: -20, sasha: -40, ken: -30, yuki: -70, aye: -50 }, flavor: { logic: 1, heart: 1.3, pay: .9, push: 1.1 } },
];
const STUBBORN = { lin: .4, oleg: .5, mira: .8 };
const REACT = {
  logic: [{ ru: "…Ладно, в этом есть смысл.", en: "…Fine, that makes sense." }, { ru: "Цифры не врут. Я подумаю.", en: "Numbers don't lie. I'll think about it." }],
  heart: [{ ru: "Ты правда так считаешь? …Хорошо.", en: "You really think so? …Alright." }, { ru: "Не дави на жалость. Хотя…", en: "Don't play on my feelings. Although…" }],
  pay: [{ ru: "Вот это разговор.", en: "Now we're talking." }, { ru: "Деньги лишними не бывают.", en: "Money never hurts." }],
  push: [{ ru: "…Ты мне угрожаешь? Ладно, ладно.", en: "…Are you threatening me? Fine, fine." }, { ru: "Попробуй ещё раз так со мной поговорить.", en: "Try talking to me like that again." }],
  none: [{ ru: "Меня это не убеждает.", en: "That doesn't convince me." }, { ru: "Нет.", en: "No." }],
};
const APPROACH = { logic: { ru: "🧠 Логика", en: "🧠 Logic" }, heart: { ru: "💗 Эмпатия", en: "💗 Empathy" }, pay: { ru: "◈ Заплатить 100", en: "◈ Pay 100" }, push: { ru: "✊ Давление", en: "✊ Pressure" } };

let V, ctx;
export function run(c) {
  ctx = c;
  V = { i: 0, round: 1, lean: {}, votes: null, my: "", log: [], results: {}, failed: 0, actions: 0, sel: "", stage: "issue", expelLean: {} };
  brief(ctx, { icon: "🗳️", name: tr("Единогласие", "Unanimous"), rules: [
    tr("Класс D голосует по пяти вопросам. Решение принимается, только если «за» или «против» проголосовали <b>все</b>.", "Class D votes on five questions. A decision passes only when <b>everyone</b> votes the same way."),
    tr("На каждый вопрос — до трёх голосований. Перед каждым у вас есть несколько действий, чтобы переубедить одноклассников.", "Each question allows up to three votes. Before each one you get a few actions to change classmates' minds."),
    tr("Подходы: логика (Интеллект), эмпатия (Общение), деньги (◈100) и давление (портит доверие). На разных людей действует разное.", "Approaches: logic (Intellect), empathy (Social), money (◈100) and pressure (hurts trust). Different people respond to different things."),
    tr("Не договорились за три голосования — класс получает −30, и остаётся всё как было.", "No agreement after three votes: the class gets −30 and nothing changes."),
    tr("С Общением 6+ вы видите, насколько твёрдо каждый стоит на своём.", "With Social 6+ you can see how firmly each person holds their position."),
  ] }, startIssue);
}
const voters = () => classmates();
const issue = () => ISSUES[V.i];
const canRead = () => G.stats.soc >= 6;
const maxActions = () => 2 + (G.stats.soc >= 7 ? 1 : 0);

function startIssue() {
  const is = issue();
  V.round = 1; V.votes = null; V.actions = 0; V.sel = ""; V.my = "";
  voters().forEach(p => { V.lean[p.id] = clamp((is.lean[p.id] ?? 0) + rnd(31) - 15 + (trust(p.id) - 50) * .2, -100, 100); });
  view();
}

function seat(p) {
  const l = V.lean[p.id], v = V.votes ? V.votes[p.id] : "";
  const firm = Math.abs(l) > 60 ? tr("твёрдо", "firm") : Math.abs(l) > 25 ? tr("уверенно", "fairly sure") : tr("колеблется", "wavering");
  return `<button class="seat ${V.sel === p.id ? "sel" : ""} ${v}" data-p="${p.id}">${face(p, { size: "sm", mood: v === V.my && V.my ? "smile" : "" })}
    <b>${nm(p)}</b>${v ? `<span class="vote ${v}">${v === "yes" ? "✓" : "✗"}</span>` : ""}
    ${canRead() ? `<small class="firm">${l > 0 ? "→ " + tr("за", "yes") : "→ " + tr("против", "no")} · ${firm}</small><i class="lean"><i style="left:${50 + l / 2}%"></i></i>` : ""}</button>`;
}

function view(note = "") {
  ctx.setRerender(() => view(note));
  const is = issue();
  ctx.frame(`<div class="exam-bar"><span>🗳️ ${tr("Вопрос", "Question")} <b>${V.i + 1}/5</b></span><span>${tr("Голосование", "Vote")} <b>${V.round}/3</b></span><span>${tr("Действий", "Actions")} <b>${maxActions() - V.actions}</b></span><span>◈ ${G.pp}</span></div>
  <section class="vote-grid">
    <div class="paper">
      <p class="kicker">${tr("Вопрос", "Question")} ${V.i + 1}</p><h2 class="issue">${tr(is.q.ru, is.q.en)}</h2>
      <div class="classroom">${voters().map(seat).join("")}</div>
    </div>
    <div class="paper">
      <h3>${tr("Ваша позиция", "Your position")}</h3>
      <div class="seg wide"><button data-my="yes" class="${V.my === "yes" ? "sel" : ""}">✓ ${tr(is.yes.ru, is.yes.en)}</button><button data-my="no" class="${V.my === "no" ? "sel" : ""}">✗ ${tr(is.no.ru, is.no.en)}</button></div>
      <h3>${tr("Убедить", "Persuade")} ${V.sel ? nm(byId(V.sel)) : ""}</h3>
      ${V.sel ? `<div class="pills">${Object.keys(APPROACH).map(a => `<button class="pill" data-ap="${a}" ${!V.my || V.actions >= maxActions() || (a === "pay" && G.pp < 100) ? "disabled" : ""}>${tr(APPROACH[a].ru, APPROACH[a].en)}</button>`).join("")}</div>` : `<p class="dim">${tr("Выберите одноклассника слева.", "Pick a classmate on the left.")}</p>`}
      <button class="btn" data-ap="all" ${!V.my || V.actions >= maxActions() ? "disabled" : ""}>📢 ${tr("Обратиться ко всему классу", "Address the whole class")}</button>
      ${note ? `<div class="note">${note}</div>` : ""}
      <button class="btn primary" id="vote" ${V.my ? "" : "disabled"}>${tr("Голосовать", "Vote")} →</button>
      <div class="log">${V.log.slice(-5).reverse().map(l => `<p>${l}</p>`).join("")}</div>
    </div></section>`);
  const root = $(".vote-grid");
  root.onclick = e => {
    const s = e.target.closest("[data-p]"), m = e.target.closest("[data-my]"), a = e.target.closest("[data-ap]");
    if (s) { V.sel = s.dataset.p; return view(); }
    if (m) { V.my = m.dataset.my; return view(); }
    if (a && !a.disabled) return persuade(a.dataset.ap);
  };
  $("#vote").onclick = vote;
}

function power(p, a) {
  const st = a === "logic" ? G.stats.int : a === "heart" ? G.stats.soc : a === "push" ? (G.stats.phy + G.stats.soc) / 2 : 6;
  const f = issue().flavor[a] ?? 1;
  return (10 + st * 4) * (p.sway[a] ?? .5) * f * (.6 + trust(p.id) / 100) * (STUBBORN[p.id] ?? 1);
}
function persuade(a) {
  const dir = V.my === "yes" ? 1 : -1;
  V.actions++;
  if (a === "all") {
    const moved = [];
    voters().forEach(p => { const d = (6 + G.stats.soc * 2) * ((p.sway.logic + p.sway.heart) / 2) * (STUBBORN[p.id] ?? 1); V.lean[p.id] = clamp(V.lean[p.id] + dir * d, -100, 100); moved.push(p); });
    V.log.push(`📢 ${tr("Вы выступили перед классом.", "You addressed the class.")}`);
    follow();
    return view(tr("Класс слушал внимательно. Кто-то задумался.", "The class listened. Some of them are thinking it over."));
  }
  const p = byId(V.sel);
  if (a === "pay") { G.pp -= 100; addTrust(p.id, 1); }
  if (a === "push") addTrust(p.id, -6);
  if (a === "heart") addTrust(p.id, 3);
  const d = power(p, a) * (.7 + Math.random() * .6);
  const before = V.lean[p.id];
  V.lean[p.id] = clamp(V.lean[p.id] + dir * d, -100, 100);
  const flipped = Math.sign(before) !== Math.sign(V.lean[p.id]) && V.lean[p.id] !== 0;
  const r = d > 18 ? pick(REACT[a]) : pick(REACT.none);
  V.log.push(`${tr(APPROACH[a].ru, APPROACH[a].en)} → ${nm(p)}${flipped ? " ✔" : ""}`);
  if (flipped && p.id === "sasha") follow(true);
  view(line(p, tr(r.ru, r.en), d > 18 ? "smile" : "angry"));
}
// Sasha pulls the undecided with her
function follow(force = false) {
  const s = V.lean.sasha; if (s === undefined) return;
  if (!force && Math.abs(s) < 30) return;
  voters().forEach(p => { if (p.id !== "sasha" && Math.abs(V.lean[p.id]) < 25) V.lean[p.id] = clamp(V.lean[p.id] + Math.sign(s) * 15, -100, 100); });
}

function vote() {
  V.votes = {}; voters().forEach(p => V.votes[p.id] = V.lean[p.id] >= 0 ? "yes" : "no");
  const all = Object.values(V.votes).every(v => v === V.my);
  if (all) return resolve(V.my);
  const yes = Object.values(V.votes).filter(v => v === "yes").length + (V.my === "yes" ? 1 : 0), tot = voters().length + 1;
  V.log.push(`🗳️ ${tr("Голосование", "Vote")} ${V.round}: ${yes} ${tr("за", "yes")}, ${tot - yes} ${tr("против", "no")}`);
  if (V.round >= 3) { V.failed++; return resolve("", true); }
  // the minority feels the room
  const maj = yes * 2 > tot ? 1 : -1;
  voters().forEach(p => { if (Math.sign(V.lean[p.id]) !== maj) V.lean[p.id] = clamp(V.lean[p.id] + maj * 8 * (STUBBORN[p.id] ?? 1), -100, 100); });
  V.round++; V.actions = 0;
  view(tr(`Нет единогласия: ${yes} за, ${tot - yes} против. Ещё попытка.`, `No unanimity: ${yes} yes, ${tot - yes} no. Try again.`));
}

function resolve(res, failed = false) {
  const is = issue();
  V.results[is.id] = failed ? "fail" : res;
  if (is.id === "expel" && res === "yes") return expelVote();
  V.i++;
  const msg = failed ? tr("Класс не договорился: −30.", "The class couldn't agree: −30.") : tr(`Решение принято единогласно: «${res === "yes" ? tr(is.yes.ru, is.yes.en) : tr(is.no.ru, is.no.en)}».`, `Decided unanimously: '${res === "yes" ? tr(is.yes.ru, is.yes.en) : tr(is.no.ru, is.no.en)}'.`);
  V.log.push((failed ? "❌ " : "✅ ") + msg);
  if (V.i >= ISSUES.length) return finish();
  startIssue();
  view(msg);
}

// ── the last question, part two: who goes
function expelVote() {
  V.stage = "who"; V.round = 1; V.actions = 0;
  const pool = [...voters(), me()];
  const merit = p => p.int + p.phy + p.soc;
  // each classmate picks someone: low merit and low trust make you a candidate; you are one too
  V.picks = {};
  voters().forEach(p => {
    const scores = pool.filter(c => c.id !== p.id).map(c => [c.id, merit(c) * 3 + (c.id === "you" ? trust(p.id) * .6 : 40) + rnd(10) + (c.id === "yuki" ? -6 : 0)]);
    scores.sort((a, b) => a[1] - b[1]); V.picks[p.id] = scores[0][0];
  });
  V.myPick = "";
  whoView();
}
function whoView(note = "") {
  ctx.setRerender(() => whoView(note));
  const pool = [...voters(), me()], count = {};
  Object.values(V.picks).forEach(id => count[id] = (count[id] || 0) + 1);
  ctx.frame(`<div class="exam-bar"><span>🗳️ ${tr("Кого исключить", "Who goes")}</span><span>${tr("Голосование", "Vote")} <b>${V.round}/3</b></span><span>${tr("Действий", "Actions")} <b>${maxActions() - V.actions}</b></span><span>🛡️ ${G.items.protect}</span></div>
  <section class="vote-grid"><div class="paper">
    <h2 class="issue">${tr("Класс согласился. Теперь нужно единогласно выбрать, кто уйдёт.", "The class agreed. Now it must choose, unanimously, who leaves.")}</h2>
    <div class="classroom">${pool.map(p => `<button class="seat ${V.sel === p.id ? "sel" : ""}" data-p="${p.id}">${face(p, { size: "sm" })}<b>${nm(p)}</b>${count[p.id] ? `<span class="vote no">${count[p.id]}</span>` : ""}${p.id !== "you" ? `<small class="firm">→ ${V.picks[p.id] === "you" ? esc(G.name) : nm(byId(V.picks[p.id]))}</small>` : ""}</button>`).join("")}</div>
  </div><div class="paper">
    <h3>${tr("Ваш голос", "Your vote")}</h3>
    <div class="pills">${pool.map(p => `<button class="pill ${V.myPick === p.id ? "sel" : ""}" data-pick="${p.id}">${nm(p)}</button>`).join("")}</div>
    ${V.sel && V.sel !== "you" ? `<h3>${tr("Переубедить", "Change the vote of")} ${nm(byId(V.sel))}</h3><div class="pills">${Object.keys(APPROACH).map(a => `<button class="pill" data-ap="${a}" ${!V.myPick || V.actions >= maxActions() || (a === "pay" && G.pp < 100) ? "disabled" : ""}>${tr(APPROACH[a].ru, APPROACH[a].en)}</button>`).join("")}</div>` : `<p class="dim">${tr("Выберите свой голос, затем одноклассника, чтобы склонить его к тому же.", "Choose your vote, then a classmate to bring round to it.")}</p>`}
    ${note ? `<div class="note">${note}</div>` : ""}
    <button class="btn primary" id="vote" ${V.myPick ? "" : "disabled"}>${tr("Голосовать", "Vote")} →</button>
  </div></section>`);
  $(".vote-grid").onclick = e => {
    const s = e.target.closest("[data-p]"), pk = e.target.closest("[data-pick]"), a = e.target.closest("[data-ap]");
    if (s) { V.sel = s.dataset.p; return whoView(); }
    if (pk) { V.myPick = pk.dataset.pick; return whoView(); }
    if (a && !a.disabled) {
      const p = byId(V.sel); V.actions++;
      if (a.dataset.ap === "pay") G.pp -= 100;
      if (a.dataset.ap === "push") addTrust(p.id, -6);
      // protecting a friend is easier than condemning one
      const d = power(p, a.dataset.ap) * (.7 + Math.random() * .6) * (V.myPick === "you" ? 1.5 : 1) - (V.myPick === p.id ? 99 : 0);
      if (d > 26) { V.picks[p.id] = V.myPick; whoView(line(p, tr("…Хорошо. Я проголосую так же.", "…Alright. I'll vote the same way."))); }
      else whoView(line(p, tr("Я своё решение не поменяю.", "I'm not changing my vote."), "angry"));
    }
  };
  $("#vote").onclick = () => {
    const all = Object.values(V.picks).every(id => id === V.myPick);
    if (all) return expel(V.myPick);
    if (V.round >= 3) { V.results.expel = "fail"; V.failed++; V.i++; return finish(tr("Класс так и не выбрал, кого исключить. Предложение школы сгорело.", "The class never agreed on who should go. The school's offer expired.")); }
    // votes drift towards whoever leads
    const count = {}; Object.values(V.picks).forEach(id => count[id] = (count[id] || 0) + 1);
    const lead = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
    voters().forEach(p => { if (V.picks[p.id] !== lead && p.id !== lead && Math.random() < .35) V.picks[p.id] = lead; });
    V.round++; V.actions = 0;
    whoView(tr("Единогласия нет. Голоса сдвигаются…", "No unanimity. The votes are shifting…"));
  };
}
function expel(id) {
  V.i++;
  if (id === "you") {
    if (G.items.protect > 0) { G.items.protect--; V.expelled = ""; V.saved = true; return finish(tr("Класс единогласно назвал вас. Вы молча положили на стол балл защиты. Исключение отменено, а 100 очков класс всё равно получил.", "The class named you, unanimously. You quietly put a Protect Point on the desk. The expulsion is cancelled, and the class still gets its 100 points.")); }
    V.expelled = "you"; return finish(tr("Класс единогласно назвал вас.", "The class named you, unanimously."));
  }
  V.expelled = id;
  finish(tr(`Класс единогласно исключил ${nm(byId(id))}.`, `The class unanimously expelled ${nm(byId(id))}.`));
}

function finish(extra = "") {
  const r = V.results, cp = { D: -30 * V.failed }, lines = [], trustD = {};
  G.flags = G.flags || {};
  if (r.tutor === "yes") { G.pp -= 100; G.flags.tutor = true; lines.push(tr("Репетитор нанят: на дуэли класс D будет сильнее в интеллектуальных дисциплинах.", "A tutor was hired: Class D will be stronger in brain events at the duel.")); }
  if (r.deal === "yes") { cp.D += 40; G.flags.noA = true; lines.push(tr("Сделка с A: +40 сейчас, но на дуэли класс A вам не соперник.", "The deal with A: +40 now, but Class A can't be your duel opponent.")); }
  if (r.fight === "yes") { cp.D -= 40; trustD.tom = 20; lines.push(tr("Класс взял штраф за Тома (−40). Том этого не забудет.", "The class took Tom's penalty (−40). Tom won't forget it.")); }
  else if (r.fight === "no") { G.flags.noTom = true; trustD.tom = -25; lines.push(tr("Том отстранён от дуэли.", "Tom is barred from the duel.")); }
  if (r.leak === "yes") { G.flags.noLeak = true; trustD.ken = -15; classmates().forEach(p => trustD[p.id] = (trustD[p.id] || 0) - 3); lines.push(tr("Проверка нашла крота: это был Кэн. Класс C больше не знает ваших планов.", "The check found the mole: it was Ken. Class C no longer knows your plans.")); }
  if (V.expelled === "you") { lines.push(extra); return ctx.done({ headline: tr("Вас исключили", "You were expelled"), lines, cp: { D: (cp.D || 0) + 100 }, expelled: "you" }); }
  if (V.expelled || V.saved) { cp.D += 100; if (V.expelled) classmates().forEach(p => trustD[p.id] = (trustD[p.id] || 0) - 4); }
  if (extra) lines.push(extra);
  const ok = 5 - V.failed;
  ctx.done({ headline: tr(`Единогласно решено ${ok} из 5 вопросов`, `${ok} of 5 questions decided unanimously`), lines, cp, trust: trustD, expelled: V.expelled || "" });
}
