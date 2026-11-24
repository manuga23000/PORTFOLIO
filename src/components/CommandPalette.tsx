"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmt, useI18n } from "@/i18n";
import { Icon, type IconName } from "./Icon";
import { useMode } from "./ModeProvider";
import { nav } from "./nav";

const OPEN_EVENT = "erp:palette";

/** Abre el buscador desde cualquier botón */
export function openPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: IconName;
  keywords?: string;
  run: () => void;
};

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CommandPalette() {
  const router = useRouter();
  const { mode, setMode, theme, setTheme, lang, setLang } = useMode();
  const { t, data } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Atajos: Ctrl/Cmd+K y "/"
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const pages: Item[] = nav.map((n) => ({
      id: `page-${n.href}`,
      group: t.palette.pages,
      label: n.labels[lang][mode].title,
      hint: n.labels[lang][mode].subtitle,
      icon: n.icon,
      // Se puede buscar por el nombre en ambos idiomas y vistas
      keywords: Object.values(n.labels)
        .flatMap((l) => Object.values(l).map((x) => `${x.label} ${x.title}`))
        .join(" "),
      run: go(n.href),
    }));
    const projects: Item[] = data.projects.map((p) => ({
      id: `project-${p.id}`,
      group: t.palette.projects,
      label: p.name,
      hint: `${p.client} · ${p.stackLabel.join(", ")}`,
      icon: "receipt",
      keywords: `${p.summary} ${p.items.join(" ")} ${p.uses.join(" ")} ${p.url ?? ""}`,
      run: go(`/panel/facturacion?p=${p.id}`),
    }));
    const skills: Item[] = data.skills.map((s) => ({
      id: `skill-${s.sku}`,
      group: t.palette.skills,
      label: s.name,
      hint: `${s.sku} · ${s.group}`,
      icon: s.category === "tech" ? "code" : "box",
      run: go(`/panel/inventario?q=${encodeURIComponent(s.name)}`),
    }));
    const actions: Item[] = [
      {
        id: "cv",
        group: t.palette.actions,
        label: t.palette.cv,
        icon: "download",
        keywords: "cv resume curriculum pdf",
        run: () => {
          const a = document.createElement("a");
          a.href = data.profile.cv;
          a.download = "";
          a.click();
        },
      },
      ...(mode === "admin"
        ? [
            {
              id: "theme",
              group: t.palette.actions,
              label: theme === "dark" ? t.palette.toLight : t.palette.toDark,
              icon: "layers" as IconName,
              keywords: "dark light noche dia tema theme",
              run: () => setTheme(theme === "dark" ? "light" : "dark"),
            },
          ]
        : []),
      {
        id: "mode",
        group: t.palette.actions,
        label: mode === "admin" ? t.palette.toDev : t.palette.toAdmin,
        icon: "terminal",
        keywords: "dev admin vista view",
        run: () => setMode(mode === "admin" ? "dev" : "admin"),
      },
      {
        id: "lang",
        group: t.palette.actions,
        label: t.palette.toOtherLang,
        icon: "message",
        keywords: "english ingles español spanish idioma language",
        run: () => setLang(lang === "es" ? "en" : "es"),
      },
      {
        id: "whatsapp",
        group: t.palette.actions,
        label: t.palette.whatsapp,
        hint: data.profile.phone,
        icon: "phone",
        run: () => window.open(`https://wa.me/${data.profile.whatsapp}`, "_blank", "noopener,noreferrer"),
      },
      {
        id: "email",
        group: t.palette.actions,
        label: t.palette.email,
        hint: data.profile.email,
        icon: "mail",
        run: () => {
          window.location.href = `mailto:${data.profile.email}`;
        },
      },
    ];
    return [...pages, ...projects, ...skills, ...actions];
  }, [data, lang, mode, router, setLang, setMode, setTheme, t, theme]);

  const results = useMemo(() => {
    const query = norm(q.trim());
    if (!query) return items.filter((i) => i.group === t.palette.pages || i.group === t.palette.actions);
    const words = query.split(/\s+/);
    return items
      .map((i) => {
        const label = norm(i.label);
        const hay = norm(`${i.label} ${i.hint ?? ""} ${i.keywords ?? ""}`);
        if (!words.every((w) => hay.includes(w))) return null;
        const score = label.startsWith(query) ? 0 : label.includes(query) ? 1 : 2;
        return { i, score };
      })
      .filter((x): x is { i: Item; score: number } => !!x)
      .sort((a, b) => a.score - b.score)
      .slice(0, 14)
      .map((x) => x.i);
  }, [items, q, t]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function run(item: Item | undefined) {
    if (!item) return;
    setOpen(false);
    item.run();
  }

  if (!open) return null;

  // Agrupar manteniendo el orden
  const groups: { name: string; items: { item: Item; idx: number }[] }[] = [];
  results.forEach((item, idx) => {
    const g = groups.find((x) => x.name === item.group) ?? groups[groups.push({ name: item.group, items: [] }) - 1];
    g.items.push({ item, idx });
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-3 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.palette.placeholder}
        className="rise w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" className="size-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(results[active]);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder={t.palette.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:block">esc</kbd>
        </div>

        <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">{fmt(t.palette.empty, { q })}</li>}
          {groups.map((g) => (
            <li key={g.name} role="presentation">
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">{g.name}</p>
              <ul role="presentation">
                {g.items.map(({ item, idx }) => (
                  <li
                    key={item.id}
                    id={`palette-${item.id}`}
                    role="option"
                    aria-selected={idx === active}
                    data-idx={idx}
                    onMouseMove={() => setActive(idx)}
                    onClick={() => run(item)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${idx === active ? "bg-accent-soft" : ""}`}
                  >
                    <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${idx === active ? "bg-accent text-accent-ink" : "bg-surface-2 text-muted"}`}>
                      <Icon name={item.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{item.label}</span>
                      {item.hint && <span className="block truncate text-xs text-muted">{item.hint}</span>}
                    </span>
                    {idx === active && <Icon name="arrow" className="size-4 shrink-0 text-accent" />}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="hidden border-t border-line px-4 py-2 text-[11px] text-muted sm:block">{t.palette.hints}</p>
      </div>
    </div>
  );
}
