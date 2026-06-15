import React from 'react';

/**
 * Custom status badge for quick color/health representation
 */
function StatusChip({ status }) {
  const map = {
    CONNECTED: { c: 'var(--positive)', label: 'Connected' },
    ACTIVE: { c: 'var(--positive)', label: 'Active' },
    HEALTHY: { c: 'var(--positive)', label: 'Healthy' },
    DEGRADED: { c: 'var(--warning)', label: 'Degraded' },
    TEST: { c: 'var(--warning)', label: 'Test Mode' },
    PENDING: { c: 'var(--warning)', label: 'Pending' },
    DISCONNECTED: { c: 'var(--negative)', label: 'Disconnected' },
    ERROR: { c: 'var(--negative)', label: 'Error' },
    DISABLED: { c: 'var(--text-muted)', label: 'Disabled' },
  };
  const cfg = map[status] || map.PENDING;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading transition-all"
      style={{
        color: cfg.c,
        background: `color-mix(in srgb, ${cfg.c} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${cfg.c} 22%, transparent)`,
      }}
    >
      <span
        className="w-1 h-1 rounded-full flex-shrink-0 animate-pulse"
        style={{ background: cfg.c }}
      />
      {cfg.label}
    </span>
  );
}

/**
 * IntegrationStatusCard — Renders individual third-party integrations (e.g. MT5, stripe, sumsub)
 * displays latency, live uptime statistics, and real-time connectivity states.
 */
export function IntegrationStatusCard({ name, status, uptime, latency, icon: Icon }) {
  const isHealthy = status === 'CONNECTED' || status === 'HEALTHY';
  const isDegraded = status === 'DEGRADED';
  
  return (
    <div
      className="group rounded-[10px] border border-border/40 bg-surface-elevated hover:bg-muted-surface/10 hover:border-border/60 p-4 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8.5 h-8.5 rounded-[8px] bg-muted-surface border border-border/40 flex items-center justify-center transition-all group-hover:scale-105">
              <Icon size={14} className="text-text-muted/60 group-hover:text-text-muted transition-colors" />
            </div>
          )}
          <span className="text-[12px] font-semibold font-heading text-text/85 group-hover:text-text transition-colors">
            {name}
          </span>
        </div>
        <StatusChip status={status} />
      </div>

      <div className="flex items-center gap-4 text-[10.5px] font-heading text-text-muted/65 relative z-10">
        <div className="space-y-0.5">
          <span className="block text-[8.5px] uppercase tracking-wider text-text-muted/40">Uptime</span>
          <span className="font-bold text-text/75">{uptime}</span>
        </div>
        <div className="h-6 w-px bg-border/20" />
        <div className="space-y-0.5">
          <span className="block text-[8.5px] uppercase tracking-wider text-text-muted/40">Latency</span>
          <span className="font-bold text-text/75">{latency}</span>
        </div>
      </div>

      {/* Decorative background aura reflecting service health */}
      <span
        className={`absolute -right-6 -bottom-6 w-12 h-12 rounded-full blur-[24px] opacity-15 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none
          ${isHealthy ? 'bg-positive' : isDegraded ? 'bg-warning' : 'bg-negative'}`}
      />
    </div>
  );
}

export default IntegrationStatusCard;
