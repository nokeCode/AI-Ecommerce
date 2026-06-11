"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X, Gem } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/products", label: "Produits" },
    { href: "/cart", label: "Panier" },
  ];

  return (
    <header
      style={{
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "linear-gradient(90deg, var(--accent-gold-dim), var(--accent-gold), var(--accent-gold-dim))",
          padding: "6px 0",
          textAlign: "center",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          color: "#0a0a0f",
          fontWeight: 700,
        }}
      >
        ✦ LIVRAISON OFFERTE DÈS 150€ · RETOURS SOUS 30 JOURS ✦
      </div>

      {/* Main nav */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
          gap: "32px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gem size={18} color="#0a0a0f" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              LUXE
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "var(--accent-gold)",
                lineHeight: 1,
              }}
            >
              BOUTIQUE
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav
          style={{ display: "flex", gap: "32px", alignItems: "center" }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                fontWeight: 500,
                transition: "color 0.2s",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--accent-gold)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-secondary)")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/products"
            style={{
              color: "var(--text-secondary)",
              transition: "color 0.2s",
              display: "flex",
            }}
            title="Rechercher"
          >
            <Search size={20} />
          </Link>

          <Link
            href="/cart"
            style={{
              position: "relative",
              color: "var(--text-secondary)",
              transition: "color 0.2s",
              display: "flex",
            }}
            title="Panier"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "var(--accent-gold)",
                  color: "#0a0a0f",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "none",
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-subtle)",
            padding: "16px 24px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
