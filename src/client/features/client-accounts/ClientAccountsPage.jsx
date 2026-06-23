import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Plus, Monitor, ShieldAlert, Activity, Copy, Wallet } from 'lucide-react';
import { Card, StatusBadge, Toast } from '@/components/ui';
import { MainTable, TableToolbar } from '@/components/common/table';
import { ClientCreateAccountDrawer } from './ClientCreateAccountDrawer';
import { UpdateMt5PasswordModal } from './UpdateMt5PasswordModal';
import { apiClient } from '@/shared/api/client/apiClient';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

export function ClientAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/mt5-accounts');
      const fetchedData = response?.data || [];
      const liveAccounts = fetchedData.filter(
        (acc) => acc.status === 'LIVE' && acc.accountid && !acc.accountid.startsWith('PENDING-')
      );
      setAccounts(liveAccounts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user accounts:', err);
      setError('Unable to load your trading accounts at this time.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const activeCount = accounts.filter(acc => 
      ['LIVE', 'ACTIVE'].includes((acc.status || 'LIVE').toUpperCase())
    ).length;
    
    const parseLeverage = (levStr) => {
      if (!levStr) return 100;
      const parts = levStr.split(':');
      if (parts.length > 1) return parseInt(parts[1], 10) || 100;
      return parseInt(levStr, 10) || 100;
    };
    
    const maxLeverageValue = accounts.reduce((max, acc) => {
      const val = parseLeverage(acc.leverage);
      return val > max ? val : max;
    }, 0);
    
    const maxLeverage = maxLeverageValue ? `1:${maxLeverageValue}` : 'N/A';

    return {
      totalBalance,
      activeCount,
      maxLeverage
    };
  }, [accounts]);

  const columns = useMemo(() => [
    {
      key: 'accountid',
      label: 'Login ID',
      render: (val) => (
        <div className="flex items-center gap-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
          <span className="font-mono text-[12.5px] font-bold text-brand select-all truncate">
            {val}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(val);
              setToast('Login ID copied to clipboard');
              setTimeout(() => setToast(''), 3000);
            }}
            className="text-text-muted/30 hover:text-brand cursor-pointer p-0.5 rounded hover:bg-white/5 transition-colors"
            title="Copy ID"
          >
            <Copy size={11} />
          </button>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <StatusBadge status={val || 'LIVE'} size="sm" />
      )
    },
    {
      key: 'groupName',
      label: 'Account Group',
      render: (val) => (
        <span className="text-[12px] text-text-muted/80 font-bold uppercase tracking-wide">
          {val || 'Standard'}
        </span>
      )
    },
    {
      key: 'server',
      label: 'MT5 Server',
      render: (val) => (
        <span className="font-mono text-[11.5px] text-text-muted/50">
          {val || 'N/A'}
        </span>
      )
    },
    {
      key: 'leverage',
      label: 'Leverage',
      render: (val) => (
        <span className="text-[12.5px] text-text font-bold font-mono">
          {val || '1:100'}
        </span>
      )
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (val) => (
        <span className="font-mono text-[13px] font-bold text-positive">
          {fmt(parseFloat(val || 0))}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedAccountId(row.accountid);
              setIsPasswordModalOpen(true);
            }}
            className="h-7 px-3 rounded-[6px] font-bold text-[11px] border border-brand/30 text-brand hover:bg-brand/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            Update Password
          </button>
        </div>
      )
    }
  ], [navigate]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-brand/80" />
          </span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6 animate-fade-up">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-section-eyebrow mb-1">Client Portal</p>
            <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">My Trading Accounts</h1>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-[9px] font-semibold text-[12.5px] transition-all duration-200 cursor-pointer active:scale-95 bg-brand text-text-on-accent hover:opacity-90"
          >
            <Plus size={13} strokeWidth={2.5} /> New MT5 Account
          </button>
        </div>

        {error && (
          <div className="p-4 bg-negative/10 border border-negative/20 rounded-[12px] flex items-center gap-3 text-negative">
            <ShieldAlert size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Stats Summary Cards */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Trading Equity', value: fmt(stats.totalBalance), desc: 'Aggregated account balances', color: 'brand', Icon: Wallet },
              { label: 'Active MT5 Accounts', value: stats.activeCount, desc: 'Live MetaTrader 5 accounts', color: 'positive', Icon: Monitor },
              { label: 'Max Account Leverage', value: stats.maxLeverage, desc: 'Maximum leverage ratio', color: 'cyan', Icon: Activity }
            ].map((c) => {
              const colorVar = `var(--${c.color})`;
              const dimVar = `color-mix(in srgb, ${colorVar} 12%, transparent)`;

              return (
                <Card
                  key={c.label}
                  padding={false}
                  className="border-t-[2px] hover:scale-[1.02] transition-transform duration-300"
                  style={{ borderTopColor: colorVar }}
                >
                  <div className="p-4 flex flex-col gap-2.5">
                    <div
                      style={{ background: dimVar, color: colorVar }}
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                    >
                      <c.Icon size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted mb-1 leading-none">
                        {c.label}
                      </p>
                      <p className="font-mono font-bold text-[16px] leading-tight" style={{ color: colorVar }}>
                        {c.value}
                      </p>
                      <p className="text-[10px] text-text-muted mt-1 leading-normal truncate">{c.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State vs Main Table */}
        {accounts.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-elevated border border-border/10 rounded-[16px]">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
              <Monitor size={32} className="text-brand" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">No Trading Accounts Found</h3>
            <p className="text-text-muted/70 text-sm max-w-md mb-6">
              You don't have any active MetaTrader 5 accounts. Create one now to start trading.
            </p>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-[9px] font-semibold text-[12.5px] transition-all duration-200 cursor-pointer active:scale-95 bg-brand text-text-on-accent hover:opacity-90"
            >
              Create First Account
            </button>
          </div>
        ) : (
          <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
            <TableToolbar
              title="MetaTrader 5 Accounts"
              count={accounts.length}
              accentColor="var(--brand)"
            />
            <MainTable
              columns={columns}
              data={accounts}
            />
          </section>
        )}
      </div>

      <ClientCreateAccountDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={() => fetchAccounts()} 
      />

      <UpdateMt5PasswordModal
        open={isPasswordModalOpen}
        accountId={selectedAccountId}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setToast('MT5 passwords updated successfully and emailed to you.');
          setTimeout(() => setToast(''), 4000);
        }}
      />

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in duration-200">
          <Toast msg={toast} />
        </div>
      )}
    </PageShell>
  );
}

