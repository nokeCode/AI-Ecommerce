"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  delay?: number;
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/product/${product.id}`}
      style={{ textDecoration: "none" }}
      className={`animate-fade-in-up delay-${delay}`}
    >
      <div
        className="card-hover"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            background: "var(--bg-elevated)",
            overflow: "hidden",
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1)")
            }
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Badges */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {product.badge && (
              <span
                className="badge-sale"
                style={{ textTransform: "uppercase" }}
              >
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="badge-sale">-{discount}%</span>
            )}
          </div>

          {/* Quick actions overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,15,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              opacity: 0,
              transition: "opacity 0.3s",
            }}
            className="card-overlay"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0")
            }
          >
            <div
              style={{
                background: "var(--accent-gold)",
                color: "var(--text-primary)",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              <Eye size={14} />
              Voir
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          {/* Category */}
          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              color: "var(--accent-gold)",
              textTransform: "uppercase",
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            {product.category}
          </div>

          {/* Name */}
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.4,
              marginBottom: "8px",
              fontFamily: "'Georgia', serif",
            }}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
              marginBottom: "12px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  fill={s <= Math.round(product.rating) ? "currentColor" : "none"}
                  className={
                    s <= Math.round(product.rating) ? "star-filled" : "star-empty"
                  }
                />
              ))}
            </div>
            <span
              style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
            >
              ({product.reviews})
            </span>
          </div>

          {/* Price + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--accent-gold)",
                }}
              >
                {product.price}€
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    textDecoration: "line-through",
                    marginLeft: "8px",
                  }}
                >
                  {product.originalPrice}€
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
              }}
            >
              <ShoppingCart size={13} />
              {added ? "✓ Ajouté" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
