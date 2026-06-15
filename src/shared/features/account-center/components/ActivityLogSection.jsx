import React, { useState, useMemo } from 'react';
import { Filter, Eye, Shield } from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { TSelect, Btn } from '@/features/settings/components/SettingsForm';
import { MainTable } from '@/components/common/table';
import { AdminModal } from '@/components/overlays/AdminModal';

const MOCK_LOGS = [
  { id: '1', action: 'User Login', category: 'Auth', timestamp: '2026-06-03 07:12:34', ip: '103.45.19.12', status: 'Success', details: { device: 'Chrome on Windows 11', location: 'Mumbai, India', authMethod: 'Password + 2FA' } },
  { id: '2', action: 'Update Profile Info', category: 'Account', timestamp: '2026-06-02 14:15:10', ip: '103.45.19.12', status: 'Success', details: { changes: { name: 'Arjun Sathia', phone: '+1 (555) 019-2834' } } },
  { id: '3', action: 'API Key Generation', category: 'API Keys', timestamp: '2026-06-02 10:30:45', ip: '103.45.19.12', status: 'Success', details: { keyName: 'AlgoTrader Node v1', scopes: ['read', 'trade'], restrictions: 'IP Whitelisted' } },
  { id: '4', action: 'MFA Status Modified', category: 'Security', timestamp: '2026-06-01 16:44:12', ip: '103.45.19.12', status: 'Success', details: { mfaEnabled: true, deviceType: 'Google Authenticator App' } },
  { id: '5', action: 'Failed Login Attempt', category: 'Auth', timestamp: '2026-06-01 09:15:22', ip: '82.165.19.5', status: 'Failed', details: { failureReason: 'Incorrect password threshold met', usernameAttempt: 'admin@livetrade.pro' } },
  { id: '6', action: 'Password Password Reset', category: 'Security', timestamp: '2026-05-28 11:22:45', ip: '185.120.3.54', status: 'Success', details: { method: 'Email Recovery Verification Link' } },
  { id: '7', action: 'API Key Revoked', category: 'API Keys', timestamp: '2026-05-25 15:40:02', ip: '185.120.3.54', status: 'Success', details: { keyName: 'Node Legacy API', reason: 'Key rotation scheduled' } },
  { id: '8', action: 'Session Terminated', category: 'Security', timestamp: '2026-05-22 14:02:18', ip: '103.45.19.12', status: 'Success', details: { sessionId: 's288a', targetDevice: 'Safari on iPad Pro' } },
];

export function ActivityLogSection() {
  const [filterAction, setFilterAction] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  // Derive unique category types
  const categories = useMemo(() => {
    return ['All', ...new Set(MOCK_LOGS.map(log => log.category))];
  }, []);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchAction = filterAction === 'All' || log.category === filterAction;
      const matchStatus = filterStatus === 'All' || log.status === filterStatus;
      return matchAction && matchStatus;
    });
  }, [filterAction, filterStatus]);

  // MainTable Columns
  const logColumns = [
    {
      key: 'category',
      label: 'Category',
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[10px] font-black uppercase tracking-[0.05em] border"
          style={{
            background: 'color-mix(in srgb, var(--brand) 8%, var(--surface))',
            color: 'var(--brand)',
            borderColor: 'color-mix(in srgb, var(--brand) 15%, transparent)'
          }}
        >
          {val}
        </span>
      )
    },
    {
      key: 'action',
      label: 'Operation Action',
      render: (val) => <span className="font-semibold text-text group-hover:text-brand transition-colors font-heading">{val}</span>
    },
    {
      key: 'timestamp',
      label: 'Date & Time',
      render: (val) => <span className="text-text-muted/65 font-heading">{val}</span>
    },
    {
      key: 'ip',
      label: 'IP Address',
      render: (val) => <span className="font-mono text-[11.5px] text-text-muted/50">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 font-bold text-[11px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-[5px] ${val === 'Success' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'inspect',
      label: 'Inspect',
      align: 'center',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setSelectedLog(row); }}
          className="w-7 h-7 rounded-[6px] hover:bg-muted-surface flex items-center justify-center text-text-muted/50 hover:text-brand transition-all cursor-pointer mx-auto border border-transparent hover:border-border/30"
        >
          <Eye size={13} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in relative">
      
      {/* Filters Bar Card */}
      <SettingsCard
        title="Personal Activity Logs"
        desc="Chronological list of operations committed by your user account credentials."
        Icon={Shield}
      >
        <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-text-muted/40" />
            <span className="text-[12.5px] font-bold text-text font-heading">Filter Audit Trail</span>
          </div>

          <div className="flex flex-wrap gap-3.5">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.08em] text-text-muted/40 font-heading">Category:</span>
              <div className="w-[140px]">
                <TSelect
                  value={filterAction}
                  onChange={setFilterAction}
                  options={categories.map(c => ({ value: c, label: c }))}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.08em] text-text-muted/40 font-heading">Status:</span>
              <div className="w-[140px]">
                <TSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'Success', label: 'Success' },
                    { value: 'Failed', label: 'Failed' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Logs Table Card */}
      <SettingsCard>
        <MainTable
          columns={logColumns}
          data={filteredLogs}
          onRowClick={(row) => setSelectedLog(row)}
          emptyTitle="No matching personal activities found in audit log trail"
        />
      </SettingsCard>

      {/* Details Inspector Modal Overlay */}
      <AdminModal
        open={!!selectedLog}
        title={selectedLog?.action ?? ''}
        subtitle="Inspect personal audit trail metadata payload"
        actionLabel="Activity Inspector"
        onClose={() => setSelectedLog(null)}
        maxWidth="max-w-[500px]"
        footer={
          <div className="flex justify-end">
            <Btn
              onClick={() => setSelectedLog(null)}
              label="Close Inspector"
              variant="default"
            />
          </div>
        }
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-[12.5px] border-b border-border/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/45 font-heading">Audit ID</span>
                <p className="font-semibold text-text mt-0.5 font-heading">#{selectedLog.id}</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/45 font-heading">Category</span>
                <p className="font-semibold text-text mt-0.5 font-heading">{selectedLog.category}</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/45 font-heading">IP Address</span>
                <p className="font-mono text-text mt-0.5">{selectedLog.ip}</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/45 font-heading">Date & Time</span>
                <p className="font-semibold text-text mt-0.5 font-heading">{selectedLog.timestamp}</p>
              </div>
            </div>

            {/* JSON Metadata Payload Block */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/45 block font-heading">Metadata payload</span>
              <pre className="p-3.5 rounded-[10px] border border-border/20 font-mono text-[11.5px] overflow-auto max-h-[180px] leading-relaxed select-all"
                style={{
                  background: 'var(--bg)',
                  color: 'color-mix(in srgb, var(--brand) 85%, var(--text))'
                }}
              >
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </AdminModal>

    </div>
  );
}
