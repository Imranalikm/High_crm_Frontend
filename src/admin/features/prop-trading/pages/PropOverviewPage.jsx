import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { CircleDollarSign, Filter, CheckCircle2, Zap, Plus, Download, AlertOctagon, Settings, Target, Users } from 'lucide-react';
import { overviewKpis, payoutTrend, completionTrend, funnelData, recentApprovals } from '@/config/constants/prop-trading/workspaces/overview.workspace';
import { Card, SectionHead, IconBtn, RiskBadge, CustomTooltip } from '../components/PropComponents';
import { PropStatsCards } from '../components/PropStatsCards';
import { PropQuickActions } from '../components/PropQuickActions';

export function PropOverviewPage() {
  return (
    <div className="space-y-6">
      <PropStatsCards kpis={overviewKpis} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <SectionHead title="Payout Trend" Icon={CircleDollarSign} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payoutTrend}>
                <defs>
                  <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={48} tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="payouts" stroke="var(--brand)" strokeWidth={2} fill="url(#payGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHead title="Pass / Fail Rate" Icon={Target} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionTrend} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={28} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pass" fill="rgba(74,225,118,0.7)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="fail" fill="rgba(239,68,68,0.4)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Pass', 'var(--positive)'], ['Fail', 'var(--negative)']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] font-heading text-text-muted/50">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
        <Card>
          <SectionHead title="Trader Funnel" Icon={Filter} />
          <div className="space-y-2.5 mt-2">
            {funnelData.map((f, i) => {
              const pct = Math.round((f.value / funnelData[0].value) * 100);
              const colors = ['var(--brand)', 'var(--cyan)', 'rgba(74,225,118,0.8)', 'var(--positive)'];
              return (
                <div key={f.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-heading font-semibold text-text/70">{f.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-text-muted/50">{f.value.toLocaleString()}</span>
                      <span className="font-mono font-bold w-10 text-right" style={{ color: colors[i] }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: colors[i], boxShadow: `0 0 8px ${colors[i]}50` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionHead title="Recent Approvals" Icon={CheckCircle2}
            action={<button className="text-[10px] text-primary font-bold hover:underline cursor-pointer font-heading">View all →</button>}
          />
          <div className="space-y-2">
            {recentApprovals.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-[9px] border border-white/[0.04] bg-white/[0.015] px-3 py-2.5 hover:border-white/[0.08] transition-all group cursor-pointer">
                <div className="w-7 h-7 rounded-[7px] bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
                  {a.trader.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-semibold text-text/80 font-heading truncate">{a.trader}</div>
                  <div className="text-[10px] text-text-muted/35 font-mono">{a.id} · {a.phase} · {a.amount}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <RiskBadge value={a.risk} />
                  <span className="text-[9.5px] text-text-muted/30 font-mono">{a.ts}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <PropQuickActions />
    </div>
  );
}
