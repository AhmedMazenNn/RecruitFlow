import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3Icon,
  BellIcon,
  BriefcaseBusinessIcon,
  ChevronRightIcon,
  KanbanSquareIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  SettingsIcon,
  UsersIcon,
  CalendarDaysIcon } from
'lucide-react';
import { Logo } from '../brand/Logo';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { UserMenu } from './UserMenu';
import { cn } from '../../utils/cn';
import { notifications } from '../../data/activity';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  end?: boolean;
}

const primary: NavItem[] = [
{ to: '/', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-4 w-4" />, end: true },
{ to: '/jobs', label: 'Jobs', icon: <BriefcaseBusinessIcon className="h-4 w-4" /> },
{ to: '/candidates', label: 'Candidates', icon: <UsersIcon className="h-4 w-4" /> },
{ to: '/pipeline', label: 'Pipeline', icon: <KanbanSquareIcon className="h-4 w-4" /> },
{ to: '/interviews', label: 'Interviews', icon: <CalendarDaysIcon className="h-4 w-4" /> },
{ to: '/analytics', label: 'Analytics', icon: <BarChart3Icon className="h-4 w-4" /> }];


export function Sidebar({ onNavigate }: {onNavigate?: () => void;}) {
  const unread = notifications.filter((n) => !n.read).length;

  const secondary: NavItem[] = [
  { to: '/notifications', label: 'Notifications', icon: <BellIcon className="h-4 w-4" />, badge: unread },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon className="h-4 w-4" /> }];


  const linkClass = ({ isActive }: {isActive: boolean;}) =>
  cn(
    'group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-base font-medium',
    'transition-colors duration-150 ease-out',
    isActive ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:bg-surface/70 hover:text-ink'
  );

  return (
    <div className="flex h-full flex-col border-r border-border bg-canvas">
      <div className="px-3.5 pb-2 pt-4">
        <Logo size="sm" className="px-1.5" />
      </div>
      <div className="px-2.5 pb-3 pt-2">
        <WorkspaceSwitcher />
      </div>

      <nav aria-label="Main navigation" className="rf-scroll flex-1 overflow-y-auto px-2.5 pb-4">
        <ul className="space-y-0.5">
          {primary.map((item) =>
          <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={linkClass} onClick={onNavigate}>
                {({ isActive }) =>
              <>
                    <span
                  className={cn(
                    'absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full transition-colors duration-150 ease-out',
                    isActive ? 'bg-brand' : 'bg-transparent'
                  )}
                  aria-hidden />
                
                    <span className={cn(isActive ? 'text-brand' : 'text-ink-subtle')} aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                  </>
              }
              </NavLink>
            </li>
          )}
        </ul>

        <p className="px-2.5 pb-1.5 pt-6 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {secondary.map((item) =>
          <li key={item.to}>
              <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                {({ isActive }) =>
              <>
                    <span className={cn(isActive ? 'text-brand' : 'text-ink-subtle')} aria-hidden>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge ?
                <span className="rounded bg-brand px-1.5 py-0.5 text-2xs font-semibold text-brand-fg">
                        {item.badge}
                        <span className="sr-only"> unread</span>
                      </span> :
                null}
                  </>
              }
              </NavLink>
            </li>
          )}
        </ul>

        <div className="mt-6 rounded-lg border border-border bg-surface p-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <LifeBuoyIcon className="h-3.5 w-3.5 text-brand" aria-hidden />
            Pipeline health
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            4 candidates have been in Technical for more than 10 days.
          </p>
          <NavLink
            to="/pipeline"
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors duration-150 ease-out hover:text-brand-hover">
            
            Review pipeline
            <ChevronRightIcon className="h-3 w-3" aria-hidden />
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-border p-2.5">
        <UserMenu />
      </div>
    </div>);

}