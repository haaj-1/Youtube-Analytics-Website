import { useId } from 'react';
import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-8 w-8' }) {
  // Unique per instance: a duplicate id inside a hidden element breaks the gradient
  const gradientId = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6464" />
          <stop offset="1" stopColor="#c81414" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path d="M8 21.5 13 16l3.5 3L24 10.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="10.5" r="2.2" fill="#fff" />
    </svg>
  );
}

export default function Logo({ collapsed = false, to = '/' }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5 rounded-lg" aria-label="PrePost Analytics home">
      <LogoMark className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
      {!collapsed && (
        <span className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold tracking-tight text-fg">PrePost</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">Analytics</span>
        </span>
      )}
    </Link>
  );
}
