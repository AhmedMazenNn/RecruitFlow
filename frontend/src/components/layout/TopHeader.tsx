import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusinessIcon,
  CalendarPlusIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  UserPlusIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { SearchInput } from '../ui/SearchInput';
import { Tooltip } from '../ui/Tooltip';
import { NotificationBell } from '../notifications/NotificationBell';
import { Logo } from '../brand/Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { useUi } from '../../contexts/UiContext';

export function TopHeader({ onOpenNav }: {onOpenNav: () => void;}) {
  const { theme, toggle } = useTheme();
  const { open } = useUi();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitSearch = (value: string) => {
    setQuery(value);
    if (value.length > 1) navigate(`/candidates?q=${encodeURIComponent(value)}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface/85 px-3 backdrop-blur-md lg:px-5">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink lg:hidden">
        
        <MenuIcon className="h-[18px] w-[18px]" />
      </button>

      <Logo size="sm" className="lg:hidden" />

      <div className="hidden min-w-0 flex-1 lg:block">
        <SearchInput
          id="global-search"
          label="Search candidates, jobs and interviews"
          placeholder="Search candidates, jobs, interviews…"
          value={query}
          onChange={submitSearch}
          shortcut="⌘K"
          className="max-w-md" />
        
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'} side="bottom">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
            
            {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
          </button>
        </Tooltip>

        <NotificationBell />

        <Dropdown
          width="w-56"
          items={[
          {
            id: 'candidate',
            label: 'Add candidate',
            icon: <UserPlusIcon className="h-4 w-4 text-ink-subtle" />,
            onSelect: () => open('add-candidate')
          },
          {
            id: 'job',
            label: 'Create job',
            icon: <BriefcaseBusinessIcon className="h-4 w-4 text-ink-subtle" />,
            onSelect: () => open('create-job')
          },
          {
            id: 'interview',
            label: 'Schedule interview',
            icon: <CalendarPlusIcon className="h-4 w-4 text-ink-subtle" />,
            onSelect: () => open('schedule-interview')
          }]
          }
          trigger={({ toggle: t, open: isOpen }) =>
          <Button
            variant="primary"
            size="md"
            onClick={t}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            iconLeft={<PlusIcon className="h-4 w-4" />}>
            
              <span className="hidden sm:inline">Create</span>
            </Button>
          } />
        
      </div>
    </header>);

}