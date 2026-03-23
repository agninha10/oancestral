'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    ChefHat,
    FolderTree,
    Menu,
    X,
    LogOut,
    Mail,
    Users,
    GraduationCap,
    DollarSign,
    MessageSquare,
    MessageCircle,
    Bell,
    Activity,
    Gift,
    Swords,
    Quote,
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = { name: string; href: string; icon: React.ElementType };

const groups: { label: string; items: NavItem[] }[] = [
    {
        label: 'Geral',
        items: [
            { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Financeiro',
        items: [
            { name: 'Vendas', href: '/admin/vendas', icon: DollarSign },
            { name: 'Cortesias', href: '/admin/cortesias', icon: Gift },
        ],
    },
    {
        label: 'Acadêmico',
        items: [
            { name: 'Cursos', href: '/admin/cursos', icon: GraduationCap },
            { name: 'Comentários', href: '/admin/comentarios', icon: MessageCircle },
        ],
    },
    {
        label: 'Conteúdo',
        items: [
            { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
            { name: 'Receitas', href: '/admin/receitas', icon: ChefHat },
            { name: 'Categorias', href: '/admin/categorias', icon: FolderTree },
            { name: 'Frases Estoicas', href: '/admin/frases', icon: Quote },
        ],
    },
    {
        label: 'Comunidade',
        items: [
            { name: 'A Forja', href: '/admin/forum', icon: Swords },
        ],
    },
    {
        label: 'Comunicação',
        items: [
            { name: 'Contato', href: '/admin/contato', icon: MessageSquare },
            { name: 'Notificações', href: '/admin/notificacoes', icon: Bell },
            { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
        ],
    },
    {
        label: 'Usuários',
        items: [
            { name: 'Usuários', href: '/admin/usuarios', icon: Users },
            { name: 'Atividades', href: '/admin/atividade', icon: Activity },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => signOut({ callbackUrl: '/' });

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-6 py-6 border-b border-border shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">OA</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">O Ancestral</h1>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                        {groups.map((group) => (
                            <div key={group.label}>
                                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                                    {group.label}
                                </p>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const isActive = pathname?.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                                    isActive
                                                        ? 'bg-orange-500/10 text-orange-500'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                                )}
                                            >
                                                <item.icon className="h-4 w-4 shrink-0" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="px-4 py-4 border-t border-border shrink-0">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
