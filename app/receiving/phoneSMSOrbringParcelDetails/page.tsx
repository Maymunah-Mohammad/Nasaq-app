import NasaqLayout from '../../../components/NasaqLayout';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import NasaqOfficalBTN01 from '../../../components/NasaqOfficalBTN01';

// Server Component
export default async function ParcelDetails() {
    // 1. Fetch any random pending parcel from the 100 seeded fake ones
    const parcelsCount = await prisma.pendingParcel.count();
    const skip = Math.max(0, Math.floor(Math.random() * parcelsCount));

    let parcel = await prisma.pendingParcel.findFirst({
        skip: skip,
    });

    if (!parcel) {
        // Fallback in case the DB is completely empty before seeding
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
        <NasaqLayout>
            <section style={{ padding: '20px' }}>
                <nav style={{ fontSize: '14px', color: '#64748B', marginBottom: '40px', textAlign: 'right', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href="/" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>الرئيسية</Link>
                    <span>/</span>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>تفاصيل الشحنة</span>
                </nav>

                <h1 className="hero-title" style={{ marginTop: '20px', textAlign: 'center', marginBottom: '40px' }}>
                    تفاصيل الشحنة
                </h1>

                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                    <p style={{ color: '#0F172A', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }} dir="auto">
                        شحنتك وصلت! 👋
                    </p>
                    <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }} dir="auto">
                        نحن سعداء بإعلامك أن شحنتك جاهزة للاستلام في الفرع
                    </p>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#64748B', fontSize: '14px' }}>رقم التتبع:</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary-blue)', fontSize: '16px' }} dir="ltr">{parcel.trackingNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#64748B', fontSize: '14px' }}>الفرع:</span>
                            <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>{parcel.branch}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748B', fontSize: '14px' }}>الحالة:</span>
                            <span style={{
                                fontWeight: 500,
                                color: '#10B981',
                                backgroundColor: '#D1FAE5',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '13px'
                            }}>جاهزة للاستلام</span>
                        </div>
                    </div>

                    <h2 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 600, marginBottom: '12px' }} dir="auto">
                        كيف تستلم شحنتك؟
                    </h2>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }} dir="auto">
                        لأننا نهتم براحتك ونريد تجنب انتظارك في الزحام، نرجو منك حجز موعد مسبق لضمان خدمة سريعة ومميزة.
                    </p>
                    <div style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
                        <p style={{ color: '#92400E', fontSize: '13px', lineHeight: 1.6 }} dir="auto">
                            <strong>ملاحظة:</strong> يرجى إبراز رمز الاستجابة السريع (QR Code) أو رقم التتبع للموظف عند وصولك في الموعد المحدد.
                        </p>
                    </div>

                    <h2 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 600, marginBottom: '12px' }} dir="auto">
                        موقع الفرع على الخريطة
                    </h2>
                    <div style={{ width: '100%', height: '140px', backgroundColor: '#E2E8F0', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
                        {/* Placeholder Map replacing actual static iframe mostly for UI speed */}
                        <img
                            src="https://maps.googleapis.com/maps/api/staticmap?center=24.7136,46.6753&zoom=14&size=400x140&maptype=roadmap&markers=color:red%7C24.7136,46.6753&key=NO_KEY"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt="Map Placeholder"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#CBD5E1', zIndex: -1 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748B' }}>map</span>
                        </div>
                    </div>
                    <p style={{ color: '#475569', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }} dir="auto">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-blue)' }}>schedule</span>
                        ساعات العمل: من 8:00 صباحاً حتى 9:00 مساءً.
                    </p>
                </div>

                <div style={{ paddingBottom: '30px' }}>
                    <Link href={`/receiving/booking/${parcel.id}`} style={{ textDecoration: 'none' }}>
                        <NasaqOfficalBTN01 title="حجز موعد" />
                    </Link>
                </div>

            </section>
        </NasaqLayout>
    );
}
