// pages/api/ingest.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const INGEST_SECRET = process.env.INGEST_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://filterflow.vercel.app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
    if (!INGEST_SECRET || req.headers["x-webhook-secret"] !== INGEST_SECRET)
      return res.status(401).json({ ok: false, error: "Unauthorized" });

    const body = req.body || {};
    const payload = {
      title: body.title || null,
      description: body.description || null,
      price: body.price ?? null,
      monthly_rent: body.monthly_rent ?? null,
      cap_rate: body.cap_rate ?? null,
      roi: body.roi ?? null,
      state: body.state || null,
      location: body.location || [body.city, body.state].filter(Boolean).join(", "),
      bedrooms: body.bedrooms ?? null,
      bathrooms: body.bathrooms ?? null,
      sqft: body.sqft ?? null,
      property_type: body.property_type || null,
      year_built: body.year_built ?? null,
      lot_size: body.lot_size ?? null,
      arv_estimate: body.arv_estimate ?? null,
      status: body.status || "For Sale",
      image_url: body.image_url || null,
      tags: body.tags || [],
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      source: body.source || "manual",
      source_url: body.source_url || null,
    };

    const { data, error } = await supabase
      .from("Listing")
      .upsert(payload, { onConflict: "source_url" })
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(500).json({ ok: false, error: "Failed to insert listing" });

    // שלח בקשה לבדוק התראות מתאימות
    await fetch(`${BASE_URL}/api/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": INGEST_SECRET,
      },
      body: JSON.stringify({ listing_id: data.id }),
    });

    return res.status(200).json({ ok: true, listing: data });
  } catch (e: any) {
    console.error("INGEST error:", e.message);
    return res.status(500).json({ ok: false, error: e.message || "Server error" });
  }
}
