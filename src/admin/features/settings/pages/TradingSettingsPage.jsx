import React, { useState } from 'react';
import { BarChart2, TrendingUp, Sliders, ShieldAlert, BadgePercent, Lock, Settings } from 'lucide-react';
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
  ToggleRow,
  WarnBanner,
} from '../components/SettingsForm';
import {
  LEVERAGE_OPTIONS,
  MARGIN_MODEL_OPTIONS,
  TRADE_HOURS_MODE_OPTIONS,
  PROP_PHASES_OPTIONS,
} from '../configs/trading.config';

/**
 * TradingSettingsPage — Configures leverage caps, execution boundaries, risk parameters, and prop challenges guidelines.
 */
export function TradingSettingsPage({
  tradingConfig,
  updateTradingField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('leverage');

  const tabs = [
    { id: 'leverage', label: 'Leverage & Margin', Icon: TrendingUp },
    { id: 'limits', label: 'Order Limits', Icon: Sliders },
    { id: 'risk', label: 'Risk Controls', Icon: ShieldAlert },
    { id: 'prop', label: 'Prop & Copy Trading', Icon: BarChart2 },
  ];

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Trading Settings"
        desc="Set leverage caps, order limits, risk rules, and prop challenge settings."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'leverage' && (
        <div className="space-y-5">
          <SettingsCard
            title="Leverage by Asset"
            desc="Set the max leverage allowed per asset type."
            Icon={TrendingUp}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Max leverage for Forex pairs">Forex Leverage</FieldLabel>
                <TSelect
                  value={tradingConfig.forexLev}
                  onChange={(v) => updateTradingField('forexLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Max leverage for indices">Indices Leverage</FieldLabel>
                <TSelect
                  value={tradingConfig.indicesLev}
                  onChange={(v) => updateTradingField('indicesLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Max leverage for crypto">Crypto Leverage</FieldLabel>
                <TSelect
                  value={tradingConfig.cryptoLev}
                  onChange={(v) => updateTradingField('cryptoLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Max leverage for commodities and metals">Commodity / Metals Leverage</FieldLabel>
                <TSelect
                  value={tradingConfig.metalLev}
                  onChange={(v) => updateTradingField('metalLev', v)}
                  options={LEVERAGE_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>

          <SettingsCard
            title="Margin Call & Stop Out"
            desc="Set the thresholds that trigger margin warnings and liquidations."
            Icon={ShieldAlert}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Margin % that triggers a warning">Margin Call Level</FieldLabel>
                <TInput
                  value={tradingConfig.marginCallLevel}
                  onChange={(v) => updateTradingField('marginCallLevel', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Margin % that triggers auto-liquidation">Stop Out Level</FieldLabel>
                <TInput
                  value={tradingConfig.stopOutLevel}
                  onChange={(v) => updateTradingField('stopOutLevel', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="How margin is calculated (Hedging / Netting)">Margin Model</FieldLabel>
                <TSelect
                  value={tradingConfig.marginModel}
                  onChange={(v) => updateTradingField('marginModel', v)}
                  options={MARGIN_MODEL_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-5">
          <SettingsCard
            title="Order Limits"
            desc="Cap order sizes and frequency to protect the platform."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Max volume per order">Max Order Size</FieldLabel>
                <TInput
                  value={tradingConfig.maxOrderSize}
                  onChange={(v) => updateTradingField('maxOrderSize', v)}
                  mono
                  suffix="LOTS"
                />
              </div>
              <div>
                <FieldLabel hint="Min volume per order">Min Order Size</FieldLabel>
                <TInput
                  value={tradingConfig.minOrderSize}
                  onChange={(v) => updateTradingField('minOrderSize', v)}
                  mono
                  suffix="LOTS"
                />
              </div>
              <div>
                <FieldLabel hint="Max orders placed per day per account">Max Daily Orders</FieldLabel>
                <TInput
                  value={tradingConfig.maxDailyOrders}
                  onChange={(v) => updateTradingField('maxDailyOrders', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Max open trades at once per client">Max Open Positions</FieldLabel>
                <TInput
                  value={tradingConfig.maxOpenPositions}
                  onChange={(v) => updateTradingField('maxOpenPositions', v)}
                  mono
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-5">
          <SettingsCard
            title="Slippage & Risk Rules"
            desc="Set slippage limits and order validation rules."
            Icon={ShieldAlert}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Normal slippage on market orders">Default Slippage</FieldLabel>
                <TInput
                  value={tradingConfig.defaultSlippage}
                  onChange={(v) => updateTradingField('defaultSlippage', v)}
                  mono
                  suffix="PIPS"
                />
              </div>
              <div>
                <FieldLabel hint="Max slippage before order is rejected">Max Slippage</FieldLabel>
                <TInput
                  value={tradingConfig.maxSlippage}
                  onChange={(v) => updateTradingField('maxSlippage', v)}
                  mono
                  suffix="PIPS"
                />
              </div>
            </FGroup>

            <div className="mt-4.5 rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              <ToggleRow
                label="Require Stop Loss"
                desc="All orders must have a stop loss set"
                val={tradingConfig.stopLossRequired}
                onChange={(v) => updateTradingField('stopLossRequired', v)}
              />
              <ToggleRow
                label="Require Take Profit"
                desc="All orders must have a take profit set"
                val={tradingConfig.takeProfitRequired}
                onChange={(v) => updateTradingField('takeProfitRequired', v)}
              />
              <ToggleRow
                label="Weekend Trading"
                desc="Allow trading while markets are closed on weekends"
                val={tradingConfig.weekendTrading}
                onChange={(v) => updateTradingField('weekendTrading', v)}
              />
              <ToggleRow
                label="News Event Trading"
                desc="Allow trading during major economic announcements"
                val={tradingConfig.newsTrading}
                onChange={(v) => updateTradingField('newsTrading', v)}
              />
            </div>

            <div className="mt-4.5">
              <FieldLabel hint="Minutes blocked before/after major news events">News Block Window</FieldLabel>
              <TInput
                value={tradingConfig.newsTradingBuffer}
                onChange={(v) => updateTradingField('newsTradingBuffer', v)}
                disabled={tradingConfig.newsTrading}
                mono
                suffix="MIN"
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Blocked Symbols"
            desc="List instruments that cannot be traded."
            Icon={Lock}
          >
            <FieldLabel hint="One symbol per line">Banned Symbols</FieldLabel>
            <TArea
              value={tradingConfig.bannedSymbols}
              onChange={(v) => updateTradingField('bannedSymbols', v)}
              placeholder="BTCUSD&#10;ETHUSD"
              mono
              rows={3}
            />
          </SettingsCard>
        </div>
      )}

      {activeTab === 'prop' && (
        <div className="space-y-5">
          <SettingsCard
            title="Prop Challenge Rules"
            desc="Set prop trading challenge rules and targets."
            Icon={BarChart2}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Number of phases to pass">Evaluation Phases</FieldLabel>
                <TSelect
                  value={tradingConfig.propPhases}
                  onChange={(v) => updateTradingField('propPhases', v)}
                  options={PROP_PHASES_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Required % profit to pass the challenge">Profit Target</FieldLabel>
                <TInput
                  value={tradingConfig.propProfitTarget}
                  onChange={(v) => updateTradingField('propProfitTarget', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Max total loss before account breach">Max Drawdown</FieldLabel>
                <TInput
                  value={tradingConfig.propMaxDD}
                  onChange={(v) => updateTradingField('propMaxDD', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Max loss allowed in a single day">Max Daily Drawdown</FieldLabel>
                <TInput
                  value={tradingConfig.propDailyDD}
                  onChange={(v) => updateTradingField('propDailyDD', v)}
                  mono
                  suffix="%"
                />
              </div>
              <div>
                <FieldLabel hint="Min trading days required to qualify">Min Trading Days</FieldLabel>
                <TInput
                  value={tradingConfig.propMinDays}
                  onChange={(v) => updateTradingField('propMinDays', v)}
                  mono
                  suffix="DAYS"
                />
              </div>
            </FGroup>
          </SettingsCard>

          <SettingsCard
            title="Copy Trading Rules"
            desc="Set risk limits for the copy trading system."
            Icon={Settings}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Max copy size multiplier">Max Copy Ratio</FieldLabel>
                <TInput
                  value={tradingConfig.copyMaxRatio}
                  onChange={(v) => updateTradingField('copyMaxRatio', v)}
                  mono
                  suffix="X"
                />
              </div>
              <div>
                <FieldLabel hint="Min balance needed to start copying">Min Balance</FieldLabel>
                <TInput
                  value={tradingConfig.copyMinDeposit}
                  onChange={(v) => updateTradingField('copyMinDeposit', v)}
                  mono
                  suffix="USD"
                />
              </div>
            </FGroup>

            <div className="mt-4.5">
              <ToggleRow
                label="Auto-Close on Leader Margin Call"
                desc="Close follower copies if the leader hits a margin warning"
                val={tradingConfig.copyAutoClose}
                onChange={(v) => updateTradingField('copyAutoClose', v)}
              />
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save Trading Settings"
      />
    </div>
  );
}

export default TradingSettingsPage;
