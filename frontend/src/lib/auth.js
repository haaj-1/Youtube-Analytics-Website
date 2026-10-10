import { useSyncExternalStore } from 'react';

const EVENT = 'prepost:auth';

function read() {
  try {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    return token ? { token, user: raw ? JSON.parse(raw) : null } : null;
  } catch {
    return null;
  }
}

let snapshot = read();
const refresh = () => { snapshot = read(); };

function subscribe(callback) {
  const handler = () => { refresh(); callback(); };
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler); // other tabs
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user ?? {}));
  window.dispatchEvent(new Event(EVENT));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event(EVENT));
}

/** Reactive auth state shared across every component. */
export function useAuth() {
  const session = useSyncExternalStore(subscribe, () => snapshot);
  return {
    isLoggedIn: !!session,
    user: session?.user ?? null,
    displayName: session?.user?.name || session?.user?.full_name || session?.user?.email || 'Creator',
  };
}
