import React, { useState } from 'react';
import { HeartPulse, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const INITIAL_HEALTH = [
  { name: 'MT5 Bridge EU-1', value: 98, status: 'ok', metric: '89ms' },
  { name: 'MT5 Bridge EU-2', value: 71, status: 'warn', metric: '310ms' },
  { name: 'MT5 Bridge APAC', value: 97, status: 'ok', metric: '102ms' },
  { name: 'Database Primary', value: 99, status: 'ok', metric: '4ms' },
  { name: 'Liquidity Feed', value: 96, status: 'ok', metric: 'live' },
];

const QUICK_METRICS = [
  { label: 'Platform Uptime', value: '99.91%', color: 'var(--positive)' },
  { label: 'Errors / hour', value: '0', color: 'var(--positive)' },
  { label: 'DB Query QPS', value: '2,841', color: 'var(--cyan)' },
];

function HealthBar({ item }) {
  const color =
    item.status === 'ok' ? 'var(--positive)' :
      item.status === 'warn' ? 'var(--warning)' :
        'var(--negative)';

  return (
    <div className="flex items-center gap-2.5 py-2 px-2 rounded-[8px] hover:bg-surface-elevated/25 transition-all duration-200 group">
      <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
        <div
          className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-100 group-hover:animate-ping"
          style={{ background: color }}
        />
        <div 
          className="w-1.5 h-1.5 rounded-full relative z-10" 
          style={{ 
            background: color,
            boxShadow: `0 0 5px ${color}`
          }} 
        />
      </div>
      <span className="text-[12.5px] font-medium text-text-muted flex-1 truncate group-hover:text-text transition-colors">
        {item.name}
      </span>
      <span className="font-mono text-[11.5px] font-medium text-text-muted w-16 text-right group-hover:text-text-muted transition-colors">{item.metric}</span>
      <div className="w-20 h-1.5 bg-border/15 rounded-full overflow-hidden shrink-0">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ 
            width: `${item.value}%`, 
            background: color,
            boxShadow: `0 0 6px ${color}`
          }} 
        />
      </div>
    </div>
  );
}

export function DashboardHealth() {
  const [healthData, setHealthData] = useState(INITIAL_HEALTH);
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = () => {
    setIsPinging(true);
    // Simulating active cluster round-trip handshake
    setTimeout(() => {
      setHealthData([
        { name: 'MT5 Bridge EU-1', value: 98, status: 'ok', metric: `${Math.floor(75 + Math.random() * 20)}ms` },
        { name: 'MT5 Bridge EU-2', value: 85, status: 'ok', metric: `${Math.floor(120 + Math.random() * 50)}ms` }, // Re-connect node handshake stabilizes!
        { name: 'MT5 Bridge APAC', value: 97, status: 'ok', metric: `${Math.floor(95 + Math.random() * 15)}ms` },
        { name: 'Database Primary', value: 99, status: 'ok', metric: `${Math.floor(2 + Math.random() * 4)}ms` },
        { name: 'Liquidity Feed', value: 98, status: 'ok', metric: 'live' },
      ]);
      setIsPinging(false);
    }, 1200);
  };

  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between mb-3 border-b border-border/15 pb-3">
        <div className="text-[15px] font-semibold text-text flex items-center gap-2 tracking-tight">
          <HeartPulse size={14} className="text-positive animate-pulse" />
          Bridge Cluster Topology
        </div>
        <div className="flex items-center gap-2">
          {isPinging && (
            <div className="flex items-end gap-[1.5px] h-3">
              <span className="w-[1.5px] bg-positive rounded-full animate-bounce h-1.5" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }} />
              <span className="w-[1.5px] bg-positive rounded-full animate-bounce h-2.5" style={{ animationDelay: '0.3s', animationDuration: '0.4s' }} />
              <span className="w-[1.5px] bg-positive rounded-full animate-bounce h-1" style={{ animationDelay: '0.5s', animationDuration: '0.7s' }} />
              <span className="w-[1.5px] bg-positive rounded-full animate-bounce h-2" style={{ animationDelay: '0.2s', animationDuration: '0.5s' }} />
            </div>
          )}
          <button 
            type="button"
            onClick={handlePing}
            disabled={isPinging}
            className={`flex items-center gap-1 text-[11.5px] font-bold text-text-muted hover:text-text transition-colors cursor-pointer ${isPinging ? 'opacity-40 cursor-wait' : ''}`}
          >
            <RefreshCw size={10} className={isPinging ? 'animate-spin' : ''} /> {isPinging ? 'Pinging Node...' : 'Ping Cluster'}
          </button>
        </div>
      </div>

      <div className="space-y-0.5 mt-2">
        {healthData.map((item) => (
          <HealthBar key={item.name} item={item} />
        ))}
      </div>

      {/* Quick Metrics */}
      <div className="mt-4 pt-4 border-t border-border/15 grid grid-cols-3 gap-2">
        {QUICK_METRICS.map(({ label, value, color }) => (
          <div
            key={label}
            className="text-center rounded-[10px] border border-border/15 bg-bg/40 py-2 group hover:border-border/30 transition-colors"
          >
            <div 
              className="font-mono text-[14px] font-semibold" 
              style={{ 
                color,
                textShadow: `0 0 6px color-mix(in srgb, ${color} 15%, transparent)`
              }}
            >
              {value}
            </div>
            <div className="text-[10.5px] text-text-muted font-medium uppercase tracking-wider mt-1 leading-none font-heading">{label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default DashboardHealth;
