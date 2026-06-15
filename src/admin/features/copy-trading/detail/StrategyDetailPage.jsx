import React, { useState } from 'react';
import {
  Edit2, PauseCircle, PlayCircle, Lock, BookOpen, ShieldAlert, Tag,
  TrendingUp, TrendingDown, Target, Copy, Users, BadgePercent, Settings, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Bar
} from 'recharts';

import {
  Badge, RiskBadge, StarRating, IBtn, Card, DetailHeader, AuditTrail, FollowerRow, RC
} from '../components/CopyTradingActions';
import { SH, KpiCard } from '../components/CopyTradingStatsCards';
import { CTip } from '../components/CopyTradingCharts';
import { strPerf, strActivityLog, FOLLOWER_ROWS } from '@/config/constants/copy-trading/workspaces';

const followersData = FOLLOWER_ROWS.map(f => ({
  ...f,
  alloc: f.allocation || f.alloc,
  ratio: f.copyRatio || f.ratio,
  pnl: f.pnlImpact || f.pnl,
  pnlN: parseFloat((f.pnlImpact || f.pnl || '0').replace(/[+$$,]/g, '')) || 0,
}));

export function StrategyDetailPage({ row, onBack, act }) {
  const [tab, setTab] = useState('overview');
  const followers = followersData.filter(f => f.strategy === row.name);
  const TABS = ['overview', 'performance', 'followers', 'fee_rules', 'activity'];

  return (
    <div>
      <DetailHeader
        onBack={onBack}
        breadcrumb="Strategies"
        title={row.name}
        badges={[
          <Badge key="s" v={row.status} size="lg" />,
          <RiskBadge key="r" v={row.risk} />,
          <StarRating key="rt" v={row.rating} />,
        ]}
        actions={[
          <IBtn key="e" label="Edit" Icon={Edit2} variant="default" onClick={() => act('Edit opened', row.id)} />,
          row.status === 'ACTIVE' ? (
            <IBtn key="p" label="Pause" Icon={PauseCircle} variant="warning" onClick={() => act('Paused', row.id)} />
          ) : (
            <IBtn key="r" label="Activate" Icon={PlayCircle} variant="success" onClick={() => act('Activated', row.id)} />
          ),
          <IBtn key="s" label="Suspend" Icon={Lock} variant="danger" onClick={() => act('Suspended', row.id)} />,
        ]}
      />

      {/* Meta strip */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          ['Provider', row.provider, 'var(--brand)'],
          ['Provider ID', row.pid, 'var(--cyan)'],
          ['Funds', row.aum, 'var(--brand)'],
          ['Min Deposit', row.minDeposit, 'var(--text)'],
          ['Fee', row.fee, 'var(--warning)'],
          ['Phase', row.phase, 'var(--cyan)'],
          ['Followers', row.followers.toLocaleString(), 'var(--positive)'],
          ['Last Updated', row.lastUpdated, 'var(--text-muted)'],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-0.5">{k}</div>
            <div className="text-[12px] font-semibold font-heading" style={{ color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="Profit"
          value={row.roi}
          color={row.roiN > 0 ? 'var(--positive)' : 'var(--negative)'}
          Icon={TrendingUp}
          sub="All time"
        />
        <KpiCard label="Win Rate" value={row.winRate} color="var(--cyan)" Icon={Target} sub="Closed trades" />
        <KpiCard label="Max Loss" value={row.drawdown} color="var(--negative)" Icon={TrendingDown} sub="Peak-to-trough" />
        <KpiCard label="Total Copied" value={row.copiedVol} color="var(--brand)" Icon={Copy} sub="Total allocated" />
      </div>

      {/* Tab nav */}
      <div className="flex gap-0 border-b border-white/[0.05] mb-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold font-heading cursor-pointer whitespace-nowrap transition-all flex-shrink-0
              ${tab === t ? 'text-text' : 'text-text-muted/40 hover:text-text-muted/70'}`}
          >
            {t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {tab === t && (
              <span className="absolute inset-x-2 -bottom-px h-px bg-primary rounded-full shadow-[0_0_6px_rgba(var(--primary-rgb),0.5)]" />
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          <Card>
            <SH title="Details" Icon={BookOpen} />
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Name', row.name, 'wide'],
                ['Provider', row.provider, ''],
                ['Status', row.status, ''],
                ['Risk', row.risk, ''],
                ['Profit', row.roi, ''],
                ['Win Rate', row.winRate, ''],
                ['Max Loss', row.drawdown, ''],
                ['Total Copied', row.copiedVol, ''],
                ['Min Deposit', row.minDeposit, ''],
                ['Fee', row.fee, ''],
              ].map(([k, v, w]) => (
                <div
                  key={k}
                  className={`rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 ${
                    w === 'wide' ? 'col-span-2' : ''
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-1">{k}</div>
                  <div className="text-[12.5px] font-semibold font-heading text-text truncate">{v}</div>
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-4">
            <Card>
              <SH title="Risk" Icon={ShieldAlert} />
              {[
                ['Risk Level', row.risk, RC[row.risk]],
                ['Max Loss', row.drawdown, 'var(--negative)'],
                ['Win Rate', row.winRate, 'var(--cyan)'],
                ['Profit', row.roi, row.roiN > 0 ? 'var(--positive)' : 'var(--negative)'],
              ].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0 text-[12px]">
                  <span className="text-text-muted/75 font-heading">{k}</span>
                  <span className="font-mono font-bold" style={{ color: c }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SH title="Tags" Icon={Tag} />
              <div className="flex flex-wrap gap-1.5">
                {row.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-[5px] border border-white/[0.07] bg-white/[0.03] text-text-muted/55"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'performance' && (
        <div className="space-y-5">
          <Card>
            <SH title="Monthly Profit (%)" Icon={TrendingUp} />
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={strPerf}>
                  <defs>
                    <linearGradient id="sGr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="roi"
                    tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                    unit="%"
                  />
                  <YAxis
                    yAxisId="dd"
                    orientation="right"
                    tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                    unit="%"
                  />
                  <Tooltip content={<CTip />} />
                  <Area yAxisId="roi" type="monotone" dataKey="roi" stroke="var(--brand)" strokeWidth={2} fill="url(#sGr)" name="roi" />
                  <Bar yAxisId="dd" dataKey="dd" fill="rgba(239,68,68,0.4)" radius={[3, 3, 0, 0]} name="dd" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Best Month', '+9.4%', 'var(--positive)'],
              ['Worst Month', '+3.1%', 'var(--warning)'],
              ['Avg Monthly', `+${(row.roiN / 8).toFixed(1)}%`, 'var(--cyan)'],
              ['Volatility', '2.1%', 'var(--text)'],
            ].map(([k, v, c]) => (
              <div key={k} className="rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-1.5">{k}</div>
                <div className="text-[18px] font-bold font-heading" style={{ color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'followers' && (
        <Card>
          <SH
            title={`Followers (${followers.length})`}
            Icon={Users}
            action={
              <span className="text-[10px] text-primary font-bold cursor-pointer hover:underline font-heading">
                View all →
              </span>
            }
          />
          <div className="space-y-2">
            {followers.length === 0 ? (
              <div className="text-center py-8 text-text-muted/30 font-heading">No followers on this strategy</div>
            ) : (
              followers.map(f => <FollowerRow key={f.id} f={f} />)
            )}
          </div>
        </Card>
      )}

      {tab === 'fee_rules' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Card>
            <SH title="Fee Configuration" Icon={BadgePercent} />
            {[
              ['Fee', row.fee, 'var(--warning)'],
              ['Management Fee', '0%', 'var(--text-muted)'],
              ['Billing Cycle', 'Monthly', 'var(--text)'],
              ['Fee Cap', '$5,000/mo', 'var(--brand)'],
              ['Min Deposit', row.minDeposit, 'var(--cyan)'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0 text-[12px]">
                <span className="text-text-muted/75 font-heading">{k}</span>
                <span className="font-mono font-bold" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SH title="Copy Rules" Icon={Settings} />
            {[
              ['Copy Mode', 'Proportional', 'var(--text)'],
              ['Min Copy Ratio', '0.1x', 'var(--text)'],
              ['Max Copy Ratio', '5x', 'var(--text)'],
              ['Auto-Pause Loss', row.drawdown, 'var(--negative)'],
              ['Weekend Hold', 'Allowed', 'var(--positive)'],
              ['News Trading', 'Restricted', 'var(--warning)'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0 text-[12px]">
                <span className="text-text-muted/75 font-heading">{k}</span>
                <span className="font-semibold font-heading" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === 'activity' && (
        <Card>
          <SH title="Activity Logs" Icon={Activity} />
          <AuditTrail entries={strActivityLog} />
        </Card>
      )}
    </div>
  );
}

export default StrategyDetailPage;
