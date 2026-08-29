import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseBusinessIcon, CalendarDaysIcon, UsersIcon } from 'lucide-react';
import { Logo, LogoMark } from '../brand/Logo';
import { cn } from '../../utils/cn';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

interface BrandFeature {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const BRAND_FEATURES: BrandFeature[] = [
  {
    icon: <BriefcaseBusinessIcon className="h-4 w-4" aria-hidden />,
    title: 'Jobs',
    text: 'Define roles, requirements and hiring managers in one place.',
  },
  {
    icon: <UsersIcon className="h-4 w-4" aria-hidden />,
    title: 'Candidates',
    text: 'Track every application and candidate across your pipeline.',
  },
  {
    icon: <CalendarDaysIcon className="h-4 w-4" aria-hidden />,
    title: 'Interviews',
    text: 'Schedule, gather feedback and decide with context.',
  },
];

const ease = [0.23, 1, 0.32, 1] as const;

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-canvas">
      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-4 py-10 sm:px-6 lg:w-1/2 lg:flex-none lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Logo showPlan />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.06 }}
            className="mt-10"
          >
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-1.5 text-base text-ink-muted">{subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.12 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Brand panel */}
      <div className="relative hidden w-0 flex-1 overflow-hidden bg-[rgb(var(--rf-navy))] lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, rgb(var(--rf-brand) / 0.28), transparent 60%), radial-gradient(ellipse 70% 60% at 20% 90%, rgb(var(--rf-brand) / 0.16), transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(var(--rf-canvas)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rf-canvas)) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.15 }}
            className="w-full max-w-md"
          >
            <LogoMark monochrome className="mx-auto h-12 w-12" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-[rgb(var(--rf-brand-fg))]">
              Build your dream team
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-white/70">
              One workspace for jobs, candidates, pipelines and interviews — so your team
              can move faster and hire better.
            </p>

            <ul className="mt-10 space-y-4 text-left">
              {BRAND_FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-md">
                  <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[rgb(var(--rf-brand))]')}>
                    {f.icon}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-white">{f.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-white/60">{f.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <p className="absolute bottom-8 text-xs text-white/40">
            Recruitment management for growing teams
          </p>
        </div>
      </div>
    </div>
  );
}