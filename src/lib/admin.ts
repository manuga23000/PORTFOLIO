import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** Cookie httpOnly con la sesión de administrador */
export const ADMIN_COOKIE = "erp_admin";
/** Cookie visible para el navegador: solo indica "hay sesión", sin secreto */
export const ADMIN_HINT_COOKIE = "erp_admin_ui";
export const SESSION_DAYS = 30;

function password() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function adminConfigured() {
  return password().length >= 8;
}

/** Token de sesión derivado de la contraseña: si cambiás ADMIN_PASSWORD, se cierran todas las sesiones. */
function sessionToken() {
  return createHmac("sha256", password()).update("alessi-erp-admin-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string) {
  return adminConfigured() && safeEqual(input, password());
}

export function newSessionValue() {
  return sessionToken();
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, sessionToken());
}

export function blobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}
