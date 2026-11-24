// ─────────────────────────────────────────────────────────────
// Traducciones al inglés de los datos de profile.ts.
// Si agregás o cambiás algo en profile.ts, actualizalo acá también
// (por id / sku). Lo que no esté acá se muestra en español.
// ─────────────────────────────────────────────────────────────

export const profileEn = {
  role: "Business Administration Graduate · Full Stack Developer",
  location: "San Nicolás de los Arroyos, Buenos Aires, Argentina",
  status: "Open to interviews",
  summary:
    "Business Administration graduate (UTN), currently pursuing a Bachelor's in Business Administration. Experience managing operations at small businesses and 3+ years as a full stack developer. I organize processes, work with numbers and use technology to automate tasks and build management tools.",
  summaryDev:
    "Full stack dev with 3+ years building products with TypeScript, Next.js and Node. The twist: I'm also a Business Administration graduate, so I understand the business behind every system I code.",
};

export const skillsEn: Record<string, { name?: string; group?: string }> = {
  "ADM-001": { name: "Business administration", group: "Administration" },
  "ADM-002": { name: "Inventory & purchasing control", group: "Administration" },
  "ADM-003": { name: "Income & expense tracking", group: "Finance" },
  "ADM-004": { name: "Invoicing & customer accounts", group: "Finance" },
  "ADM-005": { name: "Customer service", group: "Sales" },
  "ADM-006": { name: "Process automation", group: "Processes" },
  "ADM-007": { group: "Tools" },
  "DEV-001": { group: "Language" },
  "DEV-002": { group: "Language" },
  "DEV-007": { group: "Database" },
  "DEV-008": { group: "Database" },
  "DEV-010": { group: "Tools" },
};

type ProjectEn = {
  name?: string;
  client?: string;
  date?: string;
  modality?: string;
  summary?: string;
  items?: string[];
  stackLabel?: string[];
};

export const projectsEn: Record<string, ProjectEn> = {
  "gtm-sistema": {
    name: "Shop management system",
    client: "GTM · Grandoli Auto Repair Shop",
    date: "2025 – Present",
    modality: "On-site",
    summary: "End-to-end system for the shop: appointments, inventory, finances and vehicle tracking for customers.",
    items: [
      "Online appointment booking",
      "Vehicle status tracking for customers",
      "Parts and supplies inventory control",
      "Admin dashboard",
      "Financial manager with profitability reports",
    ],
  },
  "gtm-web": {
    client: "GTM · Grandoli Auto Repair Shop",
    date: "2025 – Present",
    modality: "On-site",
    summary: "Website and social media for the shop to attract new customers.",
    items: ["Website development", "Maintenance", "Social media content", "Customer acquisition"],
    stackLabel: ["Web", "Social media"],
  },
  srfitness: {
    name: "Gym membership manager",
    date: "Oct 2026 – Present",
    modality: "On-site",
    summary: "Web system for the trainer to manage member fees, with automatic reminders.",
    items: [
      "Payment and receipt tracking",
      "Due date control",
      "Automatic email reminders",
      "Member communication via WhatsApp",
    ],
    stackLabel: ["Web system", "Automated emails"],
  },
  cove: {
    client: "Blue Top Media · United States",
    date: "Jun 2024 – Jul 2025",
    modality: "Freelance, remote",
    summary:
      "Website builder platform with a form builder, authentication and contact management. I owned both frontend and backend.",
    items: ["Website builder", "Form builder", "Authentication (Clerk)", "Contact management", "Monorepo architecture"],
  },
  upperds: {
    date: "Jul 2023 – Jun 2024",
    modality: "Hybrid",
    summary: "Event management system for hotel and restaurant displays.",
    items: ["Event management", "Content for displays", "Dashboard for hotels and restaurants"],
  },
  valyria: {
    date: "Jul 2023 – Jun 2024",
    modality: "Hybrid",
    summary: "Online store for artificial plants.",
    items: ["E-commerce", "Product catalog", "Launch and support"],
  },
};

type RoleEn = { title?: string; short?: string; place?: string; label?: string; highlights?: string[] };

export const timelineEn: Record<string, RoleEn> = {
  henry: { place: "Intensive 4-month bootcamp", highlights: ["Graduated"] },
  adbize: {
    place: "Argentina · Full-time, hybrid",
    label: "Jul 2023 – Jun 2024",
    highlights: [
      "Custom apps and websites for multiple clients, from planning to launch",
      "Upper Ds (Next.js + Firebase) and Valyria Home (WordPress)",
    ],
  },
  tecnicatura: {
    title: "Associate Degree in Business Administration",
    short: "UTN · Associate",
    place: "National Technological University (UTN)",
    highlights: ["Graduated"],
  },
  bluetop: {
    place: "United States · Freelance, remote",
    label: "Jun 2024 – Jul 2025",
    highlights: ["Cove: platform with form builder, auth and contact management"],
  },
  gtm: {
    title: "Head of Administration & Digital Development",
    place: "Grandoli Auto Repair Shop · On-site",
    label: "Jul 2025 – Present",
    highlights: [
      "General administration: appointments, quotes, invoicing, customer accounts and suppliers",
      "Inventory, purchasing and profitability reports",
      "In-house management system built with Next.js + TypeScript",
    ],
  },
  licenciatura: {
    title: "Bachelor's in Business Administration",
    short: "UTN · Bachelor's",
    place: "National Technological University (UTN)",
    label: "2026 – In progress",
    highlights: ["In progress"],
  },
  srfitness: {
    title: "Administrative Assistant",
    label: "Oct 2026 – Present",
    highlights: ["Accounts and membership fee collection", "Membership web system with automatic reminders"],
  },
};

/** Mismo orden que `movements` en profile.ts */
export const movementsEn: { date: string; concept: string; detail: string }[] = [
  { date: "Oct 2026", concept: "Administrative Assistant", detail: "SR Fitness Gym" },
  { date: "2026", concept: "Associate Degree in Business Administration", detail: "UTN" },
  { date: "2026", concept: "Bachelor's in Business Administration", detail: "UTN · in progress" },
  { date: "Jul 2025", concept: "Head of Administration & Development", detail: "GTM" },
  { date: "Jul 2025", concept: "Full Stack Developer", detail: "Blue Top Media" },
  { date: "Jun 2024", concept: "Full Stack Developer (remote)", detail: "Blue Top Media · USA" },
  { date: "Jul 2023", concept: "Full Stack Developer", detail: "Adbize" },
  { date: "2023", concept: "Full Stack Developer", detail: "Henry" },
];
