import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { recordVisit } from '../api';
import { useAuth } from '../auth/AuthContext';

const SKIPPED_PATHS = ['/login', '/register', '/dashboard'];

export default function VisitTracker() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const shouldTrack = user !== null && !user.is_owner;

  useEffect(() => {
    if (!shouldTrack || SKIPPED_PATHS.includes(pathname)) return;
    recordVisit(pathname).catch(() => {});
  }, [pathname, shouldTrack]);

  return null;
}
