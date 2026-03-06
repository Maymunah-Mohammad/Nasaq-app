import SPLLayout from '../../components/SPLLayout';
import Link from 'next/link';
import NasaqOfficalBTN01 from '../../components/NasaqOfficalBTN01';

export default function ThankYouPage() {
    return (
        <SPLLayout>
            <section style={{ padding: '0 20px', marginTop: '60px', paddingBottom: '80px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#D1FAE5', width: '80px', height: '80px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#047857', fontSize: '40px' }}>task_alt</span>
                </div>

                <h1 className="spl-hero-title" style={{ color: '#0F172A', fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>
                    شكراً لك!
                </h1>

                <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '300px', margin: '0 auto 40px' }}>
                    تم تأكيد موعدك بنجاح. ننتظر زيارتك للفرع في الوقت المحدد.
                </p>

            </section>
        </SPLLayout>
    );
}
