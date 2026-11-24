import type { Lang } from "@/data";
import type { IconName } from "./Icon";
import type { Mode } from "./ModeProvider";

type Labels = { label: string; title: string; subtitle: string };

export type NavItem = {
  href: string;
  icon: IconName;
  labels: Record<Lang, Record<Mode, Labels>>;
};

export const nav: NavItem[] = [
  {
    href: "/panel",
    icon: "dashboard",
    labels: {
      es: {
        admin: { label: "Dashboard", title: "Dashboard", subtitle: "Resumen general del candidato" },
        dev: { label: "dashboard", title: "~/dashboard", subtitle: "// overview del perfil" },
      },
      en: {
        admin: { label: "Dashboard", title: "Dashboard", subtitle: "Candidate overview" },
        dev: { label: "dashboard", title: "~/dashboard", subtitle: "// profile overview" },
      },
    },
  },
  {
    href: "/panel/inventario",
    icon: "box",
    labels: {
      es: {
        admin: { label: "Inventario", title: "Inventario de habilidades", subtitle: "Stock disponible según proyectos entregados" },
        dev: { label: "stack", title: "~/stack", subtitle: "// tecnologías y uso real en proyectos" },
      },
      en: {
        admin: { label: "Inventory", title: "Skills inventory", subtitle: "Available stock based on delivered projects" },
        dev: { label: "stack", title: "~/stack", subtitle: "// tech and real usage in projects" },
      },
    },
  },
  {
    href: "/panel/facturacion",
    icon: "receipt",
    labels: {
      es: {
        admin: { label: "Facturación", title: "Facturación de proyectos", subtitle: "Comprobantes de trabajos entregados" },
        dev: { label: "deploys", title: "~/deploys", subtitle: "// proyectos entregados a clientes reales" },
      },
      en: {
        admin: { label: "Invoicing", title: "Project invoicing", subtitle: "Receipts for delivered work" },
        dev: { label: "deploys", title: "~/deploys", subtitle: "// projects shipped to real clients" },
      },
    },
  },
  {
    href: "/panel/seguimiento",
    icon: "route",
    labels: {
      es: {
        admin: { label: "Seguimiento", title: "Seguimiento del candidato", subtitle: "Estado de la carrera en tiempo real" },
        dev: { label: "git log", title: "~/git-log", subtitle: "// historial de commits de mi carrera" },
      },
      en: {
        admin: { label: "Tracking", title: "Candidate tracking", subtitle: "Real-time career status" },
        dev: { label: "git log", title: "~/git-log", subtitle: "// commit history of my career" },
      },
    },
  },
  {
    href: "/panel/turnos",
    icon: "calendar",
    labels: {
      es: {
        admin: { label: "Turnos", title: "Reservar un turno", subtitle: "Agendá una entrevista o reunión" },
        dev: { label: "contacto", title: "~/contacto", subtitle: "// abrí un issue (o una entrevista)" },
      },
      en: {
        admin: { label: "Bookings", title: "Book a meeting", subtitle: "Schedule an interview or call" },
        dev: { label: "contact", title: "~/contact", subtitle: "// open an issue (or an interview)" },
      },
    },
  },
  {
    href: "/panel/reportes",
    icon: "file",
    labels: {
      es: {
        admin: { label: "Reportes", title: "Reportes", subtitle: "Generá el CV del candidato en PDF" },
        dev: { label: "cv.pdf", title: "~/cv.pdf", subtitle: "// build del currículum" },
      },
      en: {
        admin: { label: "Reports", title: "Reports", subtitle: "Generate the candidate's resume as PDF" },
        dev: { label: "cv.pdf", title: "~/cv.pdf", subtitle: "// resume build" },
      },
    },
  },
];
