export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #e0f7fa, #f1f8ff)"
    }}>
      <h1 style={{ color: "#0070f3", fontSize: "3rem", marginBottom: "1rem" }}>
        🚀 FilterFlow עובד!
      </h1>
      <p style={{ color: "#333", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        🎉 הצלחת לעדכן את הדף ולפרוס ל־Vercel בהצלחה!
      </p>
      <button
        style={{
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
        }}
        onClick={() => alert("הכפתור עובד! 🎯")}
      >
        לחץ כאן לבדיקה
      </button>
      <p style={{ color: "#555", fontSize: "0.9rem", marginTop: "2rem" }}>
        עכשיו אפשר להתחיל לפתח פיצ'רים אמיתיים.
      </p>
    </div>
  );
}
