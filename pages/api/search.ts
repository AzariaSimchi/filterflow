import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// חיבור ל-Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || "").trim();

    // נשלוף נתונים מטבלת Listing
    let query = supabase.from("Listing").select("*");

    // אם המשתמש הכניס חיפוש – נרחיב את זה גם לשדות אחרים
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,location.ilike.%${q}%,state.ilike.%${q}%,description.ilike.%${q}%`
      );
    } else {
      query = query.limit(20); // אם אין חיפוש – נחזיר 20 תוצאות ראשונות
    }

    const { data, error } = await query;

    if (error) throw error;

    // עיבוד הנתונים לתצורה נוחה לממשק
    const safeData = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title || "No title",
      description: row.description || "",
      price: row.price || null,
      monthly_rent: row.monthly_rent || null,
      cap_rate: row.cap_rate || null,
      roi: row.roi || null,
      state: row.state || "",
      location: row.location || "",
      bedrooms: row.bedrooms || null,
      bathrooms: row.bathrooms || null,
      sqft: row.sqft || null,
      property_type: row.property_type || "",
      year_built: row.year_built || null,
      lot_size: row.lot_size || null,
      arv_estimate: row.arv_estimate || null,
      status: row.status || "",
      image_url: row.image_url || "",
      tags: row.tags ? (Array.isArray(row.tags) ? row.tags : [row.tags]) : [],
    }));

    return res.status(200).json({ ok: true, results: safeData });
  } catch (e: any) {
    console.error("Supabase error:", e.message);
    return res.status(500).json({ ok: false, error: e.message || "Server Error" });
  }
}
