"use client";

import { useI18n } from "@/i18n";
import { useMode } from "./ModeProvider";

/** Botón ES / EN */
export function LangSwitch() {
  const { lang, setLang } = useMode();
  const { t } = useI18n();
  const next = lang === "es" ? "en" : "es";

  return (
    <button
      onClick={() => setLang(next)}
      aria-label={`${t.switches.lang}: ${next === "en" ? "English" : "Español"}`}
      title={next === "en" ? "English" : "Español"}
      className="grid h-9 min-w-9 shrink-0 place-items-center rounded-full border border-line bg-surface px-2 text-[11px] font-bold tracking-wide text-muted transition-colors hover:text-ink"
    >
      {lang.toUpperCase()}
    </button>
  );
}
