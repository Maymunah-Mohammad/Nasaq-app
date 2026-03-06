'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import NasaqLayout from '../../components/NasaqLayout';
import Link from 'next/link';

// URL to a Lottie JSON for a green checkmark
const SUCCESS_ANIMATION_URL = "https://assets9.lottiefiles.com/packages/lf20_t2bmdm1g.json"; // This is a public green checkmark lottie

function ConfirmationScreen() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const branch = searchParams.get('branch') || '';
    const date = searchParams.get('date') || '';
    const day = searchParams.get('day') || '';
    const time = searchParams.get('time') || '';
    const type = searchParams.get('type') || 'receive';

    const [isFinishing, setIsFinishing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [animationData, setAnimationData] = useState<any>(null);

    // Fetch the lottie json data on mount
    React.useEffect(() => {
        fetch(SUCCESS_ANIMATION_URL)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Error loading lottie", err));
    }, []);

    const handleFinish = async () => {
        setIsFinishing(true);

        try {
            await fetch('/api/confirm-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, branch, date, time })
            });

            setIsFinishing(false);
            setIsSuccess(true);

            // Wait 2 seconds showing Lottie, then redirect to SPL Thank you page
            setTimeout(() => {
                router.push('/ThankYou');
            }, 2000);

        } catch (error) {
            console.error(error);
            setIsFinishing(false);
        }
    };

    if (isSuccess && animationData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <Lottie
                    animationData={animationData}
                    loop={false}
                    style={{ width: 200, height: 200 }}
                />
                <h2 style={{ color: '#047857', fontSize: '24px', fontWeight: 600, marginTop: '20px' }}>تم تأكيد الموعد بنجاح!</h2>
            </div>
        );
    }

    return (
        <section style={{ padding: '0 20px', marginTop: '30px', paddingBottom: '80px' }}>
            <nav style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span onClick={() => router.back()} style={{ cursor: 'pointer' }}>اختيارات نسق</span>
                    <span>/</span>
                    <span style={{ color: '#0F172A', fontWeight: 600 }}>تأكيد الموعد</span>
                </div>

                <div>
                    <button
                        onClick={() => router.back()}
                        style={{
                            color: 'var(--primary-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '44px',
                            minHeight: '44px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>undo</span>
                    </button>
                </div>
            </nav>

            <h1 className="hero-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
                تأكيد الموعد
            </h1>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
                الرجاء مراجعة تفاصيل موعدك
            </p>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', fontSize: '15px' }}>الفرع:</span>
                    <span style={{ color: '#0F172A', fontWeight: 600 }}>{branch}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', fontSize: '15px' }}>اليوم:</span>
                    <span style={{ color: '#0F172A', fontWeight: 600 }}>يوم {day} <span style={{ fontSize: '13px', color: '#64748B' }}>({date})</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontSize: '15px' }}>الوقت:</span>
                    <span style={{ color: '#0F172A', fontWeight: 600 }}>{time}</span>
                </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '32px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#E0F2FE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#0369A1', fontSize: '24px' }}>calendar_add_on</span>
                </div>
                <h3 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>هل ترغب بإضافة الموعد للتقويم؟</h3>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>استقبل تذكيراً قبل موعدك لتجنب الانتظار الطويل.</p>
                <button
                    style={{
                        backgroundColor: '#fff',
                        color: 'var(--primary-blue)',
                        border: '1px solid var(--primary-blue)',
                        padding: '10px 24px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                    }}
                    onClick={() => {
                        window.open(`http://www.google.com/calendar/event?action=TEMPLATE&text=موعد+في+${encodeURIComponent(branch)}&dates=${date.replace(/-/g, '')}T080000Z/${date.replace(/-/g, '')}T090000Z`, '_blank');
                    }}
                >
                    + إضافة إلى التقويم
                </button>
            </div>

            <button
                onClick={handleFinish}
                disabled={isFinishing}
                style={{
                    width: '100%',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#fff',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 600,
                    cursor: isFinishing ? 'not-allowed' : 'pointer',
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: isFinishing ? 0.7 : 1
                }}
            >
                {isFinishing ? 'جاري التأكيد...' : 'إنهاء'}
            </button>
        </section>
    );
}

export default function ConfirmationPage() {
    return (
        <NasaqLayout>
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>جاري التحميل...</div>}>
                <ConfirmationScreen />
            </Suspense>
        </NasaqLayout>
    );
}
