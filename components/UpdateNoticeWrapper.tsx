'use client';

import { useVersionCheck } from '@/lib/useVersionCheck';
import UpdateNotice from './UpdateNotice';

export default function UpdateNoticeWrapper() {
  const { showUpdateNotice, handleReload } = useVersionCheck();

  if (!showUpdateNotice) return null;

  return <UpdateNotice onReload={handleReload} />;
}
