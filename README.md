# PuzzleGekko

Небольшие игры для двоих, которые говорят на разных языках. Сайт: https://timofeevilia.github.io/puzzlegekko/

| Папка | Игра | Как играть |
|---|---|---|
| `golden-land/` | **Golden Land** — игра в духе «Монополии» по Таиланду и Мьянме | онлайн, каждый со своего телефона (через Firebase), или вдвоём на одном устройстве |
| `tolmach/` | **Толмач · စကားပြန်** — игра на слух для русского и бирманского | на одном экране |

Устройство репозитория:
- `index.html` — главная страница со списком игр.
- `shared/net.js` — онлайн-комнаты на Firebase. Используется анонимный вход и Firestore.
- `shared/firebase-config.js` — конфиг Firebase, его нужно заполнить.
- `firestore.rules` — правила доступа к базе.
- `tests/simulate.js` — тест правил Golden Land.

Каждая игра лежит в одном HTML-файле. Сборка не нужна: GitHub Pages раздаёт файлы как есть.

## Подключение Firebase

Онлайн-комнаты заработают после того, как вы один раз заполните конфиг. Пока он пустой, Golden Land предлагает только игру на одном устройстве.

1. **Веб-приложение.** В Firebase console откройте проект PuzzleGekko → ⚙ Project settings → General → Your apps → значок `</>`. Укажите любой nickname, Hosting не включайте. Скопируйте объект `firebaseConfig`.
2. **Конфиг.** Вставьте значения в `shared/firebase-config.js` вместо `PASTE_…` и закоммитьте. Это не секрет: ключ веб-приложения публичный, доступ ограничивают правила из шага 5.
3. **Вход.** Build → Authentication → Get started → Sign-in method → **Anonymous** → Enable. Затем Authentication → Settings → Authorized domains → Add domain → `timofeevilia.github.io`.
4. **База.** Build → Firestore Database → Create database. Выберите **Standard edition**, location `asia-southeast1 (Singapore)`, режим **Production**. ID базы оставьте `(default)`.
5. **Правила.** Firestore → Rules: замените текст содержимым `firestore.rules` и нажмите Publish.
6. **Ключ (по желанию).** В Google Cloud Console → APIs & Services → Credentials откройте ключ «Browser key». В Application restrictions выберите Websites и добавьте `https://timofeevilia.github.io/*`.

Проверка: откройте `…/puzzlegekko/golden-land/` и нажмите **Create an online room**. Ссылку вида `…/golden-land/#K7QX` отправьте второму игроку.

### Одна база на все игры

Все игры пишут в одну базу `(default)`, но каждая в свою коллекцию верхнего уровня:

```
golden-land/K7QX/game/current   ← партия в комнате K7QX
golden-land/K7QX/game/lobby
golden-land/K7QX/live/presence
<следующая-игра>/<КОМНАТА>/...
```

У каждой коллекции свой блок в `firestore.rules`, поэтому игры не видят данные друг друга. Отдельную базу на каждую игру заводить не стоит: бесплатная квота Firestore даётся только базе `(default)`, а дополнительные базы требуют тарифа Blaze.

### Новая онлайн-игра

1. Подключите комнату: `const {openRoom} = await import("../shared/net.js")`, затем `openRoom("имя-игры", код)`.
2. Добавьте в `firestore.rules` блок `match /имя-игры/{room}/{section}/{doc}`.

## Golden Land

- **Поле.** 22 реальных места, по 11 в Таиланде и Мьянме, с названиями тайским и бирманским письмом.
- **Панель справа** (на телефоне она под полем) с вкладками:
  - **Build** — постройка хижин и курортов;
  - **Deals** — обмен и выкуп;
  - **Bank** — кредит и залог;
  - **Market** — SET, рубины и золото.
- **Домашние правила** включаются перед партией: копилка Water Festival, Language moments, выкуп, кредиты, рынок, растущие сезоны, мини-игры и классическое «дубль — ещё один ход».
- **Где ещё работает.** Та же страница работает как артефакт на claude.ai. Там вместо Firebase используется общая база самого артефакта.

## Проверка

```
node tests/simulate.js
```

Скрипт прогоняет 200 случайных партий Golden Land со случайным набором домашних правил. Он падает, если игра застревает, деньги или цены становятся некорректными, или срабатывает выключенное правило.
