import React from 'react';
import { hasPermission } from '@/components/rbac';
import { AlertCircle } from 'lucide-react';

/**
 * Component that conditionally renders children based on user permissions
 */
export default function RoleGuard({ user, permission, fallback = null, children }) {
  if (!hasPermission(user, permission)) {
    return fallback || (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/20 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Access Denied</h3>
          <p className="text-sm text-slate-500">
            You don't have permission to view this content. Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}