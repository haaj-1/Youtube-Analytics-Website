import { useEffect, useRef } from 'react';
import { FiActivity, FiBarChart2, FiEdit3, FiShield } from 'react-icons/fi';
import { LogoMark } from './Logo';

const GSI_SRC = 'https://accounts.google.com/gsi/client';
let gsiPromise;

function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve();
  gsiPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = GSI_SRC;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => { gsiPromise = null; reject(new Error('Google sign-in failed to load')); };
    document.head.appendChild(s);
  });
  return gsiPromise;
}

/** Renders Google's "Continue with Google" button. Hidden if no client ID is configured. */
export function GoogleButton({ onCredential, text = 'continue_with' }) {
  const ref = useRef(null);
  const cb = useRef(onCredential);
  useEffect(() => { cb.current = onCredential; });
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    loadGsi()
      .then(() => {
        if (cancelled || !ref.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (res) => cb.current(res),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(ref.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text,
          width: Math.min(ref.current.offsetWidth || 360, 400),
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [clientId, text]);

  if (!clientId) return null;
  return (
    <>
      <div ref={ref} className="flex min-h-[44px] w-full justify-center" />
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs text-ink-400">or with email</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>
    </>
  );
}

const POINTS = [
  { icon: FiActivity, title: 'Forecast views before publishing', body: 'BERT + CNN + XGBoost trained on 51,888 videos.' },
  { icon: FiEdit3, title: 'Test titles in seconds', body: 'Score up to ten variations and keep the winner.' },
  { icon: FiBarChart2, title: 'Learn from any channel', body: 'Best days, hours and lengths from recent uploads.' },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-10">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />

      <section className="relative hidden lg:block">
        <p className="eyebrow mb-4 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> PrePost Analytics</p>
        <h2 className="max-w-md text-4xl font-semibold leading-tight">
          Know how a video will land <span className="text-gradient">before you upload it.</span>
        </h2>
        <ul className="mt-10 max-w-md space-y-5">
          {POINTS.map(({ icon: Icon, title: t, body }) => (
            <li key={t} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-brand-400">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t}</p>
                <p className="mt-0.5 text-sm text-ink-300">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mx-auto w-full max-w-[420px]">
        <div className="panel bg-ink-900/90 p-7 sm:p-8">
          <LogoMark className="mb-6 h-10 w-10" />
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-300">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <p className="mt-6 text-center text-sm text-ink-300">{footer}</p>}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
          <FiShield className="h-3.5 w-3.5" /> Passwords are hashed · sessions use signed JWTs
        </p>
      </section>
    </main>
  );
}
