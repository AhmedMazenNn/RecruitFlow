import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BellIcon,
  BuildingIcon,
  CreditCardIcon,
  KanbanSquareIcon,
  PlugIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  UsersIcon,
  UserCogIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { AccountPanel } from '../components/settings/AccountPanel';
import { OrganizationProfile } from '../components/settings/OrganizationProfile';
import { TeamMembers } from '../components/settings/TeamMembers';
import { RolesPermissions } from '../components/settings/RolesPermissions';
import { PipelineConfig } from '../components/settings/PipelineConfig';
import { NotificationPreferences } from '../components/settings/NotificationPreferences';
import { IntegrationsPanel } from '../components/settings/IntegrationsPanel';
import { SecurityPanel } from '../components/settings/SecurityPanel';
import { BillingPanel } from '../components/settings/BillingPanel';
import { cn } from '../utils/cn';

const sections = [
{ id: 'account', label: 'My profile', icon: UserRoundIcon },
{ id: 'organization', label: 'Organization', icon: BuildingIcon },
{ id: 'team', label: 'Team members', icon: UsersIcon },
{ id: 'roles', label: 'Roles & permissions', icon: UserCogIcon },
{ id: 'pipeline', label: 'Pipeline', icon: KanbanSquareIcon },
{ id: 'notifications', label: 'Notifications', icon: BellIcon },
{ id: 'integrations', label: 'Integrations', icon: PlugIcon },
{ id: 'security', label: 'Security', icon: ShieldCheckIcon },
{ id: 'billing', label: 'Billing', icon: CreditCardIcon }];


export function Settings() {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState(() => searchParams.get('tab') ?? 'organization');

  return (
    <div className="pb-10">
      <PageHeader
        title="Settings"
        description="Northwind Labs · Scale plan · 6 seats in use" />
      

      <div className="flex flex-col gap-5 px-4 pt-5 lg:flex-row lg:px-7">
        <nav aria-label="Settings sections" className="lg:w-56 lg:shrink-0">
          <ul className="rf-scroll flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(s.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2.5 whitespace-nowrap rounded-md px-2.5 py-2 text-base font-medium',
                      'transition-colors duration-150 ease-out',
                      isActive ?
                      'bg-surface text-ink shadow-xs lg:border lg:border-border' :
                      'text-ink-muted hover:bg-surface/70 hover:text-ink'
                    )}>
                    
                    <Icon
                      className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand' : 'text-ink-subtle')}
                      aria-hidden />
                    
                    {s.label}
                  </button>
                </li>);

            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          {active === 'account' && <AccountPanel />}
          {active === 'organization' && <OrganizationProfile />}
          {active === 'team' && <TeamMembers />}
          {active === 'roles' && <RolesPermissions />}
          {active === 'pipeline' && <PipelineConfig />}
          {active === 'notifications' && <NotificationPreferences />}
          {active === 'integrations' && <IntegrationsPanel />}
          {active === 'security' && <SecurityPanel />}
          {active === 'billing' && <BillingPanel />}
        </div>
      </div>
    </div>);

}