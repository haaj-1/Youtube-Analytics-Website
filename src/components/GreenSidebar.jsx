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

export default function GreenSidebar() {
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
      title: "Post Performance Predictor",
      path: "/post-performance",
      icon: <FiBarChart2 className="w-5 h-5" />,
      description: "Predict Instagram engagement"
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
    <aside className={`fixed inset-y-0 left-0 top-0 bg-gradient-to-b from-green-900 to-green-800 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} z-[9999]`}> 
      <div className="p-6 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-xl">PrePost</span>
              <span className="text-xs text-green-300 -mt-1">Analytics</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-green-700 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>

        {/* Navigation */}
        <div className="w-full">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              if (item.type === 'heading') {
                return !isCollapsed && (
                  <div key={index} className="pt-4">
                    <h3 className="text-xs font-semibold text-green-300 uppercase tracking-wider px-3">
                      {item.title}
                    </h3>
                  </div>
                );
              }

              const isActive = location.pathname === item.path || 
                              (item.path === '/' && location.pathname === '/');

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'hover:bg-green-700/50 text-green-100'
                  }`}
                  title={isCollapsed ? item.title : ''}
                >
                  <span className={`${isActive ? 'text-green-300' : 'text-green-400'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-green-300 mt-0.5">
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
          <div className="mt-6 p-4 bg-green-800/50 rounded-xl">
            <div className="text-xs text-green-300 mb-2">Quick Stats</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-200">Accuracy</span>
                <span className="font-bold text-green-300">86.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-200">Posts Analyzed</span>
                <span className="font-bold text-green-300">2.4M</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}