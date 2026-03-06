import NasaqLayout from '../components/NasaqLayout';
import Link from 'next/link';

export default function Home() {
    return (
        <NasaqLayout>
            <section style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', marginTop: '40px', alignItems: 'center', width: '100%' }}>
                <h1 className="hero-title" style={{ marginBottom: '60px' }}>تجربة نسق</h1>

                <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                    <Link href="/receiving/phoneSMSOrbringParcelDetails" className="action-btn" style={{ textDecoration: 'none' }}>
                        حجز موعد استلام
                        <span className="material-symbols-outlined">arrow_downward_alt</span>
                    </Link>

                    <Link href="/sending/phoneSMSOrbringParcelDetails" className="action-btn" style={{ textDecoration: 'none', backgroundColor: 'var(--spl-primary)' }}>
                        حجز موعد إرسال
                        <span className="material-symbols-outlined">arrow_upward_alt</span>
                    </Link>
                </div>
            </section>
        </NasaqLayout>
    );
}
