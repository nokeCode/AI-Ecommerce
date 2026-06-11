"use client";

import Link from "next/link";
import { Gem, Heart, Star, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "48px 24px 24px",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Gem size={16} color="var(--bg-primary)" />
              </div>
              <span
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--text-primary)",
                }}
              >
                LUXE BOUTIQUE
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
              L&apos;excellence artisanale au quotidien. Chaque pièce sélectionnée avec soin pour les connaisseurs du beau.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {[Heart, Star, Share2].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    transition: "all 0.2s",
                    display: "flex",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-gold-dim)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 700,
              }}
            >
              Navigation
            </h4>
            {["Accueil", "Produits", "Panier"].map((item) => (
              <Link
                key={item}
                href={item === "Accueil" ? "/" : `/${item.toLowerCase()}`}
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  padding: "5px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-muted)")
                }
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Service */}
          <div>
            <h4
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 700,
              }}
            >
              Service Client
            </h4>
            {["Livraison & Retours", "FAQ", "Contact", "Mentions légales"].map((item) => (
              <div
                key={item}
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  padding: "5px 0",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 700,
              }}
            >
              Newsletter
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "12px" }}>
              Actualités, nouvelles collections, offres exclusives.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                placeholder="votre@email.com"
                className="search-input"
                style={{ flex: 1, borderRadius: "8px", padding: "9px 14px", fontSize: "0.82rem" }}
              />
              <button
                className="btn-primary"
                style={{ padding: "9px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.8rem" }}
              >
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider-gold" style={{ marginBottom: "20px" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            © 2025 Luxe Boutique. Tous droits réservés.
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Paiement sécurisé · SSL · RGPD
          </span>
        </div>
      </div>
    </footer>
  );
}
