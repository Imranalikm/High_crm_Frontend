import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useFinanceUpdates } from '@/shared/hooks/useFinanceUpdates';
import { adminFinanceApi } from '../services/finance.api';
import { BalanceOperationDrawer } from './BalanceOperationDrawer';
import { BALANCE_OP_TYPES, BALANCE_OP_TYPE_BY_ID, fmtMoney } from './balanceOpTypes';

/**
 * Admin › User detail › "Balance Ops" tab.
 * Lists every balance operation (credit, bonus, commission, charges...) for
 * one client, with per-type totals and a shortcut to post a new one.
 */
export function UserBalanceOperationsTab({ user }) {
  const userId = user?.id || user?.uid;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [typeF, setTypeF] = useState('ALL');
  const [showDrawer, setShowDrawer] = useState(false);
  const updates = useFinanceUpdates('balance_operation');

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setError('');
      setRows(await adminFinanceApi.getBalanceOperations({ userId }));
    } catch (e) {
      setError(e.message || 'Failed to load balance operations');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load, updates]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Total per type over completed operations (only types that were used)
  const totals = useMemo(() => {
    const map = new Map();
    rows.filter((r) => r.status === 'completed').forEach((r) => {
      map.set(r.type, (map.get(r.type) || 0) + Math.abs(r.amount));
    });
    return BALANCE_OP_TYPES.filter((t) => map.has(t.id)).map((t) => ({ ...t, net: map.get(t.id) }));
  }, [rows]);

  const visible = typeF === 'ALL' ? rows : rows.filter((r) => r.type === Number(typeF));

  return (
    <div className="space-y-5 animate-fade-up">
      {toast && (
        <div className="flex items-center gap-2.5 rounded-[6px] border-l-2 border-l-brand border border-brand/15 bg-brand/[0.04] px-4 py-2.5 text-[11.5px] font-bold text-brand">
          <CheckCircle size={12} className="shrink-0" /> {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-text">Balance Operations</h3>
          <p className="text-[12px] text-text-muted/75 mt-0.5">Credit, bonus, commission, charges and other MT5 operations for this client.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeF}
            onChange={(e) => setTypeF(e.target.value)}
            className="h-8 rounded-[7px] border border-border/20 bg-bg text-[12px] text-text px-2 outline-none focus:border-brand/40 cursor-pointer"
          >
            <option value="ALL">All types</option>
            {BALANCE_OP_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent text-[12px] font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus size={12} /> New Operation
          </button>
        </div>
      </div>

      {/* Per-type totals */}
      {totals.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {totals.map((t) => (
            <div key={t.id} className="rounded-[9px] border border-border/15 bg-surface-elevated px-3.5 py-3" style={{ borderTop: `2px solid ${t.color}` }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/75">{t.label}</p>
              <p className="font-mono text-[15px] font-bold mt-1 text-text">{fmtMoney(t.net)}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[8px] bg-negative/10 border border-negative/20 text-negative text-[12px] font-semibold">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* List */}
      <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-[12px] text-text-muted/60">Loading…</div>
        ) : visible.length === 0 ? (
          <div className="p-8 text-center text-[12px] text-text-muted/60 italic">No balance operations for this client.</div>
        ) : (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted/70 border-b border-border/15">
                {['Date', 'Account', 'Type', 'Amount', 'Comment', 'MT5 Deal', 'Status', 'By'].map((h) => (
                  <th key={h} className={`px-3.5 py-2.5 whitespace-nowrap ${h === 'Amount' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const color = BALANCE_OP_TYPE_BY_ID[r.type]?.color || 'var(--text-muted)';
                const ok = r.status === 'completed';
                return (
                  <tr key={r.id} className="border-b border-border/10 last:border-0 hover:bg-bg/30">
                    <td className="px-3.5 py-2.5 font-mono text-text-muted/80 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-3.5 py-2.5 font-mono text-text">#{r.accountId}</td>
                    <td className="px-3.5 py-2.5">
                      <span className="rounded-[5px] px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.06em] whitespace-nowrap"
                        style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
                        {r.typeLabel}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold whitespace-nowrap text-text">
                      {fmtMoney(Math.abs(r.amount))}
                    </td>
                    <td className="px-3.5 py-2.5 text-text-muted/85 max-w-[200px]">
                      <span className="block truncate" title={r.note ? `${r.comment || ''}\nNote: ${r.note}` : r.comment}>{r.comment || '—'}</span>
                      {r.note && <span className="block truncate text-[10.5px] text-text-muted/55">Note: {r.note}</span>}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-text-muted/75">{r.dealId || '—'}</td>
                    <td className="px-3.5 py-2.5">
                      <span title={r.errorMessage || ''} className="text-[10.5px] font-bold uppercase px-2 py-1 rounded-[5px]"
                        style={{ color: ok ? 'var(--positive)' : 'var(--negative)', background: `color-mix(in srgb, ${ok ? 'var(--positive)' : 'var(--negative)'} 10%, transparent)` }}>
                        {ok ? 'Completed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-text-muted/85 whitespace-nowrap">{r.creator?.name || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showDrawer && (
        <BalanceOperationDrawer
          open={showDrawer}
          initialUserId={userId}
          onClose={() => setShowDrawer(false)}
          onSuccess={(msg) => { setToast(msg); load(); }}
        />
      )}
    </div>
  );
}
