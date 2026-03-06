export default function SPLLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="spl-container">
            {/* Top Utility Bar */}
            <div className="spl-top-bar">
                <div className="spl-top-bar-inner">
                    <div className="spl-top-bar-left">
                        <span>En</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <div className="spl-top-bar-right">
                        <a href="#">أفراد</a>
                        <a href="#">أعمال</a>
                        <a href="#">الخدمات الحكومية</a>
                    </div>
                </div>
            </div>

            <main className="spl-main-content">
                {/* Header section inside white area */}
                <header className="spl-header">
                    <div className="spl-header-inner" dir="ltr">
                        {/* Right side in LTR layout implies left visually on screen if we flip it, but let's stick to LTR for the header structure to match design */}
                        <div className="spl-header-left">
                            <a href="#">الفروع</a>
                            <a href="#">دخول</a>
                            <a href="#">تسجيل</a>
                        </div>
                        <div className="spl-header-right">
                            <img src="/spl-logo.png" alt="SPL Logo" className="spl-brand-logo" />
                            <button className="spl-hamburger-menu">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Injected Page Content */}
                {children}
            </main>

            <footer className="spl-footer">
                <div className="spl-footer-content" dir="ltr">
                    {/* Logo Removed per request */}

                    <div className="spl-footer-right">
                        <ul className="spl-footer-links" dir="rtl">
                            <li><a href="#">شروط الخدمة</a></li>
                            <li><a href="#">سياسة الخصوصية</a></li>
                            <li><a href="#">إشعار الخصوصية</a></li>
                        </ul>

                        <div className="spl-social-icons">
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                        </div>
                    </div>
                </div>

                <div className="spl-copyright" dir="rtl">
                    © 2026 جميع الحقوق محفوظة للبريد السعودي | سبل
                </div>
            </footer>
        </div>
    );
}
