'use client';

import { useState, useTransition, useOptimistic } from 'react';
import {
    Plus,
    Trash2,
    GripVertical,
    ExternalLink,
    MousePointerClick,
    Star,
    Eye,
    EyeOff,
    Loader2,
    Check,
    Users,
} from 'lucide-react';
import {
    createLink,
    updateLink,
    toggleLinkActive,
    deleteLink,
} from '@/app/actions/quick-links';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type QuickLink = {
    id: string;
    title: string;
    url: string;
    emoji: string | null;
    imageUrl: string | null;
    highlight: boolean;
    order: number;
    isActive: boolean;
    clicks: number;
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Toggle({
    checked,
    onChange,
    disabled,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={[
                'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent',
                'transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
                checked ? 'bg-amber-500' : 'bg-zinc-700',
            ].join(' ')}
        >
            <span
                className={[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
                    checked ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
            />
        </button>
    );
}

// ─── Formulário de novo link ──────────────────────────────────────────────────

function AddLinkForm({ onAdded }: { onAdded: (link: Omit<QuickLink, 'id' | 'clicks'> & { id?: string; clicks?: number }) => void }) {
    const [pending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        url: '',
        emoji: '',
        highlight: false,
    });

    function field(key: keyof typeof form) {
        return {
            value: form[key] as string,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value })),
        };
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        startTransition(async () => {
            try {
                await createLink({
                    title: form.title,
                    url: form.url,
                    emoji: form.emoji,
                    highlight: form.highlight,
                });
                setSuccess(true);
                setForm({ title: '', url: '', emoji: '', highlight: false });
                setTimeout(() => setSuccess(false), 2000);
                // Trigger parent refresh via optimistic placeholder
                onAdded({
                    title: form.title,
                    url: form.url,
                    emoji: form.emoji || null,
                    imageUrl: null,
                    highlight: form.highlight,
                    order: 999,
                    isActive: true,
                });
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao criar link.');
            }
        });
    }

    const inputCls =
        'w-full rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40 transition-colors';

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4"
        >
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                Adicionar Novo Link
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500">Título *</label>
                    <input
                        {...field('title')}
                        required
                        placeholder="Ex: O Clã Ancestral"
                        className={inputCls}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500">URL *</label>
                    <input
                        {...field('url')}
                        required
                        placeholder="https:// ou /rota-interna"
                        className={inputCls}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500">Emoji (opcional)</label>
                    <input
                        {...field('emoji')}
                        placeholder="🌿"
                        maxLength={4}
                        className={`${inputCls} w-24`}
                    />
                </div>
                <div className="flex items-center gap-3 pt-5">
                    <Toggle
                        checked={form.highlight}
                        onChange={(v) => setForm((p) => ({ ...p, highlight: v }))}
                    />
                    <span className="text-sm text-zinc-400">Link em destaque (âmbar pulsante)</span>
                </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
                {pending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Plus className="w-4 h-4" />
                )}
                {success ? 'Adicionado!' : 'Adicionar Link'}
            </button>
        </form>
    );
}

// ─── Card de link existente ───────────────────────────────────────────────────

function LinkRow({
    link,
    onToggle,
    onOrderChange,
    onDelete,
    onHighlight,
}: {
    link: QuickLink;
    onToggle: (id: string, v: boolean) => void;
    onOrderChange: (id: string, order: number) => void;
    onDelete: (id: string) => void;
    onHighlight: (id: string, v: boolean) => void;
}) {
    const [pending, startTransition] = useTransition();
    const [editingOrder, setEditingOrder] = useState(false);
    const [orderVal, setOrderVal] = useState(link.order.toString());

    function commitOrder() {
        setEditingOrder(false);
        const parsed = parseInt(orderVal, 10);
        if (!isNaN(parsed) && parsed !== link.order) {
            startTransition(async () => {
                await updateLink(link.id, { order: parsed });
                onOrderChange(link.id, parsed);
            });
        }
    }

    return (
        <div
            className={[
                'group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
                link.isActive
                    ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    : 'border-zinc-800/40 bg-zinc-900/20 opacity-50',
            ].join(' ')}
        >
            {/* Grip (visual) */}
            <GripVertical className="w-4 h-4 text-zinc-700 flex-shrink-0 cursor-grab" aria-hidden="true" />

            {/* Emoji / icon */}
            <span className="text-xl leading-none w-7 text-center flex-shrink-0">
                {link.emoji ?? '🔗'}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">{link.title}</p>
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-amber-400 transition-colors truncate flex items-center gap-1"
                >
                    {link.url}
                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                </a>
            </div>

            {/* Cliques */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 flex-shrink-0 w-20 justify-end">
                <MousePointerClick className="w-3.5 h-3.5 text-amber-500/70" aria-hidden="true" />
                <span>{link.clicks.toLocaleString('pt-BR')}</span>
            </div>

            {/* Ordem */}
            <div className="flex-shrink-0">
                {editingOrder ? (
                    <input
                        type="number"
                        value={orderVal}
                        onChange={(e) => setOrderVal(e.target.value)}
                        onBlur={commitOrder}
                        onKeyDown={(e) => e.key === 'Enter' && commitOrder()}
                        autoFocus
                        className="w-14 rounded-lg bg-zinc-800 border border-amber-500/50 text-zinc-100 text-center text-sm py-1 focus:outline-none"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setEditingOrder(true)}
                        title="Editar ordem"
                        className="w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors text-sm font-mono flex items-center justify-center"
                    >
                        {link.order}
                    </button>
                )}
            </div>

            {/* Destaque */}
            <button
                type="button"
                title={link.highlight ? 'Remover destaque' : 'Marcar como destaque'}
                disabled={pending}
                onClick={() =>
                    startTransition(async () => {
                        await updateLink(link.id, { highlight: !link.highlight });
                        onHighlight(link.id, !link.highlight);
                    })
                }
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    link.highlight
                        ? 'text-amber-400 bg-amber-950/50'
                        : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
                }`}
            >
                <Star className="w-4 h-4" fill={link.highlight ? 'currentColor' : 'none'} />
            </button>

            {/* Toggle ativo */}
            <div className="flex-shrink-0">
                <Toggle
                    checked={link.isActive}
                    disabled={pending}
                    onChange={(v) =>
                        startTransition(async () => {
                            await toggleLinkActive(link.id, v);
                            onToggle(link.id, v);
                        })
                    }
                />
            </div>

            {/* Preview */}
            <a
                href={`/api/links/${link.id}/click`}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir link"
                className="flex-shrink-0 w-8 h-8 rounded-lg text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 flex items-center justify-center transition-colors"
            >
                {link.isActive ? (
                    <Eye className="w-4 h-4" />
                ) : (
                    <EyeOff className="w-4 h-4" />
                )}
            </a>

            {/* Deletar */}
            <button
                type="button"
                title="Excluir link"
                disabled={pending}
                onClick={() => {
                    if (!confirm(`Excluir "${link.title}"?`)) return;
                    startTransition(async () => {
                        await deleteLink(link.id);
                        onDelete(link.id);
                    });
                }}
                className="flex-shrink-0 w-8 h-8 rounded-lg text-zinc-700 hover:bg-red-950/60 hover:text-red-400 flex items-center justify-center transition-colors"
            >
                {pending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}

// ─── Manager principal ────────────────────────────────────────────────────────

export function LinksManager({
    initialLinks,
    pageViews,
}: {
    initialLinks: QuickLink[];
    pageViews: number;
}) {
    const [links, setLinks] = useState<QuickLink[]>(initialLinks);

    const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);
    const activeCount = links.filter((l) => l.isActive).length;

    function handleToggle(id: string, isActive: boolean) {
        setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isActive } : l)));
    }

    function handleOrderChange(id: string, order: number) {
        setLinks((prev) =>
            [...prev.map((l) => (l.id === id ? { ...l, order } : l))].sort(
                (a, b) => a.order - b.order,
            ),
        );
    }

    function handleDelete(id: string) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
    }

    function handleHighlight(id: string, highlight: boolean) {
        setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, highlight } : l)));
    }

    function handleAdded() {
        // Recarrega a página para buscar o novo link com ID real do banco.
        window.location.reload();
    }

    return (
        <div className="space-y-6">
            {/* ── Sumário ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Visitas à Página', value: pageViews.toLocaleString('pt-BR'), icon: Users, highlight: true },
                    { label: 'Cliques Totais', value: totalClicks.toLocaleString('pt-BR'), icon: MousePointerClick, highlight: false },
                    { label: 'Links Ativos', value: activeCount, icon: Eye, highlight: false },
                    { label: 'Total de Links', value: links.length, icon: ExternalLink, highlight: false },
                ].map((s) => (
                    <div
                        key={s.label}
                        className={`rounded-xl border px-4 py-4 text-center ${
                            s.highlight
                                ? 'border-amber-500/40 bg-amber-950/20'
                                : 'border-zinc-800 bg-zinc-900/50'
                        }`}
                    >
                        <s.icon className={`w-4 h-4 mx-auto mb-2 ${s.highlight ? 'text-amber-400' : 'text-zinc-600'}`} />
                        <p className={`text-2xl font-bold ${s.highlight ? 'text-amber-400' : 'text-zinc-100'}`}>
                            {s.value}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Formulário de adição ── */}
            <AddLinkForm onAdded={handleAdded} />

            {/* ── Lista de links ── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Links ({links.length})</p>
                    <a
                        href="/links"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Ver página pública
                    </a>
                </div>

                {links.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center">
                        <p className="text-zinc-600 text-sm">Nenhum link cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {links.map((link) => (
                            <LinkRow
                                key={link.id}
                                link={link}
                                onToggle={handleToggle}
                                onOrderChange={handleOrderChange}
                                onDelete={handleDelete}
                                onHighlight={handleHighlight}
                            />
                        ))}
                    </div>
                )}
            </div>

            <p className="text-xs text-zinc-700 text-center">
                Clique no número de ordem de qualquer link para editá-lo. Alterações são salvas automaticamente.
            </p>
        </div>
    );
}
