import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <h2 style={{ fontFamily: "'Georgia', serif", color: "var(--text-primary)", fontSize: "2rem", marginBottom: "16px" }}>
        Page introuvable
      </h2>
      <Link href="/">
        <button style={{
          background: "linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))",
          color: "var(--text-primary)",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
        }}>
          Retour à l&apos;accueil
        </button>
      </Link>
    </div>
  );
}
