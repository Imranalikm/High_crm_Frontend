import React from 'react';

export function DrawerFooter({ children, className = '' }) {
  return (
    <div className={`shrink-0 border-t border-border/15 px-6 py-5 bg-surface-elevated/50 backdrop-blur-sm relative z-[5] ${className}`}>
      {children}
    </div>
  );
}
