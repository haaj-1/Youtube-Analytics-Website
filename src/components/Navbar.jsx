// src/components/Navbar.jsx - COMPLETE UPDATED VERSION
import { useState } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-8 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-900">PrePost</span>
              <span className="text-xs text-slate-500 -mt-1">Analytics</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors py-2">
                Tools <FiChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/post-performance" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">Post Performance Predictor</Link>
                  <Link to="/predictive-accuracy" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">Predictive Accuracy</Link>
                  <Link to="/nlp-caption" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">NLP Caption Optimizer</Link>
                  <Link to="/performance-history" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">Performance History</Link>
                </div>
              </div>
            </div>
            
            <Link to="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 animate-fade-in">
            <div className="flex flex-col gap-4">
              <div className="font-medium text-slate-900 mb-2">Tools</div>
              <Link to="/post-performance" className="text-slate-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Post Performance Predictor</Link>
              <Link to="/predictive-accuracy" className="text-slate-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Predictive Accuracy</Link>
              <Link to="/nlp-caption" className="text-slate-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>NLP Caption Optimizer</Link>
              <Link to="/performance-history" className="text-slate-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Performance History</Link>
              <Link to="/about" className="text-slate-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow" onClick={() => setIsMenuOpen(false)}>
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