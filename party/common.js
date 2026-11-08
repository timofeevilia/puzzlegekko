// Gekko Party: shared by the big screen (host.js) and the phones (play.js).

// ── interface text: key → [English, Russian, Burmese]
const UI = {
  brand: ["Gekko Party", "Гекко Пати", "ဂက်ကို ပါတီ"],
  tag: ["Party games for your phones and one big screen", "Игры для компании: телефоны и один большой экран", "ဖုန်းတွေနဲ့ စခရင်ကြီးတစ်ခုနဲ့ ကစားတဲ့ ပါတီဂိမ်းများ"],
  hostBtn: ["Host on this screen", "Запустить на этом экране", "ဒီစခရင်မှာ စမယ်"],
  hostHint: ["A TV, laptop or tablet everyone can see", "Телевизор, ноутбук или планшет, который видят все", "အားလုံးမြင်နိုင်တဲ့ တီဗီ၊ လက်ပ်တော့ ဒါမှမဟုတ် တက်ဘလက်"],
  joinBtn: ["Join", "Войти", "ဝင်မယ်"],
  joinTitle: ["Join a game", "Войти в игру", "ဂိမ်းထဲ ဝင်မယ်"],
  code: ["Room code", "Код комнаты", "အခန်းကုဒ်"],
  name: ["Your name", "Ваше имя", "သင့်နာမည်"],
  critter: ["Pick your critter", "Выберите зверька", "ကိုယ့်ရုပ်ပုံလေး ရွေးပါ"],
  lang: ["Your language", "Ваш язык", "သင့်ဘာသာစကား"],
  noRoom: ["No game with this code", "Игры с таким кодом нет", "ဒီကုဒ်နဲ့ ဂိမ်းမရှိပါ"],
  full: ["This room is full", "Комната заполнена", "ဒီအခန်း ပြည့်သွားပြီ"],
  started: ["The game has already started. Wait for the next one.", "Игра уже идёт. Дождитесь следующей.", "ဂိမ်း စနေပြီ။ နောက်တစ်ပွဲကို စောင့်ပါ။"],
  pickVersion: ["Who's playing tonight?", "Кто сегодня играет?", "ဒီည ဘယ်သူတွေ ကစားမလဲ။"],
  vPair: ["For two", "Для двоих", "နှစ်ယောက်အတွက်"],
  vPairD: ["Russian + Burmese. Each phone speaks its owner's language.", "Русский + бирманский. Каждый телефон говорит на языке хозяина.", "ရုရှား + မြန်မာ။ ဖုန်းတစ်လုံးချင်းက ပိုင်ရှင်ရဲ့ ဘာသာနဲ့ ပြတယ်။"],
  vEn: ["Party · English", "Компания · English", "အဖွဲ့ · English"],
  vEnD: ["3–8 players, everything in English.", "3–8 игроков, всё на английском.", "၃–၈ ယောက်၊ အင်္ဂလိပ်လို အကုန်။"],
  vRu: ["Party · Русский", "Компания · Русский", "အဖွဲ့ · Русский"],
  vRuD: ["3–8 players, everything in Russian.", "3–8 игроков, всё по-русски.", "၃–၈ ယောက်၊ ရုရှားလို အကုန်။"],
  joinAt: ["Join on your phone", "Заходите с телефона", "ဖုန်းကနေ ဝင်ပါ"],
  scan: ["or scan", "или отсканируйте", "ဒါမှမဟုတ် စကင်ဖတ်ပါ"],
  waitingFor: ["Waiting for players…", "Ждём игроков…", "ကစားသမားတွေကို စောင့်နေတယ်…"],
  vip: ["VIP", "VIP", "VIP"],
  vipHint: ["The VIP starts each game from their phone", "VIP запускает игры со своего телефона", "VIP က သူ့ဖုန်းကနေ ဂိမ်းတွေကို စတယ်"],
  start: ["Everybody's in!", "Все в сборе!", "အားလုံး ရောက်ပြီ!"],
  needMore: ["Waiting for at least {n} players", "Нужно хотя бы {n} игрока", "အနည်းဆုံး {n} ယောက် လိုတယ်"],
  youIn: ["You're in!", "Вы в игре!", "ဝင်ပြီးပြီ!"],
  watch: ["Look at the big screen", "Смотрите на большой экран", "စခရင်ကြီးကို ကြည့်ပါ"],
  waitOthers: ["Waiting for the others…", "Ждём остальных…", "တခြားသူတွေကို စောင့်နေတယ်…"],
  sent: ["Sent!", "Отправлено!", "ပို့ပြီးပြီ!"],
  send: ["Send", "Отправить", "ပို့မယ်"],
  pickGame: ["Pick a game", "Выберите игру", "ဂိမ်း ရွေးပါ"],
  vipPicks: ["The VIP is picking a game", "VIP выбирает игру", "VIP က ဂိမ်း ရွေးနေတယ်"],
  back: ["Menu", "Меню", "မီနူး"],
  sound: ["Sound", "Звук", "အသံ"],
  voice: ["Host voice", "Голос ведущего", "အစီအစဉ်တင်ဆက်သူအသံ"],
  fullscreen: ["Full screen", "Во весь экран", "စခရင်အပြည့်"],
  scores: ["Scores", "Счёт", "ရမှတ်များ"],
  final: ["Final scores", "Итоговый счёт", "နောက်ဆုံး ရမှတ်များ"],
  playAgain: ["Pick the next game", "Выбрать следующую игру", "နောက်ဂိမ်း ရွေးမယ်"],
  winner: ["wins!", "побеждает!", "နိုင်ပြီ!"],
  pts: ["pts", "очк.", "မှတ်"],
  correct: ["Correct!", "Верно!", "မှန်တယ်!"],
  wrong: ["Wrong!", "Неверно!", "မှားတယ်!"],
  you: ["you", "вы", "သင်"],
  react: ["Send a reaction", "Реакция", "တုံ့ပြန်မှု ပို့မယ်"],
  reconnect: ["Connecting…", "Подключаемся…", "ချိတ်ဆက်နေတယ်…"],
  noFirebase: ["Online play needs Firebase. See the README.", "Для игры онлайн нужен Firebase, см. README.", "အွန်လိုင်းကစားဖို့ Firebase လိုတယ်။"],
  min2: ["2 players", "2 игрока", "၂ ယောက်"],
  p38: ["3–8 players", "3–8 игроков", "၃–၈ ယောက်"],
  // The Last Train
  trName: ["The Last Train", "Последний поезд", "နောက်ဆုံးရထား"],
  trTag: ["Trivia on a haunted night train. Wrong answers lead to deadly trials.", "Викторина в поезде с привидениями. Ошибёшься — пройдёшь смертельное испытание.", "သရဲရထားပေါ်က အမေးအဖြေ။ မှားရင် အသက်နဲ့ရင်းရတဲ့ စမ်းသပ်ချက် ရှိတယ်။"],
  trIntro: ["Tickets, please! Answer my questions. Get one wrong… and you face a trial. Lose the trial, and you ride with me forever.", "Билетики, пожалуйста! Отвечайте на мои вопросы. Ошибётесь — пройдёте испытание. Провалите его — и останетесь в этом поезде навсегда.", "လက်မှတ်ပြပါ! ကျွန်ုပ်ရဲ့ မေးခွန်းတွေကို ဖြေပါ။ မှားရင် စမ်းသပ်ချက် ခံရမယ်။ ရှုံးရင် ဒီရထားပေါ်မှာ ထာဝရ နေရမယ်။"],
  conductor: ["The Conductor", "Кондуктор", "လက်မှတ်စစ်"],
  question: ["Question", "Вопрос", "မေးခွန်း"],
  of: ["of", "из", "/"],
  wrongTrial: ["Wrong answers go to a trial", "Кто ошибся — на испытание", "မှားတဲ့သူတွေ စမ်းသပ်ချက် ခံရမယ်"],
  allRight: ["Everyone survives this stop!", "На этой станции выжили все!", "ဒီဘူတာမှာ အားလုံး အသက်ရှင်တယ်!"],
  trial: ["Trial", "Испытание", "စမ်းသပ်ချက်"],
  condemned: ["On trial", "На испытании", "စမ်းသပ်ခံရသူ"],
  died: ["didn't make it", "не выжил(а)", "မလွတ်တော့ဘူး"],
  survived: ["survived", "выжил(а)", "လွတ်မြောက်သွားတယ်"],
  youDied: ["You died… but ghosts still play!", "Вы погибли… но призраки играют дальше!", "သင် သေသွားပြီ… ဒါပေမယ့် သရဲတွေလည်း ဆက်ကစားလို့ရတယ်!"],
  ghost: ["Ghost", "Призрак", "သရဲ"],
  ghostHint: ["Right answers earn ghost tickets for the final run", "Верные ответы дают билеты призрака для финала", "မှန်ရင် နောက်ဆုံးပွဲအတွက် သရဲလက်မှတ် ရမယ်"],
  ticket: ["ghost ticket", "билет призрака", "သရဲလက်မှတ်"],
  safe: ["You're safe. Watch the trial!", "Вы в безопасности. Смотрите испытание!", "သင် လွတ်တယ်။ စမ်းသပ်ချက်ကို ကြည့်ပါ!"],
  finalRun: ["Final: run to the engine!", "Финал: бегом к локомотиву!", "နောက်ဆုံးပွဲ: စက်ခေါင်းဆီ ပြေး!"],
  finalRules: ["Tap everything that fits the category. Each right pick moves you one carriage forward, each wrong one back. First to the engine escapes!", "Отметьте всё, что подходит к категории. Каждый верный выбор — вагон вперёд, неверный — назад. Кто первым добежит до локомотива, спасётся!", "အမျိုးအစားနဲ့ ကိုက်တာ အားလုံးကို နှိပ်ပါ။ မှန်ရင် တစ်တွဲ ရှေ့တိုး၊ မှားရင် နောက်ဆုတ်။ စက်ခေါင်းကို အရင်ရောက်သူ လွတ်မြောက်မယ်!"],
  pickFit: ["Tap everything that fits", "Отметьте всё подходящее", "ကိုက်တာ အားလုံးကို နှိပ်ပါ"],
  escaped: ["escaped the train!", "сбежал(а) с поезда!", "ရထားပေါ်က လွတ်မြောက်သွားပြီ!"],
  t_seats: ["Rickety Seats", "Шаткие сиденья", "လှုပ်နေတဲ့ ထိုင်ခုံများ"],
  t_seatsR: ["Pick a seat. Two of them will collapse.", "Выберите сиденье. Два из них провалятся.", "ထိုင်ခုံတစ်ခု ရွေးပါ။ နှစ်ခုက ကျိုးကျသွားမယ်။"],
  t_math: ["Ticket Maths", "Билетная арифметика", "လက်မှတ်သင်္ချာ"],
  t_mathR: ["Solve {n} sums in 20 seconds or stay on the train.", "Решите {n} примеров за 20 секунд, иначе останетесь в поезде.", "စက္ကန့် ၂၀ အတွင်း ပုစ္ဆာ {n} ပုဒ် တွက်ပါ။"],
  t_lamps: ["Signal Lamps", "Сигнальные фонари", "အချက်ပြမီးများ"],
  t_lampsR: ["Watch the lamps, then repeat the order.", "Запомните, как мигают фонари, и повторите.", "မီးတွေ လင်းတဲ့ အစဉ်ကို မှတ်ပြီး ပြန်လုပ်ပါ။"],
  t_brake: ["Pull the Brake", "Стоп-кран", "ဘရိတ်ဆွဲ"],
  t_brakeR: ["Stop the needle in the green zone. Hit 2 out of 3.", "Остановите стрелку в зелёной зоне. Нужно 2 попадания из 3.", "အပ်ကို အစိမ်းရောင်ထဲမှာ ရပ်ပါ။ ၃ ကြိမ်မှာ ၂ ကြိမ် ထိရမယ်။"],
  seat: ["Seat", "Место", "ထိုင်ခုံ"],
  tapStop: ["STOP!", "СТОП!", "ရပ်!"],
  repeat: ["Now repeat", "Теперь повторите", "အခု ပြန်လုပ်ပါ"],
  remember: ["Remember…", "Запоминайте…", "မှတ်ထား…"],
  solved: ["solved", "решено", "တွက်ပြီး"],
  hits: ["hits", "попадания", "ထိ"],
  // Doodle Lies
  ddName: ["Doodle Lies", "Каракули и враки", "ပုံခြစ်နဲ့ လိမ်ညာ"],
  ddTag: ["Draw something weird. Everyone invents a fake title, then hunts for the real one.", "Нарисуйте странное. Все придумывают фальшивые названия и ищут настоящее.", "ထူးဆန်းတာ ဆွဲပါ။ လူတိုင်း အတုခေါင်းစဉ် ထွင်ပြီး အမှန်ကို ရှာကြမယ်။"],
  ddTagPair: ["Draw for each other and guess the real title.", "Рисуйте друг для друга и угадывайте название.", "တစ်ယောက်အတွက်တစ်ယောက် ဆွဲပြီး ခေါင်းစဉ်အမှန်ကို ခန့်မှန်းပါ။"],
  painter: ["Gekko the Painter", "Художник Гекко", "ပန်းချီဆရာ ဂက်ကို"],
  ddIntro: ["Grab your phone, it's a canvas now! Draw your secret title. Then we'll see who can tell art from lies.", "Телефон теперь холст! Нарисуйте своё секретное название. Потом посмотрим, кто отличит искусство от вранья.", "ဖုန်းက အခု ပန်းချီကားချပ် ဖြစ်သွားပြီ! ကိုယ့်လျှို့ဝှက်ခေါင်းစဉ်ကို ဆွဲပါ။ ပြီးရင် အနုပညာနဲ့ လိမ်တာကို ဘယ်သူ ခွဲနိုင်လဲ ကြည့်မယ်။"],
  ddIntroPair: ["Draw your secret title on the phone. Your partner picks the real title from four.", "Нарисуйте секретное название на телефоне. Партнёр выберет настоящее из четырёх.", "ဖုန်းပေါ်မှာ လျှို့ဝှက်ခေါင်းစဉ်ကို ဆွဲပါ။ တစ်ဖက်လူက လေးခုထဲက အမှန်ကို ရွေးမယ်။"],
  drawThis: ["Draw this", "Нарисуйте", "ဒါကို ဆွဲပါ"],
  drawing: ["Everyone is drawing…", "Все рисуют…", "အားလုံး ပုံဆွဲနေကြတယ်…"],
  undo: ["Undo", "Отменить", "နောက်ပြန်"],
  clear: ["Clear", "Стереть", "ဖျက်"],
  done: ["Done", "Готово", "ပြီးပြီ"],
  writeLie: ["Write a fake title for this drawing", "Придумайте фальшивое название", "ဒီပုံအတွက် အတုခေါင်းစဉ် ရေးပါ"],
  tooClose: ["That's too close to the real title! Try another.", "Слишком похоже на настоящее! Придумайте другое.", "အမှန်နဲ့ နီးလွန်းတယ်! တခြားဟာ ရေးပါ။"],
  yourDrawing: ["That's your drawing! Look at their lies.", "Это ваш рисунок! Смотрите, что они врут.", "ဒါ သင့်ပုံပဲ! သူတို့ လိမ်တာကို ကြည့်ပါ။"],
  findTruth: ["Which one is the real title?", "Какое название настоящее?", "ဘယ်ဟာက တကယ့်ခေါင်းစဉ်လဲ။"],
  truth: ["The truth", "Правда", "အမှန်"],
  lieBy: ["a lie by", "враньё от", "လိမ်သူ"],
  fooled: ["fooled", "обманул(а)", "လှည့်စားနိုင်ခဲ့"],
  foundIt: ["found the truth", "нашли правду", "အမှန်ကို တွေ့တယ်"],
  nobody: ["Nobody", "Никто", "ဘယ်သူမှ"],
  // Ballpark
  bpName: ["Ballpark", "Примерно", "ခန့်မှန်းကြည့်"],
  bpTag: ["Guess the number, then bet on whose guess is closest.", "Угадайте число и поставьте на того, кто ближе всех.", "ဂဏန်းကို ခန့်မှန်းပြီး ဘယ်သူ အနီးဆုံးလဲ လောင်းပါ။"],
  owl: ["Professor Hoot", "Профессор Ух", "ဇီးကွက်ဆရာ"],
  bpIntro: ["Nobody knows exactly. That's the fun! Type your best guess, then bet on whoever you think is closest.", "Точно не знает никто, в этом и весь смысл! Напишите свою догадку, а потом поставьте на того, кто, по-вашему, ближе всех.", "ဘယ်သူမှ အတိအကျ မသိဘူး။ အဲဒါက ပျော်စရာပဲ! ကိုယ့်ခန့်မှန်းချက် ရိုက်ပြီး အနီးဆုံးလို့ ထင်တဲ့သူကို လောင်းပါ။"],
  yourGuess: ["Your guess", "Ваша догадка", "သင့်ခန့်မှန်းချက်"],
  betOn: ["Who's closest? Bet on a guess", "Кто ближе? Поставьте на ответ", "ဘယ်သူ အနီးဆုံးလဲ။ လောင်းပါ"],
  closest: ["Closest", "Ближе всех", "အနီးဆုံး"],
  exact: ["Exactly right!", "Точно в цель!", "အတိအကျ မှန်တယ်!"],
  answerIs: ["The answer is", "Правильный ответ", "အဖြေက"],
  goodBet: ["good bet", "верная ставка", "လောင်းတာ မှန်တယ်"],
  // Quick Sketch
  qsName: ["Quick Sketch", "Быстрый карандаш", "အမြန်ပုံဆွဲ"],
  qsTag: ["One draws live, everyone races to guess. The faster you guess, the more you score.", "Один рисует вживую, остальные наперегонки угадывают. Чем быстрее, тем больше очков.", "တစ်ယောက်က တိုက်ရိုက်ဆွဲပြီး ကျန်သူတွေက အပြိုင်ခန့်မှန်းကြတယ်။ မြန်လေ ရမှတ်များလေ။"],
  qsIntro: ["One of you draws, live on the big screen. Everyone else picks the answer on their phone. Speed is everything!", "Один рисует, прямо на большом экране. Остальные выбирают ответ на телефоне. Решает скорость!", "တစ်ယောက်က စခရင်ကြီးပေါ်မှာ တိုက်ရိုက်ဆွဲမယ်။ ကျန်သူတွေက ဖုန်းမှာ အဖြေရွေးပါ။ မြန်ဖို့ အရေးကြီးတယ်!"],
  youDraw: ["You're drawing! Everyone is watching", "Рисуете вы! Все смотрят", "သင်ဆွဲရမယ်! အားလုံး ကြည့်နေတယ်"],
  guessIt: ["What is being drawn?", "Что рисуют?", "ဘာဆွဲနေလဲ။"],
  theWord: ["It was", "Это было", "အဖြေက"],
  guessed: ["guessed it", "угадали", "မှန်ခဲ့တယ်"],
  // Copycat
  ccName: ["Copycat", "Копия копии", "ကူးပြီးကူး"],
  ccTag: ["Look at a drawing for six seconds, then redraw it from memory. Pass it on and watch it mutate.", "Шесть секунд смотрите на рисунок, потом рисуете по памяти. Передаёте дальше и смотрите, во что он превратится.", "ပုံကို ခြောက်စက္ကန့် ကြည့်ပြီး မှတ်မိသလို ပြန်ဆွဲပါ။ ဆက်ပေးပြီး ဘာဖြစ်သွားလဲ ကြည့်ပါ။"],
  ccIntro: ["Everyone starts with a secret title. Then the drawings go round: look, memorise, redraw. At the end, guess what the very first one was!", "Каждый начинает с секретной темы. Потом рисунки идут по кругу: смотрите, запоминаете, перерисовываете. В конце угадайте, что было в самом начале!", "လူတိုင်း လျှို့ဝှက်ခေါင်းစဉ်နဲ့ စမယ်။ ပြီးရင် ပုံတွေ လှည့်ပတ်သွားမယ် — ကြည့်၊ မှတ်၊ ပြန်ဆွဲ။ နောက်ဆုံးမှာ အစက ဘာလဲ ခန့်မှန်းပါ!"],
  drawOrig: ["Draw your secret title", "Нарисуйте свою секретную тему", "သင့်လျှို့ဝှက်ခေါင်းစဉ်ကို ဆွဲပါ"],
  memorise: ["Memorise this drawing!", "Запомните рисунок!", "ဒီပုံကို မှတ်ထားပါ!"],
  copyIt: ["Now draw it from memory", "Теперь нарисуйте по памяти", "အခု မှတ်မိသလို ပြန်ဆွဲပါ"],
  copying: ["Everyone is copying…", "Все перерисовывают…", "အားလုံး ပြန်ဆွဲနေကြတယ်…"],
  step: ["Step", "Шаг", "အဆင့်"],
  guessOrig: ["What was the very first title?", "Какая была самая первая тема?", "အစဆုံး ခေါင်းစဉ်က ဘာလဲ။"],
  original: ["Original", "Оригинал", "မူရင်း"],
  yourChain: ["This chain started with you. Watch them guess!", "Эта цепочка началась с вас. Смотрите, как угадывают!", "ဒီကွင်းဆက်က သင်နဲ့ စခဲ့တာ။ သူတို့ ခန့်မှန်းတာ ကြည့်ပါ!"],
  // reactions
};
export const LANG_NAMES = { en: "English", ru: "Русский", my: "မြန်မာ" };

export function L(key, lang = "en", vars) {
  const row = UI[key]; if (!row) return key;
  let s = row[{ en: 0, ru: 1, my: 2 }[lang] ?? 0] || row[0];
  if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
}
// languages shown on the big screen for each version
export const hostLangs = ver => ver === "pair" ? ["ru", "my"] : [ver];
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// a {en,ru,my} object (or a UI key) as HTML in the host's languages: the second language goes in a smaller line
export function HT(x, ver, vars) {
  const langs = hostLangs(ver);
  const one = l => esc(typeof x === "string" ? L(x, l, vars) : x[l]);
  if (langs.length === 1) return one(langs[0]);
  return `<span class="l1" lang="ru">${one("ru")}</span><span class="l2" lang="my">${one("my")}</span>`;
}

// ── small utilities
export const shuffle = (a, rnd = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
export function seeded(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
export const norm = s => String(s || "").toLowerCase().normalize("NFKC").replace(/ё/g, "е").replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").trim();
export function lev(a, b) {
  if (a === b) return 0; const m = a.length, n = b.length; if (!m || !n) return m || n;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
}
// a lie counts as "the truth" when it is the same words give or take a typo or an article
export function tooClose(lie, truth) {
  const strip = s => norm(s).replace(/^(a|an|the) /, "");
  const a = strip(lie), b = strip(truth);
  if (!a) return false;
  return a === b || lev(a, b) <= Math.max(1, Math.floor(b.length / 8));
}
export const fmtNum = (n, lang) => {
  const s = Number(n).toLocaleString(lang === "ru" ? "ru-RU" : "en-US", { maximumFractionDigits: 3 });
  return lang === "my" ? s.replace(/[0-9]/g, d => "၀၁၂၃၄၅၆၇၈၉"[d]) : s;
};

// ── critters: 12 player avatars drawn as SVG, one look per index
export const CRITTERS = [
  { n: "Gekko", c: "#7ed957", body: "tall", top: "crest", eyes: "big", pat: "spots" },
  { n: "Mango", c: "#ffb020", body: "pear", top: "leaf", eyes: "dots", pat: "blush" },
  { n: "Frog", c: "#2fc47e", body: "squat", top: "frog", eyes: "frog", pat: "belly" },
  { n: "Cat", c: "#ff7a59", body: "round", top: "cat", eyes: "big", pat: "whisk" },
  { n: "Owl", c: "#9a7bff", body: "round", top: "tuft", eyes: "owl", pat: "belly" },
  { n: "Durian", c: "#c8d93a", body: "round", top: "spikes", eyes: "dots", pat: "blush" },
  { n: "Blip", c: "#ff5fa2", body: "tall", top: "antenna", eyes: "cyc", pat: "belly" },
  { n: "Crab", c: "#ff4d4d", body: "squat", top: "claws", eyes: "stalk", pat: "none" },
  { n: "Bear", c: "#c27c4a", body: "round", top: "bear", eyes: "dots", pat: "muzzle" },
  { n: "Bun", c: "#d9ccff", body: "pear", top: "bunny", eyes: "big", pat: "blush" },
  { n: "Tiger", c: "#ff9a1f", body: "round", top: "cat", eyes: "dots", pat: "stripes" },
  { n: "Fish", c: "#2fb5ff", body: "round", top: "fins", eyes: "big", pat: "scales" },
];
const INK = "#1d1233";
const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f))); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; };

export function critter(i, mood = "idle") {
  const k = CRITTERS[((i % 12) + 12) % 12], c = k.c, dk = shade(c, .72), lt = shade(c, 1.25);
  const sw = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const bodies = {
    round: `<ellipse cx="0" cy="10" rx="36" ry="34" fill="${c}" ${sw}/>`,
    pear: `<path d="M0-28C22-28 30-8 34 14C38 36 20 44 0 44S-38 36-34 14C-30-8-22-28 0-28Z" fill="${c}" ${sw}/>`,
    tall: `<rect x="-28" y="-30" width="56" height="74" rx="26" fill="${c}" ${sw}/>`,
    squat: `<ellipse cx="0" cy="16" rx="40" ry="28" fill="${c}" ${sw}/>`,
  };
  const topY = { round: -22, pear: -26, tall: -28, squat: -8 }[k.body];
  let back = "", front = "";
  switch (k.top) {
    case "crest": back = `<path d="M-14 ${topY + 4}l5-12 5 9 4-12 4 12 5-9 5 12" fill="${dk}" ${sw}/>`; break;
    case "leaf": back = `<path d="M0 ${topY + 2}v-10" ${sw} fill="none"/><path d="M1 ${topY - 6}c8-10 20-8 22-4-6 8-16 9-22 4z" fill="#3fae4a" ${sw}/>`; break;
    case "frog": back = `<circle cx="-18" cy="${topY - 4}" r="14" fill="${c}" ${sw}/><circle cx="18" cy="${topY - 4}" r="14" fill="${c}" ${sw}/>`; break;
    case "cat": back = `<path d="M-30 ${topY + 14}l2-26 20 14z" fill="${c}" ${sw}/><path d="M30 ${topY + 14}l-2-26-20 14z" fill="${c}" ${sw}/><path d="M-26 ${topY + 6}l1-10 8 6z" fill="${dk}"/><path d="M26 ${topY + 6}l-1-10-8 6z" fill="${dk}"/>`; break;
    case "tuft": back = `<path d="M-30 ${topY + 12}l-4-22 18 12z" fill="${dk}" ${sw}/><path d="M30 ${topY + 12}l4-22-18 12z" fill="${dk}" ${sw}/>`; break;
    case "spikes": { let p = ""; for (let a = -170; a <= -10; a += 20) { const r = Math.PI * a / 180, x = Math.cos(r), y = Math.sin(r); p += `<path d="M${(x * 30).toFixed(1)} ${(10 + y * 28).toFixed(1)}L${(x * 44).toFixed(1)} ${(10 + y * 42).toFixed(1)}L${(Math.cos(r + .2) * 32).toFixed(1)} ${(10 + Math.sin(r + .2) * 30).toFixed(1)}z" fill="${dk}" ${sw}/>`; } back = p; break; }
    case "antenna": back = `<path d="M0 ${topY - 2}q6-14-4-22" ${sw} fill="none"/><circle cx="-4" cy="${topY - 25}" r="6" fill="#ffe14d" ${sw}/>`; break;
    case "claws": back = `<path d="M-38 10c-14-6-16-24-6-30 2 8 8 10 12 6 6 6 2 18-6 24z" fill="${c}" ${sw}/><path d="M38 10c14-6 16-24 6-30-2 8-8 10-12 6-6 6-2 18 6 24z" fill="${c}" ${sw}/>`; break;
    case "bear": back = `<circle cx="-25" cy="${topY + 2}" r="11" fill="${c}" ${sw}/><circle cx="25" cy="${topY + 2}" r="11" fill="${c}" ${sw}/><circle cx="-25" cy="${topY + 2}" r="5" fill="${dk}"/><circle cx="25" cy="${topY + 2}" r="5" fill="${dk}"/>`; break;
    case "bunny": back = `<ellipse cx="-13" cy="${topY - 16}" rx="8" ry="22" fill="${c}" ${sw} transform="rotate(-10 -13 ${topY - 16})"/><ellipse cx="13" cy="${topY - 16}" rx="8" ry="22" fill="${c}" ${sw} transform="rotate(10 13 ${topY - 16})"/><ellipse cx="-13" cy="${topY - 14}" rx="3.5" ry="14" fill="#ff9ec7" transform="rotate(-10 -13 ${topY - 14})"/><ellipse cx="13" cy="${topY - 14}" rx="3.5" ry="14" fill="#ff9ec7" transform="rotate(10 13 ${topY - 14})"/>`; break;
    case "fins": back = `<path d="M-8 ${topY + 2}q8-20 22-12-4 8-8 14z" fill="${dk}" ${sw}/><path d="M-36 14q-14-2-12 12 8 0 12-4z" fill="${dk}" ${sw}/><path d="M36 14q14-2 12 12-8 0-12-4z" fill="${dk}" ${sw}/>`; break;
  }
  let pat = "";
  switch (k.pat) {
    case "spots": pat = `<circle cx="-14" cy="22" r="4" fill="#f2c14e"/><circle cx="12" cy="30" r="3" fill="#f2c14e"/><circle cx="16" cy="14" r="2.5" fill="#f2c14e"/>`; break;
    case "belly": pat = `<ellipse cx="0" cy="${k.body === "squat" ? 24 : 24}" rx="20" ry="14" fill="${lt}" opacity=".9"/>`; break;
    case "stripes": pat = `<path d="M-34 4h10M-35 16h9M34 4h-10M35 16h-9M0-23v8M-8-22v6M8-22v6" ${sw} stroke="${INK}" fill="none"/>`; break;
    case "muzzle": pat = `<ellipse cx="0" cy="18" rx="14" ry="10" fill="${lt}"/>`; break;
    case "scales": pat = `<path d="M-16 26q4 6 8 0 4 6 8 0 4 6 8 0 4 6 8 0" fill="none" stroke="${dk}" stroke-width="3"/>`; break;
  }
  const ey = k.body === "squat" ? 6 : -2, ex = 13;
  const dead = mood === "dead";
  let eyes = "";
  const X = (x, y) => `<path d="M${x - 5} ${y - 5}l10 10M${x + 5} ${y - 5}l-10 10" ${sw} fill="none"/>`;
  if (dead) eyes = k.eyes === "cyc" ? X(0, ey) : X(-ex, ey) + X(ex, ey);
  else if (k.eyes === "big" || k.eyes === "owl") {
    const r = k.eyes === "owl" ? 12 : 9;
    const ring = k.eyes === "owl" ? `<circle cx="-${ex + 1}" cy="${ey}" r="${r + 4}" fill="${lt}"/><circle cx="${ex + 1}" cy="${ey}" r="${r + 4}" fill="${lt}"/>` : "";
    eyes = ring + [-1, 1].map(s => `<circle cx="${s * (ex + (k.eyes === "owl" ? 1 : 0))}" cy="${ey}" r="${r}" fill="#fff" ${sw}/><circle class="pupil" cx="${s * (ex + (k.eyes === "owl" ? 1 : 0)) + 2}" cy="${ey + 1}" r="${r * .5}" fill="${INK}"/><circle cx="${s * (ex + (k.eyes === "owl" ? 1 : 0)) + 4}" cy="${ey - 2}" r="${r * .18}" fill="#fff"/>`).join("") + (k.eyes === "owl" ? `<path d="M-4 ${ey + 12}l4 6 4-6z" fill="#ffb020" ${sw}/>` : "");
  } else if (k.eyes === "frog") {
    eyes = [-1, 1].map(s => `<circle cx="${s * 18}" cy="${topY - 4}" r="8" fill="#fff"/><circle class="pupil" cx="${s * 18 + 1}" cy="${topY - 3}" r="4.5" fill="${INK}"/>`).join("");
  } else if (k.eyes === "cyc") {
    eyes = `<circle cx="0" cy="${ey}" r="14" fill="#fff" ${sw}/><circle class="pupil" cx="2" cy="${ey + 1}" r="7" fill="${INK}"/><circle cx="5" cy="${ey - 3}" r="2.5" fill="#fff"/>`;
  } else if (k.eyes === "stalk") {
    eyes = [-1, 1].map(s => `<path d="M${s * 10} ${ey + 6}v-16" ${sw}/><circle cx="${s * 10}" cy="${ey - 12}" r="7" fill="#fff" ${sw}/><circle class="pupil" cx="${s * 10 + 1}" cy="${ey - 11}" r="3.5" fill="${INK}"/>`).join("");
  } else {
    eyes = [-1, 1].map(s => `<circle class="pupil" cx="${s * ex}" cy="${ey}" r="5" fill="${INK}"/><circle cx="${s * ex + 1.6}" cy="${ey - 1.8}" r="1.6" fill="#fff"/>`).join("");
  }
  const my = ey + (k.eyes === "owl" ? 22 : 15);
  const mouths = {
    idle: `<path d="M-7 ${my}q7 7 14 0" fill="none" ${sw}/>`,
    happy: `<path d="M-10 ${my - 2}q10 14 20 0z" fill="#7a1f3d" ${sw}/>`,
    sad: `<path d="M-7 ${my + 4}q7-7 14 0" fill="none" ${sw}/>`,
    shock: `<ellipse cx="0" cy="${my + 1}" rx="5" ry="7" fill="#7a1f3d" ${sw}/>`,
    dead: `<path d="M-7 ${my + 2}h14" ${sw}/>`,
  };
  const blush = k.pat === "blush" || k.pat === "whisk" ? `<ellipse cx="-22" cy="${ey + 10}" rx="6" ry="3.5" fill="#ff6f91" opacity=".55"/><ellipse cx="22" cy="${ey + 10}" rx="6" ry="3.5" fill="#ff6f91" opacity=".55"/>` : "";
  const whisk = k.pat === "whisk" ? `<path d="M-20 ${ey + 14}h-14M-20 ${ey + 18}l-12 4M20 ${ey + 14}h14M20 ${ey + 18}l12 4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` : "";
  const feet = `<ellipse cx="-15" cy="44" rx="10" ry="6" fill="${dk}" ${sw}/><ellipse cx="15" cy="44" rx="10" ry="6" fill="${dk}" ${sw}/>`;
  const shine = `<ellipse cx="-14" cy="${k.body === "squat" ? 0 : -10}" rx="8" ry="5" fill="#fff" opacity=".35" transform="rotate(-25 -14 -10)"/>`;
  return `<svg class="critter" viewBox="-52 -62 104 114" aria-hidden="true">${feet}${back}${bodies[k.body]}${pat}${shine}${eyes}${blush}${whisk}${mouths[dead ? "dead" : mood] || mouths.idle}</svg>`;
}
export const critterColor = i => CRITTERS[((i % 12) + 12) % 12].c;
export const REACTIONS = ["😂", "😱", "👏", "❤️", "🔥", "💀"];

// draw a stroke string ("cw:x,y,x,y…" joined with ";", coordinates 0..1000) onto a canvas
export function paintStrokes(cv, s, cols) {
  const g = cv.getContext("2d"), W = cv.width;
  g.fillStyle = "#fffdf7"; g.fillRect(0, 0, W, W); g.lineCap = "round"; g.lineJoin = "round";
  for (const x of String(s || "").split(";")) {
    if (!x) continue;
    const [h, pts] = x.split(":"), p = (pts || "").split(",").map(Number);
    g.strokeStyle = cols[+h[0]] || "#1d1233"; g.lineWidth = (+h[1] ? 22 : 8) * W / 1000; g.beginPath();
    g.moveTo(p[0] * W / 1000, p[1] * W / 1000); if (p.length === 2) g.lineTo(p[0] * W / 1000 + .1, p[1] * W / 1000);
    for (let i = 2; i < p.length; i += 2) g.lineTo(p[i] * W / 1000, p[i + 1] * W / 1000);
    g.stroke();
  }
}

export const COLOR_PAIRS = [["#1d1233", "#e8434f"], ["#1d1233", "#2fb5ff"], ["#1d1233", "#2fc47e"], ["#6a1b9a", "#ffb020"], ["#0b4f8a", "#ff5fa2"], ["#1d1233", "#ff9a1f"], ["#3d2b1f", "#7a5cff"], ["#0f6b4f", "#e8434f"]];
