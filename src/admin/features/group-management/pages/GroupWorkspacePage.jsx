import React, { useState, useEffect } from 'react';
import { Layers, Link } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { ConfirmDialog } from '@/components/overlays/ConfirmDialog';
import { groupService } from '../services/groupService';
import { GroupDirectoryTab } from '../components/GroupDirectoryTab';
import { MT5MappingsTab } from '../components/MT5MappingsTab';
import { GroupFormDrawer } from '../components/GroupFormDrawer';

export function GroupWorkspacePage() {
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('directory');
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create');
  const [editingGroup, setEditingGroup] = useState(null);
  
  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const data = await groupService.list();
      setGroups(data);
    } catch (err) {
      triggerToast('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleRefresh = () => {
    fetchGroups();
  };

  const handleAddGroupClick = () => {
    setDrawerMode('create');
    setEditingGroup(null);
    setDrawerOpen(true);
  };

  const handleEditGroupClick = (group) => {
    setDrawerMode('edit');
    setEditingGroup(group);
    setDrawerOpen(true);
  };

  const handleDeleteGroup = (id) => {
    const target = groups.find(g => g.id === id);
    if (!target) return;
    
    setGroupToDelete(target);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    setIsDeleting(true);
    try {
      await groupService.delete(groupToDelete.id);
      triggerToast(`Group "${groupToDelete.name}" deleted.`);
      handleRefresh();
      setDeleteModalOpen(false);
    } catch (err) {
      triggerToast(`Failed to delete group "${groupToDelete.name}".`);
    } finally {
      setIsDeleting(false);
      setGroupToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (drawerMode === 'edit' && editingGroup) {
        await groupService.update(editingGroup.id, formData);
        triggerToast(`Group "${formData.name}" updated.`);
      } else {
        await groupService.create(formData);
        triggerToast(`Group "${formData.name}" created.`);
      }
      setDrawerOpen(false);
      handleRefresh();
    } catch (err) {
      triggerToast('Failed to save group. Name might already exist.');
      console.error(err);
    }
  };

  return (
    <PageShell>
      {/* Dynamic Toast Alerts */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[300] bg-surface-elevated border border-brand/20 text-text text-[11px] font-bold px-4 py-3 rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-in flex items-center gap-2.5 select-none">
          <span className="w-2 h-2 bg-positive rounded-full animate-ping" />
          {toastMessage}
        </div>
      )}

      <div className="space-y-5.5">
        {/* Page Header */}
        <header className="flex flex-col gap-2.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5 select-none">
              Group Setup
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text select-none">
              MT5 Group Management
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-relaxed max-w-2xl select-none">
              Manage your MT5 account groups. Set deposit limits, leverage, and trading policies for each group.
            </p>
          </div>
        </header>

        {/* Cohesive Nav Tabs */}
        <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto no-scrollbar pb-px mb-2 select-none">
          {[
            { id: 'directory', label: 'Groups', Icon: Layers },
            { id: 'mappings', label: 'Account Mappings', Icon: Link },
          ].map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex h-11 items-center gap-2.5 border-b-2 px-4 transition-all duration-200 cursor-pointer whitespace-nowrap outline-none
                  ${active 
                    ? 'border-brand text-brand font-bold' 
                    : 'border-transparent text-text-muted/40 hover:text-text-muted hover:border-white/10'
                  }`}
              >
                <tab.Icon size={14} className={active ? 'text-brand' : 'text-text-muted/30 group-hover:text-text-muted/50'} />
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] font-heading">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab View components rendering */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-text-muted">Loading groups...</div>
          ) : activeTab === 'directory' ? (
            <GroupDirectoryTab
              groups={groups}
              onAddGroup={handleAddGroupClick}
              onEditGroup={handleEditGroupClick}
              onDeleteGroup={handleDeleteGroup}
            />
          ) : (
            <MT5MappingsTab
              groups={groups}
              onUpdateSuccess={triggerToast}
            />
          )}
        </div>
      </div>

      {/* Shared Drawer Component */}
      <GroupFormDrawer
        open={drawerOpen}
        mode={drawerMode}
        group={editingGroup}
        onSubmit={handleFormSubmit}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteModalOpen}
        title="Delete CRM Group"
        description={`Are you sure you want to delete the group "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Group'}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setGroupToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </PageShell>
  );
}

export default GroupWorkspacePage;
