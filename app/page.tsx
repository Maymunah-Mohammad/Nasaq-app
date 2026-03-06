import NasaqLayout from '../components/NasaqLayout';
import Link from 'next/link';

export default function Home() {
    return (
        <NasaqLayout>
            <section style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', marginTop: '20px', alignItems: 'center', width: '100%' }}>
                <nav style={{ fontSize: '14px', color: '#0F172A', fontWeight: 500, marginBottom: '20px', alignSelf: 'flex-start' }}>
                    تجربة نسق
                </nav>
                <h1 className="hero-title" style={{ marginBottom: '60px' }}>تجربة نسق</h1>

                <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                    <Link href="/receiving/welcomeAndStart" className="action-btn" style={{ textDecoration: 'none' }}>
                        حجز موعد استلام
                        <span className="material-symbols-outlined">arrow_downward_alt</span>
                    </Link>

                    <Link href="/sending/welcomeAndStart" className="action-btn" style={{ textDecoration: 'none', backgroundColor: 'var(--spl-primary)' }}>
                        حجز موعد إرسال
                        <span className="material-symbols-outlined">arrow_upward_alt</span>
                    </Link>
                </div>
            </section>
        </NasaqLayout>
    );
}
