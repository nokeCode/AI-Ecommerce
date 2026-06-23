"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    // Vider le panier après paiement réussi
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div style={{ maxWidth: "600px", margin: "80px auto", padding: "0 24px" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "16px",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "96px",
            height: "96px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "2px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <CheckCircle size={48} style={{ color: "var(--success)" }} />
        </div>

        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "16px",
            fontWeight: 700,
          }}
        >
          Paiement réussi!
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}
        >
          Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre achat et le numéro de suivi.
        </p>

        {sessionId && (
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              wordBreak: "break-all",
            }}
          >
            <div style={{ color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600 }}>
              Numéro de session
            </div>
            {sessionId}
          </div>
        )}

        <div
          style={{
            background: "rgba(68, 119, 151, 0.08)",
            border: "1px solid rgba(68, 119, 151, 0.2)",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <Package
            size={20}
            style={{ color: "var(--accent-gold)", flexShrink: 0 }}
          />
          <div style={{ fontSize: "0.85rem", textAlign: "left" }}>
            <div
              style={{
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "2px",
              }}
            >
              Prochaine étape
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              Votre commande sera préparée et expédiée dans les 2-3 jours ouvrables.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Link href="/products" style={{ textDecoration: "none", display: "block" }}>
            <button
              className="btn-primary"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              Continuer les achats
              <ArrowRight size={18} />
            </button>
          </Link>

          <Link href="/" style={{ textDecoration: "none", display: "block" }}>
            <button
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.88rem",
              }}
            >
              Retour à l&apos;accueil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
