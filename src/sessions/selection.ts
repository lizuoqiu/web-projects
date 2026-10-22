import { dateKeys, vancouverDate } from './booking.ts';

export type BookingStep = 'select' | 'details' | 'success';
export type BookingSelection = { date: string; start: string; step: BookingStep };

export function refreshSelection(selection: BookingSelection, now: Date): BookingSelection {
  const dates = dateKeys(now);
  if (!dates.includes(selection.date)) {
    return { date: dates[0], start: '', step: selection.step === 'details' ? 'select' : selection.step };
  }
  if (selection.step === 'details') {
    const start = new Date(selection.start);
    if (!Number.isFinite(start.getTime()) || vancouverDate(start) !== selection.date) {
      return { ...selection, start: '', step: 'select' };
    }
  }
  return selection;
}
