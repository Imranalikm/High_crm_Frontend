import React, { useState } from 'react';
import {
  PauseCircle, PlayCircle, XCircle, RefreshCw, Bookmark, Wallet, Percent, Settings,
  Activity, MessageSquare, Send, Edit2, User, Download
} from 'lucide-react';

import {
  Badge, IBtn, Card, DetailHeader, AuditTrail
} from '../components/CopyTradingActions';
import { SH, KpiCard } from '../components/CopyTradingStatsCards';

export function SubscriptionDetailPage({ row, onBack, act }) {
  const [noteText, setNoteText] = useState('');
  const history = [
    { ts: '2024-08-01 00:00', event: 'RENEWAL_REMINDER', detail: 'Renewal reminder sent to user email.' },
    {
      ts: row.startDate + ' 00:00',
      event: 'SUBSCRIPTION_CREATED',
      detail: `Plan: ${row.plan}. Allocation: ${row.alloc}. Fee: ${row.fee}.`,
    },
  ];
  return (
    <div>
      <DetailHeader
        onBack={onBack}
        breadcrumb="Subscriptions"
        title={`${row.id} — ${row.user}`}
        badges={[<Badge key="s" v={row.status} size="lg" />]}
        actions={[
          row.status === 'ACTIVE' ? (
            <IBtn key="p" label="Pause" Icon={PauseCircle} variant="warning" onClick={() => act('Paused', row.id)} />
          ) : (
            <IBtn key="r" label="Resume" Icon={PlayCircle} variant="success" onClick={() => act('Resumed', row.id)} />
          ),
          <IBtn key="c" label="Cancel" Icon={XCircle} variant="danger" onClick={() => act('Cancelled', row.id)} />,
          <IBtn key="rn" label="Force Renew" Icon={RefreshCw} variant="cyan" onClick={() => act('Renewed', row.id)} />,
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Plan" value={row.plan} color="var(--cyan)" Icon={Bookmark} sub="Plan type" />
            <KpiCard label="Allocation" value={row.alloc} color="var(--brand)" Icon={Wallet} sub="Copied funds" />
            <KpiCard label="Fee" value={row.fee} color="var(--warning)" Icon={Percent} sub="Fee rate" />
          </div>
          <Card>
            <SH title="Details" Icon={Settings} />
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Sub ID', row.id, true],
                ['User', row.user, false],
                ['UID', row.uid, false],
                ['Provider', row.provider, true],
                ['Plan', row.plan, false],
                ['Allocation', row.alloc, false],
                ['Start Date', row.startDate, false],
                ['Renewal', row.renewal, false],
                ['Fee', row.fee, false],
                ['Status', row.status, false],
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
            <SH title="History" Icon={Activity} />
            <AuditTrail entries={history} />
          </Card>
        </div>

        <div className="space-y-4 xl:sticky xl:top-[120px]">
          <Card>
            <SH title="Notes" Icon={MessageSquare} />
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={4}
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
          <div className="grid grid-cols-1 gap-2">
            <IBtn label="Edit Plan" Icon={Edit2} variant="default" onClick={() => act('Plan change', row.id)} />
            <IBtn label="Follower" Icon={User} variant="cyan" onClick={() => act('Follower viewed', row.id)} />
            <IBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', row.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionDetailPage;
