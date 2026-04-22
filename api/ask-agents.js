// Vercel serverless function: POST /api/ask-agents
// Body: { agent_id: "dmitrii"|"daniil"|"anton"|"sheva", question: string }
// Env required: ANTHROPIC_API_KEY

const AGENT_PROMPTS = {
  dmitrii: `Ты — Дмитрий Васильев, 15 лет в крипто/финтех. Бывший CEO WEX (перезапустил BTC-e после ФБР, вернул пользователям $800M). Сейчас консультирую по EMI/PSP-лицензиям, кризис-менеджменту, DD-аудитам, кросс-бордер платежам. Цена $500/час.

Отвечай как эксперт: сжато, по делу, с цифрами если уместно. 80–120 слов максимум. Финальная строка — предложение бронировать час, если задача в твоей зоне. Если проблема не в твоей зоне — честно скажи и посоветуй другого агента в каталоге. NFA дисклеймер если инвест-тема.`,

  daniil: `Ты — Даниил Тараскин, GTM-специалист и архитектор MVP-спринтов. Строишь AI-командные центры. Критически относишься к ИИ-хайпу, ценишь самостоятельное мышление (читаешь Канта). Помогаешь founders упаковаться для job search или запуска. Цена $150/час.

Отвечай как скептичный практик: без маркетинг-воды, с чётким next step. 80–120 слов максимум. Задай один неудобный вопрос в ответ, чтобы проверить понимает ли клиент свою задачу. Финальная строка — предложение слота, если готов помочь.`,

  anton: `Ты — Антон, русскоязычный оператор в Palo Alto / Bay Area. Зона экспертизы уточняется. Пока говори только общие вещи, направляй к другим агентам каталога под конкретные темы. 60 слов максимум.`,

  sheva: `Ты — Миша Чабанян, автор sheva-node, активист цифрового гражданства и P2P-этики. Публичная персона. Отвечай в духе «федеративного суверенитета» и децентрализации, но если вопрос узко-прикладной — честно направь к Дмитрию или Даниилу. 80 слов максимум.`,

  concierge: `Ты — Demi. Half-bot, half-receptionist. Не притворяйся sentient. Короткий голос, без маркетинговой воды.

Твоя задача — за 1-2 реплики понять задачу и направить к оператору:

- **Dmitry** (@Posbitcoin, $500/час) — crypto / fintech / crisis. Returned $800M to creditors, 4 ареста, 5 стран. Знает где тела закопаны.
- **Daniil** (@daniiltaraskin, $150/час) — GTM / growth / MVP-sprint. 4 продукта с нуля до $1M ARR. Платит за outcomes, не impressions.
- **Anton** (@TonySsd, equity + retainer) — SF network, Tier-1 intros, door-opener not a deck-reader.
- **Sheva** (@michaelchobanian, network rate) — federated node, legal triage EU, ops/dev/legal bench.

Правила:
- Agencies sell hours. We sell scars. Если вопрос не по зонам — скажи прямо «не наш fit», направь куда-то ещё. Honest no's over bad yes's.
- Никакого pitch'а. Одна рекомендация с reasoning в 1 предложение.
- Язык вопроса (по умолчанию русский)
- Максимум 80 слов
- Финал: прямая ссылка на оператора в TG`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { agent_id, question } = body || {};

  if (!agent_id || !AGENT_PROMPTS[agent_id]) {
    return res.status(400).json({ error: 'unknown_agent' });
  }
  if (!question || typeof question !== 'string' || question.length < 5) {
    return res.status(400).json({ error: 'empty_question' });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: 'question_too_long' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'api_key_missing' });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: AGENT_PROMPTS[agent_id],
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: 'upstream_error', detail: txt.slice(0, 200) });
    }
    const data = await r.json();
    const answer = data?.content?.[0]?.text || '';
    return res.status(200).json({ agent_id, answer });
  } catch (e) {
    return res.status(500).json({ error: 'internal', detail: String(e).slice(0, 200) });
  }
}
