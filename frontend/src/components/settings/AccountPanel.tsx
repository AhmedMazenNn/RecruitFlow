import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Field, Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../contexts/AuthContext';
import api from '../../services/api';

function fieldError(error: unknown, field: string): string | undefined {
  if (error && typeof error === 'object' && 'response' in error) {
    const data = (error as { response?: { data?: unknown } }).response?.data;
    if (data && typeof data === 'object') {
      const value = (data as Record<string, unknown>)[field];
      if (Array.isArray(value)) return String(value[0]);
      if (typeof value === 'string') return value;
    }
  }
  return undefined;
}

function formatRole(role: string) {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AccountPanel() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', new_password_confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!user) return null;

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data } = await api.patch<User>('/auth/users/me_partial/', {
        first_name: firstName,
        last_name: lastName,
      });
      updateUser(data);
      toast.success('Profile saved');
    } catch {
      toast.error('Could not save your profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    setSelectedFile(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const uploadAvatar = async () => {
    if (!selectedFile) return;
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', selectedFile);
    try {
      const { data } = await api.patch<User>('/auth/users/me_partial/', formData);
      updateUser(data);
      toast.success('Avatar updated');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      toast.error('Avatar upload failed. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const { data } = await api.patch<User>('/auth/users/me_partial/', { avatar: null });
      updateUser(data);
      toast.success('Avatar removed');
    } catch {
      toast.error('Could not remove your avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const changePassword = async () => {
    setPasswordErrors({});
    setChangingPassword(true);
    try {
      await api.post('/auth/users/change_password/', passwordForm);
      toast.success('Password changed');
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      const errors: Record<string, string> = {};
      const oldError = fieldError(error, 'old_password');
      const newError = fieldError(error, 'new_password');
      const generic = fieldError(error, 'non_field_errors');
      if (oldError) errors.old_password = oldError;
      if (newError) errors.new_password = newError;
      if (generic) errors.generic = generic;
      if (Object.keys(errors).length === 0) errors.generic = 'Could not change your password.';
      setPasswordErrors(errors);
    } finally {
      setChangingPassword(false);
    }
  };

  const avatarSrc = preview ?? (user.avatar_url || undefined);

  return (
    <div className="space-y-4">
      <Panel as="section">
        <PanelHeader
          title="Profile"
          description="How you appear across the workspace."
          as="h2"
          action={
            <Button variant="primary" size="sm" loading={savingProfile} onClick={saveProfile}>
              Save changes
            </Button>
          } />
        <div className="border-t border-border p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="account-first" required>
              <Input id="account-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Field>
            <Field label="Last name" htmlFor="account-last" required>
              <Input id="account-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel as="section">
        <PanelHeader
          title="Profile picture"
          description="Square images work best; we resize to 256×256."
          as="h2" />
        <div className="border-t border-border p-5">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={`${firstName} ${lastName}`} src={avatarSrc} size="xl" ring />
            <div className="flex flex-col items-start gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Choose avatar image"
                onChange={(e) => onPickFile(e.target.files?.[0])} />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                  {selectedFile ? 'Choose a different image' : 'Upload image'}
                </Button>
                {selectedFile &&
                  <Button variant="primary" size="sm" loading={uploadingAvatar} onClick={uploadAvatar}>
                    Save avatar
                  </Button>
                }
                {user.avatar_url && !selectedFile &&
                  <Button variant="ghost" size="sm" loading={uploadingAvatar} onClick={removeAvatar}>
                    Remove
                  </Button>
                }
              </div>
              {selectedFile &&
                <p className="text-xs text-ink-subtle">Preview shown — click “Save avatar” to persist.</p>
              }
            </div>
          </div>
        </div>
      </Panel>

      <Panel as="section">
        <PanelHeader
          title="Sign-in details"
          description="Your identity is tied to your email and role."
          as="h2" />
        <div className="border-t border-border p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="account-email">
              <Input id="account-email" value={user.email} disabled />
            </Field>
            <Field label="Role" htmlFor="account-role">
              <Input id="account-role" value={formatRole(user.role)} disabled />
            </Field>
          </div>
          <Alert
            tone="info"
            title="Managed by your organization"
            className="mt-4"
          >
            Your email and role are managed by your organization&apos;s admin and can&apos;t be changed here.
          </Alert>
        </div>
      </Panel>

      <Panel as="section">
        <PanelHeader
          title="Change password"
          description="Use at least 8 characters and avoid common passwords."
          as="h2"
          action={
            <Button variant="primary" size="sm" loading={changingPassword} onClick={changePassword}>
              Update password
            </Button>
          } />
        <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-2">
          {passwordErrors.generic &&
            <Alert tone="danger" title="Password not changed" className="sm:col-span-2">
              {passwordErrors.generic}
            </Alert>
          }
          <Field label="Current password" htmlFor="pwd-old" error={passwordErrors.old_password}>
            <Input
              id="pwd-old"
              type="password"
              autoComplete="current-password"
              invalid={Boolean(passwordErrors.old_password)}
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm((f) => ({ ...f, old_password: e.target.value }))} />
          </Field>
          <div className="hidden sm:block" />
          <Field label="New password" htmlFor="pwd-new" error={passwordErrors.new_password}>
            <Input
              id="pwd-new"
              type="password"
              autoComplete="new-password"
              invalid={Boolean(passwordErrors.new_password)}
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm((f) => ({ ...f, new_password: e.target.value }))} />
          </Field>
          <Field label="Confirm new password" htmlFor="pwd-confirm">
            <Input
              id="pwd-confirm"
              type="password"
              autoComplete="new-password"
              className={cn(passwordErrors.new_password && 'border-danger focus:border-danger focus:ring-danger/20')}
              value={passwordForm.new_password_confirm}
              onChange={(e) => setPasswordForm((f) => ({ ...f, new_password_confirm: e.target.value }))} />
          </Field>
        </div>
      </Panel>
    </div>
  );
}