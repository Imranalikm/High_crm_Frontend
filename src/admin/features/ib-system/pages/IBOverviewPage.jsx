import React, { useState } from 'react';
import {
  AlertOctagon, BadgePercent, CheckCircle2, CircleDollarSign,
  Download, GitBranch, ShieldAlert, Trophy, UserPlus, Wallet, Zap,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { KpiCard } from '@/components/cards';
import {
  overviewKpis, referralGrowth, commissionTrend, topPartners, payoutAlerts,
} from '@/config/constants/ib-system/workspaces/overview.workspace';
import { IBCard, IBRiskBadge, IBTierBadge, SectionHead, IBChartTip, TraderAvatar, IBToast, IBIconBtn } from '../components/IBComponents';
import { MainTable, TableToolbar } from '@/components/common/table';

// Column definitions for Top IB Partners
const partnerCols = [
  {
    key: '_rank', label: '#', render: (_, r, i) => (
      <span className={`text-[13px] font-black font-heading ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-text-muted/30'}`}>
        #{(i ?? 0) + 1}
      </span>
    ),
  },
  {
    key: 'name', label: 'Partner', render: (v, r) => (
      <div className="flex items-center gap-2.5">
        <TraderAvatar name={v} />
        <div>
          <div className="text-[12px] font-semibold font-heading text-text/80">{v}</div>
          <div className="text-[10px] font-mono text-text-muted/40">{r.id}</div>
        </div>
      </div>
    ),
  },
  { key: 'region',   label: 'Region',    render: (v) => <span className="text-text-muted/50 font-heading">{v}</span> },
  { key: 'referrals',label: 'Referrals', render: (v) => <span className="font-mono text-brand font-bold">{v?.toLocaleString()}</span> },
  { key: 'revenue',  label: 'Revenue',   render: (v) => <span className="font-mono font-bold text-text/75">{v}</span> },
  { key: 'tier',     label: 'Tier',      render: (v) => <IBTierBadge value={v} /> },
  { key: 'trend',    label: 'Growth',    render: (v) => <span className={`font-mono font-bold text-[11px] ${v?.startsWith('+') ? 'text-positive' : 'text-negative'}`}>{v}</span> },
];

function IBOverviewPage() {
  const [toast, setToast] = useState(null);
  const act = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Inject index into topPartners so rank col can use it
  const rankedPartners = topPartners.map((p, i) => ({ ...p, _rank: i + 1 }));
  // Override render for _rank to access index
  const rankedCols = partnerCols.map((c) =>
    c.key === '_rank'
      ? { ...c, render: (_, r) => {
          const i = r._rank - 1;
          return (
            <span className={`text-[13px] font-black font-heading ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-text-muted/30'}`}>
              #{r._rank}
            </span>
          );
        }}
      : c
  );

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
            IB System
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
            IB Overview
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Introducing Broker network overview, active partners, and revenue statistics.
          </p>
        </div>
      </header>

      <IBToast msg={toast} />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {overviewKpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <IBCard>
          <SectionHead title="Referral Growth" Icon={UserPlus} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={referralGrowth}>
                <defs>
                  <linearGradient id="ibRefG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--brand)"    stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--brand)"    stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ibActG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--positive)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={38} />
                <Tooltip content={<IBChartTip />} />
                <Area type="monotone" dataKey="referrals" stroke="var(--brand)"    strokeWidth={2} fill="url(#ibRefG)" />
                <Area type="monotone" dataKey="active"    stroke="var(--positive)" strokeWidth={2} fill="url(#ibActG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Total Referrals', 'var(--brand)'], ['Active Users', 'var(--positive)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/75">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </IBCard>

        <IBCard>
          <SectionHead title="Commission Trend" Icon={CircleDollarSign} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionTrend} barCategoryGap="32%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={44} tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip content={<IBChartTip />} />
                <Bar dataKey="approved" fill="rgba(218,165,32,0.65)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pending"  fill="rgba(217,119,6,0.45)"  radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Approved', 'var(--brand)'], ['Pending', 'var(--warning)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/75">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </IBCard>
      </div>

      {/* Top IB Partners + Payout Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col">
          <TableToolbar 
            title="Top IB Partners" 
            actions={<button className="text-[11.5px] text-primary font-bold hover:underline cursor-pointer">View all →</button>}
          />
          <MainTable 
            columns={rankedCols} 
            data={rankedPartners} 
            rowClassName={() => "hover:bg-brand/5 hover:border-l-brand"}
          />
        </section>

        <IBCard>
          <SectionHead title="Payout Alerts" Icon={AlertOctagon}
            action={<span className="text-[10px] font-black text-negative font-heading">{payoutAlerts.filter(a => a.urgent).length} urgent</span>}
          />
          <div className="space-y-2">
            {payoutAlerts.map(a => (
              <div key={a.id}
                className={`flex items-center gap-3 rounded-[9px] border px-3 py-2.5 hover:brightness-105 transition-all cursor-pointer
                  ${a.urgent ? 'border-negative/[0.25] bg-negative/[0.06]' : 'border-border/25 bg-bg/50'}`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.urgent ? 'bg-negative animate-pulse' : 'bg-positive'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-text/80 truncate">{a.partner}</div>
                  <div className="text-[11px] font-mono text-text-muted/60">{a.id} · {a.ts}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-mono font-bold text-[12px] text-brand">{a.amount}</span>
                  <IBRiskBadge value={a.risk} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-border/25">
            <IBIconBtn label="Process All Pending" Icon={CheckCircle2} variant="success" small onClick={() => act('Batch approved')} />
            <IBIconBtn label="Risk Review"         Icon={ShieldAlert}  variant="warning" small onClick={() => act('Risk queue opened')} />
          </div>
        </IBCard>
      </div>

      {/* Quick Actions */}
      <IBCard>
        <SectionHead title="Quick Actions" Icon={Zap} />
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Add IB Partner',         Icon: UserPlus,     variant: 'brand'   },
            { label: 'Bulk Payout Batch',       Icon: Wallet,       variant: 'success' },
            { label: 'Export Commission Rep.',  Icon: Download,     variant: 'default' },
            { label: 'Risk Review Queue',       Icon: AlertOctagon, variant: 'warning' },
            { label: 'Tier Adjustment',         Icon: BadgePercent, variant: 'cyan'    },
            { label: 'Partner Network Map',     Icon: GitBranch,    variant: 'default' },
          ].map(a => <IBIconBtn key={a.label} {...a} onClick={() => act(a.label)} />)}
        </div>
      </IBCard>
    </div>
  );
}

export default IBOverviewPage;
