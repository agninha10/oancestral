/**
 * GET /api/download/ebook?product=<slug>
 *
 * Rota protegida para download de ebooks.
 * Verifica autenticação + acesso (compra, clã ou gratuito) antes de servir o arquivo.
 *
 * Arquivos ficam em: /privates/<filename>
 * (fora de /public — não acessíveis diretamente via URL)
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  // 1. Auth check
  const session = await getSession();
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Parse product param
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("product") ?? "";

  if (!slug) {
    return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
  }

  // 3. Find ebook in DB
  const ebook = await prisma.ebook.findUnique({
    where: { slug, published: true },
  });

  if (!ebook || !ebook.filename) {
    return NextResponse.json({ error: "Ebook não encontrado" }, { status: 404 });
  }

  // 4. Check access
  if (ebook.access === 'PURCHASE') {
    const transaction = await prisma.transaction.findFirst({
      where: { userId: session.userId, product: slug, status: "PAID" },
    });
    if (!transaction) {
      return NextResponse.json(
        { error: "Você não possui esse produto." },
        { status: 403 }
      );
    }
  } else if (ebook.access === 'CLAN') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { subscriptionStatus: true, role: true },
    });
    if (!user || (user.subscriptionStatus !== 'ACTIVE' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: "Acesso ao Clã necessário para baixar este ebook." },
        { status: 403 }
      );
    }
  }
  // FREE: sem verificação adicional

  // 5. Read file from /privates/
  const safeFilename = path.basename(ebook.filename);
  const filePath = path.join(process.cwd(), "privates", safeFilename);

  let fileBuffer: Buffer;
  try {
    fileBuffer = await readFile(filePath);
  } catch {
    return new NextResponse(
      "O arquivo ainda não está disponível. Entre em contato pelo suporte.",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  // Log ebook download
  await logActivity({
    userId: session.userId,
    action: 'EBOOK_DOWNLOAD',
    resource: `ebook-${slug}`,
    metadata: {
      downloadSize: fileBuffer.byteLength,
      filename: safeFilename,
    },
  });

  // 6. Serve file with download headers
  const displayName = ebook.title + ".pdf";
  const encodedName = encodeURIComponent(displayName);

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${displayName}"; filename*=UTF-8''${encodedName}`,
      "Content-Length":      fileBuffer.byteLength.toString(),
      "Cache-Control":       "private, no-store",
      "X-Robots-Tag":        "noindex",
    },
  });
}
