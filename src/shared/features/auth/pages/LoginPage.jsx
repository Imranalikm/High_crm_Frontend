/**
 * ══════════════════════════════════════════════════════════════
 *  LIVE-TRADER — AUTH PAGE  (Premium Redesign)
 *  src/pages/auth/LoginPage.jsx
 *
 *  Login · Register  ·  Zod validation  ·  React Hook Form
 *  AuthBackground WebGL backdrop
 * ══════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import AuthBackground from '../components/AuthBackground';
import AuthForm from '../components/AuthForm';

/* ────────────────────────────────────────────────────────────
   GLOBAL STYLES
────────────────────────────────────────────────────────────── */
const AUTH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  .auth-root {
    font-family: 'Inter', system-ui, sans-serif;
    --a-bg:       #060b16;
    --a-card:     rgba(8,14,26,0.88);
    --a-surface:  rgba(14,22,40,0.7);
    --a-border:   rgba(255,255,255,0.07);
    --a-border-2: rgba(255,255,255,0.12);
    --a-blue:     #6f9cff;
    --a-purple:   #a78bfa;
    --a-green:    #34d399;
    --a-red:      #f87171;
    --a-amber:    #fbbf24;
    --a-text:     #e2e8f8;
    --a-muted:    #64748b;
    --a-dim:      #334155;
  }

  /* ── Panel glass card ── */
  .auth-card {
    background: var(--a-card);
    backdrop-filter: blur(32px) saturate(1.4);
    -webkit-backdrop-filter: blur(32px) saturate(1.4);
    border: 1px solid var(--a-border-2);
    border-radius: 24px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.025) inset,
      0 32px 80px rgba(0,0,0,0.6),
      0 0 120px rgba(111,156,255,0.06);
    position: relative;
    overflow: hidden;
    transition: transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1),
                border-color 0.6s ease,
                box-shadow 0.6s ease;
  }
  .auth-card::before {
    content: '';
    position: absolute; top: 0; left: 20%; right: 20%; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(111,156,255,0.4), transparent);
    transition: left 0.6s cubic-bezier(0.34, 1.3, 0.64, 1),
                right 0.6s cubic-bezier(0.34, 1.3, 0.64, 1),
                opacity 0.6s ease;
    opacity: 0.6;
  }
  .auth-card.mode-signup::before {
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent);
  }
  .auth-card.mode-signup {
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.025) inset,
      0 32px 80px rgba(0,0,0,0.6),
      0 0 120px rgba(167,139,250,0.06);
  }

  /* ── Interactive hover states ── */
  .auth-card:hover {
    transform: scale(1.02) translateY(-6px);
    border-color: rgba(111, 156, 255, 0.38);
    box-shadow:
      0 0 0 1.5px rgba(111, 156, 255, 0.12) inset,
      0 40px 100px rgba(0,0,0,0.7),
      0 0 140px rgba(111, 156, 255, 0.16);
  }
  .auth-card.mode-signup:hover {
    border-color: rgba(167, 139, 250, 0.38);
    box-shadow:
      0 0 0 1.5px rgba(167, 139, 250, 0.12) inset,
      0 40px 100px rgba(0,0,0,0.7),
      0 0 140px rgba(167, 139, 250, 0.16);
  }
  .auth-card:hover::before {
    left: 4%; right: 4%;
    opacity: 1;
  }

  /* ── Mode tabs ── */
  .auth-tabs {
    display: grid; grid-template-columns: 1fr 1fr;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--a-border);
    border-radius: 14px;
    padding: 4px;
    gap: 4px;
  }
  .auth-tab {
    height: 34px; border-radius: 10px; border: none;
    font-size: 12.5px; font-weight: 600; letter-spacing: -0.01em;
    cursor: pointer; transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
    color: rgba(255,255,255,0.4);
    background: transparent;
    font-family: 'Inter', sans-serif;
    position: relative;
  }
  .auth-tab:hover:not(.active) { color: rgba(255,255,255,0.65); }
  .auth-tab.active {
    color: #fff;
    font-weight: 700;
  }
  .auth-tab.active.mode-login {
    background: linear-gradient(135deg, rgba(111,156,255,0.18), rgba(111,156,255,0.08));
    box-shadow: 0 1px 0 rgba(111,156,255,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .auth-tab.active.mode-signup {
    background: linear-gradient(135deg, rgba(167,139,250,0.18), rgba(167,139,250,0.08));
    box-shadow: 0 1px 0 rgba(167,139,250,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
  }

  /* ── Input ── */
  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.2);
    transition: color 0.25s ease;
    pointer-events: none;
    display: flex; align-items: center;
  }
  .auth-input-wrap:focus-within .auth-input-icon { color: rgba(111,156,255,0.7); }
  .mode-signup .auth-input-wrap:focus-within .auth-input-icon { color: rgba(167,139,250,0.7); }

  .auth-input {
    width: 100%; height: 40px; background: rgba(255,255,255,0.04);
    border: 1px solid var(--a-border);
    border-radius: 10px;
    color: var(--a-text);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 400;
    padding-left: 36px;
    padding-right: 14px;
    transition: all 0.22s ease;
    outline: none;
    -webkit-appearance: none;
  }
  .auth-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; }
  .auth-input:focus {
    background: rgba(255,255,255,0.055);
    border-color: rgba(111,156,255,0.4);
    box-shadow: 0 0 0 3px rgba(111,156,255,0.1), 0 1px 3px rgba(0,0,0,0.3);
  }
  .mode-signup .auth-input:focus {
    border-color: rgba(167,139,250,0.4);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.1), 0 1px 3px rgba(0,0,0,0.3);
  }
  .auth-input.has-error {
    border-color: rgba(248,113,113,0.4) !important;
    box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important;
  }

  /* ── Primary button ── */
  .auth-btn-primary {
    width: 100%; height: 42px; border: none; border-radius: 11px;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
    transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  .auth-btn-primary:hover { transform: translateY(-1px); filter: brightness(1.08); }
  .auth-btn-primary:active { transform: scale(0.985); filter: brightness(0.96); }
  .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .auth-btn-primary.mode-login {
    background: linear-gradient(135deg, #6f9cff 0%, #3b6fd4 100%);
    box-shadow: 0 4px 20px rgba(111,156,255,0.35), 0 1px 0 rgba(255,255,255,0.15) inset;
    color: #fff;
  }
  .auth-btn-primary.mode-signup {
    background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
    box-shadow: 0 4px 20px rgba(167,139,250,0.35), 0 1px 0 rgba(255,255,255,0.15) inset;
    color: #fff;
  }
  .auth-btn-primary .btn-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
    opacity: 0; transition: opacity 0.3s ease;
  }
  .auth-btn-primary:hover .btn-shimmer { opacity: 1; }

  /* ── Checkbox ── */
  .auth-checkbox-wrap { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .auth-checkbox-wrap input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }
  .auth-checkbox-box {
    width: 17px; height: 17px; border-radius: 5px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
    transition: all 0.2s ease;
  }
  .auth-checkbox-box svg { display: none; }
  .auth-checkbox-wrap input:checked ~ .auth-checkbox-box { display: flex; }
  .auth-checkbox-wrap:has(input:checked) .auth-checkbox-box {
    background: #6f9cff;
    border-color: #6f9cff;
    box-shadow: 0 0 10px rgba(111,156,255,0.4);
  }
  .mode-signup .auth-checkbox-wrap:has(input:checked) .auth-checkbox-box {
    background: #a78bfa;
    border-color: #a78bfa;
    box-shadow: 0 0 10px rgba(167,139,250,0.4);
  }
  .auth-checkbox-wrap:has(input:checked) .auth-checkbox-box svg { display: block; }

  /* ── Error text ── */
  .auth-error-msg {
    font-size: 11px; color: #f87171; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
    margin-top: 4px;
  }

  /* ── Global error banner ── */
  .auth-global-error {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 11px;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    color: #fca5a5;
    font-size: 13px; font-weight: 500;
    margin-bottom: 20px;
  }

  /* ── Status badge ── */
  .auth-status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px 4px 7px;
    border-radius: 100px;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.2);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; letter-spacing: 0.1em;
    color: #34d399;
  }
  .auth-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 6px #34d399;
    animation: authDotPulse 2.4s ease-in-out infinite;
  }
  @keyframes authDotPulse {
    0%,100% { opacity: 1; box-shadow: 0 0 6px #34d399; }
    50%      { opacity: 0.7; box-shadow: 0 0 12px #34d399; }
  }

  /* ── Separator ── */
  .auth-sep {
    display: flex; align-items: center; gap: 12px;
    font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
  }
  .auth-sep::before, .auth-sep::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,0.07);
  }

  /* ── Field label ── */
  .auth-label {
    display: block;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-bottom: 4px;
  }

  /* ── Shake animation ── */
  @keyframes authShake {
    0%,100% { transform: translateX(0);  }
    18%      { transform: translateX(-7px); }
    36%      { transform: translateX(6px); }
    54%      { transform: translateX(-4px); }
    72%      { transform: translateX(3px); }
  }
  .auth-shake { animation: authShake 0.5s cubic-bezier(0.36,0.07,0.19,0.97); }

  /* ── Rise in ── */
  @keyframes authRise {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
  .auth-rise {
    animation: authRise 0.7s cubic-bezier(0.16,1,0.3,1) both;
    animation-delay: 0.15s;
  }

  /* ── Panel slide transitions ── */
  .auth-panel {
    transition: opacity 0.38s cubic-bezier(0.16,1,0.3,1),
                transform 0.38s cubic-bezier(0.16,1,0.3,1);
  }
  .auth-panel.visible  { opacity: 1; transform: none;                pointer-events: all;  }
  .auth-panel.slide-out-left  { opacity: 0; transform: translateX(-18px) scale(0.98); pointer-events: none; position: absolute; top: 0; inset-x: 0; }
  .auth-panel.slide-out-right { opacity: 0; transform: translateX(18px)  scale(0.98); pointer-events: none; position: absolute; top: 0; inset-x: 0; }

  /* ── Demo pill ── */
  .demo-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 9px; border-radius: 100px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.45);
    cursor: pointer; transition: all 0.2s ease;
  }
  .demo-pill:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.8);
  }

  /* ── Divider row ── */
  .auth-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
  }

  /* ── Tooltip-style session ID ── */
  .ses-mono {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.2);
  }
`;



/* ════════════════════════════════════════════════════════════
   MAIN LOGIN PAGE
════════════════════════════════════════════════════════════ */
export function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');

  useEffect(() => {
    if (isAuthenticated && user)
      navigate(user.portalType === 'admin' ? '/admin' : '/client', { replace: true });
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return (
    <>
      <style>{AUTH_CSS}</style>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div className="auth-root" style={{
        height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#060b16', padding: '16px',
        '--c-blue': mode === 'login' ? '#6f9cff' : '#a78bfa',
        '--c-cyan': mode === 'login' ? '#38bdf8' : '#f0abfc',
      }}>
        <AuthBackground mode={mode} />
        <AuthForm mode={mode} onModeChange={setMode} />
      </div>
    </>
  );
}

export default LoginPage;