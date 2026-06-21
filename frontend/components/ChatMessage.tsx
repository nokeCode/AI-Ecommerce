"use client";

import Link from "next/link";

type ChatMessageProps = {
  message: any;
};

function renderMessageText(message: any) {
  if (Array.isArray(message.parts) && message.parts.length > 0) {
    return message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("");
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return "";
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const content = renderMessageText(message);

  const renderNodes = (text: string) => {
    const nodes: React.ReactNode[] = [];
    if (!text) return nodes;

    const linkRegex = /\[([^\]]+)\]\((\/product\/[^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      const index = match.index;
      const [full, label, href] = match;
      if (index > lastIndex) {
        nodes.push(text.slice(lastIndex, index));
      }
      nodes.push(
        <Link key={`${href}-${index}`} href={href} className="text-sky-600 underline">
          {label}
        </Link>
      );
      lastIndex = index + full.length;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 leading-6 whitespace-pre-wrap ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-white border border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        {renderNodes(content)}
      </div>
    </div>
  );
}
