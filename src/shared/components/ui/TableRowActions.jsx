import React from 'react';

export function TableRowActions(props) {
  const { Icon, onClick, variant = 'default' } = props;
  const variantClass = {
    success: 'border-positive/20 bg-positive/[0.07] text-positive',
    danger: 'border-negative/20 bg-negative/[0.07] text-negative',
    warning: 'border-warning/20 bg-warning/[0.07] text-warning/60 hover:text-warning',
    default: 'border-border/30 text-text-muted/40 hover:text-text',
  }[variant] || 'border-border/30 text-text-muted/40';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded-[5px] border cursor-pointer transition-all hover:brightness-110 active:scale-90 ${variantClass}`}
    >
      <Icon size={10} />
    </button>
  );
}

export { TableRowActions as TableActionBtn };
