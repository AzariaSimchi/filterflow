// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Body = {
  query: string;
  minPrice?: string;
  maxPrice?: string;
  minRoi?: string;
  minCap?: string;
  type?: string;
  state?: string;
  contact: { method: "telegram" | "email"; value: string };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body as Body;

    // בדיקת קלט
    if (!body?.contact?.value || !body?.contact?.method) {
      return res.status(400).json({ ok: false, error: "Missing contact" });
    }

    // שומרים ב־Supabase (אם יש טבלת Notifications)
    try {
      const { error: dbError } = await supabase.from("Notifications").insert([
        {
          query: body.query || null,
          min_price: body.minPrice ? Number(body.minPrice) : null,
          max_price: body.maxPrice ? Number(body.maxPrice) : null,
          min_roi: body.minRoi ? Number(body.minRoi) : null,
          min_cap: body.minCap ? Number(body.minCap) : null,
          property_type: body.type || null,
          state: body.state || null,
          contact_method: body.contact.method,
          contact_value: body.contact.value,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) console.error("Supabase insert error:", dbError.message);
    } catch (e) {
      console.warn("⚠️ Couldn't save to Supabase:", e);
    }

    // מרכיבים הודעה קריאה
    const msg =
      `🔔 בקשת התראה חדשה:\n\n` +
      `🔎 חיפוש: ${body.query || "-"}\n` +
      `💰 מחיר: ${body.minPrice || "-"} - ${body.maxPrice || "-"}\n` +
      `📈 ROI מינימלי: ${body.minRoi || "-"}%\n` +
      `🏦 Cap Rate מינימלי: ${body.minCap || "-"}%\n` +
      `🏠 סוג: ${body.type || "-"} | מדינה: ${body.state || "-"}\n\n` +
      `📩 יצירת קשר: ${body.contact.method} → ${body.contact.value}`;

    // שולחים לטלגרם (אם מוגדרים משתני סביבה)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
      });
    } else {
      console.log("[Subscribe] Missing Telegram ENV vars. Message:", msg);
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("Subscribe error:", e.message);
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
