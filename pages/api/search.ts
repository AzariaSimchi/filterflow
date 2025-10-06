import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || "").trim();

    // נשלוף נתונים מטבלת Listing
    let query = supabase.from("Listing").select("*");

    if (q) query = query.ilike("title", `%${q}%`);

    const { data, error } = await query;

    if (error) throw error;

    // נוודא שכל הנתונים בפורמט שהדף יודע לקרוא
    const safeData = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title || "No title",
      description: row.description || "",
      tags: row.tags ? (Array.isArray(row.tags) ? row.tags : [row.tags]) : [],
    }));

    return res.status(200).json({ ok: true, results: safeData });
  } catch (e: any) {
    console.error("Supabase error:", e.message);
    return res.status(500).json({ ok: false, error: e.message || "Server Error" });
  }
}
