import React from 'react';
import { Edit2, Zap, Check, Trash2, FileText, Layers } from 'lucide-react';
import { Card, SectionHead, FormField, TextInput, SelectInput, IconBtn } from './PropComponents';

export function ChallengeConfigForm({ selected, isNew, form, setForm, setSelected, showToast }) {
  const f = (k) => form[k] ?? '';
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  if (!selected) {
    return (
      <div className="rounded-[12px] border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <Layers size={28} className="text-text-muted/20 mx-auto mb-3" />
        <div className="text-[13px] font-heading font-semibold text-text-muted/40">Select a challenge to edit</div>
        <div className="text-[11px] text-text-muted/25 font-heading mt-1">or create a new one</div>
      </div>
    );
  }

  return (
    <Card>
      <SectionHead title={isNew ? 'New Challenge' : 'Edit Challenge'} Icon={Edit2} />
      <div className="space-y-3">
        <FormField label="Name">
          <TextInput value={f('name')} onChange={set('name')} placeholder="e.g. Standard 10K" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Size">
            <TextInput value={f('size')} onChange={set('size')} placeholder="$10,000" mono />
          </FormField>
          <FormField label="Fee">
            <TextInput value={f('fee')} onChange={set('fee')} placeholder="$79" mono />
          </FormField>
          <FormField label="Target">
            <TextInput value={f('profitTarget')} onChange={set('profitTarget')} placeholder="10%" mono />
          </FormField>
          <FormField label="Daily Limit">
            <TextInput value={f('maxDaily')} onChange={set('maxDaily')} placeholder="5%" mono />
          </FormField>
          <FormField label="Total Limit">
            <TextInput value={f('maxTotal')} onChange={set('maxTotal')} placeholder="10%" mono />
          </FormField>
          <FormField label="Min Days">
            <TextInput value={f('minDays')} onChange={set('minDays')} type="number" mono />
          </FormField>
        </div>
        <FormField label="Leverage">
          <SelectInput value={f('leverage')} onChange={set('leverage')}
            options={['1:10', '1:20', '1:30', '1:50', '1:100', '1:200', '1:500']} />
        </FormField>
        <FormField label="Phases">
          <SelectInput value={String(f('phases'))} onChange={v => set('phases')(Number(v))}
            options={[{ label: '1 Phase', value: '1' }, { label: '2 Phases', value: '2' }]} />
        </FormField>
        <FormField label="Restricted Symbols" hint="Comma-separated. Leave blank for none.">
          <TextInput value={f('restricted')} onChange={set('restricted')} placeholder="BTCUSD, ETHUSD" mono />
        </FormField>
        <FormField label="Status">
          <SelectInput value={f('status')} onChange={set('status')}
            options={['DRAFT', 'PUBLISHED', 'PAUSED']} />
        </FormField>
        <div className="flex gap-2 pt-2">
          <IconBtn label="Save" Icon={FileText} variant="default" onClick={() => showToast('Draft saved')} />
          <IconBtn label={isNew ? 'Publish' : 'Update'} Icon={isNew ? Zap : Check} variant="success" onClick={() => showToast(isNew ? 'Challenge published' : 'Challenge updated')} />
          {!isNew && <IconBtn label="Delete" Icon={Trash2} variant="danger" onClick={() => { setSelected(null); showToast('Deleted'); }} />}
        </div>
      </div>
    </Card>
  );
}
