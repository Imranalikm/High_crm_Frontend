import React, { useEffect, useMemo, useState } from 'react';
import { X, Send, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';
import { apiClient } from '@/shared/api/client/apiClient';
import { useLiveMt5Accounts, withLive } from '@/shared/hooks/useLiveMt5Accounts';
import { isDemoAccount } from '@/shared/utils/mt5Accounts';
import { adminFinanceApi } from '../services/finance.api';
import { BALANCE_OP_TYPES, fmtMoney } from './balanceOpTypes';

const inputCls = 'w-full h-10 px-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors disabled:opacity-50';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5';

export function BalanceOperationDrawer({ open, onClose, onSuccess, initialUserId }) {
  const [accounts, setAccounts] = useState([]);
  const [clientQuery, setClientQuery] = useState('');
  const [form, setForm] = useState({
    userId: initialUserId ? String(initialUserId) : '', accountId: '', type: 5, amount: '', comment: '', note: '',
  });
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { byLogin } = useLiveMt5Accounts();

  useEffect(() => {
    if (!open) return;
    apiClient.get('/mt5-accounts')
      .then((res) => {
        const list = (res.data || []).filter(
          (a) => a.accountid && !String(a.accountid).startsWith('PENDING-') && a.userId &&
            String(a.status || 'LIVE').toUpperCase() === 'LIVE'
        );
        setAccounts(list);
        // Pre-selected client with a single account: pick it
        setForm((f) => {
          if (!f.userId || f.accountId) return f;
          const own = list.filter((a) => String(a.userId) === f.userId);
          return own.length === 1 ? { ...f, accountId: String(own[0].accountid) } : f;
        });
      })
      .catch(() => setError('Failed to load MT5 accounts'));
  }, [open]);

  // Clients = owners of provisioned MT5 accounts
  const clients = useMemo(() => {
    const map = new Map();
    accounts.forEach((a) => {
      if (!map.has(a.userId)) map.set(a.userId, { id: a.userId, name: a.user?.name || `User ${a.userId}`, email: a.user?.email || '', count: 0 });
      map.get(a.userId).count += 1;
    });
    const q = clientQuery.trim().toLowerCase();
    return [...map.values()]
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || String(c.id).includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [accounts, clientQuery]);

  const clientAccounts = accounts.filter((a) => String(a.userId) === String(form.userId));
  const selectedAccount = accounts.find((a) => String(a.accountid) === String(form.accountId));
  const live = selectedAccount ? withLive(selectedAccount, byLogin) : null;
  const typeMeta = BALANCE_OP_TYPES.find((t) => t.id === Number(form.type));
  const amount = Math.abs(Number(form.amount) || 0);

  const set = (patch) => { setConfirming(false); setError(''); setForm((f) => ({ ...f, ...patch })); };

  const pickType = (t) => set({ type: t.id });

  const validate = () => {
    if (!form.userId) return 'Select a client.';
    if (!form.accountId) return 'Select an MT5 account.';
    if (!(Number(form.amount) > 0)) return 'Enter an amount greater than 0.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    if (!confirming) { setConfirming(true); return; }

    setSubmitting(true);
    setError('');
    try {
      await adminFinanceApi.createBalanceOperation({
        accountId: form.accountId,
        type: Number(form.type),
        amount,
        comment: form.comment,
        note: form.note,
      });
      onSuccess?.(`${typeMeta.label} ${fmtMoney(amount)} applied to #${form.accountId}`);
      onClose();
    } catch (err) {
      setConfirming(false);
      setError(err?.data?.message || err?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[520px]">
      <div className="flex-shrink-0 border-b border-border/15">
        <div className="h-[2.5px] w-full" style={{ background: 'linear-gradient(90deg, var(--brand), transparent)' }} />
        <div className="px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.22em] mb-2 leading-none text-brand">Finance</p>
            <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight">New Balance Operation</h2>
            <p className="text-[12px] text-text-muted/75 mt-1.5">Posted to MT5 immediately.</p>
          </div>
          <button type="button" onClick={onClose} className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all">
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {error && (
          <div className="mb-5 flex items-start gap-2 p-3 rounded-[8px] bg-negative/10 border border-negative/20 text-negative text-[12px] font-semibold">
            <AlertTriangle size={14} className="mt-[1px] flex-shrink-0" /> <span className="break-words">{error}</span>
          </div>
        )}

        <form id="balance-op-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Client */}
          <div>
            <label className={labelCls}>Client</label>
            <input
              value={clientQuery}
              onChange={(e) => setClientQuery(e.target.value)}
              placeholder="Search name, email or ID…"
              className={`${inputCls} mb-2`}
            />
            <select
              value={form.userId}
              onChange={(e) => {
                const own = accounts.filter((a) => String(a.userId) === e.target.value);
                set({ userId: e.target.value, accountId: own.length === 1 ? String(own[0].accountid) : '' });
              }}
              className={inputCls}
            >
              <option value="">-- Select client ({clients.length}) --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}{c.email ? ` (${c.email})` : ''} · {c.count} acct</option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className={labelCls}>MT5 Account</label>
            <select value={form.accountId} onChange={(e) => set({ accountId: e.target.value })} disabled={!form.userId} className={inputCls}>
              <option value="">-- Select account --</option>
              {clientAccounts.map((a) => (
                <option key={a.accountid} value={a.accountid}>
                  #{a.accountid} · {a.groupName}{isDemoAccount(a) ? ' (Demo)' : ''}
                </option>
              ))}
            </select>
            {live && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  ['Balance', live.balance],
                  ['Credit', live.isLive ? live.credit : null],
                  ['Equity', live.isLive ? live.equity : null],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-[8px] border border-border/15 bg-bg/40 px-2.5 py-2">
                    <p className="text-[9.5px] font-bold uppercase tracking-wider text-text-muted/70">{k}</p>
                    <p className="font-mono text-[12.5px] font-bold text-text mt-0.5">{v == null ? '—' : fmtMoney(v)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type */}
          <div>
            <label className={labelCls}>Operation Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {BALANCE_OP_TYPES.map((t) => {
                const active = Number(form.type) === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickType(t)}
                    className={`h-9 px-2 rounded-[8px] border text-[11.5px] font-bold transition-all cursor-pointer ${
                      active ? 'text-text-on-accent border-transparent' : 'border-border/20 bg-bg text-text-muted hover:text-text hover:border-border/40'
                    }`}
                    style={active ? { background: t.color } : undefined}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            {typeMeta && <p className="text-[11px] text-text-muted/70 mt-1.5">{typeMeta.hint}</p>}
          </div>

          {/* Amount: the operation type decides how MT5 applies it */}
          <div>
            <label className={labelCls}>Amount (USD)</label>
            <input
              type="number" min="0.01" step="0.01" value={form.amount}
              onChange={(e) => set({ amount: e.target.value })}
              placeholder="0.00"
              className={`${inputCls} font-mono`}
            />
          </div>

          <div>
            <label className={labelCls}>MT5 Comment <span className="normal-case font-semibold text-text-muted/60">(shown to client in MT5, max 31)</span></label>
            <input
              value={form.comment} maxLength={31}
              onChange={(e) => set({ comment: e.target.value })}
              placeholder={typeMeta?.label || 'Comment'}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Internal Note (optional)</label>
            <textarea
              value={form.note} rows={2}
              onChange={(e) => set({ note: e.target.value })}
              placeholder="Reason, ticket reference…"
              className="w-full p-3 rounded-[8px] border border-border/20 bg-bg text-[13px] text-text outline-none focus:border-brand/40 transition-colors resize-none"
            />
          </div>

          {confirming && (
            <div className="rounded-[10px] border border-warning/30 bg-warning/[0.07] p-3.5 text-[12.5px] text-text">
              <p className="flex items-center gap-1.5 font-bold text-warning mb-1"><ShieldCheck size={14} /> Confirm operation</p>
              <p>
                <b>{typeMeta?.label}</b>{' '}
                <span className="font-mono font-bold">{fmtMoney(amount)}</span>{' '}
                on account <b>#{form.accountId}</b>{selectedAccount?.user?.name ? ` (${selectedAccount.user.name})` : ''}.
                This is posted to MT5 and cannot be undone from here.
              </p>
            </div>
          )}
        </form>
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 flex justify-end gap-3">
        <button type="button" onClick={confirming ? () => setConfirming(false) : onClose} disabled={submitting} className="px-4 py-2 rounded-[8px] text-[12.5px] font-semibold text-text-muted hover:text-text hover:bg-bg/50 transition-all">
          {confirming ? 'Back' : 'Cancel'}
        </button>
        <button type="submit" form="balance-op-form" disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-brand text-text-on-accent text-[12.5px] font-bold hover:opacity-90 disabled:opacity-50 transition-all">
          <Send size={14} />
          {submitting ? 'Posting to MT5…' : confirming ? 'Confirm & Apply' : 'Review'}
        </button>
      </div>
    </MainDrawer>
  );
}
