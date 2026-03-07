/**
 * GET /api/download/ebook?product=livro-ancestral
 *
 * Rota protegida para download de ebooks.
 * Verifica autenticação + compra confirmada antes de redirecionar ao arquivo.
 *
 * Env vars:
 *   EBOOK_LIVRO_ANCESTRAL_DOWNLOAD_URL — URL direta do PDF (Google Drive, S3, etc.)
 *   EBOOK_JEJUM_DOWNLOAD_URL           — URL direta do PDF do ebook de jejum
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const DOWNLOAD_URLS: Record<string, string | undefined> = {
  "livro-ancestral": process.env.EBOOK_LIVRO_ANCESTRAL_DOWNLOAD_URL,
  "jejum":           process.env.EBOOK_JEJUM_DOWNLOAD_URL,
};

const VALID_PRODUCTS = Object.keys(DOWNLOAD_URLS) as string[];

export async function GET(req: Request) {
  // 1. Auth check
  const session = await getSession();
  if (!session) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Parse product param
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") ?? "";

  if (!VALID_PRODUCTS.includes(product)) {
    return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
  }

  // 3. Check if user has a paid transaction for this product
  const transaction = await prisma.transaction.findFirst({
    where: {
      userId:  session.userId,
      product,
      status:  "PAID",
    },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Você não possui esse produto. Adquira em oancestral.com.br" },
      { status: 403 }
    );
  }

  // 4. Get download URL
  const downloadUrl = DOWNLOAD_URLS[product];

  if (!downloadUrl) {
    // File URL not configured yet — return friendly error
    return NextResponse.json(
      {
        error: "Download temporariamente indisponível. Entre em contato pelo suporte.",
        product,
      },
      { status: 503 }
    );
  }

  // 5. Redirect to the actual file (Google Drive / S3 / CDN)
  return NextResponse.redirect(downloadUrl);
}
