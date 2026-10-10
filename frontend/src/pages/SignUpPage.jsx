import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthShell, { GoogleButton } from '../components/AuthShell';
import { Alert, Button, Field, Input } from '../components/ui';
import { cx } from '../lib/cx';
import { API_URL, request } from '../lib/api';
import { saveSession } from '../lib/auth';

function strength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score);
}
const STRENGTH_LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', agree: false });
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name] || errors.general) setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email address';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Use at least 8 characters';
    if (!formData.agree) e.agree = 'Please accept the terms to continue';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      await request(API_URL, '/auth/register', {
        method: 'POST',
        body: { email: formData.email, password: formData.password, full_name: formData.name.trim(), youtube_channel_id: null },
      });
      // Sign straight in rather than making the user re-enter credentials
      try {
        const session = await request(API_URL, '/auth/login', {
          method: 'POST',
          body: { email: formData.email, password: formData.password },
        });
        finish({ ...session, user: { name: formData.name.trim(), ...session.user } });
      } catch {
        navigate('/login', { state: { email: formData.email } });
      }
    } catch (err) {
      setErrors({ general: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const pwScore = strength(formData.password);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free forever. Unlimited predictions."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="font-medium text-fg hover:text-brand-300">Log in</Link></>}
    >
      <GoogleButton onCredential={handleGoogleResponse} text="signup_with" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Full name" error={errors.name}>
          {(p) => <Input {...p} name="name" autoComplete="name" value={formData.name} onChange={handleChange} placeholder="Alex Rivera" disabled={loading} invalid={!!errors.name} />}
        </Field>

        <Field label="Email" error={errors.email}>
          {(p) => <Input {...p} name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" disabled={loading} invalid={!!errors.email} />}
        </Field>

        <Field label="Password" error={errors.password}>
          {(p) => (
            <>
              <div className="relative">
                <Input {...p} name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  value={formData.password} onChange={handleChange} placeholder="At least 8 characters" disabled={loading}
                  invalid={!!errors.password} className="pr-11" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400 hover:text-fg">
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && !errors.password && (
                <div className="mt-2 flex items-center gap-3" aria-live="polite">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={cx('h-1 flex-1 rounded-full transition-colors',
                        i < pwScore ? (pwScore >= 3 ? 'bg-success-500' : pwScore === 2 ? 'bg-warning-500' : 'bg-brand-500') : 'bg-ov/10')} />
                    ))}
                  </div>
                  <span className="w-16 text-right text-xs text-ink-300">{STRENGTH_LABELS[pwScore]}</span>
                </div>
              )}
            </>
          )}
        </Field>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-300">
            <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-ov/20 bg-ink-850 accent-brand-500" />
            <span>
              I agree to the <Link to="/terms" className="text-fg underline-offset-2 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-fg underline-offset-2 hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {errors.agree && <p className="mt-1.5 text-xs text-brand-300">{errors.agree}</p>}
        </div>

        {errors.general && <Alert>{errors.general}</Alert>}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignUpPage;
