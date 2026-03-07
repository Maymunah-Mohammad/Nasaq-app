"use client";

import React, { useState } from 'react';

type Appointment = {
    id: string;
    type: string;
    status: string;
    branch: string;
    date: string;
    phone: string;
    trackingNumber: string;
};

export default function ClientAppointments({ appointments }: { appointments: Appointment[] }) {
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Maps appointment id to its generated queue number
    const [arrivedAppointments, setArrivedAppointments] = useState<Record<string, string>>({});

    // We can generate a random queue number for demonstration
    const [queueNumber, setQueueNumber] = useState("");
    const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'passed'>('upcoming');

    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => {
        setIsMounted(true);
        // Load arrived appointments from localStorage on mount
        const stored = localStorage.getItem('nasaq_arrived_appointments');
        if (stored) {
            try {
                setArrivedAppointments(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored appointments", e);
            }
        }
    }, []);

    const handleConfirmArrival = (id: string) => {
        if (arrivedAppointments[id]) return;
        setSelectedAppointmentId(id);
        setShowConfirmModal(true);
    };

    const confirmAction = () => {
        const newQueueNumber = `A${Math.floor(Math.random() * 90) + 10}`;
        if (selectedAppointmentId) {
            setArrivedAppointments(prev => {
                const updated = { ...prev, [selectedAppointmentId]: newQueueNumber };
                localStorage.setItem('nasaq_arrived_appointments', JSON.stringify(updated));
                return updated;
            });
        }
        setQueueNumber(newQueueNumber);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
    };

    const closeModals = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(false);
        setSelectedAppointmentId(null);
    };

    const getManualArTime = (date: Date) => {
        let h = date.getHours();
        const m = date.getMinutes().toString().padStart(2, '0');
        const suffix = h >= 12 ? 'م' : 'ص';
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        return `${h}:${m} ${suffix}`;
    };

    const now = new Date();
    const passedList: Appointment[] = [];
    const currentList: Appointment[] = [];
    const upcomingList: Appointment[] = [];

    appointments.forEach(app => {
        const appDate = new Date(app.date);
        const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffHours < -1) {
            passedList.push(app);
        } else if (diffHours >= -1 && diffHours <= 1) {
            currentList.push(app);
        } else {
            upcomingList.push(app);
        }
    });

    const renderCard = (app: Appointment) => {
        const isSent = app.type === 'send';
        const dateObj = new Date(app.date);
        const assignedQueueNumber = arrivedAppointments[app.id];
        const isArrivedStatus = !!assignedQueueNumber || (selectedAppointmentId === app.id && showSuccessModal);

        return (
            <div key={app.id} style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #eaeaea',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                        موعد {isSent ? 'إرسال' : 'استلام'} شحنة
                    </div>
                    <div style={{ backgroundColor: '#E2E8F0', color: '#444', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                        {isMounted ? getManualArTime(dateObj) : '...'}
                    </div>
                </div>

                <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    رقم التتبع: <span style={{ fontWeight: 'bold', color: '#111' }}>{app.trackingNumber}</span> <br />
                    الفرع: <span style={{ fontWeight: 'bold', color: '#111' }}>{app.branch}</span> <br />
                    التاريخ: <span style={{ fontWeight: 'bold', color: '#111' }}>{isMounted ? dateObj.toLocaleDateString('ar-SA') : '...'}</span>
                </div>

                {/* أنا متواجد في الفرع button & queue info */}
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {assignedQueueNumber && (
                        <div style={{
                            backgroundColor: '#f0fdf4', color: '#166534', padding: '12px',
                            borderRadius: '8px', border: '1px solid #bbf7d0',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            fontWeight: 'bold'
                        }}>
                            <span>رقم النداء الخاص بك:</span>
                            <span style={{ fontSize: '20px', letterSpacing: '1px' }}>{assignedQueueNumber}</span>
                        </div>
                    )}

                    <button
                        onClick={() => handleConfirmArrival(app.id)}
                        disabled={isArrivedStatus}
                        style={{
                            width: '100%',
                            backgroundColor: isArrivedStatus ? '#22c55e' : 'var(--primary-blue)',
                            color: '#fff',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: isArrivedStatus ? 'default' : 'pointer',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 4px 10px rgba(42, 44, 121, 0.1)'
                        }}
                    >
                        {isArrivedStatus ? 'تم تأكيد وصولك' : 'أنا متواجد في الفرع'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>لا يوجد مواعيد مسجلة</div>
            ) : (
                <>
                    {/* Tabs Header */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '6px', borderRadius: '12px' }}>
                        <button
                            onClick={() => setActiveTab('current')}
                            style={{
                                flex: 1, padding: '10px 0', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                                backgroundColor: activeTab === 'current' ? '#047857' : 'transparent',
                                color: activeTab === 'current' ? '#fff' : '#64748B',
                                fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                            }}
                        >
                            حالية ({currentList.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            style={{
                                flex: 1, padding: '10px 0', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                                backgroundColor: activeTab === 'upcoming' ? 'var(--primary-blue)' : 'transparent',
                                color: activeTab === 'upcoming' ? '#fff' : '#64748B',
                                fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                            }}
                        >
                            قادمة ({upcomingList.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('passed')}
                            style={{
                                flex: 1, padding: '10px 0', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                                backgroundColor: activeTab === 'passed' ? '#64748B' : 'transparent',
                                color: activeTab === 'passed' ? '#fff' : '#64748B',
                                fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                            }}
                        >
                            سابقة ({passedList.length})
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'current' && (
                        currentList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {currentList.map(renderCard)}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 0', backgroundColor: '#f8fafc', borderRadius: '12px' }}>لا توجد مواعيد حالية</div>
                        )
                    )}

                    {activeTab === 'upcoming' && (
                        upcomingList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {upcomingList.map(renderCard)}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 0', backgroundColor: '#f8fafc', borderRadius: '12px' }}>لا توجد مواعيد قادمة</div>
                        )
                    )}

                    {activeTab === 'passed' && (
                        passedList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7 }}>
                                {passedList.map(renderCard)}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 0', backgroundColor: '#f8fafc', borderRadius: '12px' }}>لا توجد مواعيد سابقة</div>
                        )
                    )}
                </>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '16px', padding: '30px 20px',
                        width: '90%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                    }}>
                        <h2 style={{ fontSize: '22px', color: 'var(--primary-blue)', marginBottom: '16px' }}>هل أنت متأكد؟</h2>
                        <p style={{ color: '#666', marginBottom: '24px' }}>يجب أن تكون متواجداً بالفعل في الفرع لتأكيد وصولك.</p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={closeModals} style={{
                                flex: 1, backgroundColor: '#f1f1f1', color: '#333', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
                            }}>
                                لا، تراجع
                            </button>
                            <button onClick={confirmAction} style={{
                                flex: 1, backgroundColor: 'var(--primary-blue)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
                            }}>
                                نعم، متواجد
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '16px', padding: '40px 20px',
                        width: '90%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{
                            width: '60px', height: '60px', backgroundColor: '#22c55e', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', color: '#fff'
                        }}>
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <h2 style={{ fontSize: '24px', color: 'var(--primary-blue)', marginBottom: '12px' }}>تم تأكيد وصولك</h2>
                        <p style={{ color: '#555', marginBottom: '8px', lineHeight: '1.5' }}>لقد تم إشعار موظف الفرع بتواجدك.</p>
                        <p style={{ color: '#555', marginBottom: '24px', lineHeight: '1.5' }}>فضلاً انتظر، سيتم استقبالك برقم النداء:</p>

                        <div style={{
                            backgroundColor: 'var(--primary-blue)', color: '#fff',
                            fontSize: '48px', fontWeight: 'bold', padding: '16px',
                            borderRadius: '12px', display: 'inline-block', marginBottom: '30px',
                            minWidth: '140px',
                            letterSpacing: '2px'
                        }}>
                            {queueNumber}
                        </div>

                        <button onClick={closeModals} style={{
                            width: '100%', backgroundColor: '#f1f1f1', color: '#333', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
                        }}>
                            إغلاق
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
