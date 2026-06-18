"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { semanticSearch } from "@/services/searchService";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  isPage?: boolean;
}

export default function SearchBar({ onSearch, isPage = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const aiSuggestions = [
    "Je cherche un canapé moderne pour un petit salon",
    "Je veux une lampe élégante pour une chambre minimaliste",
    "Décoration salle à manger",
    "Petit appartement",
    "Style vintage"
  ];

  useEffect(() => {
    if (query.length < 2) {
      // Important: ne pas déclencher de setState synchrones en cascade.
      // On repousse les updates au prochain tick.
      const id = window.setTimeout(() => {
        setResults([]);
        setAiSuggestion("");
        setIsSearching(false);
      }, 0);
      return () => window.clearTimeout(id);
    }

    // Déplacer l'update hors du cycle courant pour éviter le warning React
    window.setTimeout(() => setIsSearching(true), 0);





    const timer = setTimeout(async () => {
      try {
        // Essayer la recherche sémantique d'abord
        const apiResults = await semanticSearch(query);
        if (apiResults && Array.isArray(apiResults)) {
          setResults(apiResults);
          setAiSuggestion(
            `${apiResults.length} résultat${apiResults.length > 1 ? "s" : ""} correspondant à "${query}"`
          );
        } else {
          // Fallback à la recherche locale
          const q = query.toLowerCase();
          const filtered = PRODUCTS.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
          setResults(filtered);
        setAiSuggestion(
          filtered.length > 0
            ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""} correspondant à "${query}"`
            : `Aucun résultat exact — essayez "décoration", "meuble" ou "chambre"`
        );
        }
      } catch (error) {
        console.error("Erreur recherche:", error);
        // Fallback à la recherche locale
        const q = query.toLowerCase();
        const filtered = PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
        setResults(filtered);
        setAiSuggestion(
          filtered.length > 0
            ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""} correspondant à "${query}"`
              : `Aucun résultat exact — essayez "canapé", "table", "lampe"`
        );
      }

      if (onSearch) onSearch(query);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showDropdown = isFocused && (query.length >= 2 || query.length === 0);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", maxWidth: isPage ? "600px" : "480px" }}
    >
      {/* Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--bg-elevated)",
          border: `1px solid ${isFocused ? "var(--accent-gold-dim)" : "var(--border-medium)"}`,
          borderRadius: "12px",
          padding: "0 16px",
          height: isPage ? "52px" : "44px",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: isFocused
            ? "0 0 0 3px rgba(68,119,151,0.1)"
            : "none",
        }}
      >
        {isSearching ? (
          <Sparkles
            size={18}
            style={{
              color: "var(--accent-gold)",
              animation: "spin 1s linear infinite",
              flexShrink: 0,
            }}
          />
        ) : (
          <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        )}

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Recherche IA — décrivez ce que vous cherchez..."
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: isPage ? "0.95rem" : "0.875rem",
            fontFamily: "inherit",
          }}
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setAiSuggestion("");
              inputRef.current?.focus();
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
            }}
          >
            <X size={15} />
          </button>
        )}

        <div
          style={{
            padding: "3px 8px",
            background: "rgba(68,119,151,0.1)",
            border: "1px solid var(--accent-gold-dim)",
            borderRadius: "6px",
            fontSize: "0.65rem",
            color: "var(--accent-gold)",
            letterSpacing: "0.08em",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          IA
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            // Sur la home, on évite le dropdown "overlay" qui recouvre les boutons.
            // On le laisse dans le flux pour que le layout pousse le reste vers le bas.
            position: isPage ? "relative" : "absolute",
            top: isPage ? "auto" : "calc(100% + 8px)",
            left: isPage ? "auto" : 0,
            right: isPage ? "auto" : 0,
            marginTop: isPage ? 8 : 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: isPage ? "0 10px 30px rgba(0,0,0,0.15)" : "0 20px 60px rgba(0,0,0,0.5)",
            zIndex: isPage ? "auto" : 200,
          }}
          className="animate-fade-in"
        >
          {/* AI suggestion header */}
          {aiSuggestion && (
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Sparkles size={13} style={{ color: "var(--accent-gold)" }} />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent-gold)",
                  fontStyle: "italic",
                }}
              >
                {aiSuggestion}
              </span>
            </div>
          )}

          {/* Quick suggestions when empty */}
          {query.length === 0 && (
            <div style={{ padding: "12px 0" }}>
              <div
                style={{
                  padding: "4px 16px 8px",
                  fontSize: "0.68rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Suggestions IA
              </div>
              {aiSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(s);
                    inputRef.current?.focus();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.83rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "var(--bg-elevated)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "none")
                  }
                >
                  <Sparkles size={13} style={{ color: "var(--accent-gold-dim)" }} />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div style={{ padding: "8px 0" }}>
              <div
                style={{
                  padding: "4px 16px 8px",
                  fontSize: "0.68rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Résultats
              </div>
              {results.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => setIsFocused(false)}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--bg-elevated)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "none")
                    }
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "var(--bg-elevated)",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="40px"
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-primary)",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name}
                      </div>
                      <div
                        style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                      >
                        {product.category}
                      </div>
                    </div>
                    <div
                      style={{
                        color: "var(--accent-gold)",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {product.price}€
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && results.length === 0 && !isSearching && (
            <div
              style={{
                padding: "20px 16px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}
            >
              Aucun résultat pour « {query} »
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
