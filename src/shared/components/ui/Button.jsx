import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon, 
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-[8px] border';
  
  const variants = {
    primary:   'bg-primary text-text-on-accent border-primary/20 hover:bg-primary-strong',
    secondary: 'bg-surface-elevated border-border/20 text-text-muted hover:text-text hover:bg-surface-bright',
    ghost:     'bg-transparent border-transparent text-text-muted hover:text-text hover:bg-white/5',
    danger:    'bg-negative text-white border-negative/20 hover:bg-negative/90',
    warning:   'bg-warning/[0.12] text-warning border-warning/25 hover:bg-warning/20',
    success:   'bg-positive/[0.12] text-positive border-positive/25 hover:bg-positive/20',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-[12px]',
    lg: 'px-6 py-3 text-[13px]',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={3} />}
      {children}
    </button>
  );
}
