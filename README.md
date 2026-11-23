# Alessi ERP — portfolio de Emanuel Alessi

Un portfolio con forma de **sistema de gestión**. El visitante entra como "reclutador" y recorre mi perfil como si fuera un ERP:

| Módulo | Vista Admin | Vista `</Dev>` |
|---|---|---|
| Dashboard | KPIs, Gantt de carrera, libro de movimientos | KPIs dev + terminal animada |
| Inventario | Skills como stock (calculado según los proyectos) | `~/stack` |
| Facturación | Cada proyecto es una factura | `~/deploys` con `git show` |
| Seguimiento | Seguimiento del candidato, como el del vehículo en el taller | `~/git-log` |
| Turnos | Reservar entrevista → WhatsApp / email precargado | `~/contacto` |
| Reportes | "Genera" el CV y lo descarga en PDF | `npm run build:cv` |

El switch **Vista Admin ↔ Vista Dev** cambia colores, tipografía, textos y el orden del contenido.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4. No usa otras dependencias: los íconos y los gráficos están hechos a mano.

## Correr en local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## Editar mis datos

Todo está en **`src/data/profile.ts`**: perfil, skills, proyectos, timeline y movimientos.

- `linkedin` / `github`: completalos y aparecen en Turnos.
- `projects[].uses`: qué skills usa cada proyecto. Con esto se calcula el "stock" del Inventario, así que revisalo para que refleje lo que usaste de verdad.
- Foto: `public/emanuel.jpg` · CV: `public/cv-emanuel-alessi.pdf`

## Links útiles

- `/?modo=dev` o `/panel?modo=dev` abre directo en la Vista Dev (sirve para compartir).
- `/panel/facturacion?p=cove` abre una factura puntual.

## Deploy en Vercel

1. Subí el repo a GitHub.
2. En vercel.com → *Add New Project* → importá el repo (detecta Next.js solo).
3. En *Environment Variables* agregá `NEXT_PUBLIC_SITE_URL` = `https://tu-dominio.com`. Sin esto, la imagen de preview de LinkedIn no carga.
4. Para el dominio propio: comprá `emanuelalessi.com.ar` en nic.ar y conectalo en *Settings → Domains*.

Para verificar la preview de LinkedIn: https://www.linkedin.com/post-inspector/

## Checklist para lanzarlo en LinkedIn

- [ ] Grabá un video de 15–20 s en el celular: login → dashboard → switch Admin/Dev → Reportes generando el CV.
- [ ] Subí el video nativo al post (no como link) y poné el link en el primer comentario.
- [ ] Texto sugerido: *"Soy administrativo y desarrollador. En vez de un portfolio común, hice el sistema de gestión… de mí mismo. Entrá como reclutador 👇"*
- [ ] Agregá el link en *Destacados* y en la sección de contacto de tu perfil.
