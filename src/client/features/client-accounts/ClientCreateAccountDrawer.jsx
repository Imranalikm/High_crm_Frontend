import React, { useState, useEffect } from 'react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerSection, DrawerFormGrid, SelectField, TextField } from '@/components/common/drawer';
import { ActionBtn } from '@/components/ui';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { apiClient } from '@/shared/api/client/apiClient';
import { Check } from 'lucide-react';

export function ClientCreateAccountDrawer({ open, onClose, onSave }) {
  const [crmGroups, setCrmGroups] = useState([]);
  
  const [selectedGroup, setSelectedGroup] = useState('');
  const [leverage, setLeverage] = useState('1:500');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      loadGroups();
      resetForm();
    }
  }, [open]);

  const loadGroups = async () => {
    try {
      const response = await apiClient.get('/crm-groups');
      const groups = response?.data || response || [];
      // Filter or format as needed. Ensure array.
      const arr = Array.isArray(groups) ? groups : [];
      setCrmGroups(arr);
      
      if (arr.length > 0) {
        setSelectedGroup(arr[0].name || arr[0]);
      }
    } catch (err) {
      console.error('Error loading CRM groups:', err);
    }
  };

  const resetForm = () => {
    setSelectedGroup('');
    setLeverage('1:500');
    setError('');
    setShowSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedGroup || !leverage) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        groupName: selectedGroup,
        leverage
      };

      await apiClient.post('/mt5-accounts', payload);
      
      setShowSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSave?.();
        onClose();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.message || err.message || 'Failed to request account.');
    }
  };

  const groupOptions = crmGroups.map(g => ({ label: g.name, value: g.name }));
  const leverageOptions = [
    { label: '1:100', value: '1:100' },
    { label: '1:200', value: '1:200' },
    { label: '1:500', value: '1:500' }
  ];

  return (
    <MainDrawer open={open} width="max-w-[500px]" onClose={onClose}>
      <DrawerHeader 
        title="Open Trading Account" 
        subtitle="Create a live MT5 trading account instantly." 
        eyebrow="MT5 Application" 
        onClose={onClose} 
      />
      
      <DrawerBody>
        <div className="space-y-5 animate-fade-up">
          <InlineAlert tone="info" title="Security First">
             Passwords will be auto-generated and securely stored. You can view or change them later from your account settings.
          </InlineAlert>

          {showSuccess && (
            <InlineAlert tone="success" title="Account Ready">
              Your trading account has been created successfully!
            </InlineAlert>
          )}

          {error && (
            <InlineAlert tone="critical" title="Request Failed">
              {error}
            </InlineAlert>
          )}

          <DrawerSection title="Account Setup">
            <DrawerFormGrid cols={1}>
              <SelectField
                label="Account Group"
                value={selectedGroup}
                onChange={setSelectedGroup}
                options={groupOptions}
              />
              <SelectField
                label="Leverage"
                value={leverage}
                onChange={setLeverage}
                options={leverageOptions}
              />
            </DrawerFormGrid>
          </DrawerSection>
        </div>
      </DrawerBody>

      <DrawerFooter>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="text-[10px] text-text-muted/55 leading-snug">
            By continuing, you accept the Trading Terms.
          </div>
          <div className="flex items-center gap-2">
            <ActionBtn label="Cancel" variant="default" onClick={onClose} disabled={isSubmitting} />
            <ActionBtn
              label={showSuccess ? "Success!" : (isSubmitting ? "Processing..." : "Open Account")}
              Icon={showSuccess ? Check : undefined}
              variant="brand"
              disabled={isSubmitting || showSuccess}
              onClick={handleSave}
            />
          </div>
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}
