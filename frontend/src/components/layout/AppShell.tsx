import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { AddCandidateModal } from '../candidates/AddCandidateModal';
import { CreateJobModal } from '../jobs/CreateJobModal';
import { ScheduleInterviewModal } from '../interviews/ScheduleInterviewModal';
import { useUi } from '../../contexts/UiContext';

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false);
  const { sheet, close } = useUi();
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-full w-full bg-canvas">
      <aside className="hidden w-[248px] shrink-0 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {navOpen &&
        <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgb(var(--rf-navy) / 0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => setNavOpen(false)} />
          
            <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-y-0 left-0 w-[272px]"
            role="dialog"
            aria-label="Navigation">
            
              <Sidebar onNavigate={() => setNavOpen(false)} />
            </motion.div>
          </div>
        }
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onOpenNav={() => setNavOpen(true)} />
        <main className="rf-scroll min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <MobileNav />
      </div>

      <AddCandidateModal open={sheet === 'add-candidate'} onClose={close} />
      <CreateJobModal open={sheet === 'create-job'} onClose={close} />
      <ScheduleInterviewModal open={sheet === 'schedule-interview'} onClose={close} />
    </div>);

}