/**
 * Kiwify checkout URL builder
 *
 * Base URLs are set as environment variables per product:
 *   KIWIFY_LIVRO_ANCESTRAL_URL   → /livro-de-receitas-ancestrais
 *   KIWIFY_JEJUM_URL             → /jejum
 *   KIWIFY_MENSAL_URL            → /assinatura (mensal)
 *   KIWIFY_ANUAL_URL             → /assinatura (anual)
 *
 * Kiwify accepts customer data via query params so the checkout form
 * is pre-filled — reducing friction and increasing conversion.
 */

export type KiwifyProduct = "livro-ancestral" | "jejum" | "mensal" | "anual";

const PRODUCT_URL_MAP: Record<KiwifyProduct, string> = {
  "livro-ancestral": process.env.KIWIFY_LIVRO_ANCESTRAL_URL ?? "",
  jejum: process.env.KIWIFY_JEJUM_URL ?? "",
  mensal: process.env.KIWIFY_MENSAL_URL ?? "",
  anual: process.env.KIWIFY_ANUAL_URL ?? "",
};

export interface KiwifyCheckoutParams {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Builds a Kiwify checkout URL with pre-filled customer data.
 * Returns null if the base URL for the given product is not configured.
 */
export function buildKiwifyCheckoutUrl(
  product: KiwifyProduct,
  params: KiwifyCheckoutParams
): string | null {
  const baseUrl = PRODUCT_URL_MAP[product];
  if (!baseUrl) return null;

  const url = new URL(baseUrl);
  url.searchParams.set("name", params.name.trim());
  url.searchParams.set("email", params.email.trim().toLowerCase());
  if (params.phone) {
    // Kiwify expects digits only for phone
    url.searchParams.set("phone", params.phone.replace(/\D/g, ""));
  }

  return url.toString();
}
