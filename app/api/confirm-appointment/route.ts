import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { type, branch, date, time, appointmentId } = await req.json();

        // 1. Save data to Postgres via Prisma
        const appointmentDate = new Date(); // Mocking exact time parsing for demo

        let appointment;

        if (appointmentId) {
            // Find existing row to avoid duplicates if user changes their mind
            const existing = await prisma.appointment.findUnique({
                where: { id: appointmentId }
            });

            if (existing) {
                appointment = await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        type: type || 'receive',
                        branch: branch || null,
                        date: appointmentDate,
                        status: "confirmed"
                    }
                });
                console.log("=========================================");
                console.log("🔄 APPOINTMENT UPDATED IN DATABASE:");
                console.log(appointment);
                console.log("=========================================");
            }
        }

        if (!appointment) {
            appointment = await prisma.appointment.create({
                data: {
                    phone: "+966500000000",
                    type: type || 'receive',
                    branch: branch || null,
                    date: appointmentDate,
                    status: "confirmed"
                }
            });

            console.log("=========================================");
            console.log("✅ APPOINTMENT ADDED TO DATABASE:");
            console.log(appointment);
            console.log("=========================================");
        }

        return NextResponse.json({ success: true, appointment });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
