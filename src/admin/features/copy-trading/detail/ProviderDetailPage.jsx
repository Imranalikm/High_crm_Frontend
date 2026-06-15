import React from 'react';
import {
  CheckCircle2, XCircle, Lock, Download, Layers, Users, Wallet, Target, UserCheck,
  Copy, BarChart2, ShieldAlert, AlertTriangle, AlertCircle, Eye, ShieldCheck
} from 'lucide-react';

import {
  Badge, RiskBadge, StarRating, IBtn, Card, DetailHeader, RC
} from '../components/CopyTradingActions';
import { SH, KpiCard } from '../components/CopyTradingStatsCards';
import { STRATEGY_ROWS } from '@/config/constants/copy-trading/workspaces';

const strategiesData = STRATEGY_ROWS.map(s => ({
  ...s,
  copiedVol: s.copiedVolume || s.copiedVol,
  aum: s.copiedVolume || s.aum,
  winRateN: parseFloat((s.winRate || '0').replace(/%/g, '')) || 0,
  ddN: parseFloat((s.drawdown || '0').replace(/[-%]/g, '')) || 0,
  roiN: parseFloat((s.roi || '0').replace(/[+%]/g, '')) || 0,
  rating: s.rating || 4.5,
  tags: s.tags || ['forex', 'scalping'],
  phase: s.phase || 'Phase-2',
}));

export function ProviderDetailPage({ row, onBack, act }) {
  const strategies = strategiesData.filter(s => s.provider === row.name);
  return (
    <div>
      <DetailHeader
        onBack={onBack}
        breadcrumb="Providers"
        title={row.name}
        badges={[
          <Badge key="s" v={row.status} size="lg" />,
          <Badge key="a" v={row.approval} />,
          row.verified && (
            <span
              key="v"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-positive font-heading px-2 py-[3px] rounded-[5px] border border-positive/20 bg-positive/[0.08]"
            >
              <ShieldCheck size={9} />
              VERIFIED
            </span>
          ),
          <RiskBadge key="r" v={row.risk} />,
          <StarRating key="rt" v={row.rating} />,
        ]}
        actions={[
          row.approval === 'PENDING' && (
            <IBtn key="ap" label="Approve" Icon={CheckCircle2} variant="success" onClick={() => act('Approved', row.id)} />
          ),
          row.approval === 'PENDING' && (
            <IBtn key="rj" label="Reject" Icon={XCircle} variant="danger" onClick={() => act('Rejected', row.id)} />
          ),
          <IBtn
            key="sus"
            label={row.status === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
            Icon={Lock}
            variant="danger"
            onClick={() => act('Status toggled', row.id)}
          />,
          <IBtn key="exp" label="Export" Icon={Download} variant="default" onClick={() => act('Exported', row.id)} />,
        ].filter(Boolean)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Strategies" value={row.strategies} color="var(--cyan)" Icon={Layers} sub="All" />
            <KpiCard label="Followers" value={row.followers.toLocaleString()} color="var(--brand)" Icon={Users} sub="Total" />
            <KpiCard label="AUM" value={row.aum} color="var(--brand)" Icon={Wallet} sub="Copied funds" />
            <KpiCard label="Win Rate" value={row.winRate} color="var(--positive)" Icon={Target} sub="Average" />
          </div>

          <Card>
            <SH title="Details" Icon={UserCheck} />
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Provider ID', row.id, false],
                ['Name', row.name, false],
                ['Region', row.region, false],
                ['Email', row.email, true],
                ['KYC Status', row.kyc, false],
                ['Joined', row.joined, true],
                ['Drawdown', row.drawdown, false],
                ['Approval', row.approval, false],
              ].map(([k, v, wide]) => (
                <div
                  key={k}
                  className={`rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 ${
                    wide ? 'col-span-2' : ''
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-1">{k}</div>
                  <div className="text-[12.5px] font-semibold font-heading text-text truncate">{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={false}>
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <SH title={`Strategies (${strategies.length})`} Icon={Copy} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['Strategy', 'Followers', 'Win Rate', 'Max Loss', 'Status'].map(h => (
                      <th
                        key={h}
                        className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 font-heading"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {strategies.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-heading font-semibold text-text/80">{s.name}</td>
                      <td className="px-5 py-3 font-mono text-brand font-bold">{s.followers.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono text-positive">{s.winRate}</td>
                      <td className="px-5 py-3 font-mono text-negative">{s.drawdown}</td>
                      <td className="px-5 py-3 text-left">
                        <Badge v={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4 xl:sticky xl:top-[120px]">
          <Card>
            <SH title="Performance" Icon={BarChart2} />
            {[
              ['Win Rate', row.winRate, 'var(--positive)'],
              ['Max Loss', row.drawdown, 'var(--negative)'],
              ['Funds', row.aum, 'var(--brand)'],
              ['Rating', `${row.rating}/5`, 'var(--brand)'],
              ['Risk', row.risk, RC[row.risk]],
            ].map(([k, v, c]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-white/[0.04] last:border-0 text-[12px]">
                <span className="text-text-muted/75 font-heading">{k}</span>
                <span className="font-mono font-bold" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SH title="Risk Flags" Icon={ShieldAlert} />
            <div className="space-y-2">
              {row.risk === 'HIGH' && (
                <div className="flex items-start gap-2 text-[11px] font-heading text-negative">
                  <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                  High loss history flagged
                </div>
              )}
              {!row.verified && (
                <div className="flex items-start gap-2 text-[11px] font-heading text-warning">
                  <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                  Identity not verified
                </div>
              )}
              {row.approval === 'REVIEW' && (
                <div className="flex items-start gap-2 text-[11px] font-heading text-cyan">
                  <Eye size={12} className="flex-shrink-0 mt-0.5" />
                  Under review
                </div>
              )}
              {row.risk === 'LOW' && row.verified && (
                <div className="text-[11px] text-positive font-heading flex items-center gap-1">
                  <ShieldCheck size={11} />
                  No risk flags
                </div>
              )}
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-2">
            <IBtn label="Flag" Icon={ShieldAlert} variant="warning" onClick={() => act('Flagged', row.id)} />
            <IBtn label="Commissions" Icon={BarChart2} variant="default" onClick={() => act('Commissions', row.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDetailPage;
