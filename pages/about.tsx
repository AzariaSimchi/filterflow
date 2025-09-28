import Link from "next/link";

export default function About() {
  return (
    <div style={page}>
      <div style={card}>
        <div style={{ fontSize: 46, marginBottom: 10 }}>ℹ️</div>
        <h1 style={title}>עמוד האודות</h1>
        <p style={desc}>
          כאן תוכל לספר על הפרויקט שלך, עליך או כל דבר שתרצה.
        </p>
        <Link href="/" style={btn}>← חזרה לדף הבית</Link>
      </div>
    </div>
  );
}

const page: any = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #fde7ff 0%, #f6e5ff 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};
const card: any = {
  background: "#fff",
  maxWidth: 720,
  width: "100%",
  padding: 28,
  borderRadius: 18,
  border: "1px solid #f0e6ff",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(109,40,217,0.08)"
};
const title: any = { fontSize: "2rem", margin: "8px 0 12px", color: "#6d28d9" };
const desc: any  = { color: "#4b5563", marginBottom: 22, lineHeight: 1.7 };
const btn: any   = {
  display: "inline-block",
  background: "#6d28d9",
  color: "#fff",
  textDecoration: "none",
  padding: "10px 18px",
  borderRadius: 10
};
