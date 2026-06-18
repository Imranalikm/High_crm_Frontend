import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpFromLine, Loader2 } from 'lucide-react';
import { Card, StatusBadge } from '@/components/ui';
import { financeApi } from '@/features/client-finance/services/finance.api';
import { METHOD_LABELS } from '@/shared/config/constants/finance';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

export function LatestWithdrawalsWidget() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchWithdraws = async () => {
      try {
        const rawWiths = await financeApi.getWithdrawals();
        if (active) {
          // Sort by date descending and take top 5
          const sorted = [...rawWiths]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setWithdrawals(sorted);
        }
      } catch (err) {
        console.error('Error fetching latest withdrawals:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchWithdraws();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center gap-2.5">
          <span 
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-negative"
            style={{ 
              background: 'color-mix(in srgb, var(--negative) 10%, transparent)', 
              border: '1px solid color-mix(in srgb, var(--negative) 20%, transparent)' 
            }}
          >
            <ArrowUpFromLine size={13} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-text-muted">Financials</p>
            <h2 className="font-heading font-bold text-[14px] tracking-[-0.03em] text-text leading-tight">
              Latest Withdrawals
            </h2>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/client/finance/withdraw')}
          className="rounded-[6px] px-2.5 py-1 text-[11px] font-bold border border-border bg-transparent text-text-muted hover:text-text hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
        >
          View All
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border/6 bg-surface/5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-text-muted">
            <Loader2 className="animate-spin text-brand" size={20} />
            <span className="text-[11px] mt-2 font-bold tracking-wider uppercase text-text-muted/60">Loading Withdrawals...</span>
          </div>
        ) : withdrawals.length > 0 ? (
          withdrawals.map((w) => {
            const amt = parseFloat(w.amount || 0);
            const statusMap = {
              'pending': 'PENDING',
              'approved': 'COMPLETED',
              'rejected': 'REJECTED',
              'failed': 'FAILED',
              'flagged': 'FLAGGED'
            };
            const statusVal = statusMap[w.status?.toLowerCase()] || w.status?.toUpperCase() || 'PENDING';
            const methodLabel = METHOD_LABELS[w.type] || w.type || 'Unknown';
            const dateStr = new Date(w.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div 
                key={w.id} 
                className="px-5 py-3 flex items-center justify-between hover:bg-surface-elevated/30 transition-all duration-150 cursor-default"
              >
                {/* Withdrawal ID & Date */}
                <div className="w-[120px] shrink-0">
                  <span className="font-mono text-[12.5px] font-bold text-brand block truncate">WDR-{w.id}</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">{dateStr}</span>
                </div>

                {/* Status Badge */}
                <div className="w-[90px] shrink-0">
                  <StatusBadge status={statusVal} size="sm" />
                </div>

                {/* Amount */}
                <div className="text-right flex-1 shrink-0">
                  <span 
                    className="font-mono text-[13.5px] font-bold text-negative"
                    style={{ textShadow: `0 0 12px color-mix(in srgb, var(--negative) 15%, transparent)` }}
                  >
                    -{fmt(amt)}
                  </span>
                  <span className="text-[9.5px] text-text-muted block mt-0.5">USD</span>
                </div>

              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-text-muted p-6 text-center">
            <span className="text-[12px] text-text-muted">No recent withdrawals found</span>
            <button
              onClick={() => navigate('/client/finance/withdraw')}
              className="mt-3 rounded-[6px] px-3 py-1.5 text-[11px] font-bold bg-brand text-text-on-accent hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Withdraw Funds
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default LatestWithdrawalsWidget;
