import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Copy, CreditCard, Search, Terminal, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const QUICK_ACTIONS = [
  { label: 'Approve KYC Requests', Icon: UserCheck, path: '/admin/users/kyc', accent: 'var(--positive)' },
  { label: 'Review Withdrawals', Icon: CreditCard, path: '/admin/finance/withdrawals', accent: 'var(--warning)' },
  { label: 'User Master Directory', Icon: Search, path: '/admin/users', accent: 'var(--brand)' },
  { label: 'Execution Logs Stream', Icon: Terminal, path: '/admin/trading/execution-logs', accent: 'var(--purple)' },
  { label: 'Copy Strategy Board', Icon: Copy, path: '/admin/copy-trading', accent: 'var(--cyan)' },
  { label: 'Support Queue Management', Icon: Activity, path: '/admin/support', accent: 'var(--negative)' },
];

export function DashboardQuickActions() {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col">
      <div className="text-[15px] font-semibold text-text mb-4 border-b border-border/15 pb-3 tracking-tight">
        Command Terminal Keys
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {QUICK_ACTIONS.map((item) => {
          const { label, Icon, path, accent } = item;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center gap-2.5 rounded-[10px] border border-border/20 bg-bg/40 px-3 py-2.5 text-left hover:border-border/30 hover:bg-surface-elevated/45 hover:scale-[1.02] hover:shadow-card-subtle transition-all duration-300 group cursor-pointer"
            >
              <div
                className="flex h-7.5 w-7.5 flex-shrink-0 items-center justify-center rounded-[8px] transition-all duration-300 group-hover:scale-110"
                style={{ 
                  background: `color-mix(in srgb, ${accent} 10%, transparent)`, 
                  color: accent,
                  boxShadow: `0 0 6px color-mix(in srgb, ${accent} 25%, transparent)`
                }}
              >
                <Icon size={13} strokeWidth={2.5} className="group-hover:animate-pulse" />
              </div>
              <span className="text-[13px] font-semibold text-text-muted group-hover:text-text transition-colors leading-tight">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default DashboardQuickActions;
