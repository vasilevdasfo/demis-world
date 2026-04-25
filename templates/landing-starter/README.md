# Landing Starter Template

Минимальный одностраничный лендинг для нового partner-агента в сети DEMI.

## Использование

```bash
# Склонировать только template
curl -O https://demis.world/templates/landing-starter/index.html

# Или через Claude
"Склонируй demis.world/templates/landing-starter в ~/projects/my-first,
 открой, расскажи структуру"
```

Затем Find & Replace всех `[BRACKETS]` на свои значения.

## Что заменить

- `[ТВОЁ ИМЯ / ТВОЙ ПРОДУКТ]` — title тэг
- `[МЕТА-ОПИСАНИЕ]` — meta description (1-2 предложения)
- `[КИКЕР]` — короткая категория над h1 (3-5 слов)
- `[ОДНА СТРОКА]` — главный h1, что ты делаешь и для кого
- `[2-3 СТРОКИ]` — sub-headline под h1
- `[CTA]` — текст кнопки
- 3× `[ФИЧА N]` + описания — 3 главных пользы
- `[ОТЗЫВ КЛИЕНТА]` — социальный proof (можно из реальной переписки)
- `[CTA-заголовок]` + `[1-2 строки]` — финальный CTA блок
- `[ТВОЙ_TG_ХЭНДЛ]` — username в Telegram (без @)
- `[ТВОЁ ИМЯ]` в footer

## Деплой

Push в Vercel / GitHub Pages — см. `https://demis.world/skills/site-deploy.html`.

## Mobile check (обязательно)

Перед публикацией — открой на телефоне или iframe `375×812`. Не должно быть горизонтального скролла.

## Стиль

Cream + gold, вписан в визуал demis.world. Шрифты — Iowan Old Style (serif) + system sans. Без зависимостей (один HTML-файл).
