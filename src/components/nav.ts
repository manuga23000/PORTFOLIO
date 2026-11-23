import type { IconName } from "./Icon";

export type NavItem = {
  href: string;
  icon: IconName;
  admin: { label: string; title: string; subtitle: string };
  dev: { label: string; title: string; subtitle: string };
};

export const nav: NavItem[] = [
  {
    href: "/panel",
    icon: "dashboard",
    admin: { label: "Dashboard", title: "Dashboard", subtitle: "Resumen general del candidato" },
    dev: { label: "dashboard", title: "~/dashboard", subtitle: "// overview del perfil" },
  },
  {
    href: "/panel/inventario",
    icon: "box",
    admin: { label: "Inventario", title: "Inventario de habilidades", subtitle: "Stock disponible según proyectos entregados" },
    dev: { label: "stack", title: "~/stack", subtitle: "// tecnologías y uso real en proyectos" },
  },
  {
    href: "/panel/facturacion",
    icon: "receipt",
    admin: { label: "Facturación", title: "Facturación de proyectos", subtitle: "Comprobantes de trabajos entregados" },
    dev: { label: "deploys", title: "~/deploys", subtitle: "// proyectos entregados a clientes reales" },
  },
  {
    href: "/panel/seguimiento",
    icon: "route",
    admin: { label: "Seguimiento", title: "Seguimiento del candidato", subtitle: "Estado de la carrera en tiempo real" },
    dev: { label: "git log", title: "~/git-log", subtitle: "// historial de commits de mi carrera" },
  },
  {
    href: "/panel/turnos",
    icon: "calendar",
    admin: { label: "Turnos", title: "Reservar un turno", subtitle: "Agendá una entrevista o reunión" },
    dev: { label: "contacto", title: "~/contacto", subtitle: "// abrí un issue (o una entrevista)" },
  },
  {
    href: "/panel/reportes",
    icon: "file",
    admin: { label: "Reportes", title: "Reportes", subtitle: "Generá el CV del candidato en PDF" },
    dev: { label: "cv.pdf", title: "~/cv.pdf", subtitle: "// build del currículum" },
  },
];
