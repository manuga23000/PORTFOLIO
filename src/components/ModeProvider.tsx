"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Mode = "admin" | "dev";
export type Theme = "light" | "dark";

type ModeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

/** Activa transiciones suaves de color solo durante el cambio */
function animateSwitch() {
  const root = document.documentElement;
  root.classList.add("mode-anim");
  window.setTimeout(() => root.classList.remove("mode-anim"), 600);
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("admin");
  const [theme, setThemeState] = useState<Theme>("light");

  // El script del <head> ya aplicó vista y tema; sincronizamos el estado.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.mode === "admin" || root.dataset.mode === "dev") setModeState(root.dataset.mode);
    if (root.dataset.theme === "light" || root.dataset.theme === "dark") setThemeState(root.dataset.theme);

    // Si la persona nunca eligió, seguimos el tema del sistema en vivo.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let chosen: string | null = null;
      try {
        chosen = localStorage.getItem("tema");
      } catch {}
      if (chosen) return;
      const next: Theme = e.matches ? "dark" : "light";
      animateSwitch();
      root.dataset.theme = next;
      setThemeState(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setMode = useCallback((next: Mode) => {
    animateSwitch();
    document.documentElement.dataset.mode = next;
    setModeState(next);
    save("modo", next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    animateSwitch();
    document.documentElement.dataset.theme = next;
    setThemeState(next);
    save("tema", next);
  }, []);

  const toggle = useCallback(() => setMode(mode === "admin" ? "dev" : "admin"), [mode, setMode]);
  const toggleTheme = useCallback(() => setTheme(theme === "light" ? "dark" : "light"), [theme, setTheme]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle, theme, setTheme, toggleTheme }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode debe usarse dentro de <ModeProvider>");
  return ctx;
}
