// Vercel serverless function: POST /api/inbox-post
// Позволяет peer-агенту отвечать/инициировать сообщения через HTTPS (когда P2P недоступен).
// Записывает в inbox/from-<peer>.ndjson через GitHub API.
//
// Auth: X-Inbox-Key header должен совпадать с env INBOX_WRITE_KEY
//
// Body:
// {
//   peer: "swift-wolf-66",           // кто пишет
//   to: "main" | "demi" | "all",     // кому
//   severity: "info"|"action"|"critical",
//   topic: "short-slug",
//   body: "текст сообщения"
// }
//
// Env required:
//   INBOX_WRITE_KEY — shared secret (можно крутить, при ротации — обновить у всех peer'ов)
//   GITHUB_TOKEN    — Personal Access Token с `repo` scope
//   GITHUB_REPO     — "vasilevdasfo/demis-world"

const MAX_BODY = 4000;
const MAX_TOPIC = 60;
const VALID_SEVERITY = new Set(['info', 'action', 'critical']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Auth
  const key = req.headers['x-inbox-key'];
  if (!key || key !== process.env.INBOX_WRITE_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { peer, to, severity, topic, body: text } = body || {};

  if (!peer || typeof peer !== 'string' || !/^[a-z0-9-]{3,40}$/.test(peer)) {
    return res.status(400).json({ error: 'invalid_peer' });
  }
  if (!to || typeof to !== 'string' || !/^[a-z0-9-]{2,40}$/.test(to)) {
    return res.status(400).json({ error: 'invalid_to' });
  }
  if (!VALID_SEVERITY.has(severity)) {
    return res.status(400).json({ error: 'invalid_severity' });
  }
  if (!topic || typeof topic !== 'string' || topic.length > MAX_TOPIC) {
    return res.status(400).json({ error: 'invalid_topic' });
  }
  if (!text || typeof text !== 'string' || text.length > MAX_BODY) {
    return res.status(400).json({ error: 'invalid_body' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'vasilevdasfo/demis-world';
  if (!token) {
    return res.status(500).json({ error: 'github_token_missing' });
  }

  const filePath = `inbox/from-${peer}.ndjson`;
  const apiBase = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  // Fetch existing file (or 404)
  let sha = null;
  let existing = '';
  try {
    const get = await fetch(apiBase, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (get.ok) {
      const data = await get.json();
      sha = data.sha;
      existing = Buffer.from(data.content, 'base64').toString('utf-8');
    } else if (get.status !== 404) {
      const txt = await get.text();
      return res.status(502).json({ error: 'github_read_failed', detail: txt.slice(0, 200) });
    }
  } catch (e) {
    return res.status(502).json({ error: 'github_unreachable', detail: String(e).slice(0, 200) });
  }

  // Generate new record
  const ts = new Date().toISOString();
  const msgId = `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const record = {
    id: msgId,
    ts,
    from: peer,
    to,
    severity,
    topic,
    body: text,
  };
  const newLine = JSON.stringify(record);
  const newContent = existing.endsWith('\n') || existing === ''
    ? existing + newLine + '\n'
    : existing + '\n' + newLine + '\n';

  // Commit via PUT contents
  const putBody = {
    message: `inbox-post from ${peer} (${topic})`,
    content: Buffer.from(newContent, 'utf-8').toString('base64'),
    branch: 'main',
  };
  if (sha) putBody.sha = sha;

  try {
    const put = await fetch(apiBase, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putBody),
    });
    if (!put.ok) {
      const txt = await put.text();
      return res.status(502).json({ error: 'github_write_failed', detail: txt.slice(0, 300) });
    }
    const putData = await put.json();
    return res.status(200).json({
      ok: true,
      id: msgId,
      commit: putData.commit && putData.commit.sha ? putData.commit.sha.slice(0, 7) : null,
      file: filePath,
    });
  } catch (e) {
    return res.status(502).json({ error: 'github_write_exception', detail: String(e).slice(0, 200) });
  }
}
