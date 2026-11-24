"use client";

import { timeline } from "@/data/profile";

const START = { y: 2023, m: 1 };
const END = { y: 2027, m: 1 };

function toIndex(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return (y - START.y) * 12 + (m - START.m);
}

export function Gantt() {
  const total = (END.y - START.y) * 12;
  const now = new Date();
  const nowIdx = Math.min(total, (now.getFullYear() - START.y) * 12 + now.getMonth());
  const pct = (i: number) => `${(i / total) * 100}%`;
  const years = Array.from({ length: END.y - START.y }, (_, i) => START.y + i);
  const rows = [...timeline].sort((a, b) => toIndex(a.start) - toIndex(b.start));

  return (
    <div className="px-5 pb-5 pt-4">
      <div className="flex gap-3">
        <div className="w-28 shrink-0 sm:w-44" />
        <div className="relative h-5 flex-1 text-[11px] text-muted">
          {years.map((y, i) => (
            <span key={y} className="absolute" style={{ left: pct(i * 12) }}>
              {y}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-1 space-y-2">
        {rows.map((r, idx) => {
          const s = toIndex(r.start);
          const e = r.end ? toIndex(r.end) : nowIdx;
          const isWork = r.type === "trabajo";
          return (
            <div key={r.id} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate text-xs sm:w-44" title={r.title}>
                <span className="font-semibold text-ink">{r.short}</span>
              </div>
              <div className="relative h-7 flex-1 rounded-md bg-surface-2">
                {years.map((y, i) => (
                  <span key={y} className="absolute inset-y-0 w-px bg-line" style={{ left: pct(i * 12) }} />
                ))}
                <div
                  className={`grow-x absolute inset-y-1 flex items-center overflow-hidden rounded px-2 text-[10px] font-semibold ${
                    isWork ? "bg-accent text-accent-ink" : "border border-dashed border-accent bg-accent-soft text-accent"
                  }`}
                  style={{ left: pct(s), width: pct(Math.max(1, e - s)), animationDelay: `${idx * 70}ms` }}
                  title={`${r.title} — ${r.label}`}
                >
                  <span className="truncate">{r.label}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Marcador de hoy */}
        <div className="pointer-events-none absolute inset-y-0 flex gap-3" style={{ left: 0, right: 0 }}>
          <div className="w-28 shrink-0 sm:w-44" />
          <div className="relative flex-1">
            <span className="absolute -top-1 bottom-0 w-0.5 bg-ok" style={{ left: pct(nowIdx) }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ok px-1 text-[9px] font-bold text-ok-ink">
                HOY
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm bg-accent" /> Trabajo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm border border-dashed border-accent bg-accent-soft" /> Formación
        </span>
      </div>
    </div>
  );
}
