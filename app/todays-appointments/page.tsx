import NasaqLayout from '../../components/NasaqLayout';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import ClientAppointments from './ClientAppointments';

export const dynamic = 'force-dynamic'; // Disable cache so the page always renders the latest appointments

export default async function TodaysAppointmentsPage() {
    // Get today's date boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch only today's appointments (ordering by date descending to see newest first)
    // We can also include 'pendingParcel' if there's related data
    const appointments = await prisma.appointment.findMany({
        where: {
            date: {
                gte: todayStart,
                lte: todayEnd,
            }
        },
        include: {
            pendingParcel: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // We can format the appointment data for the client
    const serializedAppointments = appointments.map(app => ({
        id: app.id,
        type: app.type, // e.g. 'send', 'receive'
        status: app.status,
        branch: app.branch || 'غير محدد',
        date: app.date.toISOString(),
        phone: app.phone,
        trackingNumber: app.pendingParcel?.trackingNumber || 'بدون رقم تتبع'
    }));

    return (
        <NasaqLayout>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                {/* Breadcrumb Navigation */}
                <div style={{ padding: '0 0 20px', color: '#666', fontSize: '14px', borderBottom: '1px solid #eaeaea', marginBottom: '20px' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#666', transition: 'color 0.2s' }}>الرئيسية</Link>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>مواعيد اليوم</span>
                </div>

                <div style={{ flexGrow: 1 }}>
                    <h1 style={{ fontSize: '24px', color: 'var(--primary-blue)', marginBottom: '20px' }}>مواعيد اليوم</h1>

                    <ClientAppointments appointments={serializedAppointments} />
                </div>
            </div>
        </NasaqLayout>
    );
}
