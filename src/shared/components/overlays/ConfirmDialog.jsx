import React from 'react';
import { Button } from '../ui/Button';
import { AdminModal } from './AdminModal';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  busy = false,
  actionLabel,
  onClose,
  onConfirm,
}) {
  return (
    <AdminModal
      open={open}
      title={title}
      subtitle="Confirm operational action"
      actionLabel={actionLabel}
      onClose={onClose}
      maxWidth="max-w-[520px]"
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={busy}>{confirmLabel}</Button>
        </div>
      )}
    >
      <p className="text-[14px] leading-6 text-text-muted">{description}</p>
    </AdminModal>
  );
}
