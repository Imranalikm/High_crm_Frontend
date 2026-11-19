import React, { useState } from 'react';
import { Bell, ArrowDownLeft, ArrowUpRight, Gift, Shield, Monitor, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useMyNotifications, markNotificationRead, markAllNotificationsRead } from '@/shared/hooks/useMyNotifications';

/* Notification type -> icon, colour and filter group */
const TYPE_META = {
  deposit:    { icon: ArrowDownLeft, color: 'var(--positive)', group: 'Finance' },
  withdrawal: { icon: ArrowUpRight,  color: 'var(--negative)', group: 'Finance' },
  balance:    { icon: Gift,          color: 'var(--cyan)',     group: 'Finance' },
  kyc:        { icon: Shield,        color: 'var(--positive)', group: 'Account' },
  account:    { icon: Monitor,       color: 'var(--brand)',    group: 'Account' },
};
const DEFAULT_META = { icon: Bell, color: 'var(--warning)', group: 'Platform' };

const FILTER_LABELS = ['All', 'Finance', 'Account', 'Platform'];

function timeAgo(date) {
  const s = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotificationsWidget() {
  const [filter, setFilter] = useState('All');
  const { items: raw, unreadCount: unread, loaded, error } = useMyNotifications();

  const items = raw.map((n) => {
    const meta = TYPE_META[String(n.type || '').toLowerCase()] || DEFAULT_META;
    return {
      id: n.id,
      icon: meta.icon,
      color: meta.color,
      group: meta.group,
      title: n.title,
      body: n.message,
      ts: timeAgo(n.createdAt),
      unread: !n.isRead,
    };
  });

  const filtered = items.filter((n) => filter === 'All' || n.group === filter);

  const markRead = (id) => markNotificationRead(id);
  const markAllRead = () => markAllNotificationsRead();

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center gap-2.5">
          <span className="relative">
            <span
              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-warning"
              style={{ background: 'color-mix(in srgb, var(--warning) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warning) 20%, transparent)' }}
            >
              <Bell size={13} strokeWidth={2} />
            </span>
            {unread > 0 && (
              <span
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8.5px] font-black flex items-center justify-center bg-negative text-text-on-accent"
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </span>
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-text-muted">Alerts</p>
            <h2 className="font-heading font-bold text-[14px] tracking-[-0.03em] text-text leading-tight">
              Notifications {unread > 0 ? `(${unread} new)` : ''}
            </h2>
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-[10.5px] font-black uppercase tracking-[0.1em] cursor-pointer hover:opacity-75 transition-opacity text-brand"
          >
            <CheckCheck size={11} />
            Mark read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="px-5 py-2 flex items-center gap-1 shrink-0 border-b border-border/10 bg-surface/10">
        {FILTER_LABELS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-2.5 py-0.5 rounded-[5px] text-[10.5px] font-bold transition-all duration-200 cursor-pointer"
            style={{
              background: filter === f ? 'color-mix(in srgb, var(--brand) 14%, transparent)' : 'transparent',
              color: filter === f ? 'var(--brand)' : 'var(--text-muted)',
              border: filter === f ? '1px solid color-mix(in srgb, var(--brand) 22%, transparent)' : '1px solid transparent',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface/5">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-[12px] text-text-muted">
              {!loaded ? 'Loading…' : error ? 'Could not load notifications' : 'No notifications here'}
            </p>
          </div>
        )}
        {filtered.map((n) => {
          const NIcon = n.icon;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className="relative px-5 py-2.5 flex items-start gap-3 border-b border-border/8 last:border-0 hover:bg-surface-elevated/20 transition-all duration-150 cursor-pointer"
              style={{
                background: n.unread ? 'color-mix(in srgb, var(--brand) 3%, transparent)' : 'transparent',
              }}
            >
              {/* Left accent bar for unread state */}
              {n.unread && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[70%] rounded-r-[2px] bg-brand" />
              )}

              {/* Icon */}
              <span
                className="w-7.5 h-7.5 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: `color-mix(in srgb, ${n.color} 10%, transparent)`,
                  color: n.color,
                  border: `1px solid color-mix(in srgb, ${n.color} 15%, transparent)`,
                }}
              >
                <NIcon size={13} strokeWidth={1.8} />
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-[12.5px] leading-snug truncate ${n.unread ? 'font-bold text-text' : 'font-medium text-text-muted'}`}>
                    {n.title}
                  </p>
                  {n.unread && (
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-brand animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5 leading-normal line-clamp-2" title={n.body}>{n.body}</p>
                <p className="text-[9.5px] mt-1 font-mono text-text-muted">{n.ts}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
export default NotificationsWidget;
