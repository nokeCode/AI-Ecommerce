import ChatWindow from "@/components/ChatWindow";

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white/80 px-6 py-5 shadow-lg shadow-slate-300/15">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Conversation</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Assistant e-commerce</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Posez une question rapide et obtenez une recommandation produit basée sur les meilleurs résultats MongoDB Vector Search.
          </p>
        </div>
        <ChatWindow />
      </div>
    </main>
  );
}
