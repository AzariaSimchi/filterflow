import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "", type: "" });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const res = await fetch(`/api/search?${params.toString()}`);
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
        <p style={styles.subtitle}>מצא את עסקאות הנדל"ן המשתלמות ביותר בארה"ב בקליק אחד</p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="הקלד מיקום, עיר או סוג נכס..."
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="submit" style={styles.button}>🔎 חפש</button>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              ⚙️ סינון מתקדם
            </button>
          </div>
        </form>

        {showFilters && (
          <div style={styles.filterBox}>
            <input
              type="number"
              placeholder="מחיר מינימום"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              style={styles.inputSmall}
            />
            <input
              type="number"
              placeholder="מחיר מקסימום"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              style={styles.inputSmall}
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              style={styles.inputSmall}
            >
              <option value="">סוג נכס</option>
              <option value="house">בית פרטי</option>
              <option value="duplex">דופלקס</option>
              <option value="multi-family">רב משפחתי</option>
            </select>
          </div>
        )}
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
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
              <button style={styles.notifyButton}>📩 קבל התראה על נכסים דומים</button>
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
  hero: { textAlign: "center", marginBottom: "2rem" },
  title: { fontSize: "2.5rem", color: "#0070f3", margin: 0 },
  subtitle: { fontSize: "1rem", marginBottom: "1rem" },
  searchForm: { display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" },
  actions: { display: "flex", gap: "0.5rem", justifyContent: "center" },
  input: { padding: "0.7rem", borderRadius: "8px", border: "1px solid #ccc" },
  inputSmall: { padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%" },
  button: {
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  filterBox: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "0.5rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  results: { display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "600px" },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  cardTitle: { margin: 0, fontSize: "1.2rem", color: "#0070f3" },
  cardDesc: { margin: "0.5rem 0", color: "#444" },
  tags: { display: "flex", flexWrap: "wrap", gap: "0.3rem" },
  tag: {
    background: "#e0e7ff",
    padding: "0.2rem 0.5rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    color: "#3730a3",
  },
  notifyButton: {
    backgroundColor: "#facc15",
    border: "none",
    borderRadius: "8px",
    padding: "0.4rem 0.8rem",
    marginTop: "0.5rem",
    cursor: "pointer",
  },
  loading: { fontSize: "1.1rem", color: "#555" },
  error: { color: "red", fontWeight: "bold" },
};
