import React from 'react';
import { Card } from '../ui/Card';

export function EmptyState({ title = 'No data found', description = 'Adjust filters or try a different search.' }) {
  return (
    <Card title="Empty State" subtitle={title}>
      <p className="text-[14px] leading-6 text-text-muted">{description}</p>
    </Card>
  );
}
