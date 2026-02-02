// src/pages/SignUpPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        name: formData.name,
        email: formData.email
      }));
      
      // Navigate to home
      navigate('/');
      
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center p-6 bg-background-light min-h-screen">
      <div className="w-full max-w-[440px] bg-white border border-[#e1e4dd] rounded-2xl shadow-lg shadow-gray-200/50 p-10 flex flex-col items-center">
        
        {/* User Icon */}
        <div className="mb-6">
          <div className="size-12 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center">
            <FiUser className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-slate-900 tracking-tight text-[28px] font-bold leading-tight text-center pb-2">
          Create Account
        </h1>
        <p className="text-slate-600 text-sm font-normal leading-normal pb-8 text-center">
          Join creators using PrePost Analytics
        </p>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold px-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full h-12 rounded-full border ${
                  errors.name ? 'border-red-300' : 'border-[#e1e4dd]'
                } bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 px-6 pl-12 text-sm placeholder:text-slate-400 outline-none transition-all`}
                placeholder="John Doe"
                type="text"
                disabled={loading}
              />
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs px-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold px-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-12 rounded-full border ${
                  errors.email ? 'border-red-300' : 'border-[#e1e4dd]'
                } bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 px-6 pl-12 text-sm placeholder:text-slate-400 outline-none transition-all`}
                placeholder="name@company.com"
                type="email"
                disabled={loading}
              />
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs px-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold px-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className={`w-full h-12 rounded-full border ${
                  errors.password ? 'border-red-300' : 'border-[#e1e4dd]'
                } bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 px-6 pl-12 text-sm placeholder:text-slate-400 outline-none transition-all pr-12`}
                placeholder="••••••••"
                disabled={loading}
              />
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold px-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full h-12 rounded-full border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-[#e1e4dd]'
                } bg-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 px-6 pl-12 text-sm placeholder:text-slate-400 outline-none transition-all pr-12`}
                placeholder="••••••••"
                disabled={loading}
              />
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs px-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-bold text-sm rounded-full transition-all shadow-md shadow-blue-500/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                CREATING ACCOUNT...
              </div>
            ) : (
              'SIGN UP'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
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