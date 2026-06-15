import {
  Activity,
  X, XCircle, Shield, Flag, Check, Eye,
  TrendingUp, TrendingDown, Clock, CheckCircle2,
} from 'lucide-react';
import { DrawerSection, DrawerField, DrawerFormGrid } from '@/components/common/drawer';
import { TradingQuickActions } from './TradingDrawer';

/* ── Banners ─────────────────────────────────────────────────── */
function OrderStatusBanner({ status, side, volume }) {
  const statusColors = {
    PENDING: 'var(--warning)',
    FILLED: 'var(--positive)',
    CANCELED: 'var(--text-muted)',
    REJECTED: 'var(--negative)',
  };
  const statusColor = statusColors[status] || 'var(--text-muted)';

  let StatusIcon = Activity;
  let labelText = 'Order Details';

  if (status === 'FILLED') {
    StatusIcon = CheckCircle2;
    labelText = 'Filled';
  } else if (status === 'CANCELED') {
    StatusIcon = X;
    labelText = 'Canceled';
  } else if (status === 'REJECTED') {
    StatusIcon = XCircle;
    labelText = 'Rejected';
  } else if (status === 'PENDING') {
    StatusIcon = Clock;
    labelText = 'Pending';
  }

  return (
    <div
      className="rounded-[14px] border p-5 relative overflow-hidden animate-fade-in duration-300"
      style={{
        borderColor: `color-mix(in srgb, ${statusColor} 20%, var(--border))`,
        background: `color-mix(in srgb, ${statusColor} 4%, var(--bg))`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: statusColor }}
      />

      <div className="flex items-start justify-between gap-4 relative z-[1]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[11px] flex items-center justify-center border flex-shrink-0"
            style={{
              background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${statusColor} 22%, transparent)`,
            }}
          >
            <StatusIcon size={20} style={{ color: statusColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: statusColor }}
              >
                {labelText}
              </span>
            </div>
            <div className="text-[22px] font-semibold tracking-tight text-text font-mono leading-tight mt-1">
              {status}
            </div>
            <div className="text-[12.5px] font-mono text-text-muted/75 mt-1">
              {side} · {volume} Lots
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span 
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border font-heading"
            style={{
              color: statusColor,
              borderColor: `color-mix(in srgb, ${statusColor} 20%, var(--border))`,
              background: `color-mix(in srgb, ${statusColor} 8%, transparent)`,
            }}
          >
            {side}
          </span>
        </div>
      </div>
    </div>
  );
}

function PositionPnLBanner({ pnl, side, size }) {
  const pnlPositive = String(pnl).startsWith('+');
  const accentColor = pnlPositive ? 'var(--positive)' : 'var(--negative)';
  const PnlIcon = pnlPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className="rounded-[14px] border p-5 relative overflow-hidden animate-fade-in duration-300"
      style={{
        borderColor: `color-mix(in srgb, ${accentColor} 20%, var(--border))`,
        background: `color-mix(in srgb, ${accentColor} 4%, var(--bg))`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className="flex items-start justify-between gap-4 relative z-[1]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[11px] flex items-center justify-center border flex-shrink-0"
            style={{
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${accentColor} 22%, transparent)`,
            }}
          >
            <PnlIcon size={20} style={{ color: accentColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: accentColor }}
              >
                Profit/Loss
              </span>
            </div>
            <div 
              className="text-[24px] font-semibold tracking-tight text-text font-mono leading-tight mt-1"
              style={{ color: accentColor }}
            >
              {pnl}
            </div>
            <div className="text-[12.5px] font-mono text-text-muted/75 mt-1">
              Active Trade · {side} ({size} Lots)
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span 
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border font-heading"
            style={{
              color: side === 'BUY' ? 'var(--positive)' : 'var(--negative)',
              borderColor: `color-mix(in srgb, ${side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} 20%, var(--border))`,
              background: `color-mix(in srgb, ${side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} 8%, transparent)`,
            }}
          >
            {side}
          </span>
        </div>
      </div>
    </div>
  );
}

function HistoryResultBanner({ status, pnl, ticket, side, size }) {
  const isWin = status === 'WIN';
  const statusColor = isWin ? 'var(--positive)' : 'var(--negative)';
  const StatusIcon = isWin ? TrendingUp : TrendingDown;

  return (
    <div
      className="rounded-[14px] border p-5 relative overflow-hidden animate-fade-in duration-300"
      style={{
        borderColor: `color-mix(in srgb, ${statusColor} 20%, var(--border))`,
        background: `color-mix(in srgb, ${statusColor} 4%, var(--bg))`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: statusColor }}
      />

      <div className="flex items-start justify-between gap-4 relative z-[1]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[11px] flex items-center justify-center border flex-shrink-0"
            style={{
              background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${statusColor} 22%, transparent)`,
            }}
          >
            <StatusIcon size={20} style={{ color: statusColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: statusColor }}
              >
                Trade Result · {isWin ? 'Profit' : 'Loss'}
              </span>
            </div>
            <div 
              className="text-[24px] font-semibold tracking-tight text-text font-mono leading-tight mt-1"
              style={{ color: statusColor }}
            >
              {pnl}
            </div>
            <div className="text-[12.5px] font-mono text-text-muted/75 mt-1">
              Ticket #{ticket} · {side} ({size} Lots)
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span 
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border font-heading"
            style={{
              color: statusColor,
              borderColor: `color-mix(in srgb, ${statusColor} 20%, var(--border))`,
              background: `color-mix(in srgb, ${statusColor} 8%, transparent)`,
            }}
          >
            {isWin ? '✓ WIN' : '✗ LOSS'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── OrderDetailsDrawer ───────────────────────────────────────── */
export function OrderDetailsDrawer({ row, onAction }) {
  const actions = [
    { label: 'Cancel',       color: 'var(--negative)', icon: X,        onClick: () => onAction('Cancel Order') },
    { label: 'Acknowledge',  color: 'var(--cyan)',     icon: Check,     onClick: () => onAction('Acknowledge') },
    { label: 'History',      color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
    { label: 'Flag',         color: 'var(--warning)',  icon: Flag,      onClick: () => onAction('Flag Order') },
  ];

  const statusColors = {
    PENDING: 'var(--warning)',
    FILLED: 'var(--positive)',
    CANCELED: 'var(--text-muted)',
    REJECTED: 'var(--negative)',
  };
  const statusColor = statusColors[row.status] || 'var(--text-muted)';

  return (
    <div className="space-y-6">
      {/* Premium Order Status Banner */}
      <OrderStatusBanner
        status={row.status}
        side={row.side}
        volume={row.volume}
      />

      <DrawerSection title="Details">
        <DrawerFormGrid>
          <DrawerField label="Ticket"      value={row.ticket}    mono />
          <DrawerField label="Symbol"      value={row.symbol}    mono />
          <DrawerField label="Side"        value={row.side}      accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Type"        value={row.orderType} />
          <DrawerField label="Volume"      value={`${row.volume} lots`} mono />
          <DrawerField label="Price"       value={row.price}     mono />
          <DrawerField label="Stop Loss"   value={row.sl}        mono accent="var(--negative)" />
          <DrawerField label="Take Profit" value={row.tp}        mono accent="var(--positive)" />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Execution">
        <DrawerFormGrid>
          <DrawerField label="Status" value={row.status} accent={statusColor} />
          <DrawerField label="Source" value={row.source} />
          <DrawerField label="Time"   value={row.time}   mono />
          <DrawerField label="User"   value={row.user}   />
          <DrawerField label="UID"    value={row.uid}    mono />
        </DrawerFormGrid>
      </DrawerSection>

      {row.status === 'REJECTED' && (
        <DrawerSection title="Reason" className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="rounded-[12px] border border-negative/25 bg-negative/5 px-4 py-3 text-[12px] text-negative/80 leading-relaxed font-medium">
            Order rejected — market was closed for the requested instrument. No position opened.
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Actions">
        <TradingQuickActions actions={actions} />
      </DrawerSection>
    </div>
  );
}

/* ── PositionDetailsDrawer ───────────────────────────────────── */
export function PositionDetailsDrawer({ row, onAction }) {
  const actions = [
    { label: 'Close',      color: 'var(--negative)', icon: XCircle,  onClick: () => onAction('Close Position') },
    { label: 'Monitor',    color: 'var(--positive)', icon: Eye,       onClick: () => onAction('Monitor') },
    { label: 'Edit SL/TP', color: 'var(--warning)',  icon: Shield,    onClick: () => onAction('Set SL/TP') },
    { label: 'History',    color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
  ];

  return (
    <div className="space-y-6">
      {/* Floating PnL Banner */}
      <PositionPnLBanner
        pnl={row.pnl}
        side={row.side}
        size={row.size}
      />

      <DrawerSection title="Details">
        <DrawerFormGrid>
          <DrawerField label="Ticket"        value={row.ticket}    mono />
          <DrawerField label="Symbol"        value={row.symbol}    mono />
          <DrawerField label="Side"          value={row.side}      accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Size"          value={`${row.size} lots`} mono />
          <DrawerField label="Open Price"    value={row.openPrice} mono />
          <DrawerField label="Current Price" value={row.currPrice} mono />
          <DrawerField label="Swap"          value={row.swap}      mono />
          <DrawerField label="Margin"        value={row.margin}    mono accent="var(--warning)" />
          <DrawerField label="Duration"      value={row.duration}  />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="User">
        <div 
          className="rounded-[12px] border bg-bg/20 p-4 space-y-4 animate-in fade-in duration-300"
          style={{ borderColor: 'color-mix(in srgb, var(--brand) 12%, var(--border))' }}
        >
          <div className="flex items-center gap-3.5">
            <div 
              className="w-10 h-10 rounded-[11px] border flex items-center justify-center text-[13px] font-bold text-brand font-heading flex-shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--brand) 20%, transparent)',
              }}
            >
              {row.user?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold font-heading text-text tracking-tight truncate">{row.user}</div>
              <div className="text-[11.5px] font-mono text-text-muted/75 mt-0.5 truncate">User ID: {row.uid || '—'}</div>
            </div>
            <div 
              className="px-2.5 py-0.5 rounded-[5px] border border-border/20 text-[11px] font-mono font-semibold text-text-muted/75 bg-bg/40 flex-shrink-0"
            >
              LIVE
            </div>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Actions">
        <TradingQuickActions actions={actions} />
      </DrawerSection>
    </div>
  );
}

/* ── HistoryDetailsDrawer ────────────────────────────────────── */
export function HistoryDetailsDrawer({ row }) {
  const isWin = row.status === 'WIN';
  const statusColor = isWin ? 'var(--positive)' : 'var(--negative)';

  return (
    <div className="space-y-6">
      {/* WIN / LOSS Result Banner */}
      <HistoryResultBanner
        status={row.status}
        pnl={row.pnl}
        ticket={row.ticket}
        symbol={row.symbol}
        side={row.side}
        size={row.size}
      />

      <DrawerSection title="Details">
        <DrawerFormGrid>
          <DrawerField label="Ticket"      value={row.ticket}     mono />
          <DrawerField label="Symbol"      value={row.symbol}     mono />
          <DrawerField label="Side"        value={row.side}       accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Size"        value={`${row.size} lots`} mono />
          <DrawerField label="Open Price"  value={row.openPrice}  mono />
          <DrawerField label="Close Price" value={row.closePrice} mono />
          <DrawerField label="Profit/Loss"  value={row.pnl}        mono accent={statusColor} wide />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Time">
        <DrawerFormGrid>
          <DrawerField label="Opened"  value={row.openTime}  mono />
          <DrawerField label="Closed"  value={row.closeTime} mono />
          <DrawerField label="Account" value={row.account}   mono />
          <DrawerField label="User"    value={row.user}      />
        </DrawerFormGrid>
      </DrawerSection>
    </div>
  );
}
