/**
 * MT5 gateway balance-operation types handled by the Balance Operations page.
 * Deposit (0) and Withdrawal (1) live in their own modules.
 * The type alone decides how MT5 applies the amount (no add/deduct choice).
 */
export const BALANCE_OP_TYPES = [
  { id: 2, label: 'Credit',          color: 'var(--cyan)',     hint: 'Credit line: adds to equity/margin, not to balance.' },
  { id: 5, label: 'Bonus',           color: 'var(--positive)', hint: 'Bonus paid to the balance.' },
  { id: 6, label: 'Commission',      color: 'var(--brand)',    hint: 'Commission paid to the account.' },
  { id: 4, label: 'Correction',      color: 'var(--warning)',  hint: 'Balance correction.' },
  { id: 3, label: 'Charge',          color: 'var(--negative)', hint: 'Fee or charge taken from the balance.' },
  { id: 7, label: 'Tax',             color: 'var(--negative)', hint: 'Tax taken from the balance.' },
  { id: 8, label: 'Dividend',        color: 'var(--positive)', hint: 'Dividend on a stock/index position.' },
  { id: 9, label: 'Dividend Franked', color: 'var(--positive)', hint: 'Franked dividend (with tax credit).' },
];

export const BALANCE_OP_TYPE_BY_ID = Object.fromEntries(BALANCE_OP_TYPES.map((t) => [t.id, t]));

export function fmtMoney(n) {
  const v = Number(n) || 0;
  return `${v < 0 ? '-' : ''}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
