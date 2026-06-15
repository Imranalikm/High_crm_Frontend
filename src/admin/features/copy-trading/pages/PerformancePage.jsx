import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area
} from 'recharts';

import { PageShell } from '@/components/layout/PageShell';
import { Card, IBtn, TrendBadge } from '../components/CopyTradingActions';
import { SH, KpiCard } from '../components/CopyTradingStatsCards';
import { CTip } from '../components/CopyTradingCharts';
import { PERFORMANCE_ROWS, growth, dd } from '@/config/constants/copy-trading/workspaces';

const perfData = {
  growth,
  dd,
  ranking: PERFORMANCE_ROWS.map(r => ({
    strategy: r.strategy,
    provider: r.provider,
    roi: parseFloat(r.monthlyGrowth.replace(/[+%]/g, '')) || 0,
    winRate: parseFloat(r.winRate.replace(/%/g, '')) || 0,
    dd: parseFloat(r.drawdown.replace(/%/g, '')) || 0,
    followers: r.followers,
    trend: r.trend,
  })),
};

const PAGE = {
  eyebrow: 'Copy Trading',
  title: 'Copy Performance',
  description: 'Track growth, rankings, and drawdown stats.',
};

export function PerformancePage() {
  const [period, setPeriod] = useState('6M');
  const COLORS = ['var(--brand)', 'var(--cyan)', '#a78bfa'];

  const totalCopiedPnl = '+$4.8M';
  const monthlyGrowth = '+8.2%';
  const avgDD = (perfData.ranking.reduce((s, r) => s + r.dd, 0) / perfData.ranking.length).toFixed(1);
  const bestProvider = perfData.ranking.sort((a, b) => b.roi - a.roi)[0];
  const successRate = ((perfData.ranking.filter(r => r.roi > 10).length / perfData.ranking.length) * 100).toFixed(0);

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">
        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
              {PAGE.title}
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-1 bg-surface-elevated border border-border/20 p-1 rounded-[8px] h-8 mr-1">
              {['1M', '3M', '6M', '1Y', 'ALL'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 h-6 rounded-[5px] text-[11.5px] font-semibold transition-all cursor-pointer border-0 ${
                    period === p
                      ? 'bg-brand text-text-on-accent'
                      : 'bg-transparent text-text-muted/75 hover:text-text'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <IBtn label="Export Report" Icon={Download} variant="default" onClick={() => console.log('Export report')} />
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <KpiCard label="Copied PnL" value={totalCopiedPnl} color="var(--positive)" Icon={TrendingUp} sub="Total follower profit/loss" />
          <KpiCard label="Monthly Growth" value={monthlyGrowth} color="var(--positive)" Icon={TrendingUp} sub="Platform average" />
          <KpiCard label="Top Provider" value={bestProvider.provider.split(' ')[0]} color="var(--brand)" Icon={Trophy} sub={`${bestProvider.roi}% profit`} />
          <KpiCard label="Avg Drawdown" value={`-${avgDD}%`} color="var(--negative)" Icon={TrendingDown} sub="Average loss" />
          <KpiCard label="Success Rate" value={`${successRate}%`} color="var(--cyan)" Icon={Target} sub="Strategies >10% profit" />
        </section>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card>
            <SH title="Monthly Growth (%)" Icon={TrendingUp} />
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perfData.growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} width={32} unit="%" />
                  <Tooltip content={<CTip />} />
                  <Line type="monotone" dataKey="apex" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3, fill: COLORS[0] }} name="Apex" />
                  <Line type="monotone" dataKey="gold" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 3, fill: COLORS[1] }} name="Gold" />
                  <Line type="monotone" dataKey="finedge" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 3, fill: COLORS[2] }} name="FinEdge" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-1">
              {[['Apex Scalper', COLORS[0]], ['Gold Trend', COLORS[1]], ['FinEdge', COLORS[2]]].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                  <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SH title="Max Drawdown (%)" Icon={TrendingDown} />
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perfData.dd}>
                  <defs>
                    {['apG', 'goG', 'fiG'].map((id, i) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={['var(--brand)', 'var(--cyan)', '#a78bfa'][i]} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={['var(--brand)', 'var(--cyan)', '#a78bfa'][i]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 10 }} axisLine={false} tickLine={false} width={32} unit="%" />
                  <Tooltip content={<CTip />} />
                  <Area type="monotone" dataKey="apex" stroke={COLORS[0]} fill="url(#apG)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="gold" stroke={COLORS[1]} fill="url(#goG)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="finedge" stroke={COLORS[2]} fill="url(#fiG)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Ranking table */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <div className="px-5 py-4 border-b border-border/12 flex items-center justify-between bg-surface-elevated">
            <SH title="Performance Rankings" Icon={Trophy} />
            <IBtn label="Export" Icon={Download} variant="default" small onClick={() => console.log('Export ranking')} />
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 border-b border-border/10 bg-bg/20">
                  {['Rank', 'Strategy', 'Provider', 'Profit', 'Win Rate', 'Max Loss', 'Followers', 'Trend'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {perfData.ranking.map((r, i) => (
                  <tr key={r.strategy} className="group transition-colors border-l-2 border-transparent hover:bg-positive/5 hover:border-l-positive">
                    <td className="px-4 py-3">
                      <span
                        className={`text-[13px] font-black font-heading ${
                          i === 0
                            ? 'text-yellow-400'
                            : i === 1
                            ? 'text-slate-300'
                            : i === 2
                            ? 'text-amber-600'
                            : 'text-text-muted/30'
                        }`}
                      >
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-heading font-semibold text-text/80">{r.strategy}</td>
                    <td className="px-4 py-3 text-brand font-heading text-[11px]">{r.provider}</td>
                    <td className="px-4 py-3 font-mono font-bold text-positive">+{r.roi}%</td>
                    <td className="px-4 py-3 font-mono text-text/65">{r.winRate}%</td>
                    <td className="px-4 py-3 font-mono text-negative">-{r.dd}%</td>
                    <td className="px-4 py-3 font-mono text-cyan">{r.followers.toLocaleString()}</td>
                    <td className="px-4 py-3 text-left">
                      <TrendBadge v={r.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default PerformancePage;
