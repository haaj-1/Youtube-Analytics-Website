import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiActivity, FiBarChart2, FiCpu, FiInfo, FiLogIn, FiLogOut, FiMenu,
  FiChevronsLeft, FiChevronsRight, FiX, FiGithub,
} from 'react-icons/fi';
import Logo from './Logo';
import { Button } from './ui';
import { cx } from '../lib/cx';
import { useAuth, clearSession } from '../lib/auth';

const REPO_URL = 'https://github.com/haaj-1/Youtube-Analytics-Website';

const TOOLS = [
  { to: '/post-performance', label: 'Performance Predictor', icon: FiActivity, match: ['/', '/post-performance'] },
  { to: '/performance-history', label: 'Channel Analytics', icon: FiBarChart2 },
  { to: '/predictive-accuracy', label: 'Model Transparency', icon: FiCpu },
];

function useCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar-collapsed') === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0'); } catch { /* ignore */ }
  }, [collapsed]);
  return [collapsed, setCollapsed];
}

function SidebarLink({ item, collapsed, pathname }) {
  const Icon = item.icon;
  const active = item.match ? item.match.includes(pathname) : pathname === item.to;
  return (
    <Link
      to={item.to}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
        active ? 'bg-white/[0.07] text-white' : 'text-ink-300 hover:bg-white/[0.04] hover:text-white',
        collapsed && 'justify-center px-0',
      )}
    >
      {active && <span className="absolute -left-3 top-2 bottom-2 w-0.5 rounded-full bg-brand-500" />}
      <Icon className={cx('h-[18px] w-[18px] shrink-0', active ? 'text-brand-400' : 'text-ink-400 group-hover:text-ink-200')} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function AccountBlock({ collapsed }) {
  const { isLoggedIn, displayName } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return collapsed ? (
      <Link to="/login" title="Sign in" className="flex h-10 items-center justify-center rounded-xl text-ink-300 hover:bg-white/[0.04] hover:text-white">
        <FiLogIn className="h-[18px] w-[18px]" />
      </Link>
    ) : (
      <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-4">
        <p className="text-sm font-medium text-white">Unlimited predictions</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-300">Guests get 5 per day. A free account removes the limit.</p>
        <div className="mt-3 flex gap-2">
          <Button to="/signup" size="sm" className="flex-1">Sign up</Button>
          <Button to="/login" size="sm" variant="secondary" className="flex-1">Log in</Button>
        </div>
      </div>
    );
  }

  const initials = displayName.split(/[\s@]/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
  const logout = () => { clearSession(); navigate('/'); };
  return (
    <div className={cx('flex items-center gap-3 rounded-xl', collapsed ? 'flex-col' : 'border border-white/[0.07] bg-white/[0.02] p-2.5')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-semibold text-white">
        {initials || 'U'}
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{displayName}</p>
          <p className="text-[11px] text-ink-400">Unlimited plan</p>
        </div>
      )}
      <button onClick={logout} title="Log out" aria-label="Log out" className="rounded-lg p-2 text-ink-300 hover:bg-white/[0.06] hover:text-white">
        <FiLogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

function SidebarContent({ collapsed, onToggle, pathname }) {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <div className={cx('mb-6 flex items-center px-2', collapsed ? 'justify-center px-0' : 'justify-between')}>
        <Logo collapsed={collapsed} />
        {onToggle && !collapsed && (
          <button onClick={onToggle} aria-label="Collapse sidebar" className="hidden rounded-lg p-1.5 text-ink-400 hover:bg-white/[0.06] hover:text-white lg:block">
            <FiChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {!collapsed && <p className="eyebrow mb-2 px-3">Tools</p>}
      <nav className="space-y-1" aria-label="Tools">
        {TOOLS.map((item) => <SidebarLink key={item.to} item={item} collapsed={collapsed} pathname={pathname} />)}
      </nav>

      <div className="my-5 h-px bg-white/[0.06]" />
      <nav className="space-y-1" aria-label="Resources">
        <SidebarLink item={{ to: '/about', label: 'About', icon: FiInfo }} collapsed={collapsed} pathname={pathname} />
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          title={collapsed ? 'Source on GitHub' : undefined}
          className={cx('flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-300 hover:bg-white/[0.04] hover:text-white', collapsed && 'justify-center px-0')}
        >
          <FiGithub className="h-[18px] w-[18px] shrink-0 text-ink-400" />
          {!collapsed && 'Source code'}
        </a>
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        {!collapsed && (
          <div className="grid grid-cols-2 gap-2 px-1">
            <div>
              <p className="font-mono text-sm font-semibold text-white">95.6%</p>
              <p className="text-[11px] text-ink-400">R² on test set</p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-white">51.9K</p>
              <p className="text-[11px] text-ink-400">training videos</p>
            </div>
          </div>
        )}
        <AccountBlock collapsed={collapsed} />
        {onToggle && collapsed && (
          <button onClick={onToggle} aria-label="Expand sidebar" className="hidden w-full items-center justify-center rounded-xl py-2 text-ink-400 hover:bg-white/[0.06] hover:text-white lg:flex">
            <FiChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="mt-16 flex flex-col gap-3 border-t border-white/[0.06] py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} PrePost Analytics · Predictions are estimates, not guarantees.</p>
      <div className="flex gap-5">
        <Link to="/privacy" className="hover:text-white">Privacy</Link>
        <Link to="/terms" className="hover:text-white">Terms</Link>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
      </div>
    </footer>
  );
}

/** Layout for the tool pages: sidebar on desktop, drawer on mobile. */
export function AppShell() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useCollapsed();
  // Remember which page the drawer was opened on so navigating closes it
  const [drawerPath, setDrawerPath] = useState(null);
  const drawerOpen = drawerPath === pathname;
  const setDrawerOpen = (isOpen) => setDrawerPath(isOpen ? pathname : null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === 'Escape' && setDrawerPath(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-white/[0.06] bg-ink-950/95 backdrop-blur transition-[width] duration-200 lg:block',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-ink-950/85 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-ink-200 hover:bg-white/[0.06]">
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-fade-up border-r border-white/[0.06] bg-ink-950">
            <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-ink-300 hover:bg-white/[0.06] hover:text-white">
              <FiX className="h-5 w-5" />
            </button>
            <SidebarContent collapsed={false} pathname={pathname} />
          </aside>
        </div>
      )}

      <div className={cx('transition-[padding] duration-200', collapsed ? 'lg:pl-[72px]' : 'lg:pl-64')}>
        <main className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-10 lg:pt-10">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-72 grid-bg opacity-60" aria-hidden="true" />
          <div className="relative">
            <Outlet />
          </div>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}

/** Layout for marketing, auth and legal pages. */
export function PublicLayout() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/post-performance', label: 'Predictor' },
    { to: '/performance-history', label: 'Analytics' },
    { to: '/predictive-accuracy', label: 'Model' },
    { to: '/about', label: 'About' },
  ];
  const linkCls = ({ isActive }) => cx('rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'text-white' : 'text-ink-300 hover:text-white');

  return (
    <div className="flex min-h-screen flex-col">
      <header className={cx('sticky top-0 z-40 border-b transition-colors', scrolled || open ? 'border-white/[0.06] bg-ink-950/85 backdrop-blur' : 'border-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>)}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {isLoggedIn ? (
              <Button to="/post-performance" size="sm">Open app</Button>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">Log in</Button>
                <Button to="/signup" size="sm">Get started</Button>
              </>
            )}
          </div>
          <button onClick={() => setOpenPath(open ? null : pathname)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className="rounded-lg p-2 text-ink-200 hover:bg-white/[0.06] md:hidden">
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/[0.06] px-4 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((l) => <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>)}
            </nav>
            {!isLoggedIn && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button to="/login" variant="secondary" size="sm">Log in</Button>
                <Button to="/signup" size="sm">Get started</Button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Forecast how a YouTube video will perform before you hit publish.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Product</p>
            <ul className="space-y-2 text-sm text-ink-300">
              {links.slice(0, 3).map((l) => <li key={l.to}><Link to={l.to} className="hover:text-white">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Company</p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/privacy#contact" className="hover:text-white">Contact</Link></li>
              <li><a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-white/[0.06] px-4 py-6 text-xs text-ink-400 sm:px-6 lg:px-10">
          © {new Date().getFullYear()} PrePost Analytics. Not affiliated with YouTube or Google.
        </div>
      </footer>
    </div>
  );
}
