import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2, FiTrendingUp, FiClock, FiInfo, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function GreenSidebar({ isChrome = false }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { title: 'Tools', type: 'heading' },
    { title: 'Video Performance Predictor', path: '/post-performance', icon: <FiBarChart2 className="w-5 h-5" />, description: 'Predict YouTube engagement' },
    { title: 'Predictive Accuracy',         path: '/predictive-accuracy', icon: <FiTrendingUp className="w-5 h-5" />, description: 'Track model performance' },
    { title: 'Performance History',         path: '/performance-history', icon: <FiClock className="w-5 h-5" />, description: 'View historical analytics' },
    { title: 'Other', type: 'heading' },
    { title: 'About',   path: '/about',   icon: <FiInfo className="w-5 h-5" /> },
    { title: 'Login',   path: '/login',   icon: <FiLogIn className="w-5 h-5" /> },
    { title: 'Sign Up', path: '/signup',  icon: <FiUserPlus className="w-5 h-5" /> },
  ];

  return (
    <aside className={`fixed top-0 bottom-0 left-0 bg-gradient-to-b from-red-900 to-red-800 text-white min-h-screen h-full transition-all duration-300 ${isCollapsed ? 'w-16' : isChrome ? 'w-56' : 'w-64'} z-[9999]`}>
      <div className={`${isChrome ? 'p-4' : 'p-6'} h-full flex flex-col overflow-y-auto`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 ${isChrome ? 'mb-4' : 'mb-8'} flex-shrink-0`}>
          <div className={`${isChrome ? 'w-9 h-9 rounded-lg' : 'w-10 h-10 rounded-xl'} bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0`}>
            <span className={`text-white font-bold ${isChrome ? 'text-base' : 'text-lg'}`}>P</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className={`font-bold ${isChrome ? 'text-lg' : 'text-xl'}`}>PrePost</span>
              <span className={`text-xs text-red-300 ${isChrome ? '-mt-0.5' : '-mt-1'}`}>Analytics</span>
            </div>
          )}
        </div>

        <button onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 ${isChrome ? 'top-4' : 'top-6'} w-6 h-6 bg-red-700 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10`}>
          {isCollapsed ? '→' : '←'}
        </button>

        <div className="flex-1 min-h-0 mb-3">
          <nav className={isChrome ? 'space-y-1' : 'space-y-2'}>
            {navItems.map((item, index) => {
              if (item.type === 'heading') {
                return !isCollapsed && (
                  <div key={index} className={isChrome ? 'pt-2.5 pb-1' : 'pt-4'}>
                    <h3 className={`text-xs font-semibold text-red-300 uppercase tracking-wider ${isChrome ? 'px-2' : 'px-3'}`}>{item.title}</h3>
                  </div>
                );
              }
              const isActive = location.pathname === item.path;
              return (
                <Link key={index} to={item.path}
                  className={`flex items-center ${isChrome ? 'gap-2.5 p-2.5 rounded-lg' : 'gap-3 p-3 rounded-xl'} transition-all ${isActive ? 'bg-red-700 text-white' : 'hover:bg-red-700/50 text-red-100'}`}
                  title={isCollapsed ? item.title : ''}>
                  <span className={isActive ? 'text-red-300' : 'text-red-400'}>{item.icon}</span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${isChrome ? 'text-sm leading-snug' : 'text-base leading-tight'}`}>{item.title}</div>
                      {item.description && <div className={`${isChrome ? 'text-xs mt-1 leading-snug' : 'text-sm mt-0.5 leading-tight'} text-red-300`}>{item.description}</div>}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {!isCollapsed && (
          <div className={`${isChrome ? 'p-3 rounded-lg' : 'p-4 rounded-xl'} bg-red-800/50 flex-shrink-0`}>
            <div className="text-xs text-red-300 mb-2">Quick Stats</div>
            <div className={isChrome ? 'space-y-1' : 'space-y-2'}>
              <div className={`flex justify-between ${isChrome ? 'text-xs' : 'text-sm'}`}>
                <span className="text-red-200">Accuracy</span><span className="font-bold text-red-300">95.6%</span>
              </div>
              <div className={`flex justify-between ${isChrome ? 'text-xs' : 'text-sm'}`}>
                <span className="text-red-200">Videos Analyzed</span><span className="font-bold text-red-300">52K</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
