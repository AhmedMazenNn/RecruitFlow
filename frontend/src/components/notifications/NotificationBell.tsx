import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import { NotificationList } from './NotificationList';
import { notifications as seed } from '../../data/activity';
import type { Notification } from '../../types/recruiting';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(seed);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
        
        <BellIcon className="h-4 w-4" />
        {unread > 0 &&
        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-brand-fg ring-2 ring-surface">
            {unread}
          </span>
        }
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 z-40 mt-2 flex max-h-[70vh] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-elevated shadow-pop">
          
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-base font-semibold text-ink">Notifications</h2>
              <button
              type="button"
              onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
              className="text-xs font-semibold text-brand transition-colors duration-150 ease-out hover:text-brand-hover">
              
                Mark all read
              </button>
            </div>
            <div className="rf-scroll flex-1 overflow-y-auto">
              <NotificationList
              items={items.slice(0, 5)}
              compact
              onToggleRead={(id) =>
              setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n))
              } />
            
            </div>
            <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="border-t border-border px-4 py-2.5 text-center text-sm font-semibold text-brand transition-colors duration-150 ease-out hover:bg-subtle">
            
              View all notifications
            </Link>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}