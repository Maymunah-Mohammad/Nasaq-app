import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import twilio from 'twilio';

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

        // 2. Send SMS via Twilio using environment variables
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        const messageTypeAr = type === 'pickup' ? 'استلام' : 'إرسال';
        const phoneFormatted = phone.startsWith("+") ? phone : `+966${phone.replace(/^0+/, "")}`;

        await client.messages.create({
            body: `مرحباً بك في نسق! تم تأكيد حجز موعد ${messageTypeAr} بنجاح. رقم الموعد: ${appointment.id.split('-')[0]}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneFormatted,
        });

        return NextResponse.json({ success: true, appointment });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
