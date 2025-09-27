import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.query.secret;
  if (!secret || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    const body = req.body;
    const chatId = body?.message?.chat?.id;
    if (chatId) {
      await supabase.from('users').upsert({ tg_chat_id: chatId }, { onConflict: 'tg_chat_id' });
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: 'Connected ✅ You will receive alerts here.' }),
      });
    }
    return res.status(200).json({ ok: true });
  }

  res.status(200).json({ ok: true });
}
