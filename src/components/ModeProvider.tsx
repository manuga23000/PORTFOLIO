"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Mode = "admin" | "dev";

type ModeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("admin");

  // El script del <head> ya aplicó la vista guardada; sincronizamos el estado.
  useEffect(() => {
    const current = document.documentElement.dataset.mode;
    if (current === "admin" || current === "dev") setModeState(current);
  }, []);

  const setMode = useCallback((next: Mode) => {
    const root = document.documentElement;
    root.classList.add("mode-anim");
    root.dataset.mode = next;
    setModeState(next);
    try {
      localStorage.setItem("modo", next);
    } catch {}
    window.setTimeout(() => root.classList.remove("mode-anim"), 600);
  }, []);

  const toggle = useCallback(() => setMode(mode === "admin" ? "dev" : "admin"), [mode, setMode]);

  return <ModeContext.Provider value={{ mode, setMode, toggle }}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode debe usarse dentro de <ModeProvider>");
  return ctx;
}
