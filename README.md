# Кухни Оренбург

Лендинг-сайт компании по изготовлению **кухонь на заказ** (г. Оренбург): каталог, портфолио работ, блог, калькулятор стоимости, квиз-подбор и форма заявки.

Сайт статический, собран на **Astro 6**. Локаль — русская (`ru-RU`).

> ⚠️ **Текущий статус:** сайт опубликован на **Cloudflare Pages** (`https://mebeleff.pages.dev`) как временная демо-версия для приёмки заказчиком.
> На время приёмки **индексация поисковиками намеренно отключена**, а базовый домен в конфиге временный.
> Что сделать при переезде на «боевой» хостинг и реальный домен — см. раздел [«Переезд на production»](#-переезд-на-production-и-включение-индексации).

---

## 🧱 Технологии

| | |
| :-- | :-- |
| Фреймворк | [Astro](https://astro.build) `^6.3.1` (статическая генерация, SSG) |
| Node.js | `>=22.12.0` (обязательно — на более старом Astro не соберётся) |
| JS на клиенте | чистый vanilla JS (без React/Vue) — квиз, калькулятор, форма |
| Аналитика | Yandex.Metrika |
| Форма заявок | PHP-обработчик `public/api/lead.php` (отправка на почту) |
| Шрифт | Playfair Display (Google Fonts) |

---

## 🚀 Быстрый старт (локально)

Из корня проекта в терминале:

```sh
npm install        # установить зависимости
npm run dev        # локальный сервер → http://localhost:4321
```

Прочие команды:

| Команда | Действие |
| :-- | :-- |
| `npm run dev` | Дев-сервер с горячей перезагрузкой на `localhost:4321` |
| `npm run build` | Собрать production-версию в `./dist/` |
| `npm run preview` | Локально посмотреть собранный `./dist/` перед деплоем |

> Папка `dist/` в `.gitignore` — она **не коммитится**, а генерируется на хостинге при сборке.

---

## 📁 Структура проекта

```text
magical-meridian/
├── public/                     # статика «как есть» (копируется в dist без обработки)
│   ├── api/lead.php            # обработчик формы заявки (нужен PHP-хостинг!)
│   ├── src/scripts/            # kitchen-calculator.js, main.js
│   ├── src/styles/             # kitchen-calculator.css
│   ├── fonts/                  # Giveny-Regular.ttf
│   └── images/                 # фото работ, материалы, блог, og-image.jpg
├── src/
│   ├── pages/                  # маршруты (файл = URL)
│   │   ├── index.astro         # главная
│   │   ├── catalog.astro       # каталог типов кухонь
│   │   ├── nashi-raboty.astro  # портфолио «Наши работы»
│   │   ├── blog.astro          # список статей
│   │   ├── articles/[slug].astro  # страница статьи (динамический маршрут)
│   │   ├── calculators/        # index.astro + kitchen.astro
│   │   ├── 404.astro
│   │   ├── robots.txt.ts        # генерация /robots.txt
│   │   └── sitemap.xml.ts       # генерация /sitemap.xml
│   ├── components/             # 11 компонентов (см. ниже)
│   ├── content/                # контент в markdown
│   │   ├── articles/           # 7 статей блога (.md)
│   │   └── cards/              # 3 карточки каталога (.md)
│   ├── data/                   # данные сайта (site, contacts, navigation, faq, works, catalog)
│   ├── layouts/BaseLayout.astro  # общий каркас страницы (<head>, шапка, подвал)
│   ├── styles/                 # variables.css, globals.css, components.css
│   └── content.config.ts       # описание коллекций контента
├── astro.config.mjs            # конфиг Astro (важно: поле `site`)
├── .nvmrc                       # версия Node для хостинга (22)
└── package.json
```

### Компоненты (`src/components`)

| Компонент | Назначение |
| :-- | :-- |
| `Header.astro` | Шапка: логотип, меню, телефоны салонов, бургер-меню |
| `Footer.astro` | Подвал: копирайт, быстрые ссылки |
| `Quiz.astro` | Квиз-подбор кухни (5 шагов) → заполняет форму |
| `GlobalForm.astro` | Форма заявки (имя, телефон, сообщение + UTM) → `/api/lead.php` |
| `FAQ.astro` | Блок вопросов-ответов (`<details>`) |
| `BlogCard.astro` | Карточка превью статьи |
| `Card.astro` | Универсальная карточка (каталог) |
| `Breadcrumbs.astro` | Хлебные крошки |
| `Seo.astro` | Мета-теги: title, description, robots, Open Graph, Twitter |
| `Schema.astro` | Микроразметка JSON-LD (Organization, Article, FAQ, Breadcrumbs и т.д.) |
| `Analytics.astro` | Код Yandex.Metrika |

---

## 🗺️ Страницы

| URL | Файл | Что это |
| :-- | :-- | :-- |
| `/` | `pages/index.astro` | Главная: hero, галерея, квиз, цены, FAQ, форма |
| `/catalog` | `pages/catalog.astro` | Типы кухонь + FAQ |
| `/nashi-raboty` | `pages/nashi-raboty.astro` | Портфолио (55 фото, галерея с модалкой) |
| `/blog` | `pages/blog.astro` | Список статей |
| `/articles/<slug>` | `pages/articles/[slug].astro` | Страница статьи (из `content/articles`) |
| `/calculators` | `pages/calculators/index.astro` | Хаб калькуляторов |
| `/calculators/kitchen` | `pages/calculators/kitchen.astro` | Калькулятор стоимости кухни |
| `/404` | `pages/404.astro` | Страница «не найдено» |

---

## ⚙️ Ключевые функции

- **Квиз** (`src/components/Quiz.astro`) — модальное окно из 5 шагов (тип кухни → расположение → размер → материал корпуса → материал фасада). Ответы подставляются в форму заявки.
- **Калькулятор кухни** (`src/pages/calculators/kitchen.astro` + `public/src/scripts/kitchen-calculator.js`) — считает диапазон цены по размерам, планировке, фасаду, столешнице, фурнитуре и технике; итог подставляется в форму.
- **Форма заявки** (`src/components/GlobalForm.astro`) — имя, телефон, сообщение + скрытые поля (URL страницы, referrer, UTM-метки). Отправляется POST-запросом на `public/api/lead.php`.

---

## ✍️ Контент

**Новая статья блога** — добавить `.md`-файл в `src/content/articles/`. Поля (frontmatter):

```markdown
---
title: 'Заголовок статьи'
description: 'Краткое описание'
pubDate: 2026-01-15
updatedDate: 2026-02-01   # необязательно
tags: ['кухни', 'дизайн']  # необязательно
image: '/images/blog/.../foto.webp'  # необязательно
---

Текст статьи в markdown…
```

**Карточка каталога** — `.md`-файл в `src/content/cards/` (поля: `title`, `shortDescription`, `slug`, `hasMedia`, при необходимости `seoTitle`, `seoDescription`).

Схемы коллекций описаны в `src/content.config.ts`.

---

## 🎨 Стили и тема

Цвета и размеры вынесены в CSS-переменные — `src/styles/variables.css`:

```css
--text: #000000;    /* основной текст */
--muted: #000000;   /* второстепенный текст */
--accent: #c85049;  /* фирменный красный (кнопки, акценты) */
```

- `src/styles/globals.css` — сброс, типографика, шрифт Playfair Display.
- `src/styles/components.css` — стили шапки, подвала, кнопок, карточек, форм, модалок.

---

## ☁️ Деплой (текущий)

Хостинг — **Cloudflare Pages**, собирает сайт сам из репозитория при каждом `git push`:

| Настройка | Значение |
| :-- | :-- |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (из `.nvmrc` + переменная окружения `NODE_VERSION=22`) |

Обновление сайта = обычный `git push` в ветку `main` → Cloudflare пересобирает автоматически.

> Файл `.github/workflows/deploy.yml` остался от прежней публикации на **GitHub Pages** и **сейчас не используется**. Его можно удалить.

---

## 🌐 Переезд на production и включение индексации

> Это главный чек-лист на будущее. Сейчас сайт **закрыт от индексации** и работает на временном домене. Когда заказчик примет сайт и появится боевой хостинг с реальным доменом **`kuhni-v-orenburge.ru`**, выполнить шаги ниже.

### 1. Прописать реальный домен

В `astro.config.mjs` (строка 6) заменить временный домен на реальный:

```js
// было
site: 'https://crashmegahi-del.github.io',
// стало
site: 'https://kuhni-v-orenburge.ru',
```

Поле `site` влияет на абсолютные ссылки в `sitemap.xml` и canonical-теги. Реальный домен уже указан в `src/data/site.ts` (строки 6 и 12) и как запасной вариант в `src/pages/sitemap.xml.ts` (строка 49).

### 2. Включить индексацию (обязательно ОБА пункта)

Сейчас индексация заблокирована в двух местах — снять оба:

1. **Мета-тег** — в `src/components/Seo.astro` (строка 14) убрать или закомментировать:
   ```html
   <meta name="robots" content="noindex, nofollow" />
   ```
2. **robots.txt** — в `src/pages/robots.txt.ts` вернуть разрешающее правило вместо запрета. Заменить тело на:
   ```
   User-agent: *
   Allow: /

   Sitemap: https://kuhni-v-orenburge.ru/sitemap.xml
   ```

> ⚠️ Важно снять **оба** блокировщика. Если оставить в `robots.txt` строку `Disallow: /`, поисковик не сможет зайти на страницы, и мета-тег `noindex` роли уже не сыграет.

### 3. Форма заявок требует PHP-хостинг ⚠️

Обработчик `public/api/lead.php` — это PHP-скрипт. **На статических хостингах (GitHub Pages, Cloudflare Pages) PHP не выполняется, и форма НЕ работает.** Варианты:

- переехать на хостинг **с поддержкой PHP** (тогда форма заработает как есть);
- либо заменить обработчик на внешний сервис форм (**Formspree**, **Web3Forms**) или на **Cloudflare Pages Functions**.

Сейчас письма из формы уходят на `morifass@mail.ru` (задано в `lead.php`).

### 4. Проверить заглушки перед запуском

| Где | Что заменить |
| :-- | :-- |
| `src/data/contacts.ts` | email `info@example.com` → реальный; Telegram `https://t.me/example` → реальный |
| `src/components/Analytics.astro` | счётчик Yandex.Metrika `108788706` — убедиться, что это счётчик заказчика |
| `public/images/og-image.jpg` | картинка-превью для соцсетей — поставить фирменную |
| `src/data/contacts.ts` | телефоны/адреса салонов — сверить с актуальными |

### 5. После деплоя

- Добавить сайт в **Яндекс.Вебмастер** и **Google Search Console**.
- Отправить туда `sitemap.xml` (`https://kuhni-v-orenburge.ru/sitemap.xml`).
- Проверить, что `https://kuhni-v-orenburge.ru/robots.txt` отдаёт `Allow: /`, а в HTML страниц больше нет `noindex`.

---

## 📌 Заметки

- Сайт полностью на русском (`ru-RU`), аналитика — Yandex.Metrika (не Google).
- Минимум клиентского JS: только квиз, калькулятор и отправка формы (без фреймворков).
- `dist/` не хранится в git — собирается на хостинге.
