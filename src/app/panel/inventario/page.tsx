"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Badge, Card } from "@/components/ui";
import type { SkillCategory } from "@/data/profile";
import { fmt, useI18n } from "@/i18n";

type Filter = "all" | SkillCategory;

function Inventory() {
  const { mode } = useMode();
  const { t, data } = useI18n();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [filter, setFilter] = useState<Filter>(initialQ ? "all" : mode === "dev" ? "tech" : "all");
  const [q, setQ] = useState(initialQ);
  const skills = data.skills;

  const rows = useMemo(() => {
    const needle = q.toLowerCase();
    return skills
      .filter((s) => (filter === "all" ? true : s.category === filter))
      .filter((s) => (needle ? `${s.name} ${s.group} ${s.sku}`.toLowerCase().includes(needle) : true))
      .sort((a, b) => b.stock - a.stock);
  }, [filter, q, skills]);

  const max = Math.max(...skills.map((s) => s.stock), 1);
  const filters: { id: Filter; label: string }[] =
    mode === "dev"
      ? [
          { id: "tech", label: "tech" },
          { id: "admin", label: "business" },
          { id: "all", label: "*" },
        ]
      : [
          { id: "all", label: t.inv.filters.all },
          { id: "admin", label: t.inv.filters.admin },
          { id: "tech", label: t.inv.filters.tech },
        ];

  const stats = [
    { label: mode === "dev" ? "items" : t.inv.stats[0], value: skills.length },
    { label: mode === "dev" ? "tech" : t.inv.stats[1], value: skills.filter((s) => s.category === "tech").length },
    { label: mode === "dev" ? "business" : t.inv.stats[2], value: skills.filter((s) => s.category === "admin").length },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="truncate text-xs text-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg bg-surface-2 p-1 text-xs font-semibold">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-md px-3 py-1.5 transition-colors ${filter === f.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm sm:w-64">
            <Icon name="search" className="size-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={mode === "dev" ? "grep…" : t.inv.search}
              className="w-full bg-transparent outline-none placeholder:text-muted"
            />
          </label>
        </div>

        {/* Tabla (desktop) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                {t.inv.cols.map((c) => (
                  <th key={c} className="px-5 py-3 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((s, i) => (
                <tr key={s.sku} className="hover:bg-surface-2">
                  <td className="px-5 py-3 font-mono text-xs text-muted">{s.sku}</td>
                  <td className="px-5 py-3 font-semibold">{s.name}</td>
                  <td className="px-5 py-3 text-muted">{s.group}</td>
                  <td className="px-5 py-3">
                    <StockBar value={s.stock} max={max} delay={i * 40} />
                  </td>
                  <td className="px-5 py-3">
                    <StockBadge stock={s.stock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lista (mobile) */}
        <ul className="divide-y divide-line md:hidden">
          {rows.map((s, i) => (
            <li key={s.sku} className="px-4 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted">
                    <span className="font-mono">{s.sku}</span> · {s.group}
                  </p>
                </div>
                <StockBadge stock={s.stock} />
              </div>
              <div className="mt-2">
                <StockBar value={s.stock} max={max} delay={i * 40} />
              </div>
            </li>
          ))}
        </ul>

        {rows.length === 0 && <p className="p-8 text-center text-sm text-muted">{fmt(t.inv.empty, { q })}</p>}

        <p className="border-t border-line px-5 py-3 text-xs text-muted">{fmt(t.inv.footer, { n: data.projects.length })}</p>
      </Card>
    </div>
  );
}

function StockBar({ value, max, delay }: { value: number; max: number; delay: number }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-full max-w-48 overflow-hidden rounded-full bg-surface-2">
        <div
          className="grow-x h-full rounded-full bg-accent"
          style={{ width: value ? `${Math.max(8, (value / max) * 100)}%` : "0%", animationDelay: `${delay}ms` }}
        />
      </div>
      <span className="w-20 shrink-0 text-xs tabular-nums text-muted">
        {value} {value === 1 ? t.inv.project : t.inv.projects}
      </span>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const { t } = useI18n();
  if (stock >= 3) return <Badge tone="ok">{t.inv.high}</Badge>;
  if (stock >= 1) return <Badge tone="accent">{t.inv.inStock}</Badge>;
  return <Badge tone="neutral">{t.inv.available}</Badge>;
}

export default function InventarioPage() {
  return (
    <Suspense>
      <Inventory />
    </Suspense>
  );
}
