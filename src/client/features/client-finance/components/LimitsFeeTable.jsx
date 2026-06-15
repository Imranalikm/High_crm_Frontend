import React from 'react';
import { Info, Clock, Shield } from 'lucide-react';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';
import { KYC_TIERS_LIST } from '@/admin/features/settings/configs/kyc.config';

const CURRENCY_LIST = [
  { code: 'USD', name: 'US Dollar',         flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',     flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen',      flag: '🇯🇵' },
  { code: 'AED', name: 'UAE Dirham',        flag: '🇦🇪' },
  { code: 'INR', name: 'Indian Rupee',      flag: '🇮🇳' },
  { code: 'USDT', name: 'Tether (USDT)',    flag: '💵' },
  { code: 'BTC', name: 'Bitcoin',           flag: '₿' },
  { code: 'ETH', name: 'Ethereum',          flag: 'Ξ' },
  { code: 'BNB', name: 'BNB',              flag: '💛' },
];

/**
 * LimitsFeeTable
 * Displays deposit/withdrawal limits, fees, and processing times per method.
 */
export function LimitsFeeTable() {
  const { clientSettings } = usePlatformSettings();
  const { gateways, globalFees } = clientSettings;

  // Generate limits data dynamically based on active admin gateways
  const limitsData = gateways
    .filter((g) => g.enabled)
    .map((g) => {
      let method = g.name;
      let minDeposit = '$10';
      let maxDeposit = 'Unlimited';
      let depositFee = g.fee || '0%';
      let minWithdraw = `$${globalFees.minWithdrawal || '10'}`;
      let maxWithdraw = `$${parseFloat(globalFees.maxWithdrawal || 50000).toLocaleString()} / day`;
      let withdrawFee = globalFees.withdrawalFee === '0' || !globalFees.withdrawalFee ? 'Free' : `$${globalFees.withdrawalFee} flat`;
      let processing = 'Instant';
      let processingColor = 'var(--positive)';

      if (g.id === 'stripe') {
        method = 'Credit / Debit Card';
        minDeposit = '$10';
        maxDeposit = '$10,000 / day';
        withdrawFee = '1.5%';
      } else if (g.id === 'swift') {
        method = 'Bank Transfer (SWIFT/SEPA)';
        minDeposit = '$50';
        maxDeposit = `$${parseFloat(globalFees.maxWithdrawal || 50000).toLocaleString()} / day`;
        processing = `${globalFees.processingDelay || '1'}–3 Business Days`;
        processingColor = 'var(--warning)';
      } else if (g.id === 'fireblocks') {
        method = `Crypto (${g.rails?.slice(0, 3)?.join('/') || 'USDT/BTC/ETH'})`;
        minDeposit = '$20';
        maxDeposit = 'Unlimited';
        processing = '10–30 Minutes';
        processingColor = 'var(--cyan)';
      } else if (g.id === 'skrill') {
        method = 'Skrill Wallet';
        minDeposit = '$10';
        maxDeposit = '$20,000 / day';
        processing = 'Instant';
      }

      return {
        method,
        minDeposit,
        maxDeposit,
        depositFee,
        minWithdraw,
        maxWithdraw,
        withdrawFee,
        processing,
        processingColor,
      };
    });

  // Collect all unique currency codes supported by active gateways
  const activeCurrencyCodes = new Set([
    globalFees.currency || 'USD',
    ...gateways.filter(g => g.enabled).flatMap(g => g.currencies || [])
  ]);

  const activeCurrencies = CURRENCY_LIST.filter(c => activeCurrencyCodes.has(c.code));

  const cols = [
    { key: 'method',       label: 'Method',          align: 'left'  },
    { key: 'minDeposit',   label: 'Min Deposit',     align: 'right' },
    { key: 'maxDeposit',   label: 'Max Deposit',     align: 'right' },
    { key: 'depositFee',   label: 'Deposit Fee',     align: 'right' },
    { key: 'minWithdraw',  label: 'Min Withdraw',    align: 'right' },
    { key: 'maxWithdraw',  label: 'Max Withdraw',    align: 'right' },
    { key: 'withdrawFee',  label: 'Withdraw Fee',    align: 'right' },
    { key: 'processing',   label: 'Processing Time', align: 'right' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Info alert */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-[12px] text-[12.5px] bg-brand/8 border border-brand/20 text-text-muted">
        <Info size={14} className="shrink-0 mt-0.5 text-brand" strokeWidth={2.5} />
        <span>
          Limits may vary based on your <strong className="text-text font-bold">KYC verification level</strong>. Complete full verification to unlock higher limits. Fees are subject to change with 7-day notice.
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border/40">
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] whitespace-nowrap bg-muted-surface/40 text-text-muted/60"
                    style={{
                      textAlign: c.align,
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {limitsData.map((row) => (
                <tr
                  key={row.method}
                  className="transition-colors duration-150 hover:bg-brand/5"
                >
                  {cols.map((c) => (
                    <td
                      key={c.key}
                      className="px-4 py-4 whitespace-nowrap align-middle"
                      style={{ textAlign: c.align }}
                    >
                      {c.key === 'method' ? (
                        <span className="font-bold text-[13.5px] text-text">
                          {row[c.key]}
                        </span>
                      ) : c.key === 'processing' ? (
                        <span
                          className="inline-flex items-center gap-1.5 font-bold text-[12px] px-2.5 py-0.5 rounded-[6px]"
                          style={{
                            color: row.processingColor,
                            background: `color-mix(in srgb, ${row.processingColor} 10%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${row.processingColor} 20%, transparent)`
                          }}
                        >
                          <Clock size={11} strokeWidth={2.5} />
                          {row[c.key]}
                        </span>
                      ) : (c.key === 'depositFee' || c.key === 'withdrawFee') ? (
                        <span
                          className="font-mono font-black text-[11px] px-2 py-0.5 rounded-[6px] border"
                          style={{
                            color: row[c.key] === 'Free' || row[c.key] === '0%'
                              ? 'var(--positive)'
                              : 'var(--warning)',
                            background: row[c.key] === 'Free' || row[c.key] === '0%'
                              ? 'color-mix(in srgb, var(--positive) 8%, transparent)'
                              : 'color-mix(in srgb, var(--warning) 8%, transparent)',
                            borderColor: row[c.key] === 'Free' || row[c.key] === '0%'
                              ? 'color-mix(in srgb, var(--positive) 20%, transparent)'
                              : 'color-mix(in srgb, var(--warning) 20%, transparent)',
                          }}
                        >
                          {row[c.key]}
                        </span>
                      ) : (
                        <span className="font-mono text-[12px] font-bold text-text-muted">
                          {row[c.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC levels display */}
      <div className="bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[16px] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] mb-4 text-text-muted/60">
          Verification Tiers &amp; Account Limits
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KYC_TIERS_LIST.map((tier) => (
            <div
              key={tier.level}
              className="flex items-start gap-3 p-3 rounded-[10px] bg-muted-surface/20 border border-border/20"
            >
              <Shield size={16} className="text-brand shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-bold text-text">{tier.level}</p>
                <p className="text-[11px] text-text-muted/75 mt-0.5 leading-normal">{tier.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9.5px] font-bold uppercase text-brand">Limit:</span>
                  <span className="text-[10px] font-mono font-bold text-text-muted">{tier.limits}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported currencies */}
      <div className="bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[16px] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] mb-4 text-text-muted/60">
          Supported Currencies
        </p>
        <div className="flex flex-wrap gap-2.5">
          {activeCurrencies.map((c) => (
            <div
              key={c.code}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] bg-muted-surface/30 border border-border/40 hover:border-brand/40 hover:bg-muted-surface/60 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span className="text-[16px] select-none">{c.flag}</span>
              <div>
                <p className="text-[11.5px] font-bold text-text leading-none">{c.code}</p>
                <p className="text-[9.5px] text-text-muted/70 mt-1 leading-none">{c.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
