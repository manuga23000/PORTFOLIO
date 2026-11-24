"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { fmt, useI18n } from "@/i18n";
import { useAdmin } from "@/lib/client-store";
import { CommandPalette, openPalette } from "./CommandPalette";
import { Icon } from "./Icon";
import { LangSwitch } from "./LangSwitch";
import { useMode } from "./ModeProvider";
import { ModeSwitch } from "./ModeSwitch";
import { nav } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string, href: string) {
  return href === "/panel" ? pathname === "/panel" : pathname.startsWith(href);
}

function Logo() {
  const { mode } = useMode();
  const { t } = useI18n();
  return (
    <Link href="/panel" className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-accent-ink">
        {mode === "dev" ? ">_" : "EA"}
      </span>
      <span className="font-display text-[15px] font-semibold leading-tight">
        {mode === "dev" ? "alessi.dev" : "Alessi ERP"}
        <span className="block text-[11px] font-normal opacity-60">{mode === "dev" ? "v3.4 · main" : t.brand.sub}</span>
      </span>
    </Link>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mode } = useMode();
  const { t, lang, data } = useI18n();
  const admin = useAdmin();
  const [bellOpen, setBellOpen] = useState(false);
  const current = nav.find((n) => isActive(pathname, n.href)) ?? nav[0];
  const meta = current.labels[lang][mode];
  const dev = mode === "dev";

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* ── Sidebar (desktop) ── */}
      <aside className="sticky top-0 hidden h-dvh flex-col bg-side px-4 py-5 text-side-ink lg:flex">
        <Logo />
        <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-side-muted">
          {dev ? t.shell.modulesDev : t.shell.modules}
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-side-active font-semibold text-side-ink" : "text-side-muted hover:bg-side-active hover:text-side-ink"
                }`}
              >
                <Icon name={item.icon} className={`size-[18px] ${active ? "text-accent" : ""}`} />
                {item.labels[lang][mode].label}
                {active && <span className="ml-auto size-1.5 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl bg-side-active p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-accent/20 text-accent">
              <Icon name={admin ? "shield" : "user"} className="size-4" />
            </span>
            <div className="min-w-0 text-xs">
              <p className="font-semibold">{admin ? "Admin" : dev ? "guest@recruiter" : t.shell.session}</p>
              <p className="text-side-muted">{admin ? t.shell.editMode : t.shell.readOnly}</p>
            </div>
          </div>
          <Link
            href={admin ? "/admin" : "/"}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-1.5 text-xs text-side-muted hover:text-side-ink"
          >
            <Icon name={admin ? "shield" : "logout"} className="size-3.5" /> {admin ? "/admin" : dev ? "exit" : t.shell.logout}
          </Link>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <div className="flex min-w-0 flex-col pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
          <div className="flex items-center gap-1.5 px-3 py-3 sm:gap-2 sm:px-6 lg:px-8">
            <Link
              href="/panel"
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-accent-ink lg:hidden"
            >
              {dev ? ">_" : "EA"}
            </Link>

            {/* Buscador (desktop: barra; mobile: ícono) */}
            <button
              onClick={openPalette}
              className="ml-2 hidden h-9 w-64 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm text-muted transition-colors hover:text-ink md:flex"
            >
              <Icon name="search" className="size-4" />
              {t.shell.search}
              <kbd className="ml-auto rounded border border-line px-1.5 text-[10px]">Ctrl K</kbd>
            </button>

            {admin && (
              <Link href="/admin" className="ml-1 hidden items-center gap-1 rounded-full bg-warn-soft px-2.5 py-1 text-[11px] font-semibold text-warn sm:flex">
                <Icon name="shield" className="size-3.5" /> {t.shell.editMode}
              </Link>
            )}

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <span className="hidden sm:block">
                <ModeSwitch />
              </span>
              <span className="sm:hidden">
                <ModeSwitch compact />
              </span>
              <button
                onClick={openPalette}
                aria-label={t.shell.search}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted hover:text-ink md:hidden"
              >
                <Icon name="search" className="size-4" />
              </button>
              <ThemeToggle />
              <LangSwitch />
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setBellOpen((v) => !v)}
                  aria-label={t.shell.notifications}
                  className="relative grid size-9 place-items-center rounded-full border border-line bg-surface text-muted hover:text-ink"
                >
                  <Icon name="bell" className="size-4" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-surface" />
                </button>
                {bellOpen && (
                  <div className="rise absolute right-0 top-11 w-72 rounded-xl border border-line bg-surface p-3 text-sm shadow-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t.shell.notifications}</p>
                    <div className="mt-2 flex gap-3 rounded-lg bg-surface-2 p-3">
                      <Image src={data.profile.photo} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{t.shell.newCandidate}</p>
                        <p className="text-xs text-muted">{fmt(t.shell.newCandidateText, { name: data.profile.shortName })}</p>
                        <Link href="/panel/turnos" onClick={() => setBellOpen(false)} className="mt-1 inline-block text-xs font-semibold text-accent">
                          {t.shell.schedule}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Image
                src={data.profile.photo}
                alt={data.profile.name}
                width={36}
                height={36}
                className="hidden size-9 rounded-full border border-line object-cover sm:block"
                priority
              />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div key={`${pathname}-${mode}-${lang}`} className="rise mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-[28px]">{meta.title}</h1>
            <p className="mt-1 text-sm text-muted">{meta.subtitle}</p>
          </div>
          {children}
        </main>
      </div>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-1 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5 backdrop-blur-md lg:hidden">
        <ul className="grid grid-cols-6">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] ${active ? "font-semibold text-accent" : "text-muted"}`}
                >
                  <Icon name={item.icon} className="size-5" />
                  <span className="max-w-full truncate px-0.5">{item.labels[lang][mode].label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <CommandPalette />
    </div>
  );
}
