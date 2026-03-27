// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && document.getElementById('googleSignInButton')) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          
          window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            { 
              theme: 'outline', 
              size: 'large',
              width: 400,
              text: 'continue_with'
            }
          );
        } catch (error) {
          console.error('Error initializing Google:', error);
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Google sign-in failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      // Store JWT token and user info
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Navigate to home
      navigate('/');
      
    } catch (error) {
      setErrors({ general: error.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // This function is no longer needed - Google button handles it automatically
  };

  return (
    <main className="flex flex-1 items-center justify-center p-6 bg-background-light min-h-screen">
      <div className="w-full max-w-[440px] bg-white border border-[#e1e4dd] rounded-2xl shadow-lg shadow-gray-200/50 p-10 flex flex-col items-center">
        
        {/* Lock Icon */}
        <div className="mb-6">
          <div className="size-12 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl flex items-center justify-center">
            <FiLock className="w-6 h-6 text-red-600" />
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
        <div id="googleSignInButton" className="w-full flex justify-center mb-6"></div>

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
              } bg-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 px-6 text-sm placeholder:text-slate-400 outline-none transition-all`}
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
                className="text-xs font-medium text-red-600 hover:opacity-80 transition-opacity"
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
                } bg-white focus:ring-2 focus:ring-red-500/40 focus:border-red-500 px-6 text-sm placeholder:text-slate-400 outline-none transition-all pr-12`}
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
            className="w-full h-12 mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 text-white font-bold text-sm rounded-full transition-all shadow-md shadow-red-500/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Link to="/signup" className="text-red-600 hover:text-red-700 font-medium">
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