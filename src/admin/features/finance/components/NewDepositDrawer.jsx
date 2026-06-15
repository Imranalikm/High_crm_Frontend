import React, { useState, useEffect } from 'react';
import { Send, Wallet, Search } from 'lucide-react';
import { FinanceDrawer, DrawerSection, DF, DGrid } from './FinanceDrawer';
import { adminFinanceApi } from '../services/finance.api';
import { usersService } from '../../users/services/userService';
import { apiClient } from '@/shared/api/client/apiClient';

export function NewDepositDrawer({ open, onClose, onCreated }) {
  const [users, setUsers] = useState([]);
  const [mt5Accounts, setMt5Accounts] = useState([]);
  
  const [formData, setFormData] = useState({
    userId: '',
    accountId: '',
    amount: '',
    method: 'bank',
    note: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      usersService.list().then(data => {
        setUsers(data || []);
      });
      apiClient.get('/mt5-accounts').then(res => {
         setMt5Accounts(res.data || []);
      }).catch(err => console.error(err));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!formData.userId || !formData.accountId || !formData.amount) {
      alert('User, MT5 Account, and Amount are required.');
      return;
    }

    setLoading(true);
    try {
      await adminFinanceApi.createDeposit({
        userId: formData.userId,
        accountId: formData.accountId,
        amount: formData.amount,
        type: formData.method,
        note: formData.note,
        comment: formData.comment
      });
      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create deposit: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const userAccounts = mt5Accounts.filter(acc => acc.userId == formData.userId);

  return (
    <FinanceDrawer
      open={open}
      onClose={onClose}
      eyebrow="Manual Transaction"
      title="Create New Deposit"
      subtitle="Manually credit funds to a user's MT5 account"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-[8px] border border-border/25 bg-surface-bright/10 text-[12px] font-semibold text-text-muted hover:text-text hover:bg-border/20 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 h-9 px-5 rounded-[8px] bg-brand text-text-on-accent text-[12px] font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={13} />
            {loading ? 'Processing...' : 'Submit Deposit'}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <DrawerSection title="User & Account">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">Select User</label>
              <select
                value={formData.userId}
                onChange={e => setFormData({ ...formData, userId: e.target.value, accountId: '' })}
                className="h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40"
              >
                <option value="">-- Select User --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">MT5 Account</label>
              <select
                value={formData.accountId}
                onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                disabled={!formData.userId}
                className="h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 disabled:opacity-50"
              >
                <option value="">-- Select Account --</option>
                {userAccounts.map(a => (
                  <option key={a.accountid} value={a.accountid}>{a.accountid} ({a.groupName})</option>
                ))}
              </select>
              {formData.userId && userAccounts.length === 0 && (
                <span className="text-[10px] text-warning mt-1">This user has no MT5 accounts.</span>
              )}
            </div>
          </div>
        </DrawerSection>

        <DrawerSection title="Deposit Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">Amount (USD)</label>
              <div className="relative">
                <Wallet size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-border/20 bg-bg text-[14px] font-mono font-bold text-text outline-none focus:border-brand/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">Payment Method</label>
              <select
                value={formData.method}
                onChange={e => setFormData({ ...formData, method: e.target.value })}
                className="h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40"
              >
                <option value="bank">Bank Wire</option>
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
          </div>
        </DrawerSection>

        <DrawerSection title="Notes">
           <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">Public Note (Visible to User)</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g. Bank wire received on..."
                  className="w-full h-9 px-3 rounded-[8px] border border-border/20 bg-bg text-[12.5px] text-text outline-none focus:border-brand/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">Internal Comment (Admin Only)</label>
                <textarea
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="e.g. Verified by accounts team"
                  rows={2}
                  className="w-full resize-none p-3 rounded-[8px] border border-border/20 bg-bg text-[12.5px] text-text outline-none focus:border-brand/40"
                />
              </div>
           </div>
        </DrawerSection>
      </div>
    </FinanceDrawer>
  );
}
