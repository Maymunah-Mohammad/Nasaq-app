import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#f9f9f9',
            direction: 'rtl',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden'
        }}>
            {/* Navigation */}
            <nav style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <Link href="/">
                        <img src="/logo-brand.png" alt="Nasaq Logo" style={{ height: '40px' }} />
                    </Link>

                    <ul style={{ display: 'flex', gap: '30px', listStyle: 'none', margin: 0, padding: 0 }}>
                        <li><Link href="/" style={{ textDecoration: 'none', color: '#666', fontSize: '16px' }}>الرئيسية</Link></li>
                        <li><Link href="/todays-appointments" style={{ textDecoration: 'none', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '16px' }}>مواعيد اليوم</Link></li>
                        <li><Link href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '16px' }}>جدول المواعيد</Link></li>
                        <li><Link href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '16px' }}>المساعدة</Link></li>
                    </ul>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <Link href="#" style={{ textDecoration: 'none', color: '#666', fontWeight: 'bold', fontSize: '16px' }}>En</Link>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '60px 0 0 0', margin: '0', zIndex: 5, overflowY: 'auto' }}>
                <div style={{ padding: '0 80px', flexShrink: 0 }}>
                    <h1 style={{ fontSize: '36px', color: 'var(--primary-blue)', marginBottom: '16px', fontWeight: 'bold' }}>مرحبا بك في نسق لجدولة مواعيد الشحن</h1>
                    <p style={{ fontSize: '18px', color: '#555', marginBottom: '40px', maxWidth: '800px', lineHeight: '1.6' }}>
                        اختر أفضل الأوقات والفروع المناسبة لك لإرسال واستلام شحناتك من خلال واجهة سهلة تمكنك من متابعة وإدارة مواعيدك.
                    </p>

                    <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', marginBottom: '40px' }} />

                    <h2 style={{ fontSize: '24px', color: 'var(--primary-blue)', marginBottom: '24px', fontWeight: 'bold' }}>جدول مواعيد اليوم</h2>
                </div>

                {/* Blurry Box for Today's Schedule - spans full width and height */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    flexGrow: 1,
                    backgroundColor: '#fff', // Keeps the blurry box base white, or brand color if they meant blurry box background
                    borderTop: '1px solid #eaeaea',
                    backgroundImage: 'linear-gradient(to right, #f8f8f8 1px, transparent 1px), linear-gradient(to bottom, #f8f8f8 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}>

                    {/* Clear Table Header Overlay */}
                    <div style={{ width: '100%', padding: '0 80px', marginTop: '30px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                            backgroundColor: 'var(--acc-light, #F1F5F9)',
                            borderRadius: '8px',
                            padding: '16px 24px',
                            fontWeight: 'bold',
                            color: 'var(--primary-blue)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div>رقم الشحنة</div>
                            <div>النوع</div>
                            <div>الفرع</div>
                            <div>الوقت</div>
                            <div>الحالة</div>
                        </div>
                    </div>

                    {/* Fake table representation with Blur */}
                    <div style={{ position: 'absolute', top: '90px', left: '80px', right: '80px', bottom: '0', zIndex: 1, pointerEvents: 'none' }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            filter: 'blur(5px)',
                            opacity: 0.6,
                        }}>
                            <div style={{ height: '60px', backgroundColor: 'var(--acc-light, #F1F5F9)', borderRadius: '8px' }}></div>
                            <div style={{ height: '60px', backgroundColor: 'var(--acc-light, #F1F5F9)', borderRadius: '8px' }}></div>
                            <div style={{ height: '60px', backgroundColor: 'var(--acc-light, #F1F5F9)', borderRadius: '8px' }}></div>
                            <div style={{ height: '60px', backgroundColor: 'var(--acc-light, #F1F5F9)', borderRadius: '8px' }}></div>
                            <div style={{ height: '60px', backgroundColor: 'var(--acc-light, #F1F5F9)', borderRadius: '8px' }}></div>
                        </div>
                    </div>

                    {/* Gradient overlay from bottom to top */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '70%',
                        background: 'linear-gradient(to top, var(--primary-blue) 0%, rgba(42, 44, 121, 0) 100%)',
                        zIndex: 4,
                        pointerEvents: 'none'
                    }}></div>

                    {/* Button over the blurred area */}
                    <div style={{ position: 'absolute', top: '250px', zIndex: 10 }}>
                        <Link href="/step0" style={{
                            backgroundColor: '#111',
                            color: '#fff',
                            padding: '16px 48px',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            transition: 'transform 0.2s',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            display: 'inline-block'
                        }}>
                            تجربة نسق
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
