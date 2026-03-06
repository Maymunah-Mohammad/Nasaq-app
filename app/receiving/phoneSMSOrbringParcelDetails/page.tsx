'use client';

import { useState } from 'react';
import NasaqLayout from '../../../components/NasaqLayout';
import Link from 'next/link';

export default function ReceivingStep1() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (phone.length !== 9 || !phone.startsWith('5')) {
            setError('(Event : "إدخال رقم الجوال" , Error message : "يجب أن يبدأ الرقم بـ 5 ويتكون من 9 أرقام")');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/receiving/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: `+966${phone}` }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(`(Event : "إرسال رسالة" , Error message : "${data.error || 'حدث خطأ غير متوقع'}")`);
            }
        } catch (err) {
            setError('(Event : "خطأ اتصال" , Error message : "تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً")');
        } finally {
            setLoading(false);
        }
    };

    return (
        <NasaqLayout>
            <section style={{ padding: '20px' }}>
                <nav style={{ fontSize: '14px', color: '#64748B', marginBottom: '40px', textAlign: 'right', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href="/" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>الرئيسية</Link>
                    <span>/</span>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>الاستلام</span>
                </nav>

                <h1 className="hero-title" style={{ marginTop: '20px', textAlign: 'center' }}>تجربة نسق</h1>

                <form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#0F172A', fontWeight: 500, fontSize: '16px' }}>
                            رقم الجوال
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'stretch',
                            border: '1px solid #CBD5E1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            direction: 'ltr'
                        }}>
                            <div style={{
                                backgroundColor: '#F1F5F9',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#475569',
                                borderRight: '1px solid #CBD5E1',
                                fontWeight: 500
                            }}>
                                +966
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
                                placeholder="5XXXX"
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    padding: '16px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    width: '100%',
                                }}
                            />
                        </div>
                        {error && (
                            <p style={{ color: '#E40066', fontSize: '13px', marginTop: '8px', fontWeight: 500 }} dir="auto">
                                {error}
                            </p>
                        )}
                        <p style={{ marginTop: '12px', color: '#64748B', fontSize: '14px', lineHeight: 1.6 }} dir="auto">
                            ستصلك رسالة نصية لشحنة وهمية خاصة بك٬ وعليك حجز موعد لاستلامها.
                        </p>
                    </div>

                    {!success ? (
                        <button
                            type="submit"
                            disabled={loading || phone.length !== 9}
                            className="action-btn"
                            style={{ width: '100%', opacity: loading || phone.length !== 9 ? 0.7 : 1, marginTop: '20px' }}
                        >
                            {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                        </button>
                    ) : (
                        <div style={{ padding: '16px', backgroundColor: '#ECFDF5', color: '#065F46', borderRadius: '12px', textAlign: 'center', fontWeight: 500 }}>
                            تم إرسال الرسالة النصية بنجاح! يرجى التحقق من الرسائل.
                        </div>
                    )}
                </form>
            </section>
        </NasaqLayout>
    );
}
