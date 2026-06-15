import { Inbox, Clock, CheckCircle2, Zap, Plus, BookOpen, MessageCircle, Bell } from 'lucide-react';

export const SUPPORT_STATS = [
  { id: 'open',     label: 'Open',   value: 2,   Icon: Inbox,        colorCls: 'text-brand',    bgCls: 'bg-brand/10 border-brand/20'       },
  { id: 'pending',  label: 'Pending',  value: 1,   Icon: Clock,        colorCls: 'text-warning',  bgCls: 'bg-warning/10 border-warning/20'   },
  { id: 'resolved', label: 'Resolved',  value: 4,   Icon: CheckCircle2, colorCls: 'text-positive', bgCls: 'bg-positive/10 border-positive/20' },
  { id: 'response', label: 'Response time',    value: '4h', Icon: Zap,         colorCls: 'text-purple',   bgCls: 'bg-purple/10 border-purple/20'     },
];

export const QUICK_ACTIONS = [
  { id: 'create', label: 'New ticket',     sub: 'Create a request',    Icon: Plus,          colorCls: 'text-brand',    bgCls: 'bg-brand/10 border border-brand/20',         path: '/client/support/create' },
  { id: 'tickets',label: 'My tickets',    sub: 'View open requests',    Icon: Inbox,         colorCls: 'text-brand',    bgCls: 'bg-brand/[0.07] border border-brand/15',     path: '/client/support/tickets' },
  { id: 'kb',     label: 'Help guides', sub: 'Search guides',      Icon: BookOpen,      colorCls: 'text-positive', bgCls: 'bg-positive/10 border border-positive/20',      path: '/client/support/kb' },
  { id: 'chat',   label: 'Live chat',      sub: 'Chat with support',   Icon: MessageCircle, colorCls: 'text-purple',   bgCls: 'bg-purple/10 border border-purple/20',  path: '/client/support/chat' },
  { id: 'anns',   label: 'Announcements',  sub: 'Latest updates',   Icon: Bell,          colorCls: 'text-warning',  bgCls: 'bg-warning/10 border border-warning/20',       path: '/client/support/announcements' },
];
