"use client";

import Image from "next/image";
import Link from "next/link";
import { Gantt } from "@/components/Gantt";
import { Icon, type IconName } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Terminal } from "@/components/Terminal";
import { Badge, Card, CardHeader, CountUp, StatusDot } from "@/components/ui";
import { monthsSince } from "@/data/profile";
import { useI18n } from "@/i18n";

type Kpi = { icon: IconName; value: number; suffix?: string; label: string; hint: string };

function useKpis(): { admin: Kpi[]; dev: Kpi[] } {
  const { t, data } = useI18n();
  const years = Math.floor(monthsSince(data.profile.devSince) / 12);
  const companies = new Set(["Adbize", "Blue Top Media", "GTM", "SR Fitness Gym"]).size;
  const gestion = data.projects.filter((p) => p.kind === "gestion").length;
  const tech = data.skills.filter((s) => s.category === "tech").length;
  const [a, d] = [t.dash.kpiAdmin, t.dash.kpiDev];
  return {
    admin: [
      { icon: "building", value: companies, label: a[0][0], hint: a[0][1] },
      { icon: "layers", value: gestion, label: a[1][0], hint: a[1][1] },
      { icon: "briefcase", value: years, suffix: "+", label: a[2][0], hint: a[2][1] },
      { icon: "graduation", value: 1, label: a[3][0], hint: a[3][1] },
    ],
    dev: [
      { icon: "code", value: years, suffix: "+", label: d[0][0], hint: d[0][1] },
      { icon: "layers", value: data.projects.length, label: d[1][0], hint: d[1][1] },
      { icon: "terminal", value: tech, label: d[2][0], hint: d[2][1] },
      { icon: "trending", value: 2, label: d[3][0], hint: d[3][1] },
    ],
  };
}

function KpiGrid({ items }: { items: Kpi[] }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((k, i) => (
        <Card key={k.label} className="p-4 sm:p-5" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center justify-between">
            <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon name={k.icon} className="size-[18px]" />
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-ok sm:block">{t.dash.active}</span>
          </div>
          <p className="mt-4 font-display text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
            <CountUp to={k.value} suffix={k.suffix} />
          </p>
          <p className="mt-1 text-sm font-semibold">{k.label}</p>
          <p className="text-xs text-muted">{k.hint}</p>
        </Card>
      ))}
    </div>
  );
}

function ProfileCard() {
  const { mode } = useMode();
  const { t, data } = useI18n();
  const profile = data.profile;
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <Image
          src={profile.photo}
          alt={profile.name}
          width={88}
          height={88}
          priority
          className="size-20 rounded-2xl border border-line object-cover sm:size-[88px]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-bold">{profile.name}</h2>
            <Badge tone="ok">
              <StatusDot /> {profile.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-medium text-accent">{profile.role}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{mode === "dev" ? profile.summaryDev : profile.summary}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Icon name="pin" className="size-3.5" /> {profile.location}
          </p>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <Link
            href="/panel/turnos"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
          >
            <Icon name="calendar" className="size-4" /> {mode === "dev" ? t.dash.contact : t.dash.schedule}
          </Link>
          <a
            href={profile.cv}
            download
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold"
          >
            <Icon name="download" className="size-4" /> CV
          </a>
        </div>
      </div>
    </Card>
  );
}

function Movements() {
  const { t, data } = useI18n();
  const tone = { Alta: "ok", Egreso: "accent", Cierre: "neutral" } as const;
  return (
    <Card>
      <CardHeader title={t.dash.movesTitle} hint={t.dash.movesHint} />
      <ul className="divide-y divide-line">
        {data.movements.map((m, i) => (
          <li key={i} className="flex items-center gap-3 px-5 py-3 text-sm">
            <span className="w-16 shrink-0 text-xs tabular-nums text-muted">{m.date}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{m.concept}</p>
              <p className="truncate text-xs text-muted">{m.detail}</p>
            </div>
            <Badge tone={tone[m.kind]}>{t.dash.kinds[m.kind]}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FeaturedProjects() {
  const { mode } = useMode();
  const { t, data } = useI18n();
  const dev = mode === "dev";
  return (
    <Card>
      <CardHeader
        title={dev ? t.dash.deploysTitle : t.dash.invoicesTitle}
        hint={dev ? t.dash.deploysHint : t.dash.invoicesHint}
        action={
          <Link href="/panel/facturacion" className="text-xs font-semibold text-accent">
            {t.dash.viewAll}
          </Link>
        }
      />
      <ul className="divide-y divide-line">
        {data.projects.slice(0, 4).map((p) => (
          <li key={p.id}>
            <Link href={`/panel/facturacion?p=${p.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                <Icon name={dev ? "code" : "receipt"} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted">{dev ? p.stackLabel.join(" · ") : `${p.client} · ${p.date}`}</p>
              </div>
              <Badge tone="ok">{dev ? "● shipped" : t.dash.delivered}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function DashboardPage() {
  const { mode } = useMode();
  const { t } = useI18n();
  const kpis = useKpis();

  if (mode === "dev") {
    return (
      <div className="space-y-5">
        <KpiGrid items={kpis.dev} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_1fr]">
          <Terminal />
          <FeaturedProjects />
        </div>
        <ProfileCard />
        <Card>
          <CardHeader title="timeline" hint={t.dash.ganttHintDev} />
          <Gantt />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProfileCard />
      <KpiGrid items={kpis.admin} />
      <Card>
        <CardHeader title={t.dash.ganttTitle} hint={t.dash.ganttHint} />
        <Gantt />
      </Card>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Movements />
        <FeaturedProjects />
      </div>
    </div>
  );
}
