"use client";

import { useMode } from "@/components/ModeProvider";
import { getData } from "@/data";
import { dict } from "./dict";

export { fmt } from "./dict";

/** Textos de la interfaz + datos del perfil en el idioma activo */
export function useI18n() {
  const { lang } = useMode();
  return { lang, t: dict[lang], data: getData(lang) };
}
