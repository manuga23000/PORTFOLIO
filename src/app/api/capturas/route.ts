import { del, list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { projects } from "@/data/profile";
import { blobConfigured, isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const PREFIX = "proyectos/";
const TAG = "capturas";
const projectIds = new Set(projects.map((p) => p.id));

export type Screenshot = { url: string; pathname: string; uploadedAt: string };
export type ScreenshotMap = Record<string, Screenshot[]>;

/** Lista de capturas agrupadas por proyecto. Se cachea y se invalida al subir/borrar. */
const getScreenshots = unstable_cache(
  async (): Promise<ScreenshotMap> => {
    const map: ScreenshotMap = {};
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      for (const b of page.blobs) {
        const id = b.pathname.slice(PREFIX.length).split("/")[0];
        if (!projectIds.has(id)) continue;
        (map[id] ??= []).push({ url: b.url, pathname: b.pathname, uploadedAt: new Date(b.uploadedAt).toISOString() });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    for (const id in map) map[id].sort((a, b) => a.pathname.localeCompare(b.pathname));
    return map;
  },
  ["capturas-v1"],
  { tags: [TAG], revalidate: 3600 },
);

export async function GET() {
  if (!blobConfigured()) return NextResponse.json({ configured: false, screenshots: {} });
  try {
    return NextResponse.json({ configured: true, screenshots: await getScreenshots() });
  } catch (e) {
    console.error("[capturas] list", e);
    return NextResponse.json({ configured: true, screenshots: {}, error: "list_failed" }, { status: 500 });
  }
}

/** Subida directa desde el navegador: acá solo se autoriza (Vercel Blob client upload). */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("No autorizado");
        const [root, id] = pathname.split("/");
        if (`${root}/` !== PREFIX || !projectIds.has(id)) throw new Error("Proyecto inválido");
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        revalidateTag(TAG);
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

/** Refresca la lista después de subir (en local el callback de Vercel no llega). */
export async function PUT() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  revalidateTag(TAG);
  return NextResponse.json({ ok: true });
}

/** Borra una captura */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (typeof url !== "string" || !new URL(url).pathname.startsWith(`/${PREFIX}`)) {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }
  await del(url);
  revalidateTag(TAG);
  return NextResponse.json({ ok: true });
}
