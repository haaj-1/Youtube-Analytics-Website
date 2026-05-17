import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBarChart2, FiTrendingUp, FiClock,
  FiInfo, FiLogIn, FiUserPlus,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { title: 'Tools', type: 'heading' },
  { title: 'Video Performance Predictor', path: '/post-performance', icon: <FiBarChart2 className="w-4 h-4" />, description: 'Predict YouTube engagement' },
  { title: 'Predictive Accuracy', path: '/predictive-accuracy', icon: <FiTrendingUp className="w-4 h-4" />, description: 'Track model performance' },
  { title: 'Performance History', path: '/performance-history', icon: <FiClock className="w-4 h-4" />, description: 'View historical analytics' },
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
      style={{ background: '#ffffff', borderRight: '1px solid #e5e7eb' }}
    >
      <div className="p-5 h-full flex flex-col relative">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-7 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-base">P</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg leading-tight">PrePost</span>
              <span className="text-[10px] text-red-500 font-mono tracking-wider">ANALYTICS</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-200"
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
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3">{item.title}</h3>
                  </div>
                );
              }

              const isActive = location.pathname === item.path ||
                (item.path === '/post-performance' && location.pathname === '/');

              return (
                <Link
                  key={index}
                  to={item.path}
                  title={isCollapsed ? item.title : ''}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #dc2626, #b91c1c)' } : {}}
                >
                  <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold leading-tight ${isActive ? 'text-white' : ''}`}>{item.title}</div>
                      {item.description && (
                        <div className={`text-xs mt-0.5 leading-tight ${isActive ? 'text-red-100' : 'text-gray-400'}`}>{item.description}</div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Stats */}
        {!isCollapsed && (
          <div className="p-4 rounded-xl flex-shrink-0 bg-red-50 border border-red-100">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-mono">Quick Stats</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Accuracy</span>
                <span className="font-bold text-red-600 font-mono">95.6%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Videos Analyzed</span>
                <span className="font-bold text-red-600 font-mono">52K</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
