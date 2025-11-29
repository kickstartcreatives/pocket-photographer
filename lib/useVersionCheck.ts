'use client';

import { useEffect, useState } from 'react';

const APP_VERSION = '1.0.1'; // Update this when deploying changes

export function useVersionCheck() {
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  useEffect(() => {
    const checkVersion = () => {
      const storedVersion = localStorage.getItem('appVersion');
      if (storedVersion && storedVersion !== APP_VERSION) {
        setShowUpdateNotice(true);
      } else if (!storedVersion) {
        localStorage.setItem('appVersion', APP_VERSION);
      }
    };

    // Check immediately on mount
    checkVersion();

    // Check every 5 minutes for updates
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    // Check when tab becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkVersion();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleReload = () => {
    localStorage.setItem('appVersion', APP_VERSION);
    window.location.reload();
  };

  return { showUpdateNotice, handleReload, APP_VERSION };
}
