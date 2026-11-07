// Merit Academy: the students. Every character is original; names are given in English and Russian.
// stats: int (intellect), phy (physical), soc (social), 1..10.
// sway: how much each persuasion approach moves this person (0 = nothing, 2 = a lot):
//   logic, heart (empathy), pay (private points), push (pressure).
export const CLASSES = {
  A: { color: "#c9a227", dark: "#7a5f0e" },
  B: { color: "#3a7bd5", dark: "#1d4a8c" },
  C: { color: "#c0392b", dark: "#7a1d14" },
  D: { color: "#2e9e6b", dark: "#16583a" },
};

const P = (id, cls, en, ru, int, phy, soc, sway, look, note) => ({ id, cls, name: { en, ru }, int, phy, soc, sway, look, note });
// look: [hair style, hair colour, skin, eyes, extra]
export const PEOPLE = [
  // Class D, the player's class
  P("mira", "D", "Mira Kovach", "Мира Ковач", 8, 4, 5, { logic: 2, heart: 1, pay: 0, push: 0.3 }, ["bob", "#2b1d16", "#f1d3bd", "sharp", "glasses"],
    { en: "Top of the class on paper. Proud, principled, hates losing.", ru: "Лучшая в классе по оценкам. Гордая, принципиальная, не терпит поражений." }),
  P("tom", "D", "Tom Reyes", "Том Рейес", 3, 9, 5, { logic: 0.3, heart: 1, pay: 0.8, push: 1.6 }, ["spiky", "#6b3a1f", "#d9a77c", "calm", ""],
    { en: "Star athlete with a short fuse. Loyal to whoever stands up for him.", ru: "Звезда спорта со вспыльчивым характером. Верен тем, кто за него заступается." }),
  P("lin", "D", "Lin Wei", "Лин Вэй", 9, 3, 2, { logic: 1.8, heart: 0.2, pay: 0.4, push: 0 }, ["long", "#111", "#f3dcc4", "closed", ""],
    { en: "Barely speaks. Solves things nobody asked her to solve.", ru: "Почти не разговаривает. Решает задачи, которые ей никто не задавал." }),
  P("sasha", "D", "Sasha Belova", "Саша Белова", 5, 4, 9, { logic: 0.6, heart: 1.8, pay: 0.4, push: 0.3 }, ["wavy", "#e2b04a", "#f6dccb", "soft", "earring"],
    { en: "Knows everyone and everything. When she changes her mind, half the class follows.", ru: "Знает всех и всё. Когда она меняет мнение, за ней идёт полкласса." }),
  P("dev", "D", "Dev Patel", "Дев Патель", 6, 5, 6, { logic: 0.8, heart: 0.3, pay: 2, push: 0.5 }, ["undercut", "#1a1410", "#b5835a", "sharp", ""],
    { en: "Cynic and dealmaker. Everything has a price, including his vote.", ru: "Циник и делец. У всего есть цена, включая его голос." }),
  P("yuki", "D", "Yuki Mori", "Юки Мори", 5, 3, 4, { logic: 0.8, heart: 1.8, pay: 0.3, push: 1.2 }, ["tied", "#3b2a4a", "#f5e0cf", "soft", ""],
    { en: "Timid and kind. The first one people point at when someone must go.", ru: "Робкая и добрая. Первая, на кого показывают, когда кто-то должен уйти." }),
  P("ken", "D", "Ken Ito", "Кэн Ито", 3, 6, 7, { logic: 0.4, heart: 1.4, pay: 1.2, push: 0.8 }, ["messy", "#8a5a2b", "#f0cfb0", "calm", ""],
    { en: "Class clown. Lazy in class, surprisingly brave outside it.", ru: "Шут класса. Ленив на уроках, но неожиданно смел за их пределами." }),
  P("aye", "D", "Aye Thandar", "Аи Тандар", 7, 5, 6, { logic: 1.4, heart: 1.2, pay: 0.2, push: 0.4 }, ["bun", "#1d1410", "#c99a72", "soft", ""],
    { en: "Transfer student from Yangon. Diligent, fair, quietly stubborn.", ru: "Перевелась из Янгона. Старательная, справедливая и тихо упрямая." }),
  P("oleg", "D", "Oleg Volkov", "Олег Волков", 6, 8, 3, { logic: 1.2, heart: 0.4, pay: 0.6, push: 1 }, ["buzz", "#c8c2b8", "#f0d6c0", "sharp", "scar"],
    { en: "A loner who respects strength and straight answers.", ru: "Одиночка, который уважает силу и прямые ответы." }),
  // Class A: calculating
  P("viktor", "A", "Viktor Lang", "Виктор Ланг", 10, 6, 7, { logic: 1, heart: 0, pay: 0, push: 0 }, ["slick", "#d8d0c0", "#f3dcc8", "sharp", "glasses"],
    { en: "Leader of Class A. Treats every exam as a chess game he has already won.", ru: "Лидер класса A. Считает каждый экзамен партией в шахматы, которую он уже выиграл." }),
  P("elise", "A", "Elise Hart", "Элиза Харт", 8, 5, 6, { logic: 1, heart: 0.5, pay: 0.3, push: 0.2 }, ["long", "#5a2a1a", "#f6dfcf", "calm", ""], { en: "Viktor's right hand.", ru: "Правая рука Виктора." }),
  P("noah", "A", "Noah Grant", "Ной Грант", 6, 8, 5, { logic: 0.8, heart: 0.6, pay: 0.5, push: 0.6 }, ["short", "#c48a3a", "#efcfb3", "calm", ""], { en: "Rowing team captain.", ru: "Капитан команды по гребле." }),
  // Class B: cooperative
  P("hana", "B", "Hana Moreau", "Хана Моро", 7, 5, 10, { logic: 1, heart: 1.6, pay: 0.2, push: 0.2 }, ["wavy", "#c9763a", "#f7e1d0", "soft", ""],
    { en: "Leader of Class B. Kind to everyone, which is exactly why everyone follows her.", ru: "Лидер класса B. Добра ко всем, поэтому все за ней и идут." }),
  P("ravi", "B", "Ravi Shah", "Рави Шах", 7, 6, 6, { logic: 1.2, heart: 1, pay: 0.4, push: 0.4 }, ["short", "#1a1410", "#a8744f", "calm", "glasses"], { en: "Hana's strategist.", ru: "Стратег Ханы." }),
  P("ivy", "B", "Ivy Chen", "Айви Чен", 5, 7, 7, { logic: 0.8, heart: 1.2, pay: 0.5, push: 0.5 }, ["tied", "#2a1a14", "#f2d8c2", "soft", ""], { en: "Volleyball ace.", ru: "Звезда волейбола." }),
  // Class C: ruthless
  P("rex", "C", "Rex Calder", "Рекс Колдер", 7, 9, 6, { logic: 0.2, heart: 0, pay: 0.6, push: 0.2 }, ["spiky", "#e8e2d8", "#e6bf9e", "sharp", "scar"],
    { en: "Leader of Class C. Rules by fear and loves dirty tricks.", ru: "Лидер класса C. Правит страхом и обожает грязные трюки." }),
  P("mila", "C", "Mila Storm", "Мила Сторм", 6, 6, 7, { logic: 0.6, heart: 0.6, pay: 1, push: 0.8 }, ["bob", "#7a1f2b", "#f3d9c7", "sharp", "earring"], { en: "Rex's spy.", ru: "Шпионка Рекса." }),
  P("bo", "C", "Bo Kang", "Бо Кан", 4, 10, 3, { logic: 0.3, heart: 0.4, pay: 0.8, push: 1.2 }, ["buzz", "#111", "#d7a982", "calm", ""], { en: "Rex's muscle.", ru: "Сила Рекса." }),
];
export const byId = id => PEOPLE.find(p => p.id === id);
export const classOf = cls => PEOPLE.filter(p => p.cls === cls);

// ── portraits: a flat, cool-toned bust in the class blazer
const HAIR = {
  short: c => `<path d="M30 40c0-18 12-28 30-28s30 10 30 28c-6-8-16-11-30-11s-24 3-30 11z" fill="${c}"/>`,
  bob: c => `<path d="M27 46c-2-22 12-36 33-36s35 14 33 36l-4 20c-2-14-6-24-6-30-8 4-22 6-36 2-2 8-6 18-8 28z" fill="${c}"/>`,
  long: c => `<path d="M26 46c-2-22 12-36 34-36s36 14 34 36l2 52H82c2-20 2-40 0-56-12 6-30 6-44-2-4 18-4 38-2 58H24z" fill="${c}"/>`,
  spiky: c => `<path d="M28 44l-2-14 10 6 2-16 10 10 6-16 8 14 10-12 4 16 12-6-4 16c-10-8-20-10-32-10s-18 4-24 12z" fill="${c}"/>`,
  wavy: c => `<path d="M26 50c-4-24 12-40 34-40s38 16 34 40c6 10 4 26-2 38-4-12-4-22-6-34-6-10-18-14-30-14-4 6-14 10-20 10-2 12-2 24-6 36-8-12-8-26-4-36z" fill="${c}"/>`,
  undercut: c => `<path d="M32 38c2-16 14-26 30-26 14 0 26 8 28 22-12-4-20 2-34 0-10-2-18 0-24 4z" fill="${c}"/><path d="M32 42c-2 4-2 8-2 10" stroke="${c}" stroke-width="3" opacity=".5"/>`,
  tied: c => `<path d="M28 46c-2-20 12-34 32-34s34 14 32 34c-8-10-20-14-32-14s-24 4-32 14z" fill="${c}"/><path d="M86 30c14 4 18 22 10 34-2-10-6-18-12-22z" fill="${c}"/>`,
  bun: c => `<circle cx="60" cy="10" r="11" fill="${c}"/><path d="M28 46c-2-20 12-34 32-34s34 14 32 34c-8-10-20-14-32-14s-24 4-32 14z" fill="${c}"/>`,
  messy: c => `<path d="M28 46c-6-20 8-38 32-38 26 0 38 18 32 38-4-6-6-10-10-12l-4 8-6-10-6 8-6-8-6 8-6-8-6 10c-6 2-10 6-14 4z" fill="${c}"/>`,
  buzz: c => `<path d="M32 40c0-16 12-26 28-26s28 10 28 26c-8-6-18-8-28-8s-20 2-28 8z" fill="${c}" opacity=".85"/>`,
  slick: c => `<path d="M30 42c0-20 14-30 32-30 16 0 28 10 28 24-16-10-34-8-48 0-6 2-10 4-12 6z" fill="${c}"/><path d="M40 22c10-4 30-4 44 6" stroke="#fff" stroke-opacity=".25" stroke-width="2" fill="none"/>`,
};
const EYES = {
  sharp: `<path d="M44 54l10 2M66 56l10-2" stroke="#1b1b24" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="49" cy="59" rx="3" ry="2.4" fill="#1b1b24"/><ellipse cx="71" cy="59" rx="3" ry="2.4" fill="#1b1b24"/>`,
  calm: `<ellipse cx="49" cy="58" rx="3.4" ry="3.2" fill="#1b1b24"/><ellipse cx="71" cy="58" rx="3.4" ry="3.2" fill="#1b1b24"/><path d="M44 51q5-3 10 0M66 51q5-3 10 0" stroke="#1b1b24" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  soft: `<ellipse cx="49" cy="58" rx="3.6" ry="4" fill="#1b1b24"/><ellipse cx="71" cy="58" rx="3.6" ry="4" fill="#1b1b24"/><circle cx="50" cy="56.5" r="1.2" fill="#fff"/><circle cx="72" cy="56.5" r="1.2" fill="#fff"/><path d="M44 51q5-2 10 1M66 52q5-3 10-1" stroke="#1b1b24" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  closed: `<path d="M44 58q5 3 10 0M66 58q5 3 10 0" stroke="#1b1b24" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M44 51h10M66 51h10" stroke="#1b1b24" stroke-width="1.8" stroke-linecap="round"/>`,
};
export function portrait(p, { mood = "", size = "" } = {}) {
  const [hair, hc, skin, eyes, extra] = p.look, cl = CLASSES[p.cls];
  const back = hair === "long" || hair === "wavy" ? HAIR[hair](hc) : "";
  const mouth = mood === "smile" ? `<path d="M53 72q7 6 14 0" stroke="#7a3b30" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    : mood === "angry" ? `<path d="M53 75q7-4 14 0" stroke="#7a3b30" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    : `<path d="M55 73h10" stroke="#7a3b30" stroke-width="2.2" stroke-linecap="round"/>`;
  const extras = (extra === "glasses" ? `<g fill="none" stroke="#1b1b24" stroke-width="1.8"><rect x="41" y="52" width="16" height="12" rx="4"/><rect x="63" y="52" width="16" height="12" rx="4"/><path d="M57 57h6"/></g>` : "")
    + (extra === "earring" ? `<circle cx="32" cy="70" r="2.4" fill="#e8c86a"/>` : "")
    + (extra === "scar" ? `<path d="M76 46l-6 14" stroke="#b5544a" stroke-width="1.6" opacity=".8"/>` : "");
  return `<svg class="portrait ${size}" viewBox="0 0 120 130" aria-hidden="true">
    ${back}
    <path d="M14 130c2-26 18-38 46-38s44 12 46 38z" fill="#1d2233"/>
    <path d="M44 94l16 26 16-26z" fill="#f4f1ea"/><path d="M57 98h6l2 26h-10z" fill="${cl.color}"/>
    <path d="M44 94l-10 36M76 94l10 36" stroke="${cl.dark}" stroke-width="3"/>
    <rect x="52" y="78" width="16" height="18" rx="6" fill="${skin}"/>
    <ellipse cx="60" cy="56" rx="29" ry="32" fill="${skin}"/>
    <ellipse cx="31" cy="60" rx="4" ry="7" fill="${skin}"/><ellipse cx="89" cy="60" rx="4" ry="7" fill="${skin}"/>
    ${EYES[eyes]}${mouth}${extras}${HAIR[hair](hc)}
    <circle cx="96" cy="112" r="8" fill="${cl.color}"/><text x="96" y="116" font-size="10" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">${p.cls}</text>
  </svg>`;
}
// the player: a plain silhouette with a question mark, because their real ability is hidden
export function playerPortrait(size = "") {
  return `<svg class="portrait ${size}" viewBox="0 0 120 130" aria-hidden="true">
    <path d="M14 130c2-26 18-38 46-38s44 12 46 38z" fill="#1d2233"/>
    <path d="M44 94l16 26 16-26z" fill="#f4f1ea"/><path d="M57 98h6l2 26h-10z" fill="${CLASSES.D.color}"/>
    <rect x="52" y="78" width="16" height="18" rx="6" fill="#cfc8bf"/>
    <ellipse cx="60" cy="56" rx="29" ry="32" fill="#cfc8bf"/>
    <path d="M30 44c0-18 12-28 30-28s30 10 30 28c-6-8-16-11-30-11s-24 3-30 11z" fill="#2a2d3a"/>
    <text x="60" y="70" font-size="30" font-weight="800" text-anchor="middle" fill="#2a2d3a" font-family="serif">?</text>
  </svg>`;
}
