// 81 Trials: the shell. Title, the journey scroll, dialogue, rules, hints and the seals you earn.
import { bust, NAMES, seal, scene, PILGRIMS } from "./art.js";
import { TRIALS } from "./trials.js";
import { initSound, sfx, music, stopMusic, soundOn, setSound } from "./sound.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SAVE = "xyj81-v1";
let G = (() => { try { return JSON.parse(localStorage.getItem(SAVE)) || null; } catch { return null; } })() || { lang: (navigator.language || "").startsWith("ru") ? "ru" : "en", done: {} };
const save = () => { try { localStorage.setItem(SAVE, JSON.stringify(G)); } catch { } };
const tr = (ru, en) => G.lang === "ru" ? ru : en;
const T = o => o[G.lang] || o.en;
const ZH = n => { const d = "〇一二三四五六七八九"; if (n <= 10) return n === 10 ? "十" : d[n]; if (n < 20) return "十" + d[n - 10]; return d[Math.floor(n / 10)] + "十" + (n % 10 ? d[n % 10] : ""); };
const total = () => Object.values(G.done).reduce((s, v) => s + v, 0);

function top(extra = "") {
  return `<header class="top"><a class="brand" href="#" data-nav="map"><span class="zh">西游记</span><span>${tr("81 испытание", "81 Trials")}</span></a>
    ${extra}<span class="score" title="${tr("Печати", "Seals")}">${seal("印", { size: 26 })}<b>${total()}</b></span>
    <button class="ib" data-snd title="${tr("Звук", "Sound")}">${soundOn() ? "🔔" : "🔕"}</button><button class="ib" data-lang>${G.lang === "ru" ? "EN" : "RU"}</button></header>`;
}
function bindTop(rerender) {
  document.querySelectorAll("[data-nav=map]").forEach(a => a.onclick = e => { e.preventDefault(); map(); });
  document.querySelector("[data-snd]")?.addEventListener("click", () => { initSound(); setSound(!soundOn()); if (soundOn()) music(); rerender(); });
  document.querySelector("[data-lang]")?.addEventListener("click", () => { G.lang = G.lang === "ru" ? "en" : "ru"; save(); rerender(); });
}

// ── title
function title() {
  document.documentElement.lang = G.lang;
  $("#app").innerHTML = `<div class="titlepage">${scene("mountain")}
    <div class="clouds"><i></i><i></i><i></i></div>
    <div class="tcenter">
      <div class="vert">西游记</div>
      <div class="tbox"><h1>${tr("81 испытание", "81 Trials")}</h1>
        <p>${tr("Танский монах и трое его учеников идут на Запад за священными свитками. Девяносто девять раз по девять бед ждут их в пути. Каждую беду можно одолеть не силой, а умом.", "The Tang monk and his three disciples travel west for the sacred scriptures. Nine times nine calamities await them on the road. Each one can be overcome not by strength, but by wit.")}</p>
        <button class="btn red" id="go">${tr("В путь", "Set out")} →</button>
        <p class="tfoot"><a href="../">← PuzzleGekko</a> · <button class="link" data-lang>${G.lang === "ru" ? "English" : "Русский"}</button></p></div>
      <div class="sealrow">${seal("取经")}${seal("西")}</div>
    </div>
    <div class="walkers">${PILGRIMS}</div></div>`;
  $("#go").onclick = () => { initSound(); music(); map(); };
  document.querySelector("[data-lang]").onclick = () => { G.lang = G.lang === "ru" ? "en" : "ru"; save(); title(); };
}

// ── the journey scroll
function map() {
  document.documentElement.lang = G.lang;
  const next = TRIALS.findIndex(t => !G.done[t.id]);
  const cur = next < 0 ? TRIALS.length - 1 : next;
  const X = i => 160 + i * 150, Y = i => 230 + Math.sin(i * .9) * 90 + (i % 3) * 8;
  const path = Array.from({ length: 81 }, (_, i) => `${i ? "L" : "M"}${X(i)} ${Y(i)}`).join(" ");
  const width = X(80) + 200;
  $("#app").innerHTML = `${top()}<main class="mappage">
    <div class="maphead"><h2>${tr("Путь на Запад", "The Road West")}</h2><p>${tr(`Пройдено испытаний: ${Object.keys(G.done).length} из 81. Открыто: ${TRIALS.length}.`, `Trials passed: ${Object.keys(G.done).length} of 81. Open: ${TRIALS.length}.`)}</p></div>
    <div class="scrollwrap"><i class="roller l"></i><div class="scroll" id="scroll"><div class="strip" style="width:${width}px"><div class="stripbg">${["mountain", "temple", "bones", "river", "fire", "cave", "mountain", "river"].map(n => scene(n, { paper: false })).join("")}</div>
      <svg class="road" viewBox="0 0 ${width} 460" width="${width}" height="460" aria-hidden="true"><path d="${path}" fill="none" stroke="#8a6a3a" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/></svg>
      ${Array.from({ length: 81 }, (_, i) => { const t = TRIALS[i], open = !!t, done = t && G.done[t.id];
        return `<button class="node ${open ? "open" : "locked"} ${done ? "done" : ""} ${i === cur ? "cur" : ""}" style="left:${X(i)}px;top:${Y(i)}px" ${open ? `data-t="${i}"` : "disabled"} aria-label="${open ? esc(T(t.name)) : tr("Скоро", "Soon")}">
          ${seal(open ? t.zh.slice(0, 2) : ZH(i + 1), { size: open ? 70 : 46, dim: !open })}
          ${open ? `<span class="nlabel"><b>${ZH(i + 1)} · ${esc(T(t.name))}</b>${done ? `<span class="stars">${"●".repeat(done)}${"○".repeat(3 - done)}</span>` : ""}</span>` : ""}</button>`; }).join("")}
      <div class="here" style="left:${X(cur)}px;top:${Y(cur) - 92}px">${PILGRIMS}</div>
      </div></div><i class="roller r"></i></div>
    <p class="maptip">${tr("Листайте свиток. Красные печати — открытые испытания, бледные — путь, который ещё предстоит.", "Scroll along. Red seals are open trials; pale ones are the road still ahead.")}</p></main>`;
  bindTop(map);
  const sc = $("#scroll"); sc.scrollLeft = Math.max(0, X(cur) - sc.clientWidth / 2);
  sc.addEventListener("wheel", e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { sc.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  document.querySelectorAll(".node.open").forEach(b => b.onclick = () => { initSound(); sfx("pluck"); trial(TRIALS[+b.dataset.t]); });
}

// ── dialogue: lines of [speaker, {ru, en}]
function dialogue(lines, done) {
  let i = 0;
  document.querySelectorAll(".dlg").forEach(d => d.remove());
  const box = document.createElement("div"); box.className = "dlg"; document.body.append(box);
  const show = () => {
    if (i >= lines.length) { box.remove(); return done(); }
    const [who, text] = lines[i];
    box.innerHTML = `<div class="dlgin"><div class="dlgface">${bust(who)}</div><div class="dlgtext"><b>${esc(T(NAMES[who]))} <span class="zh">${NAMES[who].zh}</span></b><p>${esc(T(text))}</p><button class="btn">${i < lines.length - 1 ? tr("Дальше", "Next") : tr("Продолжить", "Continue")} →</button></div></div>`;
    box.querySelector(".dlgface").classList.add("talk"); setTimeout(() => box.querySelector(".dlgface")?.classList.remove("talk"), 1400);
    sfx("pluck");
    box.querySelector(".btn").onclick = () => { i++; show(); };
  };
  show();
}

// ── a trial
function trial(t) {
  document.documentElement.lang = G.lang;
  let hints = 0, mistakes = 0, finished = false;
  const idx = TRIALS.indexOf(t);
  $("#app").innerHTML = `<div class="trialpage">${scene(t.scene)}
    ${top(`<button class="ib back" data-nav="map">← ${tr("Свиток", "Scroll")}</button>`)}
    <main class="tmain"><div class="thead"><span class="tno">${ZH(idx + 1)}</span><h2>${esc(T(t.name))}</h2><span class="tzh">${t.zh}</span></div>
      <div class="rules paper"><p>${esc(T(t.rules))}</p><div class="trow"><button class="btn" id="hint">💡 ${tr("Подсказка", "Hint")} (${t.hints.length})</button><span id="status" class="status"></span><span id="mist" class="mist"></span></div><div id="hintbox"></div></div>
      <section class="board paper" id="board"></section></main></div>`;
  bindTop(() => trial(t));
  const api = {
    tr, sfx,
    status: h => { const s = $("#status"); if (s) s.innerHTML = h; },
    mistake: () => { mistakes++; const m = $("#mist"); if (m) m.innerHTML = "✗".repeat(mistakes); },
    done: stats => {
      if (finished) return; finished = true;
      const seals = 1 + (stats.good ? 1 : 0) + (hints === 0 ? 1 : 0);
      sfx("win");
      setTimeout(() => dialogue(t.outro, () => result(t, seals, stats, hints)), 500);
    },
  };
  $("#hint").onclick = () => {
    if (hints >= t.hints.length) return;
    $("#hintbox").insertAdjacentHTML("beforeend", `<p class="hint">💡 ${esc(T(t.hints[hints]))}</p>`); hints++;
    $("#hint").textContent = `💡 ${tr("Подсказка", "Hint")} (${t.hints.length - hints})`; if (hints >= t.hints.length) $("#hint").disabled = true; sfx("bell");
  };
  dialogue(t.intro, () => { sfx("gong"); t.mount($("#board"), api); });
}

function result(t, seals, stats, hints) {
  G.done[t.id] = Math.max(G.done[t.id] || 0, seals); save();
  const box = document.createElement("div"); box.className = "dlg result"; document.body.append(box);
  const lines = [[true, "过", tr("Испытание пройдено", "Trial passed")], [stats.good, "巧", tr("Ловко: без ошибок и лишних ходов", "Deft: no mistakes or wasted moves")], [hints === 0, "明", tr("Ясный ум: без подсказок", "Clear mind: no hints")]];
  box.innerHTML = `<div class="resin paper"><p class="kick">${tr("Испытание", "Trial")} ${ZH(TRIALS.indexOf(t) + 1)}</p><h2>${esc(T(t.name))}</h2>
    <div class="seals3">${lines.map(([ok, ch, txt], k) => `<div class="s3 ${ok ? "ok" : ""}" style="--d:${k * 350}ms">${seal(ch, { size: 74, dim: !ok })}<span>${txt}</span></div>`).join("")}</div>
    ${stats.moves !== undefined ? `<p class="dim">${tr("Ходов", "Moves")}: ${stats.moves}${stats.par ? ` · ${tr("минимум около", "minimum about")} ${stats.par}` : ""}</p>` : ""}
    <div class="row"><button class="btn" id="again">↻ ${tr("Ещё раз", "Again")}</button><button class="btn red" id="tomap">${tr("На свиток", "To the scroll")} →</button></div></div>`;
  lines.forEach((l, k) => l[0] && setTimeout(() => sfx("wood"), 300 + k * 350));
  box.querySelector("#again").onclick = () => { box.remove(); trial(t); };
  box.querySelector("#tomap").onclick = () => { box.remove(); map(); };
}

window.__xyj = { G, TRIALS, trial: i => trial(TRIALS[i]) }; // for the console and tests
title();
