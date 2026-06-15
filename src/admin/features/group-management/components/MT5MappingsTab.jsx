import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { MainTable } from '@/components/common/table';
import { usersService } from '@/features/users/services/userService';
import { useTableState } from '@/hooks/useTableState';
import { TSelect, FieldLabel } from '@/features/settings/components/SettingsForm';
import { Check, Info, AlertCircle, Link } from 'lucide-react';

export function MT5MappingsTab({ groups, onUpdateSuccess }) {
  const [mt5Logins, setMt5Logins] = useState(() => usersService.listMt5Accounts());
  const [selectedLogin, setSelectedLogin] = useState(() => {
    const accounts = usersService.listMt5Accounts();
    return accounts.length > 0 ? accounts[0].login : '';
  });
  const [selectedGroup, setSelectedGroup] = useState(() => {
    return groups.length > 0 ? groups[0].name : '';
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sync selectedGroup when groups change
  const [prevGroupsLength, setPrevGroupsLength] = useState(groups.length);
  if (groups.length !== prevGroupsLength) {
    setPrevGroupsLength(groups.length);
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].name);
    }
  }

  const handleRowClick = (row) => {
    setSelectedLogin(row.login);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedLogin) {
      setError('Please select an MT5 Login ID.');
      return;
    }
    if (!selectedGroup) {
      setError('Please select a target Dealing Group.');
      return;
    }

    setError('');
    const targetAccount = mt5Logins.find(a => String(a.login) === String(selectedLogin));
    if (targetAccount) {
      const groupData = groups.find(g => g.name === selectedGroup);
      const updatePayload = {
        group: selectedGroup
      };

      if (groupData && groupData.maxLeverage) {
        updatePayload.leverage = groupData.maxLeverage.includes(':') 
          ? groupData.maxLeverage 
          : `1:${groupData.maxLeverage === '1' ? '100' : groupData.maxLeverage}`;
      }

      usersService.updateMt5AccountForUser(targetAccount.userId, targetAccount.login, updatePayload);
      
      usersService.logAdminAction(
        'Super Admin', 
        `MT5 Account #${targetAccount.login}`, 
        `Group changed to "${selectedGroup}"`
      );

      setSuccess(`Account #${targetAccount.login} updated!`);
      setMt5Logins(usersService.listMt5Accounts());
      onUpdateSuccess(`MT5 Account #${targetAccount.login} moved to group "${selectedGroup}"`);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError('Target account not found.');
    }
  };

  const columns = [
    {
      key: 'login',
      label: 'MT5 Login',
      render: (_, row) => (
        <div className="flex items-center gap-1.5 select-none">
          <span className="px-2 py-0.5 rounded-[5px] border border-brand/15 bg-brand/[0.04] font-mono text-[11px] font-bold text-brand tracking-wider">
            {row.login}
          </span>
        </div>
      )
    },
    {
      key: 'user',
      label: 'Account Owner',
      render: (_, row) => (
        <span className="text-[13px] font-semibold text-text">
          {row.user}
        </span>
      )
    },
    {
      key: 'group',
      label: 'Group',
      render: (_, row) => (
        <span className="font-semibold text-[12.5px] text-brand">
          {row.group || 'STANDARD'}
        </span>
      )
    },
    {
      key: 'leverage',
      label: 'Max Leverage',
      render: (_, row) => (
        <span className="font-mono text-[11.5px] text-text-muted font-medium">
          {row.leverage || '1:100'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const isFailed = row.status === 'DISCONNECTED';
        const isWarning = row.status === 'SYNC_DELAY';
        const dotColor = isFailed ? 'bg-negative' : isWarning ? 'bg-warning' : 'bg-positive';
        return (
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor} shrink-0`} />
            <span className="text-[11.5px] font-semibold text-text-muted">{row.status}</span>
          </div>
        );
      }
    }
  ];

  const tableState = useTableState(mt5Logins, { searchFields: [], initialPageSize: 10 });

  const loginOptions = mt5Logins.map(a => ({
    value: a.login,
    label: `${a.login} (${a.user})`
  }));

  const groupOptions = groups.map(g => ({
    value: g.name,
    label: g.name
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start animate-in fade-in duration-200">
      {/* Mapped accounts table list */}
      <div className="lg:col-span-2">
        <Card padding={false}>
          <div className="p-4 border-b border-border/10 bg-bg/15">
            <h4 className="text-[13px] font-black uppercase tracking-[0.14em] text-text-muted/65 flex items-center gap-2">
              <Link size={12} className="text-brand" /> All Accounts
            </h4>
            <p className="text-[11px] text-text-muted/40 mt-1 leading-snug">
              Click any row to select that account for reassignment.
            </p>
          </div>
          
          <MainTable
            columns={columns}
            data={tableState.items}
            onRowClick={handleRowClick}
            emptyTitle="No MT5 accounts available."
            pagination={tableState}
            rowClassName={(row) => 
              String(row.login) === String(selectedLogin)
                ? 'bg-brand/[0.04] border-l-brand border-l-3 transition-all'
                : 'hover:bg-brand/[0.01] hover:border-l-brand hover:border-l-3 transition-all'
            }
          />
        </Card>
      </div>

      {/* Reassignment Panel controls */}
      <div className="lg:col-span-1">
        <Card padding={true}>
          <h3 className="text-[14px] font-bold text-text mb-1">Change Group</h3>
          <p className="text-[12px] text-text-muted/50 leading-relaxed mb-4">
            Move an account to a different group to update its limits and trading settings.
          </p>

          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="rounded-[8px] border border-negative/20 bg-negative/5 px-3 py-2.5 text-[11.5px] text-negative flex items-center gap-2">
                <AlertCircle size={13} className="shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-[8px] border border-positive/20 bg-positive/5 px-3 py-2.5 text-[11.5px] text-positive flex items-center gap-2">
                <Check size={13} className="shrink-0 animate-bounce" />
                {success}
              </div>
            )}

            <div>
              <FieldLabel required hint="Select the account login">MT5 Login</FieldLabel>
              <TSelect
                value={selectedLogin}
                onChange={setSelectedLogin}
                options={loginOptions.length > 0 ? loginOptions : [{ value: '', label: 'No logins found' }]}
                disabled={loginOptions.length === 0}
              />
            </div>

            <div>
              <FieldLabel required hint="Choose the new group">New Group</FieldLabel>
              <TSelect
                value={selectedGroup}
                onChange={setSelectedGroup}
                options={groupOptions.length > 0 ? groupOptions : [{ value: '', label: 'No groups found' }]}
                disabled={groupOptions.length === 0}
              />
            </div>

            <div className="rounded-[9px] border border-border/15 bg-bg/30 px-3.5 py-3 flex items-start gap-2.5 text-text-muted/65 leading-relaxed text-[11px] mt-2">
              <Info size={13} className="text-brand shrink-0 mt-0.5 animate-pulse" />
              <div>
                Leverage is updated automatically when you change the group.
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loginOptions.length === 0 || groupOptions.length === 0}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-[8px] bg-brand text-bg hover:brightness-110 border border-brand/20 text-[12.5px] font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check size={13} /> Apply Change
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default MT5MappingsTab;
