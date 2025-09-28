// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  query: string;
  minPrice?: string;
  maxPrice?: string;
  type?: string;
  contact: { method: "telegram" | "email"; value: string };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body as Body;

    // מוודאים קלט בסיסי
    if (!body?.contact?.value || !body?.contact?.method) {
      return res.status(400).json({ ok: false, error: "Missing contact" });
    }

    // מרכיבים הודעה קריאה
    const msg =
      `🔔 Subscription Request\n` +
      `Query: ${body.query || "-"}\n` +
      `Filters: min=${body.minPrice || "-"}, max=${body.maxPrice || "-"}, type=${body.type || "-"}\n` +
      `Contact: ${body.contact.method} -> ${body.contact.value}`;

    // שולחים לטלגרם אם הוגדרו משתני סביבה
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
      });
    } else {
      // אם אין טוקן – לא נכשל, רק מודיעים בצד השרת
      console.log("[Subscribe] Missing Telegram env vars. Message:", msg);
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
