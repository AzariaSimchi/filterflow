import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// --------- תצורה ---------

// מקורות נתונים לדוגמא (אפשר להחליף ל-RSS/XML אמיתיים של שווקי נדל"ן/בלוגים/MLS של הספקים שלך)
const FEEDS: { name: string; url: string; city?: string; state?: string }[] = [
  { name: "Example Feed Miami",  url: "https://hnrss.org/newest?points=100", city: "Miami",  state: "FL" },
  { name: "Example Feed Austin", url: "https://hnrss.org/newest?points=80",  city: "Austin", state: "TX" },
  // תוסיף כאן מקורות אמיתיים (RSS/Atom/XML/JSON endpoints) מהפלטפורמות שלך
];

// סף סינון – ARV% מינימלי
const MIN_ARV_PERCENT = Number(process.env.MIN_ARV_PERCENT || 30);

// סוד פשוט לקריאה ידנית (מגן על ה-API)
const CRON_SECRET = process.env.CRON_SECRET || "";

// פרטי טלגרם
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// פרטי מייל (Gmail מומלץ עם App Password)
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
const EMAIL_TO   = process.env.EMAIL_TO   || "azariagarage@gmail.com";

// --------- עזר: שליחת טלגרם/מייל ---------

async function sendTelegram(text: string) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
  } catch (e) {
    console.error("Telegram error:", e);
  }
}

async function sendEmail(subject: string, html: string) {
  if (!SMTP_USER || !SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      html,
    });
  } catch (e) {
    console.error("Email error:", e);
  }
}

// --------- עזר: נורמליזציה/חישובים ---------

/** חישוב ARV% בסיסי: (ARV - price) / price * 100 */
function calcArvPercent(price?: number | null, arv?: number | null) {
  if (!price || !arv || price <= 0) return null;
  return ((arv - price) / price) * 100;
}

/** ניסיון לחלץ מחיר/ARV מטקסט חופשי של פיד (placeholder לפידים שאין להם שדות מובנים) */
function tryExtractNumbers(s?: string | null) {
  if (!s) return { price: null as number | null, arv: null as number | null };
  const nums = (s.match(/\$?\d[\d,]*/g) || []).map(x => Number(x.replace(/[^\d]/g, "")));
  // נניח שהמספר הראשון – price, השני – ARV (אם קיים)
  return { price: nums[0] || null, arv: nums[1] || null };
}

// בדיקת קיום בליסטינג (מונע כפילויות) – לפי כותרת+מיקום
async function listingExists(title: string, location: string) {
  const { data, error } = await supabaseAdmin
    .from("Listing")
    .select("id")
    .eq("title", title)
    .eq("location", location)
    .limit(1);

  if (error) throw error;
  return !!(data && data.length);
}

// שמירת נכס חדש
async function saveListing(row: any) {
  const { error } = await supabaseAdmin.from("Listing").insert(row);
  if (error) throw error;
}

// --------- הסורק ---------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // הגנה בסיסית לקריאה ידנית
    if (CRON_SECRET && req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const parser = new Parser();
    const found: any[] = [];
    const notified: any[] = [];

    for (const feed of FEEDS) {
      try {
        const rss = await parser.parseURL(feed.url);

        for (const item of rss.items || []) {
          const title = (item.title || "").trim();
          const link  = (item.link  || "").trim();
          const desc  = (item.contentSnippet || item.content || item.summary || "").trim();

          // כל עוד אין שדות price/ARV אמיתיים בפיד – נעשה ניסוי חילוץ
          const { price, arv } = tryExtractNumbers(`${title} ${desc}`);

          // נתוני ברירת מחדל
          const location = feed.city && feed.state ? `${feed.city}, ${feed.state}` : (item.creator || feed.name);
          const arvPct = calcArvPercent(price, arv);

          const row = {
            title: title || "Unknown Listing",
            description: desc || null,
            price: price || null,
            monthly_rent: null,
            cap_rate: null,
            roi: arvPct,            // נשמור את ה-ARV% בשדה roi לצורך תצוגה
            state: feed.state || null,
            location,
            bedrooms: null,
            bathrooms: null,
            sqft: null,
            property_type: null,
            year_built: null,
            lot_size: null,
            arv_estimate: arv || null,
            status: "Imported",
            image_url: null,
            tags: rss.title ? [rss.title] : [],
          };

          // דילוג על רשומות ריקות לגמרי
          if (!title) continue;

          // מניעת כפילויות
          const exists = await listingExists(row.title, row.location || "");
          if (exists) continue;

          // שמירה
          await saveListing(row);
          found.push({ ...row, link });

          // תנאי התראה
          if (arvPct !== null && arvPct >= MIN_ARV_PERCENT) {
            const text =
              `🔥 Deal Found (${arvPct.toFixed(1)}% ARV)\n` +
              `🏷️ ${row.title}\n` +
              (row.location ? `📍 ${row.location}\n` : "") +
              (row.price ? `💵 Price: $${row.price.toLocaleString()}\n` : "") +
              (row.arv_estimate ? `📈 ARV: $${row.arv_estimate.toLocaleString()}\n` : "") +
              (link ? `🔗 ${link}` : "");

            await sendTelegram(text);

            const html =
              `<h3>🔥 New Deal (${arvPct.toFixed(1)}% ARV)</h3>
               <div>
                 <div><b>${row.title}</b></div>
                 ${row.location ? `<div>📍 ${row.location}</div>` : ""}
                 ${row.price ? `<div>💵 Price: $${row.price.toLocaleString()}</div>` : ""}
                 ${row.arv_estimate ? `<div>📈 ARV: $${row.arv_estimate.toLocaleString()}</div>` : ""}
                 ${link ? `<div>🔗 <a href="${link}" target="_blank">Open</a></div>` : ""}
               </div>`;

            await sendEmail(`🔥 Deal ${arvPct.toFixed(1)}% – ${row.title}`, html);
            notified.push(row);
          }
        }
      } catch (feedErr) {
        console.error(`[SCRAPER] feed ${feed.name} failed:`, feedErr);
      }
    }

    return res.status(200).json({ ok: true, scanned: FEEDS.length, saved: found.length, notified: notified.length });
  } catch (e: any) {
    console.error("SCRAPER fatal:", e);
    return res.status(500).json({ ok: false, error: e.message || "Server error" });
  }
}
