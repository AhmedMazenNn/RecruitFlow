import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, MoonIcon, SunIcon, UserIcon, KeyboardIcon, SettingsIcon } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const AVATAR_COLORS = ['#4F46E5', '#8B5CF6', '#16A160', '#CA8A04', '#0E84C8', '#DB3747'];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatRole(role: string) {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function UserMenu() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const color = user.avatar_url ? undefined : AVATAR_COLORS[hashString(user.email) % AVATAR_COLORS.length];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Dropdown
      align="left"
      width="w-60"
      header={
        <div className="border-b border-border px-2.5 pb-2 pt-1.5">
          <p className="text-sm font-semibold text-ink">{fullName}</p>
          <p className="truncate text-xs text-ink-subtle">{user.email}</p>
        </div>
      }
      items={[
        {
          id: 'profile',
          label: 'My profile',
          icon: <UserIcon className="h-4 w-4 text-ink-subtle" />,
          onSelect: () => navigate('/settings?tab=account'),
        },
        {
          id: 'theme',
          label: theme === 'light' ? 'Dark theme' : 'Light theme',
          icon: theme === 'light'
            ? <MoonIcon className="h-4 w-4 text-ink-subtle" />
            : <SunIcon className="h-4 w-4 text-ink-subtle" />,
          onSelect: toggle,
        },
        {
          id: 'shortcuts',
          label: 'Keyboard shortcuts',
          icon: <KeyboardIcon className="h-4 w-4 text-ink-subtle" />,
        },
        {
          id: 'settings',
          label: 'Workspace settings',
          icon: <SettingsIcon className="h-4 w-4 text-ink-subtle" />,
          onSelect: () => navigate('/settings'),
        },
        {
          id: 'signout',
          label: signingOut ? 'Signing out…' : 'Sign out',
          icon: <LogOutIcon className="h-4 w-4" />,
          danger: true,
          disabled: signingOut,
          onSelect: handleSignOut,
        },
      ]}
      trigger={({ toggle: open, open: isOpen }) =>
        <button
          type="button"
          onClick={open}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md border border-transparent px-1.5 py-1.5 text-left',
            'transition-colors duration-150 ease-out hover:border-border hover:bg-surface',
            isOpen && 'border-border bg-surface'
          )}>
          <Avatar name={fullName} color={color} src={user.avatar_url || undefined} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{fullName}</span>
            <span className="block truncate text-2xs text-ink-subtle">{formatRole(user.role)}</span>
          </span>
        </button>
      } />
  );
}