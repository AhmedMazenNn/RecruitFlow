import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

interface DropdownProps {
  trigger: (props: {open: boolean;toggle: () => void;}) => React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: string;
  header?: React.ReactNode;
}

export function Dropdown({ trigger, items, align = 'right', width = 'w-56', header }: DropdownProps) {
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
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      <AnimatePresence>
        {open &&
        <motion.div
          role="menu"
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'absolute z-40 mt-1.5 overflow-hidden rounded-lg border border-border bg-elevated p-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            width
          )}>
          
            {header}
            {items.map((item) =>
          <button
            key={item.id}
            role="menuitem"
            type="button"
            disabled={item.disabled}
            onClick={() => {
              item.onSelect?.();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-left text-base font-medium',
              'transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-45',
              item.danger ? 'text-danger-fg hover:bg-danger-soft' : 'text-ink hover:bg-subtle'
            )}>
            
                {item.icon}
                {item.label}
              </button>
          )}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}