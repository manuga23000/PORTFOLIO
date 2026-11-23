// ─────────────────────────────────────────────────────────────
// Todos los datos del portfolio viven acá.
// Si cambia algo en tu CV, editá solo este archivo.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Emanuel Nicolás Alessi",
  shortName: "Emanuel Alessi",
  role: "Técnico Universitario en Administración · Desarrollador Full Stack",
  location: "San Nicolás de los Arroyos, Buenos Aires",
  phone: "+54 9 336 431-5392",
  whatsapp: "5493364315392",
  email: "emanuelalessi14@gmail.com",
  linkedin: "", // ej: "https://www.linkedin.com/in/tu-usuario"
  github: "", // ej: "https://github.com/tu-usuario"
  photo: "/emanuel-alessi.jpg",
  cv: "/cv-emanuel-alessi.pdf",
  devSince: "2023-07",
  status: "Disponible para entrevistas",
  summary:
    "Técnico Universitario en Administración (UTN), cursando la Licenciatura en Administración de Empresas. Experiencia en la gestión administrativa de pymes y más de tres años como desarrollador full stack. Organizo procesos, trabajo con números y uso la tecnología para automatizar tareas y crear herramientas de gestión.",
  summaryDev:
    "Full stack dev con +3 años construyendo productos en TypeScript, Next.js y Node. Lo distinto: también soy Técnico en Administración, así que entiendo el negocio que hay detrás de cada sistema que programo.",
};

export type SkillCategory = "admin" | "tech";

export type Skill = {
  sku: string;
  name: string;
  category: SkillCategory;
  group: string;
};

export const skills: Skill[] = [
  { sku: "ADM-001", name: "Gestión administrativa", category: "admin", group: "Administración" },
  { sku: "ADM-002", name: "Control de stock y compras", category: "admin", group: "Administración" },
  { sku: "ADM-003", name: "Control de ingresos y egresos", category: "admin", group: "Finanzas" },
  { sku: "ADM-004", name: "Facturación y cuentas corrientes", category: "admin", group: "Finanzas" },
  { sku: "ADM-005", name: "Atención al cliente", category: "admin", group: "Comercial" },
  { sku: "ADM-006", name: "Automatización de procesos", category: "admin", group: "Procesos" },
  { sku: "ADM-007", name: "Excel / Google Sheets", category: "admin", group: "Herramientas" },
  { sku: "DEV-001", name: "TypeScript", category: "tech", group: "Lenguaje" },
  { sku: "DEV-002", name: "JavaScript", category: "tech", group: "Lenguaje" },
  { sku: "DEV-003", name: "React", category: "tech", group: "Frontend" },
  { sku: "DEV-004", name: "Next.js", category: "tech", group: "Framework" },
  { sku: "DEV-005", name: "Node.js", category: "tech", group: "Backend" },
  { sku: "DEV-006", name: "Express", category: "tech", group: "Backend" },
  { sku: "DEV-007", name: "PostgreSQL", category: "tech", group: "Base de datos" },
  { sku: "DEV-008", name: "MongoDB", category: "tech", group: "Base de datos" },
  { sku: "DEV-009", name: "Firebase", category: "tech", group: "Backend" },
  { sku: "DEV-010", name: "Git", category: "tech", group: "Herramientas" },
  { sku: "DEV-011", name: "WordPress", category: "tech", group: "CMS" },
];

export type Project = {
  id: string;
  number: string;
  name: string;
  client: string;
  date: string;
  modality: string;
  summary: string;
  items: string[];
  /** Skills (por nombre) que usa el proyecto: alimentan el "stock" del inventario */
  uses: string[];
  stackLabel: string[];
  url?: string;
  kind: "gestion" | "web" | "producto";
};

export const projects: Project[] = [
  {
    id: "gtm-sistema",
    number: "0001-00000006",
    name: "Sistema de gestión del taller",
    client: "GTM · Grandoli Taller Mecánico",
    date: "2025 – Actualidad",
    modality: "Presencial",
    summary:
      "Sistema integral para el taller: turnos, stock, finanzas y seguimiento del vehículo para el cliente.",
    items: [
      "Turnos online",
      "Seguimiento del vehículo para el cliente",
      "Control de stock de repuestos e insumos",
      "Panel de administración",
      "Gestor financiero con reportes de rentabilidad",
    ],
    uses: [
      "Next.js",
      "TypeScript",
      "React",
      "Control de stock y compras",
      "Control de ingresos y egresos",
      "Automatización de procesos",
      "Gestión administrativa",
      "Git",
    ],
    stackLabel: ["Next.js", "TypeScript"],
    kind: "gestion",
  },
  {
    id: "gtm-web",
    number: "0001-00000005",
    name: "mecanicagrandoli.com.ar",
    client: "GTM · Grandoli Taller Mecánico",
    date: "2025 – Actualidad",
    modality: "Presencial",
    summary: "Sitio web y redes sociales del taller para captar clientes.",
    items: ["Desarrollo del sitio web", "Mantenimiento", "Contenido para redes sociales", "Captación de clientes"],
    uses: ["Atención al cliente", "Gestión administrativa"],
    stackLabel: ["Web", "Redes sociales"],
    url: "https://mecanicagrandoli.com.ar",
    kind: "web",
  },
  {
    id: "srfitness",
    number: "0001-00000004",
    name: "Gestión de cuotas del gimnasio",
    client: "SR Fitness Gym",
    date: "Oct. 2026 – Actualidad",
    modality: "Presencial",
    summary:
      "Sistema web para que el profesor gestione las cuotas de los socios, con recordatorios automáticos.",
    items: [
      "Registro de pagos y comprobantes",
      "Control de vencimientos",
      "Recordatorios automáticos por email",
      "Comunicación con socios por WhatsApp",
    ],
    uses: [
      "Gestión administrativa",
      "Control de ingresos y egresos",
      "Facturación y cuentas corrientes",
      "Automatización de procesos",
      "Atención al cliente",
    ],
    stackLabel: ["Sistema web", "Emails automáticos"],
    kind: "gestion",
  },
  {
    id: "cove",
    number: "0001-00000003",
    name: "Cove",
    client: "Blue Top Media · Estados Unidos",
    date: "Jun. 2024 – Jul. 2025",
    modality: "Freelance remoto",
    summary:
      "Plataforma para crear páginas web con constructor de formularios, autenticación y gestión de contactos. Frontend y backend a cargo.",
    items: ["Constructor de páginas web", "Constructor de formularios", "Autenticación (Clerk)", "Gestión de contactos", "Arquitectura monorepo"],
    uses: ["TypeScript", "React", "Node.js", "Git"],
    stackLabel: ["TypeScript", "Clerk", "Monorepo"],
    kind: "producto",
  },
  {
    id: "upperds",
    number: "0001-00000002",
    name: "Upper Ds",
    client: "Adbize",
    date: "Jul. 2023 – Jun. 2024",
    modality: "Híbrido",
    summary: "Sistema de gestión de eventos para las pantallas de hoteles y restaurantes.",
    items: ["Gestión de eventos", "Contenido para pantallas", "Panel para hoteles y restaurantes"],
    uses: ["Next.js", "React", "Firebase", "JavaScript", "Git"],
    stackLabel: ["Next.js", "Firebase"],
    url: "https://upperds.com",
    kind: "gestion",
  },
  {
    id: "valyria",
    number: "0001-00000001",
    name: "Valyria Home",
    client: "Adbize",
    date: "Jul. 2023 – Jun. 2024",
    modality: "Híbrido",
    summary: "Tienda online de plantas artificiales.",
    items: ["E-commerce", "Catálogo de productos", "Publicación y soporte"],
    uses: ["WordPress", "JavaScript"],
    stackLabel: ["WordPress", "E-commerce"],
    url: "https://valyriahome.com",
    kind: "web",
  },
];

export type Role = {
  id: string;
  title: string;
  company: string;
  /** Nombre corto para el diagrama de Gantt */
  short: string;
  place: string;
  start: string; // YYYY-MM
  end: string | null; // null = actualidad
  label: string;
  type: "trabajo" | "estudio";
  highlights: string[];
};

export const timeline: Role[] = [
  {
    id: "henry",
    short: "Henry",
    title: "Full Stack Developer (bootcamp)",
    company: "Henry",
    place: "Bootcamp intensivo de 4 meses",
    start: "2023-03",
    end: "2023-07",
    label: "2023",
    type: "estudio",
    highlights: ["Egresado"],
  },
  {
    id: "adbize",
    short: "Adbize",
    title: "Full Stack Developer",
    company: "Adbize",
    place: "Argentina · Jornada completa, híbrido",
    start: "2023-07",
    end: "2024-06",
    label: "Jul. 2023 – Jun. 2024",
    type: "trabajo",
    highlights: [
      "Apps y sitios a medida para distintos clientes, de la planificación a la publicación",
      "Upper Ds (Next.js + Firebase) y Valyria Home (WordPress)",
    ],
  },
  {
    id: "tecnicatura",
    short: "UTN · Técnico",
    title: "Tecnicatura Universitaria en Administración",
    company: "UTN",
    place: "Universidad Tecnológica Nacional",
    start: "2024-03",
    end: "2026-07",
    label: "2024 – 2026",
    type: "estudio",
    highlights: ["Egresado"],
  },
  {
    id: "bluetop",
    short: "Blue Top Media",
    title: "Full Stack Developer",
    company: "Blue Top Media",
    place: "Estados Unidos · Freelance, remoto",
    start: "2024-06",
    end: "2025-07",
    label: "Jun. 2024 – Jul. 2025",
    type: "trabajo",
    highlights: ["Cove: plataforma con constructor de formularios, auth y gestión de contactos"],
  },
  {
    id: "gtm",
    short: "GTM",
    title: "Encargado de Administración y Desarrollo Digital",
    company: "GTM",
    place: "Grandoli Taller Mecánico · Presencial",
    start: "2025-07",
    end: null,
    label: "Jul. 2025 – Actualidad",
    type: "trabajo",
    highlights: [
      "Administración general: turnos, presupuestos, facturación, cuentas corrientes y proveedores",
      "Stock, compras y reportes de rentabilidad",
      "Sistema de gestión propio en Next.js + TypeScript",
    ],
  },
  {
    id: "licenciatura",
    short: "UTN · Licenciatura",
    title: "Licenciatura en Administración de Empresas",
    company: "UTN",
    place: "Universidad Tecnológica Nacional",
    start: "2026-03",
    end: null,
    label: "2026 – En curso",
    type: "estudio",
    highlights: ["En curso"],
  },
  {
    id: "srfitness",
    short: "SR Fitness",
    title: "Administrativo",
    company: "SR Fitness Gym",
    place: "San Nicolás de los Arroyos",
    start: "2026-10",
    end: null,
    label: "Oct. 2026 – Actualidad",
    type: "trabajo",
    highlights: ["Cuentas y cobranza de cuotas", "Sistema web de cuotas con recordatorios automáticos"],
  },
];

export type Movement = {
  date: string;
  kind: "Alta" | "Egreso" | "Cierre";
  concept: string;
  detail: string;
};

export const movements: Movement[] = [
  { date: "Oct. 2026", kind: "Alta", concept: "Administrativo", detail: "SR Fitness Gym" },
  { date: "2026", kind: "Egreso", concept: "Técnico Universitario en Administración", detail: "UTN" },
  { date: "2026", kind: "Alta", concept: "Licenciatura en Administración de Empresas", detail: "UTN · en curso" },
  { date: "Jul. 2025", kind: "Alta", concept: "Encargado de Administración y Desarrollo", detail: "GTM" },
  { date: "Jul. 2025", kind: "Cierre", concept: "Full Stack Developer", detail: "Blue Top Media" },
  { date: "Jun. 2024", kind: "Alta", concept: "Full Stack Developer (remoto)", detail: "Blue Top Media · EE.UU." },
  { date: "Jul. 2023", kind: "Alta", concept: "Full Stack Developer", detail: "Adbize" },
  { date: "2023", kind: "Egreso", concept: "Full Stack Developer", detail: "Henry" },
];

/** Cantidad de proyectos que usan cada skill → el "stock" del inventario */
export function skillUsage(name: string) {
  return projects.filter((p) => p.uses.includes(name)).length;
}

export function monthsSince(ym: string, now = new Date()) {
  const [y, m] = ym.split("-").map(Number);
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
}
