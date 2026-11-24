"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadScreenshots, setAdmin, useScreenshots } from "@/lib/client-store";

type Status = { admin: boolean; configured: boolean; blob: boolean };

// Panel privado (solo en español: lo usa únicamente el dueño del portfolio).
const ANALYTICS_URL = "https://vercel.com/emanuels-projects-30a89529/portfolio/analytics";
const STORAGE_URL = "https://vercel.com/emanuels-projects-30a89529/portfolio/stores";

export default function AdminPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { screenshots } = useScreenshots();
  const total = Object.values(screenshots).reduce((n, l) => n + l.length, 0);

  async function refresh() {
    const r = await fetch("/api/admin/session", { cache: "no-store" });
    const s = (await r.json()) as Status;
    setStatus(s);
    setAdmin(s.admin);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!r.ok) {
      setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Error");
      return;
    }
    setPassword("");
    await refresh();
    loadScreenshots(true);
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    await refresh();
  }

  return (
    <main className="relative grid min-h-dvh place-items-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="rise mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-ink">
            <Icon name="shield" className="size-5" />
          </span>
          <div className="font-display leading-tight">
            <p className="text-lg font-bold">Alessi ERP</p>
            <p className="text-xs text-muted">Panel de administración</p>
          </div>
        </div>

        <div className="rise rounded-2xl border border-line bg-surface p-6 shadow-xl">
          {!status && <p className="py-6 text-center text-sm text-muted">Cargando…</p>}

          {status && !status.configured && (
            <Notice tone="warn" icon="lock" title="Falta configurar la contraseña">
              Agregá la variable <code className="font-mono">ADMIN_PASSWORD</code> (8 caracteres o más) en Vercel → Settings →
              Environment Variables y volvé a publicar.
            </Notice>
          )}

          {status?.configured && !status.admin && (
            <form onSubmit={login} className="space-y-4">
              <div>
                <h1 className="font-display text-xl font-bold">Ingresar</h1>
                <p className="text-sm text-muted">Solo para el dueño del portfolio.</p>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-muted">Contraseña</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent-soft"
                />
              </label>
              {error && <p className="rounded-lg bg-warn-soft p-2.5 text-sm text-warn">{error}</p>}
              <button
                disabled={busy || password.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-accent-ink disabled:opacity-50"
              >
                <Icon name="lock" className="size-4" /> {busy ? "Verificando…" : "Entrar"}
              </button>
            </form>
          )}

          {status?.admin && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-xl font-bold">¡Hola, Emanuel! 👋</h1>
                  <p className="text-sm text-muted">Sesión de administrador activa (30 días).</p>
                </div>
              </div>

              <ul className="space-y-2">
                <StatusRow
                  ok={status.blob}
                  title="Almacenamiento de capturas"
                  okText={`Conectado · ${total} ${total === 1 ? "captura" : "capturas"} subidas`}
                  badText="Falta crear y conectar un store de Vercel Blob."
                  href={status.blob ? undefined : STORAGE_URL}
                />
                <StatusRow ok title="Contador de visitas" okText="Vercel Web Analytics" href={ANALYTICS_URL} linkText="Ver visitas" />
              </ul>

              <div className="rounded-xl bg-surface-2 p-4 text-sm">
                <p className="font-semibold">Cómo subir capturas</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
                  <li>Andá a Facturación y elegí un proyecto.</li>
                  <li>
                    Tocá <b className="text-ink">Subir capturas</b> y elegí una o varias imágenes.
                  </li>
                  <li>Para borrar una, pasá el mouse (o tocá) y apretá el tachito.</li>
                </ol>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/panel/facturacion"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-ink"
                >
                  <Icon name="image" className="size-4" /> Ir a Facturación
                </Link>
                <button onClick={logout} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold">
                  <Icon name="logout" className="size-4" /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          <Link href="/panel" className="hover:text-ink">
            ← Volver al portfolio
          </Link>
        </p>
      </div>
    </main>
  );
}

function StatusRow({
  ok,
  title,
  okText,
  badText,
  href,
  linkText = "Configurar",
}: {
  ok: boolean;
  title: string;
  okText: string;
  badText?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${ok ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}>
        <Icon name={ok ? "check" : "close"} className="size-4" />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted">{ok ? okText : badText}</p>
      </div>
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent">
          {linkText} <Icon name="external" className="size-3.5" />
        </a>
      )}
    </li>
  );
}

function Notice({ tone, icon, title, children }: { tone: "warn"; icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <div className={`flex gap-3 rounded-xl p-4 text-sm ${tone === "warn" ? "bg-warn-soft" : ""}`}>
      <Icon name={icon} className="size-5 shrink-0 text-warn" />
      <div>
        <p className="font-semibold text-warn">{title}</p>
        <p className="mt-1 text-muted">{children}</p>
      </div>
    </div>
  );
}
