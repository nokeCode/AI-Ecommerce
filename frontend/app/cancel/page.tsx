"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react";

export default function CancelPage() {
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
            background: "rgba(239, 68, 68, 0.1)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <AlertCircle size={48} style={{ color: "var(--error)" }} />
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
          Paiement annulé
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}
        >
          Votre paiement a été annulé. Vos articles sont toujours dans votre panier et prêts pour le paiement.
        </p>

        <div
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "32px",
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
            Pourquoi cela s&apos;est-il produit?
          </div>
          <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
            <li>Vous avez fermé la page de paiement</li>
            <li>Votre paiement a été refusé</li>
            <li>Une erreur technique s&apos;est produite</li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Link href="/cart" style={{ textDecoration: "none", display: "block" }}>
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
              <ShoppingCart size={18} />
              Retour au panier
            </button>
          </Link>

          <Link href="/products" style={{ textDecoration: "none", display: "block" }}>
            <button
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ArrowLeft size={15} />
              Continuer les achats
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
