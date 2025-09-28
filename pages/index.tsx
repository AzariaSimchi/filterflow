export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #e0f7fa, #e3f2fd)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#0070f3",
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        🚀 FilterFlow עובד!
      </h1>

      <p
        style={{
          color: "#333",
          fontSize: "1.2rem",
          maxWidth: "600px",
          marginBottom: "20px",
        }}
      >
        🎉 הצלחת לעדכן את הדף ולעשות Deploy דרך Vercel!
      </p>

      <p
        style={{
          color: "#555",
          fontSize: "1rem",
          maxWidth: "500px",
        }}
      >
        עכשיו אתה מוכן להתחיל לפתח פיצ׳רים אמיתיים.
      </p>

      <a
        href="/about"
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        מעבר לעמוד אודות →
      </a>
    </div>
  );
}
