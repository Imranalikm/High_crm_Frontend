import React, { useState } from 'react';
import {
  PauseCircle, PlayCircle, UserMinus, Wallet, Copy, BarChart2, Shield, CreditCard,
  MessageSquare, Send, Settings, Zap, User
} from 'lucide-react';

import {
  Badge, RiskBadge, IBtn, Card, DetailHeader, RC, SC
} from '../components/CopyTradingActions';
import { SH, KpiCard } from '../components/CopyTradingStatsCards';

export function FollowerDetailPage({ row, onBack, act }) {
  const [noteText, setNoteText] = useState('');
  return (
    <div>
      <DetailHeader
        onBack={onBack}
        breadcrumb="Followers"
        title={row.follower}
        badges={[
          <Badge key="s" v={row.status} size="lg" />,
          <RiskBadge key="r" v={row.risk} />,
        ]}
        actions={[
          row.status === 'ACTIVE' ? (
            <IBtn key="p" label="Pause" Icon={PauseCircle} variant="warning" onClick={() => act('Paused', row.id)} />
          ) : (
            <IBtn key="r" label="Resume" Icon={PlayCircle} variant="success" onClick={() => act('Resumed', row.id)} />
          ),
          <IBtn key="u" label="Unsubscribe" Icon={UserMinus} variant="danger" onClick={() => act('Unsubscribed', row.id)} />,
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Allocation" value={row.alloc} color="var(--brand)" Icon={Wallet} sub="Copied funds" />
            <KpiCard label="Copy Ratio" value={row.copyRatio} color="var(--cyan)" Icon={Copy} sub="Multiplier" />
            <KpiCard
              label="Profit/Loss"
              value={row.pnl}
              color={row.pnlN >= 0 ? 'var(--positive)' : 'var(--negative)'}
              Icon={BarChart2}
              sub="Profit/loss"
            />
            <KpiCard label="Risk Level" value={row.risk} color={RC[row.risk]} Icon={Shield} sub="Risk level" />
          </div>
          <Card>
            <SH title="Details" Icon={CreditCard} />
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Follower', row.follower, true],
                ['UID', row.uid, false],
                ['Provider', row.provider, false],
                ['Strategy', row.strategy, true],
                ['Allocation', row.alloc, false],
                ['Ratio', row.ratio, false],
                ['Max Loss', row.maxDD, false],
                ['Last Activity', row.lastActivity, false],
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
          <Card>
            <SH title="Notes" Icon={MessageSquare} />
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={3}
              placeholder="Add note..."
              className="w-full rounded-[9px] border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-[12px] text-text font-heading outline-none placeholder:text-text-muted/25 focus:border-primary/30 resize-none transition-colors"
            />
            <button
              onClick={() => {
                if (noteText.trim()) {
                  act('Note saved', row.id);
                  setNoteText('');
                }
              }}
              disabled={!noteText.trim()}
              className="mt-2.5 flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[10.5px] font-bold font-heading border border-primary/20 bg-primary/[0.07] text-primary cursor-pointer hover:brightness-110 transition-all disabled:opacity-30"
            >
              <Send size={10} />
              Save
            </button>
          </Card>
        </div>

        <div className="space-y-4 xl:sticky xl:top-[120px]">
          <Card>
            <SH title="Settings" Icon={Settings} />
            {[
              ['Mode', 'Proportional', 'var(--text)'],
              ['Max Loss', row.maxDD, 'var(--negative)'],
              ['Ratio', row.copyRatio, 'var(--cyan)'],
              ['Status', row.status, SC[row.status]],
              ['Risk', row.risk, RC[row.risk]],
            ].map(([k, v, c]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-white/[0.04] last:border-0 text-[12px]">
                <span className="text-text-muted/75 font-heading">{k}</span>
                <span className="font-heading font-bold" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SH title="Actions" Icon={Zap} />
            <div className="grid grid-cols-1 gap-2">
              <IBtn label="Edit Ratio" Icon={Settings} variant="default" onClick={() => act('Ratio adjust', row.id)} />
              <IBtn label="Account" Icon={User} variant="cyan" onClick={() => act('Account viewed', row.id)} />
              <IBtn label="Trades" Icon={BarChart2} variant="default" onClick={() => act('Trades viewed', row.id)} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FollowerDetailPage;
