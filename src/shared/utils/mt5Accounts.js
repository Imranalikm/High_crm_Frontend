/**
 * True for MT5 demo accounts: created through the demo flow (accountType DEMO)
 * or sitting in a CRM group whose type is Demo.
 */
export function isDemoAccount(acc) {
  return (
    String(acc?.accountType || '').toUpperCase() === 'DEMO' ||
    String(acc?.groupType || '').toLowerCase() === 'demo'
  );
}
