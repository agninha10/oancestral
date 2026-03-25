import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';

const ALLOWED_EXTS = ['.pdf', '.epub', '.docx', '.doc'];

export async function GET() {
    const session = await getSession();

    if (!session?.userId || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const ebooksDir = path.join(process.cwd(), 'private', 'ebooks');

    if (!fs.existsSync(ebooksDir)) {
        return NextResponse.json([]);
    }

    const files = fs
        .readdirSync(ebooksDir)
        .filter((f) => ALLOWED_EXTS.includes(path.extname(f).toLowerCase()))
        .map((filename) => ({
            filename,
            label: path
                .basename(filename, path.extname(filename))
                .replace(/[_-]/g, ' '),
            sizeKb: Math.round(fs.statSync(path.join(ebooksDir, filename)).size / 1024),
        }));

    return NextResponse.json(files);
}
