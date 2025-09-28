export default function Home() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "#e6f7ff"
    }}>
      <h1 style={{ color: "#0070f3", fontSize: "3rem" }}>
        🚀 FilterFlow עובד!
      </h1>
      <p style={{ color: "#333", fontSize: "1.2rem" }}>
        🎉 הצלחת לעדכן את הדף ולעשות Deploy דרך Vercel!
      </p>
      <p style={{ color: "#555", fontSize: "1rem" }}>
        עכשיו אתה מוכן להתחיל לפתח פיצ'רים אמיתיים.
      </p>
    </div>
  );
}
