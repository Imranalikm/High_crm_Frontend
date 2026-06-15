import React from 'react';
import { Card } from '@/components/ui/Card';
import { useAdminSession } from '@/app/providers/AdminSessionProvider';
import { hasPermission } from '@/shared/config/permissions/permissions';

export function PermissionGuard({ permission, children }) {
  const { permissions } = useAdminSession();

  if (!hasPermission(permissions, permission)) {
    return (
      <div className="pt-2">
        <Card title="Access Restricted" subtitle="Permission required">
          <p className="text-[14px] leading-6 text-text-muted">
            Your current admin role does not include permission to open this workspace.
          </p>
        </Card>
      </div>
    );
  }

  return children;
}
