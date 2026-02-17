import { prisma } from '@/lib/prisma';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Activity,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProcessPaymentButton } from '@/components/admin/process-payment-button';

// Formatar valores em BRL
const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
};

// Obter iniciais do nome
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Componente de Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles = {
    PAID: 'bg-green-500/20 text-green-500 border-green-500/30',
    PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    FAILED: 'bg-red-500/20 text-red-500 border-red-500/30',
    CANCELED: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
  };

  const labels = {
    PAID: 'Pago',
    PENDING: 'Pendente',
    FAILED: 'Falhou',
    CANCELED: 'Cancelado',
  };

  return (
    <Badge 
      variant="outline" 
      className={`${styles[status as keyof typeof styles]} font-medium`}
    >
      {labels[status as keyof typeof labels] || status}
    </Badge>
  );
}

// Componente de KPI Card
function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  description 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  description?: string;
}) {
  return (
    <Card className="bg-stone-900 border-stone-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stone-400">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-stone-50">{value}</div>
        {description && (
          <p className="text-xs text-stone-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default async function VendasPage() {
  // Buscar todas as transações com dados do usuário
  const transactions = await prisma.transaction.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calcular métricas
  const paidTransactions = transactions.filter(t => t.status === 'PAID');
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING');
  
  const faturamentoTotal = paidTransactions.reduce((sum, t) => sum + t.amount, 0);
  const vendasPendentes = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalVendas = paidTransactions.length;
  const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendas & Financeiro</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe o fluxo de caixa e status dos pagamentos do AbacatePay
        </p>
      </div>
      {/* Aviso de Desenvolvimento Local */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-amber-950/20 border-amber-900/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-500 mb-1">Modo de Desenvolvimento</h3>
                <p className="text-sm text-stone-400">
                  Em ambiente local, o AbacatePay não consegue enviar webhooks. Use o botão 
                  <span className="font-medium text-stone-300"> "Processar Manualmente" </span>
                  para ativar assinaturas após pagamento confirmado. Em produção, isso acontece automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Faturamento Total"
          value={formatCurrency(faturamentoTotal)}
          icon={DollarSign}
          description="Vendas confirmadas"
        />
        <KPICard
          title="Vendas Pendentes"
          value={formatCurrency(vendasPendentes)}
          icon={Activity}
          description={`${pendingTransactions.length} aguardando pagamento`}
        />
        <KPICard
          title="Total de Vendas"
          value={totalVendas.toString()}
          icon={CreditCard}
          description="Transações concluídas"
        />
        <KPICard
          title="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          icon={TrendingUp}
          description="Por transação"
        />
      </div>

      {/* Tabela de Transações */}
      <Card className="bg-stone-900 border-stone-800">
        <CardHeader>
          <CardTitle className="text-xl text-stone-50">Histórico de Transações</CardTitle>
          <p className="text-sm text-stone-400">
            Listagem completa de todas as tentativas de compra e pagamentos
          </p>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-stone-800 p-4 mb-4">
                <CreditCard className="h-8 w-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-300 mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-sm text-stone-500 max-w-sm">
                As transações aparecerão aqui assim que os clientes iniciarem o processo de checkout
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-stone-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-stone-800 hover:bg-stone-800/50">
                    <TableHead className="text-stone-400">Cliente</TableHead>
                    <TableHead className="text-stone-400">Plano</TableHead>
                    <TableHead className="text-stone-400">Valor</TableHead>
                    <TableHead className="text-stone-400">Status</TableHead>
                    <TableHead className="text-stone-400">Data</TableHead>
                    <TableHead className="text-stone-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      className="border-stone-800 hover:bg-stone-800/30"
                    >
                      {/* Cliente */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-stone-800 border border-stone-700">
                            <AvatarFallback className="text-stone-400 text-xs">
                              {getInitials(transaction.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-stone-200">
                              {transaction.user.name}
                            </div>
                            <div className="text-sm text-stone-500">
                              {transaction.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Plano */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-stone-500" />
                          <span className="text-stone-300">
                            {transaction.amount >= 10000 ? 'Anual' : 'Mensal'}
                          </span>
                        </div>
                      </TableCell>

                      {/* Valor */}
                      <TableCell>
                        <span className="font-semibold text-stone-200">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={transaction.status} />
                      </TableCell>

                      {/* Data */}
                      <TableCell>
                        <div className="text-sm text-stone-400">
                          {format(new Date(transaction.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </div>
                      </TableCell>

                      {/* Ações */}
                      <TableCell>
                        {transaction.status === 'PENDING' && (
                          <ProcessPaymentButton transactionId={transaction.id} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Adicionais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">
              {transactions.length > 0 
                ? `${Math.round((totalVendas / transactions.length) * 100)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {totalVendas} de {transactions.length} tentativas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Planos Anuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">
              {paidTransactions.filter(t => t.amount >= 10000).length}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {formatCurrency(
                paidTransactions
                  .filter(t => t.amount >= 10000)
                  .reduce((sum, t) => sum + t.amount, 0)
              )} em receita
            </p>
          </CardContent>
        </Card>

        <Card className="bg-stone-900 border-stone-800">
          <CardHeader>
            <CardTitle className="text-sm text-stone-400">Planos Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-50">
              {paidTransactions.filter(t => t.amount < 10000).length}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {formatCurrency(
                paidTransactions
                  .filter(t => t.amount < 10000)
                  .reduce((sum, t) => sum + t.amount, 0)
              )} em receita
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
