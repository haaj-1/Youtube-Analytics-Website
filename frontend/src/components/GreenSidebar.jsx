import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBarChart2, FiTrendingUp, FiClock,
  FiInfo, FiLogIn, FiUserPlus,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { title: 'Tools', type: 'heading' },
  { title: 'Video Predictor', path: '/post-performance', icon: <FiBarChart2 className="w-4 h-4" />, description: 'Predict engagement' },
  { title: 'Model Accuracy', path: '/predictive-accuracy', icon: <FiTrendingUp className="w-4 h-4" />, description: 'Track performance' },
  { title: 'History', path: '/performance-history', icon: <FiClock className="w-4 h-4" />, description: 'Historical analytics' },
  { title: 'Other', type: 'heading' },
  { title: 'About', path: '/about', icon: <FiInfo className="w-4 h-4" /> },
  { title: 'Login', path: '/login', icon: <FiLogIn className="w-4 h-4" /> },
  { title: 'Sign Up', path: '/signup', icon: <FiUserPlus className="w-4 h-4" /> },
];

export default function GreenSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 min-h-screen h-full transition-all duration-300 z-[9999] ${isCollapsed ? 'w-16' : 'w-64'}`}
      style={{ background: 'linear-gradient(180deg, #131b2e 0%, #0f1828 100%)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />

      <div className="p-5 h-full flex flex-col relative">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-7 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
            <span className="text-white font-bold text-base">P</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg leading-tight">PrePost</span>
              <span className="text-[10px] text-red-400 font-mono tracking-wider">ANALYTICS</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {isCollapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
        </button>

        {/* Nav */}
        <div className="flex-1 min-h-0 mb-3">
          <nav className="space-y-0.5">
            {navItems.map((item, index) => {
              if (item.type === 'heading') {
                return !isCollapsed && (
                  <div key={index} className="pt-4 pb-1">
                    <h3 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3">{item.title}</h3>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  title={isCollapsed ? item.title : ''}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group border ${
                    isActive
                      ? 'bg-red-500/10 border-red-500/20 text-white'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border-transparent'
                  }`}
                >
                  <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-red-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-tight">{item.title}</div>
                      {item.description && (
                        <div className="text-xs mt-0.5 text-slate-600 leading-tight">{item.description}</div>
                      )}
                    </div>
                  )}
                  {isActive && !isCollapsed && <div className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Stats */}
        {!isCollapsed && (
          <div className="p-4 rounded-xl flex-shrink-0" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-mono">Quick Stats</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Accuracy</span>
                <span className="font-bold text-red-400 font-mono">95.6%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Videos</span>
                <span className="font-bold text-red-400 font-mono">52K</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
