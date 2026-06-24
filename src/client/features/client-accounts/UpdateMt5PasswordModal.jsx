import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Eye, EyeOff, KeyRound, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '@/shared/api/client/apiClient';

export function UpdateMt5PasswordModal({ open, accountId, onClose, onSuccess }) {
  const [mPassword, setMPassword] = useState('');
  const [iPassword, setIPassword] = useState('');
  const [showM, setShowM] = useState(false);
  const [showI, setShowI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mPassword || !iPassword) {
      setError('Both Master and Investor passwords are required.');
      return;
    }
    
    const isValidPassword = (pwd) => {
      if (pwd.length < 8 || pwd.length > 16) return false;
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
      return hasUpper && hasLower && hasNumber && hasSpecial;
    };

    if (!isValidPassword(mPassword)) {
      setError('Master password must be 8-16 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (!isValidPassword(iPassword)) {
      setError('Investor password must be 8-16 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiClient.post('/mt5-accounts/update-password', {
        accountid: accountId,
        mPassword,
        iPassword
      });
      setMPassword('');
      setIPassword('');
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update MT5 passwords.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!loading ? onClose : undefined}
      />
      
      <div className="relative w-full max-w-md bg-surface-elevated border border-border/10 rounded-[20px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/10 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-brand/10 border border-brand/20 flex items-center justify-center">
              <KeyRound size={20} className="text-brand" />
            </div>
            <div>
              <h2 className="font-semibold text-text text-[16px]">Change Passwords</h2>
              <p className="text-[12px] text-text-muted mt-0.5">MT5 Account: <span className="font-mono text-brand font-bold">{accountId}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-negative/10 border border-negative/20 rounded-[8px] text-negative text-[12px] font-medium">
              <AlertCircle size={14} />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Master Password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-text-muted/80 uppercase tracking-wider">New Master Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40">
                  <Lock size={16} />
                </div>
                <input
                  type={showM ? 'text' : 'password'}
                  value={mPassword}
                  onChange={(e) => setMPassword(e.target.value)}
                  placeholder="Enter new master password"
                  className="w-full h-10 bg-black/20 border border-border/10 rounded-[10px] pl-10 pr-10 text-[13px] text-text placeholder:text-text-muted/30 focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowM(!showM)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-text transition-colors"
                >
                  {showM ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10.5px] text-text-muted/60">Full access for trading.</p>
            </div>

            {/* Investor Password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-text-muted/80 uppercase tracking-wider">New Investor Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40">
                  <Lock size={16} />
                </div>
                <input
                  type={showI ? 'text' : 'password'}
                  value={iPassword}
                  onChange={(e) => setIPassword(e.target.value)}
                  placeholder="Enter new investor password"
                  className="w-full h-10 bg-black/20 border border-border/10 rounded-[10px] pl-10 pr-10 text-[13px] text-text placeholder:text-text-muted/30 focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowI(!showI)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-text transition-colors"
                >
                  {showI ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10.5px] text-text-muted/60">Read-only access for viewing performance.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] bg-brand text-white rounded-[10px] font-semibold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Updating...</>
              ) : (
                <><ShieldCheck size={16} /> Change MT5 Passwords</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
