import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthShell, { GoogleButton } from '../components/AuthShell';
import { Alert, Button, Field, Input } from '../components/ui';
import { API_URL, request } from '../lib/api';
import { saveSession } from '../lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: location.state?.email || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const finish = (data) => {
    saveSession(data.access_token, data.user);
    navigate(location.state?.from || '/', { replace: true });
  };

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setErrors({});
    try {
      finish(await request(API_URL, '/auth/google', { method: 'POST', body: { token: response.credential } }));
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      finish(await request(API_URL, '/auth/login', { method: 'POST', body: formData }));
    } catch (err) {
      setErrors({ general: err.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in for unlimited predictions."
      footer={<>New to PrePost? <Link to="/signup" state={location.state} className="font-medium text-fg hover:text-brand-300">Create an account</Link></>}
    >
      <GoogleButton onCredential={handleGoogleResponse} />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Email" error={errors.email}>
          {(p) => (
            <Input {...p} name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange}
              placeholder="you@example.com" disabled={loading} invalid={!!errors.email} />
          )}
        </Field>

        <Field label="Password" error={errors.password}>
          {(p) => (
            <div className="relative">
              <Input {...p} name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={loading}
                invalid={!!errors.password} className="pr-11" />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400 hover:text-fg">
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          )}
        </Field>

        {errors.general && <Alert>{errors.general}</Alert>}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  );
}
