import test from 'node:test';
import assert from 'node:assert/strict';
import { availableSlots, cancelBooking, createBooking, dateKeys, rescheduleBooking, slotStart, vancouverDate, type Booking } from '../src/sessions/booking.ts';
import { refreshSelection, type BookingSelection } from '../src/sessions/selection.ts';

const now = new Date('2026-10-21T15:00:00Z');
const first = slotStart('2026-10-21', '09:00');
const second = slotStart('2026-10-21', '09:30');
const reserve = (records: Booking[] = [], id = 'one', start = first) => createBooking(records, { id, name: '  Alex Kim  ', notes: 'A portfolio review', start }, now);

test('creation reserves one slot and rejects an active conflict', () => {
  const records = reserve();
  assert.equal(records[0].name, 'Alex Kim');
  assert.equal(records[0].status, 'confirmed');
  assert.equal(availableSlots('2026-10-21', records, now).some(s => s.start === first), false);
  assert.throws(() => reserve(records, 'two'), /no longer available/);
  assert.equal(records.length, 1);
});

test('cancellation releases the slot while preserving its history', () => {
  const records = cancelBooking(reserve(), 'one', now);
  assert.equal(records[0].status, 'cancelled');
  assert.equal(availableSlots('2026-10-21', records, now).some(s => s.start === first), true);
  assert.equal(reserve(records, 'two').length, 2);
});

test('reschedule releases original time and reserves new time atomically', () => {
  const records = rescheduleBooking(reserve(), 'one', second, now);
  const free = availableSlots('2026-10-21', records, now).map(s => s.start);
  assert.ok(free.includes(first));
  assert.ok(!free.includes(second));
  assert.equal(records[0].id, 'one');
  assert.equal(records[0].notes, 'A portfolio review');
});

test('a failed move cannot free the existing booking; cancelled records cannot move', () => {
  const records = reserve(reserve(), 'two', second);
  assert.throws(() => rescheduleBooking(records, 'one', second, now), /no longer available/);
  assert.equal(records[0].start, first);
  const cancelled = cancelBooking(records, 'one', now);
  assert.throws(() => rescheduleBooking(cancelled, 'one', first, now), /cancelled/);
});

test('window uses Vancouver calendar dates, not UTC or the computer timezone', () => {
  const evening = new Date('2026-10-22T02:00:00Z');
  assert.equal(vancouverDate(evening), '2026-10-21');
  assert.equal(dateKeys(evening).length, 14);
  assert.equal(dateKeys(evening)[13], '2026-11-03');
  assert.equal(availableSlots('2026-10-21', [], evening).length, 0);
  assert.equal(availableSlots('2026-11-04', [], evening).length, 0);
  assert.throws(() => reserve([], 'late', slotStart('2026-11-04', '09:00')), /no longer available/);
});

test('Vancouver 9 AM stays at local 9 AM across historical DST and timezone-data revisions', () => {
  const localTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  // B.C. stopped changing clocks in 2026; older runtimes still predict a November rollback.
  // https://news.gov.bc.ca/releases/2026AG0013-000209
  for (const date of ['2025-10-31', '2025-11-03', '2026-03-06', '2026-03-09', '2026-10-30', '2026-11-02']) {
    const parts = Object.fromEntries(localTime.formatToParts(new Date(slotStart(date, '09:00'))).map(part => [part.type, part.value]));
    assert.equal(`${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`, `${date} 09:00:00`);
  }
  // Stable historical offsets ensure a fixed-offset conversion cannot satisfy this test.
  assert.equal(slotStart('2025-10-31', '09:00'), '2025-10-31T16:00:00.000Z');
  assert.equal(slotStart('2025-11-03', '09:00'), '2025-11-03T17:00:00.000Z');
});

test('an overnight details draft returns to date selection without rendering an empty time', () => {
  const draft: BookingSelection = { date: '2026-10-21', start: first, step: 'details' };
  const beforeMidnight = new Date('2026-10-22T06:59:59Z');
  const afterMidnight = new Date('2026-10-22T07:00:00Z');
  assert.deepEqual(refreshSelection(draft, beforeMidnight), draft);
  assert.deepEqual(refreshSelection(draft, afterMidnight), { date: '2026-10-22', start: '', step: 'select' });
  const tomorrow: BookingSelection = { date: '2026-10-22', start: slotStart('2026-10-22', '09:00'), step: 'details' };
  assert.deepEqual(refreshSelection(tomorrow, afterMidnight), tomorrow);
  assert.equal(refreshSelection({ ...tomorrow, start: '' }, afterMidnight).step, 'select');
  assert.equal(refreshSelection({ ...draft, step: 'success' }, afterMidnight).step, 'success');
});

test('validation rejects weekends, elapsed times, invalid dates and empty names', () => {
  assert.equal(availableSlots('2026-10-24', [], now).length, 0);
  assert.throws(() => createBooking([], { id: 'one', name: ' ', start: first }, now), /name/);
  assert.throws(() => createBooking([], { id: 'one', name: 'Alex', start: first }, new Date(first)), /no longer available/);
  assert.throws(() => slotStart('2026-02-30', '09:00'), /date/);
});
