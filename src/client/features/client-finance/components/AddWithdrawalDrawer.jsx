import React, { useState, useEffect } from 'react';
import { MainDrawer } from '@/components/common/drawer';
import { financeApi } from '../services/finance.api';
import { apiClient } from '@/shared/api/client/apiClient';
import { X, Send, AlertTriangle } from 'lucide-react';

export function AddWithdrawalDrawer({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    type: 'bank',
    bankAccount: '',
    note: 'User withdrawal'
  });
  const [mt5Accounts, setMt5Accounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    if (open) {
      setLoadingAccounts(true);
      apiClient.get('/mt5-accounts')
        .then(res => {
          const accounts = res.data || [];
          setMt5Accounts(accounts);
          if (accounts.length > 0) {
            setFormData(prev => ({ ...prev, accountId: accounts[0].accountid }));
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load MT5 accounts.');
        })
        .finally(() => setLoadingAccounts(false));
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.accountId || !formData.amount) {
      setError('MT5 Account and Amount are required.');
      return;
    }

    if (!formData.bankAccount) {
      setError('Destination details are required.');
      return;
    }

    setSubmitting(true);
    try {
      await financeApi.createWithdrawal(formData);
      onSuccess?.('Withdrawal request submitted successfully');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[480px]">
      <div className="flex-shrink-0 border-b border-border/15">
        <div className="h-[2.5px] w-full" style={{ background: `linear-gradient(90deg, var(--brand), transparent)` }} />
        <div className="px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.22em] mb-2 leading-none text-brand">
              Financials
            </p>
            <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight">
              Withdraw Funds
            </h2>
          </div>
          <button onClick={onClose} className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all">
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {error && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-[8px] bg-negative/10 border border-negative/20 text-negative text-[12px] font-semibold">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {loadingAccounts ? (
          <div className="p-4 text-center text-text-muted text-[13px]">Loading accounts...</div>
        ) : (
          <form id="add-withdrawal-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">MT5 Account</label>
              <select 
                name="accountId" value={formData.accountId} onChange={handleChange}
                className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors"
              >
                {mt5Accounts.map(acc => (
                  <option key={acc.accountid} value={acc.accountid}>
                    {acc.accountid} (Bal: ${parseFloat(acc.balance || 0).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Amount</label>
              <input 
                name="amount" type="number" min="1" step="0.01" value={formData.amount} onChange={handleChange} placeholder="0.00" 
                className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text font-mono outline-none focus:border-brand/40 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Withdrawal Method</label>
              <select 
                name="type" value={formData.type} onChange={handleChange}
                className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors"
              >
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Destination Details</label>
              <input 
                name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder={formData.type === 'upi' ? 'UPI ID (e.g. user@upi)' : 'Bank Account Details'} 
                className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors"
              />
            </div>
          </form>
        )}
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 flex justify-end gap-3">
        <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 rounded-[8px] text-[12.5px] font-semibold text-text-muted hover:text-text hover:bg-bg/50 transition-all">
          Cancel
        </button>
        <button type="submit" form="add-withdrawal-form" disabled={submitting || loadingAccounts || mt5Accounts.length === 0} className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-brand text-text-on-accent text-[12.5px] font-bold hover:opacity-90 disabled:opacity-50 transition-all">
          <Send size={14} />
          {submitting ? 'Processing...' : 'Submit Request'}
        </button>
      </div>
    </MainDrawer>
  );
}
