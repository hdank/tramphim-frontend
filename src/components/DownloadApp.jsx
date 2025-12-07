import React, { useEffect, useState } from 'react';

const DownloadApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Don't show the button if we're inside the Capacitor app
    const isInApp = window.location.href.includes('capacitor://') || 
                    window.navigator.userAgent.includes('TramPhimApp') ||
                    typeof window.Capacitor !== 'undefined';
    
    // Only show on mobile devices (not desktop)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if user has dismissed the button in this session
    const dismissed = sessionStorage.getItem('downloadAppDismissed');
    
    if (!isInApp && isMobile && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('downloadAppDismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
        aria-label="Đóng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      
      {/* Download button */}
      <a
        href="/tai-ung-dung"
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        title="Tải ứng dụng TrạmPhim"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        <span className="font-medium">Tải App</span>
      </a>
    </div>
  );
};

export default DownloadApp;
