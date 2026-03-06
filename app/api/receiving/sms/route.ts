import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import twilio from 'twilio';

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // Generate a fake tracking number
        const trackingNumber = `SPL-${Math.floor(100000000 + Math.random() * 900000000)}`;

        // Create the Parcel record
        const parcel = await prisma.parcel.create({
            data: {
                trackingNumber,
                status: 'ready_for_pickup',
                branch: 'Al Olaya Branch', // using a fake typical branch
                phone,
            }
        });

        // The URL pattern the user will click in the SMS
        // For development we can use localhost, but let's use a dynamic origin if possible
        const host = req.headers.get('origin') || req.headers.get('host');
        const baseUrl = host?.startsWith('http') ? host : `http://${host}`;
        const parcelUrl = `${baseUrl}/receiving/parcel/${parcel.id}`;

        // Send Twilio SMS
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        const phoneFormatted = phone.startsWith("+") ? phone : `+966${phone.replace(/^0+/, "")}`;

        const messageBody = `عزيزي عميل سبل، استخدم الرابط التالي لتنسيق موعد استلام شحنتك من الفرع بذكاء عبر نَسَق: ${parcelUrl}`;

        await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneFormatted,
        });

        return NextResponse.json({ success: true, parcelId: parcel.id });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
