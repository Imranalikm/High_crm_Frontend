import React, { useState } from 'react';
import { Key, ShieldAlert, Plus, Calendar, Trash2, Copy, Check } from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import {
  FieldLabel,
  TInput,
  Btn,
  WarnBanner,
} from '@/features/settings/components/SettingsForm';
import { MainTable } from '@/components/common/table';
import { AdminModal } from '@/components/overlays/AdminModal';

const INITIAL_KEYS = [
  { id: 'k1', name: 'MetaTrader Algo Bot', scopes: ['Read', 'Trade'], tokenMask: 'lt_live_a8f9...d3e1', created: '2026-06-02', ipWhitelist: '103.45.19.12' },
  { id: 'k2', name: 'Analytics Sync Node', scopes: ['Read'], tokenMask: 'lt_live_d21c...8a4f', created: '2026-05-28', ipWhitelist: 'All' }
];

export function ApiKeysSection({ user }) {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [keyName, setKeyName] = useState('');
  const scopeRead = true;
  const [scopeTrade, setScopeTrade] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');

  // Result state
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  // Revoke confirm state
  const [keyToRevoke, setKeyToRevoke] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const newSecret = `lt_secret_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const mask = `lt_live_${newSecret.substring(10, 14)}...${newSecret.substring(newSecret.length - 4)}`;

      const newKeyEntry = {
        id: `k-${Date.now()}`,
        name: keyName,
        scopes: [scopeRead && 'Read', scopeTrade && 'Trade'].filter(Boolean),
        tokenMask: mask,
        created: new Date().toISOString().split('T')[0],
        ipWhitelist: ipWhitelist.trim() || 'All'
      };

      setKeys(prev => [newKeyEntry, ...prev]);
      setGeneratedKey({
        name: keyName,
        secret: newSecret
      });
      setLoading(false);
      setIsGenerating(false);

      // Reset form
      setKeyName('');
      setScopeTrade(false);
      setIpWhitelist('');
    }, 1200);
  };

  const handleRevoke = (id) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    setKeyToRevoke(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If user role is operations or auditor, restrict access
  if (user?.role === 'operations' || user?.role === 'auditor') {
    return (
      <div className="animate-fade-in">
        <SettingsCard
          title="Programmatic API Keys Restricted"
          desc="Access privilege limit for security audit controls."
          Icon={ShieldAlert}
          warning
        >
          <div className="text-center py-6 space-y-3">
            <ShieldAlert size={40} className="text-warning mx-auto animate-pulse" />
            <p className="text-[13px] text-text-muted/60 max-w-[450px] mx-auto leading-relaxed font-heading">
              Your current personnel role (<strong className="text-text capitalize">{user.role}</strong>) is restricted from creating personal API tokens. API keys are reserved for traders (clients) and platform super administrators.
            </p>
          </div>
        </SettingsCard>
      </div>
    );
  }

  // Columns definition for MainTable
  const apiKeyColumns = [
    { key: 'name', label: 'API Key Name', render: (val) => <span className="font-semibold text-text font-heading">{val}</span> },
    {
      key: 'scopes',
      label: 'Scopes',
      render: (val) => (
        <div className="flex gap-1">
          {val.map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-[4px] text-[9.5px] font-black uppercase tracking-[0.05em] bg-muted-surface text-text-muted/80 border border-border/10 font-heading">
              {s}
            </span>
          ))}
        </div>
      )
    },
    { key: 'tokenMask', label: 'Token Mask', render: (val) => <span className="font-mono text-text-muted/65">{val}</span> },
    { key: 'ipWhitelist', label: 'IP Restriction', render: (val) => <span className="text-[12px] font-medium text-text-muted/70 font-heading">{val}</span> },
    {
      key: 'created',
      label: 'Created Date',
      render: (val) => (
        <div className="flex items-center gap-1 font-heading text-text-muted/65">
          <Calendar size={12} className="text-text-muted/30" /> {val}
        </div>
      )
    },
    {
      key: 'id',
      label: 'Revoke',
      align: 'center',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setKeyToRevoke(row)}
          className="w-7 h-7 rounded-[6px] hover:bg-negative/10 flex items-center justify-center text-text-muted/40 hover:text-negative transition-all cursor-pointer mx-auto border border-transparent hover:border-negative/20"
        >
          <Trash2 size={13} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Description & Action Card */}
      <SettingsCard
        title="Personal API Integrations"
        desc="Generate personal API access credentials to automate trading strategies or connect analytics nodes."
        Icon={Key}
        action={
          <Btn
            onClick={() => setIsGenerating(true)}
            Icon={Plus}
            label="Create API Key"
            variant="brand"
          />
        }
      >
        <p className="text-[12.5px] text-text-muted/65 leading-relaxed font-heading">
          Keep secret keys safe; they will only be displayed once. Avoid sharing tokens with third parties, as they grant complete programmatic permission privileges on your trading terminal.
        </p>
      </SettingsCard>

      {/* Keys List Table Card */}
      <SettingsCard>
        <MainTable
          columns={apiKeyColumns}
          data={keys}
          emptyTitle="No active personal API credentials configured"
        />
      </SettingsCard>

      {/* Generate API Key Modal Dialog */}
      <AdminModal
        open={isGenerating}
        title="Generate API Token"
        subtitle="Configure access permission parameters for the new programmatic token"
        actionLabel="Access Keys"
        onClose={() => setIsGenerating(false)}
        maxWidth="max-w-[460px]"
        footer={
          <div className="flex justify-end gap-2.5">
            <Btn
              onClick={() => setIsGenerating(false)}
              label="Cancel"
              variant="default"
            />
            <Btn
              type="submit"
              onClick={handleGenerate}
              label={loading ? 'Generating...' : 'Generate Token'}
              variant="brand"
              loading={loading}
              disabled={!keyName.trim()}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <FieldLabel required hint="Display name for identity referencing">API Key Name</FieldLabel>
            <TInput
              value={keyName}
              onChange={setKeyName}
              placeholder="e.g. MetaTrader Algo Bot"
              required
            />
          </div>

          <div>
            <FieldLabel required hint="Access actions allowed by this credential">Scopes & Access</FieldLabel>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-text cursor-pointer font-heading">
                <input
                  type="checkbox"
                  checked={scopeRead}
                  readOnly
                  className="w-4 h-4 rounded border-border bg-bg text-brand accent-brand cursor-not-allowed"
                />
                Read Scopes
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-text cursor-pointer font-heading">
                <input
                  type="checkbox"
                  checked={scopeTrade}
                  onChange={(e) => setScopeTrade(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-bg text-brand accent-brand cursor-pointer"
                />
                Trade Scopes
              </label>
            </div>
          </div>

          <div>
            <FieldLabel hint="Whitelisted IPs allowed to execute requests (optional)">IP Whitelisting (Recommended)</FieldLabel>
            <TInput
              value={ipWhitelist}
              onChange={ipWhitelist => setIpWhitelist(ipWhitelist)}
              placeholder="e.g. 103.45.19.12, 94.200.12.8"
              mono
            />
            <p className="text-[11px] text-text-muted/40 mt-1 leading-normal font-heading">Leaving this blank allows access from any IP address (Not recommended).</p>
          </div>
        </div>
      </AdminModal>

      {/* Secret Key Display Modal Overlay */}
      <AdminModal
        open={!!generatedKey}
        title="Copy API Key Secret"
        subtitle="Write down your private secret token now before closing this panel"
        actionLabel="Generated Successfully"
        onClose={() => setGeneratedKey(null)}
        maxWidth="max-w-[480px]"
        footer={
          <div className="flex justify-end">
            <Btn
              onClick={() => setGeneratedKey(null)}
              label="I Have Copied & Saved It"
              variant="brand"
            />
          </div>
        }
      >
        {generatedKey && (
          <div className="space-y-4">
            <WarnBanner
              severity="warning"
              title="Keep this secret safe!"
              message="For security reasons, this token will only be shown ONCE. If you close this dialogue without copying, you must generate a new API key."
            />

            <div className="space-y-2">
              <FieldLabel hint="Private API access token code block">API Secret Key</FieldLabel>
              <div className="relative">
                <pre
                  className="p-3.5 pr-12 rounded-[10px] border border-border/20 font-mono text-[12px] select-all overflow-x-auto"
                  style={{ background: 'var(--bg)', color: 'var(--brand)' }}
                >
                  {generatedKey.secret}
                </pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedKey.secret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[6px] hover:bg-muted-surface flex items-center justify-center text-text-muted/50 hover:text-brand transition-colors cursor-pointer border border-border/20 bg-surface"
                >
                  {copied ? <Check size={14} className="text-positive" /> : <Copy size={13} />}
                </button>
              </div>
              {copied && <p className="text-[11.5px] font-bold text-positive mt-1 text-right font-heading">✓ Token copied to clipboard</p>}
            </div>
          </div>
        )}
      </AdminModal>

      {/* Revoke Confirm Dialog */}
      <AdminModal
        open={!!keyToRevoke}
        title="Revoke API Key?"
        subtitle="Confirm key revocation action"
        actionLabel="Revoke Key"
        onClose={() => setKeyToRevoke(null)}
        maxWidth="max-w-[400px]"
        footer={
          <div className="flex justify-center gap-3">
            <Btn
              onClick={() => setKeyToRevoke(null)}
              label="Cancel"
              variant="default"
            />
            <Btn
              onClick={() => handleRevoke(keyToRevoke.id)}
              label="Revoke Key"
              variant="danger"
            />
          </div>
        }
      >
        {keyToRevoke && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-negative/10 text-negative flex items-center justify-center mx-auto border border-negative/20">
              <Trash2 size={20} />
            </div>
            <p className="text-[13px] text-text-muted/65 leading-normal font-heading">
              Are you sure you want to revoke <strong className="text-text">"{keyToRevoke.name}"</strong>? Any automated bots or integrations using this token will fail immediately. This action is irreversible.
            </p>
          </div>
        )}
      </AdminModal>

    </div>
  );
}
