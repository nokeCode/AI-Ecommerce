"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Check, ChevronDown, ChevronUp } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProducts } from "@/services/productService";
import { Product } from "@/types";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const apiProduct = await getProductById(id);
        if (apiProduct) {
          setProduct(apiProduct);
          
          // Charger les produits liés
          const allProducts = await getProducts();
          const relatedProducts = allProducts
            .filter((p: Product) => p.id !== id && p.category === apiProduct.category)
            .slice(0, 3);
          setRelated(relatedProducts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);

      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "features">("desc");

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <p style={{ color: "var(--text-primary)" }}>Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <h2 style={{ color: "var(--text-primary)", fontFamily: "'Georgia', serif" }}>
          Produit introuvable
        </h2>
        <Link href="/products">
          <button className="btn-primary" style={{ padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "16px" }}>
            Retour aux produits
          </button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
        <Link
          href="/products"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.85rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-gold)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
        >
          <ArrowLeft size={16} />
          Produits
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>/</span>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{product.category}</span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>/</span>
        <span
          style={{
            color: "var(--text-primary)",
            fontSize: "0.85rem",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </span>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          marginBottom: "80px",
        }}
      >
        {/* ─── Images ─── */}
        <div>
          {/* Main image */}
          <div
            style={{
              aspectRatio: "4/3",
              borderRadius: "16px",
              overflow: "hidden",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              position: "relative",
              marginBottom: "12px",
            }}
          >
            <Image
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              fill
              style={{ objectFit: "cover", transition: "opacity 0.3s" }}
              sizes="(max-width: 1280px) 50vw"
              priority
            />
            {product.badge && (
              <span className="badge-sale" style={{ position: "absolute", top: "16px", left: "16px" }}>
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="badge-sale" style={{ position: "absolute", top: product.badge ? "48px" : "16px", left: "16px" }}>
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "10px" }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: `2px solid ${selectedImage === i ? "var(--accent-gold)" : "var(--border-subtle)"}`,
                    cursor: "pointer",
                    padding: 0,
                    background: "var(--bg-card)",
                    position: "relative",
                    flexShrink: 0,
                    transition: "border-color 0.2s",
                  }}
                >
                  <Image src={img} alt="" fill style={{ objectFit: "cover" }} sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Info ─── */}
        <div>
          {/* Category */}
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "var(--accent-gold)",
              textTransform: "uppercase",
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            {product.category}
          </div>

          {/* Name */}
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              marginBottom: "16px",
            }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(product.rating) ? "currentColor" : "none"}
                  className={s <= Math.round(product.rating) ? "star-filled" : "star-empty"}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.88rem", color: "var(--accent-gold)", fontWeight: 700 }}>
              {product.rating}
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              ({product.reviews} avis)
            </span>
            {product.inStock ? (
              <span style={{ fontSize: "0.78rem", color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Check size={13} /> En stock
              </span>
            ) : (
              <span style={{ fontSize: "0.78rem", color: "var(--error)" }}>Rupture</span>
            )}
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "24px",
              padding: "16px 20px",
              background: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--accent-gold)",
                fontFamily: "'Georgia', serif",
              }}
            >
              {product.price}€
            </span>
            {product.originalPrice && (
              <>
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--text-muted)",
                    textDecoration: "line-through",
                  }}
                >
                  {product.originalPrice}€
                </span>
                <span
                  style={{
                    fontSize: "0.82rem",
                    padding: "3px 10px",
                    background: "rgba(230,57,70,0.15)",
                    color: "#f87171",
                    borderRadius: "6px",
                    fontWeight: 700,
                  }}
                >
                  Économisez {product.originalPrice - product.price}€
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "28px",
            }}
          >
            {product.description}
          </p>

          {/* Quantity + Add to cart */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-medium)",
                borderRadius: "10px",
                padding: "6px 10px",
              }}
            >
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span
                style={{
                  width: "36px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                }}
              >
                {quantity}
              </span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>

            <button
              className="btn-primary"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                flex: 1,
                padding: "13px 24px",
                borderRadius: "10px",
                border: "none",
                cursor: product.inStock ? "pointer" : "not-allowed",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: product.inStock ? 1 : 0.5,
              }}
            >
              <ShoppingCart size={18} />
              {added ? "✓ Ajouté au panier !" : "Ajouter au panier"}
            </button>
          </div>

          {/* Trust */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { icon: Truck, text: "Livraison gratuite dès 150€" },
              { icon: Shield, text: "Paiement 100% sécurisé" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                <Icon size={14} style={{ color: "var(--accent-gold-dim)" }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "80px",
        }}
      >
        {/* Tab buttons */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {(
            [
              { key: "desc", label: "Description" },
              { key: "features", label: "Points forts" },
              { key: "specs", label: "Caractéristiques" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "16px 28px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.87rem",
                fontWeight: activeTab === key ? 700 : 500,
                color:
                  activeTab === key
                    ? "var(--accent-gold)"
                    : "var(--text-secondary)",
                borderBottom:
                  activeTab === key
                    ? "2px solid var(--accent-gold)"
                    : "2px solid transparent",
                transition: "all 0.15s",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: "32px" }}>
          {activeTab === "desc" && (
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.9,
                maxWidth: "720px",
              }}
            >
              {product.longDescription}
            </p>
          )}

          {activeTab === "features" && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "600px" }}>
              {product.features.map((f, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom:
                      i < product.features.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Check
                    size={16}
                    style={{ color: "var(--accent-gold)", flexShrink: 0, marginTop: "2px" }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "specs" && (
            <div style={{ maxWidth: "600px" }}>
              {Object.entries(product.specs).map(([key, val], i) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom:
                      i < Object.keys(product.specs).length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                  }}
                >
                  <span
                    style={{ fontSize: "0.87rem", color: "var(--text-muted)", fontWeight: 600 }}
                  >
                    {key}
                  </span>
                  <span style={{ fontSize: "0.87rem", color: "var(--text-primary)" }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <div>
          <div style={{ marginBottom: "32px" }}>
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
              ✦ À découvrir
            </div>
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Dans la même collection
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 100} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
