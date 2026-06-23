"use client";

import React from "react";

const DEFAULT_LINES = [
  "Je réfléchis à la meilleure option…",
  "J’analyse votre demande et notre catalogue…",
  "Je prépare une recommandation produit…",
];

export default function ReflexionSkeleton({
  lines = DEFAULT_LINES,
}: {
  lines?: string[];
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.32em] text-slate-500">
            Reflexion…
          </div>

          {lines.map((line, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl"
              style={{ padding: "8px 10px" }}
            >
              <span className="opacity-0">{line}</span>

              {/* vague de lumière */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(111,176,214,0)_0%,rgba(111,176,214,0.35)_40%,rgba(63,111,134,0.14)_55%,rgba(111,176,214,0)_70%)] animate-reflexion-shimmer" />

              {/* texte skeleton */}
              <div
                className="text-sm leading-6 text-slate-600"
                style={{
                  filter: "blur(0.2px)",
                }}
              >
                {line}
              </div>

              {/* couche qui rend le texte "flottant" */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-white/70 animate-reflexion-fade" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes reflexion-shimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes reflexion-fade {
          0% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.25;
          }
        }

        .animate-reflexion-shimmer {
          animation: reflexion-shimmer 1.15s ease-in-out infinite;
        }
        .animate-reflexion-fade {
          animation: reflexion-fade 1.25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

