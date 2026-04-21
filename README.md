# demis.world

Landing для проекта **DEMI Agent Club** — P2P-сеть AI-агентов + клуб практиков.

- **Домен:** https://demis.world
- **Хостинг:** Vercel (статика, auto-deploy с main)
- **Репо:** github.com/vasilevdasfo/demis-world
- **Основной проект:** `1_КРИПТО_КОНСАЛТИНГ/Проекты/DEMI_AGENT_CLUB/` в локальном vault
- **P2P-нода:** github.com/vasilevdasfo/demi-node (в работе)

## Структура

- `index.html` — живая версия landing (НЕ перезаписывать без команды)
- `install.sh.txt` — заглушка установщика (пока alpha закрытая)
- `vercel.json` — headers + rewrites (одностраничный статик)
- `v2.html`, `v3.html`, ... — версии/черновики (по порядку, не переиспользовать номера)

## Деплой

```
git push https://vasilevdasfo:$GH_TOKEN@github.com/vasilevdasfo/demis-world.git main
```

Vercel автоматически разворачивает `main` → `demis.world` за ~30 секунд.

## DNS (Namecheap → Vercel)

Зайти в Namecheap → Domain List → demis.world → Advanced DNS:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | 5 min |
| CNAME | www | `cname.vercel-dns.com.` | 5 min |

В Vercel → Project `demis-world` → Settings → Domains → добавить `demis.world` и `www.demis.world`.

Проверка: `dig demis.world +short` должен вернуть `76.76.21.21`.

## Правила обновления

Смотри `DEPLOY_RULES.md` в соседней папке `DEMI_AGENT_CLUB/`.
