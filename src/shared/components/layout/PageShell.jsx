import React from 'react';

export function PageShell({ children, className = '' }) {
  return (
    <div className={`flex flex-col gap-6 animate-fade-in pt-2 ${className}`}>
      {children}
    </div>
  );
}
