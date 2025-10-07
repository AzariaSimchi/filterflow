// pages/api/notify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const INGEST_SECRET = process.env.INGEST_SECRET;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
    if (!INGEST_SECRET || req.headers["x-webhook-secret"] !== INGEST_SECRET)
      return res.status(401).json({ ok: false, error: "Unauthorized" });

    const { listing_id } = req.body || {};
    if (!listing_id) return res.status(400).json({ ok: false, error: "Missing listing_id" });

    // שלוף את הנכס
    const { data: listing, error } = await supabase
      .from("Listing")
      .select("*")
      .eq("id", listing_id)
      .single();
    if (error || !listing) throw error || new Error("Listing not found");

    // שלוף את כל ההתראות הפעילות
    const { data: notifs } = await supabase.from("Notifications").select("*").eq("active", true);
    if (!notifs?.length) return res.status(200).json({ ok: true, matched: 0 });

    let matched = 0;

    for (const n of notifs) {
      if (n.state && listing.state && n.state.toLowerCase() !== listing.state.toLowerCase()) continue;
      if (n.property_type && listing.property_type && n.property_type.toLowerCase() !== listing.property_type.toLowerCase()) continue;
      if (n.min_price && listing.price && listing.price < n.min_price) continue;
      if (n.max_price && listing.price && listing.price > n.max_price) continue;
      if (n.min_roi && listing.roi && listing.roi < n.min_roi) continue;
      if (n.min_cap && listing.cap_rate && listing.cap_rate < n.min_cap) continue;

      // נמצא התאמה
      matched++;

      if (BOT_TOKEN && CHAT_ID) {
        const text =
          `🏡 *Deal Match Found!*\n\n` +
          `📍 *${listing.title || "Untitled"}*\n` +
          `💰 Price: $${listing.price?.toLocaleString() || "N/A"}\n` +
          `📈 ROI: ${listing.roi ?? "N/A"}% | Cap Rate: ${listing.cap_rate ?? "N/A"}%\n` +
          `🏠 Type: ${listing.property_type || "N/A"} | ${listing.state || ""}\n\n` +
          (listing.source_url ? `🔗 [View Listing](${listing.source_url})` : "") +
          (listing.image_url ? `\n🖼 ${listing.image_url}` : "");

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: "Markdown",
          }),
        });
      }
    }

    return res.status(200).json({ ok: true, matched });
  } catch (e: any) {
    console.error("NOTIFY error:", e.message);
    return res.status(500).json({ ok: false, error: e.message || "Server error" });
  }
}
