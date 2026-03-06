'use client';

import SPLLayout from '../../../components/SPLLayout';
import Link from 'next/link';
import NasaqOfficalBTN01 from '../../../components/NasaqOfficalBTN01';

export default function SendingStep1() {
    return (
        <SPLLayout>
            <section style={{ padding: '20px' }}>
                <nav style={{ fontSize: '14px', color: '#64748B', marginBottom: '40px', textAlign: 'right', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href="/" style={{ color: 'var(--spl-primary)', textDecoration: 'none' }}>تجربة نسق</Link>
                    <span>،</span>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>إرسال شحنة</span>
                </nav>

                <h1 className="spl-hero-title" style={{ marginTop: '20px', textAlign: 'center', marginBottom: '40px' }}>
                    مرحبا بك في سبل !
                </h1>

                <div style={{ color: '#0F172A', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }}>
                    <p style={{ fontWeight: 600, fontSize: '18px', marginBottom: '16px' }} dir="auto">
                        تبغى تسلمها من الفرع؟
                    </p>
                    <p style={{ marginBottom: '32px' }} dir="auto">
                        وفر على نفسك وقت الانتظار واحجز موعدك الآن. اختر الفرع الأقرب لك، والوقت اللي يناسبك، وراح نكون بانتظارك
                    </p>

                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--spl-primary)', marginBottom: '16px' }} dir="auto">
                        نصائح سريعة قبل التسليم:
                    </h2>
                    <ul style={{ paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} dir="rtl">
                        <li>تأكد من إغلاق الشحنة بإحكام.</li>
                        <li>اطبع ملصق الشحن (Label) وثبته بوضوح.</li>
                        <li>جهز رقم التتبع أو رمز الاستجابة (QR Code) لإظهاره للموظف أو المسح عند المحطة.</li>
                    </ul>
                </div>

                <div style={{ marginTop: '50px' }}>
                    <Link href="/SelectDateAndTimeWithAI?type=send" target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--spl-primary)',
                        color: '#fff',
                        borderRadius: '32px',
                        padding: '16px',
                        fontSize: '18px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        width: '100%',
                        fontFamily: "'Cairo', sans-serif"
                    }}>
                        حجز موعد
                    </Link>
                </div>
            </section>
        </SPLLayout>
    );
}
