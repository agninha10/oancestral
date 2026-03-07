"use client";

import { useEffect } from "react";

interface KiwifyUpsellProps {
  productId:   string; // ex: "0HNSqJS"
  upsellUrl?:  string; // URL de redirecionamento após aceitar (opcional)
  downsellUrl?: string; // URL de redirecionamento após recusar (opcional)
}

/**
 * Widget de one-click upsell do Kiwify.
 *
 * Deve ser usado APÓS uma compra (ex: página /obrigado) para que o
 * cliente aceite ou recuse uma oferta adicional com um único clique —
 * sem redigitar dados de pagamento.
 *
 * Configure no painel Kiwify (produto) a URL da página de obrigado:
 *   https://oancestral.com.br/obrigado?product=livro-ancestral&name={customer_name}&email={customer_email}
 */
export function KiwifyUpsell({ productId, upsellUrl = "", downsellUrl = "" }: KiwifyUpsellProps) {
  useEffect(() => {
    // Carrega o script do Kiwify apenas uma vez
    const existing = document.getElementById("kiwify-upsell-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id  = "kiwify-upsell-script";
    script.src = "https://snippets.kiwify.com/upsell/upsell.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Não remove o script ao desmontar — o Kiwify pode precisar dele
    };
  }, []);

  return (
    <div className="text-center" id={`kiwify-upsell-${productId}`} data-upsell-url={upsellUrl} data-downsell-url={downsellUrl}>
      <button
        id={`kiwify-upsell-trigger-${productId}`}
        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-lg py-5 px-6 rounded-xl transition-colors cursor-pointer border-0 shadow-lg shadow-amber-500/30"
      >
        ✅ Sim, quero adicionar o Guia do Jejum!
      </button>
      <div
        id={`kiwify-upsell-cancel-trigger-${productId}`}
        className="mt-4 cursor-pointer text-stone-500 hover:text-stone-300 text-sm underline transition-colors"
      >
        Não, prefiro abrir mão dessa oferta
      </div>
    </div>
  );
}
