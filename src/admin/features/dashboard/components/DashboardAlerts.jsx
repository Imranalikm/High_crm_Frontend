import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const ALERTS = [
  { id: 1, level: 'critical', cat: 'RISK', title: 'Margin breach — Account #8821', text: 'Equity dropped 94% on open XAUUSD long. Auto-liquidation threshold breached.', stamp: '2m ago', path: '/admin/users/usr-18552/risk-view' },
  { id: 2, level: 'critical', cat: 'FINANCE', title: '$47,500 withdrawal pending', text: 'Bank wire above threshold. AML flag triggered.', stamp: '11m ago', path: '/admin/finance/withdrawals' },
  { id: 3, level: 'warning', cat: 'KYC', title: 'Document mismatch — #10043', text: 'Uploaded ID surname differs from registration.', stamp: '34m ago', path: '/admin/users/kyc' },
  { id: 4, level: 'warning', cat: 'COPY', title: 'Signal provider drawdown >12%', text: '"FX_Alpha" strategy hit 12.4% drawdown today. 231 followers impacted.', stamp: '51m ago', path: '/admin/copy-trading' },
];

const LEVEL_COLOR = {
  critical: 'var(--negative)',
  warning: 'var(--warning)',
  normal: 'var(--cyan)',
};

function AlertItem({ alert }) {
  const navigate = useNavigate();
  const color = LEVEL_COLOR[alert.level] ?? 'var(--text-muted)';
  const isCritical = alert.level === 'critical';

  return (
    <div
      className="relative rounded-[10px] border border-border/20 bg-bg/40 p-3.5 hover:bg-surface-elevated/45 hover:border-border/40 hover:scale-[1.015] hover:shadow-card-subtle transition-all duration-300 cursor-pointer group overflow-hidden"
      style={{ 
        borderLeft: `3px solid ${color}`,
      }}
      onClick={() => navigate(alert.path)}
    >
      {/* Decorative dynamic inset hover background gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 4%, transparent) 0%, transparent 100%)`
        }}
      />

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span
              className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border flex items-center gap-1"
              style={{ 
                color, 
                background: `color-mix(in srgb, ${color} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 20%, transparent)`
              }}
            >
              {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-negative animate-pulse" style={{ boxShadow: '0 0 6px var(--negative)' }} />}
              {alert.level}
            </span>
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-text-muted">
              {alert.cat}
            </span>
            <span className="ml-auto font-mono text-[11.5px] text-text-muted font-medium">{alert.stamp}</span>
          </div>
          <div className="text-[13.5px] font-semibold text-text leading-snug group-hover:text-primary transition-colors">
            {alert.title}
          </div>
          <div className="mt-1 text-[12.5px] leading-relaxed text-text-muted">{alert.text}</div>
        </div>
        <div className="shrink-0 pt-1">
          <span className="flex items-center justify-center h-6 w-6 rounded-md bg-bg/50 text-text-muted group-hover:text-text group-hover:bg-bg transition-colors border border-border/10 group-hover:border-border/30">
            <ChevronRight size={12} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function DashboardAlerts() {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-border/15 pb-3">
        <div>
          <div className="text-[15px] font-semibold text-text flex items-center gap-2 tracking-tight">
            <ShieldAlert size={14} className="text-negative" />
            Operations Queue
          </div>
          <div className="text-[12.5px] text-text-muted mt-0.5">
            <span className="text-negative font-bold">2 critical</span> • 2 warnings
          </div>
        </div>
      </div>
      <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
        {ALERTS.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </Card>
  );
}

export default DashboardAlerts;
