/**
 * GET /api/download/ebook?product=livro-ancestral
 *
 * Rota protegida para download de ebooks.
 * Verifica autenticação + compra confirmada antes de servir o arquivo.
 *
 * Arquivos ficam em: /private/ebooks/<product>.pdf
 * (fora de /public — não acessíveis diretamente via URL)
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { readFile } from "fs/promises";
import path from "path";

const EBOOK_FILES: Record<string, string> = {
  "livro-ancestral": "livro-ancestral.pdf",
  "jejum":           "jejum.pdf",
};

const EBOOK_NAMES: Record<string, string> = {
  "livro-ancestral": "Manual da Cozinha Ancestral.pdf",
  "jejum":           "Guia do Jejum Intermitente.pdf",
};

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
  const product = searchParams.get("product") ?? "";

  if (!EBOOK_FILES[product]) {
    return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
  }

  // 3. Check paid transaction
  const transaction = await prisma.transaction.findFirst({
    where: { userId: session.userId, product, status: "PAID" },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Você não possui esse produto." },
      { status: 403 }
    );
  }

  // 4. Read file from private/ebooks/
  const filePath = path.join(process.cwd(), "private", "ebooks", EBOOK_FILES[product]);

  let fileBuffer: Buffer;
  try {
    fileBuffer = await readFile(filePath);
  } catch {
    // File not uploaded yet — return friendly message
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
    resource: `ebook-${product}`,
    metadata: {
      downloadSize: fileBuffer.byteLength,
      filename: EBOOK_FILES[product],
    },
  })

  // 5. Serve file with download headers
  const filename = encodeURIComponent(EBOOK_NAMES[product]);
  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${EBOOK_NAMES[product]}"; filename*=UTF-8''${filename}`,
      "Content-Length":      fileBuffer.byteLength.toString(),
      "Cache-Control":       "private, no-store",
      "X-Robots-Tag":        "noindex",
    },
  });
}
