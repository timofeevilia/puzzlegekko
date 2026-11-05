// Gekko Party art: the three hosts and the scenery, all inline SVG so the pack stays a folder of text files.

// The Conductor: a haunted railway lantern in a conductor's cap. Parts with class "mouth" move while he talks.
export const CONDUCTOR = `
<svg class="host-svg conductor" viewBox="0 0 240 340" aria-hidden="true">
  <defs>
    <radialGradient id="cgl" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#fff4b8" stop-opacity=".9"/><stop offset=".45" stop-color="#ffb84a" stop-opacity=".35"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient>
    <linearGradient id="cbr" x1="0" x2="1"><stop offset="0" stop-color="#ffd772"/><stop offset=".5" stop-color="#d89a32"/><stop offset="1" stop-color="#8f5a17"/></linearGradient>
    <radialGradient id="cfl" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#fffbe0"/><stop offset=".5" stop-color="#ffd24d"/><stop offset="1" stop-color="#ff7b1c"/></radialGradient>
    <linearGradient id="cgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2a12" stop-opacity=".35"/><stop offset=".6" stop-color="#ffcf6a" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a3a" stop-opacity=".4"/></linearGradient>
  </defs>
  <circle class="halo" cx="120" cy="200" r="120" fill="url(#cgl)"/>
  <path d="M86 70q34-52 68 0" fill="none" stroke="url(#cbr)" stroke-width="9" stroke-linecap="round"/>
  <g class="cap">
    <path d="M62 98q58-50 116 0v16H62z" fill="#262a55" stroke="#120d26" stroke-width="5" stroke-linejoin="round"/>
    <path d="M62 102h116" stroke="#ffd772" stroke-width="5"/>
    <path d="M52 114h136q-8 18-68 18t-68-18z" fill="#14122e" stroke="#120d26" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="120" cy="88" r="10" fill="#ffd772" stroke="#120d26" stroke-width="4"/>
    <path d="M115 88l5-5 5 5-5 5z" fill="#8f5a17"/>
  </g>
  <path d="M64 132h112l-16 22H80z" fill="url(#cbr)" stroke="#120d26" stroke-width="5" stroke-linejoin="round"/>
  <rect x="78" y="154" width="84" height="122" rx="12" fill="url(#cgs)" stroke="#120d26" stroke-width="5"/>
  <g class="flame">
    <path d="M120 170c24 22 34 44 30 64-3 22-16 34-30 34s-27-12-30-34c-4-20 6-42 30-64z" fill="url(#cfl)"/>
    <ellipse class="eye" cx="108" cy="222" rx="6" ry="9" fill="#3b1606"/>
    <ellipse class="eye" cx="132" cy="222" rx="6" ry="9" fill="#3b1606"/>
    <circle cx="110" cy="219" r="2" fill="#fff"/><circle cx="134" cy="219" r="2" fill="#fff"/>
    <path class="brow" d="M99 208l16 6M141 208l-16 6" stroke="#3b1606" stroke-width="4" stroke-linecap="round"/>
    <ellipse class="mouth" cx="120" cy="248" rx="10" ry="5" fill="#3b1606"/>
  </g>
  <path d="M100 154v122M140 154v122" stroke="#8f5a17" stroke-width="4" opacity=".75"/>
  <path d="M70 276h100l-12 24H82z" fill="url(#cbr)" stroke="#120d26" stroke-width="5" stroke-linejoin="round"/>
  <path d="M90 300h60v10H90z" fill="#6a3f10" stroke="#120d26" stroke-width="4"/>
  <g class="arm-l"><path d="M80 214c-24 6-34 26-40 46" fill="none" stroke="#120d26" stroke-width="7" stroke-linecap="round"/><circle cx="40" cy="262" r="11" fill="#f6f1e6" stroke="#120d26" stroke-width="4"/></g>
  <g class="arm-r"><path d="M160 214c24-4 36-24 42-40" fill="none" stroke="#120d26" stroke-width="7" stroke-linecap="round"/>
    <rect x="186" y="148" width="40" height="26" rx="4" fill="#efe2c0" stroke="#120d26" stroke-width="4" transform="rotate(-18 206 161)"/>
    <path d="M196 158h22M196 165h14" stroke="#b86a2a" stroke-width="3" transform="rotate(-18 206 161)"/>
    <circle cx="202" cy="176" r="11" fill="#f6f1e6" stroke="#120d26" stroke-width="4"/></g>
</svg>`;

// Gekko the Painter: a green gecko in a beret with a palette and brush.
export const PAINTER = `
<svg class="host-svg painter" viewBox="0 0 260 340" aria-hidden="true">
  <g stroke="#1d1233" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
    <path class="tail" d="M150 262c40 6 70-10 76-38 4-20-14-30-26-20-10 8-2 22 8 18" fill="none" stroke-width="16"/>
    <path class="tail" d="M150 262c40 6 70-10 76-38 4-20-14-30-26-20-10 8-2 22 8 18" fill="none" stroke="#6fd34a" stroke-width="9"/>
    <path d="M86 300l-14 22h28M160 300l14 22h-28" fill="#59b83a"/>
    <path d="M78 196c0-34 22-52 52-52s52 18 52 52v62c0 32-22 50-52 50s-52-18-52-50z" fill="#6fd34a"/>
    <ellipse cx="130" cy="248" rx="30" ry="42" fill="#c8f0a8" stroke="none"/>
    <circle cx="96" cy="210" r="5" fill="#f2c14e" stroke="none"/><circle cx="164" cy="226" r="4" fill="#f2c14e" stroke="none"/><circle cx="158" cy="186" r="3.5" fill="#f2c14e" stroke="none"/>
    <g class="head">
      <path d="M58 104c0-44 32-70 72-70s72 26 72 70c0 36-30 58-72 58s-72-22-72-58z" fill="#7ed957"/>
      <ellipse cx="98" cy="94" rx="20" ry="22" fill="#fff"/><ellipse cx="162" cy="94" rx="20" ry="22" fill="#fff"/>
      <circle class="pupil" cx="103" cy="97" r="10" fill="#1d1233" stroke="none"/><circle class="pupil" cx="167" cy="97" r="10" fill="#1d1233" stroke="none"/>
      <circle cx="107" cy="92" r="3.5" fill="#fff" stroke="none"/><circle cx="171" cy="92" r="3.5" fill="#fff" stroke="none"/>
      <path class="mouth" d="M104 132q26 18 52 0" fill="#7a1f3d"/>
      <ellipse cx="76" cy="122" rx="9" ry="5" fill="#ff6f91" opacity=".6" stroke="none"/><ellipse cx="184" cy="122" rx="9" ry="5" fill="#ff6f91" opacity=".6" stroke="none"/>
      <path d="M66 60c10-30 46-44 80-38 30 6 48 22 40 34-30-12-90-12-120 4z" fill="#e8434f"/>
      <path d="M128 22l4-12" />
      <circle cx="132" cy="8" r="6" fill="#e8434f"/>
    </g>
    <g class="arm-l"><path d="M80 214c-30 4-44 24-48 44" fill="none" stroke-width="12"/><path d="M80 214c-30 4-44 24-48 44" fill="none" stroke="#6fd34a" stroke-width="5"/>
      <path d="M2 254c0-18 22-28 44-22 18 5 22 20 10 28-6 4-2 12-12 16-18 6-42-4-42-22z" fill="#f3d9a8"/>
      <circle cx="18" cy="250" r="5" fill="#e8434f" stroke="none"/><circle cx="32" cy="244" r="5" fill="#2fb5ff" stroke="none"/><circle cx="44" cy="250" r="5" fill="#ffd23f" stroke="none"/><circle cx="24" cy="264" r="5" fill="#7a5cff" stroke="none"/></g>
    <g class="arm-r"><path d="M180 214c26-6 40-26 46-46" fill="none" stroke-width="12"/><path d="M180 214c26-6 40-26 46-46" fill="none" stroke="#6fd34a" stroke-width="5"/>
      <path d="M226 168l22-52" stroke-width="7"/><path d="M226 168l22-52" stroke="#c0843d" stroke-width="3"/>
      <path d="M244 124l8-18 6 4-6 18z" fill="#e8434f"/></g>
  </g>
</svg>`;

// Professor Hoot: a purple owl with round glasses, a bow tie and a mortarboard.
export const OWL = `
<svg class="host-svg owl" viewBox="0 0 260 330" aria-hidden="true">
  <g stroke="#1d1233" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M100 300l-8 18M112 300l2 18M148 300l-2 18M160 300l8 18" stroke="#ffb020" stroke-width="7"/>
    <path class="wing-l" d="M58 170c-30 20-34 70-10 100 10-30 22-56 26-84z" fill="#6c4fd6"/>
    <path class="wing-r" d="M202 170c30 20 34 70 10 100-10-30-22-56-26-84z" fill="#6c4fd6"/>
    <path d="M130 70c60 0 84 50 84 120 0 70-34 112-84 112s-84-42-84-112c0-70 24-120 84-120z" fill="#9a7bff"/>
    <path d="M130 170c30 0 46 26 46 62s-18 58-46 58-46-22-46-58 16-62 46-62z" fill="#d8ccff" stroke="none"/>
    <path d="M110 210q6 6 12 0M138 210q6 6 12 0M118 236q6 6 12 0M130 260q6 6 12 0M106 258q6 6 12 0" fill="none" stroke="#9a7bff" stroke-width="3"/>
    <path d="M60 90l-6-34 34 20M200 90l6-34-34 20" fill="#6c4fd6"/>
    <g class="head">
      <circle cx="96" cy="124" r="34" fill="#efe9ff"/><circle cx="164" cy="124" r="34" fill="#efe9ff"/>
      <circle class="pupil" cx="100" cy="126" r="15" fill="#1d1233" stroke="none"/><circle class="pupil" cx="160" cy="126" r="15" fill="#1d1233" stroke="none"/>
      <circle cx="106" cy="119" r="5" fill="#fff" stroke="none"/><circle cx="166" cy="119" r="5" fill="#fff" stroke="none"/>
      <circle cx="96" cy="124" r="30" fill="none" stroke="#ffcf3f" stroke-width="6"/><circle cx="164" cy="124" r="30" fill="none" stroke="#ffcf3f" stroke-width="6"/>
      <path d="M126 122h8" stroke="#ffcf3f" stroke-width="6"/>
      <path class="mouth" d="M120 150l10 18 10-18z" fill="#ffb020"/>
      <path d="M70 58l60-26 60 26-60 24z" fill="#262a55"/>
      <path d="M100 66v18q30 14 60 0V66" fill="#262a55"/>
      <path d="M182 62q10 18 4 40" fill="none" stroke="#ffcf3f" stroke-width="4"/><circle cx="186" cy="104" r="6" fill="#ffcf3f"/>
    </g>
    <path d="M108 186l22 10 22-10v22l-22-10-22 10z" fill="#e8434f"/>
    <circle cx="130" cy="197" r="6" fill="#b22a36"/>
  </g>
</svg>`;

// The PuzzleGekko mascot for the lobby and the menu
export const MASCOT = `
<svg class="host-svg mascot" viewBox="0 0 120 120" aria-hidden="true">
  <g fill="#7ed957" stroke="#0f2a20" stroke-width="3" stroke-linejoin="round">
    <path d="M60 18c9 0 15 7 15 15 0 6-3 10-6 13l2 22c1 9-3 18-11 22-8-4-12-13-11-22l2-22c-3-3-6-7-6-13 0-8 6-15 15-15z"/>
    <path d="M66 88c8 6 10 14 6 20-3 4-10 4-13 1 4-1 7-4 6-9-1-4-4-7-6-9z"/>
    <path d="M51 52 34 44l-6-9M69 52l17-8 6-9M52 76l-16 10-4 11M68 76l16 10 4 11" fill="none" stroke="#7ed957" stroke-width="7" stroke-linecap="round"/>
  </g>
  <circle cx="54" cy="29" r="3.2" fill="#0f2a20"/><circle cx="66" cy="29" r="3.2" fill="#0f2a20"/>
  <circle cx="60" cy="56" r="3" fill="#f2c14e"/><circle cx="56" cy="66" r="2.4" fill="#f2c14e"/><circle cx="64" cy="72" r="2.6" fill="#f2c14e"/>
</svg>`;

// ── The Last Train scenery: night landscape layers that scroll past the carriage windows
const hills = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="none"><path d="M0 300V190c80-40 150-70 240-40s140 60 230 20 170-90 270-60 150 80 240 60 150-50 220-30v160z" fill="#1f1640"/></svg>`;
const trees = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300"><g fill="#120c28"><path d="M0 300V230h900v70z"/><path d="M60 240l40-120 40 120zM90 240l40-150 40 150zM300 240l30-90 30 90zM330 240l45-160 45 160zM520 240l30-80 30 80zM640 240l40-130 40 130zM690 240l30-90 30 90zM820 240l35-110 35 110z"/><circle cx="460" cy="190" r="50"/><circle cx="430" cy="210" r="36"/><rect x="455" y="200" width="10" height="40"/></g></svg>`;
const poles = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 300"><g stroke="#08061a" fill="none"><path d="M120 300V40M90 60h60M95 80h50" stroke-width="10"/><path d="M0 70q350 50 700 0M0 92q350 50 700 0" stroke-width="3"/></g></svg>`;
const enc = s => `url('data:image/svg+xml,${encodeURIComponent(s)}')`;
export const TRAIN_LAYERS = { hills: enc(hills), trees: enc(trees), poles: enc(poles) };

// carriage wall with three window holes (even-odd fill), seats, luggage racks and hanging lamps
export const CARRIAGE = `
<svg class="carriage" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b1834"/><stop offset=".55" stop-color="#2c1029"/><stop offset="1" stop-color="#1a0818"/></linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3420"/><stop offset="1" stop-color="#3c1a10"/></linearGradient>
    <linearGradient id="seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d2340"/><stop offset="1" stop-color="#4a1126"/></linearGradient>
    <radialGradient id="lampg" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
    <pattern id="paper" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M30 8l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#4a2042" opacity=".55"/></pattern>
  </defs>
  <path fill-rule="evenodd" fill="url(#wall)" d="M0 0H1920V1080H0Z M110 120h460a40 40 0 0 1 40 40v300a40 40 0 0 1-40 40H110a40 40 0 0 1-40-40V160a40 40 0 0 1 40-40Z M750 120h420a40 40 0 0 1 40 40v300a40 40 0 0 1-40 40H750a40 40 0 0 1-40-40V160a40 40 0 0 1 40-40Z M1350 120h460a40 40 0 0 1 40 40v300a40 40 0 0 1-40 40h-460a40 40 0 0 1-40-40V160a40 40 0 0 1 40-40Z"/>
  <path fill-rule="evenodd" fill="url(#paper)" d="M0 0H1920V1080H0Z M110 120h460a40 40 0 0 1 40 40v300a40 40 0 0 1-40 40H110a40 40 0 0 1-40-40V160a40 40 0 0 1 40-40Z M750 120h420a40 40 0 0 1 40 40v300a40 40 0 0 1-40 40H750a40 40 0 0 1-40-40V160a40 40 0 0 1 40-40Z M1350 120h460a40 40 0 0 1 40 40v300a40 40 0 0 1-40 40h-460a40 40 0 0 1-40-40V160a40 40 0 0 1 40-40Z"/>
  <g fill="none" stroke="#c28a3a" stroke-width="14"><rect x="70" y="120" width="540" height="380" rx="40"/><rect x="710" y="120" width="500" height="380" rx="40"/><rect x="1310" y="120" width="540" height="380" rx="40"/></g>
  <g fill="none" stroke="#5c3512" stroke-width="5"><rect x="70" y="120" width="540" height="380" rx="40"/><rect x="710" y="120" width="500" height="380" rx="40"/><rect x="1310" y="120" width="540" height="380" rx="40"/><path d="M340 120v380M960 120v380M1580 120v380" stroke-width="10" stroke="#c28a3a"/></g>
  <g class="curtains" fill="#8a1f3a" stroke="#1a0818" stroke-width="4">
    <path d="M60 110h70c-10 110 10 250-30 400H60z"/><path d="M620 110h-70c10 110-10 250 30 400h40z"/>
    <path d="M1300 110h70c-10 110 10 250-30 400h-40z"/><path d="M1860 110h-70c10 110-10 250 30 400h40z"/>
  </g>
  <rect x="0" y="40" width="1920" height="26" fill="url(#wood)"/><path d="M0 66h1920" stroke="#c28a3a" stroke-width="5"/>
  <g stroke="#c28a3a" stroke-width="5"><path d="M0 40h1920"/><path d="M200 40v26M500 40v26M800 40v26M1120 40v26M1420 40v26M1720 40v26"/></g>
  <rect x="0" y="560" width="1920" height="40" fill="url(#wood)"/><path d="M0 560h1920M0 600h1920" stroke="#c28a3a" stroke-width="5"/>
  <path d="M0 600h1920v480H0z" fill="url(#wood)" opacity=".55"/>
  <g class="lamps">
    <g class="lamp" style="transform-origin:960px 0"><path d="M960 0v74" stroke="#c28a3a" stroke-width="4"/><path d="M930 74h60l-10 28h-40z" fill="#c28a3a" stroke="#1a0818" stroke-width="4"/><circle cx="960" cy="112" r="14" fill="#ffe7a1"/><path d="M560 104L960 104L1360 1080H560z" fill="url(#lampg)" opacity=".0"/></g>
  </g>
  <path d="M0 860h1920v220H0z" fill="url(#seat)"/><path d="M0 860h1920" stroke="#1a0818" stroke-width="6"/>
  <g stroke="#2a0614" stroke-width="4" opacity=".6"><path d="M240 860v220M480 860v220M720 860v220M960 860v220M1200 860v220M1440 860v220M1680 860v220"/></g>
  <path d="M0 830h1920v40H0z" fill="#5c1730" stroke="#1a0818" stroke-width="5"/>
</svg>`;

// a little train for the final run: engine on the right
export function trainTrack(n) {
  let cars = "";
  for (let i = 0; i < n; i++) cars += `<g transform="translate(${i * 150} 0)"><rect x="4" y="20" width="140" height="70" rx="10" fill="${i % 2 ? "#5c1730" : "#4a1126"}" stroke="#ffd772" stroke-width="4"/><rect x="22" y="34" width="40" height="28" rx="5" fill="#ffd772" opacity=".7"/><rect x="86" y="34" width="40" height="28" rx="5" fill="#ffd772" opacity=".7"/><circle cx="34" cy="96" r="12" fill="#14122e" stroke="#ffd772" stroke-width="3"/><circle cx="114" cy="96" r="12" fill="#14122e" stroke="#ffd772" stroke-width="3"/><text x="74" y="84" text-anchor="middle" font-size="14" fill="#ffd772" font-weight="800">${i + 1}</text></g>`;
  const engine = `<g transform="translate(${n * 150} 0)"><path d="M4 30h110l40 30v30H4z" fill="#262a55" stroke="#ffd772" stroke-width="4"/><rect x="20" y="0" width="34" height="34" fill="#262a55" stroke="#ffd772" stroke-width="4"/><path d="M100 30v-20h20v20" fill="#262a55" stroke="#ffd772" stroke-width="4"/><circle cx="150" cy="70" r="9" fill="#fff6b0"/><circle cx="34" cy="96" r="14" fill="#14122e" stroke="#ffd772" stroke-width="3"/><circle cx="110" cy="96" r="14" fill="#14122e" stroke="#ffd772" stroke-width="3"/><g class="smoke"><circle cx="110" cy="-6" r="10" fill="#bbb3d6" opacity=".6"/><circle cx="124" cy="-22" r="14" fill="#bbb3d6" opacity=".4"/></g></g>`;
  return `<svg class="track-svg" viewBox="-10 -40 ${n * 150 + 190} 160" aria-hidden="true"><path d="M-10 110H${n * 150 + 180}" stroke="#8f7ab8" stroke-width="5"/><path d="M-10 118H${n * 150 + 180}" stroke="#8f7ab8" stroke-width="3" stroke-dasharray="14 16"/>${cars}${engine}</svg>`;
}

// ── Doodle Lies scenery: doodles in the margins of the paper
export const DOODLES = `
<svg class="doodles" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" opacity=".55">
    <path d="M90 140l14 30 32 4-24 22 6 32-28-16-28 16 6-32-24-22 32-4z" stroke="#e8434f"/>
    <path d="M1780 120c40-30 90 10 60 50s-90 0-50-30" stroke="#2fb5ff"/>
    <path d="M1720 900q30-40 60 0t60 0 60 0" stroke="#7a5cff"/>
    <path d="M120 900c20-60 120-60 120 0s-100 60-100 0 60-40 60 0" stroke="#ffb020"/>
    <path d="M1650 300l40 20-40 20M1690 320h-80" stroke="#2fc47e"/>
    <path d="M230 470q20 20 0 40t0 40" stroke="#ff5fa2"/>
    <circle cx="1810" cy="560" r="26" stroke="#ffb020"/><path d="M1810 520v-16M1810 616v-16M1770 560h-16M1866 560h-16" stroke="#ffb020"/>
  </g>
</svg>`;
