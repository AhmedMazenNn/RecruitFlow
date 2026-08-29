import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
        <BellIcon className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 z-40 mt-2 flex w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-elevated shadow-pop">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-base font-semibold text-ink">Notifications</h2>
          </div>
          <p className="px-4 py-10 text-center text-sm text-ink-muted">No notifications yet</p>
        </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}
