// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { q = "", minPrice, maxPrice, type } = req.query;

    // מתחילים שאילתה לטבלת Listing
    let queryBuilder = supabase.from("Listing").select("*");

    if (q) {
      queryBuilder = queryBuilder.ilike("location", `%${q}%`);
    }
    if (minPrice) {
      queryBuilder = queryBuilder.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.lte("price", Number(maxPrice));
    }
    if (type) {
      queryBuilder = queryBuilder.eq("type", type);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true, results: data });
  } catch (e: any) {
    console.error("❌ Server Error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
