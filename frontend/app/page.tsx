"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, RefreshCw, Headphones, Star, ChevronRight } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const featured = PRODUCTS.slice(0, 4);

  const trustItems = [
    { icon: Truck, title: "Livraison offerte", desc: "Dès 150€ d'achat" },
    { icon: Shield, title: "Paiement sécurisé", desc: "SSL 256 bits" },
    { icon: RefreshCw, title: "Retours 30 jours", desc: "Sans condition" },
    { icon: Headphones, title: "Support 24/7", desc: "Experts disponibles" },
  ];

  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        style={{
          minHeight: "88vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, #eff6fb 100%)",
        }}
      >
        {/* Background geometric */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 70% 50%, rgba(68,119,151,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 30% 30% at 20% 20%, rgba(68,119,151,0.04) 0%, transparent 60%)
            `,
          }}
        />
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(68,119,151,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(68,119,151,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 24px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Left content */}
          <div>
            <div
              className="animate-fade-in-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                background: "rgba(68,119,151,0.08)",
                border: "1px solid var(--accent-gold-dim)",
                borderRadius: "100px",
                marginBottom: "24px",
              }}
            >
              <Star size={12} fill="currentColor" style={{ color: "var(--accent-gold)" }} />
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "var(--accent-gold)", textTransform: "uppercase", fontWeight: 700 }}>
                Collection 2025
              </span>
            </div>

            <h1
              className="animate-fade-in-up delay-100"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "24px",
                letterSpacing: "-0.02em",
              }}
            >
              L&apos;Art du
              <br />
              <span className="text-gold-shimmer">Beau Objet</span>
              <br />
              <span style={{ color: "var(--text-secondary)", fontWeight: 400, fontStyle: "italic", fontSize: "0.8em" }}>
                Artisanat de Luxe
              </span>
            </h1>

            <p
              className="animate-fade-in-up delay-200"
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                marginBottom: "36px",
                maxWidth: "480px",
              }}
            >
              Une sélection rare d&apos;objets façonnés par des artisans d&apos;exception —
              chaque pièce raconte une histoire de savoir-faire et d&apos;intemporalité.
            </p>

            {/* Search */}
            <div className="animate-fade-in-up delay-300" style={{ marginBottom: "32px" }}>
              <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="animate-fade-in-up delay-400" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/products">
                <button
                  className="btn-primary"
                  style={{
                    padding: "14px 28px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Explorer la collection
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/products">
                <button
                  className="btn-secondary"
                  style={{
                    padding: "14px 28px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Nouveautés
                </button>
              </Link>
            </div>
          </div>

          {/* Right — featured image mosaic */}
          <div
            className="animate-fade-in delay-300"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              position: "relative",
            }}
          >
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: "none" }}>
                <div
                  className="card-hover"
                  style={{
                    aspectRatio: i === 0 ? "auto" : "1",
                    gridRow: i === 0 ? "1 / 3" : "auto",
                    background: "var(--bg-card)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)",
                    position: "relative",
                    minHeight: i === 0 ? "300px" : "140px",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1280px) 25vw"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(10,10,15,0.9))",
                      padding: "20px 12px 12px",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "var(--accent-gold)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      {p.category}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
                      {p.price}€
                    </div>
                  </div>
                  {p.badge && (
                    <span className="badge-sale" style={{ position: "absolute", top: "10px", left: "10px" }}>
                      {p.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Hero bottom divider */}
        <div className="divider-gold" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section style={{ background: "var(--bg-secondary)", padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
          }}
        >
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px",
                borderRadius: "10px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "rgba(68,119,151,0.1)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} style={{ color: "var(--accent-gold)" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {title}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section style={{ padding: "64px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "var(--accent-gold)",
              textTransform: "uppercase",
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            ✦ Univers
          </div>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Nos Catégories
          </h2>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {CATEGORIES.filter((c) => c !== "Toutes").map((cat) => (
            <Link key={cat} href={`/products?category=${cat}`} style={{ textDecoration: "none" }}>
              <div
                className="card-hover"
                style={{
                  padding: "12px 24px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                {cat}
                <ChevronRight size={14} style={{ color: "var(--accent-gold-dim)" }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              ✦ Sélection
            </div>
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Pièces Remarquables
            </h2>
          </div>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <button
              className="btn-secondary"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Tout voir <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={(i + 1) * 100} />
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        style={{
          margin: "0 24px 80px",
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px",
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
          border: "1px solid var(--accent-gold-dim)",
          padding: "60px 48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(68,119,151,0.08) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: "520px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "var(--accent-gold)",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontWeight: 700,
            }}
          >
            ✦ Offre exclusive
          </div>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Jusqu&apos;à <span style={{ color: "var(--accent-gold)" }}>40% de remise</span> sur les best-sellers
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "28px", lineHeight: 1.7 }}>
            Des pièces d&apos;exception à des prix rares. Offre valable jusqu&apos;à épuisement des stocks.
          </p>
          <Link href="/products">
            <button
              className="btn-primary"
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Découvrir les offres <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
