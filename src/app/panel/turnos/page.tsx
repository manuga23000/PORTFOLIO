"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Card, CardHeader } from "@/components/ui";
import { profile } from "@/data/profile";

const reasons = ["Entrevista laboral", "Propuesta de trabajo", "Proyecto freelance", "Consulta"];
const slots = ["Mañana", "Mediodía", "Tarde"];

export default function TurnosPage() {
  const { mode } = useMode();
  const dev = mode === "dev";
  const [form, setForm] = useState({ name: "", company: "", reason: reasons[0], date: "", slot: slots[0], message: "" });
  const [ticket, setTicket] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function buildMessage() {
    const lines: (string | null)[] = [
      "Hola Emanuel! Vi tu portfolio y quiero reservar un turno.",
      "",
      `• Nombre: ${form.name}`,
      form.company ? `• Empresa: ${form.company}` : null,
      `• Motivo: ${form.reason}`,
      form.date ? `• Fecha preferida: ${new Date(form.date + "T12:00").toLocaleDateString("es-AR")} (${form.slot})` : null,
      ...(form.message ? ["", form.message] : []),
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  function confirm(channel: "whatsapp" | "email") {
    const n = `T-${String(Date.now()).slice(-5)}`;
    setTicket(n);
    const text = buildMessage();
    const url =
      channel === "whatsapp"
        ? `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${profile.email}?subject=${encodeURIComponent(`Turno ${n} · ${form.reason}`)}&body=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const valid = form.name.trim().length > 1;
  const input =
    "mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader
          title={dev ? "new issue: entrevista" : "Nuevo turno"}
          hint="Se envía directo a mi WhatsApp o mail, con todo precargado."
        />
        <form
          className="grid gap-4 p-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) confirm("whatsapp");
          }}
        >
          <label className="block">
            <span className="text-xs font-medium text-muted">Tu nombre *</span>
            <input required value={form.name} onChange={set("name")} className={input} placeholder="Ej: Laura Gómez" autoComplete="name" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted">Empresa</span>
            <input value={form.company} onChange={set("company")} className={input} placeholder="Ej: Acme S.A." autoComplete="organization" />
          </label>

          <fieldset className="sm:col-span-2">
            <legend className="text-xs font-medium text-muted">Motivo</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {reasons.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm((f) => ({ ...f, reason: r }))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    form.reason === r ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-xs font-medium text-muted">Fecha preferida</span>
            <input type="date" value={form.date} onChange={set("date")} className={input} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted">Franja horaria</span>
            <select value={form.slot} onChange={set("slot")} className={input}>
              {slots.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-muted">Mensaje</span>
            <textarea value={form.message} onChange={set("message")} rows={3} className={input} placeholder="Contame un poco sobre el puesto o el proyecto…" />
          </label>

          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
            <button
              type="submit"
              disabled={!valid}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition-opacity disabled:opacity-40"
            >
              <Icon name="message" className="size-4" /> Confirmar por WhatsApp
            </button>
            <button
              type="button"
              disabled={!valid}
              onClick={() => confirm("email")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
            >
              <Icon name="mail" className="size-4" /> Confirmar por email
            </button>
          </div>
        </form>
      </Card>

      <div className="space-y-5">
        {ticket ? (
          <Card className="overflow-hidden">
            <div className="bg-ok-soft p-5 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-ok text-white">
                <Icon name="check" className="size-6" />
              </span>
              <p className="mt-3 font-display text-lg font-bold">¡Turno solicitado!</p>
              <p className="text-sm text-muted">Comprobante {ticket}</p>
            </div>
            <p className="p-5 text-sm text-muted">
              Se abrió tu mensaje listo para enviar. Mandalo y te respondo a la brevedad.
            </p>
          </Card>
        ) : (
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Vista previa del mensaje</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-surface-2 p-4 font-sans text-sm leading-relaxed">
              {valid ? buildMessage() : "Completá tu nombre para ver el mensaje…"}
            </pre>
          </Card>
        )}

        <Card>
          <CardHeader title={dev ? "contact.json" : "Datos de contacto"} />
          <ul className="divide-y divide-line text-sm">
            <li>
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2">
                <Icon name="phone" className="size-4 text-accent" /> {profile.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="flex items-center gap-3 break-all px-5 py-3 hover:bg-surface-2">
                <Icon name="mail" className="size-4 shrink-0 text-accent" /> {profile.email}
              </a>
            </li>
            {profile.linkedin && (
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2">
                  <Icon name="external" className="size-4 text-accent" /> LinkedIn
                </a>
              </li>
            )}
            <li className="flex items-center gap-3 px-5 py-3">
              <Icon name="pin" className="size-4 text-accent" /> {profile.location}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
