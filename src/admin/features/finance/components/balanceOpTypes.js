/**
 * MT5 gateway balance-operation types handled by the Balance Operations page.
 * Deposit (0) and Withdrawal (1) live in their own modules.
 * defaultDirection: 1 = add, -1 = deduct.
 */
export const BALANCE_OP_TYPES = [
  { id: 2, label: 'Credit',          color: 'var(--cyan)',     defaultDirection: 1,  hint: 'Credit line: adds to equity/margin, not to balance. Deduct to remove credit.' },
  { id: 5, label: 'Bonus',           color: 'var(--positive)', defaultDirection: 1,  hint: 'Bonus paid to the balance. Deduct to remove a bonus.' },
  { id: 6, label: 'Commission',      color: 'var(--brand)',    defaultDirection: 1,  hint: 'Commission paid (add) or charged (deduct).' },
  { id: 4, label: 'Correction',      color: 'var(--warning)',  defaultDirection: 1,  hint: 'Balance correction in either direction.' },
  { id: 3, label: 'Charge',          color: 'var(--negative)', defaultDirection: -1, hint: 'Fee or charge taken from the balance.' },
  { id: 7, label: 'Tax',             color: 'var(--negative)', defaultDirection: -1, hint: 'Tax taken from the balance.' },
  { id: 8, label: 'Dividend',        color: 'var(--positive)', defaultDirection: 1,  hint: 'Dividend on a stock/index position.' },
  { id: 9, label: 'Dividend Franked', color: 'var(--positive)', defaultDirection: 1, hint: 'Franked dividend (with tax credit).' },
];

export const BALANCE_OP_TYPE_BY_ID = Object.fromEntries(BALANCE_OP_TYPES.map((t) => [t.id, t]));

export function fmtMoney(n) {
  const v = Number(n) || 0;
  return `${v < 0 ? '-' : ''}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
