// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store JWT token
      localStorage.setItem('token', 'demo-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: formData.email.split('@')[0]
      }));
      
      // Navigate to home
      navigate('/');
      
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      localStorage.setItem('token', 'google-oauth-demo-token');
      localStorage.setItem('user', JSON.stringify({
        email: 'user@example.com',
        name: 'Google User'
      }));
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="flex flex-1 items-center justify-center p-6 bg-background-light min-h-screen">
      <div className="w-full max-w-[440px] bg-white border border-[#e1e4dd] rounded-2xl shadow-lg shadow-gray-200/50 p-10 flex flex-col items-center">
        
        {/* Lock Icon */}
        <div className="mb-6">
          <div className="size-12 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center">
            <FiLock className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-slate-900 tracking-tight text-[28px] font-bold leading-tight text-center pb-2">
          Sign in to Analytics
        </h1>
        <p className="text-slate-600 text-sm font-normal leading-normal pb-8 text-center">
          Secure authentication for ML insights
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 border-2 border-blue-500 hover:bg-blue-500/5 transition-colors rounded-full flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-slate-900 font-semibold text-sm">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="relative w-full flex items-center mb-6">
          <div className="flex-grow border-t border-[#e1e4dd]"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            or
          </span>
          <div className="flex-grow border-t border-[#e1e4dd]"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold px-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 rounded-full border ${
                errors.email ? 'border-red-300' : 'border-[#e1e4dd]'
              } bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 px-6 text-sm placeholder:text-slate-400 outline-none transition-all`}
              placeholder="name@company.com"
              type="email"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs px-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-purple-600 hover:opacity-80 transition-opacity"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className={`w-full h-12 rounded-full border ${
                  errors.password ? 'border-red-300' : 'border-[#e1e4dd]'
                } bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 px-6 text-sm placeholder:text-slate-400 outline-none transition-all pr-12`}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs px-1">{errors.password}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-bold text-sm rounded-full transition-all shadow-md shadow-blue-500/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                LOGGING IN...
              </div>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-dashed border-[#e1e4dd] w-full flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-xs">✓</span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
            Secured with JWT Encryption
          </p>
        </div>
      </div>
    </main>
  );
}