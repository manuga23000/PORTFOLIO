"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

export function Terminal() {
  const { t, data, lang } = useI18n();
  const tech = data.skills.filter((s) => s.category === "tech").map((s) => s.name);
  const script: { cmd: string; out: string[] }[] = [
    { cmd: "whoami", out: [`${data.profile.shortName.toLowerCase().replace(" ", "-")} — ${t.terminal.whoami}`] },
    {
      cmd: "cat stack.json",
      out: [
        "{",
        `  "front": ["React", "Next.js", "TypeScript"],`,
        `  "back":  ["Node.js", "Express", "Firebase"],`,
        `  "db":    ["PostgreSQL", "MongoDB"],`,
        `  "extra": ["Git", "WordPress", "Excel"]`,
        "}",
      ],
    },
    { cmd: lang === "en" ? "ls ./projects" : "ls ./proyectos", out: [data.projects.map((p) => p.id).join("  ")] },
    { cmd: lang === "en" ? "echo $SUPERPOWER" : "echo $SUPERPODER", out: [t.terminal.power] },
  ];
  const [lines, setLines] = useState(0);
  const total = script.length;

  useEffect(() => {
    if (lines >= total) return;
    const id = window.setTimeout(() => setLines((l) => l + 1), lines === 0 ? 250 : 650);
    return () => window.clearTimeout(id);
  }, [lines, total]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#06090d] font-mono text-[12.5px] leading-relaxed text-[#c9d4df] shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-[#6e7b8c]">emanuel@alessi: ~/portfolio — zsh</span>
      </div>
      <div className="min-h-[260px] overflow-x-auto p-4">
        {script.slice(0, lines).map((s) => (
          <div key={`${lang}-${s.cmd}`} className="rise mb-2">
            <p>
              <span className="text-[#7ee787]">➜</span> <span className="text-[#79c0ff]">~</span> {s.cmd}
            </p>
            {s.out.map((o, i) => (
              <p key={i} className="whitespace-pre text-[#8b98a9]">
                {o}
              </p>
            ))}
          </div>
        ))}
        <p className={lines >= total ? "caret" : ""}>
          <span className="text-[#7ee787]">➜</span> <span className="text-[#79c0ff]">~</span>
        </p>
        <p className="sr-only">
          {t.terminal.tech}: {tech.join(", ")}
        </p>
      </div>
    </div>
  );
}
