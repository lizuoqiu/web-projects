import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { availableSlots, cancelBooking, createBooking, dateKeys, daySlots, DURATION, readBookings, rescheduleBooking, STORAGE_KEY, TIME_ZONE, vancouverDate } from './booking';
import type { Booking } from './booking';
import { refreshSelection } from './selection';
import './styles.css';

const dateFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, weekday: 'long', month: 'long', day: 'numeric' });
const monthFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' });
const clockFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', minute: '2-digit' });
const shortDate = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const dateAnchor = (key: string) => new Date(`${key}T12:00:00Z`);
const describeDate = (start: string) => dateFormat.format(new Date(start));
const describeTime = (start: string) => `${clockFormat.format(new Date(start))} – ${clockFormat.format(new Date(Date.parse(start) + DURATION * 60000))}`;
const friendlyError = (error: unknown) => error instanceof Error ? error.message : 'Your session could not be saved. Please try again.';

function Icon({ name, size = 18 }: { name: 'arrow' | 'back' | 'clock' | 'globe' | 'calendar' | 'check' | 'search' | 'close'; size?: number }) {
  const paths: Record<typeof name, ReactNode> = {
    arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
    back: <path d="M20 12H5m5-5-5 5 5 5" />,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    globe: <><circle cx="12" cy="12" r="8.5" /><ellipse cx="12" cy="12" rx="4" ry="8.5" /><path d="M4 9h16M4 15h16" /></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M8 3v4m8-4v4M4 10h16m-11 4h2m3 0h2m-7 3h2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function loadInitial(): { bookings: Booking[]; error: string } {
  try { return { bookings: readBookings(localStorage.getItem(STORAGE_KEY)), error: '' }; }
  catch { return { bookings: [], error: 'Saved sessions could not be loaded. Check that browser storage is available before saving.' }; }
}

export default function App() {
  const [initial] = useState(loadInitial);
  const [bookings, setBookings] = useState<Booking[]>(initial.bookings);
  const [error, setError] = useState(initial.error);
  const [now, setNow] = useState(() => new Date());
  const [view, setView] = useState<'book' | 'manage'>('book');
  const [step, setStep] = useState<'select' | 'details' | 'success'>('select');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => dateKeys().find(key => availableSlots(key, initial.bookings).length > 0) ?? dateKeys()[0]);
  const [selectedStart, setSelectedStart] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [wasRescheduled, setWasRescheduled] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('soonest');
  const [notice, setNotice] = useState('');
  const dates = dateKeys(now);
  const today = vancouverDate(now);
  const currentSelection = refreshSelection({ date: selectedDate, start: selectedStart, step }, now);
  const editing = bookings.find(b => b.id === editingId);
  const saved = bookings.find(b => b.id === savedId);
  const detail = bookings.find(b => b.id === detailId);
  const slots = daySlots(selectedDate);
  const available = new Set(availableSlots(selectedDate, bookings, now, editingId ?? undefined).map(s => s.start));
  const selectedAvailable = selectedStart && available.has(selectedStart);
  const firstDate = dateAnchor(dates[0]);
  const lastDate = dateAnchor(dates[dates.length - 1]);
  const monthLabel = firstDate.getUTCMonth() === lastDate.getUTCMonth()
    ? monthFormat.format(firstDate)
    : `${new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short' }).format(firstDate)} – ${monthFormat.format(lastDate)}`;
  const calendarBlanks = (firstDate.getUTCDay() + 6) % 7;
  const visibleBookings = useMemo(() => bookings.filter(b => (status === 'all' || b.status === status) && `${b.name} ${b.notes}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => sort === 'soonest' ? Date.parse(a.start) - Date.parse(b.start) : Date.parse(b.start) - Date.parse(a.start)), [bookings, search, status, sort]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try { setBookings(readBookings(event.newValue)); } catch { setError('Saved sessions could not be loaded.'); }
    };
    window.addEventListener('storage', sync);
    return () => { clearInterval(timer); window.removeEventListener('storage', sync); };
  }, []);

  useEffect(() => {
    const current = refreshSelection({ date: selectedDate, start: selectedStart, step }, now);
    if (current.date !== selectedDate) setSelectedDate(current.date);
    if (current.start !== selectedStart) setSelectedStart(current.start);
    if (current.step !== step) setStep(current.step);
  }, [selectedDate, selectedStart, step, now]);

  function persist(next: Booking[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setBookings(next);
    setError('');
  }
  // Re-read immediately before a write so another open tab cannot silently overwrite a booking.
  function currentBookings() { return readBookings(localStorage.getItem(STORAGE_KEY)); }

  function beginBooking() {
    setView('book'); setStep('select'); setEditingId(null); setSelectedStart(''); setName(''); setNotes(''); setError(''); setNotice('');
    setSelectedDate(dateKeys().find(key => availableSlots(key, bookings).length > 0) ?? dateKeys()[0]);
    setNow(new Date());
  }
  function openManagement() { setView('manage'); setEditingId(null); setConfirmCancel(false); setError(''); }
  function chooseDate(key: string) { setSelectedDate(key); setSelectedStart(''); setError(''); }
  function saveSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const id = crypto.randomUUID();
      persist(createBooking(currentBookings(), { id, name, notes, start: selectedStart }));
      setSavedId(id); setWasRescheduled(false); setStep('success'); setNow(new Date());
    } catch (caught) { setError(friendlyError(caught)); setNow(new Date()); try { setBookings(currentBookings()); } catch { /* Keep the visible session when storage cannot be read. */ } }
  }
  function beginReschedule(booking: Booking) {
    const currentNow = new Date();
    const originalDate = vancouverDate(new Date(booking.start));
    const stillAvailable = availableSlots(originalDate, bookings, currentNow, booking.id).some(s => s.start === booking.start);
    setEditingId(booking.id); setView('book'); setStep('select'); setNow(currentNow); setError(''); setNotice('');
    setSelectedDate(stillAvailable ? originalDate : dateKeys(currentNow).find(key => availableSlots(key, bookings, currentNow, booking.id).length > 0) ?? dateKeys(currentNow)[0]);
    setSelectedStart(stillAvailable ? booking.start : '');
  }
  function saveNewTime() {
    if (!editingId) return;
    try {
      persist(rescheduleBooking(currentBookings(), editingId, selectedStart));
      setSavedId(editingId); setWasRescheduled(true); setStep('success'); setEditingId(null); setNow(new Date());
    } catch (caught) { setError(friendlyError(caught)); setNow(new Date()); try { setBookings(currentBookings()); } catch { /* Preserve the visible session. */ } }
  }
  function cancelSession() {
    if (!detailId) return;
    try {
      persist(cancelBooking(currentBookings(), detailId)); setConfirmCancel(false); setNotice('Session cancelled. Its time is available again.');
    } catch (caught) { setError(friendlyError(caught)); }
  }

  const serviceSummary = <>
    <div className="ss-avatar" aria-hidden="true">S<span>↗</span></div>
    <p className="ss-eyebrow">STUDIO SESSION</p>
    <h2>Project clarity</h2>
    <p className="ss-service-description">A focused conversation to turn your next idea into a clear next step.</p>
    <ul className="ss-facts">
      <li><Icon name="clock" />30 minutes</li>
      <li><Icon name="calendar" />Monday – Friday</li>
      <li><Icon name="globe" /><span>America/Vancouver<span className="ss-subtext">All times shown in this timezone</span></span></li>
    </ul>
    <div className="ss-service-note"><span className="ss-dot" />A little space to think, together.</div>
  </>;

  return <div className="ss-app">
    <header className="ss-header">
      <a className="ss-brand" href={import.meta.env.BASE_URL}><span className="ss-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>studio<span className="ss-brand-light">session</span></a>
      <nav aria-label="Main navigation"><button className={view === 'book' ? 'ss-nav-active' : ''} aria-pressed={view === 'book'} onClick={beginBooking}>Book a session</button><button className={view === 'manage' ? 'ss-nav-active' : ''} aria-pressed={view === 'manage'} onClick={openManagement}>My sessions</button></nav>
      <a className="ss-project-link" href={import.meta.env.BASE_URL}>All projects <span aria-hidden="true">↗</span></a>
    </header>
    <main className="ss-main">
      {view === 'book' && currentSelection.step === 'select' && <>
        <div className="ss-page-intro"><p className="ss-eyebrow">MAKE ROOM FOR WHAT'S NEXT</p><h1>{editing ? 'A new time, same intention.' : 'Good things start with a conversation.'}</h1><p>{editing ? `Choose a new time for ${editing.name}’s session. Your current time stays reserved until you save.` : 'Choose a time that works for you. We’ll take it from there.'}</p></div>
        <section className="ss-booking-card" aria-label={editing ? 'Reschedule session' : 'Choose a session'}>
          <aside className="ss-service">{serviceSummary}</aside>
          <div className="ss-calendar">
            <div className="ss-calendar-heading"><h2>{monthLabel}</h2><span>Next 14 days</span></div>
            <p className="ss-date-range">{shortDate.format(firstDate)} – {shortDate.format(lastDate)}</p>
            <div className="ss-calendar-grid" role="group" aria-label="Choose a date">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={`weekday-${i}`} className="ss-weekday" aria-hidden="true">{d}</span>)}
              {Array.from({ length: calendarBlanks }, (_, i) => <span key={`blank-${i}`} />)}
              {dates.map(key => {
                const count = availableSlots(key, bookings, now, editingId ?? undefined).length;
                return <button key={key} className={`ss-day ${key === selectedDate ? 'ss-selected' : ''} ${key === today ? 'ss-today' : ''}`} disabled={!count} aria-pressed={key === selectedDate} aria-label={`${dateFormat.format(dateAnchor(key))}, ${count ? `${count} times available` : 'no availability'}`} onClick={() => chooseDate(key)}>{Number(key.slice(-2))}{key === today && <span className="ss-today-dot" />}</button>;
              })}
            </div>
            <div className="ss-calendar-caption"><span className="ss-calendar-key" />Available weekdays<span className="ss-caption-dot">·</span>30-minute sessions</div>
            {editing && <div className="ss-current-session"><span>Current session</span><strong>{describeDate(editing.start)}</strong><p>{describeTime(editing.start)}</p></div>}
          </div>
          <div className="ss-slots">
            <div className="ss-slots-heading"><h2>{new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' }).format(dateAnchor(selectedDate))}</h2><span>Pacific time</span></div>
            <div className="ss-slot-grid" role="group" aria-label="Choose a time">
              {slots.map(slot => <button key={slot.start} disabled={!available.has(slot.start)} aria-pressed={selectedStart === slot.start} aria-label={`${clockFormat.format(new Date(slot.start))}${available.has(slot.start) ? '' : ', unavailable'}`} className={`ss-slot ${selectedStart === slot.start && available.has(slot.start) ? 'ss-selected' : ''}`} onClick={() => { setSelectedStart(slot.start); setError(''); }}>{clockFormat.format(new Date(slot.start)).replace(' AM', ' am').replace(' PM', ' pm')}</button>)}
            </div>
            {!available.size && <div className="ss-small-empty"><Icon name="calendar" size={26} /><p>No times left for this day.</p><span>Choose another available date.</span></div>}
          </div>
          <div className="ss-booking-bottom"><div className="ss-selection-summary">{selectedAvailable ? <><Icon name="check" /><span>{shortDate.format(dateAnchor(selectedDate))}<b>·</b>{describeTime(selectedStart)}</span></> : <><Icon name="calendar" /><span>Select a date and time to continue</span></>}</div><div className="ss-bottom-actions">{editing && <button className="ss-button ss-button-quiet" onClick={openManagement}>Keep current time</button>}<button className="ss-button ss-button-primary" disabled={!selectedAvailable || (!!editing && editing.start === selectedStart)} onClick={editing ? saveNewTime : () => { setStep('details'); setError(''); }}>{editing ? 'Save new time' : 'Continue'}<Icon name="arrow" /></button></div></div>
        </section>
        <p className="ss-storage-caption">Your sessions stay in this browser. No calendar invitations or notifications are sent.</p>
      </>}

      {view === 'book' && currentSelection.step === 'details' && <>
        <div className="ss-detail-intro"><button className="ss-text-button" onClick={() => setStep('select')}><Icon name="back" />Choose another time</button><h1>Let’s make it yours.</h1><p>A name and a little context are all you need.</p></div>
        <section className="ss-details-card"><aside className="ss-service">{serviceSummary}<div className="ss-current-session"><span>Your selected time</span><strong>{describeDate(selectedStart)}</strong><p>{describeTime(selectedStart)}</p></div></aside><form className="ss-details-form" onSubmit={saveSession}>
          <h2>Your details</h2><label htmlFor="ss-name">Your name <span aria-hidden="true">*</span></label><input id="ss-name" name="name" autoComplete="name" required maxLength={80} value={name} onChange={event => setName(event.target.value)} placeholder="Alex Morgan" autoFocus />
          <div className="ss-field-label"><label htmlFor="ss-notes">What would you like to discuss?</label><span>Optional</span></div><textarea id="ss-notes" name="notes" maxLength={500} rows={5} value={notes} onChange={event => setNotes(event.target.value)} placeholder="An idea, a question, or something you’re working through…" /><span className="ss-character-count">{notes.length}/500</span>
          <div className="ss-local-note"><Icon name="globe" /><p>This session is saved only in this browser. No invitation or notification will be sent.</p></div><button className="ss-button ss-button-primary ss-save-button" type="submit">Save session<Icon name="arrow" /></button>
        </form></section>
      </>}

      {view === 'book' && step === 'success' && saved && <section className="ss-success"><div className="ss-success-check"><Icon name="check" size={30} /></div><p className="ss-eyebrow">A MOMENT SET ASIDE</p><h1>{wasRescheduled ? 'Your new time is saved.' : 'You’re on the schedule.'}</h1><p>Saved to this browser for {saved.name}.</p><div className="ss-success-summary"><div><span>Session</span><strong>Project clarity</strong></div><div><span>Date</span><strong>{describeDate(saved.start)}</strong></div><div><span>Time</span><strong>{describeTime(saved.start)}</strong></div><p><Icon name="globe" />America/Vancouver</p></div><p className="ss-success-note">No calendar invitation or message has been sent.<br />You can reschedule or cancel in My sessions.</p><div className="ss-success-actions"><button className="ss-button ss-button-primary" onClick={() => { openManagement(); setDetailId(saved.id); }}>View my sessions<Icon name="arrow" /></button><button className="ss-button ss-button-quiet" onClick={beginBooking}>Book another session</button></div></section>}

      {view === 'manage' && <>
        <div className="ss-manage-heading"><div><p className="ss-eyebrow">A LITTLE ORDER, A LITTLE SPACE</p><h1>My sessions</h1><p>View and manage sessions saved in this browser.</p></div><button className="ss-button ss-button-primary" onClick={beginBooking}>Book a session<Icon name="arrow" /></button></div>
        <div className="ss-manage-toolbar"><div className="ss-search"><Icon name="search" /><label className="ss-sr-only" htmlFor="ss-search">Search by name or notes</label><input id="ss-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name or notes" /></div><label className="ss-filter">Status<select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All sessions</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></label><label className="ss-filter">Sort<select value={sort} onChange={event => setSort(event.target.value)}><option value="soonest">Soonest first</option><option value="latest">Latest first</option></select></label></div>
        <div className={`ss-management ${detail ? 'ss-has-detail' : ''}`}><section className="ss-session-list" aria-label="Saved sessions"><div className="ss-list-heading"><span>{visibleBookings.length} {visibleBookings.length === 1 ? 'session' : 'sessions'}</span><span>America/Vancouver</span></div>
          {!visibleBookings.length && <div className="ss-empty"><span className="ss-empty-icon"><Icon name="calendar" size={28} /></span><h2>{bookings.length ? 'No matching sessions.' : 'Your schedule starts here.'}</h2><p>{bookings.length ? 'Try another name or change your filters.' : 'Make a little room for your next idea.'}</p><button className="ss-button ss-button-quiet" onClick={bookings.length ? () => { setSearch(''); setStatus('all'); } : beginBooking}>{bookings.length ? 'Clear filters' : 'Find a time'}<Icon name="arrow" /></button></div>}
          {visibleBookings.map(booking => <button key={booking.id} className={`ss-session-row ${detailId === booking.id ? 'ss-row-active' : ''}`} aria-label={`View ${booking.name}, ${describeDate(booking.start)}, ${clockFormat.format(new Date(booking.start))}, ${booking.status}`} aria-pressed={detailId === booking.id} onClick={() => { setDetailId(booking.id); setConfirmCancel(false); setNotice(''); }}><span className="ss-date-tile"><span>{new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, month: 'short' }).format(new Date(booking.start))}</span><strong>{new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, day: 'numeric' }).format(new Date(booking.start))}</strong></span><span className="ss-row-info"><strong>{booking.name}</strong><span>Project clarity <b>·</b> {describeTime(booking.start)}</span></span><span className={`ss-status ss-status-${booking.status}`}><i />{booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span><span className="ss-row-arrow"><Icon name="arrow" /></span></button>)}
        </section>{detail && <aside className="ss-record-detail" aria-label="Session details"><div className="ss-record-top"><p className="ss-eyebrow">SESSION DETAILS</p><button className="ss-icon-button" aria-label="Close session details" onClick={() => { setDetailId(null); setConfirmCancel(false); }}><Icon name="close" /></button></div><h2>{detail.name}</h2><span className={`ss-status ss-status-${detail.status}`}><i />{detail.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span><dl><dt>Session</dt><dd>Project clarity · 30 minutes</dd><dt>Date & time</dt><dd>{describeDate(detail.start)}<br />{describeTime(detail.start)}<span className="ss-subtext">America/Vancouver</span></dd><dt>Notes</dt><dd className="ss-record-notes">{detail.notes || 'No notes added.'}</dd></dl>{detail.status === 'confirmed' && <div className="ss-record-actions">{confirmCancel ? <div className="ss-cancel-confirm"><strong>Cancel this session?</strong><p>Its time will become available again.</p><button className="ss-button ss-button-danger" onClick={cancelSession}>Yes, cancel session</button><button className="ss-button ss-button-quiet" onClick={() => setConfirmCancel(false)}>Keep session</button></div> : <><button className="ss-button ss-button-outline" onClick={() => beginReschedule(detail)}>Reschedule<Icon name="calendar" /></button><button className="ss-button ss-button-quiet ss-cancel-link" onClick={() => setConfirmCancel(true)}>Cancel session</button></>}</div>}<p className="ss-record-storage">Changes are saved in this browser.<br />No notifications are sent.</p></aside>}</div>
      </>}
      {error && <div className="ss-alert" role="alert">{error}<button className="ss-icon-button" aria-label="Dismiss error" onClick={() => setError('')}><Icon name="close" /></button></div>}
      {notice && <div className="ss-notice" role="status"><Icon name="check" />{notice}<button className="ss-icon-button" aria-label="Dismiss message" onClick={() => setNotice('')}><Icon name="close" /></button></div>}
    </main>
    <footer className="ss-footer"><span>Less back and forth. More moving forward.</span><span>studio session <span aria-hidden="true">↗</span></span></footer>
  </div>;
}
