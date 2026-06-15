import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GitBranch, Network, Users, X, CircleDollarSign, Edit2, Lock } from 'lucide-react';
import { IBCard, IBTierBadge, IBBadge, SectionHead, IBIconBtn } from './IBComponents';
import { TIER_CLR, STATUS_CLR } from '@/config/constants/ib-system/workspaces/shared.workspace';

export function TreeNode({ node, depth = 0, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = node.subIBs?.length > 0;
  const isSelected = selectedId === node.id;
  const tierColor = TIER_CLR[node.tier] || 'rgba(255,255,255,0.3)';
  const statusColor = STATUS_CLR[node.status] || 'var(--text-muted)';
  const indent = depth * 28;

  return (
    <div className="w-full">
      <div
        onClick={() => { onSelect(node); if (hasChildren) setExpanded(p => !p); }}
        className={`group relative flex items-center cursor-pointer transition-all duration-200 rounded-[8px] border my-0.5
          ${isSelected ? 'bg-primary/[0.07] border-primary/20' : 'border-transparent hover:bg-bg/60 hover:border-border/30'}`}
        style={{ paddingLeft: indent + 8, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }}
      >
        {depth > 0 && (
          <>
            <div className="absolute w-px bg-border/30" style={{ left: indent - 12, top: 0, bottom: 0 }} />
            <div className="absolute h-px bg-border/30 w-3" style={{ left: indent - 12, top: '50%' }} />
          </>
        )}
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mr-2">
          {hasChildren ? (
            <button onClick={e => { e.stopPropagation(); setExpanded(p => !p); }}
              className="w-4 h-4 rounded-[4px] border border-border/40 flex items-center justify-center text-text-muted/50 hover:text-text hover:border-border/70 transition-all">
              {expanded ? <ChevronDown size={9} strokeWidth={3} /> : <ChevronRight size={9} strokeWidth={3} />}
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full border border-border/30 ml-1" />
          )}
        </div>
        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[10px] font-bold font-heading flex-shrink-0 mr-3 border"
          style={{ background: `color-mix(in srgb, ${tierColor} 12%, transparent)`, borderColor: `color-mix(in srgb, ${tierColor} 22%, transparent)`, color: tierColor }}>
          {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="min-w-[160px]">
            <div className="text-[12.5px] font-semibold text-text/85 font-heading leading-none truncate">{node.name}</div>
            <div className="text-[10px] font-mono text-text-muted/40 mt-0.5">{node.id} · {node.region}</div>
          </div>
          <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
            <IBTierBadge value={node.tier} />
            <div className="text-[11px] font-mono text-text-muted/50 flex items-center gap-1"><Users size={10} />{node.referrals?.toLocaleString()}</div>
            <div className="text-[11px] font-mono font-bold" style={{ color: 'var(--brand)' }}>{node.commission}</div>
            <div className="text-[10.5px] font-mono text-text-muted/40">{node.share} share</div>
            {hasChildren && <div className="text-[10px] text-text-muted/30 font-heading">{node.subIBs.length} sub-IB{node.subIBs.length !== 1 ? 's' : ''}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
          {isSelected && <ChevronRight size={12} className="text-primary" />}
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="relative">
          {node.subIBs.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeDetailPanel({ node, onClose }) {
  if (!node) return (
    <IBCard className="flex flex-col items-center justify-center min-h-[200px] text-center">
      <GitBranch size={28} className="text-text-muted/20 mb-3" />
      <div className="text-[13px] font-heading font-semibold text-text-muted/40">Select a node</div>
      <div className="text-[11px] text-text-muted/25 font-heading mt-1">Click any partner to inspect details</div>
    </IBCard>
  );
  
  const tierColor = TIER_CLR[node.tier] || 'rgba(255,255,255,0.3)';
  
  return (
    <IBCard pad={false}>
      <div className="px-5 py-4 border-b border-border/30" style={{ background: `color-mix(in srgb, ${tierColor} 5%, transparent)` }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[12px] font-bold font-heading border"
              style={{ background: `color-mix(in srgb, ${tierColor} 15%, transparent)`, borderColor: `color-mix(in srgb, ${tierColor} 25%, transparent)`, color: tierColor }}>
              {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="text-[14px] font-bold tracking-[-0.02em] text-text font-heading">{node.name}</div>
              <div className="text-[11px] font-mono text-text-muted/40 mt-0.5">{node.id} · {node.region}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-[6px] border border-border/30 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><X size={12} /></button>
        </div>
        <div className="flex items-center gap-2 mt-3"><IBTierBadge value={node.tier} /><IBBadge value={node.status} /></div>
      </div>
      <div className="p-4 space-y-4">
        <SectionHead title="Network Stats" Icon={Network} />
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Total Referrals', val: node.referrals?.toLocaleString(), color: 'var(--brand)' },
            { label: 'Commission',      val: node.commission,                   color: 'var(--positive)' },
            { label: 'Revenue Share',   val: node.share,                        color: 'var(--warning)' },
            { label: 'Sub-IBs',         val: node.subIBs?.length ?? 0,          color: 'var(--cyan)' },
          ].map(s => (
            <div key={s.label} className="rounded-[9px] border border-border/30 bg-bg/60 px-3 py-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 mb-1">{s.label}</div>
              <div className="text-[15px] font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div>
          <SectionHead title="Commission Flow" Icon={CircleDollarSign} />
          <div className="rounded-[9px] border border-border/30 bg-bg/60 p-3.5 space-y-2.5">
            {[
              { label: 'Gross Revenue',    val: node.commission, bar: 100 },
              { label: 'Partner Share',    val: `${node.share} of gross`, bar: parseInt(node.share) * 2 },
              { label: 'Platform Retained',val: `${100 - parseInt(node.share)}%`, bar: (100 - parseInt(node.share)) * 2 },
            ].map(f => (
              <div key={f.label} className="space-y-1">
                <div className="flex justify-between text-[11.5px] font-semibold">
                  <span className="text-text-muted/70">{f.label}</span>
                  <span className="font-mono text-text/95">{f.val}</span>
                </div>
                <div className="h-1 rounded-full bg-border/20">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(f.bar, 100)}%`, background: 'var(--brand)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {node.subIBs?.length > 0 && (
          <div>
            <SectionHead title="Direct Sub-IBs" Icon={Users} />
            <div className="space-y-1.5">
              {node.subIBs.map(sub => (
                <div key={sub.id} className="flex items-center gap-3 rounded-[8px] border border-border/20 bg-bg/40 px-3 py-2">
                  <div className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[9px] font-bold font-heading flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${TIER_CLR[sub.tier] || '#fff'} 12%, transparent)`, color: TIER_CLR[sub.tier] || '#fff', border: `1px solid color-mix(in srgb, ${TIER_CLR[sub.tier] || '#fff'} 22%, transparent)` }}>
                    {sub.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold text-text/75 font-heading truncate">{sub.name}</div>
                    <div className="text-[10px] font-mono text-text-muted/40">{sub.region} · {sub.referrals} refs</div>
                  </div>
                  <IBTierBadge value={sub.tier} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <IBIconBtn label="View Commissions" Icon={CircleDollarSign} variant="brand"    small />
          <IBIconBtn label="View Referrals"   Icon={Users}            variant="default"  small />
          <IBIconBtn label="Edit Partner"     Icon={Edit2}            variant="default"  small />
          <IBIconBtn label="Suspend"          Icon={Lock}             variant="danger"   small />
        </div>
      </div>
    </IBCard>
  );
}
