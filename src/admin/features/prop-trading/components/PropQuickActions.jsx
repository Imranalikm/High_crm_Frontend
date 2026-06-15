import React from 'react';
import { Plus, CheckCircle2, Download, AlertOctagon, CircleDollarSign, Settings, Zap } from 'lucide-react';
import { Card, SectionHead, IconBtn } from './PropComponents';

export function PropQuickActions() {
  const actions = [
    { label: 'New Challenge', Icon: Plus, variant: 'brand' },
    { label: 'Bulk Approve', Icon: CheckCircle2, variant: 'success' },
    { label: 'Export Report', Icon: Download, variant: 'default' },
    { label: 'Risk Queue', Icon: AlertOctagon, variant: 'warning' },
    { label: 'Batch Payout', Icon: CircleDollarSign, variant: 'cyan' },
    { label: 'Edit Rules', Icon: Settings, variant: 'default' },
  ];

  return (
    <Card>
      <SectionHead title="Quick Actions" Icon={Zap} />
      <div className="flex flex-wrap gap-2">
        {actions.map(a => <IconBtn key={a.label} {...a} />)}
      </div>
    </Card>
  );
}
