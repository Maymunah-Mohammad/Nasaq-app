import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { type, branch, date, time, appointmentId } = await req.json();

        // 1. Save data to Postgres via Prisma with precise time parsing for the AI feature
        let appointmentDate = new Date();
        try {
            if (date && time) {
                const [dayStr, monthStr, yearStr] = date.split('-');
                let hourOfDay = 12;

                const hourMatch = time.match(/(\d+):/);
                if (hourMatch) {
                    let h = parseInt(hourMatch[1], 10);
                    if (time.includes('ص')) {
                        hourOfDay = h === 12 ? 0 : h;
                    } else if (time.includes('م')) {
                        hourOfDay = h === 12 ? 12 : h + 12;
                    }
                }

                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10) - 1;
                const day = parseInt(dayStr, 10);
                appointmentDate = new Date(year, month, day, hourOfDay, 0, 0);
            }
        } catch (e) {
            console.error("Failed parsing specific date time, falling back to current date:", e);
        }

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
