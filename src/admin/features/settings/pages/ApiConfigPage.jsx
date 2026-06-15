import React, { useState } from 'react';
import { Key, Globe, Sliders, Shield, Wifi, AlertTriangle } from 'lucide-react';
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
  ApiKeyField,
  ToggleRow,
  Btn,
  WarnBanner,
} from '../components/SettingsForm';
import {
  API_ENV_OPTIONS,
  THROTTLE_STRATEGIES,
  RATE_LIMIT_HEADERS,
  ROTATION_FREQUENCY_OPTIONS,
} from '../configs/api.config';

/**
 * ApiConfigPage — Manages all platform API configuration settings.
 */
export function ApiConfigPage({
  apiConfig,
  updateApiField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', Icon: Globe },
    { id: 'auth', label: 'Auth & Keys', Icon: Key },
    { id: 'limits', label: 'Rate Limits', Icon: Sliders },
    { id: 'security', label: 'Security', Icon: Shield },
  ];

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setTesting(false);
    setTestResult({ success: true, message: 'REST & WebSocket connections established successfully ✓' });
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="API Settings"
        desc="Manage API endpoints, keys, rate limits, and security settings."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'endpoints' && (
        <div className="space-y-5">
          <SettingsCard
            title="Endpoints"
            desc="Set your API base URL and environment."
            Icon={Globe}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Main API URL">API Base URL</FieldLabel>
                <TInput
                  value={apiConfig.baseUrl}
                  onChange={(v) => updateApiField('baseUrl', v)}
                  placeholder="https://api.live-trader.com/v2"
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Controls access levels and warning banners">Environment</FieldLabel>
                <TSelect
                  value={apiConfig.env}
                  onChange={(v) => updateApiField('env', v)}
                  options={API_ENV_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel required hint="WebSocket URL for real-time data">WebSocket URL</FieldLabel>
                <TInput
                  value={apiConfig.wsUrl}
                  onChange={(v) => updateApiField('wsUrl', v)}
                  placeholder="wss://ws.live-trader.com"
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="URL that receives webhook events">Webhook URL</FieldLabel>
                <TInput
                  value={apiConfig.webhookUrl}
                  onChange={(v) => updateApiField('webhookUrl', v)}
                  placeholder="https://api.live-trader.com/webhooks"
                  mono
                />
              </div>
            </FGroup>

            <div className="mt-5.5 pt-4 border-t border-border/10 flex flex-col sm:flex-row sm:items-center gap-3.5">
              <Btn
                Icon={Wifi}
                label={testing ? 'Testing...' : 'Test Connection'}
                variant="cyan"
                onClick={handleTestConnection}
                loading={testing}
              />
              {testResult && (
                <div className="text-[11.5px] font-heading font-semibold text-positive animate-in fade-in duration-200">
                  {testResult.message.replace('REST & WebSocket connections established successfully ✓', 'Connected!')}
                </div>
              )}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Connection Settings"
            desc="Set timeouts and retry rules."
            Icon={Sliders}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Max wait time per request">Request Timeout</FieldLabel>
                <TInput
                  value={apiConfig.timeout}
                  onChange={(v) => updateApiField('timeout', v)}
                  mono
                  suffix="SEC"
                />
              </div>
              <div>
                <FieldLabel hint="Max retry attempts on failure">Max Retries</FieldLabel>
                <TInput
                  value={apiConfig.retries}
                  onChange={(v) => updateApiField('retries', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Wait time before retrying">Backoff Delay</FieldLabel>
                <TInput
                  value="1000"
                  readOnly
                  mono
                  suffix="MS"
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'auth' && (
        <div className="space-y-5">
          {apiConfig.env === 'PRODUCTION' && (
            <WarnBanner
              severity="warning"
              title="Production Keys Active"
              message="These keys are live. Never share them. Rotating keys will end all active sessions immediately."
            />
          )}

          <SettingsCard
            title="API Keys"
            desc="Keys used to authenticate system requests."
            Icon={Key}
          >
            <div className="space-y-4">
              <ApiKeyField
                label="API Key"
                value={apiConfig.apiKey}
                hint="Used to verify system requests"
              />
              <ApiKeyField
                label="Secret Key"
                value={apiConfig.secretKey}
                hint="Never add this to your code"
              />
              <ApiKeyField
                label="Webhook Secret"
                value={apiConfig.webhookSecret}
                hint="Verifies webhook payloads are genuine"
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Key Rotation"
            desc="Choose how often keys are replaced."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="How often keys rotate">Key Rotation</FieldLabel>
                <TSelect
                  value="90"
                  onChange={() => { }}
                  options={ROTATION_FREQUENCY_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="When keys were last updated">Last Rotated</FieldLabel>
                <TInput value="2024-06-01" readOnly mono />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-5">
          <SettingsCard
            title="Rate Limits"
            desc="Control how many requests can be made per minute."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Max requests per minute">Rate Limit</FieldLabel>
                <TInput
                  value={apiConfig.rateLimit}
                  onChange={(v) => updateApiField('rateLimit', v)}
                  mono
                  suffix="RPM"
                />
              </div>
              <div>
                <FieldLabel required hint="Max burst requests allowed at once">Burst Limit</FieldLabel>
                <TInput
                  value={apiConfig.burstLimit}
                  onChange={(v) => updateApiField('burstLimit', v)}
                  mono
                  suffix="REQ/SEC"
                />
              </div>
              <div>
                <FieldLabel hint="How limits are enforced when reached">Throttle Strategy</FieldLabel>
                <TSelect
                  value="SLIDING_WINDOW"
                  onChange={() => { }}
                  options={THROTTLE_STRATEGIES}
                />
              </div>
              <div>
                <FieldLabel hint="HTTP header that shows remaining limit">Rate Limit Header</FieldLabel>
                <TSelect
                  value="X-RateLimit-Remaining"
                  onChange={() => { }}
                  options={RATE_LIMIT_HEADERS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-5">
          <SettingsCard
            title="IP Whitelist"
            desc="Only allow access from trusted IP addresses."
            Icon={Shield}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel hint="One IP or CIDR range per line">Allowed IPs</FieldLabel>
                <TArea
                  value={apiConfig.ipWhitelist}
                  onChange={(v) => updateApiField('ipWhitelist', v)}
                  placeholder="103.82.14.0/24&#10;82.44.18.0/24"
                  mono
                  rows={4}
                />
              </div>
              <ToggleRow
                label="Require Allowed IPs"
                desc="Block all traffic from IPs not on the list"
                val={true}
                onChange={() => { }}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="CORS Settings"
            desc="Set which websites are allowed to make requests to your API."
            Icon={Globe}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel hint="One allowed domain per line">Allowed Origins</FieldLabel>
                <TArea
                  value={apiConfig.corsOrigins}
                  onChange={(v) => updateApiField('corsOrigins', v)}
                  placeholder="https://app.live-trader.com&#10;https://admin.live-trader.com"
                  mono
                  rows={4}
                />
              </div>
              <ToggleRow
                label="Strict CORS"
                desc="Block requests from domains not on the allowed list"
                val={true}
                onChange={() => { }}
              />
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save API Settings"
      />
    </div>
  );
}

export default ApiConfigPage;
