export const INITIAL_SYSTEM_CONFIG = {
  brandName: 'Live-Trader',
  brandDomain: 'live-trader.com',
  supportEmail: 'support@live-trader.com',
  timezone: 'UTC',
  locale: 'en-US',
  currency: 'USD',
  dateFormat: 'DD/MM/YYYY',
  sessionTimeout: '30',
  maxSessions: '3',
  mfaRequired: true,
  passwordMinLength: '12',
  passwordExpiry: '90',
  loginAttempts: '5',
  auditLogEnabled: true,
  auditLogRetention: '365',
  backupEnabled: true,
  backupFrequency: 'DAILY',
  backupRetention: '30',
  dataRetention: '730',
};

export const TIMEZONE_OPTIONS = [
  'UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5:30', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC-5', 'UTC-8'
];

export const LOCALE_OPTIONS = [
  'en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP', 'ar-SA', 'zh-CN'
];

export const SYSTEM_CURRENCY_OPTIONS = [
  'USD', 'EUR', 'GBP', 'JPY', 'AED', 'SGD'
];

export const DATE_FORMAT_OPTIONS = [
  'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'
];

export const BACKUP_FREQUENCY_OPTIONS = [
  'HOURLY', 'DAILY', 'WEEKLY'
];

export const EXPORT_FORMAT_OPTIONS = [
  'CSV', 'JSON', 'SIEM'
];
