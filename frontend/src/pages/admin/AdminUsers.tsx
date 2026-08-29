import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { UsersTable } from '../../components/admin/UsersTable';

export function AdminUsers() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Admin"
        description="Manage workspace users, roles and access"
      />

      <div className="px-4 pt-5 lg:px-7">
        <UsersTable />
      </div>
    </div>
  );
}