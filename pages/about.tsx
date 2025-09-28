export default function About() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #fff8e1, #ffecb3)",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#f57c00", fontSize: "2.5rem" }}>📄 עמוד חדש</h1>
      <p style={{ color: "#333", fontSize: "1.2rem", maxWidth: "400px" }}>
        ברוך הבא לעמוד הבא שלך! כאן תוכל להוסיף עוד תוכן, פיצ'רים ותפריטים.
      </p>

      <a
        href="/"
        style={{
          marginTop: "20px",
          backgroundColor: "#f57c00",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "1rem",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ef6c00")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f57c00")}
      >
        ⬅️ חזרה לעמוד הראשי
      </a>
    </div>
  );
}
