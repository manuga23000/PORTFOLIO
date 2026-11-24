import { movementsEn, profileEn, projectsEn, skillsEn, timelineEn } from "./en";
import { movements, profile, projects, skills, skillUsage, timeline, type Movement, type Project, type Role, type Skill } from "./profile";

export type Lang = "es" | "en";
export type SkillWithStock = Skill & { stock: number };

export type Data = {
  profile: typeof profile;
  skills: SkillWithStock[];
  projects: Project[];
  timeline: Role[];
  movements: Movement[];
};

function build(lang: Lang): Data {
  // El stock se calcula siempre con los nombres originales (los de `uses`).
  const withStock = skills.map((s) => ({ ...s, stock: skillUsage(s.name) }));
  if (lang === "es") return { profile, skills: withStock, projects, timeline, movements };

  return {
    profile: { ...profile, ...profileEn },
    skills: withStock.map((s) => ({ ...s, ...skillsEn[s.sku] })),
    projects: projects.map((p) => ({ ...p, ...projectsEn[p.id] })),
    timeline: timeline.map((r) => ({ ...r, ...timelineEn[r.id] })),
    movements: movements.map((m, i) => ({ ...m, ...movementsEn[i] })),
  };
}

const cache: Partial<Record<Lang, Data>> = {};

export function getData(lang: Lang): Data {
  return (cache[lang] ??= build(lang));
}
