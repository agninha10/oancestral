/**
 * Seed: conta de review para aprovação na Google Play Store
 *
 * Cria (ou atualiza) um usuário com acesso completo à plataforma:
 *   email: review@oancestral.com.br
 *   senha: ReviewOAncestral2025!
 *
 * Roda com: npx tsx prisma/seed-review-account.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'review@oancestral.com.br';
    const password = 'ReviewOAncestral2025!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            name: 'Conta de Review',
            role: 'USER',
            subscriptionStatus: 'ACTIVE',
            emailVerified: new Date(),
            subscriptionEndDate: new Date(Date.UTC(2099, 11, 31)),
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Conta de Review',
            role: 'USER',
            subscriptionStatus: 'ACTIVE',
            emailVerified: new Date(),
            subscriptionEndDate: new Date(Date.UTC(2099, 11, 31)),
        },
    });

    console.log(`✓ Conta de review criada/atualizada: ${user.email} (id: ${user.id})`);
    console.log(`  Senha: ${password}`);
    console.log(`  Status: ${user.subscriptionStatus} (expira em 31/12/2099)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
