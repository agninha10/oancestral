'use client';

import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
    Camera,
    Loader2,
    Save,
    Mail,
    Send,
    CheckCircle2,
    X,
    BadgeCheck,
    AlertCircle,
    Scale,
    Ruler,
    Phone,
    User,
    Lock,
    Eye,
    EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    updateProfile,
    requestEmailChange,
    confirmEmailChange,
    cancelEmailChange,
    changePassword,
} from '@/app/dashboard/perfil/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: Date | null;
        avatarUrl: string | null;
        whatsapp: string | null;
        weight: number | null;
        height: number | null;
        pendingEmail: string | null;
        birthdate: Date;
    };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function AvatarUpload({
    name,
    value,
    onChange,
}: {
    name: string;
    value: string | null;
    onChange: (url: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Selecione apenas imagens.');
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            if (!res.ok) throw new Error();
            const { url } = await res.json();
            onChange(url);
            toast.success('Foto atualizada.');
        } catch {
            toast.error('Erro ao fazer upload. Tente novamente.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="group relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-border focus-visible:outline-none focus-visible:ring-primary"
            >
                {value ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={value} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-2xl font-bold text-primary-foreground">
                        {initials}
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-100">
                    {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                        <>
                            <Camera className="h-5 w-5 text-white" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
                                Alterar
                            </span>
                        </>
                    )}
                </div>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />

            <p className="text-xs text-muted-foreground">JPG, PNG ou WebP · máx. 10 MB</p>
        </div>
    );
}

// ─── EmailChangeSection ───────────────────────────────────────────────────────

function EmailChangeSection({
    currentEmail,
    emailVerified,
    initialPendingEmail,
}: {
    currentEmail: string;
    emailVerified: Date | null;
    initialPendingEmail: string | null;
}) {
    const [step,       setStep]       = useState<'idle' | 'input' | 'code'>(
        initialPendingEmail ? 'code' : 'idle',
    );
    const [newEmail,   setNewEmail]   = useState('');
    const [code,       setCode]       = useState('');
    const [pending,    setEmail]      = useState(initialPendingEmail ?? '');
    const [isPending,  startT]        = useTransition();

    const handleRequestChange = () => {
        if (!newEmail.trim()) return;
        startT(async () => {
            const res = await requestEmailChange(newEmail);
            if (res.success) {
                setEmail(newEmail);
                setStep('code');
                toast.success(`Código enviado para ${newEmail}.`);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleConfirm = () => {
        if (code.length < 6) return;
        startT(async () => {
            const res = await confirmEmailChange(code);
            if (res.success) {
                toast.success('E-mail alterado com sucesso!');
                setStep('idle');
                setCode('');
                // Reload to show new email in server component
                window.location.reload();
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleCancel = () => {
        startT(async () => {
            await cancelEmailChange();
            setStep('idle');
            setNewEmail('');
            setCode('');
            setEmail('');
        });
    };

    return (
        <div className="space-y-3">
            {/* Current email row */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{currentEmail}</span>
                {emailVerified ? (
                    <Badge variant="secondary" className="gap-1 bg-green-600/15 text-green-500">
                        <BadgeCheck className="h-3 w-3" /> Verificado
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="gap-1 bg-amber-500/15 text-amber-500">
                        <AlertCircle className="h-3 w-3" /> Não verificado
                    </Badge>
                )}
            </div>

            {step === 'idle' && (
                <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-xs text-primary underline-offset-2 hover:underline"
                >
                    Alterar e-mail
                </button>
            )}

            {step === 'input' && (
                <div className="space-y-2">
                    <Label htmlFor="new-email">Novo e-mail</Label>
                    <div className="flex gap-2">
                        <Input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="novo@email.com"
                            disabled={isPending}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRequestChange(); }}
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleRequestChange}
                            disabled={isPending || !newEmail.trim()}
                            className="shrink-0"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <><Send className="mr-1.5 h-3.5 w-3.5" />Enviar código</>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setStep('idle')}
                            disabled={isPending}
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Um código de 6 dígitos será enviado ao novo endereço.
                    </p>
                </div>
            )}

            {step === 'code' && (
                <div className="space-y-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Código enviado para <strong>{pending}</strong>. Verifique sua caixa de entrada.
                    </p>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            disabled={isPending}
                            className="max-w-[140px] text-center font-mono text-lg tracking-[0.3em]"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
                        />
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isPending || code.length < 6}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <><CheckCircle2 className="mr-1.5 h-4 w-4" />Confirmar</>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── PasswordChangeSection ────────────────────────────────────────────────────

function PasswordInput({
    id, label, value, onChange, disabled,
}: {
    id: string; label: string; value: string;
    onChange: (v: string) => void; disabled: boolean;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="pr-10"
                    autoComplete={id === 'current-password' ? 'current-password' : 'new-password'}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}

function PasswordChangeSection() {
    const [open,        setOpen]        = useState(false);
    const [current,     setCurrent]     = useState('');
    const [next,        setNext]        = useState('');
    const [confirm,     setConfirm]     = useState('');
    const [isPending,   startT]         = useTransition();

    const mismatch = next && confirm && next !== confirm;
    const weak     = next && next.length < 8;
    const canSave  = current && next.length >= 8 && next === confirm && !isPending;

    const handleSave = () => {
        startT(async () => {
            const res = await changePassword({ currentPassword: current, newPassword: next });
            if (res.success) {
                toast.success('Senha alterada com sucesso!');
                setOpen(false);
                setCurrent(''); setNext(''); setConfirm('');
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleCancel = () => {
        setOpen(false);
        setCurrent(''); setNext(''); setConfirm('');
    };

    return (
        <div className="space-y-3">
            {!open ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-xs text-primary underline-offset-2 hover:underline"
                >
                    Alterar senha
                </button>
            ) : (
                <div className="space-y-4">
                    <PasswordInput
                        id="current-password"
                        label="Senha atual"
                        value={current}
                        onChange={setCurrent}
                        disabled={isPending}
                    />
                    <PasswordInput
                        id="new-password"
                        label="Nova senha"
                        value={next}
                        onChange={setNext}
                        disabled={isPending}
                    />
                    {weak && (
                        <p className="text-xs text-amber-500">Mínimo de 8 caracteres.</p>
                    )}
                    <PasswordInput
                        id="confirm-password"
                        label="Confirmar nova senha"
                        value={confirm}
                        onChange={setConfirm}
                        disabled={isPending}
                    />
                    {mismatch && (
                        <p className="text-xs text-destructive">As senhas não coincidem.</p>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={!canSave}
                            size="sm"
                        >
                            {isPending
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <><CheckCircle2 className="mr-1.5 h-4 w-4" />Salvar senha</>
                            }
                        </Button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── BMI helper ───────────────────────────────────────────────────────────────

function bmiLabel(bmi: number) {
    if (bmi < 18.5) return { text: 'Abaixo do peso', color: 'text-sky-500' };
    if (bmi < 25)   return { text: 'Peso normal',    color: 'text-green-500' };
    if (bmi < 30)   return { text: 'Sobrepeso',      color: 'text-amber-500' };
    return              { text: 'Obesidade',          color: 'text-red-500' };
}

// ─── ProfileForm ──────────────────────────────────────────────────────────────

export function ProfileForm({ user }: ProfileFormProps) {
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
    const [name,      setName]      = useState(user.name);
    const [whatsapp,  setWhatsapp]  = useState(user.whatsapp ?? '');
    const [weight,    setWeight]    = useState(user.weight?.toString() ?? '');
    const [height,    setHeight]    = useState(user.height?.toString() ?? '');
    const [isPending, startT]       = useTransition();

    const weightNum = parseFloat(weight) || null;
    const heightNum = parseInt(height)   || null;
    const bmi       = weightNum && heightNum
        ? weightNum / Math.pow(heightNum / 100, 2)
        : null;

    const handleSave = () => {
        startT(async () => {
            const res = await updateProfile({
                name,
                whatsapp,
                weight:    weightNum,
                height:    heightNum,
                avatarUrl: avatarUrl,
            });
            if (res.success) {
                toast.success('Perfil atualizado!');
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <div className="space-y-8">
            {/* ── Avatar ─────────────────────────────────────────────────── */}
            <div className="flex justify-center">
                <AvatarUpload name={name} value={avatarUrl} onChange={setAvatarUrl} />
            </div>

            {/* ── Grid ───────────────────────────────────────────────────── */}
            <div className="grid gap-6 md:grid-cols-2">

                {/* Informações Básicas */}
                <div className="space-y-5 rounded-xl border border-border bg-card p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <User className="h-4 w-4 text-primary" />
                        Informações Básicas
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" /> WhatsApp
                        </Label>
                        <Input
                            id="whatsapp"
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="+55 (11) 99999-9999"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Data de nascimento</Label>
                        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
                            {new Date(user.birthdate).toLocaleDateString('pt-BR', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Dados de Saúde */}
                <div className="space-y-5 rounded-xl border border-border bg-card p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <Scale className="h-4 w-4 text-primary" />
                        Dados de Saúde
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="flex items-center gap-1.5">
                                <Scale className="h-3.5 w-3.5" /> Peso (kg)
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                min="20"
                                max="400"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="70.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height" className="flex items-center gap-1.5">
                                <Ruler className="h-3.5 w-3.5" /> Altura (cm)
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                min="100"
                                max="250"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="175"
                            />
                        </div>
                    </div>

                    {/* IMC */}
                    {bmi && (
                        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                            <p className="text-xs text-muted-foreground">Índice de Massa Corporal (IMC)</p>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-2xl font-bold">{bmi.toFixed(1)}</span>
                                <span className={cn('text-sm font-medium', bmiLabel(bmi).color)}>
                                    {bmiLabel(bmi).text}
                                </span>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Usado para calcular seu IMC e personalizar os protocolos de jejum.
                    </p>
                </div>
            </div>

            {/* ── E-mail ─────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Mail className="h-4 w-4 text-primary" />
                    E-mail
                </h3>
                <EmailChangeSection
                    currentEmail={user.email}
                    emailVerified={user.emailVerified}
                    initialPendingEmail={user.pendingEmail}
                />
            </div>

            {/* ── Senha ──────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Lock className="h-4 w-4 text-primary" />
                    Senha
                </h3>
                <PasswordChangeSection />
            </div>

            {/* ── Save button ────────────────────────────────────────────── */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isPending || !name.trim()}
                    size="lg"
                    className="min-w-[160px]"
                >
                    {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando…</>
                    ) : (
                        <><Save className="mr-2 h-4 w-4" />Salvar alterações</>
                    )}
                </Button>
            </div>
        </div>
    );
}
