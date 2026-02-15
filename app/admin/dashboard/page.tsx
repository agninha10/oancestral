export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-neutral-400 mt-2">
                    Bem-vindo ao painel administrativo do O Ancestral
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-400">Total de Posts</p>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-400">Total de Receitas</p>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <span className="text-2xl">🍳</span>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-400">Categorias</p>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <span className="text-2xl">📁</span>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-400">Inscritos Newsletter</p>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <span className="text-2xl">📧</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <a
                        href="/admin/blog/novo"
                        className="flex items-center gap-3 p-4 rounded-lg border border-neutral-800 hover:border-orange-500/50 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <span className="text-xl">➕</span>
                        </div>
                        <div>
                            <p className="font-medium text-white">Novo Post</p>
                            <p className="text-sm text-neutral-400">Criar post no blog</p>
                        </div>
                    </a>

                    <a
                        href="/admin/receitas/nova"
                        className="flex items-center gap-3 p-4 rounded-lg border border-neutral-800 hover:border-orange-500/50 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                            <span className="text-xl">➕</span>
                        </div>
                        <div>
                            <p className="font-medium text-white">Nova Receita</p>
                            <p className="text-sm text-neutral-400">Criar receita ancestral</p>
                        </div>
                    </a>

                    <a
                        href="/admin/categorias"
                        className="flex items-center gap-3 p-4 rounded-lg border border-neutral-800 hover:border-orange-500/50 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <span className="text-xl">📁</span>
                        </div>
                        <div>
                            <p className="font-medium text-white">Gerenciar Categorias</p>
                            <p className="text-sm text-neutral-400">Organizar conteúdo</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
