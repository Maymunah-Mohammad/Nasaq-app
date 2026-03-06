export default function NasaqLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app-container">
            {/* Top Utility Bar */}
            <div className="top-bar">
                <div className="top-bar-inner">
                    <div className="top-bar-left">
                        <span>En</span>
                    </div>
                    <div className="top-bar-right">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                </div>
            </div>

            <main className="main-content">
                {/* Header section inside white area */}
                <header className="header">
                    <div className="header-inner" dir="ltr">
                        <div className="logo">
                            <img src="/logo-brand.png" alt="Nasaq Logo" className="brand-logo" />
                        </div>
                        <button className="hamburger-menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </header>

                {/* Injected Page Content */}
                {children}
            </main>

            <footer className="footer">
                <div className="footer-content" dir="ltr">
                    <div className="footer-left">
                        <div className="logo footer-logo">
                            <img src="/logo-white.png" alt="Nasaq Logo" className="footer-brand-logo" />
                        </div>
                    </div>

                    <div className="footer-right">
                        <ul className="footer-links" dir="rtl">
                            <li><a href="#">شروط الخدمة</a></li>
                            <li><a href="#">سياسة الخصوصية</a></li>
                            <li><a href="#">إشعار الخصوصية</a></li>
                            <li><a href="#">مركز المساعدة</a></li>
                        </ul>

                        <div className="social-icons">
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                            <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                        </div>
                    </div>
                </div>

                <div className="copyright">
                    © 2026 جميع الحقوق محفوظة لنسق | Nasaq
                </div>
            </footer>
        </div>
    );
}
