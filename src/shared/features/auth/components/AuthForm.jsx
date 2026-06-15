import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  User,
  AlertCircle,
  TrendingUp,
  Globe,
  Phone,
  Building2,
  Briefcase,
  ShieldCheck,
  Fingerprint,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useRegisterUser, useSendOtp, useVerifyOtp, useLoginUser } from '../useAuthHooks';

/* --------------------------------------------------------------------------
   PASSWORD STRENGTH UTILITY
-------------------------------------------------------------------------- */
const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return { label: '', score: 0, color: '', width: '0%' };
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const strengthMap = {
    1: { label: 'Weak', color: '#f87171', width: '25%' },
    2: { label: 'Fair', color: '#fbbf24', width: '50%' },
    3: { label: 'Good', color: '#4ade80', width: '75%' },
    4: { label: 'Strong', color: '#22c55e', width: '100%' },
  };
  const level = Math.min(Math.max(score, 1), 4);
  return { ...strengthMap[level], score };
};

/* --------------------------------------------------------------------------
   ZOD SCHEMAS (ENHANCED FOR CRM)
-------------------------------------------------------------------------- */
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phone: z.string().optional(),
    country: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms & Privacy Policy' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* --------------------------------------------------------------------------
   COUNTRY LIST (CRM OPTIMIZED)
-------------------------------------------------------------------------- */
const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Canada',
  'Australia',
  'Singapore',
  'United Arab Emirates',
  'Japan',
  'India',
  'Brazil',
  'South Africa',
];

/* --------------------------------------------------------------------------
   STYLES (INJECTED GLOBALLY ONCE)
-------------------------------------------------------------------------- */
const globalStyles = `
  @keyframes authShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  @keyframes authSpin {
    to { transform: rotate(360deg); }
  }
  @keyframes authRise {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes authPulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  .auth-shake {
    animation: authShake 0.4s ease-in-out;
  }
  .auth-rise {
    animation: authRise 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  }
  .auth-card {
    background: rgba(6, 11, 22, 0.58);
    backdrop-filter: blur(28px) saturate(1.6);
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
    transition: all 0.3s ease;
  }
  .auth-card.mode-login {
    border-top: 1px solid rgba(111, 156, 255, 0.25);
  }
  .auth-card.mode-signup {
    border-top: 1px solid rgba(167, 139, 250, 0.25);
  }
  .auth-input-wrap {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .auth-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.35);
    pointer-events: none;
    z-index: 2;
    transition: color 0.2s;
  }
  .auth-input {
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 0 12px 0 36px;
    font-size: 13.5px;
    font-weight: 500;
    color: #f1f5ff;
    transition: all 0.2s ease;
    outline: none;
  }
  .auth-input:focus {
    border-color: rgba(111, 156, 255, 0.6);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(111, 156, 255, 0.15);
  }
  .mode-signup .auth-input:focus {
    border-color: rgba(167, 139, 250, 0.6);
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
  }
  .auth-input.has-error {
    border-color: #f87171;
    background: rgba(248, 113, 113, 0.08);
  }
  .auth-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.45);
    margin-bottom: 4px;
  }
  .auth-error-msg {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #f87171;
    margin-top: 5px;
    font-weight: 500;
  }
  .auth-btn-primary {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 13.5px;
    cursor: pointer;
    transition: all 0.2s;
    background: linear-gradient(105deg, #2c3e66, #1a2a4a);
    color: white;
  }
  .mode-login .auth-btn-primary {
    background: linear-gradient(105deg, #3b6ed6, #1e3a8a);
    box-shadow: 0 4px 12px rgba(59, 110, 214, 0.3);
  }
  .mode-signup .auth-btn-primary {
    background: linear-gradient(105deg, #7c3aed, #4c1d95);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }
  .auth-btn-primary:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }
  .auth-btn-primary:disabled {
    opacity: 0.6;
    transform: none;
    cursor: not-allowed;
  }
  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .auth-btn-primary:hover .btn-shimmer {
    left: 120%;
  }
  .auth-tab {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    font-weight: 600;
    font-size: 13px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.28s;
  }
  .auth-checkbox-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .auth-checkbox-box {
    width: 18px;
    height: 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"]:checked + .auth-checkbox-box {
    background: #3b6ed6;
    border-color: #3b6ed6;
  }
  .mode-signup input[type="checkbox"]:checked + .auth-checkbox-box {
    background: #7c3aed;
    border-color: #7c3aed;
  }
  .auth-sep {
    display: flex;
    align-items: center;
    text-align: center;
    color: rgba(255,255,255,0.25);
    font-size: 11px;
    font-weight: 500;
    gap: 12px;
  }
  .auth-sep::before, .auth-sep::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.1);
  }
  .demo-pill {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 40px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .demo-pill:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
    transform: scale(0.97);
  }
  .auth-status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(34,197,94,0.12);
    padding: 3px 8px;
    border-radius: 40px;
    font-size: 10px;
    font-weight: 600;
    color: #4ade80;
    letter-spacing: 0.3px;
  }
  .auth-status-dot {
    width: 6px;
    height: 6px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 5px #4ade80;
    animation: authPulse 1.5s infinite;
  }
  .ses-mono {
    font-family: monospace;
    font-size: 9px;
    background: rgba(0,0,0,0.4);
    padding: 2px 6px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    color: rgba(255,255,255,0.35);
  }
  .auth-panel-container {
    position: relative;
    z-index: 1;
    transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
  }
  .auth-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .auth-panel.visible {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: all;
  }
  .auth-panel.slide-out-left {
    opacity: 0;
    transform: translateX(-40px) scale(0.96);
    pointer-events: none;
  }
  .auth-panel.slide-out-right {
    opacity: 0;
    transform: translateX(40px) scale(0.96);
    pointer-events: none;
  }
  .auth-global-error {
    background: rgba(248,113,113,0.12);
    border-left: 3px solid #f87171;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .strength-bar {
    height: 3px;
    border-radius: 6px;
    background: rgba(255,255,255,0.1);
    margin-top: 6px;
    overflow: hidden;
  }
  .strength-fill {
    height: 100%;
    transition: width 0.2s ease, background 0.2s;
  }
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 10px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  @media (max-width: 480px) {
    .auth-card { padding: 16px !important; max-width: 94% !important; }
  }
`;

/* --------------------------------------------------------------------------
   CUSTOM COUNTRY SELECTOR (GLOSSY COMPONENT)
-------------------------------------------------------------------------- */
function CountrySelector({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`auth-input ${error ? 'has-error' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          cursor: 'pointer',
          paddingLeft: '36px',
          height: '42px'
        }}
      >
        <span style={{ color: value ? '#f1f5ff' : 'rgba(255,255,255,0.3)' }}>
          {value || 'Select country'}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          opacity: 0.6
        }}>
          <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          maxHeight: '180px',
          overflowY: 'auto',
          background: 'rgba(8, 14, 26, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 50,
          padding: '6px'
        }} className="custom-scroll">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onChange(c);
                setIsOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: value === c ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: value === c ? '#c4b5fd' : '#f1f5ff',
                fontSize: '13px',
                fontWeight: value === c ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = value === c ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = value === c ? 'rgba(167, 139, 250, 0.15)' : 'transparent'}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   PASSWORD INPUT (ENHANCED)
-------------------------------------------------------------------------- */
function PasswordInput({
  id,
  placeholder,
  error,
  showToggle = true,
  show,
  onToggle,
  mode,
  ...rest
}) {
  const accentColor = mode === 'login' ? 'rgba(111,156,255,0.6)' : 'rgba(167,139,250,0.6)';
  return (
    <div className="auth-input-wrap">
      <div className="auth-input-icon">
        <Lock size={14} />
      </div>
      <input
        {...rest}
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder || '••••••••'}
        className={`auth-input ${error ? 'has-error' : ''}`}
        style={{ paddingRight: showToggle ? '42px' : '14px' }}
        autoComplete="current-password"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   LOGIN FORM (CRM MODERN)
-------------------------------------------------------------------------- */
const LoginForm = React.forwardRef(({ onError, shake, mode, isActive }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const passwordValue = watch('password');
  const strength = getPasswordStrength(passwordValue || '');

  const { mutateAsync: doLogin, isPending: loading } = useLoginUser();

  const onSubmit = async (data) => {
    onError('');
    try {
      const user = await doLogin({ email: data.email, password: data.password });
      navigate(user.portalType === 'admin' ? '/admin' : '/client', { replace: true });
    } catch (err) {
      onError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div ref={ref} className={`auth-panel ${isActive ? 'visible' : 'slide-out-left'}${shake ? ' auth-shake' : ''}`}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Email Field */}
        <div>
          <label className="auth-label">Business Email</label>
          <div className="auth-input-wrap">
            <div className="auth-input-icon">
              <Mail size={14} />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="name@company.com"
              className={`auth-input ${errors.email ? 'has-error' : ''}`}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <div className="auth-error-msg">
              <AlertCircle size={11} /> {errors.email.message}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="auth-label">Password</label>
            <button
              type="button"
              onClick={() => alert('🔐 Demo: Password reset link would be sent to your email.')}
              style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: '#6f9cff', cursor: 'pointer' }}
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            {...register('password')}
            id="login-password"
            show={showPassword}
            onToggle={() => setShowPassword((p) => !p)}
            error={errors.password}
            mode={mode}
          />
          {passwordValue && (
            <div className="strength-bar">
              <div className="strength-fill" style={{ width: strength.width, background: strength.color }} />
            </div>
          )}
          {errors.password && (
            <div className="auth-error-msg">
              <AlertCircle size={11} /> {errors.password.message}
            </div>
          )}
        </div>

        {/* Remember Me */}
        <label className="auth-checkbox-wrap">
          <input type="checkbox" {...register('rememberMe')} />
          <div className="auth-checkbox-box">
            <svg viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>Keep me signed in</span>
        </label>

        {/* Submit */}
        <button type="submit" disabled={loading} className="auth-btn-primary">
          <div className="btn-shimmer" />
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'authSpin 0.7s linear infinite' }} />
              Authenticating...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* SSO & Demo Access */}
      <div style={{ marginTop: 10 }}>
        <div className="auth-sep">Secure SSO</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <button
            type="button"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 30,
              padding: '6px 12px',
              fontSize: 11.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => alert('SSO Google integration (demo)')}
          >
            <svg width="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></svg>
            Google
          </button>
          <button
            type="button"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 30,
              padding: '6px 12px',
              fontSize: 11.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => alert('SSO Apple integration (demo)')}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.49-.62.71-1.16 1.85-1.01 2.96 1.1.09 2.23-.55 2.96-1.39z" fill="#fff" /></svg>
            Apple
          </button>
          <button
            type="button"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 30,
              padding: '6px 12px',
              fontSize: 11.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => alert('SSO SAML Passkey (demo)')}
          >
            <Fingerprint size={12} /> Passkey
          </button>
        </div>
      </div>
    </div>
  );
});

/* --------------------------------------------------------------------------
   OTP VERIFICATION PANEL
   Shown after successful registration — user must verify their email.
-------------------------------------------------------------------------- */
function OtpPanel({ email, onVerified, onError, onBack, isActive, shake }) {
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef([]);

  const { mutate: doVerify, isPending: verifying } = useVerifyOtp({
    onSuccess: (data) => onVerified(data),
    onError: (err) => onError(err.message || 'Invalid or expired OTP.'),
  });

  const { mutate: doResend, isPending: resending } = useSendOtp({
    onSuccess: () => {
      setResendCooldown(60);
    },
    onError: (err) => onError(err.message || 'Could not resend OTP.'),
  });

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Start cooldown immediately on mount (OTP was just sent by register)
  useEffect(() => { setResendCooldown(60); }, []);

  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = otp.split('');
    next[idx] = val;
    // Pad/fill to 6 chars
    const filled = next.join('').padEnd(6, '').substring(0, 6);
    setOtp(filled);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted);
      inputs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onError('');
    if (otp.replace(/\s/g, '').length < 6) {
      onError('Please enter the full 6-digit code.');
      return;
    }
    doVerify({ email, otp });
  };

  return (
    <div className={`auth-panel ${isActive ? 'visible' : 'slide-out-right'}${shake ? ' auth-shake' : ''}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Icon + heading */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))',
            border: '1px solid rgba(167,139,250,0.3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <KeyRound size={22} color="#a78bfa" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Check your email</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            We sent a 6-digit code to<br />
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>{email}</span>
          </div>
        </div>

        {/* OTP digit inputs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }} onPaste={handlePaste}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <input
              key={idx}
              ref={(el) => (inputs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[idx] || ''}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              style={{
                width: 44, height: 52,
                background: otp[idx] ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${otp[idx] ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 12,
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.2s',
                caretColor: '#a78bfa',
              }}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={verifying || otp.replace(/\s/g, '').length < 6}
          className="auth-btn-primary"
        >
          <div className="btn-shimmer" />
          {verifying ? (
            <><Loader2 size={15} style={{ animation: 'authSpin 0.7s linear infinite' }} /> Verifying...</>
          ) : (
            <><ShieldCheck size={15} /> Verify & Activate Account</>
          )}
        </button>

        {/* Resend + back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onBack}
            style={{ background: 'none', border: 'none', fontSize: 12, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={resendCooldown > 0 || resending}
            onClick={() => { onError(''); doResend(email); }}
            style={{
              background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              fontSize: 12, fontWeight: 600,
              color: resendCooldown > 0 ? 'rgba(255,255,255,0.25)' : '#a78bfa',
              display: 'flex', alignItems: 'center', gap: 5, opacity: resendCooldown > 0 ? 0.6 : 1,
            }}
          >
            {resending ? <Loader2 size={11} style={{ animation: 'authSpin 0.7s linear infinite' }} /> : <RefreshCw size={11} />}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* --------------------------------------------------------------------------
   REGISTER FORM (FULL API FLOW: REGISTER → OTP VERIFY)
-------------------------------------------------------------------------- */
const RegisterForm = React.forwardRef(({ onError, shake, mode, isActive }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  /** 'form' | 'otp' */
  const [step, setStep] = useState('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false,
    },
  });

  const passwordValue = watch('password');
  const strength = getPasswordStrength(passwordValue || '');

  /* TanStack Query mutation */
  const { mutate: doRegister, isPending: registering } = useRegisterUser({
    onSuccess: (_data, variables) => {
      setRegisteredEmail(variables.email);
      setStep('otp');
      onError('');
    },
    onError: (err) => {
      onError(err.message || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    onError('');
    doRegister({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: data.password,
      ...(data.country ? { country: data.country } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
    });
  };

  const { establishSession } = useAuth();

  /** Called by OtpPanel on successful verification */
  const handleVerified = useCallback(async (apiData) => {
    try {
      const { accessToken, refreshToken, user: apiUser } = apiData;
      const user = establishSession(apiUser, accessToken, refreshToken);
      navigate(user.portalType === 'admin' ? '/admin' : '/client', { replace: true });
    } catch (err) {
      onError('Account verified! Please sign in to continue.');
    }
  }, [establishSession, navigate, onError]);

  return (
    <div ref={ref} className={`auth-panel ${isActive ? 'visible' : 'slide-out-right'}${shake ? ' auth-shake' : ''}`}>
      {/* ─── STEP 1: Registration Form ─── */}
      {step === 'form' && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Full name */}
          <div>
            <label className="auth-label">Full name</label>
            <div className="auth-input-wrap">
              <div className="auth-input-icon"><User size={14} /></div>
              <input {...register('name')} placeholder="Alex Morgan" className={`auth-input ${errors.name ? 'has-error' : ''}`} />
            </div>
            {errors.name && <div className="auth-error-msg"><AlertCircle size={11} />{errors.name.message}</div>}
          </div>

          {/* Email */}
          <div>
            <label className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <div className="auth-input-icon"><Mail size={14} /></div>
              <input {...register('email')} type="email" placeholder="alex@example.com" className={`auth-input ${errors.email ? 'has-error' : ''}`} />
            </div>
            {errors.email && <div className="auth-error-msg"><AlertCircle size={11} />{errors.email.message}</div>}
          </div>

          {/* Row: Phone + Country */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="auth-label">Phone (optional)</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon"><Phone size={14} /></div>
                <input {...register('phone')} placeholder="+1 555 0000" className="auth-input" />
              </div>
            </div>
            <div>
              <label className="auth-label">Country (optional)</label>
              <div className="auth-input-wrap">
                <div className="auth-input-icon"><Globe size={14} /></div>
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <CountrySelector
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.country}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Password row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="auth-label">Password</label>
              <PasswordInput {...register('password')} show={showPassword} onToggle={() => setShowPassword((p) => !p)} error={errors.password} mode={mode} />
              {passwordValue && (
                <div className="strength-bar">
                  <div className="strength-fill" style={{ width: strength.width, background: strength.color }} />
                </div>
              )}
              {errors.password && <div className="auth-error-msg"><AlertCircle size={11} />{errors.password.message}</div>}
            </div>
            <div>
              <label className="auth-label">Confirm</label>
              <PasswordInput {...register('confirmPassword')} show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} error={errors.confirmPassword} mode={mode} />
              {errors.confirmPassword && <div className="auth-error-msg"><AlertCircle size={11} />{errors.confirmPassword.message}</div>}
            </div>
          </div>

          {/* Terms agreement */}
          <div style={{ marginTop: 2 }}>
            <label className="auth-checkbox-wrap">
              <input type="checkbox" {...register('agreedToTerms')} />
              <div className="auth-checkbox-box"><svg viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>I accept the <strong style={{ color: '#a78bfa' }}>Terms</strong> and <strong style={{ color: '#a78bfa' }}>Privacy Policy</strong></span>
            </label>
            {errors.agreedToTerms && <div className="auth-error-msg"><AlertCircle size={11} />{errors.agreedToTerms.message}</div>}
          </div>

          <button type="submit" disabled={registering} className="auth-btn-primary">
            <div className="btn-shimmer" />
            {registering ? (
              <><Loader2 size={15} style={{ animation: 'authSpin 0.7s linear infinite' }} /> Creating account...</>
            ) : (
              <><span>Create secure account</span> <ShieldCheck size={15} /></>
            )}
          </button>
        </form>
      )}

      {/* ─── STEP 2: OTP Verification ─── */}
      {step === 'otp' && (
        <OtpPanel
          email={registeredEmail}
          onVerified={handleVerified}
          onError={onError}
          onBack={() => { setStep('form'); onError(''); }}
          isActive
          shake={shake}
        />
      )}
    </div>
  );
});

/* --------------------------------------------------------------------------
   MAIN AUTH FORM COMPONENT (EXPORTED)
-------------------------------------------------------------------------- */
export default function AuthForm({ mode, onModeChange }) {
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [sessionId] = useState(() => 'SES—' + Math.random().toString(36).slice(2, 10).toUpperCase());

  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(mode === 'login' ? 385 : 465);

  useEffect(() => {
    const activeRef = mode === 'login' ? loginRef : signupRef;
    if (activeRef.current) {
      const updateHeight = () => {
        const height = activeRef.current.offsetHeight;
        if (height > 0) {
          setContainerHeight(height);
        }
      };

      // Measure immediately
      updateHeight();

      // Update on resizing (e.g. error alerts appearing)
      const observer = new ResizeObserver(() => {
        updateHeight();
      });
      observer.observe(activeRef.current);
      return () => observer.disconnect();
    }
  }, [mode, error]); // Also run when global error changes height

  const handleError = (msg) => {
    if (msg) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setError(msg);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className={`auth-card mode-${mode} auth-rise`} style={{ maxWidth: 460, width: '100%', padding: '24px 24px 20px', position: 'relative' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, borderRadius: '0 28px 0 200px', background: mode === 'login' ? 'rgba(111,156,255,0.06)' : 'rgba(167,139,250,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 150, height: 150, borderRadius: '0 150px 0 28px', background: mode === 'login' ? 'rgba(56,189,248,0.03)' : 'rgba(240,171,252,0.03)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: mode === 'login' ? 'linear-gradient(135deg, #6f9cff, #2a5aaa)' : 'linear-gradient(135deg, #a78bfa, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 5px 15px ${mode === 'login' ? 'rgba(111,156,255,0.3)' : 'rgba(167,139,250,0.3)'}`,
            }}>
              <TrendingUp size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px', color: '#fff' }}>LIVETRADE<span style={{ color: mode === 'login' ? '#6f9cff' : '#a78bfa' }}>.</span></div>
              <div style={{ fontSize: 9, opacity: 0.4, letterSpacing: 1 }}>CRM ENTERPRISE</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div className="auth-status-badge"><span className="auth-status-dot" />SECURE NODE</div>
            <span className="ses-mono">{sessionId}</span>
          </div>
        </div>

        {/* Sliding Highlights Tabs */}
        <div className="auth-tabs-container" style={{ position: 'relative', display: 'flex', background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 40, marginBottom: 16 }}>
          <div style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: mode === 'login' ? 4 : 'calc(50% + 2px)',
            width: 'calc(50% - 6px)',
            background: mode === 'login' ? 'rgba(111, 156, 255, 0.18)' : 'rgba(167, 139, 250, 0.18)',
            borderRadius: 32,
            border: '1px solid ' + (mode === 'login' ? 'rgba(111, 156, 255, 0.3)' : 'rgba(167, 139, 250, 0.3)'),
            transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            zIndex: 0
          }} />
          <button type="button" className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => onModeChange('login')} style={{ zIndex: 1, color: mode === 'login' ? '#9bbdff' : 'rgba(255, 255, 255, 0.5)', background: 'transparent', boxShadow: 'none' }}>Sign in</button>
          <button type="button" className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => onModeChange('signup')} style={{ zIndex: 1, color: mode === 'signup' ? '#c4b5fd' : 'rgba(255, 255, 255, 0.5)', background: 'transparent', boxShadow: 'none' }}>Create account</button>
        </div>

        {/* Global error */}
        {error && (
          <div className="auth-global-error" style={{ padding: '10px 12px', marginBottom: 14 }}>
            <AlertCircle size={14} color="#f87171" /><span>{error}</span>
          </div>
        )}

        {/* Form render with slide transition container */}
        <div className="auth-panel-container" style={{ height: `${containerHeight}px` }}>
          <LoginForm ref={loginRef} onError={handleError} shake={shake} mode={mode} isActive={mode === 'login'} />
          <RegisterForm ref={signupRef} onError={handleError} shake={shake} mode={mode} isActive={mode === 'signup'} />
        </div>

        {/* Footer security */}
        <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', justifyContent: 'center', gap: 8, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
          <Lock size={10} /> 256-bit encryption • SOC2 Type II • <CheckCircle2 size={10} />
        </div>
      </div>
    </>
  );
}