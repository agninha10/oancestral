"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const PRODUCTS = [
  { value: "livro-ancestral", label: "Livro Ancestral (Vitalício) — R$ 49,00" },
  { value: "mensal",          label: "Assinatura Mensal — R$ 29,00" },
  { value: "anual",           label: "Assinatura Anual — R$ 190,00" },
  { value: "jejum",           label: "Ebook Jejum Intermitente — R$ 29,90" },
];

type Status = "idle" | "loading" | "success" | "error";

export function GrantAccessDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    product: "livro-ancestral",
    orderId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/grant-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Erro desconhecido");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      // Reset form after 2s and close
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setMessage("");
        setForm({ name: "", email: "", phone: "", product: "livro-ancestral", orderId: "" });
        // Refresh page data
        window.location.reload();
      }, 2000);
    } catch {
      setStatus("error");
      setMessage("Erro de conexão");
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Registrar Venda Manual
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-stone-900 border-stone-800 text-stone-50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg text-stone-50">Registrar Venda Manual</DialogTitle>
          <p className="text-sm text-stone-400">
            Use quando o cliente pagou mas o webhook Kiwify não chegou.
          </p>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
            <p className="text-green-400 font-medium">{message}</p>
            <p className="text-xs text-stone-500">Fechando automaticamente...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm">Nome</Label>
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Nome do cliente"
                  className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm">WhatsApp</Label>
                <Input
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="11999999999"
                  className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-stone-300 text-sm">Email *</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="cliente@email.com"
                className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-stone-300 text-sm">Produto *</Label>
              <Select
                value={form.product}
                onValueChange={(v) => setForm((f) => ({ ...f, product: v }))}
              >
                <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="text-stone-200">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-stone-300 text-sm">
                Order ID Kiwify{" "}
                <span className="text-stone-500 font-normal">(opcional)</span>
              </Label>
              <Input
                value={form.orderId}
                onChange={set("orderId")}
                placeholder="ex: ord_xxxxxxxx (deixe vazio para gerar)"
                className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500 text-xs"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 text-stone-400 hover:text-stone-200"
                onClick={() => setOpen(false)}
                disabled={status === "loading"}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Registrando...
                  </>
                ) : (
                  "Conceder Acesso"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
