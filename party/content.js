// Gekko Party content. Every item exists in English, Russian and Burmese.
// To add your own: copy a line and keep the same number of "|" parts in all three languages.

// ── The Last Train (trivia): "question|correct answer|wrong|wrong|wrong"
const TRIVIA = `
Which planet is the biggest?|Jupiter|Saturn|Neptune|Earth
Какая планета самая большая?|Юпитер|Сатурн|Нептун|Земля
အကြီးဆုံးဂြိုဟ်က ဘာလဲ။|ကြာသပတေးဂြိုဟ်|စနေဂြိုဟ်|နက်ပကျွန်းဂြိုဟ်|ကမ္ဘာ

How many legs does a spider have?|8|6|10|12
Сколько ног у паука?|8|6|10|12
ပင့်ကူမှာ ခြေထောက် ဘယ်နှချောင်းရှိလဲ။|၈|၆|၁၀|၁၂

Which country has the most people?|India|China|USA|Indonesia
В какой стране больше всего людей?|Индия|Китай|США|Индонезия
လူဦးရေ အများဆုံးနိုင်ငံက ဘယ်နိုင်ငံလဲ။|အိန္ဒိယ|တရုတ်|အမေရိကန်|အင်ဒိုနီးရှား

What is the capital of Australia?|Canberra|Sydney|Melbourne|Perth
Столица Австралии?|Канберра|Сидней|Мельбурн|Перт
ဩစတြေးလျရဲ့ မြို့တော်က ဘာလဲ။|ကင်ဘာရာ|ဆစ်ဒနီ|မဲလ်ဘုန်း|ပါ့သ်

Which animal is the tallest?|Giraffe|Elephant|Camel|Ostrich
Какое животное самое высокое?|Жираф|Слон|Верблюд|Страус
အရပ်အရှည်ဆုံး တိရစ္ဆာန်က ဘာလဲ။|သစ်ကုလားအုပ်|ဆင်|ကုလားအုပ်|ငှက်ကုလားအုပ်

Which insect makes honey?|Bee|Butterfly|Fly|Mosquito
Какое насекомое делает мёд?|Пчела|Бабочка|Муха|Комар
ပျားရည်ကို ဘယ်အင်းဆက်က လုပ်လဲ။|ပျား|လိပ်ပြာ|ယင်ကောင်|ခြင်

At what temperature does water boil at sea level?|100 °C|90 °C|80 °C|120 °C
При какой температуре кипит вода на уровне моря?|100 °C|90 °C|80 °C|120 °C
ပင်လယ်ရေမျက်နှာပြင်အမြင့်မှာ ရေက ဘယ်အပူချိန်မှာ ဆူလဲ။|၁၀၀ °C|၉၀ °C|၈၀ °C|၁၂၀ °C

Which ocean is the largest?|Pacific|Atlantic|Indian|Arctic
Какой океан самый большой?|Тихий|Атлантический|Индийский|Северный Ледовитый
အကြီးဆုံး သမုဒ္ဒရာက ဘာလဲ။|ပစိဖိတ်|အတ္တလန္တိတ်|အိန္ဒိယ|အာတိတ်

Who painted the Mona Lisa?|Leonardo da Vinci|Pablo Picasso|Vincent van Gogh|Michelangelo
Кто написал «Мону Лизу»?|Леонардо да Винчи|Пабло Пикассо|Винсент Ван Гог|Микеланджело
မိုနာလီဇာ ပန်းချီကို ဘယ်သူ ဆွဲခဲ့လဲ။|လီယိုနာဒို ဒါဗင်ချီ|ပီကာဆို|ဗန်ဂိုး|မိုက်ကယ်လ်အိန်ဂျလို

What is the longest river in Asia?|Yangtze|Mekong|Ganges|Irrawaddy
Самая длинная река Азии?|Янцзы|Меконг|Ганг|Иравади
အာရှမှာ အရှည်ဆုံးမြစ်က ဘာလဲ။|ယန်စီ|မဲခေါင်|ဂင်္ဂါ|ဧရာဝတီ

Which metal is liquid at room temperature?|Mercury|Iron|Silver|Aluminium
Какой металл жидкий при комнатной температуре?|Ртуть|Железо|Серебро|Алюминий
အခန်းအပူချိန်မှာ အရည်ဖြစ်နေတဲ့ သတ္တုက ဘာလဲ။|ပြဒါး|သံ|ငွေ|အလူမီနီယမ်

How many minutes are in a day?|1440|1240|1600|1000
Сколько минут в сутках?|1440|1240|1600|1000
တစ်ရက်မှာ မိနစ် ဘယ်လောက်ရှိလဲ။|၁၄၄၀|၁၂၄၀|၁၆၀၀|၁၀၀၀

Which is the largest country by area?|Russia|Canada|China|USA
Самая большая страна по площади?|Россия|Канада|Китай|США
ဧရိယာအကျယ်ဆုံး နိုင်ငံက ဘာလဲ။|ရုရှား|ကနေဒါ|တရုတ်|အမေရိကန်

In which country are the Pyramids of Giza?|Egypt|Mexico|Peru|Iraq
В какой стране пирамиды Гизы?|Египет|Мексика|Перу|Ирак
ဂီဇာပိရမစ်တွေက ဘယ်နိုင်ငံမှာလဲ။|အီဂျစ်|မက္ကဆီကို|ပီရူး|အီရတ်

Which gas makes up most of the air?|Nitrogen|Oxygen|Carbon dioxide|Hydrogen
Какого газа больше всего в воздухе?|Азот|Кислород|Углекислый газ|Водород
လေထဲမှာ အများဆုံးပါတဲ့ ဓာတ်ငွေ့က ဘာလဲ။|နိုက်ထရိုဂျင်|အောက်ဆီဂျင်|ကာဗွန်ဒိုင်အောက်ဆိုဒ်|ဟိုက်ဒရိုဂျင်

How many hearts does an octopus have?|3|1|2|8
Сколько сердец у осьминога?|3|1|2|8
ရေဘဝဲမှာ နှလုံး ဘယ်နှလုံးရှိလဲ။|၃|၁|၂|၈

What is the fastest land animal?|Cheetah|Lion|Horse|Kangaroo
Самое быстрое животное на суше?|Гепард|Лев|Лошадь|Кенгуру
ကုန်းပေါ်မှာ အမြန်ဆုံး တိရစ္ဆာန်က ဘာလဲ။|ချီတာကျားသစ်|ခြင်္သေ့|မြင်း|သားပိုက်ကောင်

What is the currency of Japan?|Yen|Won|Yuan|Baht
Какая валюта в Японии?|Иена|Вона|Юань|Бат
ဂျပန်နိုင်ငံရဲ့ ငွေကြေးက ဘာလဲ။|ယန်း|ဝမ်|ယွမ်|ဘတ်

What is the currency of Thailand?|Baht|Kyat|Ringgit|Rupee
Какая валюта в Таиланде?|Бат|Кьят|Ринггит|Рупия
ထိုင်းနိုင်ငံရဲ့ ငွေကြေးက ဘာလဲ။|ဘတ်|ကျပ်|ရင်းဂစ်|ရူပီး

Which language has the most native speakers?|Chinese (Mandarin)|English|Spanish|Hindi
На каком языке больше всего носителей?|Китайский|Английский|Испанский|Хинди
မိခင်ဘာသာစကားအဖြစ် ပြောသူ အများဆုံးက ဘယ်ဘာသာလဲ။|တရုတ်|အင်္ဂလိပ်|စပိန်|ဟိန္ဒီ

What is the smallest prime number?|2|1|3|0
Самое маленькое простое число?|2|1|3|0
အငယ်ဆုံး သုဒ္ဓကိန်းက ဘာလဲ။|၂|၁|၃|၀

Which planet is called the Red Planet?|Mars|Venus|Jupiter|Mercury
Какую планету называют Красной?|Марс|Венера|Юпитер|Меркурий
ဂြိုဟ်နီလို့ ခေါ်တဲ့ ဂြိုဟ်က ဘာလဲ။|အင်္ဂါဂြိုဟ်|သောကြာဂြိုဟ်|ကြာသပတေးဂြိုဟ်|ဗုဒ္ဓဟူးဂြိုဟ်

Who wrote War and Peace?|Leo Tolstoy|Fyodor Dostoevsky|Anton Chekhov|Alexander Pushkin
Кто написал «Войну и мир»?|Лев Толстой|Фёдор Достоевский|Антон Чехов|Александр Пушкин
စစ်နှင့်ငြိမ်းချမ်းရေး ဝတ္ထုကို ဘယ်သူ ရေးခဲ့လဲ။|လီယို တော်စတွိုင်း|ဒေါ့စတိုယက်စကီး|ချက်ကော့|ပူရှ်ကင်

What is the highest mountain on Earth?|Everest|K2|Kilimanjaro|Elbrus
Самая высокая гора на Земле?|Эверест|К2|Килиманджаро|Эльбрус
ကမ္ဘာပေါ်မှာ အမြင့်ဆုံးတောင်က ဘာလဲ။|ဧဝရက်|K2|ကီလီမန်ဂျာရို|အယ်လ်ဘရုစ်

How many players does a football team have on the field?|11|9|10|12
Сколько игроков футбольной команды на поле?|11|9|10|12
ဘောလုံးအသင်းတစ်သင်းမှာ ကွင်းထဲ ကစားသမား ဘယ်နှယောက်ရှိလဲ။|၁၁|၉|၁၀|၁၂

Which fruit is called the King of Fruits in Southeast Asia?|Durian|Mango|Mangosteen|Jackfruit
Какой фрукт в Юго-Восточной Азии называют королём фруктов?|Дуриан|Манго|Мангостин|Джекфрут
အရှေ့တောင်အာရှမှာ အသီးတွေရဲ့ဘုရင်လို့ ခေါ်တဲ့ အသီးက ဘာလဲ။|ဒူးရင်း|သရက်|မင်းကွတ်|ပိန္နဲ

What is the hardest natural material?|Diamond|Gold|Iron|Quartz
Самый твёрдый природный материал?|Алмаз|Золото|Железо|Кварц
သဘာဝမှာ အမာဆုံး ပစ္စည်းက ဘာလဲ။|စိန်|ရွှေ|သံ|ကျောက်သလင်း

Lake Baikal, the deepest lake in the world, is in…|Russia|Mongolia|Kazakhstan|China
Байкал, самое глубокое озеро мира, находится в…|России|Монголии|Казахстане|Китае
ကမ္ဘာ့အနက်ဆုံးကန် ဘိုင်ကယ်က ဘယ်နိုင်ငံမှာလဲ။|ရုရှား|မွန်ဂိုလီးယား|ကာဇက်စတန်|တရုတ်

How many strings does a standard guitar have?|6|4|5|7
Сколько струн у обычной гитары?|6|4|5|7
ပုံမှန်ဂီတာမှာ ကြိုး ဘယ်နှကြိုးရှိလဲ။|၆|၄|၅|၇

Which bird can fly backwards?|Hummingbird|Eagle|Parrot|Owl
Какая птица умеет летать задом наперёд?|Колибри|Орёл|Попугай|Сова
နောက်ပြန် ပျံနိုင်တဲ့ ငှက်က ဘာလဲ။|ဟမ်မင်းငှက်|လင်းယုန်|ကြက်တူရွေး|ဇီးကွက်

Which blood type can be given to almost anyone?|O negative|AB positive|A positive|B negative
Какую группу крови можно перелить почти любому?|Первая отрицательная|Четвёртая положительная|Вторая положительная|Третья отрицательная
လူတိုင်းနီးပါးကို လှူလို့ရတဲ့ သွေးအမျိုးအစားက ဘာလဲ။|O အနုတ်|AB အပေါင်း|A အပေါင်း|B အနုတ်

In what year did the first person fly into space?|1961|1957|1969|1965
В каком году человек впервые полетел в космос?|1961|1957|1969|1965
လူသားပထမဆုံး အာကာသထဲကို ဘယ်နှစ်မှာ ရောက်ခဲ့လဲ။|၁၉၆၁|၁၉၅၇|၁၉၆၉|၁၉၆၅

What is the chemical symbol for gold?|Au|Ag|Gd|Go
Химический символ золота?|Au|Ag|Gd|Go
ရွှေရဲ့ ဓာတုသင်္ကေတက ဘာလဲ။|Au|Ag|Gd|Go

Which country gave the Statue of Liberty to the USA?|France|Britain|Spain|Italy
Какая страна подарила США Статую Свободы?|Франция|Великобритания|Испания|Италия
လွတ်လပ်ရေးရုပ်တုကို အမေရိကန်ကို ဘယ်နိုင်ငံက လက်ဆောင်ပေးခဲ့လဲ။|ပြင်သစ်|ဗြိတိန်|စပိန်|အီတလီ

How many teeth does an adult usually have?|32|28|36|24
Сколько зубов обычно у взрослого?|32|28|36|24
လူကြီးတစ်ယောက်မှာ သွား ပုံမှန် ဘယ်နှချောင်းရှိလဲ။|၃၂|၂၈|၃၆|၂၄

Which of these is a mammal?|Dolphin|Shark|Salmon|Octopus
Кто из них млекопитающее?|Дельфин|Акула|Лосось|Осьминог
ဒီထဲက ဘယ်ဟာက နို့တိုက်သတ္တဝါလဲ။|လင်းပိုင်|ငါးမန်း|ဆော်လမွန်ငါး|ရေဘဝဲ

What is the largest city in Myanmar?|Yangon|Mandalay|Naypyidaw|Bago
Самый большой город Мьянмы?|Янгон|Мандалай|Нейпьидо|Баго
မြန်မာနိုင်ငံရဲ့ အကြီးဆုံးမြို့က ဘာလဲ။|ရန်ကုန်|မန္တလေး|နေပြည်တော်|ပဲခူး

Matryoshka nesting dolls come from…|Russia|Japan|China|Mexico
Матрёшка родом из…|России|Японии|Китая|Мексики
မက်ထရီယော့ရှကာ အရုပ်ဆင့်လေးတွေက ဘယ်နိုင်ငံကလဲ။|ရုရှား|ဂျပန်|တရုတ်|မက္ကဆီကို

Which vitamin does your skin make in sunlight?|Vitamin D|Vitamin C|Vitamin A|Vitamin B12
Какой витамин кожа вырабатывает на солнце?|Витамин D|Витамин C|Витамин A|Витамин B12
နေရောင်ခြည်ထဲမှာ အရေပြားက ဘယ်ဗီတာမင်ကို ထုတ်လဲ။|ဗီတာမင် D|ဗီတာမင် C|ဗီတာမင် A|ဗီတာမင် B12

How many sides does one cell of a honeycomb have?|6|4|5|8
Сколько сторон у одной ячейки пчелиных сот?|6|4|5|8
ပျားအုံထဲက အိမ်ကလေးတစ်ခုမှာ အနား ဘယ်နှခုရှိလဲ။|၆|၄|၅|၈

What is the largest hot desert?|Sahara|Gobi|Kalahari|Arabian
Самая большая жаркая пустыня?|Сахара|Гоби|Калахари|Аравийская
အကြီးဆုံး ပူပြင်းတဲ့ သဲကန္တာရက ဘာလဲ။|ဆာဟာရ|ဂိုဘီ|ကာလာဟာရီ|အာရေဗျ

Which country is shaped like a boot?|Italy|Greece|Chile|Portugal
Какая страна похожа на сапог?|Италия|Греция|Чили|Португалия
ဘွတ်ဖိနပ်ပုံစံ နိုင်ငံက ဘာလဲ။|အီတလီ|ဂရိ|ချီလီ|ပေါ်တူဂီ

In which city is the Shwedagon Pagoda?|Yangon|Bangkok|Mandalay|Vientiane
В каком городе пагода Шведагон?|Янгон|Бангкок|Мандалай|Вьентьян
ရွှေတိဂုံဘုရားက ဘယ်မြို့မှာလဲ။|ရန်ကုန်|ဘန်ကောက်|မန္တလေး|ဗီယင်ကျန်း

Tom yum soup comes from…|Thailand|Vietnam|Japan|India
Суп том ям родом из…|Таиланда|Вьетнама|Японии|Индии
တုံယမ်းဟင်းချိုက ဘယ်နိုင်ငံကလဲ။|ထိုင်း|ဗီယက်နမ်|ဂျပန်|အိန္ဒိယ

Which instrument usually has 88 keys?|Piano|Accordion|Harp|Xylophone
У какого инструмента обычно 88 клавиш?|Фортепиано|Аккордеон|Арфа|Ксилофон
ကီး ၈၈ ခု ပုံမှန်ပါတဲ့ တူရိယာက ဘာလဲ။|စန္ဒယား|အကော်ဒီယံ|စောင်း|ပတ္တလား

Who created the periodic table of elements?|Dmitri Mendeleev|Isaac Newton|Albert Einstein|Marie Curie
Кто создал периодическую таблицу элементов?|Дмитрий Менделеев|Исаак Ньютон|Альберт Эйнштейн|Мария Кюри
ဒြပ်စင်ဇယားကို ဘယ်သူ ဖန်တီးခဲ့လဲ။|မန်ဒလီးယက်|နယူတန်|အိုင်းစတိုင်း|မာရီ ကျူရီ

How many days are in a leap year?|366|365|364|360
Сколько дней в високосном году?|366|365|364|360
ရက်ထပ်နှစ်မှာ ရက်ပေါင်း ဘယ်လောက်ရှိလဲ။|၃၆၆|၃၆၅|၃၆၄|၃၆၀

What is the largest organ of the human body?|Skin|Liver|Brain|Lungs
Самый большой орган человека?|Кожа|Печень|Мозг|Лёгкие
လူ့ခန္ဓာကိုယ်ရဲ့ အကြီးဆုံးအင်္ဂါက ဘာလဲ။|အရေပြား|အသည်း|ဦးနှောက်|အဆုတ်

Where are the giant Moai stone heads?|Easter Island|Hawaii|Madagascar|Iceland
Где стоят каменные головы моаи?|Остров Пасхи|Гавайи|Мадагаскар|Исландия
မိုအိုင်း ကျောက်ခေါင်းကြီးတွေက ဘယ်မှာလဲ။|အီစတာကျွန်း|ဟာဝိုင်ယီ|မဒါဂတ်စကား|အိုက်စလန်

Which animal carries its baby in a pouch?|Kangaroo|Panda|Monkey|Bear
Кто носит детёныша в сумке?|Кенгуру|Панда|Обезьяна|Медведь
ကလေးကို အိတ်ထဲထည့်ပြီး သယ်တဲ့ တိရစ္ဆာန်က ဘာလဲ။|သားပိုက်ကောင်|ပန်ဒါ|မျောက်|ဝက်ဝံ

Which country has the most islands?|Sweden|Indonesia|Philippines|Japan
В какой стране больше всего островов?|Швеция|Индонезия|Филиппины|Япония
ကျွန်း အများဆုံးရှိတဲ့ နိုင်ငံက ဘာလဲ။|ဆွီဒင်|အင်ဒိုနီးရှား|ဖိလစ်ပိုင်|ဂျပန်

How long does sunlight take to reach Earth?|About 8 minutes|About 8 seconds|About 1 hour|About 1 day
Сколько свет от Солнца летит до Земли?|Около 8 минут|Около 8 секунд|Около часа|Около суток
နေရောင်ခြည်က ကမ္ဘာကို ရောက်ဖို့ ဘယ်လောက်ကြာလဲ။|၈ မိနစ်ခန့်|၈ စက္ကန့်ခန့်|၁ နာရီခန့်|၁ ရက်ခန့်

What do pandas mostly eat?|Bamboo|Fish|Fruit|Grass
Чем в основном питаются панды?|Бамбуком|Рыбой|Фруктами|Травой
ပန်ဒါတွေ အဓိက ဘာစားလဲ။|ဝါး|ငါး|အသီး|မြက်

How many colours are in a rainbow?|7|5|6|8
Сколько цветов у радуги?|7|5|6|8
သက်တံ့မှာ အရောင် ဘယ်နှရောင်ရှိလဲ။|၇|၅|၆|၈

Which is the smallest country in the world?|Vatican City|Monaco|San Marino|Singapore
Самая маленькая страна мира?|Ватикан|Монако|Сан-Марино|Сингапур
ကမ္ဘာ့အသေးဆုံး နိုင်ငံက ဘာလဲ။|ဗာတီကန်|မိုနာကို|ဆန်မာရီနို|စင်္ကာပူ

What is H₂O?|Water|Salt|Sugar|Air
Что такое H₂O?|Вода|Соль|Сахар|Воздух
H₂O ဆိုတာ ဘာလဲ။|ရေ|ဆား|သကြား|လေ

Which animal is famous for changing its colour?|Chameleon|Frog|Snake|Turtle
Какое животное знаменито тем, что меняет цвет?|Хамелеон|Лягушка|Змея|Черепаха
အရောင်ပြောင်းနိုင်လို့ နာမည်ကြီးတဲ့ တိရစ္ဆာန်က ဘာလဲ။|ပုတ်သင်ညို|ဖား|မြွေ|လိပ်
`;

// ── The Last Train, final run: "category" then items; a leading "+" marks the items that belong.
const FINAL = `
Fruits|Фрукты|အသီးများ
+Mango|Манго|သရက်သီး
+Banana|Банан|ငှက်ပျောသီး
+Durian|Дуриан|ဒူးရင်းသီး
+Apple|Яблоко|ပန်းသီး
+Papaya|Папайя|သင်္ဘောသီး
+Pineapple|Ананас|နာနတ်သီး
Carrot|Морковь|မုန်လာဥနီ
Potato|Картошка|အာလူး
Onion|Лук|ကြက်သွန်နီ
Cabbage|Капуста|ဂေါ်ဖီထုပ်

Mammals|Млекопитающие|နို့တိုက်သတ္တဝါများ
+Whale|Кит|ဝေလငါး
+Bat|Летучая мышь|လင်းနို့
+Dolphin|Дельфин|လင်းပိုင်
+Elephant|Слон|ဆင်
+Cat|Кошка|ကြောင်
+Human|Человек|လူ
Shark|Акула|ငါးမန်း
Penguin|Пингвин|ပင်ဂွင်း
Crocodile|Крокодил|မိကျောင်း
Frog|Лягушка|ဖား

Countries in Asia|Страны Азии|အာရှနိုင်ငံများ
+Laos|Лаос|လာအို
+Japan|Япония|ဂျပန်
+Nepal|Непал|နီပေါ
+Vietnam|Вьетнам|ဗီယက်နမ်
+Mongolia|Монголия|မွန်ဂိုလီးယား
+Cambodia|Камбоджа|ကမ္ဘောဒီးယား
Peru|Перу|ပီရူး
Kenya|Кения|ကင်ညာ
Norway|Норвегия|နော်ဝေ
Chile|Чили|ချီလီ

Planets|Планеты|ဂြိုဟ်များ
+Mars|Марс|အင်္ဂါဂြိုဟ်
+Venus|Венера|သောကြာဂြိုဟ်
+Saturn|Сатурн|စနေဂြိုဟ်
+Mercury|Меркурий|ဗုဒ္ဓဟူးဂြိုဟ်
+Neptune|Нептун|နက်ပကျွန်းဂြိုဟ်
+Uranus|Уран|ယူရေးနပ်စ်ဂြိုဟ်
Moon|Луна|လ
Sun|Солнце|နေ
Pluto|Плутон|ပလူတို
Sirius|Сириус|ဆီးရီးယပ်စ်ကြယ်

Even numbers|Чётные числа|စုံကိန်းများ
+2|2|၂
+14|14|၁၄
+100|100|၁၀၀
+38|38|၃၈
+56|56|၅၆
+8|8|၈
7|7|၇
15|15|၁၅
21|21|၂၁
99|99|၉၉

Insects|Насекомые|အင်းဆက်များ
+Ant|Муравей|ပုရွက်ဆိတ်
+Bee|Пчела|ပျား
+Butterfly|Бабочка|လိပ်ပြာ
+Mosquito|Комар|ခြင်
+Grasshopper|Кузнечик|နှံကောင်
+Beetle|Жук|ပိုးတောင်မာ
Spider|Паук|ပင့်ကူ
Snail|Улитка|ခရု
Scorpion|Скорпион|ကင်းမြီးကောက်
Worm|Червяк|တီကောင်

Things that can fly|Что умеет летать|ပျံနိုင်တဲ့အရာများ
+Eagle|Орёл|လင်းယုန်
+Bat|Летучая мышь|လင်းနို့
+Plane|Самолёт|လေယာဉ်
+Bee|Пчела|ပျား
+Helicopter|Вертолёт|ရဟတ်ယာဉ်
+Kite|Воздушный змей|စွန်
Penguin|Пингвин|ပင်ဂွင်း
Ostrich|Страус|ငှက်ကုလားအုပ်
Train|Поезд|ရထား
Cow|Корова|နွား

Musical instruments|Музыкальные инструменты|တူရိယာများ
+Violin|Скрипка|တယော
+Drum|Барабан|ဗုံ
+Flute|Флейта|ပလွေ
+Piano|Пианино|စန္ဒယား
+Harp|Арфа|စောင်း
+Guitar|Гитара|ဂီတာ
Hammer|Молоток|တူ
Pillow|Подушка|ခေါင်းအုံး
Umbrella|Зонт|ထီး
Kettle|Чайник|ရေနွေးအိုး

Colours of the rainbow|Цвета радуги|သက်တံ့အရောင်များ
+Red|Красный|အနီ
+Orange|Оранжевый|လိမ္မော်ရောင်
+Yellow|Жёлтый|အဝါ
+Green|Зелёный|အစိမ်း
+Blue|Синий|အပြာ
+Violet|Фиолетовый|ခရမ်းရောင်
Pink|Розовый|ပန်းရောင်
Black|Чёрный|အနက်
Brown|Коричневый|အညို
White|Белый|အဖြူ

Sports with a ball|Спорт с мячом|ဘောလုံးနဲ့ ကစားတဲ့ အားကစား
+Football|Футбол|ဘောလုံး
+Tennis|Теннис|တင်းနစ်
+Basketball|Баскетбол|ဘတ်စကက်ဘော
+Volleyball|Волейбол|ဘော်လီဘော
+Golf|Гольф|ဂေါက်သီး
+Chinlone|Чинлон|ခြင်းလုံး
Swimming|Плавание|ရေကူး
Boxing|Бокс|လက်ဝှေ့
Skiing|Лыжи|နှင်းလျှောစီး
Chess|Шахматы|စစ်တုရင်

Capital cities|Столицы|မြို့တော်များ
+Tokyo|Токио|တိုကျို
+Paris|Париж|ပါရီ
+Bangkok|Бангкок|ဘန်ကောက်
+Moscow|Москва|မော်စကို
+Hanoi|Ханой|ဟနွိုင်း
+Naypyidaw|Нейпьидо|နေပြည်တော်
Sydney|Сидней|ဆစ်ဒနီ
Yangon|Янгон|ရန်ကုန်
Istanbul|Стамбул|အစ္စတန်ဘူလ်
Shanghai|Шанхай|ရှန်ဟိုင်း

Live in water|Живут в воде|ရေထဲမှာ နေတဲ့ သတ္တဝါများ
+Octopus|Осьминог|ရေဘဝဲ
+Whale|Кит|ဝေလငါး
+Shark|Акула|ငါးမန်း
+Crab|Краб|ဂဏန်း
+Goldfish|Золотая рыбка|ရွှေငါး
+Dolphin|Дельфин|လင်းပိုင်
Camel|Верблюд|ကုလားအုပ်
Owl|Сова|ဇီးကွက်
Goat|Коза|ဆိတ်
Squirrel|Белка|ရှဉ့်

Vegetables|Овощи|ဟင်းသီးဟင်းရွက်များ
+Carrot|Морковь|မုန်လာဥနီ
+Potato|Картошка|အာလူး
+Onion|Лук|ကြက်သွန်နီ
+Cabbage|Капуста|ဂေါ်ဖီထုပ်
+Cucumber|Огурец|သခွားသီး
+Eggplant|Баклажан|ခရမ်းသီး
Banana|Банан|ငှက်ပျောသီး
Grapes|Виноград|စပျစ်သီး
Cherry|Вишня|ချယ်ရီသီး
Lemon|Лимон|သံပုရာသီး
`;

// ── Doodle Lies: "English|Russian|Burmese" drawing prompts
const PROMPTS = `
a cat at a job interview|кот на собеседовании|အလုပ်အင်တာဗျူး ဖြေနေတဲ့ ကြောင်
a dancing durian|танцующий дуриан|ကနေတဲ့ ဒူးရင်းသီး
a sad robot eating noodles|грустный робот ест лапшу|ခေါက်ဆွဲစားနေတဲ့ ဝမ်းနည်းနေတဲ့ စက်ရုပ်
grandma on a skateboard|бабушка на скейтборде|စကိတ်ဘုတ်စီးနေတဲ့ အဖွား
a fish that is afraid of water|рыба, которая боится воды|ရေကြောက်တဲ့ ငါး
an elephant in a tiny car|слон в крошечной машине|ကားအသေးလေးထဲက ဆင်
a ghost brushing its teeth|привидение чистит зубы|သွားတိုက်နေတဲ့ သရဲ
a vampire at the dentist|вампир у стоматолога|သွားဆရာဝန်ဆီ ရောက်နေတဲ့ ဗန်ပိုင်ယာ
a snowman on the beach|снеговик на пляже|ကမ်းခြေပေါ်က ဆီးနှင်းလူရုပ်
a dragon making tea|дракон заваривает чай|လက်ဖက်ရည်ဖျော်နေတဲ့ နဂါး
a nervous banana|нервный банан|စိတ်လှုပ်ရှားနေတဲ့ ငှက်ပျောသီး
a chicken on a motorbike|курица на мотоцикле|ဆိုင်ကယ်စီးနေတဲ့ ကြက်
a pigeon stealing a sandwich|голубь ворует бутерброд|ပေါင်မုန့်ခိုးနေတဲ့ ခို
a very tired superhero|очень уставший супергерой|အရမ်းပင်ပန်းနေတဲ့ စူပါဟီးရိုး
a cactus giving a hug|кактус обнимается|ဖက်ပေးနေတဲ့ ရှားစောင်းပင်
a shark in a business suit|акула в деловом костюме|ကုတ်အင်္ကျီဝတ်ထားတဲ့ ငါးမန်း
a frog wedding|лягушачья свадьба|ဖားတွေရဲ့ မင်္ဂလာဆောင်
breakfast in space|завтрак в космосе|အာကာသထဲမှာ မနက်စာ
a tiger in pyjamas|тигр в пижаме|ညဝတ်အင်္ကျီဝတ်ထားတဲ့ ကျား
a penguin in the desert|пингвин в пустыне|သဲကန္တာရထဲက ပင်ဂွင်း
an octopus doing karate|осьминог занимается карате|ကရာတေးလုပ်နေတဲ့ ရေဘဝဲ
a pizza in love|влюблённая пицца|အချစ်ရူးနေတဲ့ ပီဇာ
a dinosaur at a birthday party|динозавр на дне рождения|မွေးနေ့ပွဲမှာ ဒိုင်နိုဆော
a cow on the Moon|корова на Луне|လပေါ်က နွား
a sleepy volcano|сонный вулкан|အိပ်ငိုက်နေတဲ့ မီးတောင်
a fridge with a secret|холодильник с секретом|လျှို့ဝှက်ချက်ရှိတဲ့ ရေခဲသေတ္တာ
an angry teapot|злой чайник|စိတ်ဆိုးနေတဲ့ ရေနွေးကရား
a pirate who is afraid of the sea|пират, который боится моря|ပင်လယ်ကြောက်တဲ့ ပင်လယ်ဓားပြ
a mosquito with a tiny umbrella|комар с крошечным зонтиком|ထီးသေးသေးလေး ကိုင်ထားတဲ့ ခြင်
a very rich gecko|очень богатый геккон|အရမ်းချမ်းသာတဲ့ တောက်တဲ့
a snail winning a race|улитка выигрывает гонку|ပြိုင်ပွဲနိုင်နေတဲ့ ခရု
a robot in love with a toaster|робот влюбился в тостер|ပေါင်မုန့်ကင်စက်ကို ချစ်နေတဲ့ စက်ရုပ်
a crocodile at the hairdresser|крокодил в парикмахерской|ဆံပင်ညှပ်ဆိုင် ရောက်နေတဲ့ မိကျောင်း
a bear who lost the TV remote|медведь потерял пульт от телевизора|တီဗီရီမုတ် ပျောက်သွားတဲ့ ဝက်ဝံ
a giraffe in a lift|жираф в лифте|ဓာတ်လှေကားထဲက သစ်ကုလားအုပ်
a haunted rice cooker|рисоварка с привидением|သရဲခြောက်နေတဲ့ ထမင်းပေါင်းအိုး
a monkey fixing a computer|обезьяна чинит компьютер|ကွန်ပျူတာ ပြင်နေတဲ့ မျောက်
a duck taking a taxi|утка едет на такси|တက္ကစီစီးနေတဲ့ ဘဲ
an alien at the night market|инопланетянин на ночном рынке|ညဈေးထဲက ဂြိုဟ်သား
a sneaky mango|хитрое манго|ကလိမ်ကကျစ်လုပ်နေတဲ့ သရက်သီး
a ninja grandma|бабушка-ниндзя|နင်ဂျာအဖွား
an ant lifting weights|муравей поднимает штангу|အလေးမနေတဲ့ ပုရွက်ဆိတ်
a balloon afraid of needles|воздушный шарик боится иголок|အပ်ကြောက်တဲ့ ပူဖောင်း
a mermaid in a bathtub|русалка в ванне|ရေချိုးကန်ထဲက ရေသူမ
a lonely sock|одинокий носок|အထီးကျန်နေတဲ့ ခြေအိတ်
a king without a kingdom|король без королевства|တိုင်းပြည်မရှိတဲ့ ဘုရင်
a burger with legs|бургер с ногами|ခြေထောက်ပါတဲ့ ဘာဂါ
a sunflower in sunglasses|подсолнух в солнечных очках|နေကာမျက်မှန် တပ်ထားတဲ့ နေကြာပန်း
a fish riding a bicycle|рыба на велосипеде|စက်ဘီးစီးနေတဲ့ ငါး
a cow singing karaoke|корова поёт караоке|ကာရာအိုကေ ဆိုနေတဲ့ နွား
a wizard stuck in traffic|волшебник застрял в пробке|ကားကြပ်ထဲ ပိတ်မိနေတဲ့ မှော်ဆရာ
an ice cream in a sauna|мороженое в сауне|ချွေးထုတ်ခန်းထဲက ရေခဲမုန့်
a sheep counting people|овца считает людей|လူတွေကို ရေတွက်နေတဲ့ သိုး
a pineapple in a tuxedo|ананас во фраке|ဝတ်စုံပြည့် ဝတ်ထားတဲ့ နာနတ်သီး
a whale in a swimming pool|кит в бассейне|ရေကူးကန်ထဲက ဝေလငါး
a cat ruling the world|кот правит миром|ကမ္ဘာကို အုပ်ချုပ်နေတဲ့ ကြောင်
a dog doing homework|собака делает домашку|အိမ်စာလုပ်နေတဲ့ ခွေး
a scarecrow afraid of birds|пугало боится птиц|ငှက်ကြောက်တဲ့ စာခြောက်ရုပ်
a rocket made of noodles|ракета из лапши|ခေါက်ဆွဲနဲ့ လုပ်ထားတဲ့ ဒုံးပျံ
a bored ghost|скучающее привидение|ပျင်းနေတဲ့ သရဲ
a turtle in a hurry|черепаха спешит|အလောတကြီး ဖြစ်နေတဲ့ လိပ်
a hedgehog hugging a balloon|ёжик обнимает шарик|ပူဖောင်းကို ဖက်ထားတဲ့ ဖြူကောင်
a lamp that wants to sleep|лампа, которая хочет спать|အိပ်ချင်နေတဲ့ မီးအိမ်
an astronaut at the market|космонавт на рынке|ဈေးထဲက အာကာသယာဉ်မှူး
a cloud with a cold|простуженное облако|အအေးမိနေတဲ့ တိမ်
a pig in a bubble bath|свинья в пенной ванне|ဆပ်ပြာမြှုပ်ထဲမှာ ရေချိုးနေတဲ့ ဝက်
a squirrel with a big secret|белка с большим секретом|လျှို့ဝှက်ချက်ကြီး ရှိတဲ့ ရှဉ့်
a teacher who is a potato|учитель-картошка|အာလူးဆရာ
a snake wearing socks|змея в носках|ခြေအိတ်စွပ်ထားတဲ့ မြွေ
the Moon doing yoga|Луна занимается йогой|ယောဂကျင့်နေတဲ့ လ
a lion afraid of a mouse|лев боится мыши|ကြွက်ကို ကြောက်တဲ့ ခြင်္သေ့
a bee with a jetpack|пчела с реактивным ранцем|ဂျက်လွယ်အိတ် ပါတဲ့ ပျား
a hamster driving a bus|хомяк водит автобус|ဘတ်စ်ကား မောင်းနေတဲ့ ကြွက်ကလေး
a carrot at the gym|морковка в спортзале|အားကစားရုံထဲက မုန်လာဥနီ
a cat that is also a loaf of bread|кот-батон|ပေါင်မုန့်ဖြစ်သွားတဲ့ ကြောင်
`;

// ── Ballpark: "answer" line, then the question in English, Russian and Burmese.
const ESTIMATES = `
206
How many bones are in an adult human body?
Сколько костей в теле взрослого человека?
လူကြီးတစ်ယောက်ရဲ့ ခန္ဓာကိုယ်မှာ အရိုး ဘယ်နှချောင်း ရှိလဲ။

8849
How high is Mount Everest, in metres?
Какова высота Эвереста в метрах?
ဧဝရက်တောင်က မီတာ ဘယ်လောက် မြင့်လဲ။

2007
In what year did the first iPhone come out?
В каком году вышел первый iPhone?
ပထမဆုံး iPhone ကို ဘယ်နှစ်မှာ ထုတ်ခဲ့လဲ။

193
How many member countries does the United Nations have?
Сколько стран входит в ООН?
ကုလသမဂ္ဂမှာ အဖွဲ့ဝင်နိုင်ငံ ဘယ်နှနိုင်ငံ ရှိလဲ။

10080
How many minutes are in one week?
Сколько минут в одной неделе?
တစ်ပတ်မှာ မိနစ် ဘယ်လောက် ရှိလဲ။

1969
In what year did people first walk on the Moon?
В каком году люди впервые ступили на Луну?
လူသားတွေ လပေါ်ကို ပထမဆုံး ဘယ်နှစ်မှာ ခြေချခဲ့လဲ။

384400
How far is the Moon from Earth, in kilometres?
Сколько километров от Земли до Луны?
ကမ္ဘာကနေ လကို ကီလိုမီတာ ဘယ်လောက် ဝေးလဲ။

1889
In what year was the Eiffel Tower finished?
В каком году достроили Эйфелеву башню?
အီဖယ်တာဝါကို ဘယ်နှစ်မှာ ဆောက်ပြီးခဲ့လဲ။

64
How many squares are on a chessboard?
Сколько клеток на шахматной доске?
စစ်တုရင်ခုံမှာ အကွက် ဘယ်နှကွက် ရှိလဲ။

21
How many dots are on one dice, in total?
Сколько всего точек на одном игральном кубике?
အံစာတုံး တစ်တုံးမှာ အစက် စုစုပေါင်း ဘယ်နှစက် ရှိလဲ။

3600
How many seconds are in one hour?
Сколько секунд в одном часе?
တစ်နာရီမှာ စက္ကန့် ဘယ်လောက် ရှိလဲ။

330
How tall is the Eiffel Tower, in metres?
Какова высота Эйфелевой башни в метрах?
အီဖယ်တာဝါက မီတာ ဘယ်လောက် မြင့်လဲ။

10935
How deep is the deepest point of the ocean (the Mariana Trench), in metres?
Какова глубина самой глубокой точки океана (Марианской впадины) в метрах?
သမုဒ္ဒရာရဲ့ အနက်ဆုံးနေရာ (မာရီယားနားကျင်း) က မီတာ ဘယ်လောက် နက်လဲ။

212
At what temperature in °F does water boil?
При какой температуре по Фаренгейту кипит вода?
ရေက ဖာရင်ဟိုက် ဘယ်လောက်မှာ ဆူလဲ။

54
How many countries are in Africa?
Сколько стран в Африке?
အာဖရိကမှာ နိုင်ငံ ဘယ်နှနိုင်ငံ ရှိလဲ။

42.195
How long is a marathon, in kilometres?
Какова длина марафона в километрах?
မာရသွန်ပြေးပွဲက ကီလိုမီတာ ဘယ်လောက် ရှည်လဲ။

1782
In what year did Bangkok become the capital of Thailand?
В каком году Бангкок стал столицей Таиланда?
ဘန်ကောက်က ထိုင်းနိုင်ငံရဲ့ မြို့တော် ဘယ်နှစ်မှာ ဖြစ်လာခဲ့လဲ။

33
How many letters are in the Russian alphabet?
Сколько букв в русском алфавите?
ရုရှားအက္ခရာမှာ စာလုံး ဘယ်နှလုံး ရှိလဲ။

44
How many consonant letters does the Thai alphabet have?
Сколько согласных букв в тайском алфавите?
ထိုင်းအက္ခရာမှာ ဗျည်း ဘယ်နှလုံး ရှိလဲ။

33
How many consonant letters does the Burmese alphabet have?
Сколько согласных букв в бирманском алфавите?
မြန်မာအက္ခရာမှာ ဗျည်း ဘယ်နှလုံး ရှိလဲ။

0
How many bones does a shark have?
Сколько костей у акулы?
ငါးမန်းမှာ အရိုး ဘယ်နှချောင်း ရှိလဲ။

13
How many stripes are on the flag of the USA?
Сколько полос на флаге США?
အမေရိကန်အလံမှာ အစင်း ဘယ်နှစင်း ရှိလဲ။

11
How many time zones does Russia have?
Сколько часовых поясов в России?
ရုရှားနိုင်ငံမှာ အချိန်ဇုန် ဘယ်နှခု ရှိလဲ။

40075
How long is the Earth's equator, in kilometres?
Какова длина экватора Земли в километрах?
ကမ္ဘာ့အီကွေတာက ကီလိုမီတာ ဘယ်လောက် ရှည်လဲ။

1989
In what year was the World Wide Web invented?
В каком году придумали Всемирную паутину (веб)?
World Wide Web ကို ဘယ်နှစ်မှာ တီထွင်ခဲ့လဲ။

27
How many bones are in one human hand?
Сколько костей в одной кисти руки человека?
လူ့လက်တစ်ဖက်မှာ အရိုး ဘယ်နှချောင်း ရှိလဲ။

828
How tall is the Burj Khalifa, in metres?
Какова высота Бурдж-Халифы в метрах?
ဘူဂျ်ခလီဖာ အဆောက်အအုံက မီတာ ဘယ်လောက် မြင့်လဲ။

2170
How long is the Irrawaddy River, in kilometres?
Какова длина реки Иравади в километрах?
ဧရာဝတီမြစ်က ကီလိုမီတာ ဘယ်လောက် ရှည်လဲ။

8.2
How many people live on Earth, in billions?
Сколько людей живёт на Земле, в миллиардах?
ကမ္ဘာပေါ်မှာ လူဦးရေ ဘီလီယံ ဘယ်လောက် ရှိလဲ။

4500
About how old is the Great Pyramid of Giza, in years?
Сколько примерно лет пирамиде Хеопса?
ဂီဇာ ပိရမစ်ကြီးက နှစ် ဘယ်လောက်လောက် ရှိပြီလဲ။

60
What percentage of an adult's body is water?
Сколько процентов тела взрослого составляет вода?
လူကြီးတစ်ယောက်ရဲ့ ခန္ဓာကိုယ်မှာ ရေက ရာခိုင်နှုန်း ဘယ်လောက်လဲ။

1147
In what year was Moscow first mentioned in the chronicles?
В каком году Москва впервые упоминается в летописи?
မော်စကိုမြို့ကို မှတ်တမ်းထဲမှာ ပထမဆုံး ဘယ်နှစ်မှာ ဖော်ပြခဲ့လဲ။
`;

const LANGS = ["en", "ru", "my"];
const blocks = s => s.trim().split(/\n\s*\n/).map(b => b.split("\n").map(l => l.trim()).filter(Boolean));
const tri = parts => ({ en: parts[0], ru: parts[1], my: parts[2] });

export const trivia = blocks(TRIVIA).map(lines => {
  const by = lines.map(l => l.split("|"));
  return { q: tri(by.map(p => p[0])), a: [0, 1, 2, 3].map(i => tri(by.map(p => p[i + 1]))) }; // a[0] is correct
});
export const finals = blocks(FINAL).map(lines => ({
  c: tri(lines[0].split("|")),
  items: lines.slice(1).map(l => ({ ok: l.startsWith("+"), t: tri(l.replace(/^\+/, "").split("|")) })),
}));
export const prompts = PROMPTS.trim().split("\n").map(l => tri(l.split("|")));
export const estimates = blocks(ESTIMATES).map(l => ({ n: Number(l[0]), q: tri(l.slice(1)) }));

// self-check, run once in the console with checkContent()
export function checkContent() {
  const bad = [];
  trivia.forEach((t, i) => LANGS.forEach(L => { if (!t.q[L] || t.a.some(a => !a[L])) bad.push("trivia " + i + " " + L); }));
  finals.forEach((f, i) => { if (f.items.filter(x => x.ok).length < 3 || f.items.filter(x => !x.ok).length < 3) bad.push("final " + i);
    f.items.forEach(x => LANGS.forEach(L => { if (!x.t[L]) bad.push("final item " + i + " " + L); })); });
  prompts.forEach((p, i) => LANGS.forEach(L => { if (!p[L]) bad.push("prompt " + i + " " + L); }));
  estimates.forEach((e, i) => { if (!Number.isFinite(e.n)) bad.push("estimate " + i); LANGS.forEach(L => { if (!e.q[L]) bad.push("estimate " + i + " " + L); }); });
  return { trivia: trivia.length, finals: finals.length, prompts: prompts.length, estimates: estimates.length, bad };
}
