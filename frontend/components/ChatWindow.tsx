"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour et bienvenue chez Luxe Boutique! ✨ Vous cherchez à sublimer votre intérieur ou à dénicher la pièce parfaite ? Je suis là pour vous conseiller. Que cherchez-vous aujourd'hui ? ",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const assistantText = data?.answer || "Désolé, je n'ai pas pu trouver de réponse pour le moment.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (fetchError) {
      console.error("Chat fetch error:", fetchError);
      setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
      setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, le service n'est pas disponible." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-300 bg-white shadow-xl shadow-slate-200/40">
      <div className="rounded-t-[32px] bg-slate-500 px-6 py-5 text-white">
        <div className="text-sm uppercase tracking-[0.32em] text-slate-300">Assistant IA</div>
      </div>

      <div className="min-h-[420px] max-h-[520px] overflow-y-auto px-6 py-5 space-y-4 bg-slate-50">
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} role={message.role} content={message.content} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 px-6 py-5 bg-white">
        {error ? <div className="mb-3 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div> : null}
        <ChatInput value={input} onChange={setInput} onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}
