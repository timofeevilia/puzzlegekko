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
  huangfeng: `
    ${robe("#b8862e", "#5a3a12", `<path d="M30 150q50 14 100 0" stroke="#e6c25a" stroke-width="4" fill="none"/><path d="M118 176q26-20 14-44q-10-12-20-2q-6 8 4 12" stroke="#f3e2b0" stroke-width="4" fill="none"/>`)}
    <path d="M40 24l12 44 22-20z" fill="#c9962e" ${sw}/><path d="M120 24l-12 44-22-20z" fill="#c9962e" ${sw}/><path d="M46 34l7 22 10-9z" fill="#f2c9a0"/><path d="M114 34l-7 22-10-9z" fill="#f2c9a0"/>
    <path d="M42 80c0-30 18-48 38-48s38 18 38 48-16 42-38 42-38-12-38-42z" fill="#d9a441" ${sw}/>
    <path d="M56 86c6 20 14 28 24 28s18-8 24-28c-8 6-14 8-24 8s-16-2-24-8z" fill="#f4e6c4"/>
    <path d="M54 70l18 6M106 70l-18 6" stroke="${INK}" stroke-width="3.5"/>
    <path d="M58 82q8-6 16 0q-8 4-16 0zM86 82q8-6 16 0q-8 4-16 0z" fill="#f6e04a" ${sw} stroke-width="2"/><circle cx="66" cy="81" r="2" fill="${INK}"/><circle cx="94" cy="81" r="2" fill="${INK}"/>
    <ellipse cx="80" cy="96" rx="6" ry="4" fill="${INK}"/>
    <path class="mouth" d="M70 106q10 7 20 0" fill="#7a1f1a" ${sw}/>
    <path d="M60 98l-24-4M60 103l-24 3M100 98l24-4M100 103l24 3" stroke="${INK}" stroke-width="1.6"/>`,
  jinjiao: `
    ${robe("#7a1f1a", "#e6c25a", `<path d="M40 150h80M60 140v36M100 140v36" stroke="#e6c25a" stroke-width="3"/>`)}
    <path d="M44 78c0-28 16-46 36-46s36 18 36 46-14 44-36 44-36-16-36-44z" fill="#4f7fa8" ${sw}/>
    <path d="M73 38l7-32 7 32z" fill="#e6c25a" ${sw}/>
    <path d="M46 50c10-8 58-8 68 0" stroke="#e6c25a" stroke-width="8" fill="none"/><circle cx="80" cy="45" r="4" fill="#c23a2b"/>
    <path d="M50 64l24 8M110 64l-24 8" stroke="#c23a2b" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="64" cy="78" rx="7" ry="5" fill="#fff" ${sw}/><ellipse cx="96" cy="78" rx="7" ry="5" fill="#fff" ${sw}/><circle cx="64" cy="78" r="3" fill="${INK}"/><circle cx="96" cy="78" r="3" fill="${INK}"/>
    <path d="M76 84l4 10 4-10" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <path d="M50 98c6 34 18 46 30 46s24-12 30-46c-8 10-18 14-30 14s-22-4-30-14z" fill="#c23a2b" ${sw}/>
    <path class="mouth" d="M68 104q12 6 24 0" fill="#3a0f0c" ${sw}/>`,
  huli: `
    ${robe("#d9b44a", "#1b1a17", `<circle cx="80" cy="162" r="11" fill="#fff" ${sw} stroke-width="2"/><path d="M80 151a5.5 5.5 0 0 1 0 11a5.5 5.5 0 0 0 0 11a11 11 0 0 1 0-22z" fill="${INK}"/>`)}
    <path d="M44 78c0-28 16-46 36-46s36 18 36 46-14 44-36 44-36-16-36-44z" fill="#e8b46a" ${sw}/>
    <path d="M47 70l12 3M45 82h13M113 70l-12 3M115 82h-13M74 40l2 10M86 40l-2 10" stroke="#5a3a12" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M56 76q8-7 16 0q-8 5-16 0zM88 76q8-7 16 0q-8 5-16 0z" fill="#f2c94a" ${sw} stroke-width="2"/><path d="M64 72v8M96 72v8" stroke="${INK}" stroke-width="2.4"/>
    <path d="M74 88h12l-6 7z" fill="#5a3a12"/>
    <path d="M68 104q12 46 12 56q0-10 12-56c-4 4-8 6-12 6s-8-2-12-6z" fill="#efe8da" ${sw}/>
    <path class="mouth" d="M72 102q8 4 16 0" fill="none" ${sw}/>
    <path d="M58 40h44l-7-20H65z" fill="${INK}"/><path d="M52 32h56" stroke="#c9a24a" stroke-width="3.5"/>`,
  mouse: `
    ${robe("#9c7fb0", "#e6c25a", `<path d="M44 150q36 18 72 0" stroke="#e8dff0" stroke-width="2" fill="none"/>`)}
    <circle cx="46" cy="40" r="19" fill="#f4eef0" ${sw}/><circle cx="46" cy="40" r="10" fill="#f2b6c0"/><circle cx="114" cy="40" r="19" fill="#f4eef0" ${sw}/><circle cx="114" cy="40" r="10" fill="#f2b6c0"/>
    <path d="M38 84c-4-32 16-52 42-52s46 20 42 52c-8-18-24-26-42-26s-34 8-42 26z" fill="#e8e4ea" ${sw}/>
    <path d="M48 80c0-22 14-36 32-36s32 14 32 36-14 40-32 40-32-18-32-40z" fill="#fbf6f4" ${sw}/>
    <ellipse cx="67" cy="80" rx="4.5" ry="5.5" fill="${INK}"/><ellipse cx="93" cy="80" rx="4.5" ry="5.5" fill="${INK}"/><circle cx="68.5" cy="78" r="1.4" fill="#fff"/><circle cx="94.5" cy="78" r="1.4" fill="#fff"/>
    <ellipse cx="80" cy="94" rx="5.5" ry="4" fill="#e6c25a" ${sw} stroke-width="2"/>
    <path d="M64 96l-24-4M64 100l-24 3M96 96l24-4M96 100l24 3" stroke="#8a8a8a" stroke-width="1.4"/>
    <path class="mouth" d="M73 104q7 4 14 0" fill="#d97a8a" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="60" cy="94" rx="6" ry="3" fill="#f2a0b0" opacity=".55"/><ellipse cx="100" cy="94" rx="6" ry="3" fill="#f2a0b0" opacity=".55"/>
    <path d="M98 34l20-12" stroke="#e6c25a" stroke-width="3"/><circle cx="120" cy="21" r="4.5" fill="#c23a2b"/>`,
  abbot: `
    ${robe("#8d8a80", "#c9a24a", `<path d="M30 180L118 128l12 10L52 180z" fill="#b8322a" stroke="${INK}" stroke-width="2"/>`)}
    <path d="M46 76c0-26 16-42 34-42s34 16 34 42-14 42-34 42-34-16-34-42z" fill="#efd3b4" ${sw}/>
    ${[[70, 46], [80, 44], [90, 46], [75, 54], [85, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#a0785a"/>`).join("")}
    <path d="M58 72q7 4 14 0M88 72q7 4 14 0" stroke="${INK}" stroke-width="2.6" fill="none"/>
    <path d="M58 64q8-3 14 0M88 64q8-3 14 0" stroke="#bbb" stroke-width="3" fill="none"/>
    <path d="M78 76v10q2 2 4 0" stroke="${INK}" stroke-width="2" fill="none"/>
    <path class="mouth" d="M72 98q8 3 16 0" fill="none" ${sw}/>
    <circle cx="44" cy="80" r="6" fill="#efd3b4" ${sw}/><circle cx="116" cy="80" r="6" fill="#efd3b4" ${sw}/>`,
};
// the six-eared macaque: Wukong's double, darker, with three ears on each side
BUST.liuer = `<g fill="#6b4f37" ${sw} stroke-width="2.5"><circle cx="30" cy="58" r="9"/><circle cx="130" cy="58" r="9"/><circle cx="32" cy="96" r="9"/><circle cx="128" cy="96" r="9"/></g>` +
  BUST.wukong.replaceAll("#c98a3a", "#6b4f37").replaceAll("#e2a93b", "#8a6d3b").replace('<circle cx="69" cy="70" r="3" fill="#1b1a17"/>', '<circle cx="69" cy="70" r="3" fill="#b8322a"/>');

export const NAMES = {
  wukong: { ru: "Сунь Укун", en: "Sun Wukong", my: "ဆွန်ဝူခုန်း", zh: "孙悟空" },
  bajie: { ru: "Чжу Бацзе", en: "Zhu Bajie", my: "ကျူပါကျဲ", zh: "猪八戒" },
  sha: { ru: "Ша Сэн", en: "Sha Wujing", my: "ရှာဝူကျင်း", zh: "沙悟净" },
  tang: { ru: "Танский монах", en: "Tang Sanzang", my: "ထန်ဘုန်းကြီး", zh: "唐三藏" },
  baigu: { ru: "Белая Кость", en: "White Bone Demon", my: "အရိုးဖြူ နတ်ဆိုးမ", zh: "白骨精" },
  fan: { ru: "Принцесса Железный Веер", en: "Princess Iron Fan", my: "သံယပ်တောင် မင်းသမီး", zh: "铁扇公主" },
  spider: { ru: "Паучиха", en: "Spider Spirit", my: "ပင့်ကူ နတ်ဆိုးမ", zh: "蜘蛛精" },
  monk: { ru: "Даос Чжэньюань", en: "Master Zhenyuan", my: "ကျန်ယွမ်ဇီ ဆရာ", zh: "镇元子" },
  huangfeng: { ru: "Жёлтый Ветер", en: "Yellow Wind Demon", my: "လေဝါ နတ်ဆိုး", zh: "黄风怪" },
  jinjiao: { ru: "Золотой Рог", en: "Golden Horn", my: "ရွှေဦးချို", zh: "金角大王" },
  huli: { ru: "Даос Силы Тигра", en: "Tiger Power Immortal", my: "ကျားအား တာအိုဆရာ", zh: "虎力大仙" },
  liuer: { ru: "Шестиухая обезьяна", en: "Six-Eared Macaque", my: "နားခြောက်ဖက် မျောက်", zh: "六耳猕猴" },
  mouse: { ru: "Госпожа из-под Земли", en: "Lady Earth Flow", my: "မြေအောက် အရှင်မ", zh: "地涌夫人" },
  abbot: { ru: "Монах храма Цзиньгуан", en: "Monk of Golden Light Temple", my: "ရွှေအလင်းကျောင်း ဘုန်းကြီး", zh: "金光寺僧" },
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
  wind: { sky: ["#f1dca0", "#d9b062"], sun: "#c9852e", ranges: ["#d6b87a", "#b08a4a", "#6e5428"], deco: () => `<g stroke="#fff6dc" stroke-width="7" fill="none" opacity=".45" stroke-linecap="round"><path d="M80 300q160-70 320 0t320 0"/><path d="M700 220q140-60 280 0q60 30 100-10q20-30-10-40"/><path d="M200 470q200-60 400 0t300-20"/></g>` + pine(1320, 780, 1.2, "#4a3a20") },
  palace: { sky: ["#f2e2c4", "#e6c98e"], sun: "#c23a2b", ranges: ["#c9b48a", "#a08860", "#6a5638"], deco: () => `<g transform="translate(1000 600)"><rect x="-260" y="120" width="520" height="40" fill="#5a2a18"/><rect x="-220" y="40" width="440" height="90" fill="#a8321f"/><path d="M-270 50q270-90 540 0l-40 12h-460z" fill="#d9a43a" stroke="#5a3a12" stroke-width="4"/><rect x="-140" y="-30" width="280" height="70" fill="#a8321f"/><path d="M-180 -20q180-70 360 0l-30 10h-300z" fill="#d9a43a" stroke="#5a3a12" stroke-width="4"/>${[-180, -100, -20, 60, 140].map(x => `<rect x="${x}" y="60" width="40" height="70" fill="#5a1a10"/>`).join("")}</g>` },
  pagoda: { sky: ["#eef0e4", "#d6dcc6"], sun: "#d9a43a", ranges: ["#aab8a2", "#7d9474", "#4b6045"], deco: () => `<g transform="translate(1180 820)" fill="#3a2e24">${Array.from({ length: 9 }, (_, k) => `<path d="M${-90 + k * 8} ${-k * 52}h${180 - k * 16}l${18 - k}-14h${-216 + k * 18}z"/><rect x="${-60 + k * 6}" y="${-k * 52 - 52}" width="${120 - k * 12}" height="40" fill="#7a2a20"/>`).join("")}<path d="M0 -470v-60" stroke="#3a2e24" stroke-width="8"/></g>` + pine(240, 800, 1.4) },
  flat: { sky: ["#e9e4cf", "#cfd6c0"], sun: "#b03a6a", ranges: ["#a7b39a", "#748a6a", "#40543a"], deco: () => `<path d="M820 640l120-200h360l120 200z" fill="#40543a" opacity=".9"/><g transform="translate(1110 380)"><circle cy="30" r="34" fill="#b03a6a" opacity=".85"/><circle cy="-22" r="22" fill="#b03a6a" opacity=".85"/></g>` + pine(300, 790, 1.3) },
  pit: { sky: ["#cfc6c0", "#8f8682"], sun: "#6b5a52", ranges: ["#9a908a", "#6a605a", "#3a322e"], deco: () => `<path d="M560 900q0-320 240-320t240 320z" fill="#14110f" opacity=".9"/>${[620, 700, 780, 860, 940].map((x, k) => `<path d="M${x} ${600 + (k % 2) * 10}l14 ${50 + (k % 3) * 20}l14 -${50 + (k % 3) * 20}z" fill="#8a807a"/>`).join("")}` },
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
