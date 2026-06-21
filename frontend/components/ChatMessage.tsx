"use client";

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

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 leading-6 whitespace-pre-wrap ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-white border border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
