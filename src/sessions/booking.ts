export const TIME_ZONE = 'America/Vancouver';
export const DURATION = 30;
export const STORAGE_KEY = 'studio-session.bookings.v1';
export type Booking = { id: string; name: string; notes: string; start: string; status: 'confirmed' | 'cancelled'; createdAt: string; updatedAt: string };
export type Slot = { start: string; time: string };
export type BookingInput = { id: string; name: string; notes?: string; start: string };

const dateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
const timeParts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });

export function vancouverDate(date: Date): string {
  const parts = Object.fromEntries(dateFormatter.formatToParts(date).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function parseDate(key: string): Date {
  const date = new Date(`${key}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== key) throw new Error('Choose a valid date.');
  return date;
}

export function dateKeys(now = new Date(), count = 14): string[] {
  const start = parseDate(vancouverDate(now));
  return Array.from({ length: count }, (_, index) => {
    const next = new Date(start);
    next.setUTCDate(start.getUTCDate() + index);
    return next.toISOString().slice(0, 10);
  });
}

/** Convert a local wall time using the timezone's actual offset, including DST. */
export function slotStart(key: string, time: string): string {
  parseDate(key);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Choose a valid time.');
  const [year, month, day] = key.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute);
  let value = target;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(timeParts.formatToParts(new Date(value)).map(p => [p.type, p.value]));
    const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    value += target - wall;
  }
  return new Date(value).toISOString();
}

export function daySlots(key: string): Slot[] {
  const weekday = parseDate(key).getUTCDay();
  if (weekday === 0 || weekday === 6) return [];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  return times.map(time => ({ start: slotStart(key, time), time }));
}

export function availableSlots(key: string, bookings: Booking[], now = new Date(), ignoreId?: string): Slot[] {
  if (!dateKeys(now).includes(key)) return [];
  const occupied = new Set(bookings.filter(b => b.status === 'confirmed' && b.id !== ignoreId).map(b => b.start));
  return daySlots(key).filter(s => new Date(s.start).getTime() > now.getTime() && !occupied.has(s.start));
}

function assertAvailable(bookings: Booking[], start: string, now: Date, ignoreId?: string) {
  const parsed = new Date(start);
  if (Number.isNaN(parsed.getTime()) || !availableSlots(vancouverDate(parsed), bookings, now, ignoreId).some(s => s.start === start)) {
    throw new Error('That time is no longer available. Choose another slot.');
  }
}

export function createBooking(bookings: Booking[], input: BookingInput, now = new Date()): Booking[] {
  const name = input.name.trim();
  if (!name || name.length > 80) throw new Error('Enter a name of 1–80 characters.');
  const notes = (input.notes ?? '').trim();
  if (notes.length > 500) throw new Error('Keep your notes to 500 characters.');
  if (!input.id || bookings.some(b => b.id === input.id)) throw new Error('This session has already been saved.');
  assertAvailable(bookings, input.start, now);
  return [...bookings, { id: input.id, name, notes, start: input.start, status: 'confirmed', createdAt: now.toISOString(), updatedAt: now.toISOString() }];
}

export function rescheduleBooking(bookings: Booking[], id: string, start: string, now = new Date()): Booking[] {
  const booking = bookings.find(b => b.id === id);
  if (!booking) throw new Error('This session could not be found.');
  if (booking.status === 'cancelled') throw new Error('A cancelled session cannot be rescheduled.');
  assertAvailable(bookings, start, now, id);
  return bookings.map(b => b.id === id ? { ...b, start, updatedAt: now.toISOString() } : b);
}

export function cancelBooking(bookings: Booking[], id: string, now = new Date()): Booking[] {
  if (!bookings.some(b => b.id === id)) throw new Error('This session could not be found.');
  return bookings.map(b => b.id === id ? { ...b, status: 'cancelled', updatedAt: now.toISOString() } : b);
}

export function readBookings(value: string | null): Booking[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every(b => b && typeof b.id === 'string' && typeof b.name === 'string' && typeof b.notes === 'string' && typeof b.start === 'string' && !Number.isNaN(Date.parse(b.start)) && (b.status === 'confirmed' || b.status === 'cancelled'))) throw new Error('Saved sessions could not be loaded.');
  return parsed as Booking[];
}
