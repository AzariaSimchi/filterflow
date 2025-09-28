import type { NextApiRequest, NextApiResponse } from "next";

type Item = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

type Ok = { ok: true; results: Item[] };
type Err = { ok: false; error: string };

const DATA: Item[] = [
  {
    id: "1",
    title: "מדריך לשימוש – FilterFlow",
    description: "איך מחפשים מחירים ומקבלים תוצאות מהירות ומדויקות.",
    tags: ["מדריך", "חיפוש", "מחיר"],
  },
  {
    id: "2",
    title: "חיבור ל-Supabase",
    description: "דוגמה איך לעבור דאטה קומי ולחסוך נתונים מאוחסנים.",
    tags: ["supabase", "database"],
  },
  {
    id: "3",
    title: "עיצוב UX נקי",
    description: "עקרונות ליצירת חוויית משתמש פשוטה ונעימה במובייל.",
    tags: ["ux", "mobile", "design"],
  },
  {
    id: "4",
    title: "טיפים ל-Next.js",
    description: "וידיאו על שימוש ב-API Routes, ניהול State וטיפים חשובים.",
    tags: ["nextjs", "tips"],
  },
];

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0591-\u05C7]/g, "");

function scoreItem(item: Item, q: string) {
  const nq = normalize(q);
  const fields = [
    normalize(item.title),
    normalize(item.description),
    normalize(item.tags.join(" ")),
  ];

  let score = 0;
  if (fields[0].includes(nq)) score += 5;
  if (fields[1].includes(nq)) score += 2;
  if (fields[2].includes(nq)) score += 1;
  return score;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.status(200).json({ ok: true, results: DATA.slice(0, 4) });

    const scored = DATA
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.item);

    return res.status(200).json({ ok: true, results: scored });
  } catch (e: any) {
    return res
      .status(500)
      .json({ ok: false, error: e.message || "Server error" });
  }
}
