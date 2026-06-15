import React, { useState } from 'react';
import { Plus, Download, CheckCircle2, Edit2, Zap, Check, Trash2, ChevronRight, Layers, FileText } from 'lucide-react';
import { challengeRows } from '@/config/constants/prop-trading/workspaces/challenge.workspace';
import { Card, SectionHead, IconBtn, Badge, FormField, TextInput, SelectInput } from '../components/PropComponents';
import { ActionToast } from '@/components/ui';
import { PropToolbar } from '../components/PropToolbar';
import { ChallengeConfigForm } from '../components/ChallengeConfigForm';

export function ChallengeConfigPage() {
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  const openEdit = (row) => { setForm(row); setSelected(row); setIsNew(false); };
  const openNew = () => { setForm({ id: 'NEW', name: '', size: '', fee: '', profitTarget: '10%', maxDaily: '5%', maxTotal: '10%', leverage: '1:100', minDays: 10, phases: 2, status: 'DRAFT', restricted: '' }); setIsNew(true); setSelected({}); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="space-y-5">
      <PropToolbar
        actions={[
          { label: 'New Challenge', Icon: Plus, primary: true, onClick: openNew },
          { label: 'Export', Icon: Download, onClick: () => showToast('Exported') },
        ]}
      />

      <ActionToast msg={toast} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {challengeRows.map(row => {
            const isActive = selected?.id === row.id;
            return (
              <button key={row.id} onClick={() => openEdit(row)}
                className={`text-left rounded-[12px] border p-4 transition-all duration-200 cursor-pointer group
                  ${isActive ? 'border-primary/30 bg-primary/[0.05]' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.035]'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[14px] font-bold tracking-[-0.02em] text-text font-heading">{row.name}</div>
                    <div className="text-[11px] font-mono text-text-muted/40 mt-0.5">{row.id} · {row.size}</div>
                  </div>
                  <Badge value={row.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10.5px]">
                  {[
                    ['Fee', row.fee, 'var(--brand)'],
                    ['Target', row.profitTarget, 'var(--positive)'],
                    ['Daily Limit', row.maxDaily, 'var(--warning)'],
                    ['Total Limit', row.maxTotal, 'var(--negative)'],
                    ['Leverage', row.leverage, 'var(--cyan)'],
                    ['Min Days', `${row.minDays}d`, 'var(--text-muted)'],
                  ].map(([l, v, c]) => (
                    <div key={l} className="rounded-[7px] bg-white/[0.025] border border-white/[0.05] px-2 py-1.5">
                      <div className="text-[9px] text-text-muted/30 font-heading mb-0.5">{l}</div>
                      <div className="font-mono font-bold" style={{ color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                  <span className="text-[10px] text-text-muted/35 font-heading">{row.traders.toLocaleString()} enrolled</span>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-text-muted/40 font-heading">
                    {row.phases} phase{row.phases > 1 ? 's' : ''}
                    <ChevronRight size={11} className={`transition-colors ${isActive ? 'text-primary' : 'group-hover:text-text-muted'}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="xl:sticky xl:top-[136px]">
          <ChallengeConfigForm 
            selected={selected} 
            isNew={isNew} 
            form={form} 
            setForm={setForm} 
            setSelected={setSelected} 
            showToast={showToast} 
          />
        </div>
      </div>
    </div>
  );
}
