'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SPLLayout from '../../components/SPLLayout';
import Link from 'next/link';

function ThankYouScreen() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'receive';
    const actionLabel = type === 'receive' ? 'استلام شحنة' : 'تسليم شحنة';
    const homeLink = type === 'receive' ? '/receiving/welcomeAndStart' : '/sending/welcomeAndStart';

    return (
        <section style={{ padding: '20px' }}>
            {/* Same Breadcrumb design as Step 0 */}
            <nav style={{ fontSize: '14px', color: '#64748B', marginBottom: '40px', textAlign: 'right', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link href={homeLink} style={{ color: 'var(--spl-primary)', textDecoration: 'none' }}>تجربة نسق</Link>
                <span className="material-symbols-outlined" style={{ fontSize: '12px', opacity: 0.5 }}>arrow_back_ios_new</span>
                <span style={{ color: '#0F172A', fontWeight: 500 }}>{actionLabel}</span>
            </nav>

            <div style={{ marginTop: '20px', paddingBottom: '80px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#D1FAE5', width: '80px', height: '80px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#047857', fontSize: '40px' }}>task_alt</span>
                </div>

                <h1 className="spl-hero-title" style={{ color: '#0F172A', fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>
                    شكراً لك!
                </h1>

                <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '300px', margin: '0 auto 40px' }}>
                    تم تأكيد موعدك بنجاح. ننتظر زيارتك للفرع في الوقت المحدد.
                </p>
            </div>
        </section>
    );
}

export default function ThankYouPage() {
    return (
        <SPLLayout>
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>جاري التحميل...</div>}>
                <ThankYouScreen />
            </Suspense>
        </SPLLayout>
    );
}
