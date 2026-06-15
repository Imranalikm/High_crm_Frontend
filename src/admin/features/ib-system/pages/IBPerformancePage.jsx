import React, { useState } from 'react';
import { BadgePercent, Download, Filter, TrendingDown, Trophy, Users } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePie, Pie, Cell,
} from 'recharts';
import { KpiCard } from '@/components/cards';
import { perfKpis, perfTrend, tierDistrib, topPerformers, lowPerformers } from '@/config/constants/ib-system/workspaces/overview.workspace';
import { IBCard, IBTierBadge, SectionHead, IBChartTip, TraderAvatar, IBIconBtn } from '../components/IBComponents';
import { MainTable, TableToolbar } from '@/components/common/table';

const perfCols = [
  { key: 'rank', label: 'Rank', render: (_, r, i) => (
      <span className={`text-[13px] font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-text-muted/30'}`}>
        #{(i ?? 0) + 1}
      </span>
    )
  },
  { key: 'name', label: 'Partner', render: (v, r) => (
      <div className="flex items-center gap-2">
        <TraderAvatar name={v} />
        <div>
          <div className="text-[12.5px] font-semibold text-text/90">{v}</div>
          <div className="text-[10px] font-mono text-text-muted/60">{r.region}</div>
        </div>
      </div>
    )
  },
  { key: 'referrals', label: 'Referrals', render: v => <span className="font-mono font-bold text-brand">{v?.toLocaleString()}</span> },
  { key: 'revenue',   label: 'Revenue',   render: v => <span className="font-mono text-text/70">{v}</span> },
  { key: 'growth',    label: 'Growth',    render: v => <span className="font-mono font-bold" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span> },
  { key: 'tier',      label: 'Tier',      render: v => <IBTierBadge value={v} /> },
];

const lowPerfCols = perfCols.filter(c => c.key !== 'rank');

function IBPerformancePage() {
  const [period, setPeriod] = useState('3M');
  const DONUT_TOTAL = tierDistrib.reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
            IB System
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
            IB Performance
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Analyze tier distribution, partner conversion funnel, and low/top performing brokers.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-1 bg-surface-elevated/40 p-0.5 rounded-[8px] border border-border/20">
            {['1M', '3M', '6M', '1Y', 'ALL'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 h-7 rounded-[6px] text-[11px] font-bold font-heading cursor-pointer transition-all duration-150
                  ${period === p ? 'bg-primary text-text-on-accent' : 'text-text-muted hover:text-text bg-transparent'}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => {}} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export Report
          </button>
        </div>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {perfKpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <IBCard className="xl:col-span-2">
          <SectionHead title="Partner Growth vs Churn" Icon={Users} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfTrend}>
                <defs>
                  <linearGradient id="ibPartG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--cyan)"     stopOpacity={0.20} />
                    <stop offset="95%" stopColor="var(--cyan)"     stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ibChurnG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--negative)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--negative)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={42} />
                <Tooltip content={<IBChartTip />} />
                <Area type="monotone" dataKey="partners" stroke="var(--cyan)"     strokeWidth={2} fill="url(#ibPartG)" />
                <Area type="monotone" dataKey="churned"  stroke="var(--negative)" strokeWidth={2} fill="url(#ibChurnG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Total Partners', 'var(--cyan)'], ['Churned', 'var(--negative)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/75">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </IBCard>

        <IBCard>
          <SectionHead title="Tier Distribution" Icon={BadgePercent} />
          <div className="flex items-center gap-4">
            <div className="h-[160px] w-[160px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie data={tierDistrib} cx="50%" cy="50%" innerRadius={44} outerRadius={68} dataKey="value" strokeWidth={0}>
                    {tierDistrib.map((t, i) => <Cell key={i} fill={t.color} />)}
                  </Pie>
                  <Tooltip content={({ active, payload }) => active && payload?.length ? (
                    <div className="rounded-[8px] border border-border/40 bg-surface-elevated px-3 py-2 text-[11px] font-mono">
                      <div className="font-bold" style={{ color: payload[0].payload.color }}>{payload[0].name}</div>
                      <div className="text-text-muted/60">{payload[0].value.toLocaleString()} IBs ({((payload[0].value / DONUT_TOTAL) * 100).toFixed(1)}%)</div>
                    </div>
                  ) : null} />
                </RePie>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              {tierDistrib.map(t => (
                <div key={t.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  <span className="text-[11px] font-semibold text-text-muted/70 truncate">{t.name}</span>
                  <span className="text-[11.5px] font-mono font-bold ml-auto pl-2" style={{ color: t.color }}>{((t.value / DONUT_TOTAL) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </IBCard>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col">
          <TableToolbar title="Top Performers" />
          <MainTable 
            columns={perfCols} 
            data={topPerformers} 
            rowClassName={() => "hover:bg-brand/5 hover:border-l-brand"}
          />
        </section>

        <div className="space-y-4">
          <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col">
            <TableToolbar title="Underperforming Partners" />
            <MainTable 
              columns={lowPerfCols} 
              data={lowPerformers} 
              rowClassName={() => "hover:bg-warning/5 hover:border-l-warning"}
            />
          </section>

          <IBCard>
            <SectionHead title="Referral Conversion Funnel" Icon={Filter} />
            <div className="space-y-2.5">
              {[
                { label: 'Referred Users',  val: 48302, pct: 100, color: 'var(--brand)'    },
                { label: 'Registered',      val: 38640, pct: 80,  color: 'var(--cyan)'     },
                { label: 'First Deposit',   val: 18440, pct: 38,  color: 'var(--warning)'  },
                { label: 'Active Traders',  val: 9210,  pct: 19,  color: 'var(--positive)' },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11.5px] font-semibold">
                    <span className="text-text-muted/75">{f.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-text-muted/60">{f.val.toLocaleString()}</span>
                      <span className="font-mono font-bold w-8 text-right" style={{ color: f.color }}>{f.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/20">
                    <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </IBCard>
        </div>
      </div>
    </div>
  );
}

export default IBPerformancePage;
