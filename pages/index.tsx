export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #e0f7fa, #e3f2fd)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* כותרת ראשית */}
      <h1
        style={{
          color: "#0070f3",
          fontSize: "3rem",
          marginBottom: "0.5rem",
        }}
      >
        🚀 FilterFlow עובד!
      </h1>

      {/* תיאור קצר */}
      <p
        style={{
          color: "#333",
          fontSize: "1.2rem",
          maxWidth: "400px",
          marginBottom: "1.5rem",
        }}
      >
        הצלחת לעדכן את הדף! עכשיו אתה מוכן להתחיל לפתח פיצ'רים אמיתיים.
      </p>

      {/* כפתור ניווט */}
      <a
        href="/about"
        style={{
          backgroundColor: "#0070f3",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "1.1rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
      >
        ➡️ לעמוד הבא
      </a>
    </div>
  );
}
