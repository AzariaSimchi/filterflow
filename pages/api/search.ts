// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || "").trim();

    // שליפה של כל הנתונים מהטבלה Listing
    const { data, error } = await supabase
      .from("Listing")
      .select("*")
      .ilike("title", `%${q}%`);

    if (error) throw error;

    return res.status(200).json({ ok: true, results: data || [] });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message || "Server Error" });
  }
}
