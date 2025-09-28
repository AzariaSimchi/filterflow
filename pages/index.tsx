import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.ok) setResults(data.results);
      else setError(data.error || "אירעה שגיאה");
    } catch (err) {
      setError("שגיאת שרת – נסה שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>🏡 FilterFlow</h1>
        <p style={styles.subtitle}>
          מצא את עסקאות הנדל"ן המשתלמות ביותר בארה"ב בקליק אחד.
        </p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="הקלד מיקום, עיר או סוג נכס..."
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            חפש עכשיו
          </button>
        </form>
      </section>

      {loading && <p style={styles.loading}>🔄 מחפש תוצאות...</p>}
      {error && <p style={styles.error}>שגיאה: {error}</p>}

      <section style={styles.results}>
        {results.length > 0 &&
          results.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.description}</p>
              <div style={styles.tags}>
                {item.tags.map((tag: string) => (
                  <span key={tag} style={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

const styles: any = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(135deg, #f0f4ff 0%, #dfe9ff 100%)",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hero: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "3rem",
    color: "#0070f3",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "1.5rem",
  },
  searchForm: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "center",
    maxWidth: "400px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "background 0.3s ease",
  },
  loading: { fontSize: "1.1rem", color: "#555" },
  error: { color: "red", fontWeight: "bold" },
  results: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "600px",
  },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "right",
    animation: "fadeIn 0.3s ease-in-out",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.2rem",
    color: "#0070f3",
  },
  cardDesc: { margin: "0.5rem 0", color: "#444" },
  tags: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  tag: {
    background: "#e0e7ff",
    padding: "0.2rem 0.5rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    color: "#3730a3",
  },
};
