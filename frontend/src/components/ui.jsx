import { forwardRef, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiX } from 'react-icons/fi';

import { cx } from '../lib/cx';
export function Card({ className, children, ...props }) {
  return <div className={cx('panel', className)} {...props}>{children}</div>;
}

export function CardHeader({ title, description, icon, action, className }) {
  return (
    <div className={cx('flex items-start gap-3 border-b border-white/[0.06] px-5 py-4', className)}>
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ink-200">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_24px_-8px_rgba(255,59,59,0.6)]',
  secondary: 'border border-white/10 bg-white/[0.04] text-ink-50 hover:bg-white/[0.08] hover:border-white/20',
  ghost: 'text-ink-200 hover:text-white hover:bg-white/[0.06]',
  light: 'bg-white text-ink-950 hover:bg-ink-100',
};
const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
};

export function Button({ as, to, variant = 'primary', size = 'md', loading, className, children, ...props }) {
  const classes = cx(
    'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]',
    variants[variant],
    sizes[size],
    className,
  );
  const content = (
    <>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </>
  );
  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  const Comp = as || 'button';
  return (
    <Comp className={classes} {...props} disabled={loading || props.disabled}>
      {content}
    </Comp>
  );
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx('inline-block animate-spin rounded-full border-2 border-current border-t-transparent opacity-80', className)}
    />
  );
}

export function Field({ label, hint, error, children, id: idProp, className }) {
  const autoId = useId();
  const id = idProp || autoId;
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      {typeof children === 'function' ? children({ id, 'aria-invalid': !!error || undefined }) : children}
      {error ? (
        <p className="mt-1.5 text-xs text-brand-300">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cx('input', invalid && 'border-brand-500/60', className)}
      {...props}
    />
  );
});

export function Select({ className, children, ...props }) {
  return (
    <select className={cx('input cursor-pointer appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9', className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a919e' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
      {...props}>
      {children}
    </select>
  );
}

const badgeTones = {
  neutral: 'border-white/10 bg-white/[0.04] text-ink-200',
  brand: 'border-brand-500/30 bg-brand-500/10 text-brand-300',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
};
export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export function Alert({ tone = 'error', children, onDismiss }) {
  const tones = {
    error: 'border-brand-500/30 bg-brand-500/[0.08] text-brand-200',
    warning: 'border-amber-500/30 bg-amber-500/[0.08] text-amber-200',
    info: 'border-white/10 bg-white/[0.04] text-ink-200',
  };
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm', tones[tone])}>
      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" className="-m-1 rounded p-1 opacity-70 hover:opacity-100">
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function Stat({ label, value, sub, accent, className }) {
  return (
    <div className={cx('rounded-xl border border-white/[0.07] bg-white/[0.02] p-4', className)}>
      <p className="text-xs text-ink-300">{label}</p>
      <p className={cx('mt-1.5 font-mono text-2xl font-semibold tabular-nums', accent ? 'text-brand-400' : 'text-white')}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" />{eyebrow}</p>}
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-sm leading-relaxed text-ink-300">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-ink-200">
          {icon}
        </div>
      )}
      <p className="font-medium text-white">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-300">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

/** Horizontal bar used for simple distributions. */
export function Bar({ value, max = 100, className, tone = 'brand' }) {
  const pct = max ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const tones = {
    brand: 'from-brand-600 to-brand-400',
    neutral: 'from-ink-400 to-ink-200',
    success: 'from-emerald-600 to-emerald-400',
  };
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]', className)}>
      <div className={cx('h-full origin-left animate-grow-x rounded-full bg-gradient-to-r', tones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({ open, onClose, labelledBy, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="panel relative w-full max-w-md animate-fade-up bg-ink-900 p-7">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-300 hover:bg-white/5 hover:text-white">
          <FiX className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
