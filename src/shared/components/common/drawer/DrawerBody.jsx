import React from 'react';

export function DrawerBody({ children, className = '' }) {
  return (
    <div className={`min-h-0 flex-1 overflow-y-auto px-6 py-6 custom-scrollbar relative z-[5] bg-bg/20 ${className}`}>
      {children}
    </div>
  );
}
