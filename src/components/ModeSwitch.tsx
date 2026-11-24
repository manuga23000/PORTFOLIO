"use client";

import { useI18n } from "@/i18n";
import { useMode } from "./ModeProvider";

export function ModeSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useMode();
  const { t } = useI18n();
  const isDev = mode === "dev";

  return (
    <div
      role="radiogroup"
      aria-label={t.switches.view}
      className="relative inline-grid shrink-0 grid-cols-2 rounded-full border border-line bg-surface-2 p-1 text-xs font-semibold"
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
          aria-label={m === "admin" ? t.switches.admin : t.switches.dev}
          onClick={() => setMode(m)}
          className={`relative z-10 whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors duration-300 sm:px-3 ${
            compact ? "min-w-12" : "min-w-[5.5rem]"
          } ${mode === m ? "text-accent-ink" : "text-muted hover:text-ink"}`}
        >
          {m === "admin" ? (compact ? "Admin" : t.switches.admin) : compact ? "</Dev>" : t.switches.dev}
        </button>
      ))}
    </div>
  );
}
