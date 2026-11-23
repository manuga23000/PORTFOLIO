"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Badge, Card } from "@/components/ui";
import { profile, projects, type Project } from "@/data/profile";

function Invoice({ p }: { p: Project }) {
  return (
    <article className="rise overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-start justify-between gap-4 border-b border-dashed border-line p-5">
        <div>
          <p className="font-display text-lg font-bold">{p.name}</p>
          <p className="text-xs text-muted">Emitida por {profile.name}</p>
        </div>
        <div className="text-right">
          <span className="grid size-10 place-items-center rounded-lg border-2 border-ink font-display text-lg font-bold">C</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-b border-dashed border-line p-5 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-muted">Comprobante N°</dt>
          <dd className="font-mono font-semibold">{p.number}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-muted">Período</dt>
          <dd className="font-semibold">{p.date}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-muted">Cliente</dt>
          <dd className="font-semibold">{p.client}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-muted">Modalidad</dt>
          <dd className="font-semibold">{p.modality}</dd>
        </div>
      </dl>

      <div className="p-5">
        <p className="text-sm text-muted">{p.summary}</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
              <th className="pb-2 font-semibold">Cant.</th>
              <th className="pb-2 font-semibold">Detalle</th>
              <th className="pb-2 text-right font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((item) => (
              <tr key={item} className="border-b border-line/60">
                <td className="py-2.5 pr-3 tabular-nums text-muted">1</td>
                <td className="py-2.5">{item}</td>
                <td className="py-2.5 text-right">
                  <Icon name="check" className="ml-auto size-4 text-ok" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stackLabel.map((s) => (
            <Badge key={s} tone="accent">
              {s}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3">
          <span className="text-sm font-semibold">Total</span>
          <span className="font-display font-bold text-ok">Entregado y en uso ✓</span>
        </div>

        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
          >
            Ver en producción <Icon name="external" className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}

function Deploy({ p }: { p: Project }) {
  return (
    <article className="rise overflow-hidden rounded-2xl border border-line bg-surface font-mono text-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="text-accent">$ git show {p.id}</span>
        <Badge tone="ok">● shipped</Badge>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-lg font-bold">{p.name}</p>
          <p className="text-xs text-muted">
            {p.client} · {p.date}
          </p>
        </div>
        <p className="text-muted">
          <span className="text-accent">{"/** "}</span>
          {p.summary}
          <span className="text-accent">{" */"}</span>
        </p>
        <div>
          <p className="text-xs text-muted">{"## features"}</p>
          <ul className="mt-1 space-y-1">
            {p.items.map((i) => (
              <li key={i}>
                <span className="text-accent">+</span> {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.stackLabel.map((s) => (
            <span key={s} className="rounded border border-line px-2 py-0.5 text-xs">
              {s}
            </span>
          ))}
        </div>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:underline">
            {p.url.replace("https://", "")} <Icon name="external" className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

function Detail({ p }: { p: Project }) {
  const { mode } = useMode();
  return mode === "dev" ? <Deploy key={`d-${p.id}`} p={p} /> : <Invoice key={`i-${p.id}`} p={p} />;
}

function Billing() {
  const { mode } = useMode();
  const router = useRouter();
  const params = useSearchParams();
  const selectedId = params.get("p") ?? projects[0].id;
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  function select(id: string) {
    router.replace(`/panel/facturacion?p=${id}`, { scroll: false });
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.05fr]">
      <Card className="self-start">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <span>{mode === "dev" ? "repos" : "Comprobantes"}</span>
          <span>{projects.length}</span>
        </div>
        <ul className="divide-y divide-line">
          {projects.map((p) => {
            const active = p.id === selected.id;
            return (
              <li key={p.id}>
                <button
                  onClick={() => select(p.id)}
                  aria-expanded={active}
                  className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                    active ? "bg-accent-soft" : "hover:bg-surface-2"
                  }`}
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                      active ? "bg-accent text-accent-ink" : "bg-surface-2 text-muted"
                    }`}
                  >
                    <Icon name={mode === "dev" ? "code" : "receipt"} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {mode === "dev" ? p.stackLabel.join(" · ") : `N° ${p.number} · ${p.client}`}
                    </span>
                  </span>
                  <Badge tone="ok">{mode === "dev" ? "shipped" : "Entregada"}</Badge>
                </button>
                {/* En mobile el detalle se abre debajo, tipo acordeón */}
                {active && (
                  <div className="border-t border-line bg-surface-2 p-3 lg:hidden">
                    <Detail p={p} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="hidden lg:block">
        <div className="sticky top-24">
          <Detail p={selected} />
        </div>
      </div>

      <p className="text-xs text-muted lg:col-span-2">
        ¿Querés que el próximo comprobante sea para tu empresa?{" "}
        <Link href="/panel/turnos" className="font-semibold text-accent">
          Reservá un turno →
        </Link>
      </p>
    </div>
  );
}

export default function FacturacionPage() {
  return (
    <Suspense>
      <Billing />
    </Suspense>
  );
}
