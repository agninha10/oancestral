import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getAllUsersActivityLog } from '@/lib/activity-log'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface ActivityLogPageProps {
  searchParams: Promise<{
    action?: string
    userId?: string
    page?: string
  }>
}

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  LOGIN_FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  LOGOUT: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  PAGE_ACCESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  DASHBOARD_ACCESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  DOWNLOAD: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  EBOOK_DOWNLOAD: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  PURCHASE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  COURSE_ENROLLMENT: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  BLOG_POST_VIEW: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  LESSON_ACCESS: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  PROFILE_UPDATE: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  FASTING_ACCESS: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

export default async function ActivityLogPage({ searchParams }: ActivityLogPageProps) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const params = await searchParams
  const action = params.action
  const userId = params.userId
  const page = parseInt(params.page || '1')
  const limit = 50
  const offset = (page - 1) * limit

  // Get filtered activity logs
  const logs = await getAllUsersActivityLog(
    {
      action: action || undefined,
      userId: userId || undefined,
    },
    limit,
    offset
  )

  // Get total count for pagination
  const whereClause: any = {}
  if (action) whereClause.action = action
  if (userId) whereClause.userId = userId

  const totalCount = await prisma.activityLog.count({ where: whereClause })
  const totalPages = Math.ceil(totalCount / limit)

  // Get unique actions for filter
  const uniqueActions = await prisma.activityLog.groupBy({
    by: ['action'],
    _count: true,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Histórico de Atividades</h1>
        <p className="text-muted-foreground mt-2">
          Rastreie logins, downloads, acessos e outras ações dos usuários
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-xs">
              <label className="text-sm font-medium">Ação</label>
              <select
                name="action"
                defaultValue={action || ''}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Todas as ações</option>
                {uniqueActions.map((item) => (
                  <option key={item.action} value={item.action}>
                    {item.action} ({item._count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-xs">
              <label className="text-sm font-medium">ID do Usuário</label>
              <input
                type="text"
                name="userId"
                defaultValue={userId || ''}
                placeholder="Filtrar por ID..."
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Filtrar
              </button>
              <a
                href="/admin/atividade"
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Limpar
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Atividades ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma atividade encontrada
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Data/Hora</th>
                    <th className="text-left py-3 px-4 font-semibold">Usuário</th>
                    <th className="text-left py-3 px-4 font-semibold">Ação</th>
                    <th className="text-left py-3 px-4 font-semibold">Recurso</th>
                    <th className="text-left py-3 px-4 font-semibold">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {format(new Date(log.createdAt), 'dd MMM HH:mm:ss', { locale: ptBR })}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{log.user.name}</p>
                          <p className="text-xs text-muted-foreground">{log.user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={ACTION_COLORS[log.action] || 'bg-gray-200'}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {log.resource ? (
                          <code className="bg-muted px-2 py-1 rounded text-xs">{log.resource}</code>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {(log.metadata as any)?.ip || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/admin/atividade?action=${action || ''}&userId=${userId || ''}&page=${p}`}
                  className={`px-3 py-1 rounded border ${
                    p === page
                      ? 'bg-primary text-primary-foreground'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
