import React, { useState, useEffect } from 'react';
import {
  Bell, Mail, Smartphone, Code, FileText, Settings, Key, Eye, Check,
  ArrowDownCircle, ArrowUpCircle, XCircle, ShieldCheck, ShieldAlert,
  AlertTriangle, Fingerprint, Award, CheckCircle2, X as CloseIcon,
  Plus, Trash2, Edit3
} from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  ToggleRow,
  Btn,
  TArea,
} from '../components/SettingsForm';
import {
  EMAIL_PROVIDERS,
  SMS_PROVIDERS,
} from '../configs/notification.config';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';

/* ─── TemplateModal Component ─────────────────────────────────────── */
function TemplateModal({ isOpen, onClose, template, onSave, onDelete, eventKeys = [], defaultEventKey = '' }) {
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [customEvent, setCustomEvent] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [type, setType] = useState('email');
  const [modalTab, setModalTab] = useState('edit'); // 'edit' or 'preview'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      const evt = template.event || '';
      setSubject(template.subject || '');
      setBody(template.body || '');
      setStatus(template.status || 'ACTIVE');
      setType(template.type || 'email');

      if (eventKeys.includes(evt)) {
        setEvent(evt);
        setIsCustom(false);
      } else {
        setEvent('custom');
        setCustomEvent(evt);
        setIsCustom(true);
      }
    } else {
      setName('');
      const defaultEvt = defaultEventKey || '';
      if (defaultEvt) {
        if (eventKeys.includes(defaultEvt)) {
          setEvent(defaultEvt);
          setIsCustom(false);
        } else {
          setEvent('custom');
          setCustomEvent(defaultEvt);
          setIsCustom(true);
        }
      } else {
        setEvent('');
        setIsCustom(false);
      }
      setCustomEvent('');
      setSubject('');
      setBody('');
      setStatus('ACTIVE');
      setType('email');
    }
    setModalTab('edit');
    setError('');
  }, [template, isOpen, eventKeys, defaultEventKey]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalEvent = isCustom ? customEvent.trim().toLowerCase().replace(/\s+/g, '_') : event;
    if (!name || !finalEvent || !subject || !body) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave({
        id: template?.id,
        name,
        event: finalEvent,
        subject,
        body,
        status,
        type
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save template.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-[12px] border border-border/15 bg-surface-elevated shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-border/10">
          <div>
            <h3 className="text-[14px] font-bold font-heading text-text">
              {template ? 'Edit Template' : 'Create Template'}
            </h3>
            <p className="text-[11px] text-text-muted/40 font-heading mt-0.5">
              Customize automated email message responses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/[0.06] text-text-muted/50 hover:text-text cursor-pointer transition-colors"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Tab Selector inside Modal */}
        <div className="flex px-6 border-b border-border/10 bg-bg/30">
          <button
            type="button"
            onClick={() => setModalTab('edit')}
            className={`px-4 py-2.5 text-[12px] font-semibold font-heading border-b-2 transition-all ${
              modalTab === 'edit'
                ? 'border-brand text-brand font-bold'
                : 'border-transparent text-text-muted/50 hover:text-text-muted font-normal'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setModalTab('preview')}
            className={`px-4 py-2.5 text-[12px] font-semibold font-heading border-b-2 transition-all ${
              modalTab === 'preview'
                ? 'border-brand text-brand font-bold'
                : 'border-transparent text-text-muted/50 hover:text-text-muted font-normal'
            }`}
          >
            Rendered Preview
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-[6px] border border-negative/20 bg-negative/5 text-negative text-[11.5px] font-heading font-semibold">
              {error}
            </div>
          )}

          {modalTab === 'edit' ? (
            <div className="space-y-4">
              <FGroup cols={2}>
                <div>
                  <FieldLabel required hint="Display name of the template">Template Name</FieldLabel>
                  <TInput
                    value={name}
                    onChange={setName}
                    placeholder="e.g. Deposit Confirmation"
                  />
                </div>
                <div>
                  <FieldLabel required hint="Select or define the system event key">Event Key</FieldLabel>
                  <TSelect
                    value={isCustom ? 'custom' : event}
                    onChange={(v) => {
                      if (v === 'custom') {
                        setIsCustom(true);
                        setEvent('custom');
                      } else {
                        setIsCustom(false);
                        setEvent(v);
                      }
                    }}
                    options={[
                      { value: '', label: 'Select Event Key...' },
                      ...eventKeys.map(k => ({ value: k, label: k })),
                      { value: 'custom', label: 'Create New / Custom Event...' }
                    ]}
                  />
                  {isCustom && (
                    <div className="mt-2 animate-in slide-in-from-top duration-200">
                      <TInput
                        value={customEvent}
                        onChange={setCustomEvent}
                        placeholder="Enter custom event key (e.g. user_registered)"
                        mono
                      />
                    </div>
                  )}
                </div>
              </FGroup>

              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Active or Draft status">Status</FieldLabel>
                  <TSelect
                    value={status}
                    onChange={setStatus}
                    options={[
                      { value: 'ACTIVE', label: 'ACTIVE' },
                      { value: 'DRAFT', label: 'DRAFT' }
                    ]}
                  />
                </div>
                <div>
                  <FieldLabel hint="Notification channel type">Channel Type</FieldLabel>
                  <TSelect
                    value={type}
                    onChange={setType}
                    options={[
                      { value: 'email', label: 'Email Only' },
                      { value: 'sms', label: 'SMS (Coming Soon)' },
                      { value: 'in_app', label: 'In-App Dashboard (Coming Soon)' }
                    ]}
                    disabled
                  />
                </div>
              </FGroup>

              <div>
                <FieldLabel required hint="Email subject line seen by users">Email Subject</FieldLabel>
                <TInput
                  value={subject}
                  onChange={setSubject}
                  placeholder="e.g. Deposit Confirmed Successfully"
                />
              </div>

              <div>
                <FieldLabel required hint="HTML body content supporting replacement tags">
                  Template Body (HTML)
                </FieldLabel>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder="<h3>Welcome</h3><p>Hi {userName}, thank you for registering...</p>"
                  className="w-full px-3 py-2.5 rounded-[8px] border border-border/30 bg-bg text-[12.5px] text-text font-mono tracking-wide outline-none placeholder:text-text-muted/30 focus:border-brand/40 focus:bg-surface-elevated resize-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              {/* Dynamic Variables Cheatsheet */}
              <div className="p-3 bg-bg/40 border border-border/10 rounded-[8px]">
                <span className="block text-[10px] font-black uppercase tracking-wider text-text-muted/40 font-heading mb-1.5">
                  Available Replacement Tags
                </span>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-text-muted/65">
                  <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">{`{userName}`}</span>
                  <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">{`{amount}`}</span>
                  <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">{`{otp}`}</span>
                  <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">{`{rejectionReason}`}</span>
                  <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">{`{status}`}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-border/10 rounded-[8px] bg-bg/30 p-4">
                <span className="block text-[10.5px] uppercase tracking-wider text-text-muted/40 font-bold mb-1">
                  Subject Preview
                </span>
                <div className="text-[12.5px] font-semibold text-text font-heading">
                  {subject || '(No Subject)'}
                </div>
              </div>

              <div className="border border-border/10 rounded-[8px] bg-white text-black min-h-[250px] overflow-hidden flex flex-col">
                <span className="block text-[10.5px] uppercase tracking-wider text-gray-400 font-bold p-3 bg-gray-50 border-b border-gray-100">
                  Rendered HTML Preview
                </span>
                <div
                  className="p-5 overflow-auto text-sm leading-relaxed flex-1 font-sans"
                  dangerouslySetInnerHTML={{ __html: body || '<p class="text-gray-400 italic">Body is empty</p>' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4.5 border-t border-border/10 bg-bg/10">
          <div>
            {template && onDelete && (
              <Btn
                Icon={Trash2}
                label="Delete Template"
                variant="danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete '${name}' template?`)) {
                    onDelete(template.id);
                    onClose();
                  }
                }}
              />
            )}
          </div>
          <div className="flex gap-2">
            <Btn
              label="Cancel"
              variant="default"
              onClick={onClose}
              disabled={loading}
            />
            {modalTab === 'edit' && (
              <Btn
                label="Save Template"
                variant="brand"
                type="submit"
                loading={loading}
                onClick={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * NotificationSettingsPage — Manages email/SMS gateways, alert channels, webhook dispatches, and message templates.
 */
export function NotificationSettingsPage({
  notificationConfig,
  updateNotificationField,
  updateNotificationNestedField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('channels');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newEventKey, setNewEventKey] = useState('');
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [defaultEvent, setDefaultEvent] = useState('');

  const {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = usePlatformSettings();

  const handleEdit = (tpl) => {
    setSelectedTemplate(tpl);
    setDefaultEvent('');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setDefaultEvent('');
    setModalOpen(true);
  };

  const handleSaveTemplate = async (templateData) => {
    if (templateData.id) {
      await updateTemplate(templateData.id, templateData);
    } else {
      await createTemplate(templateData);
    }
  };

  const handleAddEvent = (key) => {
    if (!key) return;
    const formattedKey = key.trim().toLowerCase().replace(/\s+/g, '_');
    if (notificationConfig.events?.[formattedKey]) {
      alert('Event already exists.');
      return;
    }
    const updatedEvents = {
      ...(notificationConfig.events || {}),
      [formattedKey]: { email: false, sms: false, inApp: false, templateId: '' }
    };
    updateNotificationField('events', updatedEvents);
  };

  const handleDeleteEvent = (evtKey) => {
    if (window.confirm(`Are you sure you want to remove the event '${evtKey}'?`)) {
      const updatedEvents = { ...notificationConfig.events };
      delete updatedEvents[evtKey];
      updateNotificationField('events', updatedEvents);
    }
  };

  const AlertCheck = ({ active, onChange }) => (
    <button
      type="button"
      onClick={() => onChange?.(!active)}
      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95 mx-auto ${active
        ? 'border-positive/30 bg-positive/[0.15] text-positive'
        : 'border-white/[0.08] bg-transparent text-transparent hover:border-white/[0.16]'}`}
    >
      <Check size={11} strokeWidth={3} />
    </button>
  );

  const eventIcons = {
    deposit_received: ArrowDownCircle,
    withdrawal_approved: ArrowUpCircle,
    withdrawal_rejected: XCircle,
    kyc_approved: ShieldCheck,
    kyc_rejected: ShieldAlert,
    margin_call: AlertTriangle,
    stop_out: AlertTriangle,
    password_reset: Key,
    login_alert: Fingerprint,
    prop_challenge_fail: Award,
  };

  const toggleRow = (evtKey) => {
    const channelSettings = notificationConfig.events?.[evtKey] || {};
    const allOn = channelSettings.email && channelSettings.sms && channelSettings.inApp;
    updateNotificationNestedField('events', evtKey, {
      email: !allOn,
      sms: !allOn,
      inApp: !allOn,
    });
  };

  const toggleCol = (channel) => {
    const allOn = Object.values(notificationConfig.events || {}).every(
      (ch) => ch[channel]
    );
    const updatedEvents = {};
    Object.entries(notificationConfig.events || {}).forEach(([evtKey, ch]) => {
      updatedEvents[evtKey] = {
        ...ch,
        [channel]: !allOn,
      };
    });
    updateNotificationField('events', updatedEvents);
  };

  const toggleAll = (val) => {
    const updatedEvents = {};
    Object.keys(notificationConfig.events || {}).forEach((evtKey) => {
      updatedEvents[evtKey] = {
        email: val,
        sms: val,
        inApp: val,
      };
    });
    updateNotificationField('events', updatedEvents);
  };

  const tabs = [
    { id: 'channels', label: 'Channels', Icon: Bell },
    { id: 'providers', label: 'Providers', Icon: Settings },
    { id: 'templates', label: 'Templates', Icon: FileText },
  ];

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Notification Settings"
        desc="Set up email, SMS, and in-app notification channels and templates."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'channels' && (
        <div className="space-y-5">
          <SettingsCard
            title="Notification Channels"
            desc="Choose which channels are active for sending alerts."
            Icon={Bell}
          >
            <div className="rounded-[8px] border border-border/15 bg-bg px-4 py-1">
              <ToggleRow
                label="Email"
                desc="Send alerts and confirmations to client emails"
                val={notificationConfig.emailEnabled}
                onChange={(v) => updateNotificationField('emailEnabled', v)}
              />
              <ToggleRow
                label="SMS"
                desc="Send OTP codes and urgent alerts to mobile devices"
                val={notificationConfig.smsEnabled}
                onChange={(v) => updateNotificationField('smsEnabled', v)}
              />
              <ToggleRow
                label="In-App Notifications"
                desc="Push alerts to user dashboards"
                val={notificationConfig.inAppEnabled}
                onChange={(v) => updateNotificationField('inAppEnabled', v)}
              />
              <ToggleRow
                label="Webhooks"
                desc="Send event data to your webhook endpoints"
                val={notificationConfig.webhookEnabled}
                onChange={(v) => updateNotificationField('webhookEnabled', v)}
              />
              <ToggleRow
                label="Push Notifications"
                desc="Send browser push notifications to active users"
                val={notificationConfig.pushEnabled}
                onChange={(v) => updateNotificationField('pushEnabled', v)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Event Notifications"
            desc="Choose which channels send alerts for each event."
            Icon={Settings}
            action={
              <div className="flex items-center gap-2">
                {showAddEventForm ? (
                  <div className="flex items-center gap-1.5 animate-in slide-in-from-right duration-250">
                    <input
                      type="text"
                      placeholder="e.g. payout_processed"
                      value={newEventKey}
                      onChange={(e) => setNewEventKey(e.target.value)}
                      className="h-7.5 px-2 bg-bg border border-border/30 rounded-[6px] text-[11px] text-text font-mono placeholder:text-text-muted/30 outline-none focus:border-brand/40"
                    />
                    <Btn
                      label="Confirm"
                      variant="primary"
                      small
                      onClick={() => {
                        handleAddEvent(newEventKey);
                        setNewEventKey('');
                        setShowAddEventForm(false);
                      }}
                    />
                    <Btn
                      label="Cancel"
                      variant="default"
                      small
                      onClick={() => {
                        setNewEventKey('');
                        setShowAddEventForm(false);
                      }}
                    />
                  </div>
                ) : (
                  <Btn
                    label="Add Event"
                    Icon={Plus}
                    variant="brand"
                    small
                    onClick={() => setShowAddEventForm(true)}
                  />
                )}
                <Btn
                  label="Enable All"
                  Icon={CheckCircle2}
                  variant="primary"
                  small
                  onClick={() => toggleAll(true)}
                />
                <Btn
                  label="Disable All"
                  Icon={CloseIcon}
                  variant="danger"
                  small
                  onClick={() => toggleAll(false)}
                />
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-border/15 text-text-muted/40 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1.5 pb-1">
                        <span>All Channels</span>
                        <div className="h-5" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1.5 pb-1">
                        <span>Email Template</span>
                        <div className="h-5" />
                      </div>
                    </th>
                    {['Email', 'SMS', 'In-App'].map((channelName) => {
                      const channelKey = channelName === 'Email' ? 'email' : channelName === 'SMS' ? 'sms' : 'inApp';
                      const allOn = Object.values(notificationConfig.events || {}).length > 0 &&
                        Object.values(notificationConfig.events || {}).every((ch) => ch[channelKey]);
                      return (
                        <th key={channelName} className="py-2.5 px-3 text-center">
                          <div className="flex flex-col items-center gap-1.5 pb-1">
                            <span>{channelName}</span>
                            <button
                              type="button"
                              onClick={() => toggleCol(channelKey)}
                              className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-all hover:scale-110 active:scale-95 cursor-pointer
                                ${allOn ? 'border-cyan/30 bg-cyan/[0.12] text-cyan' : 'border-border/30 text-transparent hover:border-border/60'}`}
                            >
                              <Check size={9} strokeWidth={3} />
                            </button>
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-2.5 px-3 text-right">
                      <div className="flex flex-col items-end gap-1.5 pb-1">
                        <span>Actions</span>
                        <div className="h-5" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 font-heading">
                  {Object.entries(notificationConfig.events || {}).map(([evtKey, channelSettings]) => {
                    const label = evtKey
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    const EvtIcon = eventIcons[evtKey] || Bell;
                    return (
                      <tr key={evtKey} className="hover:bg-border/5 transition-colors group">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] bg-bg/50 border border-border/20 text-text-muted/40 group-hover:text-brand group-hover:border-brand/30 transition-all duration-200">
                              <EvtIcon size={12} />
                            </div>
                            <span className="text-[12.5px] font-semibold text-text/80 transition-colors group-hover:text-brand">{label}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {(() => {
                            const allRowOn = channelSettings.email && channelSettings.sms && channelSettings.inApp;
                            const someRowOn = !allRowOn && (channelSettings.email || channelSettings.sms || channelSettings.inApp);
                            return (
                              <button
                                type="button"
                                onClick={() => toggleRow(evtKey)}
                                className={`mx-auto flex h-5 w-5 items-center justify-center rounded-[4px] border transition-all hover:scale-110 active:scale-95 cursor-pointer
                                  ${allRowOn ? 'border-brand/40 bg-brand/[0.12]' : someRowOn ? 'border-warning/40 bg-warning/[0.08]' : 'border-border/30 hover:border-border/60'}`}
                              >
                                {allRowOn ? (
                                  <Check size={9} strokeWidth={3} className="text-brand" />
                                ) : someRowOn ? (
                                  <span className="h-0.5 w-2 rounded-full bg-warning" />
                                ) : null}
                              </button>
                            );
                          })()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {(() => {
                            const matchedTemplate = templates.find((t) => t.event === evtKey);
                            if (matchedTemplate) {
                              const isActive = matchedTemplate.status === 'ACTIVE';
                              const colorClass = isActive
                                ? 'border-positive/20 bg-positive/[0.06] text-positive hover:bg-positive/[0.12]'
                                : 'border-warning/20 bg-warning/[0.06] text-warning hover:bg-warning/[0.12]';
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleEdit(matchedTemplate)}
                                  className={`inline-flex items-center gap-1.5 rounded-[6px] border ${colorClass} transition-all px-2.5 py-1 text-[11px] font-semibold cursor-pointer mx-auto`}
                                >
                                  <FileText size={11} className="opacity-75" />
                                  <span>{matchedTemplate.name}</span>
                                </button>
                              );
                            }
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  setDefaultEvent(evtKey);
                                  setSelectedTemplate(null);
                                  setModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-[6px] border border-brand/20 bg-brand/[0.06] text-brand hover:bg-brand/[0.12] transition-all px-2.5 py-1 text-[11px] font-semibold cursor-pointer mx-auto"
                              >
                                <Plus size={11} strokeWidth={2.5} />
                                <span>Create Template</span>
                              </button>
                            );
                          })()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <AlertCheck
                            active={channelSettings.email}
                            onChange={(v) =>
                              updateNotificationNestedField('events', evtKey, {
                                ...channelSettings,
                                email: v,
                              })
                            }
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <AlertCheck
                            active={channelSettings.sms}
                            onChange={(v) =>
                              updateNotificationNestedField('events', evtKey, {
                                ...channelSettings,
                                sms: v,
                              })
                            }
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <AlertCheck
                            active={channelSettings.inApp}
                            onChange={(v) =>
                              updateNotificationNestedField('events', evtKey, {
                                ...channelSettings,
                                inApp: v,
                              })
                            }
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Btn
                            Icon={Trash2}
                            variant="danger"
                            small
                            onClick={() => handleDeleteEvent(evtKey)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {Object.entries(notificationConfig.events || {}).length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text-muted/30 font-heading">
                        No event triggers defined. Use 'Add Event' to create your first notification trigger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Legend */}
              <div className="flex items-center gap-6 text-[10.5px] font-heading text-text-muted/50 flex-wrap mt-5 pt-4 border-t border-border/10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-positive/30 bg-positive/[0.15] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-positive" />
                  </div>
                  <span>On</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-white/[0.08] bg-transparent" />
                  <span>Off</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-cyan/25 bg-cyan/[0.1] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-cyan" />
                  </div>
                  <span>Toggle column</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] border border-brand/25 bg-brand/[0.1] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-brand" />
                  </div>
                  <span>Toggle row</span>
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-5">
          <SettingsCard
            title="Email Provider"
            desc="Set your email service and sender details."
            Icon={Mail}
          >
            <div className="space-y-4">
              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="Your email sending service">Email Provider</FieldLabel>
                  <TSelect
                    value={notificationConfig.emailProvider}
                    onChange={(v) => updateNotificationField('emailProvider', v)}
                    options={EMAIL_PROVIDERS}
                  />
                </div>
                <div>
                  <FieldLabel required hint="The 'from' address users will see">From Email</FieldLabel>
                  <TInput
                    value={notificationConfig.fromEmail}
                    onChange={(v) => updateNotificationField('fromEmail', v)}
                    placeholder="noreply@smatams.com"
                    mono
                  />
                </div>
              </FGroup>

              {notificationConfig.emailProvider === 'SMTP_CUSTOM' ? (
                <FGroup cols={2}>
                  <div>
                    <FieldLabel required hint="Your SMTP server domain">SMTP Host</FieldLabel>
                    <TInput
                      value={notificationConfig.smtpHost}
                      onChange={(v) => updateNotificationField('smtpHost', v)}
                      placeholder="smtp.example.com"
                      mono
                    />
                  </div>
                  <div>
                    <FieldLabel required hint="Port for SMTP (e.g. 587 or 465)">SMTP Port</FieldLabel>
                    <TInput
                      value={notificationConfig.smtpPort}
                      onChange={(v) => updateNotificationField('smtpPort', v)}
                      placeholder="587"
                      mono
                    />
                  </div>
                </FGroup>
              ) : (
                <div>
                  <FieldLabel required hint="Your SendGrid API key">SendGrid API Key</FieldLabel>
                  <TInput
                    value={notificationConfig.sendgridKey}
                    onChange={(v) => updateNotificationField('sendgridKey', v)}
                    type="password"
                    mono
                  />
                </div>
              )}

              <div>
                <FieldLabel hint="Display name shown in recipients' inboxes">Sender Name</FieldLabel>
                <TInput
                  value={notificationConfig.fromName}
                  onChange={(v) => updateNotificationField('fromName', v)}
                  placeholder="Smatams"
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="SMS Provider"
            desc="Set up your SMS gateway for sending text messages."
            Icon={Smartphone}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel hint="Your SMS provider">SMS Provider</FieldLabel>
                <TSelect
                  value={notificationConfig.smsProvider}
                  onChange={(v) => updateNotificationField('smsProvider', v)}
                  options={SMS_PROVIDERS}
                />
              </div>

              {notificationConfig.smsProvider === 'TWILIO' && (
                <FGroup cols={2}>
                  <div>
                    <FieldLabel required hint="Your Twilio Account SID">Twilio Account SID</FieldLabel>
                    <TInput
                      value={notificationConfig.twilioSid}
                      onChange={(v) => updateNotificationField('twilioSid', v)}
                      mono
                    />
                  </div>
                  <div>
                    <FieldLabel required hint="Twilio phone number for sending SMS">Twilio Phone Number</FieldLabel>
                    <TInput
                      value={notificationConfig.twilioFrom}
                      onChange={(v) => updateNotificationField('twilioFrom', v)}
                      placeholder="+1555000000"
                      mono
                    />
                  </div>
                </FGroup>
              )}
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-5">
          <SettingsCard
            title="Email Templates"
            desc="View and manage message templates sent on system events."
            Icon={FileText}
            action={
              <Btn
                Icon={Plus}
                label="Create Template"
                variant="brand"
                small
                onClick={handleCreate}
              />
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-border/15 text-text-muted/40 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Template</th>
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 font-heading">
                  {templates.map((tpl) => (
                    <tr key={tpl.id || tpl.name} className="hover:bg-border/5 transition-colors">
                      <td className="py-3 px-3 font-semibold text-text/85">{tpl.name}</td>
                      <td className="py-3 px-3 text-text-muted/50 font-mono text-[11px]">{tpl.event}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider"
                          style={{
                            color: tpl.status === 'ACTIVE' ? 'var(--positive)' : 'var(--warning)',
                            background: tpl.status === 'ACTIVE' ? 'rgba(74, 225, 118, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                            border: `1px solid ${tpl.status === 'ACTIVE' ? 'rgba(74, 225, 118, 0.18)' : 'rgba(217, 119, 6, 0.18)'}`,
                          }}
                        >
                          {tpl.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Btn
                          Icon={Eye}
                          label="Edit / Preview"
                          variant="default"
                          small
                          onClick={() => handleEdit(tpl)}
                        />
                      </td>
                    </tr>
                  ))}
                  {templates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-text-muted/30 font-heading">
                        No templates loaded. Use 'Create Template' to define one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        onSave={saveCurrentSection}
        onReset={resetCurrentSection}
        label="Save Notification Settings"
      />

      <TemplateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
        onDelete={deleteTemplate}
        eventKeys={Object.keys(notificationConfig.events || {})}
        defaultEventKey={defaultEvent}
      />
    </div>
  );
}

export default NotificationSettingsPage;
