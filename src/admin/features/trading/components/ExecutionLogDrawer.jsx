import React, { useState } from 'react';
import { RefreshCw, Check, AlertTriangle, Terminal } from 'lucide-react';
import { TradingDrawer, TradingQuickActions } from './TradingDrawer';
import { DrawerSection, DrawerField, DrawerFormGrid } from '@/components/common/drawer';

const SEVERITY_META = {
  INFO:     { color: 'var(--positive)', bg: 'bg-positive/8 border-positive/20',   label: 'ℹ INFO' },
  WARN:     { color: 'var(--warning)',  bg: 'bg-warning/8 border-warning/20',     label: '⚠ WARNING' },
  ERROR:    { color: 'var(--negative)', bg: 'bg-negative/8 border-negative/20',   label: '✗ ERROR' },
  CRITICAL: { color: 'var(--negative)', bg: 'bg-negative/12 border-negative/30',  label: '⚡ CRITICAL' },
};

/**
 * ExecutionLogDrawer: Specialized drawer for Execution Log details.
 */
export function ExecutionLogDrawer({ open, row, onClose }) {
  const [actionDone, setActionDone] = useState(null);

  if (!row) return null;

  const actions = [
    { label: 'Retry Event', color: 'var(--cyan)',     icon: RefreshCw,    onClick: () => setActionDone('Retry Scheduled') },
    { label: 'Acknowledge', color: 'var(--positive)', icon: Check,        onClick: () => setActionDone('Acknowledged') },
    { label: 'Escalate',    color: 'var(--negative)', icon: AlertTriangle, onClick: () => setActionDone('Escalated') },
    { label: 'Debug Trace', color: 'var(--text-muted)', icon: Terminal,   onClick: () => setActionDone('Debug Trace Opened') },
  ];

  const showActions = row.severity === 'ERROR' || row.severity === 'CRITICAL' || row.severity === 'WARN';
  const sevMeta = SEVERITY_META[row.severity] ?? SEVERITY_META.INFO;

  return (
    <TradingDrawer
      open={open}
      eyebrow="Execution Event Review"
      title={row.eventId}
      subtitle={`${row.type} · Bridge: ${row.bridge}`}
      onClose={onClose}
      actionDone={actionDone}
      width="max-w-[720px]"
    >
      <div className="space-y-6">
        {/* Severity Banner */}
        <div
          className="rounded-[14px] border p-5 relative overflow-hidden animate-fade-in duration-300"
          style={{
            borderColor: `color-mix(in srgb, ${sevMeta.color} 20%, var(--border))`,
            background: `color-mix(in srgb, ${sevMeta.color} 4%, var(--bg))`,
          }}
        >
          {/* Background glow */}
          <div
            className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] pointer-events-none"
            style={{ background: sevMeta.color }}
          />

          <div className="flex items-start justify-between gap-4 relative z-[1]">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-[11px] flex items-center justify-center border flex-shrink-0"
                style={{
                  background: `color-mix(in srgb, ${sevMeta.color} 12%, transparent)`,
                  borderColor: `color-mix(in srgb, ${sevMeta.color} 22%, transparent)`,
                }}
              >
                <Terminal size={20} style={{ color: sevMeta.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: sevMeta.color }}
                  >
                    Severity Level
                  </span>
                </div>
                <div 
                  className="text-[22px] font-semibold tracking-tight leading-tight mt-1"
                  style={{ color: sevMeta.color }}
                >
                  {sevMeta.label}
                </div>
                <div className="text-[12.5px] font-mono text-text-muted/75 mt-1">
                  Bridge: {row.bridge} · {row.timestamp}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span 
                className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border font-heading"
                style={{
                  color: sevMeta.color,
                  borderColor: `color-mix(in srgb, ${sevMeta.color} 20%, var(--border))`,
                  background: `color-mix(in srgb, ${sevMeta.color} 8%, transparent)`,
                }}
              >
                {row.latency}
              </span>
            </div>
          </div>
        </div>

        <DrawerSection title="Event Context">
          <DrawerFormGrid>
            <DrawerField label="Event ID"    value={row.eventId}   mono />
            <DrawerField label="Type"        value={row.type}      />
            <DrawerField label="Bridge"      value={row.bridge}    mono />
            <DrawerField label="Symbol"      value={row.symbol}    />
            <DrawerField
              label="Latency"
              value={row.latency}
              mono
              accent={
                parseInt(row.latency) > 500
                  ? 'var(--negative)'
                  : parseInt(row.latency) > 200
                  ? 'var(--warning)'
                  : 'var(--positive)'
              }
            />
            <DrawerField label="Status Code" value={row.code}      mono />
            <DrawerField label="Severity"    value={row.severity}  />
            <DrawerField label="Timestamp"   value={row.timestamp} mono />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Deep Detail">
          <div className="rounded-[12px] border border-border/20 bg-bg/60 px-4 py-3.5 font-mono text-[12px] leading-relaxed text-text/85">
            {row.detail}
          </div>
        </DrawerSection>

        {showActions && (
          <DrawerSection title="Resolution Actions">
            <TradingQuickActions actions={actions} />
          </DrawerSection>
        )}
      </div>
    </TradingDrawer>
  );
}
