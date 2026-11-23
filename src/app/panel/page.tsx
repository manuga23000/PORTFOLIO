"use client";

import Image from "next/image";
import Link from "next/link";
import { Gantt } from "@/components/Gantt";
import { Icon, type IconName } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Terminal } from "@/components/Terminal";
import { Badge, Card, CardHeader, CountUp, StatusDot } from "@/components/ui";
import { monthsSince, movements, profile, projects, skills } from "@/data/profile";

type Kpi = { icon: IconName; value: number; prefix?: string; suffix?: string; label: string; hint: string };

function useKpis(): { admin: Kpi[]; dev: Kpi[] } {
  const years = Math.floor(monthsSince(profile.devSince) / 12);
  const companies = new Set(["Adbize", "Blue Top Media", "GTM", "SR Fitness Gym"]).size;
  const gestion = projects.filter((p) => p.kind === "gestion").length;
  const tech = skills.filter((s) => s.category === "tech").length;
  return {
    admin: [
      { icon: "building", value: companies, label: "Empresas", hint: "2 pymes administradas hoy" },
      { icon: "layers", value: gestion, label: "Sistemas de gestión", hint: "Desarrollados y en uso" },
      { icon: "briefcase", value: years, suffix: "+", label: "Años de experiencia", hint: "Desde jul. 2023" },
      { icon: "graduation", value: 1, label: "Título UTN", hint: "+ Licenciatura en curso" },
    ],
    dev: [
      { icon: "code", value: years, suffix: "+", label: "años full stack", hint: "front + back + db" },
      { icon: "layers", value: projects.length, label: "proyectos entregados", hint: "clientes reales" },
      { icon: "terminal", value: tech, label: "tecnologías", hint: "TS · Next · Node · SQL" },
      { icon: "trending", value: 2, label: "pymes digitalizadas", hint: "GTM · SR Fitness" },
    ],
  };
}

function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((k, i) => (
        <Card key={k.label} className="p-4 sm:p-5" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center justify-between">
            <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon name={k.icon} className="size-[18px]" />
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-ok sm:block">▲ activo</span>
          </div>
          <p className="mt-4 font-display text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
            {k.prefix}
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
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {mode === "dev" ? profile.summaryDev : profile.summary}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Icon name="pin" className="size-3.5" /> {profile.location}
          </p>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <Link
            href="/panel/turnos"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
          >
            <Icon name="calendar" className="size-4" /> {mode === "dev" ? "contactar" : "Agendar entrevista"}
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
  const tone = { Alta: "ok", Egreso: "accent", Cierre: "neutral" } as const;
  return (
    <Card>
      <CardHeader title="Últimos movimientos" hint="Libro diario de la carrera" />
      <ul className="divide-y divide-line">
        {movements.map((m, i) => (
          <li key={i} className="flex items-center gap-3 px-5 py-3 text-sm">
            <span className="w-16 shrink-0 text-xs tabular-nums text-muted">{m.date}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{m.concept}</p>
              <p className="truncate text-xs text-muted">{m.detail}</p>
            </div>
            <Badge tone={tone[m.kind]}>{m.kind}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FeaturedProjects() {
  const { mode } = useMode();
  return (
    <Card>
      <CardHeader
        title={mode === "dev" ? "deploys recientes" : "Últimas facturas emitidas"}
        hint={mode === "dev" ? "lo último que llegó a producción" : "Proyectos entregados"}
        action={
          <Link href="/panel/facturacion" className="text-xs font-semibold text-accent">
            Ver todo →
          </Link>
        }
      />
      <ul className="divide-y divide-line">
        {projects.slice(0, 4).map((p) => (
          <li key={p.id}>
            <Link href={`/panel/facturacion?p=${p.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                <Icon name={mode === "dev" ? "code" : "receipt"} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted">
                  {mode === "dev" ? p.stackLabel.join(" · ") : `${p.client} · ${p.date}`}
                </p>
              </div>
              <Badge tone="ok">{mode === "dev" ? "● shipped" : "Entregada"}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function DashboardPage() {
  const { mode } = useMode();
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
          <CardHeader title="timeline" hint="// trabajo y formación en el tiempo" />
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
        <CardHeader title="Evolución del candidato" hint="Diagrama de Gantt · trabajo y formación" />
        <Gantt />
      </Card>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Movements />
        <FeaturedProjects />
      </div>
    </div>
  );
}
