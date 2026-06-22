import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '../hooks/useDashboardData';

export function DashboardChart({ financeSummary, loading }) {
  if (loading || !financeSummary) {
    return (
      <Card className="h-full p-6 animate-pulse">
        <div className="h-6 w-48 bg-surface-elevated/80 rounded mb-4" />
        <div className="h-4 w-72 bg-surface-elevated/60 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-20 bg-surface-elevated/40 rounded" />
          <div className="h-20 bg-surface-elevated/40 rounded" />
          <div className="h-20 bg-surface-elevated/40 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-surface-elevated/30 rounded" />
          <div className="h-8 bg-surface-elevated/30 rounded" />
        </div>
      </Card>
    );
  }

  const { deposits, withdrawals, netFlow } = financeSummary;
  const isPositiveFlow = netFlow >= 0;

  return (
    <Card className="h-full p-0 overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-5 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[15px] font-semibold text-text flex items-center gap-2">
              <Scale size={16} className="text-brand animate-pulse" />
              Liquidity &amp; Capital Flow
            </div>
            <div className="text-[12.5px] text-text-muted mt-1">
              Overview of system deposits, withdrawals, and net treasury movement.
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide border"
            style={{
              color: isPositiveFlow ? 'var(--positive)' : 'var(--negative)',
              backgroundColor: isPositiveFlow
                ? 'color-mix(in srgb, var(--positive) 10%, transparent)'
                : 'color-mix(in srgb, var(--negative) 10%, transparent)',
              borderColor: isPositiveFlow
                ? 'color-mix(in srgb, var(--positive) 20%, transparent)'
                : 'color-mix(in srgb, var(--negative) 20%, transparent)',
            }}
          >
            {isPositiveFlow ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            Net: {formatCurrency(netFlow)}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-6 bg-surface/10">
        {/* Main Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deposits Card */}
          <div className="relative rounded-[12px] border border-border/15 bg-bg/30 p-4 transition-all duration-300 hover:border-border/30 hover:scale-[1.01] hover:shadow-card-subtle group">
            <div className="absolute top-0 left-0 h-[3px] w-[40px] rounded-tr-[3px] rounded-bl-[3px] bg-positive" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-text-muted">Total Deposits</span>
              <div className="h-7 w-7 rounded-lg bg-positive/10 flex items-center justify-center text-positive group-hover:scale-110 transition-transform">
                <ArrowDownRight size={14} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-2 text-[24px] font-bold text-positive tracking-tight">
              {formatCurrency(deposits.totalAmount)}
            </div>
            <div className="mt-1 text-[12px] text-text-muted flex items-center justify-between border-t border-border/10 pt-2">
              <span>Transactions: <b className="text-text">{formatNumber(deposits.total)}</b></span>
              <span>Approved: <b className="text-text">{formatCurrency(deposits.approvedAmount)}</b></span>
            </div>
          </div>

          {/* Withdrawals Card */}
          <div className="relative rounded-[12px] border border-border/15 bg-bg/30 p-4 transition-all duration-300 hover:border-border/30 hover:scale-[1.01] hover:shadow-card-subtle group">
            <div className="absolute top-0 left-0 h-[3px] w-[40px] rounded-tr-[3px] rounded-bl-[3px] bg-negative" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-text-muted">Total Withdrawals</span>
              <div className="h-7 w-7 rounded-lg bg-negative/10 flex items-center justify-center text-negative group-hover:scale-110 transition-transform">
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-2 text-[24px] font-bold text-negative tracking-tight">
              {formatCurrency(withdrawals.totalAmount)}
            </div>
            <div className="mt-1 text-[12px] text-text-muted flex items-center justify-between border-t border-border/10 pt-2">
              <span>Transactions: <b className="text-text">{formatNumber(withdrawals.total)}</b></span>
              <span>Approved: <b className="text-text">{formatCurrency(withdrawals.approvedAmount)}</b></span>
            </div>
          </div>
        </div>

        {/* Detailed Status Breakdown */}
        <div className="space-y-4">
          <div className="text-[13px] font-semibold text-text tracking-tight flex items-center gap-1.5">
            <Wallet size={13} className="text-brand" />
            Status &amp; Volume Breakdown
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Deposits breakdown */}
            <div className="rounded-[10px] border border-border/10 bg-surface-elevated/20 p-3.5 space-y-3">
              <div className="text-[11.5px] font-bold text-text-muted uppercase tracking-wider pb-1.5 border-b border-border/10 flex justify-between items-center">
                <span>Deposits Status</span>
                <span className="text-[10px] text-positive font-mono">INFLOW</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-positive" />
                    Approved
                  </span>
                  <span className="font-semibold text-text">
                    {formatCurrency(deposits.approvedAmount)}{' '}
                    <span className="text-[11px] text-text-muted font-normal">({deposits.approved})</span>
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Pending
                  </span>
                  <span className="font-semibold text-text">
                    {formatCurrency(deposits.pendingAmount)}{' '}
                    <span className="text-[11px] text-text-muted font-normal">({deposits.pending})</span>
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-negative" />
                    Rejected
                  </span>
                  <span className="font-semibold text-text">
                    {formatCurrency(deposits.rejectedAmount)}{' '}
                    <span className="text-[11px] text-text-muted font-normal">({deposits.rejected})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Withdrawals breakdown */}
            <div className="rounded-[10px] border border-border/10 bg-surface-elevated/20 p-3.5 space-y-3">
              <div className="text-[11.5px] font-bold text-text-muted uppercase tracking-wider pb-1.5 border-b border-border/10 flex justify-between items-center">
                <span>Withdrawals Status</span>
                <span className="text-[10px] text-negative font-mono">OUTFLOW</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-positive" />
                    Approved
                  </span>
                  <span className="font-semibold text-text">
                    {formatCurrency(withdrawals.approvedAmount)}{' '}
                    <span className="text-[11px] text-text-muted font-normal">({withdrawals.approved})</span>
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Pending
                  </span>
                  <span className="font-semibold text-text">
                    {formatCurrency(withdrawals.pendingAmount)}{' '}
                    <span className="text-[11px] text-text-muted font-normal">({withdrawals.pending})</span>
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-negative" />
                    Rejected
                  </span>
                  <span className="font-semibold text-text">
                    {formatCurrency(withdrawals.rejectedAmount)}{' '}
                    <span className="text-[11px] text-text-muted font-normal">({withdrawals.rejected})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DashboardChart;
