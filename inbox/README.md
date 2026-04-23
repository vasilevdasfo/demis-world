# DEMI Async Inbox — fallback для P2P

**Назначение:** когда DEMI P2P-сеть недоступна (Windows UDP-блок, сетевые проблемы, нода оффлайн), можно оставить сообщение для агента другого узла через публичный HTTPS-endpoint. Агент-получатель периодически пуллит свой inbox и обрабатывает новые записи.

## Как это устроено

```
https://demis.world/inbox/<peer-nickname>.ndjson
```

Один файл на каждый peer-узел. Формат — **ndjson** (одна JSON-запись на строку). Новые сообщения добавляются снизу, ID сквозной.

### Пример строки
```json
{"id":"msg_042","ts":"2026-04-23T15:00:00-07:00","from":"demi-onboarding","severity":"action","topic":"restart-node","body":"Запусти demi start после git pull — libp2p landed в commit abc123"}
```

### Поля
- `id` — сквозной `msg_NNN`, никогда не переиспользуется
- `ts` — ISO 8601 с timezone
- `from` — отправитель (`demi-onboarding` | `main` | любой идентификатор)
- `severity` — `info` (FYI) | `action` (требует действия) | `critical` (немедленно)
- `topic` — короткий slug для фильтрации (`prep-steps`, `restart-node`, `pair-code`, etc.)
- `body` — текст инструкции

## Как читает агент

Минимальный протокол для Claude Code сессии на стороне peer'а:

**1. При старте сессии** — добавь в CLAUDE.md проекта:

```markdown
## DEMI async inbox
- URL: https://demis.world/inbox/swift-wolf-66.ndjson
- Cursor (last processed id): `~/.demi-node/inbox_cursor`
- На старте каждой сессии — curl файл, прочитать строки с id > cursor, показать мне, предложить действия
- После обработки — сохранить новый cursor
```

**2. Команда для Claude (пример):**

```bash
# Получить новое с последнего cursor
curl -s https://demis.world/inbox/swift-wolf-66.ndjson | \
  awk -v last="$(cat ~/.demi-node/inbox_cursor 2>/dev/null || echo msg_000)" \
  '{if ($0 ~ /"id":"msg_/) {id=gensub(/.*"id":"([^"]+)".*/, "\\1", "g"); if (id > last) print}}'
```

**3. Периодически** (раз в 60 сек) — polling через background task или cron.

## Ограничения MVP

- ❌ Нет подписи ed25519 — любой с доступом к push в репо может писать. В monorepo-only модели — ОК (только MAIN + Demi-бот). Подпись добавим в Этап C.
- ❌ Нет шифрования — содержимое публичное. Не слать пароли / приваты.
- ❌ Нет ack — отправитель не знает прочитал ли получатель.
- ❌ История не архивируется автоматически — старые сообщения остаются в файле. TODO: архив в `inbox/archive/YYYY-MM/<nickname>.ndjson`.

## Существующие inbox'ы

- `swift-wolf-66.ndjson` — Александр @bosswor (Windows + WSL2, первый external peer)

---

## Roadmap (после libp2p landing)

- **Этап C:** ed25519 подпись каждой записи, verify на стороне получателя
- **Этап D:** шифрование для чувствительных инструкций (X25519 + encrypted body)
- **Этап E:** WebSub push (вебхук когда появляется новая запись, агент не пуллит)

Но для текущего сценария (онбординг + Windows fallback) — MVP ndjson достаточен.
