import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Lock, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

const EBOOK_CATALOG: Record<
  string,
  {
    title:       string;
    subtitle:    string;
    description: string;
    cover:       string;
    pages:       string;
    format:      string;
    accessType?: 'purchase' | 'clan';
    filename?:   string;
    buyHref?:    string;
  }
> = {
  "livro-ancestral": {
    title:       "Manual da Cozinha Ancestral",
    subtitle:    "+100 Receitas Ancestrais",
    description: "Um guia completo com receitas baseadas na alimentação ancestral humana — sem ultra-processados, sem inflamação, com sabor real.",
    cover:       "/images/capa-livro-de-receitas.png",
    pages:       "+180 páginas",
    format:      "PDF",
  },
  "jejum": {
    title:       "Guia Definitivo do Jejum Intermitente",
    subtitle:    "Protocolo completo para emagrecer e regenerar",
    description: "Do iniciante ao avançado: protocolos de jejum, benefícios, como quebrar o jejum corretamente e erros mais comuns.",
    cover:       "/images/capa-livro-de-receitas.png", // substituir pela capa correta
    pages:       "+120 páginas",
    format:      "PDF",
  },
  "nutricao-degeneracao-fisica": {
    title:       "Nutrição e Degeneração Física",
    subtitle:    "Weston A. Price (traduzido)",
    description: "Clássico da nutrição ancestral com observações de populações tradicionais e o impacto da alimentação moderna na saúde.",
    cover:       "/images/capa-livro-de-receitas.png",
    pages:       "Edição completa",
    format:      "PDF",
    accessType:  "clan",
    filename:    "Livro_Nutrição_e_Degeneração_Física_Weston_Price_traduzido.pdf",
    buyHref:     "/cla-ancestral",
  },
};

export default async function EbooksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, subscriptionStatus: true },
  });

  if (!user) redirect('/login');

  const hasClanAccess = user.subscriptionStatus === 'ACTIVE' || user.role === 'ADMIN';

  // Busca todas as transações PAID de ebooks deste usuário
  const purchases = await prisma.transaction.findMany({
    where: {
      userId:  session.userId,
      status:  "PAID",
      product: { in: ["livro-ancestral", "jejum"] },
    },
    select: { product: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const purchasedProducts = new Set(purchases.map((p) => p.product).filter(Boolean) as string[]);
  const hasAnyOwnedEbook = Object.entries(EBOOK_CATALOG).some(([productKey, ebook]) => {
    const isClanEbook = ebook.accessType === 'clan';
    return isClanEbook ? hasClanAccess : purchasedProducts.has(productKey);
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Meus Ebooks</h1>
        <p className="text-muted-foreground mt-2">
          Seus ebooks adquiridos — disponíveis para download a qualquer hora
        </p>
      </div>

      {!hasAnyOwnedEbook ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum ebook ainda</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Você ainda não adquiriu nenhum ebook. Conheça nosso Manual da Cozinha
            Ancestral e dê o primeiro passo.
          </p>
          <Button asChild>
            <Link href="/livro-de-receitas-ancestrais">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Conhecer o Livro
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(EBOOK_CATALOG).map(([productKey, ebook]) => {
            const isClanEbook = ebook.accessType === 'clan';
            const owned = isClanEbook ? hasClanAccess : purchasedProducts.has(productKey);
            const purchase = purchases.find((p) => p.product === productKey);
            const downloadHref = isClanEbook
              ? `/api/download/${ebook.filename}`
              : `/api/download/ebook?product=${productKey}`;
            const buyHref = ebook.buyHref ?? (productKey === 'livro-ancestral' ? '/livro-de-receitas-ancestrais' : '/jejum');

            return (
              <div
                key={productKey}
                className={`rounded-2xl border overflow-hidden flex flex-col transition-shadow ${
                  owned
                    ? "border-primary/30 bg-card shadow-md hover:shadow-lg"
                    : "border-dashed border-border bg-muted/20 opacity-60"
                }`}
              >
                {/* Cover */}
                <div className="relative w-full aspect-3/4 bg-zinc-900">
                  <Image
                    src={ebook.cover}
                    alt={ebook.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  {/* Owned badge */}
                  {owned && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      ADQUIRIDO
                    </div>
                  )}
                  {!owned && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                      {ebook.subtitle}
                    </p>
                    <h3 className="font-bold text-lg leading-tight">{ebook.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-3">
                      {ebook.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
                    <span>{ebook.pages}</span>
                    <span>·</span>
                    <span>{ebook.format}</span>
                    {purchase && (
                      <>
                        <span>·</span>
                        <span>
                          Comprado em{" "}
                          {new Date(purchase.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </div>

                  {owned ? (
                    <Button asChild className="w-full gap-2 mt-2">
                      <a href={downloadHref}>
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </a>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full mt-2">
                      <Link href={buyHref}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {isClanEbook ? 'Assinar Clã' : 'Adquirir'}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
