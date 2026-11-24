"use client";

import { useMode } from "./ModeProvider";

/** Botón ☀️/🌙. En la Vista Dev no se muestra: la terminal siempre es oscura. */
export function ThemeToggle() {
  const { mode, theme, toggleTheme } = useMode();
  if (mode === "dev") return null;
  const dark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? "Activar modo día" : "Activar modo noche"}
      title={dark ? "Modo día" : "Modo noche"}
      className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
    >
      {/* Sol */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        className={`absolute size-[18px] transition-all duration-500 ${dark ? "-translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"}`}
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      {/* Luna */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute size-[18px] transition-all duration-500 ${dark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 -rotate-90 opacity-0"}`}
        aria-hidden
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
