import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// חיבור ל-Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || "").trim();
    const {
      minPrice,
      maxPrice,
      minRoi,
      minCap,
      type,
      state,
    } = req.query;

    let query = supabase.from("Listing").select("*");

    // 🔍 חיפוש טקסט חופשי
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,location.ilike.%${q}%,state.ilike.%${q}%,description.ilike.%${q}%`
      );
    }

    // 💰 פילטרים לפי מחיר
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));

    // 🏘️ סוג נכס
    if (type) query = query.ilike("property_type", `%${type}%`);

    // 🌎 סינון לפי State
    if (state) query = query.ilike("state", `%${state}%`);

    // 📈 אחרי שמבצעים את השאילתה, נחשב ROI ו־Cap
    const { data, error } = await query.limit(100);

    if (error) throw error;

    const results = (data || [])
      .map((row: any) => {
        // חישוב ROI / Cap Rate אם חסרים
        let roi = row.roi;
        let cap = row.cap_rate;

        if (!roi && row.monthly_rent && row.price) {
          roi = ((row.monthly_rent * 12) / row.price * 100).toFixed(2);
        }
        if (!cap && row.monthly_rent && row.price) {
          cap = ((row.monthly_rent * 12) / row.price * 100).toFixed(2);
        }

        return {
          id: row.id,
          title: row.title || "No title",
          description: row.description || "",
          price: row.price || null,
          monthly_rent: row.monthly_rent || null,
          cap_rate: cap,
          roi,
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
        };
      })
      // מסנן לפי ROI/Cap Rate אחרי החישוב
      .filter((r) => {
        if (minRoi && r.roi && Number(r.roi) < Number(minRoi)) return false;
        if (minCap && r.cap_rate && Number(r.cap_rate) < Number(minCap)) return false;
        return true;
      });

    return res.status(200).json({ ok: true, results });
  } catch (e: any) {
    console.error("Supabase search error:", e.message);
    return res.status(500).json({ ok: false, error: e.message || "Server Error" });
  }
}
