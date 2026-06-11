"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Truck,
  Tag,
  CreditCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } =
    useCart();

  const shipping = totalPrice >= 150 ? 0 : 9.9;
  const grandTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "80px auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "96px",
            height: "96px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <ShoppingCart size={36} style={{ color: "var(--text-muted)" }} />
        </div>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "1.8rem",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          Votre panier est vide
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}
        >
          Découvrez notre sélection de pièces d&apos;exception et ajoutez vos coups de cœur.
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
            Explorer les produits
            <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <Link
          href="/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.85rem",
            marginBottom: "16px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--accent-gold)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")
          }
        >
          <ArrowLeft size={15} /> Continuer les achats
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              ✦ Mon panier
            </div>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </h1>
          </div>
          <button
            onClick={clearCart}
            style={{
              background: "none",
              border: "1px solid var(--border-medium)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--error)";
              (e.currentTarget as HTMLElement).style.color = "var(--error)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            }}
          >
            <Trash2 size={14} /> Vider
          </button>
        </div>
      </div>

      {/* Layout: items + summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* ─── Cart Items ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.map((item, index) => (
            <div
              key={item.product.id}
              className="animate-fade-in-up card-hover"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
                padding: "20px",
                display: "grid",
                gridTemplateColumns: "100px 1fr auto",
                gap: "20px",
                alignItems: "center",
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Image */}
              <Link href={`/product/${item.product.id}`} style={{ display: "block" }}>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "var(--bg-elevated)",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="100px"
                  />
                </div>
              </Link>

              {/* Info */}
              <div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    color: "var(--accent-gold)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                    fontWeight: 600,
                  }}
                >
                  {item.product.category}
                </div>
                <Link href={`/product/${item.product.id}`} style={{ textDecoration: "none" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "'Georgia', serif",
                      marginBottom: "8px",
                      lineHeight: 1.3,
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--accent-gold)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--text-primary)")
                    }
                  >
                    {item.product.name}
                  </h3>
                </Link>

                {/* Quantity controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span
                    style={{
                      width: "32px",
                      textAlign: "center",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{
                      marginLeft: "8px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      display: "flex",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "var(--error)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")
                    }
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "var(--accent-gold)",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {(item.product.price * item.quantity).toFixed(2)}€
                </div>
                {item.quantity > 1 && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {item.product.price}€ × {item.quantity}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Order Summary ─── */}
        <div style={{ position: "sticky", top: "90px" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Tag size={16} style={{ color: "var(--accent-gold)" }} />
              <span
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.15em",
                  color: "var(--accent-gold)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Résumé de commande
              </span>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Lines */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      {item.product.name.slice(0, 28)}
                      {item.product.name.length > 28 ? "…" : ""}{" "}
                      <span style={{ color: "var(--text-muted)" }}>×{item.quantity}</span>
                    </span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider-gold" style={{ marginBottom: "20px" }} />

              {/* Subtotal */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>Sous-total</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {totalPrice.toFixed(2)}€
                </span>
              </div>

              {/* Shipping */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Truck size={14} style={{ color: "var(--accent-gold-dim)" }} />
                  Livraison
                </span>
                <span style={{ color: shipping === 0 ? "var(--success)" : "var(--text-primary)" }}>
                  {shipping === 0 ? "Offerte" : `${shipping.toFixed(2)}€`}
                </span>
              </div>

              {shipping > 0 && (
                <div
                  style={{
                    background: "rgba(68,119,151,0.08)",
                    border: "1px solid rgba(68,119,151,0.2)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "0.78rem",
                    color: "var(--accent-gold)",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  Plus que {(150 - totalPrice).toFixed(2)}€ pour la livraison gratuite
                </div>
              )}

              <div className="divider-gold" style={{ marginBottom: "16px" }} />

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "0.05em",
                  }}
                >
                  TOTAL
                </span>
                <span
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--accent-gold)",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {grandTotal.toFixed(2)}€
                </span>
              </div>

              {/* Checkout CTA */}
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
                  marginBottom: "12px",
                }}
                onClick={() => alert("🚧 Checkout en cours de développement — Paiement sécurisé disponible bientôt")}
              >
                <CreditCard size={18} />
                Procéder au paiement
              </button>

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
                  Continuer mes achats
                </button>
              </Link>

              {/* Secure badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "16px",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                <Shield size={13} style={{ color: "var(--accent-gold-dim)" }} />
                Paiement sécurisé · SSL 256 bits
              </div>
            </div>
          </div>

          {/* Promo code */}
          <div
            style={{
              marginTop: "16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                marginBottom: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Code promo
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                placeholder="LUXE2025"
                className="search-input"
                style={{
                  flex: 1,
                  borderRadius: "8px",
                  padding: "9px 14px",
                  fontSize: "0.85rem",
                }}
              />
              <button
                className="btn-secondary"
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
