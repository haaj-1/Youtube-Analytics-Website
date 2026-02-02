// src/components/Navbar.jsx - Simplified version
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../assets/prepost-logo.svg';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-8 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logo} alt="PrePost logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-900">PrePost</span>
              <span className="text-xs text-green-600 -mt-1">Analytics</span>
            </div>
          </Link>

          {/* Desktop Navigation - Simplified */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-slate-600 hover:text-green-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/login" className="text-slate-600 hover:text-green-600 font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow">
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Simplified */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/about" className="text-slate-600 hover:text-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                <Link to="/login" className="text-slate-600 hover:text-green-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}