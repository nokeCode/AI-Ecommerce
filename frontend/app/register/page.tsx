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
      setError(err?.message || "Erreur inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: "24px" }}>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" type="password" />
        <button type="submit" disabled={loading}>{loading ? "Inscription..." : "S'inscrire"}</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
