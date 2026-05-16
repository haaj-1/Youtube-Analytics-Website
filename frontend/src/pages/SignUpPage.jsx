import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
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
            { theme: 'filled_black', size: 'large', width: 360, text: 'continue_with' }
          );
        } catch (error) { console.error('Error initializing Google:', error); }
      }
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5000'}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Google sign-in failed');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setErrors({ general: error.message });
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5000'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, full_name: formData.name, youtube_channel_id: null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: formData.name, email: data.email }));
      navigate('/login');
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally { setLoading(false); }
  };

  const inputStyle = (hasError) => ({
    background: 'rgba(255,255,255,0.04)',
    border: hasError ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)'
  });

  const inputClass = "w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all";

  return (
    <main className="flex flex-1 items-center justify-center p-6 min-h-screen relative overflow-hidden" style={{ background: '#080b12' }}>
      {/* Background orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)', filter: 'blur(40px)'
      }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(40px)'
      }} />

      <div className="w-full max-w-[420px] rounded-2xl p-8 flex flex-col items-center relative" style={{
        background: '#0f1623',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Icon */}
        <div className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center" style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)'
        }}>
          <FiUser className="w-5 h-5 text-red-400" />
        </div>

        <h1 className="text-white text-2xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-slate-500 text-sm text-center mb-7">Join creators using PrePost Analytics</p>

        <div id="googleSignInButton" className="w-full flex justify-center mb-5" />

        <div className="relative w-full flex items-center mb-5">
          <div className="flex-grow" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
          <span className="mx-4 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">or</span>
          <div className="flex-grow" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe"
                disabled={loading} className={`${inputClass} pl-10`} style={inputStyle(errors.name)} />
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            </div>
            {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</label>
            <div className="relative">
              <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="name@company.com"
                disabled={loading} className={`${inputClass} pl-10`} style={inputStyle(errors.email)} />
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            </div>
            {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input name="password" value={formData.password} onChange={handleChange}
                type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                disabled={loading} className={`${inputClass} pl-10 pr-10`} style={inputStyle(errors.password)} />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                disabled={loading} className={`${inputClass} pl-10 pr-10`} style={inputStyle(errors.confirmPassword)} />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
          </div>

          {errors.general && (
            <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {errors.general}
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" required
              className="mt-0.5 w-4 h-4 rounded accent-red-500" />
            <label htmlFor="terms" className="text-sm text-slate-500">
              I agree to the{' '}
              <Link to="/terms" className="text-red-400 hover:text-red-300">Terms</Link>{' '}and{' '}
              <Link to="/privacy" className="text-red-400 hover:text-red-300">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-11 mt-2 rounded-lg font-bold text-sm text-white uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 4px 20px rgba(220,38,38,0.25)' }}>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </div>
            ) : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-slate-500 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign in</Link>
        </p>

        <div className="mt-6 pt-5 w-full flex items-center justify-center gap-2" style={{ borderTop: '1px dashed rgba(255,255,255,0.06)' }}>
          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <span className="text-green-400 text-[10px]">✓</span>
          </div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">JWT Encrypted</p>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
