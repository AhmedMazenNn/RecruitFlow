import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3Icon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  KanbanSquareIcon,
  LayoutDashboardIcon } from
'lucide-react';
import { cn } from '../../utils/cn';

const items = [
{ to: '/', label: 'Home', icon: LayoutDashboardIcon, end: true },
{ to: '/jobs', label: 'Jobs', icon: BriefcaseBusinessIcon },
{ to: '/pipeline', label: 'Pipeline', icon: KanbanSquareIcon },
{ to: '/interviews', label: 'Interviews', icon: CalendarDaysIcon },
{ to: '/analytics', label: 'Insights', icon: BarChart3Icon }];


export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-30 flex shrink-0 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      
      {items.map(({ to, label, icon: Icon, end }) =>
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center gap-1 py-2.5 text-2xs font-medium',
          'transition-colors duration-150 ease-out',
          isActive ? 'text-brand' : 'text-ink-subtle hover:text-ink'
        )
        }>
        
          {({ isActive }) =>
        <>
              <Icon className={cn('h-[18px] w-[18px]', isActive && 'stroke-[2.25]')} aria-hidden />
              {label}
            </>
        }
        </NavLink>
      )}
    </nav>);

}