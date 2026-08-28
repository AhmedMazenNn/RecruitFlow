import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, MoonIcon, SunIcon, UserIcon, KeyboardIcon, SettingsIcon } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { currentUser } from '../../data/activity';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

export function UserMenu() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <Dropdown
      align="left"
      width="w-60"
      header={
      <div className="border-b border-border px-2.5 pb-2 pt-1.5">
          <p className="text-sm font-semibold text-ink">{currentUser.name}</p>
          <p className="truncate text-xs text-ink-subtle">{currentUser.email}</p>
        </div>
      }
      items={[
      { id: 'profile', label: 'My profile', icon: <UserIcon className="h-4 w-4 text-ink-subtle" /> },
      {
        id: 'theme',
        label: theme === 'light' ? 'Dark theme' : 'Light theme',
        icon:
        theme === 'light' ?
        <MoonIcon className="h-4 w-4 text-ink-subtle" /> :

        <SunIcon className="h-4 w-4 text-ink-subtle" />,

        onSelect: toggle
      },
      { id: 'shortcuts', label: 'Keyboard shortcuts', icon: <KeyboardIcon className="h-4 w-4 text-ink-subtle" /> },
      {
        id: 'settings',
        label: 'Workspace settings',
        icon: <SettingsIcon className="h-4 w-4 text-ink-subtle" />,
        onSelect: () => navigate('/settings')
      },
      { id: 'signout', label: 'Sign out', icon: <LogOutIcon className="h-4 w-4" />, danger: true }]
      }
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
        
          <Avatar name={currentUser.name} color={currentUser.avatarColor} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{currentUser.name}</span>
            <span className="block truncate text-2xs text-ink-subtle">{currentUser.role}</span>
          </span>
        </button>
      } />);


}