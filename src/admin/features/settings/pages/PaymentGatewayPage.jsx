import React, { useState } from 'react';
import { CreditCard, BadgePercent, ArrowUpDown, ChevronDown, Wifi, Edit2, Lock, Unlock, Plus, Landmark, Coins, Wallet, Globe, Shield } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  Toggle,
  ToggleRow,
  Btn,
  WarnBanner,
} from '../components/SettingsForm';
import { PROCESSING_DELAY_OPTIONS, CURRENCY_OPTIONS } from '../configs/payment.config';

/**
 * PaymentGatewayPage — Manages individual payment processors and global checkout fee structures.
 */
export function PaymentGatewayPage({
  gateways,
  setGateways,
  globalFees,
  updateGlobalFeesField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('gateways');
  const [expandedGateway, setExpandedGateway] = useState(null);

  const tabs = [
    { id: 'gateways', label: 'Gateways', Icon: CreditCard },
    { id: 'fees', label: 'Fee Rules', Icon: BadgePercent },
    { id: 'priority', label: 'Priority Order', Icon: ArrowUpDown },
  ];

  const handleToggleGateway = (id, field) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: !g[field] } : g))
    );
  };

  const handleMoveGateway = (index, direction) => {
    const nextGateways = [...gateways];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextGateways.length) return;

    // Swap elements
    const temp = nextGateways[index];
    nextGateways[index] = nextGateways[targetIndex];
    nextGateways[targetIndex] = temp;

    // Reassign priority properties
    const reordered = nextGateways.map((gw, idx) => ({
      ...gw,
      priority: idx + 1,
    }));

    setGateways(reordered);
  };

  const gatewayIcons = {
    stripe: CreditCard,
    fireblocks: Coins,
    swift: Landmark,
    skrill: Wallet,
    adyen: CreditCard,
    neteller: Wallet,
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Payment Gateways"
        desc="Manage payment services, bank transfers, and fees."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'gateways' && (
        <div className="space-y-3.5">
          {gateways.map((gw) => {
            const isExpanded = expandedGateway === gw.id;
            const GatewayIcon = gatewayIcons[gw.id] || CreditCard;
            return (
              <div
                key={gw.id}
                className={`rounded-[10px] border transition-all duration-300 overflow-hidden relative group
                  ${isExpanded
                    ? 'border-brand/35 bg-surface-elevated/90'
                    : 'border-border/25 bg-surface-elevated/45 hover:border-border/45 hover:bg-surface-elevated/65'}`}
              >
                {/* Gateway Summary Row */}
                <div
                  onClick={() => setExpandedGateway(isExpanded ? null : gw.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-[8px] bg-bg/50 border border-border/20 flex items-center justify-center text-text-muted/40 group-hover:text-brand group-hover:border-brand/30 transition-all duration-200">
                      <GatewayIcon size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13.5px] font-bold font-heading text-text transition-colors group-hover:text-brand">
                          {gw.name}
                        </span>
                        {gw.testMode && (
                          <span className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-black uppercase bg-warning/10 border border-warning/30 text-warning">
                            Test Mode
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-text-muted/70 font-heading">
                        <span>{gw.rails.join(' · ')}</span>
                        <span>·</span>
                        <span>Fees: {gw.fee}</span>
                        <span>·</span>
                        <span>{gw.currencies.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4.5 self-end sm:self-center">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-[0.09em] border whitespace-nowrap flex-shrink-0"
                      style={{
                        color: gw.enabled ? 'var(--positive)' : 'var(--text-muted)',
                        background: gw.enabled
                          ? 'rgba(74, 225, 118, 0.1)'
                          : 'var(--border)',
                        borderColor: gw.enabled
                          ? 'rgba(74, 225, 118, 0.2)'
                          : 'transparent',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: gw.enabled ? 'var(--positive)' : 'var(--text-muted)',
                        }}
                      />
                      {gw.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        val={gw.enabled}
                        onChange={() => handleToggleGateway(gw.id, 'enabled')}
                      />
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-text-muted/30 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand' : ''}`}
                    />
                  </div>
                </div>

                {/* Extended Configuration Form */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2.5 border-t border-border/10 animate-in slide-in-from-top-1.5 duration-200">
                    <FGroup cols={2}>
                      <div>
                        <FieldLabel hint="Gateway authentication key">API Key</FieldLabel>
                        <TInput value={`pk_live_••••••••${gw.id}`} readOnly mono />
                      </div>
                      <div>
                        <FieldLabel hint="URL that receives gateway events">Webhook URL</FieldLabel>
                        <TInput value={`https://api.live-trader.com/webhooks/${gw.id}`} readOnly mono />
                      </div>
                      <div>
                        <FieldLabel hint="Custom fee for this gateway">Fee Override</FieldLabel>
                        <TInput value={gw.fee} onChange={() => { }} mono />
                      </div>
                      <div>
                        <FieldLabel hint="Supported currencies">Currencies</FieldLabel>
                        <TInput value={gw.currencies.join(', ')} onChange={() => { }} />
                      </div>
                    </FGroup>

                    <div className="mt-4.5 rounded-[8px] border border-border/15 bg-bg px-4 py-1">
                      <ToggleRow
                        label="Test Mode"
                        desc="Use sandbox — no real money is moved"
                        val={gw.testMode}
                        onChange={() => handleToggleGateway(gw.id, 'testMode')}
                      />
                      <ToggleRow
                        label="Auto-Settle"
                        desc="Automatically settle payments every 24 hours"
                        val={true}
                        onChange={() => { }}
                      />
                      <ToggleRow
                        label="3D Secure"
                        desc="Require 3D Secure card verification"
                        val={gw.id === 'stripe'}
                        onChange={() => { }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4.5">
                      <Btn Icon={Wifi} label="Test" variant="cyan" small onClick={() => alert(`${gw.name} connected.`)} />
                      <Btn Icon={Edit2} label="Edit" variant="default" small onClick={() => { }} />
                      {gw.enabled ? (
                        <Btn Icon={Lock} label="Disable" variant="danger" small onClick={() => handleToggleGateway(gw.id, 'enabled')} />
                      ) : (
                        <Btn Icon={Unlock} label="Enable" variant="primary" small onClick={() => handleToggleGateway(gw.id, 'enabled')} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 h-11 rounded-[10px] border border-dashed border-border/30 hover:border-brand/40 hover:bg-brand/[0.02] text-[12px] font-semibold font-heading text-text-muted/40 hover:text-brand transition-all duration-300 cursor-pointer"
          >
            <Plus size={14} /> Add Gateway
          </button>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="space-y-5">
          <SettingsCard
            title="Fee Rules"
            desc="Set default fees for deposits and withdrawals."
            Icon={BadgePercent}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Default % fee on deposits">Deposit Fee</FieldLabel>
                <TInput
                  value={globalFees.depositFee}
                  onChange={(v) => updateGlobalFeesField('depositFee', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Default % fee on withdrawals">Withdrawal Fee</FieldLabel>
                <TInput
                  value={globalFees.withdrawalFee}
                  onChange={(v) => updateGlobalFeesField('withdrawalFee', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Minimum withdrawal amount">Min Withdrawal</FieldLabel>
                <TInput
                  value={globalFees.minWithdrawal}
                  onChange={(v) => updateGlobalFeesField('minWithdrawal', v)}
                  mono
                  suffix="USD"
                />
              </div>
              <div>
                <FieldLabel hint="Max withdrawal per day per account">Max Withdrawal (Daily)</FieldLabel>
                <TInput
                  value={globalFees.maxWithdrawal}
                  onChange={(v) => updateGlobalFeesField('maxWithdrawal', v)}
                  mono
                  suffix="USD"
                />
              </div>
              <div>
                <FieldLabel hint="How long withdrawals take">Withdrawal Time</FieldLabel>
                <TSelect
                  value={globalFees.processingDelay}
                  onChange={(v) => updateGlobalFeesField('processingDelay', v)}
                  options={PROCESSING_DELAY_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Default currency for fee calculations">Fee Currency</FieldLabel>
                <TSelect
                  value={globalFees.currency}
                  onChange={(v) => updateGlobalFeesField('currency', v)}
                  options={CURRENCY_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'priority' && (
        <div className="space-y-5">
          <WarnBanner
            severity="info"
            title="Priority Order"
            message="The gateway with the highest priority is used first. If a payment method is supported by multiple active gateways, the top one is chosen."
          />

          <SettingsCard
            title="Gateway Priority"
            desc="Drag or reorder to set which gateway is tried first."
            Icon={ArrowUpDown}
          >
            <div className="space-y-2">
              {[...gateways]
                .sort((a, b) => a.priority - b.priority)
                .map((gw, idx, arr) => (
                  <div
                    key={gw.id}
                    className="flex items-center gap-3.5 rounded-[8px] border border-border/20 bg-bg px-4 py-3.5 hover:border-border/40 transition-all duration-200 group"
                  >
                    <span className="text-[11.5px] font-mono font-bold text-text-muted/30 w-5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-bold font-heading text-text/85">
                        {gw.name}
                      </div>
                      <div className="text-[10px] text-text-muted/40 font-heading mt-0.5">
                        {gw.rails.join(' · ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider"
                        style={{
                          color: gw.enabled ? 'var(--positive)' : 'var(--text-muted)',
                          background: gw.enabled
                            ? 'rgba(74, 225, 118, 0.1)'
                            : 'var(--border)',
                          border: `1px solid ${gw.enabled ? 'rgba(74, 225, 118, 0.15)' : 'transparent'}`,
                        }}
                      >
                        {gw.enabled ? 'Active' : 'Disabled'}
                      </span>
                      {gw.testMode && (
                        <span className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-black uppercase bg-warning/10 border border-warning/20 text-warning">
                          Test Mode
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                      <button
                        type="button"
                        onClick={() => handleMoveGateway(idx, 'up')}
                        disabled={idx === 0}
                        className="w-5.5 h-5.5 rounded flex items-center justify-center hover:bg-border/10 text-text-muted/35 hover:text-text disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown size={11} className="rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveGateway(idx, 'down')}
                        disabled={idx === arr.length - 1}
                        className="w-5.5 h-5.5 rounded flex items-center justify-center hover:bg-border/10 text-text-muted/35 hover:text-text disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown size={11} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save Payment Settings"
      />
    </div>
  );
}

export default PaymentGatewayPage;
