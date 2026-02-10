// src/components/GreenSidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiMessageSquare, 
  FiClock,
  FiHome,
  FiInfo,
  FiLogIn,
  FiUserPlus
} from 'react-icons/fi';

export default function GreenSidebar({ isChrome = false }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Items that should use compact styling so the sidebar doesn't need to scroll
  const compactItems = ['About', 'Login', 'Sign Up'];

  const navItems = [
    {
      title: "Tools",
      type: "heading"
    },
    {
      title: "Video Performance Predictor",
      path: "/post-performance",
      icon: <FiBarChart2 className="w-5 h-5" />,
      description: "Predict YouTube engagement"
    },
    {
      title: "Predictive Accuracy",
      path: "/predictive-accuracy",
      icon: <FiTrendingUp className="w-5 h-5" />,
      description: "Track model performance"
    },
    {
      title: "NLP Caption Optimizer",
      path: "/nlp-caption",
      icon: <FiMessageSquare className="w-5 h-5" />,
      description: "Optimize captions with AI"
    },
    {
      title: "Performance History",
      path: "/performance-history",
      icon: <FiClock className="w-5 h-5" />,
      description: "View historical analytics"
    },
    {
      title: "Other",
      type: "heading"
    },
    {
      title: "About",
      path: "/about",
      icon: <FiInfo className="w-5 h-5" />
    },
    {
      title: "Login",
      path: "/login",
      icon: <FiLogIn className="w-5 h-5" />
    },
    {
      title: "Sign Up",
      path: "/signup",
      icon: <FiUserPlus className="w-5 h-5" />
    }
  ];

  return (
    <aside 
      className={`${isChrome ? '' : 'fixed left-0'} bg-gradient-to-b from-red-900 to-red-800 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} 
      style={{
        overflow: 'hidden', 
        zIndex: isChrome ? 1 : 300, 
        position: isChrome ? 'sticky' : 'fixed', 
        top: 0, 
        bottom: 0, 
        height: '100vh',
        flexShrink: 0,
        alignSelf: isChrome ? 'flex-start' : 'auto'
      }}
    >
      <div className={`${isChrome ? 'p-4' : 'p-6'} h-full flex flex-col`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 ${isChrome ? 'mb-4' : 'mb-8'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-xl">PrePost</span>
              <span className="text-xs text-red-300 -mt-1">Analytics</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 ${isChrome ? 'top-4' : 'top-6'} w-6 h-6 bg-red-700 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors`}
        >
          {isCollapsed ? '→' : '←'}
        </button>

        {/* Navigation */}
        <div className={`w-full ${isChrome ? 'flex-1 overflow-hidden' : ''}`}>
          <nav className={isChrome ? 'space-y-1' : 'space-y-2'}>
            {navItems.map((item, index) => {
              if (item.type === 'heading') {
                return !isCollapsed && (
                  <div key={index} className={isChrome ? 'pt-3 pb-1' : 'pt-4'}>
                    <h3 className={`text-xs font-semibold text-red-300 uppercase tracking-wider ${isChrome ? 'px-2' : 'px-3'}`}>
                      {item.title}
                    </h3>
                  </div>
                );
              }

              const isActive = location.pathname === item.path || 
                              (item.path === '/' && location.pathname === '/');
              
              const isCompact = isChrome && compactItems.includes(item.title);

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center ${isChrome ? 'gap-2 p-2 rounded-lg' : 'gap-3 p-3 rounded-xl'} transition-all ${
                    isActive 
                      ? 'bg-red-700 text-white' 
                      : 'hover:bg-red-700/50 text-red-100'
                  }`}
                  title={isCollapsed ? item.title : ''}
                >
                  <span className={`${isActive ? 'text-red-300' : 'text-red-400'} ${isChrome ? 'text-sm' : ''}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className={`font-medium ${isChrome ? 'text-sm' : ''}`}>{item.title}</div>
                      {item.description && !isCompact && (
                        <div className="text-xs text-red-300 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Stats (Only when expanded) */}
        {!isCollapsed && (
          <div className={`${isChrome ? 'mt-3 p-3 rounded-lg' : 'mt-6 p-4 rounded-xl'} bg-red-800/50 ${isChrome ? 'flex-shrink-0' : ''}`}>
            <div className={`text-xs text-red-300 ${isChrome ? 'mb-1.5' : 'mb-2'}`}>Quick Stats</div>
            <div className={isChrome ? 'space-y-1' : 'space-y-2'}>
              <div className={`flex justify-between ${isChrome ? 'text-xs' : 'text-sm'}`}>
                <span className="text-red-200">Accuracy</span>
                <span className="font-bold text-red-300">86.4%</span>
              </div>
              <div className={`flex justify-between ${isChrome ? 'text-xs' : 'text-sm'}`}>
                <span className="text-red-200">Posts Analyzed</span>
                <span className="font-bold text-red-300">2.4M</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}