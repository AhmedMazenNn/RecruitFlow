import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TooltipProps {
  label: string;
  side?: 'top' | 'bottom' | 'right';
  children: React.ReactElement;
  className?: string;
}

export function Tooltip({ label, side = 'top', children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const pos =
  side === 'top' ?
  'bottom-full left-1/2 -translate-x-1/2 mb-1.5' :
  side === 'bottom' ?
  'top-full left-1/2 -translate-x-1/2 mt-1.5' :
  'left-full top-1/2 -translate-y-1/2 ml-2';

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}>
      
      {children}
      <AnimatePresence>
        {open &&
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, y: side === 'bottom' ? -3 : 3, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-2xs font-medium text-ink-invert shadow-md',
            pos
          )}
          style={{ backgroundColor: 'rgb(var(--rf-text))' }}>
          
            {label}
          </motion.span>
        }
      </AnimatePresence>
    </span>);

}