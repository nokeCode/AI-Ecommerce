import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UIMessage } from "ai";

interface ChatStore {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "chat-storage",
    }
  )
);
