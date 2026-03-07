import { prisma } from "@/lib/prisma";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Activity,
  Calendar,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProcessPaymentButton } from "@/components/admin/process-payment-button";
import { GrantAccessDialog } from "@/components/admin/grant-access-dialog";
import { ResendAccessButton } from "@/components/admin/resend-access-button";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100
  );

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const PRODUCT_LABELS: Record<string, string> = {
  "livro-ancestral": "Livro Ancestral (Vitalício)",
  jejum: "Jejum Intermitente (Ebook)",
  mensal: "Assinatura Mensal",
  anual: "Assinatura Anual",
};

function productLabel(product: string | null, amount: number): string {
  if (product) return PRODUCT_LABELS[product] ?? product;
  // Legacy AbacatePay rows without product field
  return amount >= 10_000 ? "Anual (legado)" : "Mensal (legado)";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-500/20 text-green-400 border-green-500/30",
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
    CANCELED: "bg-stone-500/20 text-stone-400 border-stone-500/30",
  };
  const labels: Record<string, string> = {
    PAID: "Pago",
    PENDING: "Pendente",
    FAILED: "Falhou",
    CANCELED: "Cancelado",
  };
  return (
    <Badge variant="outline" className={`${styles[status] ?? ""} font-medium`}>
      {labels[status] ?? status}
    </Badge>
  );
}

function SourceBadge({ source }: { source: string }) {
  return source === "KIWIFY" ? (
    <Badge className="bg-violet-500/20 text-violet-400 border border-violet-500/30 font-medium text-[10px]">
      Kiwify
    </Badge>
  ) : (
    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium text-[10px]">
      AbacatePay
    </Badge>
  );
}

function KPICard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card className="bg-stone-900 border-stone-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stone-400">{title}</CardTitle>
        <Icon className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-stone-50">{value}</div>
        {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function VendasPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const paid = transactions.filter((t) => t.status === "PAID");
  const pending = transactions.filter((t) => t.status === "PENDING");

  const faturamentoTotal = paid.reduce((s, t) => s + t.amount, 0);
  const vendasPendentes = pending.reduce((s, t) => s + t.amount, 0);
  const ticketMedio = paid.length > 0 ? faturamentoTotal / paid.length : 0;

  // Break down by product
  const kiwifyPaid = paid.filter((t) => t.source === "KIWIFY");
  const livros = paid.filter((t) => t.product === "livro-ancestral");
  const jejuns = paid.filter((t) => t.product === "jejum");
  const assinaturas = paid.filter((t) => t.product === "mensal" || t.product === "anual");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas & Financeiro</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe pagamentos do AbacatePay e Kiwify em tempo real
          </p>
        </div>
        <GrantAccessDialog />
      </div>

      {/* Dev warning */}
      {process.env.NODE_ENV === "development" && (
        <Card className="bg-amber-950/20 border-amber-900/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-500 mb-1">Modo de Desenvolvimento</h3>
                <p className="text-sm text-stone-400">
                  Em ambiente local, o Kiwify e o AbacatePay não conseguem enviar webhooks para
                  localhost. Use o botão{" "}
                  <span className="font-medium text-stone-300">&ldquo;Processar Manualmente&rdquo;</span>{" "}
                  para ativar transações após confirmar um pagamento. Em produção isso ocorre
                  automaticamente em segundos.
                </p>
                <p className="text-sm text-stone-500 mt-2">
                  Webhook Kiwify:{" "}
                  <code className="text-amber-400 text-xs bg-stone-800 px-1.5 py-0.5 rounded">
                    {process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/kiwify?token=SEU_TOKEN
                  </code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Faturamento Total"
          value={formatCurrency(faturamentoTotal)}
          icon={DollarSign}
          description="Vendas confirmadas"
        />
        <KPICard
          title="Pendente"
          value={formatCurrency(vendasPendentes)}
          icon={Activity}
          description={`${pending.length} aguardando confirmação`}
        />
        <KPICard
          title="Vendas Pagas"
          value={paid.length.toString()}
          icon={CreditCard}
          description={`${kiwifyPaid.length} via Kiwify · ${paid.length - kiwifyPaid.length} via AbacatePay`}
        />
        <KPICard
          title="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          icon={TrendingUp}
          description="Por transação paga"
        />
      </div>

      {/* Transactions table */}
      <Card className="bg-stone-900 border-stone-800">
        <CardHeader>
          <CardTitle className="text-xl text-stone-50">Histórico de Transações</CardTitle>
          <p className="text-sm text-stone-400">
            Todas as vendas de ambos os gateways — ordenadas por data
          </p>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-stone-800 p-4 mb-4">
                <CreditCard className="h-8 w-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-300 mb-2">
                Nenhuma transação ainda
              </h3>
              <p className="text-sm text-stone-500 max-w-sm">
                As vendas aparecerão aqui assim que o primeiro webhook chegar (Kiwify ou
                AbacatePay).
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-stone-800 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-stone-800 hover:bg-stone-800/50">
                    <TableHead className="text-stone-400">Cliente</TableHead>
                    <TableHead className="text-stone-400">Produto</TableHead>
                    <TableHead className="text-stone-400">Origem</TableHead>
                    <TableHead className="text-stone-400">Valor</TableHead>
                    <TableHead className="text-stone-400">Status</TableHead>
                    <TableHead className="text-stone-400">Data</TableHead>
                    <TableHead className="text-stone-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow
                      key={t.id}
                      className="border-stone-800 hover:bg-stone-800/30"
                    >
                      {/* Cliente */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-stone-800 border border-stone-700">
                            <AvatarFallback className="text-stone-400 text-xs">
                              {getInitials(t.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-stone-200 leading-none">
                              {t.user.name}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5">{t.user.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Produto */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-stone-500 flex-shrink-0" />
                          <span className="text-sm text-stone-300">
                            {productLabel(t.product, t.amount)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Origem */}
                      <TableCell>
                        <SourceBadge source={t.source} />
                      </TableCell>

                      {/* Valor */}
                      <TableCell>
                        <span className="font-semibold text-stone-200">
                          {formatCurrency(t.amount)}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>

                      {/* Data */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-stone-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(t.createdAt), "dd/MM/yy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </div>
                      </TableCell>

                      {/* Ações */}
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          {t.status === "PENDING" && (
                            <ProcessPaymentButton transactionId={t.id} />
                          )}
                          {t.status === "PAID" && (
                            <ResendAccessButton
                              transactionId={t.id}
                              customerEmail={t.user.email}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Livros Ancestrais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">{livros.length}</div>
            <p className="text-xs text-stone-500 mt-1">
              {formatCurrency(livros.reduce((s, t) => s + t.amount, 0))} em receita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Ebooks de Jejum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">{jejuns.length}</div>
            <p className="text-xs text-stone-500 mt-1">
              {formatCurrency(jejuns.reduce((s, t) => s + t.amount, 0))} em receita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Assinaturas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">{assinaturas.length}</div>
            <p className="text-xs text-stone-500 mt-1">
              {formatCurrency(assinaturas.reduce((s, t) => s + t.amount, 0))} em receita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">
              {transactions.length > 0
                ? `${Math.round((paid.length / transactions.length) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {paid.length} de {transactions.length} iniciativas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
