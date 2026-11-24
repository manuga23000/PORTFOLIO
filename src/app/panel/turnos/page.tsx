"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useMode } from "@/components/ModeProvider";
import { Card, CardHeader } from "@/components/ui";
import { useI18n } from "@/i18n";

export default function TurnosPage() {
  const { mode } = useMode();
  const { t, data } = useI18n();
  const profile = data.profile;
  const dev = mode === "dev";
  // Motivo y franja se guardan como índice: sobreviven al cambio de idioma.
  const [form, setForm] = useState({ name: "", company: "", reason: 0, date: "", slot: 0, message: "" });
  const [ticket, setTicket] = useState<string | null>(null);

  const set = (k: "name" | "company" | "date" | "message") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const reason = t.book.reasons[form.reason];
  const slot = t.book.slots[form.slot];

  function buildMessage() {
    const m = t.book.msg;
    const lines: (string | null)[] = [
      m.hello,
      "",
      `• ${m.name}: ${form.name}`,
      form.company ? `• ${m.company}: ${form.company}` : null,
      `• ${m.reason}: ${reason}`,
      form.date ? `• ${m.date}: ${new Date(form.date + "T12:00").toLocaleDateString(t.locale)} (${slot})` : null,
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
        : `mailto:${profile.email}?subject=${encodeURIComponent(`${t.book.subject} ${n} · ${reason}`)}&body=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const valid = form.name.trim().length > 1;
  const input =
    "mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader title={dev ? t.book.titleDev : t.book.title} hint={t.book.hint} />
        <form
          className="grid gap-4 p-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) confirm("whatsapp");
          }}
        >
          <label className="block">
            <span className="text-xs font-medium text-muted">{t.book.name}</span>
            <input required value={form.name} onChange={set("name")} className={input} placeholder={t.book.namePh} autoComplete="name" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted">{t.book.company}</span>
            <input value={form.company} onChange={set("company")} className={input} placeholder={t.book.companyPh} autoComplete="organization" />
          </label>

          <fieldset className="sm:col-span-2">
            <legend className="text-xs font-medium text-muted">{t.book.reason}</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {t.book.reasons.map((r, i) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm((f) => ({ ...f, reason: i }))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    form.reason === i ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:text-ink"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-xs font-medium text-muted">{t.book.date}</span>
            <input type="date" value={form.date} onChange={set("date")} className={input} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted">{t.book.slot}</span>
            <select value={form.slot} onChange={(e) => setForm((f) => ({ ...f, slot: Number(e.target.value) }))} className={input}>
              {t.book.slots.map((s, i) => (
                <option key={s} value={i}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-muted">{t.book.message}</span>
            <textarea value={form.message} onChange={set("message")} rows={3} className={input} placeholder={t.book.messagePh} />
          </label>

          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
            <button
              type="submit"
              disabled={!valid}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition-opacity disabled:opacity-40"
            >
              <Icon name="message" className="size-4" /> {t.book.whatsapp}
            </button>
            <button
              type="button"
              disabled={!valid}
              onClick={() => confirm("email")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
            >
              <Icon name="mail" className="size-4" /> {t.book.email}
            </button>
          </div>
        </form>
      </Card>

      <div className="space-y-5">
        {ticket ? (
          <Card className="overflow-hidden">
            <div className="bg-ok-soft p-5 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-ok text-ok-ink">
                <Icon name="check" className="size-6" />
              </span>
              <p className="mt-3 font-display text-lg font-bold">{t.book.done}</p>
              <p className="text-sm text-muted">
                {t.book.receipt} {ticket}
              </p>
            </div>
            <p className="p-5 text-sm text-muted">{t.book.doneText}</p>
          </Card>
        ) : (
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.book.preview}</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-surface-2 p-4 font-sans text-sm leading-relaxed">
              {valid ? buildMessage() : t.book.previewEmpty}
            </pre>
          </Card>
        )}

        <Card>
          <CardHeader title={dev ? "contact.json" : t.book.contact} />
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
