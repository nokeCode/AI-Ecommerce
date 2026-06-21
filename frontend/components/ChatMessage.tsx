"use client";

type ChatMessageProps = {
  role: "assistant" | "user";
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 leading-6 whitespace-pre-wrap ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-white border border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        {content.split("Luxe Boutique").map((part, idx, arr) => (
          <span key={idx}>
            {part}
            {idx < arr.length - 1 ? <span className="font-bold">Luxe Boutique</span> : null}
          </span>
        ))}
      </div>

    </div>
  );
}
