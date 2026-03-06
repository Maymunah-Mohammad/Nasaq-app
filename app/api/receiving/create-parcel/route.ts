import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // Generate a fake tracking number
        const trackingNumber = `SPL-${Math.floor(100000000 + Math.random() * 900000000)}`;

        // Create the Parcel record
        const parcel = await prisma.parcel.create({
            data: {
                trackingNumber,
                status: 'ready_for_pickup',
                branch: 'Al Olaya Branch', // using a fake typical branch
                phone: '+966500000000', // placeholder since SMS is removed
            }
        });

        const redirectUrl = new URL(`/receiving/parcel/${parcel.id}`, req.url);
        return NextResponse.redirect(redirectUrl);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
