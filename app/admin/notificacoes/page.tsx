'use client';

import { useState, useTransition } from 'react';
import { Send, Search, Users, User, CheckCircle2, Loader2, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { adminSendNotification, searchUsersForAdmin } from '@/app/actions/notifications';

type TargetUser = { id: string; email: string; name: string };

export default function NotificacoesPage() {
    const [target,        setTarget]        = useState<'all' | TargetUser>('all');
    const [searchQuery,   setSearchQuery]   = useState('');
    const [searchResults, setSearchResults] = useState<TargetUser[]>([]);
    const [title,         setTitle]         = useState('');
    const [message,       setMessage]       = useState('');
    const [link,          setLink]          = useState('');
    const [lastCount,     setLastCount]     = useState<number | null>(null);

    const [isSending,    startSend]   = useTransition();
    const [isSearching,  startSearch] = useTransition();

    const handleSearch = (q: string) => {
        setSearchQuery(q);
        if (q.trim().length < 2) { setSearchResults([]); return; }
        startSearch(async () => {
            const results = await searchUsersForAdmin(q);
            setSearchResults(results);
        });
    };

    const handleSelectUser = (user: TargetUser) => {
        setTarget(user);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleSend = () => {
        if (!title.trim() || !message.trim()) {
            toast.error('Preencha o título e a mensagem.');
            return;
        }

        const targetId = target === 'all' ? 'all' : target.id;

        startSend(async () => {
            const res = await adminSendNotification(targetId, title, message, link || null);
            if (res.success) {
                setLastCount(res.count ?? 0);
                setTitle('');
                setMessage('');
                setLink('');
                setTarget('all');
                toast.success(
                    res.count === 1
                        ? 'Notificação enviada com sucesso.'
                        : `Notificação enviada para ${res.count} usuários.`,
                );
            } else {
                toast.error(res.error ?? 'Erro ao enviar notificação.');
            }
        });
    };

    const isAll = target === 'all';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Central de Notificações</h1>
                <p className="mt-1 text-muted-foreground">
                    Envie notificações manuais para um usuário específico ou para toda a plataforma.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* ── Compose form ─────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-orange-500" />
                            Compor Notificação
                        </CardTitle>
                        <CardDescription>
                            Preencha os campos abaixo e dispare a notificação.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">

                        {/* Target selector */}
                        <div className="space-y-2">
                            <Label>Destinatário</Label>

                            {/* Toggle buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setTarget('all'); setSearchQuery(''); setSearchResults([]); }}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                                        isAll
                                            ? 'border-orange-500/50 bg-orange-500/10 text-orange-500'
                                            : 'border-border text-muted-foreground hover:bg-muted',
                                    )}
                                >
                                    <Users className="h-4 w-4" />
                                    Todos os usuários
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTarget({ id: '', email: '', name: '' })}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                                        !isAll
                                            ? 'border-orange-500/50 bg-orange-500/10 text-orange-500'
                                            : 'border-border text-muted-foreground hover:bg-muted',
                                    )}
                                >
                                    <User className="h-4 w-4" />
                                    Usuário específico
                                </button>
                            </div>

                            {/* User search — only when "specific" is selected */}
                            {!isAll && (
                                <div className="space-y-2">
                                    {typeof target !== 'string' && target.id ? (
                                        // Selected user pill
                                        <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
                                            <div>
                                                <p className="text-sm font-medium text-green-400">{target.name}</p>
                                                <p className="text-xs text-muted-foreground">{target.email}</p>
                                            </div>
                                            <button
                                                onClick={() => setTarget({ id: '', email: '', name: '' })}
                                                className="text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                Trocar
                                            </button>
                                        </div>
                                    ) : (
                                        // Search input
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                placeholder="Buscar por nome ou e-mail…"
                                                className="pl-9"
                                                autoFocus
                                            />
                                            {isSearching && (
                                                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                            )}

                                            {/* Results dropdown */}
                                            {searchResults.length > 0 && (
                                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                                                    {searchResults.map((u) => (
                                                        <button
                                                            key={u.id}
                                                            type="button"
                                                            onClick={() => handleSelectUser(u)}
                                                            className="flex w-full flex-col px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                                                        >
                                                            <span className="font-medium">{u.name}</span>
                                                            <span className="text-xs text-muted-foreground">{u.email}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="notif-title">Título</Label>
                                <span className={cn('text-xs', title.length > 80 ? 'text-destructive' : 'text-muted-foreground')}>
                                    {title.length}/80
                                </span>
                            </div>
                            <Input
                                id="notif-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Nova funcionalidade disponível!"
                                maxLength={100}
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="notif-msg">Mensagem</Label>
                                <span className={cn('text-xs', message.length > 200 ? 'text-destructive' : 'text-muted-foreground')}>
                                    {message.length}/200
                                </span>
                            </div>
                            <Textarea
                                id="notif-msg"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Descrição curta exibida na notificação…"
                                rows={3}
                                maxLength={300}
                            />
                        </div>

                        {/* Link */}
                        <div className="space-y-2">
                            <Label htmlFor="notif-link">
                                Link de destino{' '}
                                <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
                            </Label>
                            <Input
                                id="notif-link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Ex: /play/curso-xyz/aula/abc123"
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            onClick={handleSend}
                            disabled={isSending || !title.trim() || !message.trim() || (!isAll && !(typeof target !== 'string' && target.id))}
                            className="w-full bg-orange-500 font-semibold text-white hover:bg-orange-600 disabled:opacity-40"
                            size="lg"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Disparando…
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Disparar Notificação
                                    {isAll ? ' para todos' : typeof target !== 'string' && target.name ? ` para ${target.name.split(' ')[0]}` : ''}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* ── Side info ─────────────────────────────────────────────── */}
                <div className="space-y-4">
                    {/* Last send result */}
                    {lastCount !== null && (
                        <Card className="border-green-500/30 bg-green-500/5">
                            <CardContent className="flex items-center gap-3 pt-5">
                                <CheckCircle2 className="h-8 w-8 shrink-0 text-green-500" />
                                <div>
                                    <p className="font-semibold text-green-400">Enviado com sucesso!</p>
                                    <p className="text-sm text-muted-foreground">
                                        {lastCount === 1
                                            ? '1 notificação entregue.'
                                            : `${lastCount} notificações entregues.`}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Types legend */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Tipos de gatilhos automáticos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            {[
                                { emoji: '✍️', label: 'POST',    desc: 'Novo blog publicado → todos' },
                                { emoji: '🍽️', label: 'RECIPE',  desc: 'Nova receita publicada → todos' },
                                { emoji: '🎓', label: 'COURSE',  desc: 'Nova aula adicionada → matriculados' },
                                { emoji: '📣', label: 'MANUAL',  desc: 'Enviado por esta tela' },
                                { emoji: '🔔', label: 'SYSTEM',  desc: 'Gerado pelo sistema' },
                            ].map((t) => (
                                <div key={t.label} className="flex items-center gap-2.5">
                                    <span className="text-base">{t.emoji}</span>
                                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.label}</code>
                                    <span className="text-xs">{t.desc}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
