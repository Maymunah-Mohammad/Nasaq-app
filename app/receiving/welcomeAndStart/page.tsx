import SPLLayout from '../../../components/SPLLayout';
import Link from 'next/link';

export default function ReceivingStep1() {
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
                    <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }} dir="auto">
                        نحن سعداء بإعلامك أن شحنتك جاهزة للاستلام في الفرع
                    </p>
                </div>
            </section>
        </SPLLayout>
    );
}
