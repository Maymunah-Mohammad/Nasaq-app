'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
    const [errorMessage, setErrorMessage] = useState('');
    const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedExactTime, setSelectedExactTime] = useState<string>('');

    const handleExpand = (index: number) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);
        } else {
            setExpandedIndex(index);
            // Default select the lowest count or first time string in the hourly Breakdown list
            if (aiRecommendations[index]?.hourlyBreakdown && aiRecommendations[index].hourlyBreakdown.length > 0) {
                const safestHour = [...aiRecommendations[index].hourlyBreakdown].sort((a, b) => a.count - b.count)[0];
                setSelectedExactTime(safestHour.time);
            } else {
                setSelectedExactTime(aiRecommendations[index].timeString);
            }
        }
    };

    const getPeriodName = (timeString: string) => {
        if (timeString.includes('ص')) return 'الصباحية';
        const h = parseInt(timeString.split(':')[0] || '1', 10);
        if (h === 12 || h <= 3) return 'فترة الظهيرة';
        return 'المسائية';
    };

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

    const runAI = async () => {
        if (selectedDays.length === 0 || selectedTimes.length === 0) return;

        const branch = searchParams.get('branch') || '';
        setIsAnalyzing(true);
        setHasResults(false);
        setHasError(false);
        setExpandedIndex(null);

        try {
            const response = await fetch('/api/smart-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, selectedDays, selectedTimes, branch, count: 5 })
            });
            const data = await response.json();

            setIsAnalyzing(false);

            if (data.error) {
                setHasError(true);
                setErrorMessage(data.message || 'عذراً، لا توجد مواعيد متاحة في هذا الفرع حالياً. جرب اختيار يوم آخر');
            } else {
                const recs = data.recommendations || [];

                // Sort recommendations to securely force the best options (isBest/low congestion) to the top of the list
                const sortedRecs = [...recs].sort((a: any, b: any) => {
                    const scoreA = (a.isBest ? 2 : 0) + (a.congestionLevel === 'منخفض' ? 1 : 0);
                    const scoreB = (b.isBest ? 2 : 0) + (b.congestionLevel === 'منخفض' ? 1 : 0);
                    return scoreB - scoreA;
                });

                // Guarantee the UI only ever highlights the #1 absolute best to avoid visual duplication bugs from AI hallucinations
                if (sortedRecs.length > 0) {
                    sortedRecs.forEach((r, idx) => {
                        r.isBest = (idx === 0);
                    });
                }

                setAiRecommendations(sortedRecs);
                setHasResults(true);
            }
        } catch (error) {
            setIsAnalyzing(false);
            setHasError(true);
            setErrorMessage('فشل الاتصال بالذكاء الاصطناعي.');
        }
    };

    return (
        <section style={{ padding: '0 20px', marginTop: '30px', paddingBottom: '80px' }}>
            {/* Navigation for Selection State (Pre-AI) */}
            {!hasResults && !isAnalyzing && !hasError && (
                <nav style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                        onClick={() => window.close()}
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
                </nav>
            )}

            {hasResults && (
                <nav style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Breadcrumbs on the right (First in RTL DOM order) */}
                    <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span
                            onClick={() => setHasResults(false)}
                            style={{ cursor: 'pointer' }}
                        >
                            الأوقات المفضلة
                        </span>
                        <span>/</span>
                        <span style={{ color: '#0F172A', fontWeight: 600 }}>اختيارات نسق</span>
                    </div>

                    {/* Back icon on the left (Second in RTL DOM order) */}
                    <div>
                        <Link
                            href={type === 'receive' ? '/receiving/welcomeAndStart' : '/sending/welcomeAndStart'}
                            style={{
                                color: 'var(--primary-blue)',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '44px',
                                minHeight: '44px',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#fff'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>undo</span>
                        </Link>
                    </div>
                </nav>
            )}
            <h1 className="hero-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
                اختيارات نَسَق
            </h1>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
                {type === 'receive'
                    ? `نستخدم الذكاء الاصطناعي لاختيار أفضل وقت يناسبك لاستلام شحنتك بـ${searchParams.get('branch') || 'فرع العليا'} بأقل ازدحام ممكن.`
                    : 'الذكاء الاصطناعي سيقترح أفضل الفروع والأوقات الأقل ازدحاماً والأقرب لك لتسليم شحنتك.'}
            </p>

            {!isAnalyzing && !hasResults && !hasError && (
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#F1F5F9', padding: '8px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-blue)' }}>location_on</span>
                        <span style={{ color: '#0F172A', fontSize: '14px', fontWeight: 500 }}>حي العليا، الرياض، المملكة العربية السعودية</span>
                    </div>
                </div>
            )}

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
                        {errorMessage || 'عذراً، لا توجد مواعيد متاحة في هذا الفرع حالياً. جرب اختيار يوم آخر.'}
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
                    <div style={{ marginBottom: '8px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ color: '#64748B', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>بناءً على اختياراتك لـ:</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {selectedDays.map(day => (
                                <span key={day} style={{ backgroundColor: 'rgba(42, 44, 121, 0.1)', color: 'var(--primary-blue)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                    {day}
                                </span>
                            ))}
                            {selectedTimes.map(time => (
                                <span key={time} style={{ backgroundColor: '#E0F2FE', color: '#0369A1', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                                    {time}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h2 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 600 }}>أفضل المواعيد المقترحة لك:</h2>
                        <button onClick={() => { setHasResults(false); }} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>تغيير التفضيلات</button>
                    </div>

                    {aiRecommendations.map((rec, index) => (
                        <div key={index}
                            style={{
                                backgroundColor: '#fff',
                                border: (index === 0 || rec.isBest) ? '2px solid var(--primary-blue)' : '1px solid #E2E8F0',
                                padding: '20px',
                                borderRadius: '16px',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                boxShadow: (index === 0 || rec.isBest) ? '0 4px 12px rgba(42,44,121,0.1)' : 'none'
                            }}>
                            {(index === 0 || rec.isBest) && (
                                <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--primary-blue)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>🌟 التوصية الأفضل</div>
                            )}

                            <div
                                onClick={() => handleExpand(index)}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', marginTop: (index === 0 || rec.isBest) ? '8px' : '0' }}
                            >
                                <div>
                                    <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: 600, marginBottom: '0px' }}>يوم {rec.day}</h3>
                                    <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 400, marginBottom: '8px' }}>{rec.date}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', marginBottom: '8px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                                        <span>الفترة: {getPeriodName(rec.timeString)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                                        <span>{rec.branch}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <div style={{
                                        backgroundColor: rec.congestionLevel === 'منخفض' ? '#D1FAE5' : (rec.congestionLevel === 'متوسط' ? '#FEF3C7' : '#FEE2E2'),
                                        color: rec.congestionLevel === 'منخفض' ? '#047857' : (rec.congestionLevel === 'متوسط' ? '#B45309' : '#B91C1C'),
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                                        {rec.congestionLevel === 'منخفض' ? 'ازدحام منخفض' : (rec.congestionLevel === 'متوسط' ? 'ازدحام متوسط' : 'مزدحم جداً')}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginTop: '4px' }}>
                                        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                                            {rec.appointmentCount} مسجلين طوال اليوم
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expand Indicator */}
                            <div
                                onClick={(e) => { e.stopPropagation(); handleExpand(index); }}
                                style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px',
                                    marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0',
                                    color: 'var(--primary-blue)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{expandedIndex === index ? 'إخفاء الأوقات' : 'عرض الساعات الدقيقة المتاحة'}</span>
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '18px',
                                    transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    expand_more
                                </span>
                            </div>

                            {expandedIndex === index && (
                                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                                    <h4 style={{ color: '#0F172A', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                                        اختر الوقت الدقيق الذي يناسبك:
                                    </h4>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                        {rec.hourlyBreakdown ? rec.hourlyBreakdown.map((hb: any) => (
                                            <button
                                                key={hb.time}
                                                onClick={(e) => { e.stopPropagation(); setSelectedExactTime(hb.time); }}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: `1px solid ${selectedExactTime === hb.time ? 'var(--primary-blue)' : '#CBD5E1'}`,
                                                    backgroundColor: selectedExactTime === hb.time ? 'rgba(42, 44, 121, 0.05)' : '#fff',
                                                    color: selectedExactTime === hb.time ? 'var(--primary-blue)' : '#475569',
                                                    fontWeight: selectedExactTime === hb.time ? 600 : 400,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <span>{hb.time}</span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: hb.count <= 2 ? '#D1FAE5' : (hb.count <= 5 ? '#FEF3C7' : '#FEE2E2'),
                                                    color: hb.count <= 2 ? '#047857' : (hb.count <= 5 ? '#B45309' : '#B91C1C'),
                                                    fontWeight: 600
                                                }}>
                                                    {hb.count} شخص
                                                </span>
                                            </button>
                                        )) : (
                                            <div style={{ color: '#64748B', fontSize: '14px' }}>عفواً، بيانات الازدحام غير متاحة حالياً.</div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <NasaqOfficalBTN01
                                            title="تأكيد الموعد"
                                            showLogo={false}
                                            showCredit={false}
                                            href={`/Confirmation?type=${encodeURIComponent(type)}&branch=${encodeURIComponent(rec.branch)}&day=${encodeURIComponent(rec.day)}&date=${encodeURIComponent(rec.date)}&time=${encodeURIComponent(selectedExactTime)}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
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
