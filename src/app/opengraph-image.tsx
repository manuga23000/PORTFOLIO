import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.shortName} — portfolio como sistema de gestión`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen que muestra LinkedIn/WhatsApp al compartir el link.
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public", "emanuel-alessi.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const kpis = [
    ["4", "Empresas"],
    ["3", "Sistemas de gestión"],
    ["3+", "Años full stack"],
    ["UTN", "Técnico en Adm."],
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3f5f9", fontFamily: "sans-serif" }}>
        {/* Sidebar */}
        <div style={{ width: 250, background: "#14213d", display: "flex", flexDirection: "column", padding: 36, gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#2456d6",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              EA
            </div>
            <div style={{ color: "white", fontSize: 22, fontWeight: 700 }}>Alessi ERP</div>
          </div>
          {["Dashboard", "Inventario", "Facturación", "Seguimiento", "Turnos", "Reportes"].map((l, i) => (
            <div
              key={l}
              style={{
                display: "flex",
                color: i === 0 ? "white" : "#9aa7c4",
                fontSize: 20,
                padding: "10px 14px",
                borderRadius: 10,
                background: i === 0 ? "rgba(255,255,255,0.1)" : "transparent",
                marginTop: i === 0 ? 24 : 0,
              }}
            >
              {l}
            </div>
          ))}
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 48, gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <img src={photoSrc} width={130} height={130} style={{ borderRadius: 28, border: "4px solid white" }} alt="" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 50, fontWeight: 800, color: "#14213d", letterSpacing: -1 }}>{profile.shortName}</div>
              <div style={{ fontSize: 24, color: "#2456d6", fontWeight: 600 }}>Administración + Desarrollo Full Stack</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, color: "#15803d", fontWeight: 600 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: "#15803d" }} />
                Disponible para entrevistas
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 18 }}>
            {kpis.map(([v, l]) => (
              <div
                key={l}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  background: "white",
                  border: "1px solid #e1e6ef",
                  borderRadius: 18,
                  padding: "22px 24px",
                }}
              >
                <div style={{ fontSize: 46, fontWeight: 800, color: "#14213d" }}>{v}</div>
                <div style={{ fontSize: 19, color: "#5d6781" }}>{l}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#2456d6",
              borderRadius: 18,
              padding: "22px 28px",
              color: "white",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700 }}>Mi portfolio es un sistema de gestión</div>
            <div style={{ fontSize: 22, fontWeight: 600, background: "rgba(255,255,255,0.18)", padding: "10px 18px", borderRadius: 12 }}>
              Entrar como reclutador →
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
