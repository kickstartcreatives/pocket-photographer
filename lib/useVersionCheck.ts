'use client';

import { useEffect, useState } from 'react';

export function useVersionCheck() {
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('/version.json?' + new Date().getTime());
        const data = await response.json();
        const currentVersion = data.timestamp.toString();
        const storedVersion = localStorage.getItem('appVersion');

        if (storedVersion && storedVersion !== currentVersion) {
          setShowUpdateNotice(true);
        } else if (!storedVersion) {
          localStorage.setItem('appVersion', currentVersion);
        }
      } catch (error) {
        console.error('Failed to check version:', error);
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

  const handleReload = async () => {
    try {
      const response = await fetch('/version.json?' + new Date().getTime());
      const data = await response.json();
      localStorage.setItem('appVersion', data.timestamp.toString());
      window.location.reload();
    } catch (error) {
      console.error('Failed to update version:', error);
      window.location.reload();
    }
  };

  return { showUpdateNotice, handleReload };
}
