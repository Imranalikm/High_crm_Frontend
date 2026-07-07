import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Layers, Wallet, Shield, TrendingUp, RefreshCw } from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';
import { groupService } from '../services/groupService';

const LEVERAGE_OPTIONS = ['1', '1:10', '1:30', '1:50', '1:100', '1:200', '1:500'];
const STATUS_OPTIONS = ['Active', 'Inactive'];
const TYPE_OPTIONS = ['Live', 'Demo'];
const CURRENCY_OPTIONS = ['Dollar', 'Euro', 'Cent'];

/* Form Primitives */
function PField({ label, value, onChange, placeholder, type = 'text', mono = false, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-9 rounded-[8px] border border-border/18 bg-bg/60 px-3 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all ${
          mono ? 'font-mono' : ''
        }`}
      />
    </div>
  );
}

function PSelect({ label, value, onChange, options = [], placeholder, required = false }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-[8px] border border-border/18 bg-bg px-3 pr-8 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all cursor-pointer"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val} className="bg-bg text-text">
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function PGrid({ children }) {
  return <div className="grid grid-cols-2 gap-3.5">{children}</div>;
}

// eslint-disable-next-line no-unused-vars
function Section({ step, icon: IconComponent, title, children }) {
  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/10">
        <div className="w-[26px] h-[26px] rounded-[7px] bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-black text-brand leading-none tabular-nums">
            {String(step).padStart(2, '0')}
          </span>
        </div>
        <IconComponent size={13} className="text-text-muted/50 flex-shrink-0" />
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          {title}
        </span>
      </div>
      <div className="px-4 py-4 space-y-3.5">{children}</div>
    </div>
  );
}

function GroupFormContent({ mode, group, onSubmit, onClose }) {
  const isEdit = mode === 'edit';
  const [formData, setFormData] = useState(() => {
    if (isEdit && group) {
      return {
        name: group.name || '',
        mt5GroupName: group.mt5GroupName || 'real\\WECNUSD',
        groupStatus: group.groupStatus || 'Active',
        groupType: group.groupType || 'Live',
        currencyUnit: group.currencyUnit || 'Dollar',
        minFirstDeposit: group.minFirstDeposit ?? 0,
        minDeposit: group.minDeposit ?? 0,
        minWithdrawal: group.minWithdrawal ?? 0,
        perProfileMaxAccount: group.perProfileMaxAccount ?? 5,
        firstDeposit: group.firstDeposit ?? '',
        maxWithdrawalPerDay: group.maxWithdrawalPerDay ?? 5000,
        spreadStartFrom: group.spreadStartFrom ?? '1.0',
        accountOpenPolicy: group.accountOpenPolicy || 'Auto Approve',
        depositPolicy: group.depositPolicy || 'Auto Approve',
        withdrawalPolicy: group.withdrawalPolicy || 'Auto Approve',
        tradingType: group.tradingType || 'Standard Trading',
        maxLeverage: group.maxLeverage || '1'
      };
    }
    return {
      name: '',
      mt5GroupName: 'real\\WECNUSD',
      groupStatus: 'Active',
      groupType: 'Live',
      currencyUnit: 'Dollar',
      minFirstDeposit: 0,
      minDeposit: 0,
      minWithdrawal: 0,
      perProfileMaxAccount: 5,
      firstDeposit: '',
      maxWithdrawalPerDay: 5000,
      spreadStartFrom: '1.0',
      accountOpenPolicy: 'Auto Approve',
      depositPolicy: 'Auto Approve',
      withdrawalPolicy: 'Auto Approve',
      tradingType: 'Standard Trading',
      maxLeverage: '1'
    };
  });

  const [errors, setErrors] = useState({});
  const [mt5GroupOptions, setMt5GroupOptions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const policies = groupService.listPolicies();

  const fetchGroups = async () => {
    const opts = await groupService.listMt5Groups();
    setMt5GroupOptions(opts);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await groupService.syncMt5Groups();
      await fetchGroups();
    } catch (error) {
      console.error('Failed to sync groups', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Group Name is required';
    if (formData.minDeposit === '' || formData.minDeposit === null || formData.minDeposit === undefined) {
      newErrors.minDeposit = 'Min Deposit is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSubmit(formData);
  };

  const isValid = formData.name.trim() && formData.minDeposit !== '' && formData.minDeposit !== null && formData.minDeposit !== undefined;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/15">
        <div
          className="h-[2.5px] w-full"
          style={{
            background: 'linear-gradient(90deg, var(--brand), color-mix(in srgb, var(--brand) 40%, transparent) 65%, transparent)',
          }}
        />
        <div className="px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[9.5px] font-black uppercase tracking-[0.22em] text-brand/65 leading-none">
                Group Form · {isEdit ? 'Edit' : 'New Group'}
              </span>
            </div>
            <h2 className="text-[22px] font-bold tracking-[-0.025em] text-text leading-none">
              {isEdit ? 'Edit Group' : 'New Group'}
            </h2>
            <p className="text-[12px] text-text-muted/50 mt-2 leading-relaxed max-w-[460px]">
              Set up account tiers and link them to MT5 server settings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer animate-fade-in"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 no-scrollbar">
        {/* Section 1: Technical Config */}
        <Section step={1} icon={Layers} title="Basic Info">
          <PGrid>
            <div>
              <PField
                label="Group Name"
                value={formData.name}
                onChange={(val) => handleChange('name', val)}
                placeholder="E.g. Raw VIP"
                required
              />
              {errors.name && (
                <p className="text-negative text-[10.5px] mt-1 font-medium">{errors.name}</p>
              )}
            </div>
            <div className="relative">
              <PSelect
                label="MT5 Group"
                value={formData.mt5GroupName}
                onChange={(val) => handleChange('mt5GroupName', val)}
                options={mt5GroupOptions}
                required
              />
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                title="Sync from MT5"
                className="absolute right-0 top-0 mt-[-2px] flex items-center justify-center p-1 rounded-md text-brand hover:bg-brand/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                <span className="text-[9.5px] ml-1 font-bold">SYNC</span>
              </button>
            </div>
            <PSelect
              label="Group Status"
              value={formData.groupStatus}
              onChange={(val) => handleChange('groupStatus', val)}
              options={STATUS_OPTIONS}
              required
            />
            <PSelect
              label="Group Type"
              value={formData.groupType}
              onChange={(val) => handleChange('groupType', val)}
              options={TYPE_OPTIONS}
              required
            />
          </PGrid>
        </Section>

        {/* Section 2: Financial Bounds */}
        <Section step={2} icon={Wallet} title="Deposit & Withdrawal Limits">
          <PGrid>
            <PSelect
              label="Currency Unit"
              value={formData.currencyUnit}
              onChange={(val) => handleChange('currencyUnit', val)}
              options={CURRENCY_OPTIONS}
            />
            <div>
              <PField
                label="First Deposit"
                value={formData.firstDeposit}
                onChange={(val) => handleChange('firstDeposit', val)}
                placeholder="Enter First Deposit"
              />
            </div>
            <PField
              label="Min First Deposit"
              type="number"
              value={formData.minFirstDeposit}
              onChange={(val) => handleChange('minFirstDeposit', val)}
              placeholder="0"
            />
            <div>
              <PField
                label="Min Deposit"
                type="number"
                value={formData.minDeposit}
                onChange={(val) => handleChange('minDeposit', val)}
                placeholder="0"
                required
              />
              {errors.minDeposit && (
                <p className="text-negative text-[11px] mt-1.5 font-medium leading-none font-heading">
                  {errors.minDeposit}
                </p>
              )}
            </div>
            <PField
              label="Min Withdrawal"
              type="number"
              value={formData.minWithdrawal}
              onChange={(val) => handleChange('minWithdrawal', val)}
              placeholder="0"
            />
            <PField
              label="Max Withdrawal / Day"
              type="number"
              value={formData.maxWithdrawalPerDay}
              onChange={(val) => handleChange('maxWithdrawalPerDay', val)}
              placeholder="5000"
            />
          </PGrid>
        </Section>

        {/* Section 3: Execution Policies */}
        <Section step={3} icon={Shield} title="Policies">
          <PGrid>
            <PSelect
              label="Account Open Policy"
              value={formData.accountOpenPolicy}
              onChange={(val) => handleChange('accountOpenPolicy', val)}
              options={policies.accountOpenPolicies}
            />
            <PSelect
              label="Deposit Policy"
              value={formData.depositPolicy}
              onChange={(val) => handleChange('depositPolicy', val)}
              options={policies.depositPolicies}
            />
            <PSelect
              label="Withdrawal Policy"
              value={formData.withdrawalPolicy}
              onChange={(val) => handleChange('withdrawalPolicy', val)}
              options={policies.withdrawalPolicies}
            />
            <PSelect
              label="Trading Type"
              value={formData.tradingType}
              onChange={(val) => handleChange('tradingType', val)}
              options={policies.tradingTypes}
            />
          </PGrid>
        </Section>

        {/* Section 4: Leverage Policies */}
        <Section step={4} icon={TrendingUp} title="Leverage & Limits">
          <PGrid>
            <PField
              label="Spread (Pips)"
              value={formData.spreadStartFrom}
              onChange={(val) => handleChange('spreadStartFrom', val)}
              placeholder="0.0"
            />
            <PField
              label="Max Accounts / User"
              type="number"
              value={formData.perProfileMaxAccount}
              onChange={(val) => handleChange('perProfileMaxAccount', val)}
              placeholder="5"
            />
          </PGrid>
          <div className="pt-2">
            <PSelect
              label="Max Leverage"
              value={formData.maxLeverage}
              onChange={(val) => handleChange('maxLeverage', val)}
              options={LEVERAGE_OPTIONS}
            />
          </div>
        </Section>

        <div className="h-4" />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated">
        {!isValid && (
          <div className="flex items-center gap-2.5 mx-6 mt-4 rounded-[9px] border border-warning/22 bg-warning/6 px-3.5 py-2.5">
            <AlertTriangle size={13} className="text-warning flex-shrink-0" />
            <span className="text-[11.5px] font-medium text-warning leading-tight">
              Group name and min deposit are required.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <p className="text-[10px] text-text-muted/35 font-medium select-none">
            <span className="text-brand/60 font-black">*</span> Required fields
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/20 bg-bg/40 text-text-muted hover:text-text hover:border-border/32 transition-all cursor-pointer select-none active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid}
              className="flex items-center gap-1.5 h-9 px-6 rounded-[9px] text-[11.5px] font-black uppercase tracking-wider bg-brand text-bg hover:brightness-110 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer select-none"
            >
              <Check size={13} /> {isEdit ? 'Save Changes' : 'Create Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GroupFormDrawer({ open, mode, group, onSubmit, onClose }) {
  const formKey = open ? `${group?.id || 'new'}-${mode}` : 'closed';
  return (
    <MainDrawer open={open} width="max-w-[720px]" onClose={onClose}>
      <GroupFormContent
        key={formKey}
        mode={mode}
        group={group}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </MainDrawer>
  );
}
