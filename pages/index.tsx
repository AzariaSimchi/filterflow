// pages/index.tsx
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRoi: "",
    minCap: "",
    type: "",
    state: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

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
    } catch {
      setError("שגיאת שרת – נסה שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>🏡 FilterFlow</h1>
        <p style={styles.subtitle}>מצא את עסקאות הנדל״ן המשתלמות ביותר בארה״ב</p>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 הקלד עיר, מדינה או סוג נכס..."
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="submit" style={styles.button}>חפש</button>
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
            <div style={styles.row}>
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
            </div>

            <div style={styles.row}>
              <input
                type="number"
                placeholder="מינימום ROI (%)"
                value={filters.minRoi}
                onChange={(e) => setFilters({ ...filters, minRoi: e.target.value })}
                style={styles.inputSmall}
              />
              <input
                type="number"
                placeholder="מינימום Cap Rate (%)"
                value={filters.minCap}
                onChange={(e) => setFilters({ ...filters, minCap: e.target.value })}
                style={styles.inputSmall}
              />
            </div>

            <div style={styles.row}>
              <input
                type="text"
                placeholder="מדינה (State)"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                style={styles.inputSmall}
              />
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                style={styles.inputSmall}
              >
                <option value="">סוג נכס</option>
                <option value="Single Family">Single Family</option>
                <option value="Multi-Family">Multi-Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {loading && <p style={styles.loading}>🔄 מחפש תוצאות...</p>}
      {error && <p style={styles.error}>⚠️ שגיאה: {error}</p>}

      <section style={styles.results}>
        {results.length > 0 &&
          results.map((item) => (
            <div key={item.id} style={styles.card} onClick={() => setSelectedItem(item)}>
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} style={styles.image} />
              ) : (
                <div style={styles.imagePlaceholder}>📷 אין תמונה</div>
              )}
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.location || "לא צוין מיקום"}</p>

              <div style={styles.infoGrid}>
                <span>💰 {item.price ? `$${item.price.toLocaleString()}` : "N/A"}</span>
                <span>💵 שכירות: {item.monthly_rent ? `$${item.monthly_rent}` : "N/A"}</span>
                <span>📈 ROI: {item.roi ? `${item.roi}%` : "N/A"}</span>
                <span>💹 Cap Rate: {item.cap_rate ? `${item.cap_rate}%` : "N/A"}</span>
              </div>
            </div>
          ))}
      </section>

      {selectedItem && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedItem(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {selectedItem.image_url && (
              <img src={selectedItem.image_url} alt={selectedItem.title} style={styles.modalImage} />
            )}
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description || "אין תיאור זמין"}</p>

            <div style={styles.infoGrid}>
              <span>🏠 סוג: {selectedItem.property_type || "לא צוין"}</span>
              <span>📍 מיקום: {selectedItem.location || "לא צוין"}</span>
              <span>💰 מחיר: ${selectedItem.price?.toLocaleString()}</span>
              <span>💵 שכירות: ${selectedItem.monthly_rent?.toLocaleString()}</span>
              <span>📈 ROI: {selectedItem.roi ? `${selectedItem.roi}%` : "N/A"}</span>
              <span>💹 Cap Rate: {selectedItem.cap_rate ? `${selectedItem.cap_rate}%` : "N/A"}</span>
              <span>📏 גודל: {selectedItem.sqft ? `${selectedItem.sqft} sqft` : "N/A"}</span>
              <span>🗓️ שנת בנייה: {selectedItem.year_built || "N/A"}</span>
              <span>📊 מצב: {selectedItem.status || "לא צוין"}</span>
            </div>

            <button style={styles.secondaryButton} onClick={() => setSelectedItem(null)}>סגור</button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: any = {
  page: { fontFamily: "Arial, sans-serif", background: "linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)", minHeight: "100vh", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" },
  hero: { textAlign: "center", marginBottom: "2rem" },
  title: { fontSize: "2.5rem", color: "#0070f3", margin: 0 },
  subtitle: { fontSize: "1rem", marginBottom: "1rem" },
  searchForm: { display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "420px" },
  actions: { display: "flex", gap: "0.5rem", justifyContent: "center" },
  input: { padding: "0.7rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" },
  inputSmall: { padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", width: "100%" },
  button: { backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" },
  secondaryButton: { backgroundColor: "#e5e7eb", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" },
  filterBox: { background: "#fff", padding: "1rem", borderRadius: "8px", marginTop: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "0.7rem" },
  row: { display: "flex", gap: "0.5rem" },
  results: { display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "600px" },
  card: { background: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer" },
  cardTitle: { margin: 0, fontSize: "1.2rem", color: "#0070f3" },
  cardDesc: { margin: "0.3rem 0", color: "#444" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 1rem", fontSize: "0.9rem", color: "#333" },
  image: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" },
  imagePlaceholder: { width: "100%", height: "200px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", color: "#666" },
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
  modal: { background: "#fff", borderRadius: "10px", padding: "1rem", width: "100%", maxWidth: "480px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflowY: "auto", maxHeight: "90vh" },
  modalImage: { width: "100%", borderRadius: "10px", marginBottom: "1rem" },
  loading: { fontSize: "1.1rem", color: "#555" },
  error: { color: "red", fontWeight: "bold" },
};
