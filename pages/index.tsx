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
      if (data.ok) {
        setResults(data.results);
      } else {
        setError(data.error || "אירעה שגיאה");
      }
    } catch (err) {
      setError("שגיאת שרת – נסה שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍 מצא כל דבר, בשנייה</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="מה תרצה למצוא?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          חפש
        </button>
      </form>

      {loading && <p>טוען תוצאות...</p>}
      {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((item) => (
          <li
            key={item.id}
            style={{
              background: "#f9f9f9",
              padding: "1rem",
              marginBottom: "0.5rem",
              borderRadius: "5px",
              textAlign: "right",
            }}
          >
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <p style={{ margin: "0.5rem 0" }}>{item.description}</p>
            <small>תגיות: {item.tags.join(", ")}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
