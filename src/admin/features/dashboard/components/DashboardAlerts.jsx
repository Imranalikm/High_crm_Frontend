import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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

export function DashboardAlerts({ actionItems, loading }) {
  if (loading) {
    return (
      <Card className="flex flex-col animate-pulse">
        <div className="h-6 w-32 bg-surface-elevated/85 rounded mb-2" />
        <div className="h-4 w-48 bg-surface-elevated/65 rounded mb-4" />
        <div className="space-y-2.5">
          <div className="h-20 bg-surface-elevated/40 rounded" />
          <div className="h-20 bg-surface-elevated/40 rounded" />
        </div>
      </Card>
    );
  }

  const items = actionItems || [];
  const criticalCount = items.filter((item) => item.level === 'critical').length;
  const warningCount = items.filter((item) => item.level === 'warning').length;

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-border/15 pb-3">
        <div>
          <div className="text-[15px] font-semibold text-text flex items-center gap-2 tracking-tight">
            <ShieldAlert size={14} className="text-negative" />
            Operations Queue
          </div>
          <div className="text-[12.5px] text-text-muted mt-0.5">
            {items.length === 0 ? (
              <span className="text-positive font-medium">All tasks completed</span>
            ) : (
              <>
                {criticalCount > 0 && <span className="text-negative font-bold">{criticalCount} critical</span>}
                {criticalCount > 0 && warningCount > 0 && ' • '}
                {warningCount > 0 && <span className="text-warning font-semibold">{warningCount} warning{warningCount > 1 ? 's' : ''}</span>}
                {items.length > 0 && ' needing review'}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border/20 rounded-[10px] bg-bg/10">
            <CheckCircle2 size={32} className="text-positive mb-2.5 opacity-80" />
            <div className="text-[13.5px] font-semibold text-text">Queue is clear!</div>
            <p className="text-[12.5px] text-text-muted mt-1 max-w-[200px]">No pending KYC, withdrawals, or tickets require action.</p>
          </div>
        ) : (
          items.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </Card>
  );
}

export default DashboardAlerts;
