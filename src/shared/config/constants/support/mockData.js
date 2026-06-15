export const ticketsData = [
  {
    id: 'TKT-101',
    user: 'Sarah Jenkins',
    uid: 'UID-2891',
    email: 'sarah.j@gmail.com',
    subject: 'MT5 platform connection failure after recent update',
    priority: 'HIGH',
    status: 'OPEN',
    category: 'Technical',
    owner: 'Marcus Webb',
    updated: '10m ago',
    sla: 45,
    slaMins: 120,
    created: '2026-05-27 10:15',
    region: 'Europe',
    kyc: 'VERIFIED',
    wallet: 'ACTIVE',
    trading: 'ACTIVE',
    replies: 2,
    tags: ['mt5', 'connection']
  },
  {
    id: 'TKT-102',
    user: 'David Chen',
    uid: 'UID-4402',
    email: 'david.c@yahoo.com',
    subject: 'Delayed Ethereum withdrawal verification hold',
    priority: 'CRITICAL',
    status: 'OPEN',
    category: 'Finance',
    owner: 'Unassigned',
    updated: '2m ago',
    sla: 5,
    slaMins: 15,
    created: '2026-05-27 11:20',
    region: 'Asia',
    kyc: 'VERIFIED',
    wallet: 'ACTIVE',
    trading: 'ACTIVE',
    replies: 1,
    tags: ['crypto', 'withdrawal']
  },
  {
    id: 'TKT-103',
    user: 'Amara Okafor',
    uid: 'UID-9012',
    email: 'amara.o@outlook.com',
    subject: 'Prop Challenge Stage 2 metrics reporting discrepancy',
    priority: 'MEDIUM',
    status: 'PENDING',
    category: 'Prop',
    owner: 'Lena Fischer',
    updated: '1h ago',
    sla: 60,
    slaMins: 240,
    created: '2026-05-27 09:30',
    region: 'Africa',
    kyc: 'VERIFIED',
    wallet: 'ACTIVE',
    trading: 'ACTIVE',
    replies: 3,
    tags: ['prop', 'metrics']
  },
  {
    id: 'TKT-104',
    user: 'Jean-Pierre Roux',
    uid: 'UID-7312',
    email: 'jp.roux@orange.fr',
    subject: 'Verification code SMS not received on French prefix',
    priority: 'LOW',
    status: 'RESOLVED',
    category: 'Account',
    owner: 'Priya Sharma',
    updated: '3h ago',
    sla: 0,
    slaMins: null,
    created: '2026-05-27 07:15',
    region: 'Europe',
    kyc: 'PENDING',
    wallet: 'ACTIVE',
    trading: 'NONE',
    replies: 4,
    tags: ['sms', 'verification']
  },
  {
    id: 'TKT-105',
    user: 'Elena Rostova',
    uid: 'UID-3940',
    email: 'elena.r@mail.ru',
    subject: 'Incorrect commission calculation on IB level 3 referrals',
    priority: 'HIGH',
    status: 'ESCALATED',
    category: 'Compliance',
    owner: 'Keiran Lynch',
    updated: 'Just now',
    sla: 0,
    slaMins: -15,
    created: '2026-05-27 05:40',
    region: 'Global',
    kyc: 'VERIFIED',
    wallet: 'ACTIVE',
    trading: 'ACTIVE',
    replies: 5,
    tags: ['ib', 'referral', 'payout'],
    escalationReason: 'Complex referral tree tier calculation mismatch, requires compliance audit'
  },
  {
    id: 'TKT-106',
    user: 'Carlos Mendez',
    uid: 'UID-1102',
    email: 'carlos.m@hotmail.com',
    subject: 'Credit card deposit rejected by payment gateway',
    priority: 'HIGH',
    status: 'OPEN',
    category: 'Finance',
    owner: 'Marcus Webb',
    updated: '45m ago',
    sla: 15,
    slaMins: 45,
    created: '2026-05-27 08:30',
    region: 'Americas',
    kyc: 'VERIFIED',
    wallet: 'ACTIVE',
    trading: 'ACTIVE',
    replies: 0,
    tags: ['card', 'deposit-failed']
  },
  {
    id: 'TKT-107',
    user: 'Liam O\'Connor',
    uid: 'UID-8812',
    email: 'liam.oc@gmail.ie',
    subject: 'High execution latency spikes on copy trading orders',
    priority: 'CRITICAL',
    status: 'ESCALATED',
    category: 'Technical',
    owner: 'Unassigned',
    updated: '15m ago',
    sla: 0,
    slaMins: -5,
    created: '2026-05-27 10:45',
    region: 'Europe',
    kyc: 'VERIFIED',
    wallet: 'ACTIVE',
    trading: 'ACTIVE',
    replies: 1,
    tags: ['copy-trading', 'latency'],
    escalationReason: 'Provider fill rate delay spikes affecting slippage metrics'
  }
];

export const escalatedData = ticketsData.filter((t) => t.status === 'ESCALATED');

export const ticketConversation = [
  { id: 'MSG-SYS-1', type: 'system', author: 'System', role: '', ts: '2026-05-27 10:15', body: 'Ticket created and placed in the technical support queue.' },
  { id: 'MSG-USER-1', type: 'user', author: 'Sarah Jenkins', role: '', ts: '2026-05-27 10:16', body: 'Hi, since the platform update this morning, my MT5 application crashes immediately when I try to execute a trade. I have tried restarting and re-logging, but the issue persists. Can you check my account status?' },
  { id: 'MSG-SYS-2', type: 'system', author: 'System', role: '', ts: '2026-05-27 10:20', body: 'Marcus Webb has been assigned to this ticket.' },
  { id: 'MSG-AGENT-1', type: 'agent', author: 'Marcus Webb', role: 'Technical Support Lead', ts: '2026-05-27 10:32', body: 'Hello Sarah, I am looking into your account logs. I see your credentials are correct and MT5 is responding, but there might be a terminal configuration mismatch with the new build. I will run a remote reset on your terminal credentials. Please stand by.' },
  { id: 'MSG-INT-1', type: 'internal', author: 'Marcus Webb', role: 'Technical Support Lead', ts: '2026-05-27 10:35', body: 'Note to team: Re-verified terminal ID on Server 4. Routing path is stable but terminal build is 1380, whereas the server expects 1400. Resetting client build version constraint.' },
  { id: 'MSG-AGENT-2', type: 'agent', author: 'Marcus Webb', role: 'Technical Support Lead', ts: '2026-05-27 10:40', body: 'Sarah, I have initiated a terminal credentials reset and adjusted the build version requirements for your account. Could you please restart your MT5 application and try logging in again?' }
];

export const relatedTickets = [
  { id: 'TKT-101', subject: 'MT5 platform connection failure after recent update', status: 'OPEN', priority: 'HIGH' },
  { id: 'TKT-104', subject: 'Verification code SMS not received on French prefix', status: 'RESOLVED', priority: 'LOW' }
];

export const supportWorkspaces = {
  tickets: {
    eyebrow: 'Support Helpdesk',
    title: 'All Tickets',
    description: 'View, handle, and solve user questions and support requests.',
    tableTitle: 'All Support Tickets',
    tableSubtitle: 'Open and active support tickets',
    metrics: [
      { label: 'Open Tickets', value: ticketsData.filter(t => t.status === 'OPEN').length.toString(), subtext: 'Awaiting action', trend: 'up' },
    ],
    filters: [
      { key: 'priority', label: 'Priority', options: [{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'LOW', label: 'Low' }] },
      { key: 'status', label: 'Status', options: [{ value: 'OPEN', label: 'Open' }, { value: 'PENDING', label: 'Pending' }, { value: 'RESOLVED', label: 'Resolved' }] },
    ],
    columns: [
      { key: 'id', label: 'Ticket', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'subject', label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: ticketsData,
  },
  escalated: {
    eyebrow: 'Support Helpdesk',
    title: 'Urgent Tickets',
    description: 'Urgent user questions requiring manager review.',
    tableTitle: 'Urgent Support Tickets',
    tableSubtitle: 'Urgent questions requiring manager review',
    metrics: [
      { label: 'Urgent', value: escalatedData.length.toString(), subtext: 'Needs manager review', trend: 'danger' },
    ],
    filters: [
      { key: 'category', label: 'Category', options: [{ value: 'Finance', label: 'Finance' }, { value: 'Compliance', label: 'Compliance' }, { value: 'Account', label: 'Account' }, { value: 'Prop', label: 'Prop' }] },
      { key: 'priority', label: 'Priority', options: [{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }] },
    ],
    columns: [
      { key: 'id', label: 'Ticket', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'subject', label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: escalatedData,
  },
};

export const ticketDetails = {};
ticketsData.forEach((t) => {
  ticketDetails[t.id] = {
    ...t,
    summary: t.subject,
    notes: ticketConversation,
    internalNotes: []
  };
});
