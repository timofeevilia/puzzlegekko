// 81 Trials: characters and scenery, drawn as inline SVG in a flat, opera-mask-inspired style.
const INK = "#1b1a17";
const sw = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

// ── busts for dialogue (viewBox 0 0 160 180)
const robe = (fill, trim, extra = "") => `<path d="M18 180c4-34 24-52 62-56 38 4 58 22 62 56z" fill="${fill}" ${sw}/><path d="M58 126l22 30 22-30" fill="none" stroke="${trim}" stroke-width="7"/>${extra}`;
export const BUST = {
  wukong: `
    ${robe("#e2a93b", "#8a3b1f", `<path d="M26 170c10-6 20-6 30 0M104 170c10-6 20-6 30 0" stroke="#5a3a12" stroke-width="5" fill="none"/>`)}
    <path d="M38 78c-8-34 16-60 42-60s50 26 42 60c-2 22-18 42-42 42s-40-20-42-42z" fill="#c98a3a" ${sw}/>
    <circle cx="34" cy="76" r="10" fill="#c98a3a" ${sw}/><circle cx="126" cy="76" r="10" fill="#c98a3a" ${sw}/>
    <path d="M50 70c0-16 14-24 30-24s30 8 30 24c0 26-12 42-30 42S50 96 50 70z" fill="#f1c9a5" ${sw}/>
    <path d="M52 66c6-12 18-14 28-6 10-8 22-6 28 6-2 16-12 26-28 32-16-6-26-16-28-32z" fill="#c8322b"/>
    <path d="M56 66c6-8 14-8 20-2M104 66c-6-8-14-8-20-2" stroke="#e6c25a" stroke-width="2.5" fill="none"/>
    <ellipse cx="68" cy="70" rx="7" ry="5" fill="#fff" ${sw}/><ellipse cx="92" cy="70" rx="7" ry="5" fill="#fff" ${sw}/>
    <circle cx="69" cy="70" r="3" fill="${INK}"/><circle cx="93" cy="70" r="3" fill="${INK}"/>
    <path d="M76 84q4 3 8 0" stroke="${INK}" stroke-width="2.5" fill="none"/>
    <path class="mouth" d="M66 96q14 10 28 0" fill="#7a1f1a" ${sw}/>
    <path d="M40 50c10-8 70-8 80 0" stroke="#e6c25a" stroke-width="7" fill="none"/><path d="M40 50c10-8 70-8 80 0" stroke="${INK}" stroke-width="1.5" fill="none" opacity=".5"/>
    <circle cx="80" cy="44" r="5" fill="#c8322b" stroke="#e6c25a" stroke-width="2"/>
    <path d="M66 22c2-10 10-14 14-14s12 4 14 14" fill="#c98a3a" ${sw}/>`,
  bajie: `
    ${robe("#2b2b33", "#3d6fb0", `<path d="M80 128v52" stroke="#3d6fb0" stroke-width="4"/>`)}
    <path d="M36 78c0-34 20-56 44-56s44 22 44 56-18 44-44 44-44-10-44-44z" fill="#f2b6a6" ${sw}/>
    <path d="M38 52c-22 6-26 34-14 50 6-14 12-26 18-34z" fill="#e79d8c" ${sw}/><path d="M122 52c22 6 26 34 14 50-6-14-12-26-18-34z" fill="#e79d8c" ${sw}/>
    <ellipse cx="80" cy="88" rx="22" ry="15" fill="#f6c8ba" ${sw}/>
    <ellipse cx="72" cy="88" rx="4" ry="6" fill="${INK}"/><ellipse cx="88" cy="88" rx="4" ry="6" fill="${INK}"/>
    <path d="M58 64q6-5 12 0M90 64q6-5 12 0" stroke="${INK}" stroke-width="3" fill="none"/>
    <circle cx="64" cy="70" r="3.5" fill="${INK}"/><circle cx="96" cy="70" r="3.5" fill="${INK}"/>
    <path class="mouth" d="M64 108q16 10 32 0" fill="none" ${sw}/>
    <ellipse cx="50" cy="96" rx="7" ry="4" fill="#e8838a" opacity=".5"/><ellipse cx="110" cy="96" rx="7" ry="4" fill="#e8838a" opacity=".5"/>
    <path d="M52 30c8-8 48-8 56 0l-4 10H56z" fill="#2b2b33" ${sw}/>`,
  sha: `
    ${robe("#6b4a2b", "#c9a24a", `${[30, 44, 58, 72, 88, 102, 116, 130].map((x, i) => `<circle cx="${x}" cy="${136 + Math.abs(i - 3.5) * -3 + 12}" r="7" fill="#e8e0cc" ${sw}/>`).join("")}`)}
    <path d="M40 74c0-32 18-52 40-52s40 20 40 52-16 46-40 46-40-14-40-46z" fill="#6f8aa0" ${sw}/>
    <path d="M42 84c4 30 18 44 38 44s34-14 38-44c-8 14-20 20-38 20s-30-6-38-20z" fill="#b8352b" ${sw}/>
    <path d="M44 40c6-14 22-20 36-20s30 6 36 20c-10-6-22-8-36-8s-26 2-36 8z" fill="#b8352b" ${sw}/>
    <path d="M56 62l14 4M104 62l-14 4" stroke="${INK}" stroke-width="3.5"/>
    <ellipse cx="66" cy="72" rx="6" ry="5" fill="#fff" ${sw}/><ellipse cx="94" cy="72" rx="6" ry="5" fill="#fff" ${sw}/>
    <circle cx="66" cy="72" r="2.6" fill="${INK}"/><circle cx="94" cy="72" r="2.6" fill="${INK}"/>
    <path d="M76 82l4 8 4-8" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <path class="mouth" d="M70 100h20" ${sw}/>`,
  tang: `
    ${robe("#c8322b", "#e6c25a", `<path d="M30 150h100M44 132v40M116 132v40M80 158v22" stroke="#e6c25a" stroke-width="3"/><path d="M58 126l22 30 22-30" fill="#f0d27a" stroke="none"/>`)}
    <path d="M44 76c0-28 16-46 36-46s36 18 36 46-14 44-36 44-36-16-36-44z" fill="#f3dcc4" ${sw}/>
    <path d="M58 72q8 4 14 0M88 72q8 4 14 0" stroke="${INK}" stroke-width="2.6" fill="none"/>
    <path d="M58 64q8-4 14-1M88 63q8-3 14 1" stroke="${INK}" stroke-width="2" fill="none"/>
    <path d="M78 76v10q2 2 4 0" stroke="${INK}" stroke-width="2" fill="none"/>
    <path class="mouth" d="M72 98q8 4 16 0" fill="none" ${sw}/>
    <circle cx="80" cy="58" r="2.5" fill="#c8322b"/>
    <g fill="#e6c25a" ${sw}><path d="M46 46l6-22 12 16z"/><path d="M60 40l8-24 12 22z"/><path d="M80 38l0-26 0 0 12 26z" transform="translate(-6 0)"/><path d="M90 40l10-22 8 24z"/><path d="M106 40l10-16 4 22z"/></g>
    <path d="M44 48c10-8 62-8 72 0" stroke="#e6c25a" stroke-width="8" fill="none"/>`,
  baigu: `
    ${robe("#f1ede4", "#9a9a9a", `<path d="M40 150q40 14 80 0" stroke="#c9c2b4" stroke-width="3" fill="none"/>`)}
    <path d="M30 80c-6-40 20-64 50-64s56 24 50 64c-2 30-4 60-8 84H38c-4-24-6-54-8-84z" fill="#1b1a17"/>
    <path d="M48 74c0-26 14-42 32-42s32 16 32 42-12 44-32 44-32-18-32-44z" fill="#f7f3ec" ${sw}/>
    <path d="M58 70q8-6 16 0M86 70q8-6 16 0" stroke="${INK}" stroke-width="3" fill="none"/>
    <path d="M56 64l18-4M104 64l-18-4" stroke="${INK}" stroke-width="2"/>
    <path class="mouth" d="M72 98q8 5 16 0" fill="#b3201f" stroke="#b3201f" stroke-width="3"/>
    <ellipse cx="60" cy="86" rx="6" ry="3" fill="#e8a0a0" opacity=".5"/><ellipse cx="100" cy="86" rx="6" ry="3" fill="#e8a0a0" opacity=".5"/>
    <g transform="translate(112 34)"><circle r="9" fill="#efe8da" ${sw}/><circle cx="-3" cy="-1" r="2" fill="${INK}"/><circle cx="3" cy="-1" r="2" fill="${INK}"/><path d="M-12 10l-14 14" ${sw}/></g>`,
  fan: `
    ${robe("#2f6b5a", "#e6c25a")}
    <path d="M36 76c-4-34 18-58 44-58s48 24 44 58c-2 20-6 40-10 56H46c-4-16-8-36-10-56z" fill="#1b1a17"/>
    <path d="M50 76c0-24 14-40 30-40s30 16 30 40-12 42-30 42-30-18-30-42z" fill="#f6dcc8" ${sw}/>
    <path d="M60 72q6-4 12 0M88 72q6-4 12 0" stroke="${INK}" stroke-width="3" fill="none"/>
    <path class="mouth" d="M72 98q8 4 16 0" fill="#b3201f" stroke="#b3201f" stroke-width="3"/>
    <circle cx="80" cy="22" r="10" fill="#1b1a17"/><path d="M68 18h24" stroke="#e6c25a" stroke-width="4"/>
    <g transform="translate(124 108) rotate(20)"><path d="M0 0l-24-58c20-10 40-6 54 8z" fill="#7aa04a" ${sw}/><path d="M0 0l-12-52M0 0l6-48M0 0l18-38" stroke="#4d7030" stroke-width="2"/><path d="M0 0v34" stroke="#8a5a2b" stroke-width="6"/></g>`,
  spider: `
    ${robe("#4a2f5c", "#c9a24a", `<path d="M40 140l40 20 40-20M60 132l20 28 20-28" stroke="#bfb3cc" stroke-width="1.6" fill="none"/>`)}
    <path d="M34 78c-6-34 18-60 46-60s52 26 46 60c-2 24-6 46-10 62H44c-4-16-8-38-10-62z" fill="#1b1a17"/>
    <path d="M50 76c0-24 14-40 30-40s30 16 30 40-12 42-30 42-30-18-30-42z" fill="#f2e2e8" ${sw}/>
    <path d="M58 70l14 2M102 70l-14 2" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="66" cy="76" rx="5" ry="4" fill="${INK}"/><ellipse cx="94" cy="76" rx="5" ry="4" fill="${INK}"/>
    <path class="mouth" d="M72 100q8 4 16 0" fill="#6b1f4a" stroke="#6b1f4a" stroke-width="3"/>
    <g stroke="#d9cfe6" stroke-width="1.4" fill="none" opacity=".9"><path d="M80 10v28M60 16l20 22 20-22M64 26q16 10 32 0M70 34q10 6 20 0"/></g>`,
  monk: `
    ${robe("#8a6a3a", "#c9a24a")}
    <path d="M46 76c0-26 16-42 34-42s34 16 34 42-14 42-34 42-34-16-34-42z" fill="#f0d6bc" ${sw}/>
    <path d="M60 74q6 3 12 0M88 74q6 3 12 0" stroke="${INK}" stroke-width="2.6" fill="none"/>
    <path class="mouth" d="M72 98q8 5 16 0" fill="none" ${sw}/>
    <path d="M56 104q24 20 48 0q-4 20-24 22-20-2-24-22z" fill="#e8e2d6" ${sw}/>`,
};
export const NAMES = {
  wukong: { ru: "Сунь Укун", en: "Sun Wukong", my: "ဆွန်ဝူခုန်း", zh: "孙悟空" },
  bajie: { ru: "Чжу Бацзе", en: "Zhu Bajie", my: "ကျူပါကျဲ", zh: "猪八戒" },
  sha: { ru: "Ша Сэн", en: "Sha Wujing", my: "ရှာဝူကျင်း", zh: "沙悟净" },
  tang: { ru: "Танский монах", en: "Tang Sanzang", my: "ထန်ဘုန်းကြီး", zh: "唐三藏" },
  baigu: { ru: "Белая Кость", en: "White Bone Demon", my: "အရိုးဖြူ နတ်ဆိုးမ", zh: "白骨精" },
  fan: { ru: "Принцесса Железный Веер", en: "Princess Iron Fan", my: "သံယပ်တောင် မင်းသမီး", zh: "铁扇公主" },
  spider: { ru: "Паучиха", en: "Spider Spirit", my: "ပင့်ကူ နတ်ဆိုးမ", zh: "蜘蛛精" },
  monk: { ru: "Даос Чжэньюань", en: "Master Zhenyuan", my: "ကျန်ယွမ်ဇီ ဆရာ", zh: "镇元子" },
};
export const bust = (id, cls = "") => `<svg class="bust ${cls}" viewBox="0 0 160 180" aria-hidden="true">${BUST[id]}</svg>`;

// a red seal with characters, as in a painting's stamp
export function seal(text, { size = 64, color = "#c23a2b", dim = false } = {}) {
  const chars = [...text], two = chars.length > 1;
  return `<svg class="seal ${dim ? "dim" : ""}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
    <rect x="3" y="3" width="58" height="58" rx="6" fill="${dim ? "none" : color}" stroke="${color}" stroke-width="3"/>
    <rect x="8" y="8" width="48" height="48" rx="3" fill="none" stroke="${dim ? color : "#f6e7d0"}" stroke-width="1.5" opacity=".7"/>
    ${two ? `<text x="32" y="30" text-anchor="middle" font-size="22" fill="${dim ? color : "#f6e7d0"}" font-family="'Ma Shan Zheng','Noto Serif SC',serif">${chars[0]}</text><text x="32" y="53" text-anchor="middle" font-size="22" fill="${dim ? color : "#f6e7d0"}" font-family="'Ma Shan Zheng','Noto Serif SC',serif">${chars[1]}</text>`
      : `<text x="32" y="44" text-anchor="middle" font-size="34" fill="${dim ? color : "#f6e7d0"}" font-family="'Ma Shan Zheng','Noto Serif SC',serif">${chars[0]}</text>`}
  </svg>`;
}

// ── ink-wash landscapes. A scene is a sky colour, three mountain ranges and some decoration.
const range = (seed, y, amp, color, op, blur) => {
  let d = `M0 ${y}`, x = 0, s = seed;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  while (x < 1600) { const w = 80 + r() * 160, h = y - amp * (.4 + r() * .8); d += ` Q${x + w * .5} ${h} ${x + w} ${y - r() * amp * .3}`; x += w; }
  d += ` L1600 900 L0 900 Z`;
  return `<path d="${d}" fill="${color}" opacity="${op}" ${blur ? `filter="url(#soft)"` : ""}/>`;
};
const pine = (x, y, s = 1, c = "#2a2a26") => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M0 0v-80" stroke="${c}" stroke-width="5"/><path d="M-40-40q40-18 80 0q-40-6-80 0zM-30-62q30-14 60 0q-30-5-60 0zM-46-20q46-20 92 0q-46-7-92 0z"/></g>`;
const SCENES = {
  mountain: { sky: ["#efe4cc", "#e3d2ae"], sun: "#c23a2b", ranges: ["#9aa39a", "#6c7770", "#3b443f"], deco: () => pine(1250, 760, 1.4) + pine(1340, 790, 1) + pine(180, 800, 1.2) },
  temple: { sky: ["#f1e7d2", "#e5d6b6"], sun: "#d98a3a", ranges: ["#aab3a2", "#7d8a74", "#4b5a45"], deco: () => `<g transform="translate(1080 560)" fill="#3a2e24"><path d="M-160 120h320v20h-320z"/><path d="M-180 40q180-60 360 0l-30 10h-300z" fill="#2a2420"/><rect x="-120" y="50" width="240" height="70" fill="#7a2a20"/><path d="M-200 -10q200-70 400 0l-36 10h-328z" fill="#2a2420"/><rect x="-80" y="0" width="160" height="40" fill="#7a2a20"/></g>` + pine(300, 790, 1.5) },
  bones: { sky: ["#e8e6df", "#cfcac0"], sun: "#9b9a95", ranges: ["#b9b8b0", "#8d8c84", "#55544e"], deco: () => `<g fill="#efe9dc" opacity=".7"><circle cx="1320" cy="820" r="16"/><circle cx="260" cy="840" r="12"/></g>` + pine(1380, 780, 1.1, "#3a3a36") },
  river: { sky: ["#e6ebe8", "#c9d6d6"], sun: "#e9e3cf", ranges: ["#a9b8b8", "#7d9294", "#4e6264"], water: true, deco: () => "" },
  fire: { sky: ["#f2d2a8", "#e09a62"], sun: "#a2241a", ranges: ["#d9824e", "#b8502e", "#7a2a1a"], deco: () => "" },
  cave: { sky: ["#d9d2c6", "#b5a9b8"], sun: "#6b4a7a", ranges: ["#9c93a0", "#6f6578", "#3f3548"], deco: () => `<path d="M1040 900q0-260 200-260t200 260z" fill="#1b1a17" opacity=".85"/><g stroke="#e8e0ef" stroke-width="1.5" fill="none" opacity=".7"><path d="M1060 700l180 -60 180 60M1100 760l140-90 140 90M1240 640v260"/></g>` },
};
export function scene(name, { paper = true } = {}) {
  const s = SCENES[name] || SCENES.mountain;
  return `<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="sky-${name}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sky[0]}"/><stop offset="1" stop-color="${s.sky[1]}"/></linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" result="n"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
    <rect width="1600" height="900" fill="url(#sky-${name})"/>
    <circle cx="1220" cy="200" r="70" fill="${s.sun}" opacity=".85"/>
    ${range(7, 520, 260, s.ranges[0], .55, true)}
    <g class="mist"><rect x="-200" y="470" width="2000" height="70" fill="#fff" opacity=".35" filter="url(#soft)"/></g>
    ${range(23, 640, 220, s.ranges[1], .75, false)}
    ${s.water ? `<rect y="690" width="1600" height="210" fill="#8fa7aa" opacity=".9"/><g class="waves" stroke="#e8f0ee" stroke-width="3" fill="none" opacity=".7">${Array.from({ length: 9 }, (_, i) => `<path d="M${-100 + i * 200} ${720 + (i % 3) * 50}q50-14 100 0t100 0"/>`).join("")}</g>` : range(41, 780, 160, s.ranges[2], .95, false)}
    ${s.deco()}
    ${name === "fire" ? `<g class="flames">${Array.from({ length: 10 }, (_, i) => `<path d="M${80 + i * 160} 900q-30-90 10-150q10 50 40 60q20-60 0-110q70 60 50 200z" fill="${i % 2 ? "#f2a33a" : "#e0532e"}" opacity=".85"/>`).join("")}</g>` : ""}
    ${paper ? `<rect width="1600" height="900" fill="#fff" filter="url(#paper)" opacity=".9"/>` : ""}
  </svg>`;
}

// the four pilgrims as small figures for the map
export const PILGRIMS = `<svg class="pilgrims" viewBox="0 0 120 60" aria-hidden="true">
  <g ${sw} stroke-width="2"><circle cx="16" cy="18" r="8" fill="#c98a3a"/><path d="M10 26h12l2 22H8z" fill="#e2a93b"/><path d="M26 10v44" stroke="#c23a2b" stroke-width="3"/></g>
  <g ${sw} stroke-width="2"><circle cx="46" cy="20" r="9" fill="#f3dcc4"/><path d="M38 30h16l4 22H34z" fill="#c8322b"/><path d="M38 14h16l-2-6h-12z" fill="#e6c25a"/></g>
  <g ${sw} stroke-width="2"><circle cx="76" cy="20" r="10" fill="#f2b6a6"/><path d="M66 30h20l4 22H62z" fill="#2b2b33"/></g>
  <g ${sw} stroke-width="2"><circle cx="104" cy="20" r="9" fill="#6f8aa0"/><path d="M96 30h16l4 22H92z" fill="#6b4a2b"/></g>
</svg>`;
