import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const session = await getSession();

    if (!session?.userId) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { subscriptionStatus: true, role: true },
    });

    if (!user || (user.subscriptionStatus !== 'ACTIVE' && user.role !== 'ADMIN')) {
        return NextResponse.json(
            { error: 'Acesso Premium necessário para baixar este arquivo.' },
            { status: 403 }
        );
    }

    const { filename } = await params;

    // Prevent path traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), 'privates', safeFilename);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Arquivo não encontrado.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType =
        ext === '.pdf' ? 'application/pdf' : 'application/octet-stream';

    // Log download activity (non-blocking)
    prisma.activityLog
        .create({
            data: {
                userId: session.userId,
                action: 'DOWNLOAD',
                resource: safeFilename,
                metadata: { size: fileBuffer.length },
            },
        })
        .catch(() => {});

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
            'Content-Length': String(fileBuffer.length),
            'Cache-Control': 'private, no-cache',
        },
    });
}
