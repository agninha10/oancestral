"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldAlert } from "lucide-react";
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

const checkoutFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cellphone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^\+?[\d\s()-]+$/, "Formato de telefone inválido"),
  taxId: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF deve estar no formato: 123.456.789-00 ou apenas números"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: {
    name: string;
    email: string;
    cellphone?: string;
  };
  frequency: "monthly" | "yearly";
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isLoggedIn: boolean;
}

export function CheckoutFormDialog({
  open,
  onOpenChange,
  defaultValues,
  frequency,
  onSubmit,
  isLoggedIn,
}: CheckoutFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: defaultValues.name,
      email: defaultValues.email,
      cellphone: defaultValues.cellphone || "",
      taxId: "",
      password: "",
    },
  });

  // Atualizar os valores do formulário quando defaultValues mudar
  useEffect(() => {
    console.log("[CHECKOUT FORM] Updating form with:", {
      name: defaultValues.name,
      email: defaultValues.email,
      cellphone: defaultValues.cellphone,
      isLoggedIn,
    });
    reset({
      name: defaultValues.name,
      email: defaultValues.email,
      cellphone: defaultValues.cellphone || "",
      taxId: "",
      password: "",
    });
  }, [defaultValues.name, defaultValues.email, defaultValues.cellphone, reset, isLoggedIn]);

  const handleFormSubmit = async (data: CheckoutFormData) => {
    // Validar senha se usuário não estiver logado
    if (!isLoggedIn && (!data.password || data.password.length < 6)) {
      alert("Por favor, crie uma senha com pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Erro no formulário:", error);
    } finally {
      setLoading(false);
    }
  };

  const planName = frequency === "monthly" ? "Mensal (R$ 29/mês)" : "Anual (R$ 190/ano)";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-stone-900 border-stone-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stone-50">
            {isLoggedIn ? "Finalizar Assinatura" : "Criar Conta e Assinar"}
          </DialogTitle>
          <DialogDescription className="text-stone-400">
            Plano selecionado: <span className="font-semibold text-amber-500">{planName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-stone-300">
              Nome Completo
            </Label>
            <Input
              id="name"
              {...register("name")}
              readOnly={isLoggedIn}
              disabled={loading}
              className={`bg-stone-800 border-stone-700 text-stone-100 ${isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="João da Silva"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              readOnly={isLoggedIn}
              disabled={loading}
              className={`bg-stone-800 border-stone-700 text-stone-100 ${isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Senha - apenas para usuários não logados */}
          {!isLoggedIn && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                disabled={loading}
                className="bg-stone-800 border-stone-700 text-stone-100"
                placeholder="Crie uma senha (mínimo 6 caracteres)"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
              <p className="text-xs text-stone-500">
                Sua conta será criada automaticamente para acessar o conteúdo
              </p>
            </div>
          )}

          {/* Celular/WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="cellphone" className="text-stone-300">
              Celular/WhatsApp
            </Label>
            <Input
              id="cellphone"
              {...register("cellphone")}
              disabled={loading}
              className="bg-stone-800 border-stone-700 text-stone-100"
              placeholder="+55 11 99999-9999"
            />
            {errors.cellphone && (
              <p className="text-sm text-red-400">{errors.cellphone.message}</p>
            )}
            <p className="text-xs text-stone-500">
              Para receber notificações sobre seu pagamento
            </p>
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-stone-300">
              CPF
            </Label>
            <Input
              id="taxId"
              {...register("taxId")}
              disabled={loading}
              className="bg-stone-800 border-stone-700 text-stone-100"
              placeholder="123.456.789-00"
              maxLength={14}
            />
            {errors.taxId && (
              <p className="text-sm text-red-400">{errors.taxId.message}</p>
            )}
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-500/90">
                <strong>Seu CPF não é armazenado no nosso banco de dados.</strong> É usado apenas
                para processar o pagamento de forma segura através do nosso gateway de pagamento.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 border-stone-700 text-stone-300 hover:bg-stone-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-600 hover:to-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Ir para o Pagamento"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
