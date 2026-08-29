import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: 'right' | 'left';
  width?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  width = 'max-w-md',
  footer,
  children
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50">
          <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgb(var(--rf-navy) / 0.38)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ x: side === 'right' ? '100%' : '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: side === 'right' ? '100%' : '-100%' }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'absolute inset-y-0 flex w-full flex-col border-border bg-surface shadow-pop',
            side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
            width
          )}>
          
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-md font-semibold text-ink">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="-mr-1 rounded-md p-1.5 text-ink-subtle transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="rf-scroll flex-1 overflow-y-auto">{children}</div>
            {footer &&
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3.5">{footer}</div>
          }
          </motion.aside>
        </div>
      }
    </AnimatePresence>);

}