import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { phone, type, branch } = await req.json();

        if (!phone || !type) {
            return NextResponse.json({ error: 'Phone and type are required' }, { status: 400 });
        }

        // 1. Save data to Railway Postgres via Prisma
        const appointment = await prisma.appointment.create({
            data: {
                phone,
                type,
                branch: branch || null
            }
        });

        return NextResponse.json({ success: true, appointment });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
