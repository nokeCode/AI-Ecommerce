"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Toutes";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== "Toutes") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => {
          const da = a.originalPrice ? a.originalPrice - a.price : 0;
          const db = b.originalPrice ? b.originalPrice - b.price : 0;
          return db - da;
        });
        break;
    }

    return list;
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
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
          ✦ Catalogue
        </div>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "20px",
          }}
        >
          Nos Produits
        </h1>
        <SearchBar onSearch={setSearchQuery} isPage />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px", alignItems: "start" }}>
        {/* ─── Sidebar Filters ─── */}
        <aside
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "24px",
            position: "sticky",
            top: "90px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <SlidersHorizontal size={16} style={{ color: "var(--accent-gold)" }} />
            <span
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                color: "var(--accent-gold)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Filtres
            </span>
            {(selectedCategory !== "Toutes" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("Toutes");
                  setSearchQuery("");
                }}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                }}
              >
                <X size={12} /> Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: 700,
              }}
            >
              Catégorie
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    selectedCategory === cat
                      ? "rgba(212,168,83,0.12)"
                      : "none",
                  color:
                    selectedCategory === cat
                      ? "var(--accent-gold)"
                      : "var(--text-secondary)",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.87rem",
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  borderLeft:
                    selectedCategory === cat
                      ? "2px solid var(--accent-gold)"
                      : "2px solid transparent",
                  transition: "all 0.15s",
                  marginBottom: "2px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price range */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: 700,
              }}
            >
              Prix max: {priceRange[1]}€
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              style={{
                width: "100%",
                accentColor: "var(--accent-gold)",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              <span>0€</span>
              <span>500€</span>
            </div>
          </div>

          {/* Sort */}
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: 700,
              }}
            >
              Trier par
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-medium)",
                color: "var(--text-primary)",
                fontSize: "0.87rem",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="featured">En vedette</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
              <option value="discount">Meilleures remises</option>
            </select>
          </div>
        </aside>

        {/* ─── Product Grid ─── */}
        <div>
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
                {filtered.length}
              </span>{" "}
              produit{filtered.length !== 1 ? "s" : ""}
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              {([3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setGridCols(n)}
                  style={{
                    padding: "7px 10px",
                    borderRadius: "8px",
                    background:
                      gridCols === n ? "rgba(212,168,83,0.12)" : "var(--bg-card)",
                    border: `1px solid ${gridCols === n ? "var(--accent-gold-dim)" : "var(--border-subtle)"}`,
                    color:
                      gridCols === n ? "var(--accent-gold)" : "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  {n === 3 ? <Grid3X3 size={16} /> : <List size={16} />}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "16px" }}>◇</div>
              <div style={{ fontSize: "1rem", marginBottom: "8px", color: "var(--text-secondary)" }}>
                Aucun produit trouvé
              </div>
              <div style={{ fontSize: "0.85rem" }}>
                Essayez de modifier vos filtres
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gap: "20px",
              }}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={(i % 4) * 100} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center", color: "var(--text-muted)" }}>Chargement…</div>}>
      <ProductsContent />
    </Suspense>
  );
}
