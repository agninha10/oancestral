import { redirect } from "next/navigation";

/**
 * /ebook is deprecated — permanently redirected to the canonical sales page.
 */
export default function EbookPage() {
  redirect("/livro-de-receitas-ancestrais");
}
