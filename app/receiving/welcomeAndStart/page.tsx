import SPLLayout from '../../../components/SPLLayout';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import NasaqOfficalBTN01 from '../../../components/NasaqOfficalBTN01';

export const dynamic = 'force-dynamic';

export default async function ReceivingStep1() {
    // 1. Fetch any random pending parcel from the 100 seeded fake ones
    const parcelsCount = await prisma.pendingParcel.count();
    const skip = Math.max(0, Math.floor(Math.random() * parcelsCount));

    let parcel = await prisma.pendingParcel.findFirst({
        skip: skip,
    });

    if (!parcel) {
        // Fallback in case the DB is completely empty
        parcel = {
            id: 'demo-1234',
            trackingNumber: `SPL-${Math.floor(100000000 + Math.random() * 900000000)}`,
            status: 'ready_for_pickup',
            branch: 'Al Olaya Branch',
            phone: '+966500000000',
            createdAt: new Date(),
        };
    }

    return (
        <SPLLayout>
            <section style={{ padding: '20px' }}>
                <nav style={{ fontSize: '14px', color: '#64748B', marginBottom: '40px', textAlign: 'right', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href="/" style={{ color: 'var(--spl-primary)', textDecoration: 'none' }}>الرئيسية</Link>
                    <span>/</span>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>الاستلام</span>
                </nav>

                <h1 className="spl-hero-title" style={{ marginTop: '20px', textAlign: 'center', marginBottom: '40px' }}>
                    استلام شحنة
                </h1>

                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                    <p style={{ color: '#0F172A', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }} dir="auto">
                        شحنتك وصلت! 👋
                    </p>
                    <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }} dir="auto">
                        نحن سعداء بإعلامك أن شحنتك جاهزة للاستلام في الفرع
                    </p>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#64748B', fontSize: '14px' }}>رقم التتبع:</span>
                            <span style={{ fontWeight: 600, color: 'var(--spl-primary)', fontSize: '16px' }} dir="ltr">{parcel.trackingNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#64748B', fontSize: '14px' }}>الفرع:</span>
                            <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>{parcel.branch}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748B', fontSize: '14px' }}>الحالة:</span>
                            <span style={{
                                fontWeight: 600,
                                color: '#047857',
                                backgroundColor: '#D1FAE5',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '13px'
                            }}>جاهزة للاستلام</span>
                        </div>
                    </div>
                </div>

                <div style={{ paddingBottom: '30px' }}>
                    <NasaqOfficalBTN01
                        title="حجز موعد"
                        href="/SelectDateAndTimeWithAI?type=receive"
                    />
                </div>

            </section>
        </SPLLayout>
    );
}
