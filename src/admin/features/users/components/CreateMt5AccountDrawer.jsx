import React, { useState, useEffect, useRef } from 'react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerSection, DrawerFormGrid, SelectField } from '@/components/common/drawer';
import { ActionBtn } from '@/components/ui';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { usersService } from '@/admin/features/users/services/userService';
import { groupService } from '@/admin/features/group-management/services/groupService';
import { tradingAccountsService } from '@/admin/features/trading/services/tradingAccountsService';
import { Check, Search, ChevronDown } from 'lucide-react';


// Simple Searchable Select for Users
function SearchableUserSelect({ label, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) || 
    opt.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(o => o.value === value);

  return (
    <label className="flex flex-col gap-1.5 relative" ref={containerRef}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">{label}</span>
      
      {/* Trigger Button */}
      <div 
        className="flex items-center justify-between h-10 w-full rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text outline-none transition-all cursor-pointer hover:border-primary/40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-text' : 'text-text-muted/50'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={12} className="text-text-muted/45" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-surface-elevated border border-border/20 rounded-[10px] shadow-lg z-50 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border/10 flex items-center gap-2 bg-bg/50">
            <Search size={14} className="text-text-muted/50" />
            <input 
              type="text" 
              autoFocus
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] text-text w-full placeholder:text-text-muted/30"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt.value}
                  className={`px-3 py-2 text-[12px] rounded-[6px] cursor-pointer transition-colors ${value === opt.value ? 'bg-brand/10 text-brand font-semibold' : 'text-text hover:bg-bg'}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-[11px] text-text-muted/50">
                No users found.
              </div>
            )}
          </div>
        </div>
      )}
    </label>
  );
}

export function CreateMt5AccountDrawer({ open, onClose, onSave }) {
  const [users, setUsers] = useState([]);
  const [crmGroups, setCrmGroups] = useState([]);
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [leverage, setLeverage] = useState('1:100');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      loadDependencies();
      resetForm();
    }
  }, [open]);

  const loadDependencies = async () => {
    try {
      const [fetchedUsers, fetchedGroups] = await Promise.all([
        usersService.list(),
        groupService.list()
      ]);
      setUsers(fetchedUsers || []);
      
      const groups = Array.isArray(fetchedGroups) ? fetchedGroups : (fetchedGroups?.data || []);
      setCrmGroups(groups);
      
      // Set defaults to avoid the "Please fill all fields" issue
      if (groups.length > 0) setSelectedGroup(groups[0].name || groups[0]);
    } catch (err) {
      console.error('Error loading drawer dependencies:', err);
    }
  };

  const resetForm = () => {
    setSelectedUserId('');
    setSelectedGroup('');
    setLeverage('1:100');
    setError('');
    setShowSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedUserId || !selectedGroup || !leverage) {
      setError('Please fill in all fields (Client, Group, Leverage).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        userId: parseInt(selectedUserId),
        groupName: selectedGroup,
        leverage
      };

      const result = await tradingAccountsService.create(payload);
      
      setShowSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSave?.(result.data);
        onClose();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.message || err.message || 'Failed to create account.');
    }
  };

  // Prepare options
  const userOptions = users.map(u => ({ label: `${u.name} (${u.email})`, value: u.id.toString(), email: u.email }));
  
  // Safe group options
  const groupOptions = crmGroups.map(g => {
    const name = typeof g === 'object' ? g.name : g;
    return { label: name, value: name };
  });

  const leverageOptions = [
    { label: '1:10', value: '1:10' },
    { label: '1:30', value: '1:30' },
    { label: '1:50', value: '1:50' },
    { label: '1:100', value: '1:100' },
    { label: '1:200', value: '1:200' },
    { label: '1:500', value: '1:500' }
  ];

  return (
    <MainDrawer open={open} width="max-w-[500px]" onClose={onClose}>
      <DrawerHeader 
        title="Create MT5 Account" 
        subtitle="Generate a new MetaTrader 5 account and assign it to a user." 
        eyebrow="MT5 Account Setup" 
        onClose={onClose} 
      />
      
      <DrawerBody>
        <div className="space-y-5 animate-fade-up">
          <InlineAlert tone="info" title="Important Setup">
             Passwords will be auto-generated and safely stored. The user will receive an email if notification settings are enabled.
          </InlineAlert>

          {showSuccess && (
            <InlineAlert tone="success" title="Account Prepared">
              Successfully generated MT5 account from server.
            </InlineAlert>
          )}

          {error && (
            <InlineAlert tone="critical" title="Creation Failed">
              {error}
            </InlineAlert>
          )}

          <DrawerSection title="Account Parameters">
            <DrawerFormGrid cols={1}>
              <SearchableUserSelect
                label="Client"
                value={selectedUserId}
                onChange={setSelectedUserId}
                options={userOptions}
                placeholder="Search and select client..."
              />
              <SelectField
                label="CRM Group"
                value={selectedGroup}
                onChange={setSelectedGroup}
                options={groupOptions}
                placeholder="Select Group"
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
            Requires connection to the Live Server.
          </div>
          <div className="flex items-center gap-2">
            <ActionBtn label="Cancel" variant="default" onClick={onClose} disabled={isSubmitting} />
            <ActionBtn
              label={showSuccess ? "Created!" : (isSubmitting ? "Generating..." : "Create Account")}
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
