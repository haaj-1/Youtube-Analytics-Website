import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      try { setUser(JSON.parse(userData)); } catch (e) {}
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 py-4 px-10 ${
        scrolled
          ? 'backdrop-blur-md shadow-lg shadow-black/30'
          : ''
      }`}
      style={{
        background: scrolled
          ? 'rgba(139,0,0,0.97)'
          : 'linear-gradient(135deg, #9b1c1c 0%, #7f1d1d 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 200
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
              <span className="text-white font-bold text-base">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white leading-tight">PrePost</span>
              <span className="text-[10px] text-red-400 -mt-0.5 font-mono tracking-wider">ANALYTICS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-red-100 hover:text-white font-medium text-sm transition-colors">
              About
            </Link>

            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 text-red-100 text-sm">
                  <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                    <FiUser className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>{user?.name || user?.email || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-100 hover:text-white font-medium text-sm transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-red-100 hover:text-white font-medium text-sm transition-colors">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-red-700 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-red-50 hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-red-100 hover:text-white transition-colors"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="flex flex-col gap-4">
              <Link to="/about" className="text-red-100 hover:text-white font-medium py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              {isLoggedIn ? (
                <div className="flex flex-col gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="flex items-center gap-2 text-red-100 py-2 text-sm">
                    <FiUser className="w-4 h-4" />
                    <span>{user?.name || user?.email || 'User'}</span>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-100 hover:text-white font-medium py-2 text-sm text-left">
                    <FiLogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <Link to="/login" className="text-red-100 hover:text-white font-medium py-2 text-sm" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                  <Link
                    to="/signup"
                    className="bg-white text-red-700 text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-red-50 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
