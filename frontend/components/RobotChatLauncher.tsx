"use client";

import { useEffect, useMemo, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import { X } from "lucide-react";

export default function RobotChatLauncher() {
  const [open, setOpen] = useState(false);

  // Evite d'empiler du scroll quand la modale est ouverte
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const title = useMemo(() => {
    return "Assistant IA";
  }, []);

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label={open ? "Fermer le chatbot" : "Ouvrir le chatbot"}
        title={title}
        className="robot-launcher"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="robot-bounce" aria-hidden="true">
          <span className="robot-head">
            <span className="robot-antenna" />
            <span className="robot-eyes">
              <span className="robot-eye" />
              <span className="robot-eye" />
            </span>
            <span className="robot-mouth" />
          </span>
        </span>
      </button>

      {/* Backdrop + panel */}
      {open && (
        <div
          className="robot-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Chatbot"
          onMouseDown={(e) => {
            // Fermer si on clique le fond (et pas la carte)
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="robot-modal-card">
            <div className="robot-modal-header">
              <div className="robot-modal-title">
                <span className="robot-dot" aria-hidden="true" />
                {title}
              </div>
              <button
                type="button"
                className="robot-modal-close"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat compact (on garde ChatWindow mais on contraint la hauteur/largeur) */}
            <div className="robot-modal-body">
              <div className="robot-chat-compact">
                <ChatWindow />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escape key */}
      {open && (
        <KeyListener
          onEscape={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function KeyListener({ onEscape }: { onEscape: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onEscape]);

  return null;
}

