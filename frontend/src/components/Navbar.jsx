import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      try { setUser(JSON.parse(userData)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false); setUser(null); setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-4 px-10" style={{ zIndex: 200 }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-slate-900">PrePost</span>
            <span className="text-xs text-red-600 -mt-1">Analytics</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-slate-600 hover:text-red-600 font-medium transition-colors">About</Link>
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-slate-700">
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.name || user?.email || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors">
                <FiLogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-red-600 font-medium transition-colors">Log In</Link>
              <Link to="/signup" className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow">Get Started</Link>
            </>
          )}
        </nav>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-600 hover:text-slate-900">
          {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col gap-4">
            <Link to="/about" className="text-slate-600 hover:text-red-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 font-medium py-2 text-left">Log Out</button>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-red-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2.5 rounded-lg font-medium" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
