"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Card, CardHeader } from "@/components/ui";
import { profile, projects, skills, timeline } from "@/data/profile";

const stepsAdmin = [
  "Consultando legajo del candidato",
  `Procesando ${timeline.length} registros de experiencia y formación`,
  `Valorizando inventario (${skills.length} habilidades)`,
  `Adjuntando ${projects.length} comprobantes de proyectos`,
  "Compilando reporte PDF",
];
const stepsDev = [
  "$ npm run build:cv",
  `✓ compiled ${timeline.length} modules (experiencia)`,
  `✓ bundled ${skills.length} skills`,
  `✓ linked ${projects.length} projects`,
  "✓ cv-emanuel-alessi.pdf ready",
];

export default function ReportesPage() {
  const { mode } = useMode();
  const dev = mode === "dev";
  const steps = dev ? stepsDev : stepsAdmin;
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [done, setDone] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function generate() {
    setState("running");
    setDone(0);
    timers.current.forEach(clearTimeout);
    timers.current = steps.map((_, i) => window.setTimeout(() => setDone(i + 1), 450 * (i + 1)));
    timers.current.push(window.setTimeout(() => setState("done"), 450 * steps.length + 250));
  }

  const progress = Math.round((done / steps.length) * 100);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader title={dev ? "build" : "Generar reporte del candidato"} hint="CV actualizado en formato PDF" />
        <div className="p-5">
          {state === "idle" && (
            <button
              onClick={generate}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 font-display font-semibold text-accent-ink"
            >
              <Icon name="file" className="size-5" /> {dev ? "npm run build:cv" : "Generar reporte"}
            </button>
          )}

          {state !== "idle" && (
            <>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{state === "done" ? (dev ? "build ok" : "Reporte listo") : dev ? "building…" : "Generando…"}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
              <ul className={`mt-5 space-y-2.5 text-sm ${dev ? "font-mono" : ""}`}>
                {steps.map((s, i) => {
                  const ok = i < done;
                  const running = i === done && state === "running";
                  return (
                    <li key={s} className={`flex items-center gap-3 ${ok || running ? "" : "opacity-35"}`}>
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-full ${
                          ok ? "bg-ok text-ok-ink" : "border-2 border-line"
                        } ${running ? "animate-spin border-t-accent" : ""}`}
                      >
                        {ok && <Icon name="check" className="size-3" />}
                      </span>
                      {s}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {state === "done" && (
            <div className="rise mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={profile.cv}
                download
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-ink"
              >
                <Icon name="download" className="size-4" /> Descargar PDF
              </a>
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold"
              >
                <Icon name="external" className="size-4" /> Abrir
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Mini vista previa del reporte */}
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Vista previa</p>
        <div
          className={`mt-3 overflow-hidden rounded-lg border border-line bg-white p-5 text-[#14213d] shadow-inner transition-all duration-700 ${
            state === "done" ? "opacity-100" : "opacity-60 blur-[1.5px]"
          }`}
        >
          <div className="flex gap-4">
            <div className="w-1/3 space-y-2 rounded bg-[#eef1f7] p-3">
              <div className="mx-auto size-12 rounded-full bg-[#14213d]/20" />
              <div className="h-1.5 rounded bg-[#14213d]/25" />
              <div className="h-1.5 w-2/3 rounded bg-[#14213d]/15" />
              <div className="mt-3 flex flex-wrap gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="h-2 w-6 rounded bg-[#14213d]/15" />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-display text-sm font-bold leading-tight">{profile.name}</p>
              <p className="text-[9px] font-semibold text-[#5d6781]">{profile.role}</p>
              {Array.from({ length: 4 }).map((_, b) => (
                <div key={b} className="space-y-1 pt-1.5">
                  <div className="h-1.5 w-1/3 rounded bg-[#14213d]/40" />
                  <div className="h-1 rounded bg-[#14213d]/10" />
                  <div className="h-1 w-5/6 rounded bg-[#14213d]/10" />
                  <div className="h-1 w-4/6 rounded bg-[#14213d]/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
