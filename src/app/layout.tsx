import type { Metadata, Viewport } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import { ModeProvider } from "@/components/ModeProvider";
import { profile } from "@/data/profile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.shortName} · Portfolio`,
    template: `%s · ${profile.shortName}`,
  },
  description:
    "Administrativo y desarrollador full stack. Mi portfolio es un sistema de gestión: entrá como reclutador y gestioná mi perfil.",
  openGraph: {
    title: `${profile.shortName} — el sistema de gestión de mi carrera`,
    description: "Administración + Desarrollo Full Stack. Entrá como reclutador y explorá el panel.",
    type: "website",
    locale: "es_AR",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#14213d",
};

// Aplica la vista guardada (o ?modo=dev) antes del primer pintado, sin parpadeo.
const modeScript = `(function(){try{var q=new URLSearchParams(location.search).get('modo');var m=(q==='dev'||q==='admin')?q:localStorage.getItem('modo');if(m==='dev'||m==='admin'){document.documentElement.dataset.mode=m;if(q)localStorage.setItem('modo',m)}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-mode="admin"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
