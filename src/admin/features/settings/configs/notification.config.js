export const INITIAL_NOTIFICATION_CONFIG = {
  emailEnabled: true,
  smsEnabled: true,
  inAppEnabled: true,
  webhookEnabled: true,
  pushEnabled: false,
  emailProvider: 'SENDGRID',
  smsProvider: 'TWILIO',
  smtpHost: 'smtp.sendgrid.net',
  smtpPort: '587',
  fromEmail: 'noreply@live-trader.com',
  fromName: 'Live-Trader',
  sendgridKey: 'SG.●●●●●●●●●●●●●',
  twilioSid: 'AC●●●●●●●●',
  twilioFrom: '+1555000000',
  events: {
    deposit_received: { email: true, sms: false, inApp: true },
    withdrawal_approved: { email: true, sms: true, inApp: true },
    withdrawal_rejected: { email: true, sms: false, inApp: true },
    kyc_approved: { email: true, sms: false, inApp: true },
    kyc_rejected: { email: true, sms: false, inApp: true },
    margin_call: { email: true, sms: true, inApp: true },
    stop_out: { email: true, sms: true, inApp: true },
    password_reset: { email: true, sms: false, inApp: false },
    login_alert: { email: true, sms: false, inApp: true },
    prop_challenge_fail: { email: true, sms: false, inApp: true },
  },
};

export const EMAIL_PROVIDERS = ['SENDGRID', 'MAILGUN', 'SES', 'SMTP_CUSTOM'];

export const SMS_PROVIDERS = ['TWILIO', 'VONAGE', 'SNS', 'MESSAGEBIRD'];

export const TEMPLATES_LIST = [
  { name: 'Deposit Confirmation', event: 'deposit_received', status: 'ACTIVE' },
  { name: 'Withdrawal Approved', event: 'withdrawal_approved', status: 'ACTIVE' },
  { name: 'KYC Approval', event: 'kyc_approved', status: 'ACTIVE' },
  { name: 'KYC Rejection', event: 'kyc_rejected', status: 'ACTIVE' },
  { name: 'Margin Call Warning', event: 'margin_call', status: 'ACTIVE' },
  { name: 'Password Reset', event: 'password_reset', status: 'ACTIVE' },
  { name: 'Prop Challenge Failed', event: 'prop_challenge_fail', status: 'DRAFT' },
];
