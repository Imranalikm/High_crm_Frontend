import React, { useEffect, useMemo, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { FieldLabel, FGroup, TInput, TSelect, ToggleRow, WarnBanner } from '../components/SettingsForm';
import { LEVERAGE_OPTIONS } from '../configs/trading.config';
import { demoSettingsService } from '../services/demoSettingsService';

const EMPTY_CONFIG = {
  enabled: true,
  mt5GroupName: '',
  initialBalance: '0',
  leverage: '1:100',
  cooldownHours: '24',
};

// Normalize API record into editable form values
function toForm(data) {
  if (!data) return EMPTY_CONFIG;
  return {
    enabled: Boolean(data.enabled),
    mt5GroupName: data.mt5GroupName || '',
    initialBalance: String(parseFloat(data.initialBalance) || 0),
    leverage: data.leverage || '1:100',
    cooldownHours: String(data.cooldownHours ?? 24),
  };
}

/**
 * DemoAccountSettingsPage — Configures the MT5 group, initial balance and leverage
 * used for instant demo accounts created from the login page. Persisted via API.
 */
export function DemoAccountSettingsPage() {
  const [saved, setSaved] = useState(EMPTY_CONFIG);
  const [config, setConfig] = useState(EMPTY_CONFIG);
  const [mt5Groups, setMt5Groups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([demoSettingsService.get(), demoSettingsService.listMt5Groups()])
      .then(([data, groups]) => {
        if (cancelled) return;
        const form = toForm(data);
        setSaved(form);
        setConfig(form);
        setMt5Groups(groups);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load demo account settings.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const updateField = (key, value) => {
    setNotice('');
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const isDirty = useMemo(
    () => Object.keys(config).some((key) => String(config[key]) !== String(saved[key])),
    [config, saved]
  );

  // Always include the current group even if it isn't in the synced list
  const groupOptions = useMemo(() => {
    const list = [...mt5Groups];
    if (config.mt5GroupName && !list.includes(config.mt5GroupName)) list.unshift(config.mt5GroupName);
    return list;
  }, [mt5Groups, config.mt5GroupName]);

  const leverageOptions = useMemo(
    () => (LEVERAGE_OPTIONS.includes(config.leverage) ? LEVERAGE_OPTIONS : [config.leverage, ...LEVERAGE_OPTIONS]),
    [config.leverage]
  );

  const handleSave = async () => {
    setError('');
    setNotice('');
    try {
      const data = await demoSettingsService.update({
        enabled: config.enabled,
        mt5GroupName: config.mt5GroupName.trim(),
        initialBalance: Number(config.initialBalance),
        leverage: config.leverage,
        cooldownHours: Number(config.cooldownHours),
      });
      const form = toForm(data);
      setSaved(form);
      setConfig(form);
      setNotice('Demo account settings saved.');
    } catch (err) {
      setError(err.message || 'Failed to save demo account settings.');
    }
  };

  const handleReset = () => {
    setError('');
    setNotice('');
    setConfig(saved);
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Demo Accounts"
        desc="Configure instant MT5 demo accounts created from the login page."
      />

      {error && <WarnBanner title="Error" message={error} severity="danger" />}
      {notice && <WarnBanner title="Saved" message={notice} severity="info" />}

      <SettingsCard
        title="Demo Account Defaults"
        desc="Every new demo account is created with these values."
        Icon={FlaskConical}
      >
        {loading ? (
          <p className="text-[12px] text-text-muted/60 font-heading">Loading settings…</p>
        ) : (
          <>
            <div className="mb-4.5 rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              <ToggleRow
                label="Allow Demo Account Registration"
                desc="Show the 'Create Demo Account' option on the login page"
                val={config.enabled}
                onChange={(v) => updateField('enabled', v)}
              />
            </div>

            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="MT5 group the demo accounts are created in">MT5 Demo Group</FieldLabel>
                {groupOptions.length > 0 ? (
                  <TSelect
                    value={config.mt5GroupName}
                    onChange={(v) => updateField('mt5GroupName', v)}
                    options={groupOptions}
                  />
                ) : (
                  <TInput
                    value={config.mt5GroupName}
                    onChange={(v) => updateField('mt5GroupName', v)}
                    placeholder="STL\3492\demo.grp1"
                    mono
                  />
                )}
              </div>
              <div>
                <FieldLabel hint="Leverage assigned to new demo accounts">Leverage</FieldLabel>
                <TSelect
                  value={config.leverage}
                  onChange={(v) => updateField('leverage', v)}
                  options={leverageOptions}
                />
              </div>
              <div>
                <FieldLabel hint="Credited via the MT5 deposit API after creation (0 = none)">Initial Balance</FieldLabel>
                <TInput
                  type="number"
                  value={config.initialBalance}
                  onChange={(v) => updateField('initialBalance', v)}
                  mono
                  suffix="USD"
                />
              </div>
              <div>
                <FieldLabel hint="One demo account per email within this window (0 = unlimited)">Repeat Limit</FieldLabel>
                <TInput
                  type="number"
                  value={config.cooldownHours}
                  onChange={(v) => updateField('cooldownHours', v)}
                  mono
                  suffix="HOURS"
                />
              </div>
            </FGroup>
          </>
        )}
      </SettingsCard>

      <SaveBar
        isDirty={isDirty}
        onSave={handleSave}
        onReset={handleReset}
        label="Save Demo Settings"
      />
    </div>
  );
}

export default DemoAccountSettingsPage;
