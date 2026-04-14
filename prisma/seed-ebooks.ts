/**
 * Seed dos ebooks no banco de dados.
 *
 * Execute com:
 *   npx tsx prisma/seed-ebooks.ts
 *
 * Os slugs devem corresponder ao campo `product` nas transações da Kiwify.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ebooks = [
  {
    title: "Guia Definitivo do Jejum Intermitente",
    slug: "jejum",
    subtitle: "Jejum Ancestral",
    description:
      "O guia completo sobre jejum intermitente: ciência, protocolos passo a passo, guia de alimentação e bônus cetogênico. Descubra como usar o jejum para queimar gordura, ativar autofagia e regenerar seu organismo.",
    filename: "jejum.pdf",
    access: "PURCHASE" as const,
    price: 2990,
    kiwifyUrl: null,
    published: true,
    featured: true,
  },
  {
    title: "Repelentes Naturais",
    slug: "repelente",
    subtitle: "Proteja Sua Biologia",
    description:
      "Receitas de repelentes naturais com ingredientes que você encontra em qualquer mercado. Inclui guia de óleos essenciais, regras para crianças e pets, e a sabedoria indígena ancestral.",
    filename: "repelentes-naturais-ebook.pdf",
    access: "PURCHASE" as const,
    price: 2990,
    kiwifyUrl: "https://pay.kiwify.com.br/6ZxOdTr",
    published: true,
    featured: false,
  },
  {
    title: "Testosterona Primal",
    slug: "testosterona",
    subtitle: "Hormônios Naturais",
    description:
      "O guia completo para otimizar sua testosterona de forma natural — alimentação ancestral, estilo de vida e hábitos que reativam sua vitalidade.",
    filename: "testo.pdf",
    access: "PURCHASE" as const,
    price: 2990,
    kiwifyUrl: "https://pay.kiwify.com.br/uO2O0jC",
    published: true,
    featured: false,
  },
];

async function main() {
  console.log("🌱 Seeding ebooks...\n");

  for (const data of ebooks) {
    const existing = await prisma.ebook.findUnique({ where: { slug: data.slug } });

    if (existing) {
      await prisma.ebook.update({
        where: { slug: data.slug },
        data: {
          filename: data.filename,
          published: data.published,
          // Não sobrescreve outros campos para preservar edições feitas via admin
        },
      });
      console.log(`✅ Atualizado: ${data.title} (slug: ${data.slug})`);
    } else {
      await prisma.ebook.create({ data });
      console.log(`✨ Criado:     ${data.title} (slug: ${data.slug})`);
    }
  }

  console.log("\n✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
