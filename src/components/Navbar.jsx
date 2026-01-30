import { useState } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-charcoal">PrePost</span>
              <span className="text-xs text-gray-500 -mt-1">Analytics</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-charcoal font-medium transition-colors">
                Platform <FiChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-charcoal">Dashboard</a>
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-charcoal">Analytics</a>
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-charcoal">Predictions</a>
                </div>
              </div>
            </div>
            
            <a href="#" className="text-gray-600 hover:text-charcoal font-medium transition-colors">About</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-gray-600 hover:text-charcoal font-medium transition-colors">
              Log In
            </a>
            <a href="/signup" className="btn-primary">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-charcoal"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-600 hover:text-charcoal font-medium py-2">Platform</a>
              <a href="#" className="text-gray-600 hover:text-charcoal font-medium py-2">Features</a>
              <a href="#" className="text-gray-600 hover:text-charcoal font-medium py-2">About</a>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <a href="/login" className="text-gray-600 hover:text-charcoal font-medium py-2">Log In</a>
                <a href="/signup" className="btn-primary text-center">Get Started</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}