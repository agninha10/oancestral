"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, User, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KiwifyProduct } from "@/lib/kiwify";

// ── Schema ─────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(3, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(10, "WhatsApp inválido")
    .regex(/^[\d\s()+\-]+$/, "Formato inválido")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

// ── Product display helpers ────────────────────────────────────────────────
const PRODUCT_LABELS: Record<KiwifyProduct, string> = {
  "livro-ancestral": "Manual da Cozinha Ancestral — R$ 49,00",
  jejum: "Guia Definitivo do Jejum Intermitente — R$ 29,90",
  mensal: "Plano Mensal — R$ 29/mês",
  anual: "Plano Anual — R$ 190/ano",
};

// ── Props ──────────────────────────────────────────────────────────────────
interface KiwifyCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: KiwifyProduct;
  /** Pre-fill customer data (from logged-in session) */
  defaultValues?: { name?: string; email?: string; phone?: string };
  isLoggedIn?: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────
export function KiwifyCheckoutDialog({
  open,
  onOpenChange,
  product,
  defaultValues,
  isLoggedIn = false,
}: KiwifyCheckoutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
    });
  }, [defaultValues?.name, defaultValues?.email, defaultValues?.phone, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/kiwify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, ...data }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Erro ao processar. Tente novamente.");
        return;
      }

      // Redirect to Kiwify checkout
      window.location.href = json.url;
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (!loading) {
      setError(null);
      onOpenChange(v);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-stone-900 border-stone-800 text-stone-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-50">
            Finalizar Compra
          </DialogTitle>
          <DialogDescription className="text-stone-400 text-sm">
            <span className="font-semibold text-amber-500">
              {PRODUCT_LABELS[product]}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <User className="h-3 w-3" /> Nome completo
            </Label>
            <Input
              {...register("name")}
              readOnly={isLoggedIn}
              disabled={loading}
              placeholder="João da Silva"
              className={`bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 ${
                isLoggedIn ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <Mail className="h-3 w-3" /> E-mail (onde você recebe o acesso)
            </Label>
            <Input
              type="email"
              {...register("email")}
              readOnly={isLoggedIn}
              disabled={loading}
              placeholder="joao@email.com"
              className={`bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 ${
                isLoggedIn ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <Phone className="h-3 w-3" /> WhatsApp{" "}
              <span className="normal-case text-stone-600 font-normal">(opcional)</span>
            </Label>
            <Input
              type="tel"
              {...register("phone")}
              disabled={loading}
              placeholder="(11) 99999-9999"
              className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600"
            />
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Info pill */}
          <p className="text-xs text-stone-500 bg-stone-800/60 rounded-lg px-3 py-2 leading-relaxed">
            Sua conta no portal é criada automaticamente. Você receberá um
            código por e-mail para confirmar o acesso.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
              className="flex-1 border-stone-700 text-stone-300 hover:bg-stone-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold hover:from-amber-600 hover:to-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde...
                </>
              ) : (
                "Ir para o Pagamento →"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
