import React, { useState, useEffect } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Plus, Monitor, ShieldAlert, Activity, CheckCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ClientCreateAccountDrawer } from './ClientCreateAccountDrawer';
import { apiClient } from '@/shared/api/client/apiClient';

export function ClientAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/mt5-accounts');
      setAccounts(response?.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user accounts:', err);
      setError('Unable to load your trading accounts at this time.');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="space-y-6 animate-fade-up max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-elevated p-6 rounded-[16px] border border-border/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">My Trading Accounts</h1>
            <p className="text-sm text-text-muted/80 max-w-lg">
              Manage your connected MetaTrader 5 accounts, view real-time balances, and request new accounts.
            </p>
          </div>
          <Button 
            variant="brand" 
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 shadow-brand/20 hover:shadow-brand/40 transition-shadow"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus size={16} /> New MT5 Account
          </Button>
        </header>

        {error && (
          <div className="p-4 bg-negative/10 border border-negative/20 rounded-[12px] flex items-center gap-3 text-negative">
            <ShieldAlert size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {accounts.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-elevated border border-border/10 rounded-[16px]">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
              <Monitor size={32} className="text-brand" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">No Trading Accounts Found</h3>
            <p className="text-text-muted/70 text-sm max-w-md mb-6">
              You don't have any active MetaTrader 5 accounts. Create one now to start trading.
            </p>
            <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
              Create First Account
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {accounts.map(acc => (
              <div 
                key={acc.id}
                className="group relative bg-surface-elevated border border-border/10 rounded-[16px] overflow-hidden hover:border-brand/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)]"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-positive/10 border border-positive/20 text-positive text-[10px] font-bold uppercase">
                    <CheckCircle size={10} /> {acc.status || 'LIVE'}
                  </div>
                </div>

                <div className="p-6 pb-5">
                  <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Monitor size={24} className="text-brand" />
                  </div>
                  
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-text-muted/60">
                    MT5 Login ID
                  </div>
                  <div className="text-2xl font-black text-text font-mono mb-4 tracking-tight">
                    {acc.accountid}
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-bg/50 rounded-[10px] p-4 border border-border/5">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/60 mb-1 flex items-center gap-1">
                        <Wallet size={10} /> Balance
                      </div>
                      <div className="text-lg font-bold text-text">${parseFloat(acc.balance).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/60 mb-1 flex items-center gap-1">
                        <Activity size={10} /> Leverage
                      </div>
                      <div className="text-lg font-bold text-text">{acc.leverage}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/5 bg-bg/30 px-6 py-3 flex items-center justify-between text-[11px] font-semibold text-text-muted/60">
                  <span>Group: <span className="text-text-muted">{acc.groupName}</span></span>
                  <span>Server: <span className="text-text-muted">{acc.server}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClientCreateAccountDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={() => fetchAccounts()} 
      />
    </PageShell>
  );
}
