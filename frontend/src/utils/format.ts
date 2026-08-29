import type { StageId } from '../types/recruiting';

const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };

export function formatSalary(min: number, max: number, currency: string): string {
  const symbol = currencySymbols[currency] ?? '';
  const k = (n: number) => `${Math.round(n / 1000)}k`;
  return `${symbol}${k(min)} – ${symbol}${k(max)} ${currency}`;
}

export function initials(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase() ?? '').
  join('');
}

export function daysSince(iso: string, today = new Date('2026-08-28')): number {
  const then = new Date(iso);
  return Math.max(0, Math.round((today.getTime() - then.getTime()) / 86400000));
}

export function ageLabel(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return 'Today';
  if (d === 1) return '1 day in pipeline';
  return `${d} days in pipeline`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function weekdayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });
}

export const stageTone: Record<StageId, 'neutral' | 'info' | 'brand' | 'accent' | 'warning' | 'success' | 'danger'> = {
  applied: 'neutral',
  screening: 'info',
  technical: 'brand',
  hr: 'accent',
  offer: 'warning',
  hired: 'success',
  rejected: 'danger'
};