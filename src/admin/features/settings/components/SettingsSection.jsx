import React from 'react';

/**
 * SettingsSection — A standardized top header layout for settings pages
 * Displays the page/section title, description, a contextual Lucide icon,
 * and optional inline action components (like "Test Connection" buttons).
 */
export function SettingsSection({ title, Icon, desc, action }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-border/15 transition-all duration-300">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div className="w-9 h-9 rounded-[8px] bg-muted-surface border border-border/40 flex items-center justify-center text-text-muted/50 group-hover:text-primary transition-all duration-300 mt-0.5">
            <Icon size={16} className="text-text-muted/65 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        <div className="space-y-0.5">
          <h2 className="text-[15px] font-bold font-heading tracking-[-0.015em] text-text">
            {title}
          </h2>
          {desc && (
            <p className="text-[11.5px] text-text-muted/40 font-heading leading-relaxed max-w-xl">
              {desc}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-2 self-end sm:self-center">
          {action}
        </div>
      )}
    </div>
  );
}

export default SettingsSection;
