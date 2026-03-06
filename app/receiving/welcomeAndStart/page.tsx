'use client';

import SPLLayout from '../../../components/SPLLayout';
import Link from 'next/link';

export default function ReceivingStep1() {
    return (
        <SPLLayout>
            <section style={{ padding: '20px' }}>
                <nav style={{ fontSize: '14px', color: '#64748B', marginBottom: '40px', textAlign: 'right', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href="/" style={{ color: 'var(--spl-primary)', textDecoration: 'none' }}>الرئيسية</Link>
                    <span>/</span>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>الاستلام</span>
                </nav>

                {/* The new content will be placed here */}
            </section>
        </SPLLayout>
    );
}
