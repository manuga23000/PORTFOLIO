import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_HINT_COOKIE,
  SESSION_DAYS,
  adminConfigured,
  blobConfigured,
  checkPassword,
  isAdmin,
  newSessionValue,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Estado de la sesión y de la configuración */
export async function GET() {
  return NextResponse.json(
    { admin: await isAdmin(), configured: adminConfigured(), blob: blobConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/** Iniciar sesión */
export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };

  if (!adminConfigured()) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD en Vercel." }, { status: 503 });
  }
  if (typeof password !== "string" || !checkPassword(password)) {
    // Pequeña demora para frenar intentos por fuerza bruta
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const res = NextResponse.json({ admin: true });
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(ADMIN_COOKIE, newSessionValue(), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge });
  res.cookies.set(ADMIN_HINT_COOKIE, "1", { httpOnly: false, secure, sameSite: "lax", path: "/", maxAge });
  return res;
}

/** Cerrar sesión */
export async function DELETE() {
  const res = NextResponse.json({ admin: false });
  res.cookies.delete(ADMIN_COOKIE);
  res.cookies.delete(ADMIN_HINT_COOKIE);
  return res;
}
