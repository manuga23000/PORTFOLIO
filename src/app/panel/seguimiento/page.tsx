"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Badge, Card, StatusDot } from "@/components/ui";
import { useI18n } from "@/i18n";

function shaFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

export default function SeguimientoPage() {
  const { mode } = useMode();
  const { t, data, lang } = useI18n();
  const { profile, timeline } = data;
  const steps = [...timeline].sort((a, b) => a.start.localeCompare(b.start));
  const dev = mode === "dev";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
      <Card className="self-start p-5 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <Image src={profile.photo} alt={profile.name} width={56} height={56} className="size-14 rounded-xl object-cover" />
          <div>
            <p className="text-xs text-muted">{dev ? "branch" : t.track.candidate}</p>
            <p className="font-display font-bold">{dev ? "main" : profile.shortName}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{dev ? "status" : t.track.status}</dt>
            <dd className="flex items-center gap-1.5 font-semibold text-ok">
              <StatusDot /> {dev ? "open to work" : t.track.available}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{dev ? "commits" : t.track.done}</dt>
            <dd className="font-semibold">{steps.filter((s) => s.end).length}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{dev ? "in progress" : t.track.current}</dt>
            <dd className="font-semibold">{steps.filter((s) => !s.end).length}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{dev ? "location" : t.track.location}</dt>
            <dd className="text-right font-semibold">San Nicolás, BA</dd>
          </div>
        </dl>
        <Link
          href="/panel/turnos"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
        >
          {dev ? (lang === "es" ? "git merge tu-empresa" : "git merge your-company") : t.track.cta} <Icon name="arrow" className="size-4" />
        </Link>
      </Card>

      <Card className="p-5 sm:p-6">
        <ol className="relative">
          {steps.map((s, i) => {
            const current = !s.end;
            return (
              <li key={s.id} className="rise relative flex gap-4 pb-7" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-line" aria-hidden />
                <span
                  className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 ${
                    current ? "border-ok bg-ok-soft text-ok" : "border-accent bg-accent text-accent-ink"
                  }`}
                >
                  <Icon name={current ? "route" : s.type === "estudio" ? "graduation" : "check"} className="size-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {dev && <span className="font-mono text-xs text-warn">{shaFor(s.id)}</span>}
                    <p className="font-semibold">{s.title}</p>
                    {current ? <Badge tone="ok">{dev ? "HEAD" : t.track.badgeCurrent}</Badge> : <Badge>{dev ? "merged" : t.track.badgeDone}</Badge>}
                  </div>
                  <p className="text-sm text-muted">
                    {s.company} · {s.place}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{s.label}</p>
                  {s.highlights.length > 0 && s.type === "trabajo" && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {s.highlights.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="text-accent">{dev ? "+" : "•"}</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}

          <li className="relative flex gap-4">
            <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 border-dashed border-muted text-muted">
              <Icon name="building" className="size-4" />
            </span>
            <div className="flex-1 rounded-xl border border-dashed border-line p-4">
              <p className="font-semibold">{dev ? (lang === "es" ? "// TODO: próximo commit" : "// TODO: next commit") : t.track.nextTitle}</p>
              <p className="mt-0.5 text-sm text-muted">
                {t.track.nextText}
              </p>
              <Link href="/panel/turnos" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                {t.track.nextCta} <Icon name="arrow" className="size-3.5" />
              </Link>
            </div>
          </li>
        </ol>
      </Card>
    </div>
  );
}
