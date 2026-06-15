import React from 'react';

/**
 * SettingsCard — A polished, responsive container card for groups of settings inputs.
 * Supports:
 * - Neutral, Warning, and Danger severity states
 * - Custom header icons & descriptive taglines
 * - Inline header actions
 * - Premium interactive borders and hover visual effects
 */
export function SettingsCard({
  title,
  desc,
  Icon,
  children,
  danger,
  warning,
  action,
}) {
  const getCardStyle = () => {
    if (danger) return 'border-negative/30 bg-negative/[0.03]';
    if (warning) return 'border-warning/30 bg-warning/[0.03]';
    return 'border-border/40 bg-surface-elevated';
  };

  const getIconStyle = () => {
    if (danger) return 'bg-negative/10 border border-negative/20 text-negative';
    if (warning) return 'bg-warning/10 border border-warning/20 text-warning';
    return 'bg-muted-surface border border-border/40 text-text-muted/70';
  };

  return (
    <div
      className={`rounded-[10px] border overflow-hidden transition-all duration-300 relative ${getCardStyle()}`}
    >
      {(title || desc) && (
        <div
          className={`px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10
            ${children ? 'border-b border-border/15' : ''}`}
        >
          <div className="flex items-start gap-3.5">
            {Icon && (
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${getIconStyle()}`}
              >
                <Icon size={14} />
              </div>
            )}
            <div className="space-y-0.5">
              <div
                className={`text-[13.5px] font-semibold font-heading tracking-[-0.015em] transition-colors duration-200
                  ${danger ? 'text-negative' : warning ? 'text-warning' : 'text-text'}`}
              >
                {title}
              </div>
              {desc && (
                <div className="text-[11.5px] text-text-muted/60 font-heading leading-snug">
                  {desc}
                </div>
              )}
            </div>
          </div>
          {action && (
            <div className="flex items-center gap-2 self-end sm:self-center">
              {action}
            </div>
          )}
        </div>
      )}
      {children && <div className="p-5 relative z-10">{children}</div>}
    </div>
  );
}

export default SettingsCard;
