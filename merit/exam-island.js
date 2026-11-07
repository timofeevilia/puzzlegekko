// Exam 1: The Island. Seven days on an island with 300 exam points (EP). Whatever is left becomes class points.
// Each class secretly names a leader who scans the island's spots for extra points. On the last day every class
// may name the other classes' leaders: a right guess takes 50 EP from them, a wrong one costs the guesser 50.
import { G, tr, nm, face, me, classmates, classOf, byId, rnd, pick, shuffle, clamp, line, brief, toast, CLASSES, esc, addTrust, $ } from "./game.js";

const SPOTS = ["cave", "river", "tower"];
const SPOT_NAME = { cave: { ru: "Пещера", en: "Cave" }, river: { ru: "Река", en: "River" }, tower: { ru: "Маяк", en: "Lighthouse" } };
const sn = s => tr(SPOT_NAME[s].ru, SPOT_NAME[s].en);
const RIVAL_STYLE = { A: { spend: 22, scans: 1, guessAt: .5 }, B: { spend: 20, scans: 1, guessAt: .65 }, C: { spend: 40, scans: 2, guessAt: .3 } };

let I, ctx;
export function run(c) {
  ctx = c;
  const rivals = {};
  for (const cls of ["A", "B", "C"]) { const cands = classOf(cls).map(p => p.id); rivals[cls] = { ep: 300, leader: pick(cands), cands, exposure: 0, know: null, marks: {} }; }
  I = { day: 1, ep: 300, morale: 60, tents: false, toilet: false, leader: "", swapped: "", exposure: 0, oldExposure: 0, spots: { cave: "", river: "", tower: "" },
    rivals, log: [], gone: [], spy: "", fed: "", cluesToday: [], theftDone: false, spyDone: false, stormDone: false, usedIntel: false };
  if (G.items.intel) { I.usedIntel = true; for (const cls of ["A", "B", "C"]) clue(cls, 10, true); }
  brief(ctx, { icon: "🏝️", name: tr("Необитаемый остров", "The Island"), rules: [
    tr("Класс получает <b>300 очков экзамена</b> (ОЭ) на 7 дней. Всё, что останется, станет очками класса.", "The class gets <b>300 exam points</b> (EP) for 7 days. Whatever is left becomes class points."),
    tr("Еду, палатки и туалет можно купить за ОЭ — или добывать и терпеть. Низкий боевой дух заставит кого-то сойти с дистанции (−30 ОЭ).", "Food, tents and a toilet cost EP; or you can forage and endure. Low morale makes someone drop out (−30 EP)."),
    tr("В первый день вы тайно выбираете <b>лидера</b>. Только он может занимать точки на острове: +10 ОЭ за точку в день. Но каждая вылазка показывает лидера другим классам.", "On day one you secretly pick a <b>leader</b>. Only the leader can claim the island's spots: +10 EP per spot per day. But every claim shows the leader to the other classes."),
    tr("Отправляйте разведчиков к другим классам, чтобы вычислить их лидеров. На 7-й день можно назвать лидера каждого класса: верно — +50 вам и −50 им, ошибка — −50 вам.", "Send scouts to the other classes to work out their leaders. On day 7 you may name each class's leader: right is +50 for you and −50 for them; wrong costs you 50."),
    tr("Если лидер «заболеет» и покинет остров, можно назначить нового. Это стоит 30 ОЭ… и это единственная лазейка в правилах.", "If the leader 'falls ill' and leaves the island, you may appoint a new one. It costs 30 EP… and it is the only loophole in the rules."),
  ], extra: I.usedIntel ? `<p class="note">🕵️ ${tr("Ваш информатор уже принёс по одной надёжной улике на каждый класс.", "Your informant has already brought one reliable clue on each class.")}</p>` : "" }, day);
}

function team() { return [me(), ...classmates().filter(p => !I.gone.includes(p.id))]; }
const forageChance = scouts => { const ph = team().filter(p => !scouts.includes(p.id)).map(p => p.phy).sort((a, b) => b - a).slice(0, 3); return clamp(.2 + (ph.reduce((a, b) => a + b, 0) / 3) * .07, .2, .9); };
const leaderP = () => I.leader === "you" ? me() : byId(I.leader);

// a scouting report on a rival class's leader; strong scouts are right more often and know it
function clue(cls, skill, forceTrue = false) {
  const R = I.rivals[cls], open = R.cands.filter(id => id !== R.leader && !R.marks[id]);
  const ok = forceTrue || Math.random() < clamp(.3 + skill * .06, .3, .9);
  if (ok && open.length) { const id = pick(open); R.marks[id] = skill >= 6 || forceTrue ? "sure" : "maybe"; return { cls, id, sure: R.marks[id] === "sure", text: tr(`${nm(byId(id))} весь день не отходил(а) от лагеря — вряд ли это лидер.`, `${nm(byId(id))} never left camp today; unlikely to be the leader.`) }; }
  if (Math.random() < .5 && !R.marks[R.leader]) { R.marks[R.leader] = "maybe"; return { cls, id: R.leader, sure: false, text: tr(`Похоже, ${nm(byId(R.leader))} не лидер… но разведчик не уверен.`, `Looks like ${nm(byId(R.leader))} isn't the leader… but the scout isn't sure.`) }; }
  return { cls, id: "", sure: false, text: tr(`Класс ${cls} осторожен: разведчик ничего не узнал.`, `Class ${cls} is careful; the scout learned nothing.`) };
}

function bar() {
  return `<div class="exam-bar">
    <span>🏝️ ${tr("День", "Day")} <b>${I.day}/7</b></span>
    <span>💠 ${tr("ОЭ", "EP")} <b>${I.ep}</b></span>
    <span>🔥 ${tr("Дух", "Morale")} <b>${I.morale}</b><i class="meter"><i style="width:${I.morale}%"></i></i></span>
    <span>👁️ ${tr("Заметность лидера", "Leader exposure")} <b>${I.exposure}%</b><i class="meter warn"><i style="width:${Math.min(100, I.exposure)}%"></i></i></span>
  </div>`;
}
function map(sel = []) {
  const pos = { cave: [120, 90], river: [300, 190], tower: [440, 70] }, camps = { A: [90, 230], B: [230, 60], C: [470, 230], D: [330, 290] };
  return `<svg class="island" viewBox="0 0 560 340" aria-hidden="true">
    <defs><radialGradient id="sea" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#2f6f8f"/><stop offset="1" stop-color="#16324a"/></radialGradient></defs>
    <rect width="560" height="340" fill="url(#sea)"/>
    <path d="M60 170c-10-70 60-130 160-140 90-8 170 6 240 50 60 40 70 110 30 160-40 50-140 70-250 60C130 290 70 240 60 170z" fill="#d8c79a"/>
    <path d="M90 170c0-60 60-110 140-116 80-6 150 10 200 46 46 34 50 90 20 126-36 40-120 56-210 48-90-8-150-50-150-104z" fill="#5c8a4a"/>
    <path d="M150 120c30-20 60-10 90 6M330 110c40-10 70 10 90 30" stroke="#3f6a33" stroke-width="10" stroke-linecap="round" opacity=".6"/>
    <path d="M300 190c-40 20-90 40-150 50M300 190c20 30 40 60 50 100" stroke="#6ab0d0" stroke-width="7" fill="none" stroke-linecap="round"/>
    ${SPOTS.map(s => { const [x, y] = pos[s], o = I.spots[s], col = o ? CLASSES[o].color : "#f4f1ea";
      return `<g class="spot ${sel.includes(s) ? "sel" : ""}"><circle cx="${x}" cy="${y}" r="20" fill="${col}" stroke="#14182a" stroke-width="3"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="18">${s === "cave" ? "🪨" : s === "river" ? "💧" : "🗼"}</text><text x="${x}" y="${y + 38}" text-anchor="middle" class="lbl">${sn(s)}${o ? " · " + o : ""}</text></g>`; }).join("")}
    ${Object.entries(camps).map(([c, [x, y]]) => `<g><path d="M${x - 14} ${y + 10}l14-22 14 22z" fill="${CLASSES[c].color}" stroke="#14182a" stroke-width="2.5"/><text x="${x}" y="${y + 28}" text-anchor="middle" class="lbl">${c}</text></g>`).join("")}
  </svg>`;
}
function board() {
  return `<div class="clueboard">${["A", "B", "C"].map(cls => { const R = I.rivals[cls];
    return `<div class="cb"><b style="color:${CLASSES[cls].color}">${tr("Класс", "Class")} ${cls}</b><div class="cands">${R.cands.map(id => `<div class="cand ${R.marks[id] || ""}" title="${R.marks[id] === "sure" ? tr("точно не лидер", "surely not the leader") : R.marks[id] === "maybe" ? tr("возможно, не лидер", "maybe not the leader") : ""}">${face(byId(id), { size: "xs" })}<small>${nm(byId(id))}</small></div>`).join("")}</div></div>`; }).join("")}</div>`;
}

// ── a day
function day() {
  ctx.setRerender(day);
  const mates = team().filter(p => p.id !== "you");
  const scouts = {};
  const sel = [];
  let food = "buy", buyTents = false, buyToilet = false, leader = I.leader || "";
  const draw = () => {
    const sc = Object.values(scouts).filter(Boolean);
    const scanCost = sel.length;
    ctx.frame(`${bar()}<section class="island-grid">
      <div class="paper">${map(sel)}${board()}</div>
      <div class="paper orders">
        <h3>${tr("Приказы на день", "Orders for the day")} ${I.day}</h3>
        ${I.day === 1 ? `
          <label class="field">${tr("Тайный лидер класса", "The class's secret leader")}
            <select id="leader"><option value="">—</option><option value="you" ${leader === "you" ? "selected" : ""}>${esc(G.name)} (${tr("вы", "you")})</option>${mates.map(p => `<option value="${p.id}" ${leader === p.id ? "selected" : ""}>${nm(p)} · 🧠${p.int}</option>`).join("")}</select></label>
          <p class="dim small">${tr("Умный лидер меньше светится на точках.", "A clever leader is less conspicuous at the spots.")}</p>
          <div class="chk"><label><input type="checkbox" id="tents" ${buyTents ? "checked" : ""}> ⛺ ${tr("Палатки", "Tents")} (−40)</label><label><input type="checkbox" id="toilet" ${buyToilet ? "checked" : ""}> 🚻 ${tr("Туалет", "Toilet")} (−20)</label></div>` : ""}
        <div class="opt-group"><b>🍚 ${tr("Еда", "Food")}</b>
          <label><input type="radio" name="food" value="buy" ${food === "buy" ? "checked" : ""}> ${tr("Купить пайки", "Buy rations")} (−20)</label>
          <label><input type="radio" name="food" value="forage" ${food === "forage" ? "checked" : ""}> ${tr("Добывать самим", "Forage")} (${Math.round(forageChance(sc) * 100)}% ${tr("успеха", "success")})</label></div>
        <div class="opt-group"><b>📍 ${tr("Лидер занимает точки", "Leader claims spots")}</b>
          ${SPOTS.map(s => `<label><input type="checkbox" data-spot="${s}" ${sel.includes(s) ? "checked" : ""}> ${sn(s)} (+10${I.spots[s] && I.spots[s] !== "D" ? ", " + tr("сейчас у", "held by") + " " + I.spots[s] : ""})</label>`).join("")}
          <p class="dim small">${tr("Каждая точка добавит заметности лидеру.", "Each spot makes the leader more visible.")}</p></div>
        <div class="opt-group"><b>🔭 ${tr("Разведка", "Scouting")}</b>
          ${["A", "B", "C"].map(cls => `<label class="row">${tr("К классу", "To Class")} ${cls}: <select data-scout="${cls}"><option value="">—</option>${team().map(p => `<option value="${p.id}" ${scouts[cls] === p.id ? "selected" : ""}>${p.id === "you" ? esc(G.name) : nm(p)} · 🧠${p.int} 💬${p.soc}</option>`).join("")}</select></label>`).join("")}
          <p class="dim small">${tr("Разведчики не добывают еду. Сильные разведчики приносят надёжные улики.", "Scouts don't forage. Strong scouts bring reliable clues.")}</p></div>
        ${I.day >= 3 && !I.swapped && I.leader && I.leader !== "you" ? `<div class="opt-group danger"><b>🤒 ${tr("Лазейка", "Loophole")}</b><label class="row">${tr("Лидер «заболевает», новый лидер:", "The leader 'falls ill'; new leader:")} <select id="swap"><option value="">—</option>${mates.filter(p => p.id !== I.leader).map(p => `<option value="${p.id}">${nm(p)}</option>`).join("")}<option value="you">${esc(G.name)}</option></select></label><p class="dim small">−30 ${tr("ОЭ. Всё, что о старом лидере узнали другие, станет ложным следом.", "EP. Whatever the others learned about the old leader becomes a false trail.")}</p></div>` : ""}
        <button class="btn primary" id="end" ${I.day === 1 && !leader ? "disabled" : ""}>${tr("Завершить день", "End the day")} →</button>
        <div class="log">${I.log.slice(-6).reverse().map(l => `<p>${l}</p>`).join("")}</div>
      </div></section>`);
    const o = $(".orders");
    o.onchange = e => {
      const t = e.target;
      if (t.id === "leader") leader = t.value;
      if (t.id === "tents") buyTents = t.checked;
      if (t.id === "toilet") buyToilet = t.checked;
      if (t.name === "food") food = t.value;
      if (t.dataset.spot) { const s = t.dataset.spot; t.checked ? sel.push(s) : sel.splice(sel.indexOf(s), 1); }
      if (t.dataset.scout) { const v = t.value; for (const k in scouts) if (scouts[k] === v) scouts[k] = ""; scouts[t.dataset.scout] = v; }
      draw();
    };
    $("#end").onclick = () => {
      const sw = $("#swap")?.value;
      endDay({ leader, buyTents, buyToilet, food, spots: sel.slice(), scouts: { ...scouts }, swap: sw || "" });
    };
  };
  draw();
}

function endDay(o) {
  const msgs = [];
  if (I.day === 1) {
    I.leader = o.leader; I.tents = o.buyTents; I.toilet = o.buyToilet;
    if (o.buyTents) I.ep -= 40; if (o.buyToilet) I.ep -= 20;
    if (!o.buyToilet) msgs.push(tr("Без туалета половина класса ворчит.", "Without a toilet, half the class grumbles."));
  }
  if (o.swap) {
    I.oldExposure = I.exposure; I.swapped = I.leader; I.leader = o.swap; I.exposure = 0; I.ep -= 30;
    msgs.push(tr(`${nm(byId(I.swapped))} «заболел(а)» и уехал(а) на катере. Новый лидер назначен тайно.`, `${nm(byId(I.swapped))} 'fell ill' and left on the boat. A new leader was appointed in secret.`));
  }
  // food
  const scouts = Object.values(o.scouts).filter(Boolean);
  if (o.food === "buy") { I.ep -= 20; I.morale += 2; }
  else if (Math.random() < forageChance(scouts)) { I.morale += 4; msgs.push(tr("Удачная рыбалка! Класс сыт и доволен.", "Good fishing! The class is fed and happy.")); }
  else { I.morale -= 14; msgs.push(tr("Добыть еду не удалось. Все легли голодными.", "Foraging failed. Everyone went to bed hungry.")); }
  if (!I.toilet) I.morale -= 3;
  // spots: the leader claims, rivals claim too
  const claims = { A: [], B: [], C: [], D: o.spots };
  for (const cls of ["A", "B", "C"]) { const k = RIVAL_STYLE[cls].scans + (Math.random() < .3 ? 1 : 0) - (Math.random() < .2 ? 1 : 0); claims[cls] = shuffle(SPOTS).slice(0, clamp(k, 0, 3)); }
  for (const s of SPOTS) {
    const who = Object.keys(claims).filter(c => claims[c].includes(s));
    if (!who.length) continue;
    const gain = who.length > 1 ? 5 : 10;
    who.forEach(c => { if (c === "D") I.ep += gain; else I.rivals[c].ep += gain; });
    I.spots[s] = who.length === 1 ? who[0] : I.spots[s];
  }
  const L = leaderP();
  if (o.spots.length) { I.exposure += o.spots.length * clamp(14 - Math.floor((L?.int || 5) / 2), 6, 14); msgs.push(tr(`Лидер занял точки: ${o.spots.map(sn).join(", ")}.`, `The leader claimed: ${o.spots.map(sn).join(", ")}.`)); }
  for (const cls of ["A", "B", "C"]) { const R = I.rivals[cls]; R.exposure += claims[cls].length * 12; R.ep -= RIVAL_STYLE[cls].spend + rnd(6); }
  // scouting
  for (const cls in o.scouts) {
    const id = o.scouts[cls]; if (!id) continue;
    const p = id === "you" ? me() : byId(id), c = clue(cls, Math.round((p.int + p.soc) / 2) + (I.rivals[cls].exposure > 30 ? 2 : 0));
    msgs.push(`🔭 ${c.sure ? "✅ " : "❔ "}${c.text}`);
  }
  I.morale = clamp(I.morale, 0, 100);
  I.log.push(...msgs.map(m => `<b>${tr("День", "Day")} ${I.day}.</b> ${m}`));
  night();
}

// ── night events, one at most per night
function night() {
  const ev = [];
  if (I.day === 3 && !I.spyDone) ev.push("spy");
  if (I.day >= 2 && !I.stormDone && (I.day === 5 || Math.random() < .3)) ev.push("storm");
  if (I.day >= 4 && !I.theftDone && Math.random() < .5) ev.push("theft");
  if (I.morale < 25) ev.push("quit");
  const e = ev[0];
  if (!e) return nextDay();
  const mila = byId("mila"), sasha = byId("sasha"), tom = byId("tom");
  const box = (who, text, opts) => {
    ctx.frame(`${bar()}<section class="paper event"><p class="kicker">${tr("Ночь", "Night")} ${I.day}</p>${who ? line(who, text) : `<p>${text}</p>`}<div class="choices">${opts.map((o, i) => `<button class="btn ${o.dis ? "" : i ? "" : "primary"}" data-i="${i}" ${o.dis ? "disabled" : ""}>${o.label}</button>`).join("")}</div></section>`);
    $(".choices").onclick = ev2 => { const b = ev2.target.closest("[data-i]"); if (!b) return; const msg = opts[+b.dataset.i].go(); if (msg) I.log.push(`<b>${tr("Ночь", "Night")} ${I.day}.</b> ${msg}`); nextDay(); };
  };
  if (e === "spy") {
    I.spyDone = true;
    const smart = G.stats.int >= 7 || G.stats.soc >= 7;
    return box(mila, tr("Рекс выгнал меня из лагеря… Можно я побуду с вами? Я буду помогать, честно.", "Rex threw me out of the camp… Can I stay with you? I'll help, honestly."), [
      { label: tr("Принять её", "Take her in"), go: () => { I.spy = "C"; I.morale += 3; return tr("Мила осталась в лагере D. Кое-кто шепчется, что это ловушка.", "Mila stayed in D's camp. Some whisper it's a trap."); } },
      { label: tr("Принять и кормить её ложью", "Take her in and feed her lies") + (smart ? "" : ` (🧠7 / 💬7)`), dis: !smart, go: () => { I.fed = "C"; return tr("Вы при Миле «случайно» обсудили фальшивого лидера. Пусть донесёт это Рексу.", "You 'accidentally' discussed a fake leader in front of Mila. Let her carry that to Rex."); } },
      { label: tr("Отказать", "Turn her away"), go: () => { I.morale -= 6; return tr("Мила ушла под дождём. Часть класса считает вас бессердечным.", "Mila walked off into the rain. Part of the class thinks you're heartless."); } },
    ]);
  }
  if (e === "storm") {
    I.stormDone = true;
    if (I.tents) { I.log.push(`<b>${tr("Ночь", "Night")} ${I.day}.</b> ${tr("Шторм! Палатки выдержали.", "A storm! The tents held.")}`); return nextDay(); }
    return box(sasha, tr("Всё промокло, Юки трясёт от холода. Может, всё-таки купим палатки?", "Everything's soaked and Yuki is shivering. Maybe we should buy tents after all?"), [
      { label: tr("Купить палатки сейчас (−40)", "Buy tents now (−40)"), go: () => { I.ep -= 40; I.tents = true; return tr("Палатки доставили на рассвете.", "The tents arrived at dawn."); } },
      { label: tr("Перетерпеть", "Tough it out"), go: () => { I.morale -= 15; if (Math.random() < .5) { I.gone.push("yuki"); I.ep -= 30; return tr("Юки слегла с температурой и покинула остров (−30).", "Yuki came down with a fever and left the island (−30)."); } return tr("Ночь была ужасной, но все остались.", "The night was awful, but everyone stayed."); } },
    ]);
  }
  if (e === "theft") {
    I.theftDone = true;
    return box(tom, tr("Кто-то стащил наши пайки! Я видел следы к лагерю C.", "Someone stole our rations! I saw tracks heading to C's camp."), [
      { label: tr("Провести расследование", "Investigate") + ` (🧠${G.stats.int})`, go: () => { if (Math.random() < .25 + G.stats.int * .07) { I.rivals.C.ep -= 30; I.morale += 5; return tr("Вы нашли обёртки у лагеря C. Школа оштрафовала класс C на 30 ОЭ.", "You found the wrappers at C's camp. The school fined Class C 30 EP."); } I.morale -= 6; return tr("Доказательств нет. Время потрачено зря.", "No proof. A wasted night."); } },
      { label: tr("Купить новые пайки (−20)", "Buy new rations (−20)"), go: () => { I.ep -= 20; return tr("Новые пайки куплены.", "New rations bought."); } },
    ]);
  }
  if (e === "quit") {
    const weak = classmates().filter(p => !I.gone.includes(p.id) && p.id !== I.leader).sort((a, b) => a.phy - b.phy)[0];
    if (weak) { I.gone.push(weak.id); I.ep -= 30; I.morale += 12; I.log.push(`<b>${tr("Ночь", "Night")} ${I.day}.</b> ${tr(`${nm(weak)} не выдержал(а) и сошёл(шла) с дистанции (−30).`, `${nm(weak)} couldn't take it and dropped out (−30).`)}`); }
    return nextDay();
  }
  nextDay();
}
function nextDay() { I.morale = clamp(I.morale, 0, 100); if (I.day >= 7) return finale(); I.day++; day(); }

// ── day 7: name the leaders
function finale() {
  ctx.setRerender(finale);
  const picks = { A: "", B: "", C: "" };
  const draw = () => {
    ctx.frame(`${bar()}<section class="paper">
      <p class="kicker">${tr("День 7. Последний шанс", "Day 7. Last chance")}</p>
      <h2>${tr("Назовите лидеров других классов", "Name the other classes' leaders")}</h2>
      <p class="dim">${tr("Верно: +50 вам, −50 им. Ошибка: −50 вам. Можно промолчать.", "Right: +50 for you, −50 for them. Wrong: −50 for you. You may stay silent.")}</p>
      ${["A", "B", "C"].map(cls => { const R = I.rivals[cls];
        return `<div class="guess"><b style="color:${CLASSES[cls].color}">${tr("Класс", "Class")} ${cls}</b><div class="gopts">
          <button class="gopt ${picks[cls] === "" ? "sel" : ""}" data-c="${cls}" data-id="">${tr("Промолчать", "Stay silent")}</button>
          ${R.cands.map(id => `<button class="gopt ${picks[cls] === id ? "sel" : ""} ${R.marks[id] || ""}" data-c="${cls}" data-id="${id}">${face(byId(id), { size: "xs" })}${nm(byId(id))}${R.marks[id] === "sure" ? " ✗" : R.marks[id] === "maybe" ? " ?" : ""}</button>`).join("")}</div></div>`; }).join("")}
      <button class="btn primary" id="sub">${tr("Сдать ответы", "Hand in the answers")}</button></section>`);
    document.querySelector(".paper").onclick = e => { const b = e.target.closest("[data-c]"); if (b) { picks[b.dataset.c] = b.dataset.id; draw(); } };
    $("#sub").onclick = () => settle(picks);
  };
  draw();
}

function settle(picks) {
  const lines = [], mods = { A: 0, B: 0, C: 0, D: 0 };
  for (const cls of ["A", "B", "C"]) {
    const id = picks[cls], R = I.rivals[cls]; if (!id) continue;
    if (id === R.leader) { mods.D += 50; mods[cls] -= 50; lines.push(`✅ ${tr(`Лидер класса ${cls} — ${nm(byId(id))}. Вы угадали.`, `Class ${cls}'s leader was ${nm(byId(id))}. You were right.`)}`); }
    else { mods.D -= 50; lines.push(`❌ ${tr(`Лидером класса ${cls} был(а) ${nm(byId(R.leader))}, а не ${nm(byId(id))}.`, `Class ${cls}'s leader was ${nm(byId(R.leader))}, not ${nm(byId(id))}.`)}`); }
  }
  // the rivals try to name your leader
  const hard = G.diff === "hard" ? .12 : 0;
  const leaderName = id => id === "you" ? esc(G.name) : nm(byId(id));
  for (const cls of ["A", "B", "C"]) {
    let conf = (I.swapped ? I.oldExposure : I.exposure) / 100 + hard + (I.spy === cls ? .45 : 0) + (I.fed === cls ? .5 : 0);
    if (conf < RIVAL_STYLE[cls].guessAt * (.8 + Math.random() * .4)) continue;
    const thinks = I.fed === cls ? "decoy" : I.swapped || I.leader;
    if (thinks === I.leader) { mods[cls] += 50; mods.D -= 50; lines.push(`⚠️ ${tr(`Класс ${cls} вычислил вашего лидера (${leaderName(I.leader)}).`, `Class ${cls} worked out your leader (${leaderName(I.leader)}).`)}`); }
    else { mods[cls] -= 50; lines.push(`🎭 ${tr(`Класс ${cls} назвал не того лидера${I.swapped ? " — сработала подмена" : ""}. Минус 50 для них.`, `Class ${cls} named the wrong leader${I.swapped ? ": the switch worked" : ""}. Minus 50 for them.`)}`); }
  }
  // the rivals also guess each other
  if (Math.random() < .5) { mods.A += 50; mods.C -= 50; lines.push(tr("Класс A вычислил лидера класса C.", "Class A worked out Class C's leader.")); }
  const fin = { D: Math.max(0, I.ep + mods.D) };
  for (const cls of ["A", "B", "C"]) fin[cls] = Math.max(0, I.rivals[cls].ep + mods[cls]);
  const order = Object.keys(fin).sort((a, b) => fin[b] - fin[a]);
  const trust = {};
  if (I.swapped && I.swapped !== "you") trust[I.swapped] = 6;
  classmates().forEach(p => trust[p.id] = (trust[p.id] || 0) + (I.morale > 50 ? 4 : I.morale < 30 ? -4 : 0));
  ctx.done({ headline: tr(`Класс D набрал ${fin.D} очков экзамена (${order.indexOf("D") + 1}-е место)`, `Class D scored ${fin.D} exam points (place ${order.indexOf("D") + 1})`),
    lines: [...lines, tr(`Итог по ОЭ: A ${fin.A}, B ${fin.B}, C ${fin.C}, D ${fin.D}. Очки экзамена добавлены к очкам классов.`, `Final EP: A ${fin.A}, B ${fin.B}, C ${fin.C}, D ${fin.D}. Exam points are added to class points.`)],
    cp: fin, pp: 0, trust, usedIntel: I.usedIntel });
}
