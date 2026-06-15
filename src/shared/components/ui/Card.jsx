import React from 'react';

/**
 * Standard Operational Card
 *
 * Props:
 *   title    — small uppercase section label shown above the heading
 *   heading  — main card heading (rendered prominently)
 *   actions  — JSX rendered in the top-right of the header
 *   padding  — bool (default true), adds p-6 to content area
 *   className — additional classes forwarded to wrapper
 */
export function Card({
  children,
  title,
  heading,
  /** @deprecated use `heading` instead — kept for backward compat with subtitle */
  subtitle,
  actions,
  className = '',
  padding = true,
  contentClassName = '',
  ...props
}) {
  const displayHeading = heading ?? subtitle; // backward compat

  return (
    <div
      className={`bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[10px] relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {(title || displayHeading || actions) && (
        <div className="px-5 py-4 flex justify-between items-start gap-3 border-b border-border/15">
          <div className="flex flex-col gap-0.5 min-w-0">
            {title && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55 leading-none">
                {title}
              </p>
            )}
            {displayHeading && (
              <p className="text-[14px] font-semibold text-text tracking-[-0.02em] leading-snug">
                {displayHeading}
              </p>
            )}
          </div>
          {actions && <div className="flex gap-2 items-center shrink-0">{actions}</div>}
        </div>
      )}
      <div className={padding ? `p-5 ${contentClassName}` : contentClassName}>{children}</div>
    </div>
  );
}

