# Skill: site-deploy

> Skill для агента — как задеплоить лендинг / лид-магнит / клиентский сайт.
> Загружай on-demand когда Дима говорит «выкати сайт» / «опубликуй» / «pushni live».

---

## Когда применять

- Создал HTML-страницу (лендинг, клиентский сайт, лид-магнит)
- Нужно сделать её доступной по публичной ссылке
- Дима не хочет вникать в детали — нужен URL за 2 минуты

## Решение в 1 предложение

GitHub Pages бесплатно для статичных репо, Vercel auto-deploy для основных продуктовых сайтов. Деплой через `git push`.

---

## Два пути деплоя

### A. Vercel (для основных проектов: vda.vc, demis.world)

**Когда:** проект уже привязан к Vercel (`.vercel/` в корне или connected на Vercel.com)

```bash
git add <files>
git commit -m "Deploy: <что задеплоено>"
git push https://vasilevdasfo:<TOKEN>@github.com/vasilevdasfo/<repo>.git main
```

После push — Vercel автоматически собирает и публикует за 30-60 секунд.

**Проверка:** `curl -s -o /dev/null -w "%{http_code}\n" https://<domain>/<page>.html`

### B. GitHub Pages (для клиентских сайтов: promstroy-sites, etc)

**Когда:** простой статичный repo без Vercel

```bash
git add <files>
git commit -m "Deploy: <что>"
git push https://vasilevdasfo:<TOKEN>@github.com/vasilevdasfo/<repo>.git main
```

URL формата: `https://vasilevdasfo.github.io/<repo>/<page>.html`. Деплой 1-2 мин.

---

## Стандартные репо Димы

| Проект | Repo | Деплой | URL |
|---|---|---|---|
| Главный сайт | `vda-vc` | Vercel | https://vda.vc |
| Demis World | `demis-world` | Vercel | https://demis.world |
| Промстрой | `promstroy-sites` | GitHub Pages | https://vasilevdasfo.github.io/promstroy-sites/ |
| DEMI node | `demi-node` | — (только npm) | https://github.com/vasilevdasfo/demi-node |

---

## Версионирование (важное правило)

- `index.html` в корне репо = **ЖИВОЙ САЙТ**, никогда не перезаписывать без явной команды Димы
- Новые версии = отдельные файлы `v2.html`, `v3.html`, ... `vN.html` (порядковая нумерация)
- URL черновика: `vda.vc/v15.html`
- Чтобы сделать версию живой → скопировать содержимое в `index.html` (только по команде «сделай живым»)

## Mobile deploy check (обязательно перед push)

Перед `git push` любого HTML-файла:
1. Открой в Preview iframe `375×812`
2. Проверь `document.body.scrollWidth === 375` (нет horizontal overflow)
3. Скриншот hero + main content + closing — глазами

Если FAIL → fix `clamp()` на `font-size`, grid → `1fr` на 720px, padding меньше.

---

## После деплоя — обновить навигацию

Если создал новую версию или страницу:
1. Добавить в `6_ЛИЧНЫЙ_БРЕНД/Сайт/📍_САЙТ_ВЕРСИИ.md`
2. Обновить ссылку в проектном `CLAUDE.md`
3. Если новая страница — добавить ссылку в `index.html` (футер/контакты) живого сайта

---

## Анти-паттерны

- ❌ Не использовать `git add .` или `git add -A` — может затащить .env / секреты
- ❌ Не пушить в main без mobile-check
- ❌ Не перезаписывать `index.html` без явного «сделай живым»
- ❌ Не коммитить `node_modules/`, `.vercel/cache/`

---

## Если что-то сломалось

- Vercel deploy failed → https://vercel.com/dashboard, смотри build logs
- GitHub Pages 404 → проверь Settings → Pages → branch=main, root=/
- DNS не резолвит → у Namecheap A-запись `76.76.21.21` (для Vercel)

Полная мастер-инструкция в vault: `5_БАЗА_ЗНАНИЙ/reference_deploy_master.md`
