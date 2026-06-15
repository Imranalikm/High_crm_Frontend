import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Btn } from './SettingsForm';

/**
 * SaveBar — An interactive action-row for committing page config alterations.
 * Supports:
 * - Unsaved/Dirty pulsing visual highlights
 * - Single-click "Reset" actions
 * - Async loading commit states with success ticks
 * - Custom extra actions injection
 */
export function SaveBar({ onSave, onReset, isDirty, label = 'Save Changes', extraActions }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await onSave?.();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between rounded-[10px] border px-5 py-3 transition-all duration-300 relative overflow-hidden mt-6 z-10
        ${isDirty
          ? 'border-brand/25 bg-brand-muted'
          : 'border-border/30 bg-surface-elevated'}
      `}
    >
      <div className="flex items-center gap-2.5 text-[11.5px] font-heading z-10">
        {isDirty ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-brand font-bold tracking-tight">Unsaved changes</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={13} className="text-positive" />
            <span className="text-text-muted/40 font-semibold">All changes saved</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 z-10">
        {extraActions}
        <Btn label="Reset" Icon={RotateCcw} variant="default" small onClick={onReset} disabled={!isDirty || saving} />
        <Btn label={label} Icon={Save} variant="primary" small onClick={handleSave} loading={saving} disabled={!isDirty} />
      </div>

      {/* Dynamic background lighting for unsaved status */}
      {isDirty && (
        <span className="absolute left-0 bottom-0 top-0 w-1 bg-brand pointer-events-none" />
      )}
    </div>
  );
}

export default SaveBar;
