import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// חיבור ל-Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { q = "", minPrice, maxPrice, minRoi, minCap, type, state } = req.query;

    let query = supabase.from("Listing").select("*");

    // סינון לפי מילות חיפוש
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%,state.ilike.%${q}%`
      );
    }

    // סינון לפי טווח מחירים / ROI / Cap
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (minRoi) query = query.gte("roi", Number(minRoi));
    if (minCap) query = query.gte("cap_rate", Number(minCap));
    if (type) query = query.ilike("property_type", `%${type}%`);
    if (state) query = query.ilike("state", `%${state}%`);

    const { data, error } = await query.limit(50);

    if (error) throw error;

    const safeData = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
      monthly_rent: row.monthly_rent,
      cap_rate: row.cap_rate,
      roi: row.roi,
      state: row.state,
      location: row.location,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      sqft: row.sqft,
      property_type: row.property_type,
      year_built: row.year_built,
      lot_size: row.lot_size,
      arv_estimate: row.arv_estimate,
      status: row.status,
      image_url: row.image_url,
      tags: row.tags || [],
    }));

    res.status(200).json({ ok: true, results: safeData });
  } catch (e: any) {
    console.error("Search error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
}
