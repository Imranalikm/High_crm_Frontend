import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine, ArrowUpFromLine, MonitorCheck,
  Server, Cpu, ShieldCheck, Eye, EyeOff, Wallet, TrendingUp, Landmark, Layers
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/shared/api/client/apiClient';

export function WelcomeBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);
  const [mt5Account, setMt5Account] = useState(null);
  
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await apiClient.get('/mt5-accounts');
        const accounts = response?.data || response || [];
        const arr = Array.isArray(accounts) ? accounts : [];
        if (arr.length > 0) {
          // Sort by balance descending to show the most active account, or just pick the first
          setMt5Account(arr[0]);
        }
      } catch (err) {
        console.error('Error fetching mt5 accounts for banner:', err);
      }
    };
    fetchAccount();
  }, []);
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.name || 'Trader';
  
  // Map fetched data or use zeroed fallbacks
  const login = mt5Account?.accountid || 'No Account';
  const server = mt5Account?.server || '—';
  const leverage = mt5Account?.leverage || '—';
  const type = mt5Account?.status || 'N/A';
  
  const balance = parseFloat(mt5Account?.balance || 0);
  const equity = balance; // In a real MT5 integration this would be dynamic equity
  const freeMargin = balance;
  const usedMargin = 0;
  
  // PnL placeholders since these require live MT5 streaming API which isn't wired yet
  const todayPnl = 0;
  const todayPnlPct = 0;
  const openPositions = 0;
  
  const pnlPos = todayPnl >= 0;

  return (
    <Card className="p-0 overflow-hidden" padding={false}>
      <div className="p-6 lg:p-7 relative z-10 flex flex-col gap-6">
        
        {/* Top row: Identity + Quick Actions */}
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
          
          {/* Identity & Equity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2.5">
              <div 
                className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
                style={{ 
                  background: 'color-mix(in srgb, var(--brand) 10%, transparent)', 
                  border: '1px solid color-mix(in srgb, var(--brand) 20%, transparent)',
                  color: 'var(--brand)'
                }}
              >
                <Cpu size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted leading-none mb-1">
                  {greeting}
                </p>
                <h1 className="font-heading font-bold text-[20px] tracking-[-0.03em] text-text leading-tight">
                  {displayName}
                </h1>
              </div>
            </div>

            {/* Account Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[12px] text-text-muted">
              <div>
                <span className="text-text-muted">Account:</span> <span className="font-mono font-semibold text-text">{login}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-border/40 hidden sm:block" />
              <div>
                <span className="text-text-muted">Server:</span> <span className="font-mono font-semibold text-text">{server}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-border/40 hidden sm:block" />
              <div>
                <span className="text-text-muted">Leverage:</span> <span className="font-mono font-semibold text-text">{leverage}</span>
              </div>
              
              {/* Status Tags */}
              <div className="flex items-center gap-2 ml-1 sm:ml-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[9.5px] font-bold tracking-wider bg-positive/8 border border-positive/20 text-positive">
                  <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                  {type}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[9.5px] font-bold tracking-wider bg-positive/8 border border-positive/20 text-positive">
                  <ShieldCheck size={11} />
                  KYC Verified
                </span>
              </div>
            </div>

            {/* Balances / Equity */}
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted flex items-center gap-1.5 mb-1">
                  Equity
                  <button 
                    onClick={() => setHideBalance(!hideBalance)} 
                    className="text-text-muted hover:text-text cursor-pointer outline-none"
                  >
                    {hideBalance ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
                <p className="font-mono font-black text-[28px] tracking-[-0.04em] text-text leading-none">
                  {hideBalance ? '••••••' : `$${equity.toLocaleString('en-US', {minimumFractionDigits: 2})}`}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted mb-1">
                  Today's P&L
                </div>
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span 
                    className={`font-mono font-bold text-[18px] ${pnlPos ? 'text-positive' : 'text-negative'}`}
                    style={{ textShadow: `0 0 16px color-mix(in srgb, var(--${pnlPos ? 'positive' : 'negative'}) 15%, transparent)` }}
                  >
                    {pnlPos ? '+' : ''}${Math.abs(todayPnl).toLocaleString()}
                  </span>
                  <span className={`font-mono text-[12.5px] font-semibold ${pnlPos ? 'text-positive' : 'text-negative'}`}>
                    ({pnlPos ? '+' : ''}{todayPnlPct}%)
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap xl:flex-col gap-2 shrink-0 xl:self-center">
            <button
              onClick={() => navigate('/client/finance/deposit')}
              className="flex items-center gap-2 h-9 px-4 rounded-[6px] font-bold text-[12.5px] tracking-[-0.01em] cursor-pointer transition-colors duration-150 bg-brand text-text-on-accent hover:opacity-90"
            >
              <ArrowDownToLine size={13} strokeWidth={2.2} />
              Deposit Funds
            </button>
            <button
              onClick={() => navigate('/client/finance/withdraw')}
              className="flex items-center gap-2 h-9 px-4 rounded-[6px] font-bold text-[12.5px] tracking-[-0.01em] cursor-pointer transition-colors duration-150 border border-border/60 bg-transparent text-text hover:bg-white/[0.02]"
            >
              <ArrowUpFromLine size={13} strokeWidth={2} />
              Withdraw Funds
            </button>
            <button
              onClick={() => navigate('/client/trading')}
              className="flex items-center gap-2 h-9 px-4 rounded-[6px] font-bold text-[12.5px] tracking-[-0.01em] cursor-pointer transition-colors duration-150 border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10"
            >
              <MonitorCheck size={13} strokeWidth={2} />
              Open Trading Terminal
            </button>
          </div>

        </div>

        {/* Bottom row: Balance Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-border/10">
          {[
            { label: 'Balance', val: `$${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}`, color: 'var(--brand)', icon: Wallet },
            { label: 'Free Margin', val: `$${freeMargin.toLocaleString('en-US', {minimumFractionDigits: 2})}`, color: 'var(--cyan)', icon: Landmark },
            { label: 'Margin Used', val: `$${usedMargin.toLocaleString('en-US', {minimumFractionDigits: 2})}`, color: 'var(--warning)', icon: Layers },
            { label: 'Open Trades', val: openPositions, color: 'var(--text)', icon: TrendingUp },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 text-text-muted"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
              >
                <item.icon size={13} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-text-muted leading-none mb-1">
                  {item.label}
                </p>
                <p className="text-[14px] font-bold font-mono text-text leading-none">
                  {item.val}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Card>
  );
}
