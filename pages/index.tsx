import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

type ApiResponse =
  | { ok: true; results: Item[] }
  | { ok: false; error: string };

const DEBOUNCE_MS = 280;

export default function Home() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);
  const debouncer = useRef<number | null>(null);

  // קיצור מקלדת: / לפוקוס, ESC לניקוי
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || ""))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQ("");
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // קריאה ל-API עם דיבאונס וביטול בקשה קודמת
  useEffect(() => {
    if (debouncer.current) {
      window.clearTimeout(debouncer.current);
    }
    debouncer.current = window.setTimeout(async () => {
      if (controller.current) controller.current.abort();
      controller.current = new AbortController();

      setLoading(true);
      setError(null);
      try {
        const url = q ? `/api/search?q=${encodeURIComponent(q)}` : `/api/search`;
        const res = await fetch(url, { signal: controller.current.signal });
        const data: ApiResponse = await res.json();

        if (!data.ok) throw new Error(data.error || "שגיאה לא ידועה");
        setResults(data.results);
      } catch (err: any) {
        if (err?.name !== "AbortError") setError(err.message || "שגיאה");
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debouncer.current) window.clearTimeout(debouncer.current);
    };
  }, [q]);

  const hasQuery = q.trim().length > 0;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.brand}>🚀 FilterFlow</Link>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>בית</Link>
          <Link href="/about" style={styles.navLink}>אודות</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <h1 style={styles.title}>מצא כל דבר, בשנייה</h1>
        <p style={styles.subtitle}>חיפוש חכם, מהיר, ופשוט לשימוש. לחץ <kbd style={styles.kbd}>/</kbd> בשביל פוקוס.</p>

        <div style={styles.searchWrap} aria-label="חיפוש">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="מה תרצה למצוא?"
            aria-label="שדה חיפוש"
            style={styles.input}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {!!q && (
            <button
              onClick={() => setQ("")}
              aria-label="נקה חיפוש"
              style={styles.clearBtn}
            >
              ×
            </button>
          )}
        </div>

        {loading && (
          <div style={styles.loading}>מחפש…</div>
        )}

        {error && (
          <div role="alert" style={styles.error}>שגיאה: {error}</div>
        )}

        {!loading && !error && (
          <>
            {!hasQuery && <EmptyHint />}
            {hasQuery && results.length === 0 && (
              <div style={styles.empty}>
                לא נמצאו תוצאות עבור “{q}”. נסה מילה אחרת.
              </div>
            )}
            {results.length > 0 && (
              <ul style={styles.list} aria-live="polite">
                {results.map((item) => (
                  <li key={item.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <span style={styles.cardTitle}>
                        {highlight(item.title, q)}
                      </span>
                      <div style={styles.tags}>
                        {item.tags.map((t) => (
                          <span key={t} style={styles.tag}>#{t}</span>
                        ))}
                      </div>
                    </div>
                    <p style={styles.cardDesc}>{highlight(item.description, q)}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <footer style={styles.footer}>
        <span>© {new Date().getFullYear()} FilterFlow</span>
      </footer>
    </div>
  );
}

function EmptyHint() {
  return (
    <div style={styles.empty}>
      התחל להקליד בשדה החיפוש כדי לראות תוצאות לדוגמה.
    </div>
  );
}

// היילייט פשוט לטקסט תואם
function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after  = text.slice(idx + q.length);
  return (
    <>
      {before}<mark style={styles.mark}>{match}</mark>{after}
    </>
  );
}

const styles: Record<string, any> = {
  page: { minHeight: "100vh", background: "#f6fbff", display: "flex", flexDirection: "column" },
  header: {
    height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 16px", borderBottom: "1px solid #e6eef5", background: "#ffffffcc", backdropFilter: "saturate(180%) blur(8px)", position: "sticky", top: 0, zIndex: 10
  },
  brand: { fontWeight: 700, color: "#0a66ff", textDecoration: "none" },
  nav: { display: "flex", gap: 12 },
  navLink: { color: "#333", textDecoration: "none" },
  main: { flex: 1, maxWidth: 900, width: "100%", margin: "0 auto", padding: "32px 16px", textAlign: "center" },
  title: { fontSize: "2.4rem", margin: "8px 0 4px", color: "#0d47a1" },
  subtitle: { color: "#4b5563", marginBottom: 20 },
  kbd: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    border: "1px solid #e5e7eb", borderBottomWidth: 2, padding: "2px 6px", borderRadius: 6, background: "#fff"
  },
  searchWrap: { position: "relative", maxWidth: 560, margin: "0 auto" },
  input: {
    width: "100%", padding: "14px 44px 14px 14px", fontSize: "1rem",
    borderRadius: 12, border: "1px solid #d1e3f5", outline: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)", transition: "border .15s",
  },
  clearBtn: {
    position: "absolute", right: 8, top: 8, width: 32, height: 32, borderRadius: 8,
    border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer"
  },
  loading: { marginTop: 18, color: "#6b7280" },
  error: { marginTop: 18, color: "#b91c1c", background: "#fee2e2", padding: "8px 12px", borderRadius: 8, display: "inline-block" },
  empty: { marginTop: 24, color: "#6b7280" },
  list: { marginTop: 20, textAlign: "left", listStyle: "none", padding: 0 },
  card: {
    background: "#fff", border: "1px solid #e6eef5", borderRadius: 12, padding: 16, marginBottom: 12,
    boxShadow: "0 2px 6px rgba(13,71,161,0.04)"
  },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  cardTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" },
  tags: { display: "flex", gap: 8, flexWrap: "wrap" },
  tag: { background: "#eef2ff", color: "#3730a3", border: "1px solid #e0e7ff", fontSize: 12, padding: "2px 8px", borderRadius: 999 },
  cardDesc: { color: "#374151", marginTop: 6 },
  mark: { background: "#fffae6", padding: "0 2px", borderRadius: 4 },
  footer: { borderTop: "1px solid #e6eef5", background: "#fff", padding: 16, textAlign: "center", color: "#6b7280" },
};
