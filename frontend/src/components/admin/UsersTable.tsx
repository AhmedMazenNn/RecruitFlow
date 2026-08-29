import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../services/api';
import { Avatar } from '../ui/Avatar';
import { Badge, type Tone } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Pagination } from '../ui/Pagination';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Alert } from '../ui/Alert';
import { SkeletonRows } from '../ui/Skeleton';
import { formatDate } from '../../utils/format';

type AdminRole = 'admin' | 'recruiter';

interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: AdminRole;
  avatar_url: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUser[];
}

const PAGE_SIZE = 20;

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'recruiter', label: 'Recruiter' },
];

const roleTones: Record<AdminRole, Tone> = {
  admin: 'brand',
  recruiter: 'info',
};

function roleLabel(role: AdminRole): string {
  return roleOptions.find((o) => o.value === role)?.label ?? role;
}

export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [pendingToggle, setPendingToggle] = useState<AdminUser | null>(null);

  const fetchPage = useCallback(async (target: number) => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get<UsersResponse>('/auth/users/', {
        params: { page: target },
      });
      setUsers(data.results);
      setCount(data.count);
      setPage(target);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPage(1);
  }, [fetchPage]);

  const refetch = useCallback(() => fetchPage(page), [fetchPage, page]);

  const changeRole = async (user: AdminUser, role: AdminRole) => {
    if (role === user.role) return;
    setBusyId(user.id);
    try {
      await api.patch(`/auth/users/${user.id}/role/`, { role });
      toast.success('Role updated', {
        description: `${user.email} is now a ${roleLabel(role)}`,
      });
      await refetch();
    } catch {
      toast.error('Could not update role', {
        description: 'Please check your permissions and try again.',
      });
      await refetch();
    } finally {
      setBusyId(null);
    }
  };

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    const user = pendingToggle;
    setPendingToggle(null);
    setBusyId(user.id);
    const activating = !user.is_active;
    try {
      await api.patch(`/auth/users/${user.id}/toggle_active/`);
      toast.success(activating ? 'User activated' : 'User deactivated', {
        description: user.email,
      });
      await refetch();
    } catch {
      toast.error('Could not update user status', {
        description: 'Please check your permissions and try again.',
      });
      await refetch();
    } finally {
      setBusyId(null);
    }
  };

  const pageCount = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {loading && (
        <SkeletonRows rows={6} />
      )}

      {!loading && error && (
        <div className="p-5">
          <Alert
            tone="danger"
            title="Could not load users"
            action={
              <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                Retry
              </Button>
            }
          >
            Make sure you are signed in as an admin and try again.
          </Alert>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead>
                <tr className="bg-subtle/60 text-2xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                  <th scope="col" className="px-4 py-3">User</th>
                  <th scope="col" className="px-4 py-3">Role</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors duration-150 ease-out hover:bg-subtle/40">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <Avatar
                          name={`${user.first_name} ${user.last_name}`}
                          src={user.avatar_url || undefined}
                          size="sm"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="block truncate text-xs text-ink-muted">{user.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={roleTones[user.role]}>{roleLabel(user.role)}</Badge>
                      {user.is_superuser && (
                        <span className="ml-1.5 align-middle text-xs text-ink-subtle">superuser</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={user.is_active ? 'success' : 'neutral'} dot>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center justify-end gap-2">
                        <Select
                          aria-label={`Change role for ${user.email}`}
                          size="sm"
                          className="w-40"
                          options={roleOptions}
                          value={user.role}
                          disabled={busyId === user.id}
                          onChange={(event) =>
                            void changeRole(user, event.target.value as AdminRole)
                          }
                        />
                        <Button
                          variant={user.is_active ? 'danger' : 'secondary'}
                          size="sm"
                          disabled={busyId === user.id}
                          onClick={() => setPendingToggle(user)}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {count > PAGE_SIZE && (
            <Pagination
              page={page}
              pageCount={pageCount}
              total={count}
              pageSize={PAGE_SIZE}
              onPage={(p) => void fetchPage(p)}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingToggle !== null}
        title={pendingToggle?.is_active ? 'Deactivate user?' : 'Activate user?'}
        description={
          pendingToggle
            ? `${pendingToggle.first_name} ${pendingToggle.last_name} (${pendingToggle.email}) will ${
                pendingToggle.is_active ? 'no longer be able to sign in' : 'be able to sign in again'
              }.`
            : ''
        }
        confirmLabel={pendingToggle?.is_active ? 'Deactivate' : 'Activate'}
        tone={pendingToggle?.is_active ? 'danger' : 'primary'}
        onConfirm={() => void confirmToggle()}
        onCancel={() => setPendingToggle(null)}
      />
    </div>
  );
}