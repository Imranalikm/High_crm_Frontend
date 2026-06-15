import React, { useState } from 'react';
import { Sliders, TrendingDown, Clock, Globe, Bell, ShieldOff, Plus, X, ShieldAlert, AlertOctagon, RefreshCw, Check, CheckCircle2 } from 'lucide-react';
import { defaultRules } from '@/config/constants/prop-trading/workspaces/rules.workspace';
import { SectionHead, Card, FormField, SelectInput, TextInput, IconBtn } from './PropComponents';

function ToggleRow({ val, onChange, label, hint, danger }) {
  const onColor  = danger ? 'var(--negative)' : 'var(--positive)';
  const onBg     = danger ? 'rgba(239,68,68,0.14)' : 'rgba(74,225,118,0.14)';
  const onBorder = danger ? 'rgba(239,68,68,0.30)' : 'rgba(74,225,118,0.25)';

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-[10px] border border-border/30 bg-surface-elevated hover:border-border/55 transition-all duration-200">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-text font-heading leading-snug">{label}</div>
        {hint && <div className="text-[10.5px] text-text-muted/45 font-heading mt-0.5">{hint}</div>}
      </div>

      {/* Segmented OFF / ON chip */}
      <div
        className="flex-shrink-0 flex items-center rounded-[8px] p-[3px] gap-[3px]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button
          type="button"
          onClick={() => onChange(false)}
          className="h-[26px] px-3 rounded-[6px] text-[10px] font-black uppercase tracking-[0.1em] font-heading transition-all duration-200 cursor-pointer"
          style={
            !val
              ? { background: 'rgba(255,255,255,0.09)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)' }
              : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent', opacity: 0.45 }
          }
        >
          Off
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className="h-[26px] px-3 rounded-[6px] text-[10px] font-black uppercase tracking-[0.1em] font-heading transition-all duration-200 cursor-pointer"
          style={
            val
              ? { background: onBg, color: onColor, border: `1px solid ${onBorder}` }
              : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent', opacity: 0.45 }
          }
        >
          On
        </button>
      </div>
    </div>
  );
}


export function RiskRulesPanel() {
  const [rules, setRules] = useState(defaultRules);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const setNested = (path) => (v) => {
    const keys = path.split('.');
    setRules(prev => {
      const next = { ...prev };
      let cur = next;
      keys.slice(0, -1).forEach(k => { cur[k] = { ...cur[k] }; cur = cur[k]; });
      cur[keys[keys.length - 1]] = v;
      return next;
    });
  };

  const [banInput, setBanInput] = useState('');
  const addBan = () => {
    if (!banInput.trim()) return;
    setRules(p => ({ ...p, bannedSymbols: [...p.bannedSymbols, banInput.trim().toUpperCase()] }));
    setBanInput('');
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Leverage Caps */}
        <Card>
          <SectionHead title="Leverage Limits" Icon={Sliders} />
          <div className="space-y-3">
            {[
              ['Forex Pairs', 'leverage.forex'],
              ['Indices', 'leverage.indices'],
              ['Crypto', 'leverage.crypto'],
              ['Metals / Commodities', 'leverage.metals'],
            ].map(([label, path]) => (
              <FormField key={path} label={label}>
                <SelectInput value={rules.leverage[path.split('.')[1]]} onChange={setNested(path)}
                  options={['1:5', '1:10', '1:20', '1:30', '1:50', '1:100', '1:200', '1:500']} />
              </FormField>
            ))}
          </div>
        </Card>

        {/* Loss Rules */}
        <Card>
          <SectionHead title="Loss Rules" Icon={TrendingDown} />
          <div className="space-y-3">
            {[
              ['Daily Loss (Phase 1)', 'dailyLoss.phase1'],
              ['Daily Loss (Phase 2)', 'dailyLoss.phase2'],
              ['Daily Loss (Funded)', 'dailyLoss.funded'],
              ['Total Loss (Phase 1)', 'totalLoss.phase1'],
              ['Total Loss (Phase 2)', 'totalLoss.phase2'],
              ['Total Loss (Funded)', 'totalLoss.funded'],
            ].map(([label, path]) => {
              const [group, key] = path.split('.');
              return (
                <FormField key={path} label={label}>
                  <TextInput value={rules[group][key]} onChange={setNested(path)} placeholder="5%" mono />
                </FormField>
              );
            })}
            <ToggleRow
              val={rules.dailyLoss.hardStop}
              onChange={setNested('dailyLoss.hardStop')}
              label="Hard Stop on Limit Breach"
              hint="Automatically close all positions when limits are hit"
              danger
            />
          </div>
        </Card>

        {/* Minimum Trading Days */}
        <Card>
          <SectionHead title="Minimum Trading Days" Icon={Clock} />
          <div className="space-y-3">
            {[
              ['Min. Days (Phase 1)', 'minDays.phase1'],
              ['Min. Days (Phase 2)', 'minDays.phase2'],
              ['Min. Days (Funded)', 'minDays.funded'],
            ].map(([label, path]) => {
              const [group, key] = path.split('.');
              return (
                <FormField key={path} label={label}>
                  <TextInput value={rules[group][key]} onChange={v => setNested(path)(Number(v))} type="number" mono />
                </FormField>
              );
            })}
          </div>
        </Card>

        {/* Weekend + News */}
        <Card>
          <SectionHead title="Weekend Rules" Icon={Globe} />
          <div className="space-y-2 mb-4">
            <ToggleRow
              val={!rules.weekend.holdingAllowed}
              onChange={v => setNested('weekend.holdingAllowed')(!v)}
              label="Block Weekend Position Holding"
              hint="Auto-close all open positions before market close"
              danger
            />
            <ToggleRow
              val={rules.weekend.autoClose}
              onChange={setNested('weekend.autoClose')}
              label="Auto-Close on Friday"
            />
          </div>
          <FormField label="Auto-Close Time (UTC)">
            <TextInput value={rules.weekend.closeAt} onChange={setNested('weekend.closeAt')} placeholder="Friday 23:00 UTC" mono />
          </FormField>

          <div className="mt-5">
            <SectionHead title="News Trading" Icon={Bell} />
            <div className="space-y-2 mb-4">
              <ToggleRow
                val={rules.news.tradingBlocked}
                onChange={setNested('news.tradingBlocked')}
                label="Block Trading During News"
                danger
              />
              <ToggleRow
                val={rules.news.highImpactOnly}
                onChange={setNested('news.highImpactOnly')}
                label="High-Impact Events Only"
                hint="Only block during red-folder news events"
              />
            </div>
            <FormField label="Block Window (minutes before/after)">
              <TextInput value={rules.news.blockWindow} onChange={v => setNested('news.blockWindow')(Number(v))} type="number" mono />
            </FormField>
          </div>
        </Card>

        {/* Banned Symbols */}
        <Card>
          <SectionHead title="Blocked Symbols" Icon={ShieldOff} />
          <div className="flex gap-2 mb-3">
            <input
              value={banInput}
              onChange={e => setBanInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && addBan()}
              placeholder="Add symbol e.g. BTCUSD"
              className="flex-1 h-9 px-3 rounded-[9px] border border-border/30 bg-bg/60 text-[13px] font-mono text-text outline-none placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <button onClick={addBan} className="h-9 px-3 rounded-[9px] border border-primary/20 bg-primary/[0.08] text-primary text-[11px] font-bold font-heading cursor-pointer hover:brightness-110 transition-all flex items-center gap-1.5">
              <Plus size={12} />Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {rules.bannedSymbols.map(sym => (
              <div key={sym} className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-negative/[0.2] bg-negative/[0.06] text-[11px] font-mono font-bold text-negative">
                {sym}
                <button onClick={() => setRules(p => ({ ...p, bannedSymbols: p.bannedSymbols.filter(s => s !== sym) }))}
                  className="text-negative/50 hover:text-negative cursor-pointer transition-colors ml-0.5">
                  <X size={10} />
                </button>
              </div>
            ))}
            {rules.bannedSymbols.length === 0 && <span className="text-[11px] text-text-muted/30 font-heading italic">No banned symbols configured</span>}
          </div>
        </Card>

        {/* Consistency + Auto-Fail */}
        <Card>
          <SectionHead title="Consistency Rules" Icon={ShieldAlert} />
          <div className="space-y-2 mb-5">
            <ToggleRow
              val={rules.consistency.enabled}
              onChange={setNested('consistency.enabled')}
              label="Enable Consistency Rules"
              hint="Enforce minimum activity and trade sizing rules"
            />
          </div>
          <div className="space-y-3 mb-5">
            <FormField label="Min. Daily Trades">
              <TextInput value={rules.consistency.minDailyTrades} onChange={v => setNested('consistency.minDailyTrades')(Number(v))} type="number" mono />
            </FormField>
            <FormField label="Max Risk per Trade" hint="As % of account balance">
              <TextInput value={rules.consistency.maxSingleTradeRisk} onChange={setNested('consistency.maxSingleTradeRisk')} placeholder="2%" mono />
            </FormField>
          </div>

          <SectionHead title="Auto-Fail Rules" Icon={AlertOctagon} />
          <div className="space-y-2">
            <ToggleRow val={rules.autoFail.maxDD} onChange={setNested('autoFail.maxDD')} label="Max Drawdown Breach" danger />
            <ToggleRow val={rules.autoFail.dailyDD} onChange={setNested('autoFail.dailyDD')} label="Daily Loss Limit Breach" danger />
            <ToggleRow val={rules.autoFail.minDaysViolation} onChange={setNested('autoFail.minDaysViolation')} label="Min. Trading Days Violation" danger />
            <ToggleRow val={rules.autoFail.bannedSymbol} onChange={setNested('autoFail.bannedSymbol')} label="Banned Symbol Trade" danger />
          </div>
        </Card>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between rounded-[12px] border border-border/30 bg-surface-elevated px-5 py-3.5">
        <span className="text-[11.5px] text-text-muted/50 font-heading">Changes apply to new accounts only.</span>
        <div className="flex gap-2">
          <IconBtn label="Reset" Icon={RefreshCw} variant="default" onClick={() => { setRules(defaultRules); showToast('Reset to defaults'); }} />
          <IconBtn label="Save" Icon={Check} variant="success" onClick={() => showToast('Rules saved successfully')} />
        </div>
      </div>
    </div>
  );
}
