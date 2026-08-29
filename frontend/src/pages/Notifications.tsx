import React, { useMemo, useState } from 'react';
import { BellOffIcon, CheckCheckIcon, SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { NotificationList } from '../components/notifications/NotificationList';
import { notifications as seed } from '../data/activity';
import type { Notification } from '../types/recruiting';

const tabs = [
{ id: 'all', label: 'All' },
{ id: 'unread', label: 'Unread' },
{ id: 'mentions', label: 'Mentions' }];


export function Notifications() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (tab === 'unread') return items.filter((n) => !n.read);
    if (tab === 'mentions') return items.filter((n) => n.kind === 'mention');
    return items;
  }, [items, tab]);

  const tabsWithCounts = tabs.map((t) => ({
    ...t,
    count:
    t.id === 'all' ?
    items.length :
    t.id === 'unread' ?
    items.filter((n) => !n.read).length :
    items.filter((n) => n.kind === 'mention').length
  }));

  return (
    <div className="pb-10">
      <PageHeader
        title="Notifications"
        description="Everything that happened while you were away, newest first."
        actions={
        <>
            <Link to="/settings">
              <Button variant="secondary" iconLeft={<SettingsIcon className="h-4 w-4" />}>
                Preferences
              </Button>
            </Link>
            <Button
            variant="primary"
            iconLeft={<CheckCheckIcon className="h-4 w-4" />}
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}>
            
              Mark all read
            </Button>
          </>
        } />
      

      <div className="mx-auto max-w-3xl px-4 pt-5 lg:px-7">
        <Panel>
          <div className="px-4 pt-3 lg:px-5">
            <Tabs tabs={tabsWithCounts} active={tab} onChange={setTab} ariaLabel="Filter notifications" />
          </div>
          {filtered.length === 0 ?
          <EmptyState
            icon={<BellOffIcon className="h-5 w-5" />}
            title={tab === 'unread' ? 'You are all caught up' : 'Nothing here yet'}
            description={
            tab === 'unread' ?
            'Every notification has been read. New activity will appear here as your team works.' :
            'Mentions from your team will show up here when someone tags you in a note.'
            } /> :


          <NotificationList
            items={filtered}
            onToggleRead={(id) =>
            setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n))
            } />

          }
        </Panel>
      </div>
    </div>);

}