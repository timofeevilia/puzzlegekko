// 81 Trials: the shell. Title, the journey scroll, dialogue, rules, hints and the seals you earn.
import { bust, NAMES, seal, scene, PILGRIMS } from "./art.js";
import { TRIALS } from "./trials.js";
import { initSound, sfx, music, stopMusic, soundOn, setSound } from "./sound.js";
import { createRoom, joinRoom, cleanCode, available } from "./coop.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SAVE = "xyj81-v1";
const nav = (navigator.language || "").slice(0, 2);
let G = (() => { try { return JSON.parse(localStorage.getItem(SAVE)) || null; } catch { return null; } })() || { lang: nav === "ru" ? "ru" : nav === "my" ? "my" : "en", done: {} };
const save = () => { try { localStorage.setItem(SAVE, JSON.stringify(G)); } catch { } };
const tr = (ru, en, my) => G.lang === "ru" ? ru : G.lang === "my" && my !== undefined ? my : en;
const LANGS = { ru: "Русский", en: "English", my: "မြန်မာ" }, NEXT = { ru: "en", en: "my", my: "ru" };
const T = o => o[G.lang] || o.en;
const ZH = n => { const d = "〇一二三四五六七八九"; if (n <= 10) return n === 10 ? "十" : d[n]; if (n < 20) return "十" + d[n - 10]; return d[Math.floor(n / 10)] + "十" + (n % 10 ? d[n % 10] : ""); };
const total = () => Object.values(G.done).reduce((s, v) => s + v, 0);
// a seeded random generator, so that both screens of a game for two build the same puzzle
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// ── a game for two: the first player is Wukong (with Sha Wujing), the second Bajie (with the Tang monk)
let LINK = null, CUR = null, SCREEN = "", leftRun = -1;
const ROLE = [{ ru: "Укун", en: "Wukong", my: "ဝူခုန်း" }, { ru: "Бацзе", en: "Bajie", my: "ပါကျဲ" }];
const PAIR = [{ ru: "Укун и Ша Сэн", en: "Wukong and Sha Wujing", my: "ဝူခုန်းနဲ့ ရှာဝူကျင်း" }, { ru: "Бацзе и Танский монах", en: "Bajie and the Tang monk", my: "ပါကျဲနဲ့ ထန်ဘုန်းကြီး" }];
const who = w => T(ROLE[w]);
function toast(text) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div"); t.className = "toast"; t.textContent = text; document.body.append(t);
  setTimeout(() => t.classList.add("out"), 1600); setTimeout(() => t.remove(), 2200);
}
const coopChip = () => LINK ? `<span class="chip p${LINK.me}" title="${esc(T(PAIR[LINK.me]))}"><i></i>${esc(who(LINK.me))}${LINK.S.guest ? "" : " …"}</span>` : "";

function top(extra = "") {
  return `<header class="top"><a class="brand" href="#" data-nav="map"><span class="zh">西游记</span><span>${tr("81 испытание", "81 Trials", "ဒုက္ခ ၈၁ ပါး")}</span></a>
    ${extra}${coopChip()}<span class="score" title="${tr("Печати", "Seals", "တံဆိပ်များ")}">${seal("印", { size: 26 })}<b>${total()}</b></span>
    <button class="ib" data-snd title="${tr("Звук", "Sound", "အသံ")}">${soundOn() ? "🔔" : "🔕"}</button><button class="ib" data-lang title="${LANGS[NEXT[G.lang]]}">${{ ru: "EN", en: "မြန်မာ", my: "RU" }[G.lang]}</button></header>`;
}
function bindTop(rerender) {
  document.querySelectorAll("[data-nav=map]").forEach(a => a.onclick = e => { e.preventDefault(); const inTrial = SCREEN === "trial"; map(); if (LINK && inTrial) LINK.choose(-1); });
  document.querySelector("[data-snd]")?.addEventListener("click", e => { initSound(); setSound(!soundOn()); if (soundOn()) music(); e.currentTarget.textContent = soundOn() ? "🔔" : "🔕"; });
  document.querySelector("[data-lang]")?.addEventListener("click", () => { G.lang = NEXT[G.lang]; save(); rerender(); });
}

// ── title
function title() {
  document.documentElement.lang = G.lang;
  $("#app").innerHTML = `<div class="titlepage">${scene("mountain")}
    <div class="clouds"><i></i><i></i><i></i></div>
    <div class="tcenter">
      <div class="vert">西游记</div>
      <div class="tbox"><h1>${tr("81 испытание", "81 Trials", "ဒုက္ခ ၈၁ ပါး")}</h1>
        <p>${tr("Танский монах и трое его учеников идут на Запад за священными свитками. Девяносто девять раз по девять бед ждут их в пути. Каждую беду можно одолеть не силой, а умом.", "The Tang monk and his three disciples travel west for the sacred scriptures. Nine times nine calamities await them on the road. Each one can be overcome not by strength, but by wit.", "ထန်ဘုန်းကြီးနဲ့ တပည့်သုံးယောက်ဟာ ကျမ်းစာတော်တွေ ယူဖို့ အနောက်ဘက်ကို ခရီးထွက်ကြတယ်။ လမ်းမှာ ဒုက္ခ ကိုးကိုး ရှစ်ဆယ့်တစ်ပါး စောင့်နေတယ်။ တစ်ခုချင်းကို အင်အားနဲ့ မဟုတ်ဘဲ ဉာဏ်နဲ့ ကျော်လွှားနိုင်တယ်။")}</p>
        <div class="tbtns"><button class="btn red" id="go">${tr("В путь одному", "Set out alone", "တစ်ယောက်တည်း ခရီးစမယ်")} →</button><button class="btn" id="two">👥 ${tr("Вдвоём", "For two", "နှစ်ယောက်")}</button></div>
        <p class="tfoot"><a href="../">← PuzzleGekko</a> · ${Object.keys(LANGS).filter(l => l !== G.lang).map(l => `<button class="link" data-l="${l}" lang="${l}">${LANGS[l]}</button>`).join(" · ")}</p></div>
      <div class="sealrow">${seal("取经")}${seal("西")}</div>
    </div>
    <div class="walkers">${PILGRIMS}</div></div>`;
  SCREEN = "title";
  $("#go").onclick = () => { initSound(); music(); map(); };
  $("#two").onclick = () => { initSound(); coopMenu(); };
  document.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { G.lang = b.dataset.l; save(); title(); });
}

// ── the journey scroll
function map() {
  document.documentElement.lang = G.lang;
  if (CUR) leftRun = CUR.run; CUR = null; SCREEN = "map";
  document.querySelectorAll(".dlg").forEach(d => d.remove());
  const next = TRIALS.findIndex(t => !G.done[t.id]);
  const cur = next < 0 ? TRIALS.length - 1 : next;
  const X = i => 160 + i * 150, Y = i => 230 + Math.sin(i * .9) * 90 + (i % 3) * 8;
  const path = Array.from({ length: 81 }, (_, i) => `${i ? "L" : "M"}${X(i)} ${Y(i)}`).join(" ");
  const width = X(80) + 200;
  $("#app").innerHTML = `${top()}<main class="mappage">
    <div class="maphead"><h2>${tr("Путь на Запад", "The Road West", "အနောက်ဘက်သို့ လမ်း")}</h2><p>${tr(`Пройдено испытаний: ${Object.keys(G.done).length} из 81. Открыто: ${TRIALS.length}.`, `Trials passed: ${Object.keys(G.done).length} of 81. Open: ${TRIALS.length}.`, `ကျော်ဖြတ်ပြီး: ${Object.keys(G.done).length} / ၈၁။ ဖွင့်ထားတာ: ${TRIALS.length}။`)}</p>${coopBanner()}</div>
    <div class="scrollwrap"><i class="roller l"></i><div class="scroll" id="scroll"><div class="strip" style="width:${width}px"><div class="stripbg">${["mountain", "temple", "bones", "river", "fire", "cave", "mountain", "river"].map(n => scene(n, { paper: false })).join("")}</div>
      <svg class="road" viewBox="0 0 ${width} 460" width="${width}" height="460" aria-hidden="true"><path d="${path}" fill="none" stroke="#8a6a3a" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/></svg>
      ${Array.from({ length: 81 }, (_, i) => { const t = TRIALS[i], open = !!t, done = t && G.done[t.id];
        return `<button class="node ${open ? "open" : "locked"} ${done ? "done" : ""} ${i === cur ? "cur" : ""}" style="left:${X(i)}px;top:${Y(i)}px" ${open ? `data-t="${i}"` : "disabled"} aria-label="${open ? esc(T(t.name)) : tr("Скоро", "Soon", "မကြာမီ")}">
          ${seal(open ? t.zh.slice(0, 2) : ZH(i + 1), { size: open ? 70 : 46, dim: !open })}
          ${open ? `<span class="nlabel"><b>${ZH(i + 1)} · ${esc(T(t.name))}</b>${done ? `<span class="stars">${"●".repeat(done)}${"○".repeat(3 - done)}</span>` : ""}</span>` : ""}</button>`; }).join("")}
      <div class="here" style="left:${X(cur)}px;top:${Y(cur) - 92}px">${PILGRIMS}</div>
      </div></div><i class="roller r"></i></div>
    <p class="maptip">${tr("Листайте свиток. Красные печати — открытые испытания, бледные — путь, который ещё предстоит.", "Scroll along. Red seals are open trials; pale ones are the road still ahead.", "စာလိပ်ကို ဘေးဘက် ဆွဲကြည့်ပါ။ အနီရောင် တံဆိပ်တွေက ဖွင့်ထားတဲ့ စမ်းသပ်ချက်တွေ၊ မှိန်နေတာတွေက ရှေ့ဆက်ရမယ့် လမ်း။")}</p></main>`;
  bindTop(map);
  const sc = $("#scroll"); sc.scrollLeft = Math.max(0, X(cur) - sc.clientWidth / 2);
  sc.addEventListener("wheel", e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { sc.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  document.querySelectorAll(".node.open").forEach(b => b.onclick = () => { initSound(); sfx("pluck"); if (LINK) LINK.choose(+b.dataset.t); else trial(TRIALS[+b.dataset.t]); });
  $("#leave")?.addEventListener("click", leave);
}
function coopBanner() {
  if (!LINK) return "";
  const partner = LINK.host ? !!LINK.S.guest : true;
  return `<div class="coopbar"><span class="chip p${LINK.me}"><i></i>${tr("Вы", "You", "ကိုယ်")}: ${esc(T(PAIR[LINK.me]))}</span>
    <span class="chip p${1 - LINK.me} ${partner ? "" : "off"}"><i></i>${partner ? `${tr("Спутник", "Partner", "အဖော်")}: ${esc(T(PAIR[1 - LINK.me]))}` : tr("Спутник ещё не вошёл", "Your partner hasn't joined yet", "အဖော် မဝင်သေးဘူး")}</span>
    <span class="dim">${tr("Комната", "Room", "အခန်း")} <b>${LINK.code}</b>. ${tr("Испытание выбирает любой из вас.", "Either of you can choose the trial.", "စမ်းသပ်ချက်ကို ဘယ်သူမဆို ရွေးနိုင်တယ်။")}</span>
    <button class="link" id="leave">${tr("Выйти из комнаты", "Leave the room", "အခန်းက ထွက်မယ်")}</button></div>`;
}

// ── dialogue: lines of [speaker, {ru, en}]
function dialogue(lines, done) {
  let i = 0;
  document.querySelectorAll(".dlg").forEach(d => d.remove());
  const box = document.createElement("div"); box.className = "dlg"; document.body.append(box);
  const show = () => {
    if (i >= lines.length) { box.remove(); return done(); }
    const [who, text] = lines[i];
    box.innerHTML = `<div class="dlgin"><div class="dlgface">${bust(who)}</div><div class="dlgtext"><b>${esc(T(NAMES[who]))} <span class="zh">${NAMES[who].zh}</span></b><p>${esc(T(text))}</p><button class="btn">${i < lines.length - 1 ? tr("Дальше", "Next", "ဆက်ရန်") : tr("Продолжить", "Continue", "ဆက်လုပ်မယ်")} →</button></div></div>`;
    box.querySelector(".dlgface").classList.add("talk"); setTimeout(() => box.querySelector(".dlgface")?.classList.remove("talk"), 1400);
    sfx("pluck");
    box.querySelector(".btn").onclick = () => { i++; show(); };
  };
  show();
}

// ── a trial. In a game for two it opens on both screens with the same seed, and the shared log drives the puzzle.
function trial(t, { seed = Math.random() * 2 ** 31 | 0, run = 0, skipIntro = false, log = [] } = {}) {
  document.documentElement.lang = G.lang; SCREEN = "trial";
  document.querySelectorAll(".dlg").forEach(d => d.remove());
  const cur = CUR = { t, run, seed, log, skipIntro, applied: 0, handler: null, replaying: false };
  let hints = 0, mistakes = 0, finished = false;
  const idx = TRIALS.indexOf(t), here = () => CUR === cur;
  $("#app").innerHTML = `<div class="trialpage">${scene(t.scene)}
    ${top(`<button class="ib back" data-back>← ${tr("Свиток", "Scroll", "စာလိပ်")}</button>`)}
    <main class="tmain"><div class="thead"><span class="tno">${ZH(idx + 1)}</span><h2>${esc(T(t.name))}</h2><span class="tzh">${t.zh}</span></div>
      <div class="rules paper"><p>${esc(T(t.rules))}</p>${LINK ? `<p class="cooprule p${LINK.me}">👥 ${esc(T(t.coop))} ${tr(`Ваш цвет — ${LINK.me ? "синий" : "золотой"}.`, `Your colour is ${LINK.me ? "blue" : "gold"}.`, `ကိုယ့်အရောင်က ${LINK.me ? "အပြာ" : "ရွှေ"}။`)}</p>` : ""}<div class="trow"><button class="btn" id="hint">💡 ${tr("Подсказка", "Hint", "အရိပ်အမြွက်")} (${t.hints.length})</button><span id="status" class="status"></span><span id="mist" class="mist"></span></div><div id="hintbox"></div></div>
      <section class="board paper" id="board"></section></main></div>`;
  // a new language redraws the trial from the same seed and replays the moves made so far
  bindTop(() => { const r = document.querySelector(".dlg.result"); trial(t, { seed, run, skipIntro: cur.mounted && !r, log: cur.log }); });
  document.querySelector("[data-back]").onclick = () => { if (LINK) { map(); LINK.choose(-1); } else map(); };
  const api = {
    tr, coop: !!LINK, me: LINK ? LINK.me : 0, rnd: mulberry(seed),
    sfx: k => { if (here() && !cur.replaying) sfx(k); },
    act: a => { if (!here()) return; if (LINK) LINK.act(a); else { cur.log.push({ ...a, w: 0 }); feed(); } },
    on: fn => { cur.handler = fn; },
    mine: w => !LINK || w === LINK.me,
    nope: () => { sfx("fail"); toast(tr(`Это делает ${who(1 - LINK.me)}`, `That's for ${who(1 - LINK.me)}`, `ဒါကို ${who(1 - LINK.me)} လုပ်ရမယ်`)); },
    who,
    status: h => { const s = $("#status"); if (s && here()) s.innerHTML = h; },
    mistake: () => { mistakes++; const m = $("#mist"); if (m && here()) m.innerHTML = "✗".repeat(mistakes); },
    done: stats => {
      if (finished || !here()) return; finished = true;
      const seals = 1 + (stats.good ? 1 : 0) + (hints === 0 ? 1 : 0);
      sfx("win");
      setTimeout(() => here() && dialogue(t.outro, () => here() && result(t, seals, stats, hints)), 500);
    },
  };
  $("#hint").onclick = () => {
    if (hints >= t.hints.length) return;
    $("#hintbox").insertAdjacentHTML("beforeend", `<p class="hint">💡 ${esc(T(t.hints[hints]))}</p>`); hints++;
    $("#hint").textContent = `💡 ${tr("Подсказка", "Hint", "အရိပ်အမြွက်")} (${t.hints.length - hints})`; if (hints >= t.hints.length) $("#hint").disabled = true; sfx("bell");
  };
  const start = () => { if (!here()) return; sfx("gong"); t.mount($("#board"), api); cur.mounted = true; feed(true); };
  if (cur.skipIntro) start(); else dialogue(t.intro, start);
  return cur;
}
// applies the actions of the shared log that this screen hasn't applied yet
function feed(replay = false) {
  const cur = CUR; if (!cur || !cur.mounted || !cur.handler) return;
  const log = LINK ? LINK.S.log || [] : cur.log;
  while (cur.applied < log.length && CUR === cur) { const a = log[cur.applied++]; cur.replaying = replay; try { cur.handler(a, a.w); } catch (e) { console.error(e); } finally { cur.replaying = false; } }
}

function result(t, seals, stats, hints) {
  G.done[t.id] = Math.max(G.done[t.id] || 0, seals); save();
  const box = document.createElement("div"); box.className = "dlg result"; document.body.append(box);
  const lines = [[true, "过", tr("Испытание пройдено", "Trial passed", "စမ်းသပ်ချက် အောင်မြင်")], [stats.good, "巧", tr("Ловко: без ошибок и лишних ходов", "Deft: no mistakes or wasted moves", "ကျွမ်းကျင်: အမှားမရှိ၊ အပို မလှုပ်")], [hints === 0, "明", tr("Ясный ум: без подсказок", "Clear mind: no hints", "ကြည်လင်တဲ့စိတ်: အရိပ်အမြွက် မသုံး")]];
  box.innerHTML = `<div class="resin paper"><p class="kick">${tr("Испытание", "Trial", "စမ်းသပ်ချက်")} ${ZH(TRIALS.indexOf(t) + 1)}</p><h2>${esc(T(t.name))}</h2>
    <div class="seals3">${lines.map(([ok, ch, txt], k) => `<div class="s3 ${ok ? "ok" : ""}" style="--d:${k * 350}ms">${seal(ch, { size: 74, dim: !ok })}<span>${txt}</span></div>`).join("")}</div>
    ${stats.moves !== undefined ? `<p class="dim">${tr("Ходов", "Moves", "လှုပ်ရှားမှု")}: ${stats.moves}${stats.par ? ` · ${tr("минимум около", "minimum about", "အနည်းဆုံး ခန့်")} ${stats.par}` : ""}</p>` : ""}
    <div class="row"><button class="btn" id="again">↻ ${tr("Ещё раз", "Again", "ထပ်ကစားမယ်")}</button><button class="btn red" id="tomap">${tr("На свиток", "To the scroll", "စာလိပ်ဆီ")} →</button></div></div>`;
  lines.forEach((l, k) => l[0] && setTimeout(() => sfx("wood"), 300 + k * 350));
  box.querySelector("#again").onclick = () => { box.remove(); if (LINK) LINK.choose(TRIALS.indexOf(t)); else trial(t); };
  box.querySelector("#tomap").onclick = () => { box.remove(); map(); if (LINK) LINK.choose(-1); };
}

// ── for two: open or join a room
const ROOM_KEY = "xyj-room";
async function coopMenu(code = "", error = "") {
  document.documentElement.lang = G.lang; SCREEN = "menu";
  $("#app").innerHTML = `<div class="titlepage">${scene("river")}<div class="tcenter"><div class="tbox coopbox">
    <h1>${tr("Вдвоём", "For two", "နှစ်ယောက်")}</h1>
    <p>${tr("Каждый играет на своём телефоне и на своём языке. Головоломки общие, но у каждого своя роль: кто-то видит то, чего не видит другой, или управляет только своими фигурами. Придётся разговаривать.", "Each of you plays on your own phone, in your own language. The puzzles are shared, but each of you has a role: one sees what the other can't, or moves only their own pieces. You'll have to talk.", "တစ်ယောက်ချင်းစီ ကိုယ့်ဖုန်းနဲ့ ကိုယ့်ဘာသာစကားနဲ့ ကစားတယ်။ ပဟေဠိတွေက အတူတူပဲ၊ ဒါပေမယ့် တစ်ယောက်စီမှာ ကိုယ့်အခန်းကဏ္ဍ ရှိတယ်: တစ်ယောက် မြင်တာကို နောက်တစ်ယောက် မမြင်ရဘူး၊ ဒါမှမဟုတ် ကိုယ့်အရုပ်တွေကိုပဲ ရွှေ့နိုင်တယ်။ စကားပြောရလိမ့်မယ်။")}</p>
    <div class="roles"><div class="role p0">${bust("wukong")}<b>${esc(T(PAIR[0]))}</b><span>${tr("тот, кто открыл комнату", "whoever opens the room", "အခန်းဖွင့်သူ")}</span></div><div class="role p1">${bust("bajie")}<b>${esc(T(PAIR[1]))}</b><span>${tr("тот, кто вошёл по коду", "whoever joins with the code", "ကုဒ်နဲ့ ဝင်သူ")}</span></div></div>
    <div class="coopact"><button class="btn red" id="mk">${tr("Открыть комнату", "Open a room", "အခန်းဖွင့်မယ်")}</button>
      <form id="jf"><input id="code" maxlength="5" autocomplete="off" autocapitalize="characters" placeholder="ABCDE" value="${esc(code)}" aria-label="${tr("Код комнаты", "Room code", "အခန်းကုဒ်")}"><button class="btn primary">${tr("Войти", "Join", "ဝင်မယ်")}</button></form></div>
    ${error ? `<p class="note bad">${esc(error)}</p>` : ""}
    <p class="tfoot"><button class="link" id="back">← ${tr("Назад", "Back", "နောက်သို့")}</button></p></div></div></div>`;
  $("#back").onclick = title;
  $("#code").oninput = e => e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const busy = on => document.querySelectorAll(".coopact button").forEach(b => b.disabled = on);
  const fail = e => { const m = String(e?.message || e); busy(false); coopMenu($("#code")?.value || code, m === "noroom" ? tr("Комнаты с таким кодом нет.", "There's no room with that code.", "ဒီကုဒ်နဲ့ အခန်း မရှိဘူး။") : m === "full" ? tr("В этой комнате уже двое.", "This room already has two players.", "ဒီအခန်းမှာ နှစ်ယောက် ရှိပြီးပြီ။") : tr("Не удалось подключиться. Проверьте интернет.", "Couldn't connect. Check your internet connection.", "ချိတ်ဆက်လို့ မရဘူး။ အင်တာနက် စစ်ကြည့်ပါ။")); };
  $("#mk").onclick = async () => { busy(true); if (!await available()) return fail("net"); try { attach(await createRoom()); } catch (e) { fail(e); } };
  $("#jf").onsubmit = async e => { e.preventDefault(); const c = cleanCode($("#code").value); if (!c) return; busy(true); try { attach(await joinRoom(c)); } catch (er) { fail(er); } };
  if (cleanCode(code) && !error) $("#jf").requestSubmit();
}
function attach(link) {
  LINK?.close(); LINK = link; leftRun = -1;
  try { sessionStorage.setItem(ROOM_KEY, link.code); } catch { }
  if (location.hash) history.replaceState(null, "", location.pathname);
  link.on(onState); onState(link.S);
}
function leave() { LINK?.close(); LINK = null; CUR = null; try { sessionStorage.removeItem(ROOM_KEY); } catch { } title(); }
function lobby() {
  SCREEN = "lobby"; document.documentElement.lang = G.lang;
  const url = location.origin + location.pathname + "#" + LINK.code;
  $("#app").innerHTML = `<div class="titlepage">${scene("river")}<div class="tcenter"><div class="tbox coopbox">
    <h1>${tr("Комната открыта", "The room is open", "အခန်း ဖွင့်ပြီ")}</h1>
    <p>${tr("Пусть спутник откроет «81 испытание» на своём телефоне, нажмёт «Вдвоём» и введёт код. Или отсканирует QR-код.", "Ask your partner to open 81 Trials on their phone, tap For two and enter the code. Or scan the QR code.", "အဖော်ကို သူ့ဖုန်းမှာ «ဒုက္ခ ၈၁ ပါး» ဖွင့်ပြီး «နှစ်ယောက်» ကို နှိပ်ကာ ကုဒ်ရိုက်ထည့်ခိုင်းပါ။ ဒါမှမဟုတ် QR ကုဒ်ကို စကန်ဖတ်ပါ။")}</p>
    <div class="bigcode">${[...LINK.code].map(c => `<i>${c}</i>`).join("")}</div><div class="qr" id="qr"></div>
    <div class="row"><button class="btn" id="copy">🔗 ${tr("Скопировать ссылку", "Copy the link", "လင့်ခ် ကူးမယ်")}</button></div>
    <p class="waiting"><span class="dots"><i></i><i></i><i></i></span> ${tr("Ждём спутника…", "Waiting for your partner…", "အဖော်ကို စောင့်နေတယ်…")}</p>
    <p class="tfoot"><button class="link" id="leave">← ${tr("Закрыть комнату", "Close the room", "အခန်း ပိတ်မယ်")}</button></p></div></div></div>`;
  $("#leave").onclick = leave;
  $("#copy").onclick = async () => { try { await navigator.clipboard.writeText(url); toast(tr("Ссылка скопирована", "Link copied", "လင့်ခ် ကူးပြီးပြီ")); } catch { prompt("", url); } };
  const qr = () => { if (!window.qrcode || !$("#qr")) return; const q = window.qrcode(0, "M"); q.addData(url); q.make(); $("#qr").innerHTML = q.createSvgTag({ cellSize: 5, margin: 2, scalable: true }); };
  if (window.qrcode) qr(); else { const sc = document.createElement("script"); sc.src = "../party/vendor/qrcode.js"; sc.onload = qr; document.head.append(sc); }
}
// every change of the shared room comes through here
function onState(S) {
  if (!LINK) return;
  if (LINK.host && !S.guest) { if (SCREEN !== "lobby") lobby(); return; }
  if (S.trial >= 0 && S.run !== leftRun) {
    if (!CUR || CUR.run !== S.run) { initSound(); return trial(TRIALS[S.trial], { seed: S.seed, run: S.run }); }
    return feed();
  }
  if (S.trial < 0) leftRun = -1;
  if (SCREEN === "trial") { if (S.trial < 0 && !document.querySelector(".dlg.result")) map(); return; }
  if (SCREEN !== "map" || $(".coopbar .off") && S.guest) map();
}

window.__xyj = { G, TRIALS, trial: i => trial(TRIALS[i]), get link() { return LINK; } }; // for the console and tests
{
  const fromHash = cleanCode(location.hash.slice(1));
  let saved = null; try { saved = sessionStorage.getItem(ROOM_KEY); } catch { }
  if (fromHash) coopMenu(fromHash);
  else if (saved) { joinRoom(saved).then(attach).catch(() => { try { sessionStorage.removeItem(ROOM_KEY); } catch { } title(); }); title(); }
  else title();
}
