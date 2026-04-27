# 🎨 DEMI Design System v1.0

> Единая дизайн-система для всех сайтов под брендом demis.world / vda.vc.
> Версия 1.0 от 2026-04-26 · Применяется автоматически при создании любого нового HTML.

---

## 📐 Главное правило: 3 темы, не путать назначение

| Тема | Класс на `<body>` | Когда применять | Эстетика |
|---|---|---|---|
| **Public Dark** | `theme-public-dark` | Публичные продающие лендинги для холодного трафика (B2B premium, UHNWI, крипта/финтех) | Чёрный + золото `#c9a961`, sans-serif, glow |
| **Public Light** | `theme-public-light` | Партнёрские/white-label/классические лендинги | Cream `#f8f5ee` + золото `#a07d2a`, **Iowan Old Style serif** |
| **Tool** | `theme-tool` | **Внутренние инструменты:** dashboards, sales-deck, decisions, audits, admin-панели | Светлый Google Material `#f8f9fa` + Material Blue `#4285F4` |

### 🚨 Правило #1 — НИКОГДА не путать tool с public

**`theme-tool` — это для работы, не для холодного трафика.**

- Если файл предназначен **продавать незнакомому человеку** → `theme-public-dark` или `theme-public-light`
- Если файл предназначен **тебе работать** (карман, квиз, дашборд, админка, decision-page) → `theme-tool`

Признаки tool:
- Файл лежит в `00_DECISIONS/`, `dashboards/`, или содержит `noindex,nofollow`
- Цель — оперировать данными/опциями, не убеждать
- Будет читаться при ярком свете на ноуте, не на айфоне на диване
- Содержит таблицы, фильтры, чекбоксы, копи-кнопки

**Прошлая ошибка (26.04):** sales-deck.html был сделан в `theme-public-dark` (gold/black) — это карман продавца, должен быть `theme-tool`. Перепилили.

---

## 🧩 Подключение

Любой новый HTML начинается так:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>...</title>
<link rel="stylesheet" href="/styles/demi.css">
<!-- кастомные override-стили только при крайней необходимости -->
</head>
<body class="theme-tool">  <!-- или theme-public-dark / theme-public-light -->
  ...
</body>
</html>
```

Для standalone HTML (не на demis.world): подключи `<link rel="stylesheet" href="https://demis.world/styles/demi.css">` или скопируй файл локально.

---

## 🎨 Палитры (CSS-переменные)

Все цвета доступны через CSS-переменные, не хардкодь hex. Если нужен цвет — он либо уже есть, либо **добавь в demi.css**, не в файл.

```css
/* Базовые — есть во всех темах */
var(--bg)             /* основной фон */
var(--bg-2)           /* вторичный фон (карточки на bg) */
var(--surface)        /* поверхность карточек */
var(--surface-2)      /* поверхность 2 уровня */
var(--line)           /* стандартные границы */
var(--line-strong)    /* акцентные границы */
var(--fg)             /* основной текст */
var(--fg-mute)        /* приглушённый текст */
var(--accent)         /* акцентный цвет (золото или blue) */
var(--accent-bright)  /* яркий акцент */
var(--accent-ink)     /* контрастный текст на accent-фоне */
var(--success)        /* зелёный */
var(--danger)         /* красный */
var(--info)           /* синий (инфо) */
var(--shadow)         /* shadow для карточек */
```

Только в `theme-tool`:
- `var(--gold)` — для редких золотых акцентов в инструменте
- `var(--warn)` — Material Yellow

---

## 📦 Готовые компоненты

Все классы из `demi.css`. Не изобретай заново — переиспользуй.

### Layout
- `.container` (max 1080px), `.container-narrow` (760), `.container-wide` (1440)
- `section.block` — секция с верхним border + padding
- `.grid-auto`, `.grid-auto-sm` — auto-fit grids

### Типографика
- `h1`, `h2`, `h3` — стилизованы автоматически
- `.kicker` — uppercase подзаголовок над h1
- `.lead` — вводный абзац под h1
- `.mute` — приглушённый текст

### Nav (только для лендингов)
```html
<nav class="demi-nav">
  <div class="row">
    <a href="/" class="logo">DEMI</a>
    <div class="links"><a href="#x">Раздел</a></div>
    <a href="#cta" class="btn btn-primary btn-sm">CTA</a>
  </div>
</nav>
```

### Кнопки
- `.btn .btn-primary` — основная (accent)
- `.btn .btn-ghost` — вторичная (outline)
- Модификаторы: `.btn-sm`, `.btn-lg`

### Карточки
```html
<div class="card hoverable">
  <div class="card-pull">Главная фраза</div>
  <div class="card-ctx">Контекст</div>
  <div class="card-meta">Когда применять</div>
</div>
```

### Бейджи
- `.badge .badge-accent` / `.badge-success` / `.badge-danger` / `.badge-warn` / `.badge-mute`

### Табы
```html
<div class="demi-tabs">
  <button class="demi-tab active" data-t="a">A</button>
  <button class="demi-tab" data-t="b">B</button>
</div>
<section class="demi-section active" id="a">...</section>
<section class="demi-section" id="b">...</section>
```
JS-логика: переключение по `data-t` ↔ `id`.

### Toast
```html
<div class="toast" id="toast">✓ Сделано</div>
<script>document.getElementById('toast').classList.add('show'); setTimeout(()=>document.getElementById('toast').classList.remove('show'),1400)</script>
```

### Approve-кнопка (правило CLAUDE.md)
```html
<button class="approve-btn" onclick="alert('Напишите Дмитрию: сделай file.html живым')">✅ Approve → live</button>
```

---

## 📱 Mobile checklist (обязательно перед push)

1. `body.scrollWidth === window.innerWidth` на 375px (нет горизонтального overflow)
2. h1 читается на 320px
3. Все CTA-кнопки нажимаемы пальцем (≥44px высота)
4. Nav на мобиле скрывает .links (это уже в demi.css)
5. Tabs не уезжают за экран (flex-wrap включён)

Запуск проверки:
```bash
# Если есть preview_resize MCP
preview_start → preview_resize preset=mobile → проверить scrollWidth
# Иначе вручную через Chrome DevTools 375×812
```

Скилл: `5_БАЗА_ЗНАНИЙ/Инструменты/mobile-deploy-check/SKILL.md`

---

## 🚦 Перед deploy: checklist

- [ ] `<body class="theme-...">` — выбрана правильная тема
- [ ] Подключен `<link rel="stylesheet" href="/styles/demi.css">`
- [ ] Нет inline-палитры (`#000`, `#fff`) — только переменные
- [ ] Mobile-deploy-check пройден (375×812)
- [ ] Approve-кнопка добавлена (если черновик)
- [ ] Добавлен в `📍_САЙТ_ВЕРСИИ.md`
- [ ] `git push` → проверка curl

---

## 🔄 Как обновлять систему

Если нужен новый компонент или нашёл баг:
1. **НЕ копируй CSS в файл** — добавь в `demi.css` и обнови все файлы
2. Bump версию в шапке `demi.css` (1.0 → 1.1)
3. Допиши секцию в этот документ
4. Обнови `_SITE_ROUTER.md` если изменились правила выбора скилла

---

## 📚 Связанные документы

- `5_БАЗА_ЗНАНИЙ/Инструменты/_SITE_ROUTER.md` — какой скилл когда использовать
- `5_БАЗА_ЗНАНИЙ/Инструменты/mobile-deploy-check/SKILL.md` — обязательная mobile-проверка
- `5_БАЗА_ЗНАНИЙ/Инструменты/landing-gen/SKILL.md` — генератор одиночного лендинга
- `5_БАЗА_ЗНАНИЙ/Инструменты/site-redesign/SKILL.md` — редизайн (4 файла)
- `5_БАЗА_ЗНАНИЙ/Инструменты/quick-decisions/SKILL.md` — decision-pages
- `5_БАЗА_ЗНАНИЙ/Инструменты/deep-research-dashboard/SKILL.md` — research-дашборды
- `5_БАЗА_ЗНАНИЙ/Инструменты/demi-build/SKILL.md` — production multi-agent build
- `6_ЛИЧНЫЙ_БРЕНД/Сайт/📍_САЙТ_ВЕРСИИ.md` — каталог версий vda.vc
