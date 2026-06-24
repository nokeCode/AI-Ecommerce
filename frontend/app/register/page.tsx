"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err?.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: "24px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 8px 0" }}>
          Inscription
        </h1>
        <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
          Créez votre compte en quelques secondes
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="name" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="nom et prenom"
            required
            style={{
              padding: "12px 14px",
              fontSize: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              backgroundColor: "#ffffff",
              color: "#111827",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="email" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
            style={{
              padding: "12px 14px",
              fontSize: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              backgroundColor: "#ffffff",
              color: "#111827",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              padding: "12px 14px",
              fontSize: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              backgroundColor: "#ffffff",
              color: "#111827",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        {error && (
          <div style={{
            padding: "12px 16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "4px",
            padding: "12px 20px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: loading ? "#9ca3af" : "#111827",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#374151"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#111827"; }}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}