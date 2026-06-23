import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Ban, Edit2, Eye, Monitor, MoreHorizontal } from 'lucide-react';
import { MainTable } from '@/components/common/table';
import { StatusBadge } from '@/components/ui';

function getAvatarStyle(name = '?') {
  const seed = name.charCodeAt(0) * 37;
  return {
    background: `hsl(${seed % 360},35%,22%)`,
    color: `hsl(${seed % 360},80%,65%)`,
    border: `1px solid hsl(${seed % 360},40%,30%)`,
  };
}

const getImageUrl = (path) => {
  if (!path) return null;
  let stringPath = typeof path === 'object' ? (path.url || path.path || path.location || path.filePath || '') : path;
  if (!stringPath) return null;
  if (stringPath.startsWith('http://') || stringPath.startsWith('https://') || stringPath.startsWith('blob:') || stringPath.startsWith('/mock_')) {
    return stringPath;
  }
  let baseUrl = import.meta.env.VITE_API_URL || 'https://account.smatams.com/api';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  baseUrl = baseUrl.replace(/\/api$/, '');
  return `${baseUrl}${stringPath.startsWith('/') ? '' : '/'}${stringPath}`;
};

function UserAvatar({ name, avatar }) {
  if (avatar) {
    const avatarSrc = getImageUrl(avatar);
    return (
      <img
        src={avatarSrc}
        alt={name}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full object-cover border border-border/15"
      />
    );
  }
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
      style={getAvatarStyle(name)}
    >
      {name?.[0] ?? '?'}
    </div>
  );
}

function RowActionsMenu({ user, onOpenUser, onQuickView, onEditUser, onSuspendUser, onOpenMt5 }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        (triggerRef.current && triggerRef.current.contains(e.target)) ||
        (dropdownRef.current && dropdownRef.current.contains(e.target))
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener('scroll', handleScroll, { capture: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', handleScroll);
    };
  }, [open]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = 175; // Approx height for 5 items
      const showAbove = rect.bottom + 6 + menuHeight > window.innerHeight;
      setCoords({
        top: showAbove ? rect.top - 6 - menuHeight : rect.bottom + 6,
        left: Math.max(10, rect.right - 170), // Avoid offscreen left
      });
    }
    setOpen(!open);
  };

  const actions = [
    { label: 'View Profile', Icon: Eye, onClick: () => onOpenUser(user.id) },
    { label: 'Quick View', Icon: MoreHorizontal, onClick: () => onQuickView(user) },
    { label: 'Edit User', Icon: Edit2, onClick: () => onEditUser(user) },
    { label: 'Create MT5 Account', Icon: Monitor, onClick: () => onOpenMt5(user) },
    { label: user.suspended ? 'Unsuspend' : 'Suspend', Icon: Ban, onClick: () => onSuspendUser(user), danger: true },
  ];

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/25 bg-bg/70 text-text-muted transition-all hover:border-border/50 hover:text-text cursor-pointer"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[99999] w-[170px] rounded-[10px] border border-border/35 bg-surface p-1 shadow-card-subtle animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => { action.onClick(); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[12.5px] transition-colors hover:bg-surface-elevated cursor-pointer"
              style={{ color: action.danger ? 'var(--negative)' : 'var(--text)' }}
            >
              <action.Icon size={13} />
              {action.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export function UsersListTable({
  tableState,
  onOpenUser,
  onQuickView,
  onEditUser,
  onSuspendUser,
  onOpenMt5,
}) {
  const columns = [
    {
      key: 'profile',
      label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.name} avatar={row.avatar} />
          <div className="min-w-0">
            <div className="text-[14px] font-semibold tracking-[-0.01em] text-text group-hover:text-brand transition-colors">{row.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[11.5px] font-semibold text-text-muted">UID {row.uid}</span>
              {row.suspended && (
                <span className="px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] font-mono border border-negative/25 text-negative bg-negative/5">
                  Suspended
                </span>
              )}
            </div>
            <div className="truncate text-[12px] text-text-muted mt-0.5 font-medium">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'kyc',
      label: 'Verification',
      render: (_, row) => <StatusBadge status={row.kycStatus} />,
    },
    {
      key: 'wallet',
      label: 'Wallet',
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          <div className="font-mono text-[13.5px] font-semibold text-text leading-none">{row.walletBalance}</div>
        </div>
      ),
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          <div className="font-mono text-[11.5px] text-text font-medium leading-none">{row.lastSeen}</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">{row.source}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onOpenUser(row.id)}
            className="rounded-[6px] border border-border/25 bg-bg/50 px-3 py-1.5 text-[12.5px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text cursor-pointer animate-fade-in"
          >
            View
          </button>
          <RowActionsMenu
            user={row}
            onOpenUser={onOpenUser}
            onQuickView={onQuickView}
            onEditUser={onEditUser}
            onSuspendUser={onSuspendUser}
            onOpenMt5={onOpenMt5}
          />
        </div>
      ),
    },
  ];

  return (
    <MainTable
      columns={columns}
      data={tableState.items}
      onRowClick={(row) => onOpenUser(row.id)}
      emptyTitle="No users matched the current filter criteria."
      pagination={tableState}
      rowClassName={(row) => {
        const isSuspended = row.suspended;
        const isFlagged = ['FLAGGED', 'ELEVATED'].includes(row.riskStatus) || row.kycStatus === 'REJECTED';
        const isPending = row.kycStatus === 'PENDING' || row.riskStatus === 'WATCHLIST';
        
        if (isSuspended || isFlagged) return 'hover:bg-negative/5 hover:border-l-negative';
        if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
        return 'hover:bg-positive/5 hover:border-l-positive';
      }}
    />
  );
}

export function UsersMt5Table({ tableState, onOpenUser, onOpenMt5 }) {
  const columns = [
    {
      key: 'login',
      label: 'MT5 Login',
      render: (_, row) => (
        <div className="flex items-center gap-2 select-none">
          <span className="px-2 py-0.5 rounded-[5px] border border-brand/15 bg-brand/[0.04] font-mono text-[11px] font-bold text-brand tracking-wider">
            {row.login}
          </span>
          <span className="px-1.5 py-0.5 rounded-[4px] border border-border/12 bg-bg/50 font-mono text-[10.5px] font-bold text-text-muted tracking-wider">
            {row.leverage || '1:100'}
          </span>
        </div>
      )
    },
    {
      key: 'user',
      label: 'Owner',
      render: (_, row) => (
        <div>
          <div className="text-[13.5px] font-semibold text-text leading-tight">{row.user}</div>
          <button
            type="button"
            className="text-[10.5px] font-bold text-brand uppercase tracking-wider hover:text-brand-hover transition-colors cursor-pointer mt-1"
            onClick={(e) => {
              e.stopPropagation();
              onOpenUser(row.userId, 'mt5-accounts');
            }}
          >
            View Profile →
          </button>
        </div>
      )
    },
    {
      key: 'server',
      label: 'Server',
      render: (_, row) => (
        <span className="font-mono text-[11.5px] text-text-muted font-medium select-none">
          {row.server}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const isFailed = row.status === 'DISCONNECTED';
        const isWarning = row.status === 'SYNC_DELAY';
        const pulseColor = isFailed ? 'bg-negative shadow-[0_0_8px_var(--negative)]' : isWarning ? 'bg-warning shadow-[0_0_8px_var(--warning)]' : 'bg-positive shadow-[0_0_8px_var(--positive)]';
        return (
          <div className="flex items-center gap-2 select-none">
            <span className={`h-1.5 w-1.5 rounded-full ${pulseColor} animate-pulse shrink-0`} />
            <StatusBadge status={row.status} />
          </div>
        );
      }
    },
    {
      key: 'group',
      label: 'Group',
      render: (_, row) => (
        <span className="font-mono text-[11.5px] text-text-muted font-medium select-none">
          {row.group}
        </span>
      )
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (_, row) => (
        <span className="font-mono text-[13.5px] font-semibold text-text select-none">
          {row.balance}
        </span>
      )
    },
    {
      key: 'lastSync',
      label: 'Last Synced',
      render: (_, row) => (
        <span className="font-mono text-[11.5px] text-text-muted font-medium select-none">
          {row.lastSync}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenMt5(row); }}
          className="inline-flex items-center justify-center h-7 px-3.5 rounded-[7px] border border-border/15 bg-bg/25 text-text-muted hover:text-text hover:border-brand/40 hover:bg-bg/40 text-[10.5px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-[0.94] shadow-sm select-none"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <MainTable
      columns={columns}
      data={tableState.items}
      onRowClick={(row) => onOpenMt5(row)}
      emptyTitle="No MT5 accounts matched the current search."
      pagination={tableState}
      rowClassName={(row) => {
        const isFailed = row.status === 'DISCONNECTED';
        const isWarning = row.status === 'SYNC_DELAY';

        if (isFailed) return 'hover:bg-negative/[0.02] hover:border-l-negative hover:border-l-3 transition-all duration-150';
        if (isWarning) return 'hover:bg-warning/[0.02] hover:border-l-warning hover:border-l-3 transition-all duration-150';
        return 'hover:bg-positive/[0.02] hover:border-l-positive hover:border-l-3 transition-all duration-150';
      }}
    />
  );
}
