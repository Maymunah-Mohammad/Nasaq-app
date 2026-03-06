'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NasaqLayout from '../../components/NasaqLayout';
import NasaqOfficalBTN01 from '../../components/NasaqOfficalBTN01';

const DAYS = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
];

const TIMES = [
    'صباحاً',
    'ظهراً',
    'مساءً'
];

function AISelectionScreen() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'receive'; // 'receive' or 'send'

    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasResults, setHasResults] = useState(false);
    const [hasError, setHasError] = useState(false);

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const toggleTime = (time: string) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const runAI = () => {
        if (selectedDays.length === 0 || selectedTimes.length === 0) return;

        setIsAnalyzing(true);
        setHasResults(false);
        setHasError(false);

        // Simulate AI thinking and congestion checking
        setTimeout(() => {
            setIsAnalyzing(false);

            // Logic to trigger the specific error state required by the user
            // If they ONLY select 'الجمعة' (Friday is usually off/heavy), we throw the error state to showcase this capability
            if (selectedDays.length === 1 && selectedDays[0] === 'الجمعة') {
                setHasError(true);
            } else {
                setHasResults(true);
            }
        }, 2200); // Wait 2.2 seconds to simulate analysis
    };

    return (
        <section style={{ padding: '0 20px', marginTop: '30px', paddingBottom: '80px' }}>
            <h1 className="hero-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
                المواعيد الذكية بـ نَسَق
            </h1>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
                {type === 'receive'
                    ? 'نستخدم الذكاء الاصطناعي لاختيار أفضل وقت يناسبك لاستلام شحنتك بفرع العليا بأقل ازدحام ممكن.'
                    : 'الذكاء الاصطناعي سيقترح أفضل الفروع والأوقات الأقل ازدحاماً والأقرب لك لتسليم شحنتك.'}
            </p>

            {!isAnalyzing && !hasResults && !hasError && (
                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>1. الأيام المفضلة لك (يمكنك اختيار أكثر من يوم)</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: `1px solid ${selectedDays.includes(day) ? 'var(--primary-blue)' : '#E2E8F0'}`,
                                    backgroundColor: selectedDays.includes(day) ? 'rgba(42, 44, 121, 0.05)' : '#fff',
                                    color: selectedDays.includes(day) ? 'var(--primary-blue)' : '#475569',
                                    fontWeight: selectedDays.includes(day) ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>2. الأوقات المناسبة</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                        {TIMES.map(time => (
                            <button
                                key={time}
                                onClick={() => toggleTime(time)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: `1px solid ${selectedTimes.includes(time) ? 'var(--primary-blue)' : '#E2E8F0'}`,
                                    backgroundColor: selectedTimes.includes(time) ? 'rgba(42, 44, 121, 0.05)' : '#fff',
                                    color: selectedTimes.includes(time) ? 'var(--primary-blue)' : '#475569',
                                    fontWeight: selectedTimes.includes(time) ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                                }}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <div style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
                        <p style={{ color: '#92400E', fontSize: '13px', lineHeight: 1.6 }} dir="auto">
                            <strong>تلميح:</strong> لاختبار ميزة رفض الذكاء الاصطناعي للمواعيد المزدحمة، اختر يوم <strong>"الجمعة"</strong> فقط.
                        </p>
                    </div>

                    <NasaqOfficalBTN01
                        title="بحث بالذكاء الاصطناعي"
                        onClick={runAI}
                        disabled={selectedDays.length === 0 || selectedTimes.length === 0}
                    />
                </div>
            )}

            {isAnalyzing && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid rgba(42, 44, 121, 0.1)',
                        borderLeftColor: 'var(--primary-blue)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    <h2 style={{ color: 'var(--primary-blue)', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>جاري تحليل الازدحام...</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', textAlign: 'center', lineHeight: 1.6 }}>يقوم الذكاء الاصطناعي بحساب أفضل الأوقات والفروع لضمان تجربة سريعة لك.</p>
                </div>
            )}

            {hasError && (
                <div style={{ backgroundColor: '#fff', padding: '32px 24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ backgroundColor: '#FEE2E2', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#DC2626', fontSize: '32px' }}>error</span>
                    </div>
                    <h2 style={{ color: '#0F172A', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>لا توجد مواعيد متاحة</h2>
                    <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                        عذراً، لا توجد مواعيد متاحة في هذا الفرع حالياً. جرب اختيار يوم آخر.
                    </p>
                    <button
                        onClick={() => { setHasError(false); setSelectedDays([]); }}
                        style={{ backgroundColor: '#E2E8F0', color: '#0F172A', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
                    >
                        العودة للاختيار
                    </button>
                </div>
            )}

            {hasResults && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h2 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 600 }}>أفضل المواعيد المقترحة لك:</h2>
                        <button onClick={() => { setHasResults(false); }} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>تغيير التفضيلات</button>
                    </div>

                    {/* Result 1 (Best AI Option) */}
                    <div style={{ backgroundColor: '#fff', border: '2px solid var(--primary-blue)', padding: '20px', borderRadius: '16px', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(42,44,121,0.1)' }}>
                        <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--primary-blue)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>🌟 التوصية الأفضل</div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '8px' }}>
                            <div>
                                <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>يوم {selectedDays[0]}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', marginBottom: '8px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                                    <span>{selectedTimes[0] === 'صباحاً' ? '10:30 ص' : selectedTimes[0] === 'ظهراً' ? '02:00 م' : '08:30 م'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                                    <span>{type === 'receive' ? 'فرع العليا' : 'فرع الملك عبدالله (الأقرب والأسرع)'}</span>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#D1FAE5', color: '#047857', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                                ازدحام منخفض
                            </div>
                        </div>
                    </div>

                    {/* Result 2 (Alternative Date/Time combinations) */}
                    {selectedDays.length > 0 && (
                        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', padding: '20px', borderRadius: '16px', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>يوم {selectedDays[selectedDays.length > 1 ? 1 : 0]}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', marginBottom: '8px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                                        <span>{selectedTimes.includes('مساءً') ? '07:15 م' : '11:45 ص'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                                        <span>{type === 'receive' ? 'فرع العليا' : 'فرع الملز (2 كم)'}</span>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                                    ازدحام متوسط
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default function SelectDateAndTimeWithAI() {
    return (
        <NasaqLayout>
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>جاري التحميل...</div>}>
                <AISelectionScreen />
            </Suspense>
        </NasaqLayout>
    );
}
