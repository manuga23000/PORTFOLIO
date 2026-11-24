"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fmt, useI18n } from "@/i18n";
import { loadScreenshots, useAdmin, useScreenshots } from "@/lib/client-store";
import { Icon } from "./Icon";

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 40);
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "png";
  return `${Date.now()}-${base || "captura"}.${ext}`;
}

export function Gallery({ projectId, projectName }: { projectId: string; projectName: string }) {
  const { t } = useI18n();
  const admin = useAdmin();
  const { screenshots, configured } = useScreenshots();
  const shots = screenshots[projectId] ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files);
    try {
      // Se carga solo cuando el admin sube algo: los visitantes no la descargan.
      const { upload } = await import("@vercel/blob/client");
      for (let i = 0; i < list.length; i++) {
        const f = list[i];
        await upload(`proyectos/${projectId}/${safeName(f.name)}`, f, {
          access: "public",
          handleUploadUrl: "/api/capturas",
          contentType: f.type || undefined,
          onUploadProgress: ({ percentage }) => setProgress(Math.round(((i + percentage / 100) / list.length) * 100)),
        });
      }
      await fetch("/api/capturas", { method: "PUT" });
      await loadScreenshots(true);
    } catch (e) {
      console.error(e);
      setError(t.gallery.error);
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  }

  async function remove(url: string) {
    if (!window.confirm(t.gallery.confirmRemove)) return;
    await fetch("/api/capturas", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    await loadScreenshots(true);
  }

  // Sin capturas y sin sesión de admin: no mostramos nada.
  if (!shots.length && !admin) return null;

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {t.gallery.title} {shots.length > 0 && <span className="opacity-60">· {shots.length}</span>}
        </p>
        {admin && configured && (
          <>
            <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            <button
              onClick={() => input.current?.click()}
              disabled={progress !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-2.5 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent-soft disabled:opacity-60"
            >
              <Icon name="upload" className="size-3.5" />
              {progress !== null ? fmt(t.gallery.uploading, { n: progress }) : t.gallery.upload}
            </button>
          </>
        )}
      </div>

      {admin && !configured && <p className="rounded-lg bg-warn-soft p-3 text-xs text-warn">{t.gallery.notConfigured}</p>}
      {error && <p className="mb-2 rounded-lg bg-warn-soft p-2 text-xs text-warn">{error}</p>}

      {shots.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shots.map((s, i) => (
            <div key={s.url} className="group relative aspect-video overflow-hidden rounded-lg border border-line bg-surface-2">
              <button onClick={() => setOpen(i)} aria-label={fmt(t.gallery.open, { n: i + 1 })} className="absolute inset-0">
                <Image
                  src={s.url}
                  alt={`${projectName} — ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 180px, 45vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              {admin && (
                <button
                  onClick={() => remove(s.url)}
                  aria-label={t.gallery.remove}
                  title={t.gallery.remove}
                  className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-black/60 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Icon name="trash" className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        admin &&
        configured && (
          <button
            onClick={() => input.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line p-6 text-center text-xs text-muted transition-colors hover:border-accent hover:text-ink"
          >
            <Icon name="image" className="size-6" />
            {t.gallery.empty}
          </button>
        )
      )}

      {open !== null && shots[open] && (
        <Lightbox shots={shots.map((s) => s.url)} index={open} onIndex={setOpen} title={projectName} />
      )}
    </div>
  );
}

function Lightbox({
  shots,
  index,
  onIndex,
  title,
}: {
  shots: string[];
  index: number;
  onIndex: (i: number | null) => void;
  title: string;
}) {
  const { t } = useI18n();
  const go = useCallback((d: number) => onIndex((index + d + shots.length) % shots.length), [index, onIndex, shots.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onIndex]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-sm" onClick={() => onIndex(null)}>
      <div className="flex items-center justify-between p-3 text-sm text-white/80">
        <span className="truncate px-2">
          {title} · {index + 1}/{shots.length}
        </span>
        <button aria-label={t.gallery.close} className="grid size-10 place-items-center rounded-full hover:bg-white/10" onClick={() => onIndex(null)}>
          <Icon name="close" className="size-5" />
        </button>
      </div>
      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <Image key={shots[index]} src={shots[index]} alt={`${title} — ${index + 1}`} fill sizes="100vw" className="rise object-contain p-2 sm:p-8" />
        {shots.length > 1 && (
          <>
            <button
              aria-label={t.gallery.prev}
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <Icon name="arrow" className="size-5 rotate-180" />
            </button>
            <button
              aria-label={t.gallery.next}
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <Icon name="arrow" className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
