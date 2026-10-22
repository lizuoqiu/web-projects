import { useRef, useState, type FormEvent } from 'react';
import { categories, dishes, type Category } from './data';

const STORAGE_KEY = 'scottli.web-projects.table.request.v1';
const base = import.meta.env.BASE_URL;
type Request = { name: string; date: string; guests: string; time: string; note: string };
const emptyRequest: Request = { name: '', date: '', guests: '2', time: '18:30', note: '' };
const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

function vancouverDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('-');
}
function isFutureDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date && date > vancouverDate();
}
function tomorrow() {
  const date = new Date(`${vancouverDate()}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
function readRequest(): Request | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (value && typeof value === 'object' && ['name', 'date', 'guests', 'time', 'note'].every(key => typeof (value as Record<string, unknown>)[key] === 'string')) return value as Request;
  } catch { /* Storage can be unavailable; the form remains usable. */ }
  return null;
}
function displayDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function displayTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours > 12 ? hours - 12 : hours}:${String(minutes).padStart(2, '0')} pm`;
}
function Arrow() {
  return <span aria-hidden="true" className="st-arrow">↗</span>;
}

export default function App() {
  const [mobileNav, setMobileNav] = useState(false);
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [vegetarian, setVegetarian] = useState(false);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Request | null>(readRequest);
  const [form, setForm] = useState<Request>(() => readRequest() || emptyRequest);
  const [errors, setErrors] = useState<Partial<Record<keyof Request | 'storage', string>>>({});
  const [notice, setNotice] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const filtered = dishes.filter(dish => (category === 'All' || dish.category === category) && (!vegetarian || dish.vegetarian) && `${dish.name} ${dish.description}`.toLowerCase().includes(search.trim().toLowerCase()));
  const closeNav = () => setMobileNav(false);
  const update = (key: keyof Request, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined, storage: undefined }));
    setNotice('');
  };
  const clearFilters = () => { setCategory('All'); setVegetarian(false); setSearch(''); };
  function saveRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = 'Please add a name for your request.';
    if (!isFutureDate(form.date)) nextErrors.date = 'Choose a valid future date, after today.';
    if (!Number.isInteger(Number(form.guests)) || Number(form.guests) < 1 || Number(form.guests) > 8) nextErrors.guests = 'Choose between 1 and 8 guests.';
    if (!times.includes(form.time)) nextErrors.time = 'Choose a preferred time.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`st-${first}`)?.focus();
      return;
    }
    const request = { ...form, name: form.name.trim(), note: form.note.trim() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(request)); }
    catch { setErrors({ storage: 'This browser could not save your request. Your details are still in the form; nothing has been sent.' }); return; }
    setSaved(request);
    setErrors({});
    setNotice('Request saved to this device.');
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function removeRequest() {
    try { localStorage.removeItem(STORAGE_KEY); }
    catch { setErrors({ storage: 'This browser could not remove the saved request. Please try again.' }); return; }
    setSaved(null);
    setNotice('Saved request removed. Nothing was sent.');
    nameInput.current?.focus();
  }
  return <div className="seasonal-table">
    <a href="#main" className="st-skip">Skip to content</a>
    <header className="st-header">
      <h1 className="st-brand"><a className="st-wordmark" href="#" aria-label="Seasonal Table home">Seasonal <em>Table</em><span>A KITCHEN FOR GATHERING</span></a></h1>
      <button className="st-nav-toggle" aria-label={mobileNav ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNav} aria-controls="st-navigation" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? 'Close −' : 'Menu +'}</button>
      <nav id="st-navigation" className={mobileNav ? 'st-nav is-open' : 'st-nav'} aria-label="Main navigation">
        <a href="#our-table" onClick={closeNav}>Our restaurant</a><a href="#menu" onClick={closeNav}>The menu</a><a className="st-nav-reserve" href="#reservation" onClick={closeNav}>Plan a visit</a>
      </nav>
    </header>
    <main id="main">
      <section className="st-hero" aria-label="Inside Seasonal Table">
        <figure className="st-hero-image"><img src={`${base}images/table/dining-room-edited.png`} alt="An intimate timber dining room, with warm lights and tables beside a green garden view" width="1536" height="1024" fetchPriority="high" /><figcaption><span>SEASONAL INGREDIENTS. GOOD COMPANY.</span><a href="#menu">Explore the menu <span aria-hidden="true">↓</span></a></figcaption></figure>
      </section>

      <section id="our-table" className="st-story" aria-labelledby="st-story-title">
        <figure className="st-story-image"><img src={`${base}images/table/seasonal-plate-edited.png`} alt="Roasted beets, chicory, orange, goat cheese and hazelnuts on a ceramic plate" width="1536" height="1024" loading="lazy" /><figcaption>Roasted beets, soft cheese &amp; a little citrus.</figcaption></figure>
        <div className="st-story-body"><p className="st-eyebrow">WELCOME TO SEASONAL TABLE</p><h2 id="st-story-title">Good food.<br />A little time together.</h2><p>Warm bread, vegetables at their best, and something good for the middle of the table. Our cooking follows the season, with familiar ingredients and simple, generous plates.</p><p>Come for a quiet dinner or bring a few friends. There’s always a reason to stay for dessert.</p><a className="st-button-link" href="#menu">View the menu</a></div>
      </section>

      <section id="menu" className="st-menu st-section" aria-labelledby="st-menu-title">
        <div className="st-menu-top"><p className="st-eyebrow">FROM OUR KITCHEN</p><h2 id="st-menu-title">The seasonal menu</h2><p>A few good things, from the first bite to the last.</p><span>PRICES IN CAD · V = VEGETARIAN</span></div>
        <div className="st-menu-controls"><div className="st-categories" role="group" aria-label="Menu category">{(['All', ...categories] as const).map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item === 'All' ? 'The whole menu' : item}</button>)}</div><label className="st-vegetarian"><input type="checkbox" checked={vegetarian} onChange={event => setVegetarian(event.target.checked)} /><span>Vegetarian only</span></label></div>
        <div className="st-menu-utility"><label className="st-search-label" htmlFor="st-search">Find a dish<input id="st-search" type="search" value={search} placeholder="An ingredient, a favourite…" onChange={event => setSearch(event.target.value)} /></label><p className="st-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'}{vegetarian ? ' · vegetarian' : ''}</p></div>
        {filtered.length ? <div className="st-menu-groups">{categories.filter(group => filtered.some(dish => dish.category === group)).map((group, index) => <section className="st-menu-group" key={group} aria-labelledby={`st-group-${index}`}><h3 id={`st-group-${index}`}>{group}</h3><ul>{filtered.filter(dish => dish.category === group).map(dish => <li className="st-dish" key={dish.id}><div className="st-dish-title"><h4>{dish.name}{dish.vegetarian && <span className="st-v" aria-label="Vegetarian">V</span>}</h4><span className="st-price">{dish.price}</span></div><p>{dish.description}</p></li>)}</ul></section>)}</div> : <div className="st-menu-empty"><h3>Nothing on this part of the menu.</h3><p>Try another ingredient, or come back to the whole table.</p><button type="button" className="st-text-link" onClick={clearFilters}>Show the whole menu <Arrow /></button></div>}
        <p className="st-menu-note">Good food is personal. Dietary notes belong in your visit request; a vegetarian label is not an allergen guarantee.</p>
      </section>

      <section id="reservation" className="st-reservation" aria-labelledby="st-reservation-title"><div className="st-reservation-intro"><p className="st-eyebrow">YOUR EVENING, AT THE TABLE</p><h2 id="st-reservation-title">Plan a visit</h2><p>A dinner for two, or a table of friends.<br />Start with the details for your evening.</p><dl className="st-visit-facts"><div><dt>At the table</dt><dd>1–8 guests</dd></div><div><dt>Preferred time</dt><dd>5:00–8:30 pm</dd></div><div><dt>Time zone</dt><dd>Vancouver, Pacific time</dd></div></dl><div className="st-local-note"><p>This request is saved to this device only. It is not sent to a restaurant and does not reserve a table.</p></div></div>
        <div className="st-reservation-panel"><form onSubmit={saveRequest} noValidate><div className="st-form-row"><div className="st-field"><label htmlFor="st-name">Your name</label><input id="st-name" ref={nameInput} name="name" autoComplete="given-name" maxLength={80} required value={form.name} placeholder="What should we call you?" onChange={event => update('name', event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'st-name-error' : undefined} />{errors.name && <p className="st-field-error" id="st-name-error">{errors.name}</p>}</div><div className="st-field"><label htmlFor="st-guests">At the table</label><select id="st-guests" required value={form.guests} onChange={event => update('guests', event.target.value)} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? 'st-guests-error' : undefined}>{Array.from({ length: 8 }, (_, index) => index + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select>{errors.guests && <p id="st-guests-error" className="st-field-error">{errors.guests}</p>}</div></div>
          <div className="st-form-row"><div className="st-field"><label htmlFor="st-date">Preferred date</label><input type="date" id="st-date" required min={tomorrow()} value={form.date} onChange={event => update('date', event.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'st-date-error' : undefined} />{errors.date && <p className="st-field-error" id="st-date-error">{errors.date}</p>}</div><div className="st-field"><label htmlFor="st-time">Preferred time <span>(Vancouver)</span></label><select id="st-time" required value={form.time} onChange={event => update('time', event.target.value)} aria-invalid={!!errors.time}>{times.map(time => <option value={time} key={time}>{displayTime(time)}</option>)}</select>{errors.time && <p className="st-field-error">{errors.time}</p>}</div></div>
          <div className="st-field"><label htmlFor="st-note">Anything else? <span>Optional</span></label><textarea id="st-note" value={form.note} maxLength={500} rows={3} placeholder="Dietary preferences, an occasion, a little detail…" onChange={event => update('note', event.target.value)} /></div>
          {errors.storage && <p role="alert" className="st-field-error">{errors.storage}</p>}<button className="st-save-button" type="submit">{saved ? 'Update saved request' : 'Save request to this device'} <Arrow /></button><p className="st-form-footnote">No email, payment or confirmed reservation.</p></form>
          <div aria-live="polite" className="st-notice">{notice}</div>
          {saved && <div ref={resultRef} tabIndex={-1} className="st-saved-request"><span className="st-eyebrow">SAVED HERE · NOT SENT</span><h3>{saved.name}’s evening</h3><p>{displayDate(saved.date)}<br />{displayTime(saved.time)} · Vancouver time<br />{saved.guests} {saved.guests === '1' ? 'guest' : 'guests'}</p>{saved.note && <p className="st-saved-note">{saved.note}</p>}<p className="st-saved-status">Your request has not been sent. No table is reserved.</p><div className="st-saved-actions"><button type="button" onClick={() => { setForm(saved); nameInput.current?.focus(); }}>Edit details</button><button type="button" onClick={removeRequest}>Remove saved request</button></div></div>}
        </div>
      </section>
    </main>
    <footer className="st-footer"><div className="st-footer-top"><a href="#" className="st-footer-wordmark">Seasonal <em>Table</em></a><p>Good food.<br />Better company.</p><a href="#main" className="st-back-top">Back to the top ↑</a></div><div className="st-footer-bottom"><a href={base}>An independent web project by Scott Li <span aria-hidden="true">↗</span></a><span>Photo references: <a href="https://unsplash.com/photos/cozy-rustic-restaurant-interior-with-large-windows-Q73XXHcIsa8" target="_blank" rel="noreferrer">Mathias Reding</a> & <a href="https://unsplash.com/photos/vegetable-salad-on-brown-ceramic-plate-RNmibnLCJAA" target="_blank" rel="noreferrer">Louis Hansel</a> / Unsplash</span></div></footer>
  </div>;
}
