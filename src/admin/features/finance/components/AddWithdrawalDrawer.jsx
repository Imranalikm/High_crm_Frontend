import React, { useState } from 'react';
import { MainDrawer } from '@/components/common/drawer';
import { adminFinanceApi } from '../services/finance.api';
import { X, Send, AlertTriangle } from 'lucide-react';
import { usersService } from '../../users/services/userService';
import { apiClient } from '@/shared/api/client/apiClient';

export function AddWithdrawalDrawer({ open, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [mt5Accounts, setMt5Accounts] = useState([]);
  
  const [formData, setFormData] = useState({
    userId: '',
    accountId: '',
    amount: '',
    type: 'bank',
    bankAccount: '',
    note: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      usersService.list().then(data => {
        setUsers(data || []);
      });
      apiClient.get('/mt5-accounts').then(res => {
         setMt5Accounts(res.data || []);
      }).catch(err => console.error(err));
    }
  }, [open]);

  const userAccounts = mt5Accounts.filter(acc => acc.userId == formData.userId);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.userId || !formData.accountId || !formData.amount) {
      setError('User ID, MT5 Account ID, and Amount are required.');
      return;
    }

    setSubmitting(true);
    try {
      await adminFinanceApi.createWithdrawal(formData);
      onSuccess?.('Withdrawal added successfully');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create withdrawal');
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
              Action
            </p>
            <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight">
              Add Withdrawal
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

        <form id="add-withdrawal-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Select User</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={e => setFormData({ ...formData, userId: e.target.value, accountId: '' })}
              className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors"
            >
              <option value="">-- Select User --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">MT5 Account</label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              disabled={!formData.userId}
              className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors disabled:opacity-50"
            >
              <option value="">-- Select Account --</option>
              {userAccounts.map(a => (
                <option key={a.accountid} value={a.accountid}>{a.accountid} ({a.groupName})</option>
              ))}
            </select>
            {formData.userId && userAccounts.length === 0 && (
              <span className="block text-[10px] text-warning mt-1">This user has no MT5 accounts.</span>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Amount</label>
            <input 
              name="amount" type="number" min="1" step="0.01" value={formData.amount} onChange={handleChange} placeholder="0.00" 
              className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text font-mono outline-none focus:border-brand/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Method</label>
            <select 
              name="type" value={formData.type} onChange={handleChange}
              className="w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors"
            >
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">Admin Note (Optional)</label>
            <textarea 
              name="note" value={formData.note} onChange={handleChange} placeholder="Notes..." rows={3}
              className="w-full p-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors resize-none"
            />
          </div>
        </form>
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 flex justify-end gap-3">
        <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 rounded-[8px] text-[12.5px] font-semibold text-text-muted hover:text-text hover:bg-bg/50 transition-all">
          Cancel
        </button>
        <button type="submit" form="add-withdrawal-form" disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-brand text-text-on-accent text-[12.5px] font-bold hover:opacity-90 disabled:opacity-50 transition-all">
          <Send size={14} />
          {submitting ? 'Processing...' : 'Submit Withdrawal'}
        </button>
      </div>
    </MainDrawer>
  );
}
