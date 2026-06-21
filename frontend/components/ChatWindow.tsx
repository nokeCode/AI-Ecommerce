"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useChatStore } from "@/store/chatStore";

const CHAT_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ChatWindow() {
  const persistedMessages = useChatStore((state) => state.messages);
  const setPersistMessages = useChatStore((state) => state.setMessages);
  const clearPersistMessages = useChatStore((state) => state.clearMessages);
  const [input, setInput] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { messages, status, error, sendMessage } = useChat({
    transport: new TextStreamChatTransport({
      api: `${CHAT_API}/api/chat`,
    }),
    messages: persistedMessages,
    onFinish: ({ messages }: { messages: UIMessage[] }) => {
      setPersistMessages(messages);
    },
    onError: (error: Error) => {
      setServerError(error.message);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setServerError(null);
    await sendMessage({ text: trimmed });
    setInput("");
  };

  const handleClearHistory = () => {
    clearPersistMessages();
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-300 bg-white shadow-xl shadow-slate-200/40">
      <div className="rounded-t-[32px] bg-slate-500 px-6 py-5 text-white">
        <div className="text-sm uppercase tracking-[0.32em] text-slate-300">Assistant IA</div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Posez une question, je réponds en temps réel en examinant notre catalogue.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {isStreaming ? "Streaming…" : "Prêt"}
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="min-h-[420px] max-h-[520px] overflow-y-auto rounded-[32px] border border-slate-200 bg-slate-50 px-6 py-5 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}`} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>

        {serverError || error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {serverError ?? error?.message ?? "Erreur lors de la conversation."}
          </div>
        ) : null}

        <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  );
}
