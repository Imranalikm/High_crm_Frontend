import React, { useState } from 'react';
import { ShieldCheck, FileText, Layers, ShieldAlert, Flag, RotateCcw, AlertTriangle } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TArea,
  TSelect,
  Toggle,
  ToggleRow,
  Btn,
  WarnBanner,
} from '../components/SettingsForm';
import {
  KYC_PROVIDERS,
  AML_PROVIDERS,
  RISK_TOLERANCE_OPTIONS,
  KYC_TIERS_LIST,
} from '../configs/kyc.config';

/**
 * KycSettingsPage — Manages client identity verification thresholds and risk enforcement.
 */
export function KycSettingsPage({
  kycConfig,
  updateKycField,
  updateKycNestedField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('documents');

  const tabs = [
    { id: 'documents', label: 'Documents', Icon: FileText },
    { id: 'levels', label: 'Tiers', Icon: Layers },
    { id: 'aml', label: 'AML & Risk', Icon: ShieldAlert },
    { id: 'countries', label: 'Countries', Icon: Flag },
  ];

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="KYC & Compliance"
        desc="Manage identity checks, required documents, and AML rules."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'documents' && (
        <div className="space-y-5">
          <SettingsCard
            title="Verification Provider"
            desc="Connect your identity check service."
            Icon={ShieldCheck}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Your KYC verification partner">Identity Provider</FieldLabel>
                <TSelect
                  value={kycConfig.kycProvider}
                  onChange={(v) => updateKycField('kycProvider', v)}
                  options={KYC_PROVIDERS}
                />
              </div>
              <div>
                <FieldLabel hint="Endpoint for verification requests">API Endpoint</FieldLabel>
                <TInput value="https://api.sumsub.com" readOnly mono />
              </div>
            </FGroup>
          </SettingsCard>

          <SettingsCard
            title="Required Documents"
            desc="Choose which documents users must submit for verification."
            Icon={FileText}
          >
            <div className="rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              {Object.entries(kycConfig.docs || {}).map(([docKey, enabled]) => {
                const label = docKey
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <ToggleRow
                    key={docKey}
                    label={label}
                    desc={`Require users to upload their ${label}`}
                    val={enabled}
                    onChange={(v) => updateKycNestedField('docs', docKey, v)}
                  />
                );
              })}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Resubmission Settings"
            desc="Set rules for when users can retry a failed verification."
            Icon={RotateCcw}
          >
            <FGroup cols={2}>
              <ToggleRow
                label="Allow Resubmissions"
                desc="Let users re-upload documents after rejection"
                val={kycConfig.resubmissionAllowed}
                onChange={(v) => updateKycField('resubmissionAllowed', v)}
              />
              <div>
                <FieldLabel hint="Days a rejected user must wait before retrying">Wait Before Retry</FieldLabel>
                <TInput
                  value={kycConfig.resubmissionDays || kycConfig.ResubmissionDays}
                  onChange={(v) => updateKycField('resubmissionDays', v)}
                  disabled={!kycConfig.resubmissionAllowed}
                  mono
                  suffix="DAYS"
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'levels' && (
        <div className="space-y-4">
          <WarnBanner
            severity="info"
            title="Verification Limits"
            message="Moving to a higher tier removes payout limits. Compliance checks are enforced by the trading engine."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KYC_TIERS_LIST.map((tier, idx) => {
              const colors = ['var(--cyan)', 'var(--positive)', 'var(--warning)', 'var(--brand)'];
              const c = colors[idx] || 'var(--cyan)';
              return (
                <div
                  key={tier.level}
                  className="rounded-[10px] border border-border/25 bg-surface-elevated overflow-hidden p-5 flex gap-4 relative group hover:border-border/40 transition-all duration-300"
                >
                  <div
                    className="w-1 rounded-full flex-shrink-0"
                    style={{
                      background: `linear-gradient(to bottom, ${c}, ${c}40)`,
                    }}
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[4px]" style={{ color: c, background: `color-mix(in srgb, ${c} 10%, transparent)` }}>
                        {tier.level.split(':')[0]}
                      </span>
                      <h4 className="text-[13.5px] font-bold font-heading text-text/90 mt-2">
                        {tier.level.split(':')[1]?.trim() || tier.level}
                      </h4>
                      <p className="text-[11.5px] text-text-muted/50 font-heading mt-1">
                        {tier.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border/10">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted/30 font-heading">
                      Required Checks
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.requirements.map((req) => (
                          <span
                            key={req}
                            className="text-[9.5px] font-semibold font-heading px-2 py-0.5 rounded-[4px] border border-border/30 bg-bg text-text-muted/70"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-heading font-semibold text-brand pt-1.5">
                      <span>Deposit Limit</span>
                      <span>{tier.limits}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'aml' && (
        <div className="space-y-5">
          <SettingsCard
            title="AML Scanning"
            desc="Check users against global AML databases."
            Icon={ShieldAlert}
          >
            <div className="space-y-4">
              <ToggleRow
                label="Enable AML Checks"
                desc="Check high-volume accounts against sanctions lists"
                val={kycConfig.amlScanEnabled}
                onChange={(v) => updateKycField('amlScanEnabled', v)}
              />
              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Your AML database provider">AML Provider</FieldLabel>
                  <TSelect
                    value={kycConfig.amlProvider}
                    onChange={(v) => updateKycField('amlProvider', v)}
                    options={AML_PROVIDERS}
                    disabled={!kycConfig.amlScanEnabled}
                  />
                </div>
                <div>
                  <FieldLabel hint="How strictly to match names">Risk Tolerance</FieldLabel>
                  <TSelect
                    value={kycConfig.riskThreshold}
                    onChange={(v) => updateKycField('riskThreshold', v)}
                    options={RISK_TOLERANCE_OPTIONS}
                    disabled={!kycConfig.amlScanEnabled}
                  />
                </div>
              </FGroup>

              <div className="pt-2">
                <ToggleRow
                  label="PEP Checks"
                  desc="Flag politically exposed persons for extra review"
                  val={kycConfig.pepScanEnabled}
                  onChange={(v) => updateKycField('pepScanEnabled', v)}
                />
                <ToggleRow
                  label="Block Sanctioned Users"
                  desc="Automatically block users who match active sanctions lists"
                  val={kycConfig.sanctionsScan}
                  onChange={(v) => updateKycField('sanctionsScan', v)}
                />
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'countries' && (
        <div className="space-y-5">
          <SettingsCard
            title="Blocked Countries"
            desc="Set countries that are blocked or flagged for extra review."
            Icon={Flag}
          >
            <div className="space-y-4.5">
              <div>
                <FieldLabel hint="Blocked countries (ISO codes, comma-separated)">Blocked Countries</FieldLabel>
                <TInput
                  value={kycConfig.restrictions?.blocked?.join(', ')}
                  onChange={(v) =>
                    updateKycNestedField(
                      'restrictions',
                      'blocked',
                      v.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean)
                    )
                  }
                  mono
                />
              </div>

              <div>
                <FieldLabel hint="High-risk countries requiring extra checks">High-Risk Countries</FieldLabel>
                <TInput
                  value={kycConfig.restrictions?.enhanced?.join(', ')}
                  onChange={(v) =>
                    updateKycNestedField(
                      'restrictions',
                      'enhanced',
                      v.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean)
                    )
                  }
                  mono
                />
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save KYC Settings"
      />
    </div>
  );
}

export default KycSettingsPage;
