// Merit Academy: campaign, free time, results and endings. Each exam lives in its own module and is loaded on demand.
import { PEOPLE, byId, classOf, portrait, playerPortrait, CLASSES } from "./people.js";

export const $ = s => document.querySelector(s);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const rnd = n => Math.random() * n | 0;
export const pick = a => a[rnd(a.length)];
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const SAVE = "merit-save-v1";
export let G = null;
export const tr = (ru, en) => (G?.lang || guessLang()) === "ru" ? ru : en;
function guessLang() { try { return localStorage.getItem("merit-lang") || ((navigator.language || "").startsWith("ru") ? "ru" : "en"); } catch { return "en"; } }
export const nm = p => p.id === "you" ? esc(G.name) : esc(p.name[G.lang] || p.name.en);
export const face = (p, opt) => p.id === "you" ? playerPortrait(opt?.size || "") : portrait(p, opt);
export function me() { return { id: "you", cls: "D", name: { en: G.name, ru: G.name }, ...G.stats, sway: { logic: 1, heart: 1, pay: 1, push: 1 } }; }
export const classmates = () => classOf("D").filter(p => !G.expelled.includes(p.id));
export const trust = id => G.trust[id] ?? 50;
export function addTrust(id, d) { G.trust[id] = clamp(trust(id) + d, 0, 100); }

const EXAMS = ["island", "target", "vote", "duel"];
export const EXAM_INFO = {
  island: { ru: "Необитаемый остров", en: "The Island", icon: "🏝️", sub: { ru: "7 дней, 300 очков экзамена и тайный лидер", en: "7 days, 300 exam points and a secret leader" } },
  target: { ru: "Цель", en: "The Target", icon: "🎯", sub: { ru: "Найти тайную цель в группе из восьми — или предать группу", en: "Find the secret target in a group of eight, or betray the group" } },
  vote: { ru: "Единогласие", en: "Unanimous", icon: "🗳️", sub: { ru: "Класс должен проголосовать единогласно. Последний вопрос — исключение", en: "The class must vote as one. The last question is an expulsion" } },
  duel: { ru: "Дуэль классов", en: "Class Duel", icon: "♟️", sub: { ru: "Семь дисциплин против другого класса. Вы командуете", en: "Seven events against another class. You give the orders" } },
};
const xname = id => tr(EXAM_INFO[id].ru, EXAM_INFO[id].en);

// ── save / load
export function save() { if (G.mode === "campaign") try { localStorage.setItem(SAVE, JSON.stringify(G)); } catch { } }
function load() { try { return JSON.parse(localStorage.getItem(SAVE) || "null"); } catch { return null; } }
function newGame(over = {}) {
  const t = {}; PEOPLE.forEach(p => t[p.id] = p.cls === "D" ? 45 + rnd(16) : 30 + rnd(15));
  return { v: 1, lang: guessLang(), name: "", stats: { int: 4, phy: 4, soc: 4 }, pp: 300, cp: { A: 820, B: 700, C: 560, D: 380 }, trust: t,
    items: { protect: 0, intel: 0 }, step: 0, phase: "intro", mode: "campaign", diff: "normal", expelled: [], log: [], ...over };
}

// ── frame
function frame(inner, { bar = true } = {}) {
  document.documentElement.lang = G?.lang || guessLang();
  $("#app").innerHTML = `${bar && G ? hud() : ""}<main class="main">${inner}</main>`;
  window.scrollTo(0, 0);
  bindHud();
}
export function hud() {
  const order = Object.keys(G.cp).sort((a, b) => G.cp[b] - G.cp[a]);
  return `<header class="hud">
    <a class="crest" href="./" title="Merit Academy">${CREST}<span>${tr("Академия Заслуг", "Merit Academy")}</span></a>
    <div class="ranks">${order.map((c, i) => `<span class="rk ${c === "D" ? "mine" : ""}" style="--c:${CLASSES[c].color}"><i>${i + 1}</i>${c}<b>${G.cp[c]}</b></span>`).join("")}</div>
    <div class="pp" title="${tr("Личные очки", "Private points")}">◈ ${G.pp}</div>
    <button class="lang" data-lang>${G.lang === "ru" ? "EN" : "RU"}</button>
  </header>`;
}
function bindHud() {
  const b = document.querySelector("[data-lang]");
  if (b) b.onclick = () => { G.lang = G.lang === "ru" ? "en" : "ru"; try { localStorage.setItem("merit-lang", G.lang); } catch { } save(); rerender(); };
}
let rerender = () => title();
export function setRerender(f) { rerender = f; }
export const CREST = `<svg viewBox="0 0 40 46" class="crest-svg" aria-hidden="true"><path d="M20 2l17 6v14c0 12-8 19-17 22C11 41 3 34 3 22V8z" fill="#14182a" stroke="#c9a227" stroke-width="2.5"/><path d="M12 30V16l8 9 8-9v14" fill="none" stroke="#c9a227" stroke-width="3" stroke-linejoin="round"/></svg>`;

// a classmate speaking: portrait + bubble
export const line = (p, text, mood = "") => `<div class="say"><div class="say-face">${face(p, { mood, size: "sm" })}</div><div class="say-b"><b>${nm(p)}</b><p>${text}</p></div></div>`;
export function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.innerHTML = msg; document.body.append(t); setTimeout(() => t.remove(), 2600); }

// ── title
export function title() {
  G = G || newGame();
  setRerender(title);
  const saved = load();
  frame(`<section class="title">
    <div class="title-crest">${CREST}</div>
    <p class="kicker">${tr("Особые экзамены", "Special exams")}</p>
    <h1>${tr("Академия Заслуг", "Merit Academy")}</h1>
    <p class="lead">${tr("Школа, где каждый месяц класс получает очки за свои заслуги, а каждый экзамен может стоить кому-то места. Ваш класс D — последний. Пока.",
      "A school where every class is paid for its merit each month, and any exam can cost someone their place. Your Class D is the last one. For now.")}</p>
    <div class="menu">
      ${saved && saved.phase !== "end" ? `<button class="btn primary" data-go="continue">${tr("Продолжить", "Continue")} · ${esc(saved.name)}, ${tr("экзамен", "exam")} ${Math.min(4, saved.step + 1)}/4</button>` : ""}
      <button class="btn ${saved && saved.phase !== "end" ? "" : "primary"}" data-go="new">${tr("Новая кампания", "New campaign")}</button>
      <button class="btn" data-go="room">${tr("Экзаменационный зал: один экзамен", "Exam room: play one exam")}</button>
      <button class="btn ghost" data-go="rules">${tr("Как устроена школа", "How the school works")}</button>
    </div>
    <p class="foot"><a href="../">← PuzzleGekko</a> · <button class="link" data-lang>${G.lang === "ru" ? "English" : "Русский"}</button></p>
  </section>`, { bar: false });
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { G.lang = G.lang === "ru" ? "en" : "ru"; try { localStorage.setItem("merit-lang", G.lang); } catch { } title(); });
  $(".menu").onclick = e => {
    const b = e.target.closest("[data-go]"); if (!b) return;
    const go = b.dataset.go;
    if (go === "continue") { G = saved; G.lang = guessLang(); route(); }
    if (go === "new") { G = newGame({ lang: G.lang }); create(); }
    if (go === "room") room();
    if (go === "rules") rules();
  };
}

function rules() {
  setRerender(rules);
  frame(`<section class="paper">
    <h2>${tr("Правила Академии", "Academy rules")}</h2>
    <ol class="rules">
      <li>${tr("<b>Очки класса (CP)</b> определяют место класса. В конце года класс с наибольшими очками становится классом A — только его выпускники получают всё, что обещает школа.", "<b>Class points (CP)</b> decide each class's rank. At the end of the year the class with the most points becomes Class A, and only its graduates get everything the school promises.")}</li>
      <li>${tr("<b>Личные очки (◈)</b> — ваши деньги. Перед каждым экзаменом класс получает стипендию, равную своим CP. На них покупают информацию, услуги и даже защиту от исключения.", "<b>Private points (◈)</b> are your money. Before each exam you are paid a stipend equal to your class's CP. They buy information, favours and even protection from expulsion.")}</li>
      <li>${tr("<b>Особые экзамены</b> — четыре за кампанию. Правила каждого объясняют перед стартом. Ищите в них лазейки: школа проверяет не знания, а способности.", "<b>Special exams</b>: four per campaign. Each one's rules are explained before it starts. Look for loopholes: the school tests ability, not knowledge.")}</li>
      <li>${tr("<b>Доверие</b> одноклассников растёт, когда вы помогаете им, и падает, когда вы ими жертвуете. От него зависят голосования и то, кто будет прикрывать вас.", "<b>Trust</b> grows when you help classmates and falls when you sacrifice them. It decides votes and who will cover for you.")}</li>
      <li>${tr("<b>Исключение</b> возможно. Балл защиты (Protect Point) один раз спасает от него.", "<b>Expulsion</b> is possible. A Protect Point saves you from it once.")}</li>
    </ol>
    <button class="btn" data-back>← ${tr("Назад", "Back")}</button></section>`, { bar: false });
  $("[data-back]").onclick = title;
}

// ── character creation
function create() {
  setRerender(create);
  const s = G.stats, left = () => 15 - s.int - s.phy - s.soc;
  const row = (k, ru, en, dru, den) => `<div class="stat"><div><b>${tr(ru, en)}</b><small>${tr(dru, den)}</small></div>
    <div class="pips">${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `<i class="${i <= s[k] ? "on" : ""}"></i>`).join("")}</div>
    <div class="step"><button data-k="${k}" data-d="-1" aria-label="-">−</button><b>${s[k]}</b><button data-k="${k}" data-d="1" aria-label="+">+</button></div></div>`;
  frame(`<section class="paper narrow">
    <p class="kicker">${tr("Анкета поступающего", "Admission form")}</p>
    <h2>${tr("Кто вы?", "Who are you?")}</h2>
    <label class="field">${tr("Имя", "Name")}<input id="nm" maxlength="16" value="${esc(G.name)}" placeholder="${tr("Ваше имя", "Your name")}"></label>
    <p class="dim">${tr("Распределите способности. Школа видит только оценки, но экзамены проверят всё остальное. Осталось очков:", "Distribute your abilities. The school sees only your grades; the exams will test the rest. Points left:")} <b id="left">${left()}</b></p>
    ${row("int", "Интеллект", "Intellect", "Разведка, дедукция, логические доводы", "Scouting, deduction, logical arguments")}
    ${row("phy", "Физика", "Physique", "Выживание, спортивные дисциплины", "Survival, athletic events")}
    ${row("soc", "Общение", "Social", "Убеждение, союзы, чтение людей", "Persuasion, alliances, reading people")}
    <label class="field">${tr("Сложность", "Difficulty")}
      <span class="seg"><button data-diff="normal" class="${G.diff === "normal" ? "sel" : ""}">${tr("Обычная", "Normal")}</button><button data-diff="hard" class="${G.diff === "hard" ? "sel" : ""}">${tr("Высокая", "Hard")}</button></span></label>
    <button class="btn primary" id="go" ${left() ? "disabled" : ""}>${tr("Поступить", "Enrol")} →</button>
  </section>`, { bar: false });
  $("#nm").oninput = e => G.name = e.target.value;
  document.querySelector(".paper").onclick = e => {
    const b = e.target.closest("[data-k]"), d = e.target.closest("[data-diff]");
    if (d) { G.diff = d.dataset.diff; create(); return; }
    if (!b) return;
    const k = b.dataset.k, v = s[k] + +b.dataset.d;
    if (v < 2 || v > 8 || (+b.dataset.d > 0 && !left())) return;
    s[k] = v; const nmv = G.name; create(); $("#nm").value = nmv;
  };
  $("#go").onclick = () => { G.name = ($("#nm").value || "").trim() || tr("Новичок", "Newcomer"); G.phase = "prologue"; save(); route(); };
}

// ── campaign router
export function route() {
  if (G.phase === "prologue") return prologue();
  if (G.phase === "free") return freeTime();
  if (G.phase === "exam") return startExam(EXAMS[G.step]);
  if (G.phase === "end") return ending();
  title();
}
function prologue() {
  setRerender(prologue);
  const mira = byId("mira"), dev = byId("dev"), sasha = byId("sasha");
  frame(`<section class="paper">
    <p class="kicker">${tr("Апрель. Первый месяц", "April. The first month")}</p>
    <h2>${tr("Добро пожаловать в класс D", "Welcome to Class D")}</h2>
    <p>${tr(`В первый день каждому выдали по 1000 очков на карту. Класс D потратил всё за неделю: опоздания, разговоры на уроках, прогулы. В мае на счёт пришло 380 — школа всё это время ставила оценки. Классы A, B и C уже далеко впереди.`,
      `On the first day everyone got 1,000 points on their card. Class D spent everything within a week: lateness, chatter, skipped classes. In May only 380 arrived; the school had been grading all along. Classes A, B and C are already far ahead.`)}</p>
    ${line(mira, tr("Я не собираюсь выпускаться из последнего класса. Если вы тоже, работаем вместе.", "I don't intend to graduate from the bottom class. If you don't either, we work together."), "angry")}
    ${line(dev, tr("Работать вместе — это мило. Но платят тут за результат, а не за дружбу.", "Working together is cute. But here they pay for results, not friendship."))}
    ${line(sasha, tr("Слышали? Скоро первый особый экзамен. Говорят, нас куда-то повезут.", "Did you hear? The first special exam is soon. They say we're going somewhere."), "smile")}
    <p class="dim">${tr("Цель кампании: к концу четырёх экзаменов поднять класс D как можно выше. Идеально — на первое место.", "Goal: after four exams, lift Class D as high as you can. Ideally to first place.")}</p>
    <button class="btn primary" id="go">${tr("Начать", "Begin")} →</button></section>`);
  $("#go").onclick = () => { G.phase = "free"; save(); route(); };
}

// ── free time between exams
let freeSlots = 2;
function freeTime() {
  setRerender(freeTime);
  if (!G.paid) { G.paid = true; G.pp += Math.max(0, G.cp.D); freeSlots = 2; G.slots = 2; save(); }
  freeSlots = G.slots ?? 2;
  const next = EXAMS[G.step];
  const mates = classmates();
  frame(`<section class="free">
    <div class="paper">
      <p class="kicker">${tr("Свободное время", "Free time")} · ${tr("до экзамена", "before exam")} ${G.step + 1}/4</p>
      <h2>${EXAM_INFO[next].icon} ${tr("Скоро:", "Coming up:")} ${xname(next)}</h2>
      <p class="dim">${tr(EXAM_INFO[next].sub.ru, EXAM_INFO[next].sub.en)}</p>
      <p>${tr("Стипендия за месяц пришла:", "This month's stipend has arrived:")} <b>◈ ${Math.max(0, G.cp.D)}</b>. ${tr("Свободных вечеров:", "Free evenings left:")} <b>${freeSlots}</b></p>
      <div class="acts">
        <button class="act" data-a="int" ${freeSlots ? "" : "disabled"}><b>📚 ${tr("Учиться", "Study")}</b><small>${tr("Интеллект +1", "Intellect +1")} (${G.stats.int})</small></button>
        <button class="act" data-a="phy" ${freeSlots ? "" : "disabled"}><b>🏃 ${tr("Тренироваться", "Train")}</b><small>${tr("Физика +1", "Physique +1")} (${G.stats.phy})</small></button>
        <button class="act" data-a="soc" ${freeSlots ? "" : "disabled"}><b>☕ ${tr("Общаться", "Socialise")}</b><small>${tr("Общение +1", "Social +1")} (${G.stats.soc})</small></button>
      </div>
      <h3>${tr("Магазин", "Shop")}</h3>
      <div class="acts">
        <button class="act" data-buy="intel" ${G.pp >= 250 && !G.items.intel ? "" : "disabled"}><b>🕵️ ${tr("Информатор", "Informant")} · ◈250</b><small>${tr("Даёт преимущество на следующем экзамене", "Gives you an edge in the next exam")}${G.items.intel ? " ✓" : ""}</small></button>
        <button class="act" data-buy="protect" ${G.pp >= 1500 ? "" : "disabled"}><b>🛡️ ${tr("Балл защиты", "Protect Point")} · ◈1500</b><small>${tr("Один раз спасает от исключения", "Saves you from expulsion once")} (${G.items.protect})</small></button>
      </div>
      <button class="btn primary" id="toexam">${tr("К экзамену", "To the exam")} →</button>
    </div>
    <div class="paper">
      <h3>${tr("Класс D", "Class D")}</h3>
      <p class="dim">${tr("Проведите вечер с одноклассником (+доверие) или сделайте подарок (◈120, +доверие без траты вечера).", "Spend an evening with a classmate (+trust) or give a gift (◈120, +trust without using an evening).")}</p>
      <div class="roster">${mates.map(p => `<div class="mate"><div class="mf">${face(p, { size: "sm" })}</div><div class="mi"><b>${nm(p)}</b><small>${esc(p.note[G.lang])}</small>
        <div class="tbar" title="${tr("Доверие", "Trust")}"><i style="width:${trust(p.id)}%"></i></div>
        <div class="mb"><button class="mini" data-hang="${p.id}" ${freeSlots ? "" : "disabled"}>${tr("Вечер", "Evening")}</button><button class="mini" data-gift="${p.id}" ${G.pp >= 120 ? "" : "disabled"}>◈120</button>
        <span class="st">🧠${p.int} 💪${p.phy} 💬${p.soc}</span></div></div></div>`).join("")}</div>
    </div></section>`);
  const use = () => { G.slots = --freeSlots; save(); freeTime(); };
  document.querySelector(".free").onclick = e => {
    const a = e.target.closest("[data-a]"), buy = e.target.closest("[data-buy]"), hang = e.target.closest("[data-hang]"), gift = e.target.closest("[data-gift]");
    if (a && freeSlots) { G.stats[a.dataset.a] = Math.min(10, G.stats[a.dataset.a] + 1); toast("+1"); use(); }
    if (buy) { const it = buy.dataset.buy; G.pp -= it === "intel" ? 250 : 1500; it === "intel" ? G.items.intel = 1 : G.items.protect++; save(); freeTime(); }
    if (hang && freeSlots) { const p = byId(hang.dataset.hang); addTrust(p.id, 10 + G.stats.soc); toast(`${nm(p)}: ${tr("доверие растёт", "trust grows")}`); use(); }
    if (gift && G.pp >= 120) { const p = byId(gift.dataset.gift); G.pp -= 120; addTrust(p.id, 6 + (p.sway.pay > 1 ? 8 : 0)); save(); freeTime(); }
  };
  $("#toexam").onclick = () => { G.phase = "exam"; G.paid = false; save(); route(); };
}

// ── exams
const LOADERS = { island: () => import("./exam-island.js"), target: () => import("./exam-target.js"), vote: () => import("./exam-vote.js"), duel: () => import("./exam-duel.js") };
async function startExam(id) {
  const mod = await LOADERS[id]();
  const ctx = { id, frame: (html) => frame(html), done: res => finishExam(id, res), setRerender };
  mod.run(ctx);
}
function finishExam(id, res) {
  const before = { ...G.cp };
  for (const c in res.cp || {}) G.cp[c] = Math.max(0, G.cp[c] + res.cp[c]);
  G.pp = Math.max(0, G.pp + (res.pp || 0));
  for (const k in res.trust || {}) addTrust(k, res.trust[k]);
  if (res.expelled && res.expelled !== "you") G.expelled.push(res.expelled);
  if (G.items.intel && res.usedIntel) G.items.intel = 0;
  G.log.push({ id, title: res.headline || "", cp: res.cp || {} });
  const youOut = res.expelled === "you";
  if (G.mode === "campaign") { if (youOut) { G.phase = "end"; G.fired = true; } else { G.step++; G.phase = G.step >= EXAMS.length ? "end" : "free"; } save(); }
  results(id, res, before);
}
function results(id, res, before) {
  setRerender(() => results(id, res, before));
  const order = Object.keys(G.cp).sort((a, b) => G.cp[b] - G.cp[a]), max = Math.max(...Object.values(G.cp), 1);
  frame(`<section class="paper">
    <p class="kicker">${tr("Итоги экзамена", "Exam results")} · ${xname(id)}</p>
    <h2>${res.headline || ""}</h2>
    ${(res.lines || []).map(l => `<p>${l}</p>`).join("")}
    <div class="cptable">${order.map(c => { const d = G.cp[c] - before[c];
      return `<div class="cprow ${c === "D" ? "mine" : ""}"><b style="color:${CLASSES[c].color}">${tr("Класс", "Class")} ${c}</b><div class="cpbar"><i style="width:${G.cp[c] / max * 100}%;background:${CLASSES[c].color}"></i></div><span>${G.cp[c]}</span><em class="${d > 0 ? "up" : d < 0 ? "down" : ""}">${d > 0 ? "+" : ""}${d || "±0"}</em></div>`; }).join("")}</div>
    ${res.pp ? `<p>◈ ${res.pp > 0 ? "+" : ""}${res.pp} ${tr("личных очков", "private points")}</p>` : ""}
    <button class="btn primary" id="next">${G.mode === "room" ? tr("В экзаменационный зал", "Back to the exam room") : tr("Дальше", "Continue")} →</button></section>`);
  $("#next").onclick = () => G.mode === "room" ? room() : route();
}

function ending() {
  setRerender(ending);
  const order = Object.keys(G.cp).sort((a, b) => G.cp[b] - G.cp[a]), place = order.indexOf("D") + 1;
  const best = classmates().sort((a, b) => trust(b.id) - trust(a.id))[0];
  const text = G.fired ? tr("Класс проголосовал. Ваше имя прозвучало последним. Через час на карте было ноль очков, а в общежитии — пустая комната.", "The class voted. Your name was the last one read out. An hour later your card showed zero points and your dorm room was empty.")
    : place === 1 ? tr("Класс D закончил год первым. Учителя переписывают таблички на дверях, а в классе A впервые за год тихо.", "Class D finished the year in first place. The teachers are changing the door signs, and for the first time this year Class A is quiet.")
    : place === 2 ? tr("Второе место. До класса A не хватило совсем немного, но все в школе теперь знают, что класс D опасен.", "Second place. Class A was within reach, and now the whole school knows Class D is dangerous.")
    : place === 3 ? tr("Третье место. Класс D больше не последний — с этого обычно и начинаются истории.", "Third place. Class D is no longer last, which is usually how these stories begin.")
    : tr("Класс D остался последним. Но вы теперь знаете правила этой школы лучше, чем в апреле.", "Class D is still last. But you know this school's rules far better than you did in April.");
  frame(`<section class="paper ending">
    <p class="kicker">${tr("Конец года", "End of the year")}</p>
    <h2>${G.fired ? tr("Исключён", "Expelled") : tr("Место класса D:", "Class D's place:") + " " + place}</h2>
    <p>${text}</p>
    ${best && !G.fired ? line(best, trust(best.id) > 70 ? tr("Знаешь, я рада, что ты оказался в нашем классе.", "You know, I'm glad you ended up in our class.") : tr("Посмотрим, что будет во втором году.", "Let's see what the second year brings."), "smile") : ""}
    <div class="cptable">${order.map(c => `<div class="cprow ${c === "D" ? "mine" : ""}"><b style="color:${CLASSES[c].color}">${tr("Класс", "Class")} ${c}</b><span>${G.cp[c]}</span></div>`).join("")}</div>
    <p class="dim">${tr("Ваши способности:", "Your abilities:")} 🧠${G.stats.int} 💪${G.stats.phy} 💬${G.stats.soc} · ◈${G.pp}</p>
    <button class="btn primary" id="again">${tr("В главное меню", "Main menu")}</button></section>`);
  $("#again").onclick = () => { try { localStorage.removeItem(SAVE); } catch { } G = newGame({ lang: G.lang }); title(); };
}

// ── exam room: any exam on its own, with an average student
function room() {
  G = newGame({ lang: G?.lang || guessLang(), mode: "room", name: tr("Новичок", "Newcomer"), stats: { int: 5, phy: 5, soc: 5 }, pp: 600, phase: "exam" });
  setRerender(room);
  frame(`<section class="paper">
    <p class="kicker">${tr("Экзаменационный зал", "Exam room")}</p>
    <h2>${tr("Выберите экзамен", "Choose an exam")}</h2>
    <p class="dim">${tr("Один экзамен без кампании: средние способности (5/5/5), ◈600, класс D на последнем месте.", "One exam outside the campaign: average abilities (5/5/5), ◈600, Class D in last place.")}</p>
    <div class="exams">${EXAMS.map(id => `<button class="exam-card" data-x="${id}"><span class="ei">${EXAM_INFO[id].icon}</span><b>${xname(id)}</b><small>${tr(EXAM_INFO[id].sub.ru, EXAM_INFO[id].sub.en)}</small></button>`).join("")}</div>
    <button class="btn ghost" id="back">← ${tr("Меню", "Menu")}</button></section>`);
  $(".exams").onclick = e => { const b = e.target.closest("[data-x]"); if (b) startExam(b.dataset.x); };
  $("#back").onclick = title;
}

// rules card shown before every exam
export function brief(ctx, { icon, name, rules, extra = "" }, onStart) {
  ctx.frame(`<section class="paper brief">
    <p class="kicker">${tr("Особый экзамен", "Special exam")}</p>
    <h2>${icon} ${name}</h2>
    <ol class="rules">${rules.map(r => `<li>${r}</li>`).join("")}</ol>${extra}
    <button class="btn primary" id="start">${tr("Начать экзамен", "Start the exam")} →</button></section>`);
  $("#start").onclick = onStart;
}
export { byId, classOf, PEOPLE, CLASSES, portrait };

window.__merit = () => G; // for the console and tests
title();
