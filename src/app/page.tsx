"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { type Mode, useMode } from "@/components/ModeProvider";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useI18n } from "@/i18n";

const devSteps = ["npm run build", "compiling experience…", "✓ ready"];

export default function LoginPage() {
  const router = useRouter();
  const { mode, setMode } = useMode();
  const { t, data } = useI18n();
  const profile = data.profile;
  const loadingSteps = { admin: t.login.steps, dev: devSteps };
  const [loading, setLoading] = useState<Mode | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    router.prefetch("/panel");
  }, [router]);

  function enter(as: Mode) {
    if (loading) return;
    setMode(as);
    setLoading(as);
    const steps = loadingSteps[as].length;
    for (let i = 1; i < steps; i++) window.setTimeout(() => setStep(i), i * 260);
    window.setTimeout(() => router.push("/panel"), 850);
  }

  const isDev = mode === "dev";

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      {/* Fondo: grilla tipo planilla */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
        <ThemeToggle />
        <LangSwitch />
      </div>

      <div className="relative w-full max-w-[400px]">
        <div className="rise mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-accent font-display text-base font-bold text-accent-ink">
            {isDev ? ">_" : "EA"}
          </span>
          <div className="font-display leading-tight">
            <p className="text-lg font-bold">{isDev ? "alessi.dev" : "Alessi ERP"}</p>
            <p className="text-xs text-muted">{t.brand.loginSub}</p>
          </div>
        </div>

        <div className="rise rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_-20px_rgba(20,33,61,0.25)] sm:p-7" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-3">
            <Image
              src={profile.photo}
              alt={profile.name}
              width={56}
              height={56}
              priority
              className="size-14 rounded-full border-2 border-accent object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted">{t.login.file}</p>
              <p className="truncate font-display text-base font-semibold">{profile.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-ok">
                <span className="pulse-dot inline-block size-1.5 rounded-full bg-ok" /> {profile.status}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-muted">{t.login.user}</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm">
                <Icon name="user" className="size-4 text-muted" />
                <span>{isDev ? "guest@recruiter" : t.login.userValue}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">{t.login.password}</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm">
                <Icon name="lock" className="size-4 text-muted" />
                <span className="tracking-[0.3em]">••••••••</span>
                <span className="ml-auto text-[11px] text-muted">{t.login.autofilled}</span>
              </div>
            </label>
          </div>

          <button
            onClick={() => enter("admin")}
            disabled={!!loading}
            className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-4 py-3.5 font-display text-[15px] font-semibold text-accent-ink shadow-lg shadow-accent/25 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait"
          >
            {loading ? (
              <span className="relative z-10">{loadingSteps[loading][step]}</span>
            ) : (
              <>
                {t.login.enter}
                <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
            {loading && (
              <span className="absolute inset-y-0 left-0 w-full origin-left bg-black/15" style={{ animation: "grow-x .85s linear both" }} />
            )}
          </button>

          <button
            onClick={() => enter("dev")}
            disabled={!!loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-ink"
          >
            <Icon name="terminal" className="size-4" /> {t.login.enterDev}
          </button>
        </div>

        <p className="rise mt-5 text-center text-xs text-muted" style={{ animationDelay: "160ms" }}>
          {t.login.note}
          <br />
          <span className="opacity-80">{profile.role}</span>
        </p>
      </div>
    </main>
  );
}
