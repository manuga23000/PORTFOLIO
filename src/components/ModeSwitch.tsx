"use client";

import { useMode } from "./ModeProvider";

export function ModeSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useMode();
  const isDev = mode === "dev";

  return (
    <div
      role="radiogroup"
      aria-label="Cambiar vista"
      className="relative inline-grid grid-cols-2 rounded-full border border-line bg-surface-2 p-1 text-xs font-semibold"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent shadow-sm transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ transform: isDev ? "translateX(100%)" : "translateX(0)" }}
      />
      {(["admin", "dev"] as const).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          onClick={() => setMode(m)}
          className={`relative z-10 rounded-full px-3 py-1.5 transition-colors duration-300 ${
            compact ? "min-w-14" : "min-w-[5.5rem]"
          } ${mode === m ? "text-accent-ink" : "text-muted hover:text-ink"}`}
        >
          {m === "admin" ? (compact ? "Admin" : "Vista Admin") : compact ? "</Dev>" : "Vista </Dev>"}
        </button>
      ))}
    </div>
  );
}
