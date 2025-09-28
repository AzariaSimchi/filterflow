export default function About() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #fce4ec, #e1bee7)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#6a1b9a",
          fontSize: "2.5rem",
          marginBottom: "15px",
        }}
      >
        ℹ️ עמוד האודות
      </h1>

      <p
        style={{
          color: "#333",
          fontSize: "1.2rem",
          maxWidth: "600px",
          marginBottom: "20px",
        }}
      >
        זהו עמוד האודות שלך. כאן תוכל לספר על הפרויקט, עליך, או כל דבר שתרצה.
      </p>

      <a
        href="/"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#6a1b9a",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        ← חזרה לדף הבית
      </a>
    </div>
  );
}
