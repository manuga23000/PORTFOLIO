"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ScreenshotMap } from "@/app/api/capturas/route";

// Pequeño store compartido (sin librerías) para admin + capturas.

type State = {
  admin: boolean;
  screenshots: ScreenshotMap;
  blobConfigured: boolean;
  loaded: boolean;
};

let state: State = { admin: false, screenshots: {}, blobConfigured: true, loaded: false };
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const serverState: State = state;

let adminChecked = false;
let shotsRequested = false;

/** Solo consulta al servidor si el navegador tiene la cookie de "hay sesión". */
async function checkAdmin() {
  if (adminChecked) return;
  adminChecked = true;
  if (!document.cookie.split("; ").some((c) => c.startsWith("erp_admin_ui="))) return;
  try {
    const r = await fetch("/api/admin/session", { cache: "no-store" });
    const j = await r.json();
    set({ admin: !!j.admin });
  } catch {}
}

export async function loadScreenshots(force = false) {
  if (shotsRequested && !force) return;
  shotsRequested = true;
  try {
    const r = await fetch("/api/capturas", { cache: "no-store" });
    const j = await r.json();
    set({ screenshots: j.screenshots ?? {}, blobConfigured: j.configured !== false, loaded: true });
  } catch {
    set({ loaded: true });
  }
}

export function setAdmin(admin: boolean) {
  adminChecked = true;
  set({ admin });
}

export function useAdmin() {
  const s = useSyncExternalStore(subscribe, () => state, () => serverState);
  useEffect(() => {
    checkAdmin();
  }, []);
  return s.admin;
}

export function useScreenshots() {
  const s = useSyncExternalStore(subscribe, () => state, () => serverState);
  useEffect(() => {
    loadScreenshots();
  }, []);
  return { screenshots: s.screenshots, configured: s.blobConfigured, loaded: s.loaded };
}
