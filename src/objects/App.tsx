import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { addItem, setQuantity, subtotal } from './cart';
import type { CartItem } from './cart';
import { assetUrl, categories, money, products } from './data';
import type { Category, Product, Variant } from './data';

const STORAGE_KEY = 'scott-web-projects:objects:cart:v1';

function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.reduce<CartItem[]>((cart, line: Partial<CartItem> | null) => {
      if (!line || !Number.isInteger(line.quantity) || !line.quantity || line.quantity < 1 || line.quantity > 99) return cart;
      const product = products.find(item => item.id === line.productId);
      const variant = product?.variants.find(item => item.id === line.variantId && item.available);
      if (!product || !variant) return cart;
      return addItem(cart, { productId: product.id, variantId: variant.id, unitPriceCents: product.priceCents }, line.quantity);
    }, []);
  } catch { return []; }
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function CloseIcon() {
  return <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function ProductPhoto({ productName, variant, loading = 'lazy' }: {
  productName: string;
  variant: Variant;
  loading?: 'eager' | 'lazy';
}) {
  return <div className={`photo-frame photo-frame--${variant.imageSide}`}>
    <img src={assetUrl(variant.image)} alt={`${productName} in ${variant.name}`} loading={loading} width="1536" height="1024" />
  </div>;
}

export default function App() {
  const [category, setCategory] = useState<Category | 'All objects'>('All objects');
  const [sort, setSort] = useState('curated');
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [product, setProduct] = useState<Product | null>(null);
  const [variantId, setVariantId] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [summary, setSummary] = useState(false);
  const [notice, setNotice] = useState('');
  const [storageIssue, setStorageIssue] = useState(false);
  const productDialog = useRef<HTMLDialogElement>(null);
  const cartDialog = useRef<HTMLDialogElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); setStorageIssue(false); }
    catch { setStorageIssue(true); }
  }, [cart]);

  useEffect(() => {
    if (product) productDialog.current?.showModal();
    else productDialog.current?.close();
  }, [product]);

  useEffect(() => {
    if (cartOpen) cartDialog.current?.showModal();
    else cartDialog.current?.close();
  }, [cartOpen]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (product || cartOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [product, cartOpen]);

  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const selectedVariant = product?.variants.find(item => item.id === variantId);
  const selectedCount = cart.find(item => item.productId === product?.id && item.variantId === variantId)?.quantity ?? 0;
  const catalogue = products.filter(item => category === 'All objects' || item.category === category).sort((a, b) => (
    sort === 'price-low' ? a.priceCents - b.priceCents : sort === 'price-high' ? b.priceCents - a.priceCents : sort === 'name' ? a.name.localeCompare(b.name) : 0
  ));

  function openProduct(item: Product) { setNotice(''); setProduct(item); setVariantId(item.variants[0].id); }
  function openCart() { setProduct(null); setSummary(false); setCartOpen(true); }
  function announce(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 5000);
  }
  function addSelected() {
    if (!product || !selectedVariant?.available || selectedCount >= 99) return;
    setCart(current => addItem(current, { productId: product.id, variantId: selectedVariant.id, unitPriceCents: product.priceCents }));
    announce(`${product.name} in ${selectedVariant.name} added to your bag.`);
  }
  function changeQuantity(line: CartItem, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) return;
    setCart(current => setQuantity(current, line.productId, line.variantId, quantity));
    setSummary(false);
  }

  return <div className="objects-site">
    <a className="skip-link" href="#collection">Skip to collection</a>
    <div className="top-note">Considered objects for everyday work.</div>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Objects home">objects<span>·</span></a>
      <nav aria-label="Main navigation"><a href="#collection">The collection</a><a href="#approach">Our approach</a></nav>
      <button className="bag-button" onClick={openCart} aria-label={`Open bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}>Bag <span>{itemCount.toString().padStart(2, '0')}</span><svg aria-hidden="true" width="18" height="21" viewBox="0 0 18 21" fill="none"><path d="M2 6h14v13H2zM6 7V4a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.2" /></svg></button>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="little-rule" /> THE EVERYDAY COLLECTION</p><h1 id="hero-title">Less distraction.<br /><em>More possibility.</em></h1><p className="hero-description">Thoughtful essentials for the space where your ideas take shape. Simple forms, honest materials, a little room to think.</p><a className="text-link" href="#collection">Find your everyday <Arrow /></a><span className="hero-edition">OBJECTS / COLLECTION 01</span></div>
        <div className="hero-image"><img src={assetUrl('desk-scene-photo.png')} alt="A warm desk arrangement with a wooden tray, cloth notebook, ceramic cup and a sculptural reading lamp" /><div className="image-caption"><span>A quieter kind of workspace.</span><span>01 — 08</span></div></div>
      </section>

      <section className="collection section-wrap" id="collection" aria-labelledby="collection-title">
        <div className="section-heading"><div><p className="eyebrow">USEFUL. BEAUTIFUL. EVERYDAY.</p><h2 id="collection-title">Good things, <em>well considered.</em></h2></div><p>Eight objects.<br />Endlessly your own.</p></div>
        <div className="catalogue-toolbar"><div className="filters" aria-label="Filter collection">{(['All objects', ...categories] as const).map(item => <button className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}{item === 'All objects' && <sup>08</sup>}</button>)}</div><label className="sort-control">Sort by <select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)}><option value="curated">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select><span aria-hidden="true">⌄</span></label></div>
        <p className="visually-hidden" aria-live="polite">Showing {catalogue.length} {category === 'All objects' ? 'objects' : category.toLowerCase()}</p>
        <div className="product-grid">{catalogue.map((item, index) => <article className="product-card" key={item.id}>
          <button className="product-image" onClick={() => openProduct(item)} aria-label={`View ${item.name}`}><span className="product-number">{String(products.indexOf(item) + 1).padStart(2, '0')}</span><ProductPhoto productName={item.name} variant={item.variants[0]} loading={index < 4 ? 'eager' : 'lazy'} /><span className="image-action" aria-hidden="true"><Arrow diagonal /></span></button>
          <div className="product-heading"><button onClick={() => openProduct(item)}>{item.name}</button><span>{money(item.priceCents)}</span></div>
          <div className="product-meta"><p>{item.category}</p><div className="tiny-swatches" aria-label={`Available finishes: ${item.variants.map(v => `${v.name}${!v.available ? ' unavailable' : ''}`).join(', ')}`}>{item.variants.map(v => <span key={v.id} style={{ '--swatch': v.color } as CSSProperties} className={v.available ? '' : 'unavailable'} />)}</div></div>
        </article>)}</div>
        <div className="collection-foot"><span>{catalogue.length.toString().padStart(2, '0')} objects in view</span><span>All prices in Canadian dollars.</span></div>
      </section>

      <section className="approach section-wrap" id="approach" aria-labelledby="approach-title"><div className="approach-label"><p className="eyebrow">A FEW THINGS WE COME BACK TO</p><span className="asterisk" aria-hidden="true">✳</span></div><div className="approach-copy"><h2 id="approach-title">Not more things.<br /><em>More meaning in the everyday.</em></h2><p>A desk is a small place with a lot of possibility. This collection explores the balance between function and feeling: tactile surfaces, useful proportions, and objects that leave a little space around them.</p><div className="approach-principles"><div><span>01 /</span><h3>Room to focus</h3><p>Simple forms that do their part, without taking over.</p></div><div><span>02 /</span><h3>Made to be used</h3><p>Details that feel as considered as they look.</p></div><div><span>03 /</span><h3>Quiet character</h3><p>Warm materials and a palette that works together.</p></div></div></div></section>
    </main>

    <footer className="site-footer"><a className="wordmark" href="#top">objects<span>·</span></a><p>A little more room to think.</p><a className="portfolio-link" href={import.meta.env.BASE_URL}>A project by Scott Li <Arrow diagonal /></a><span className="footer-copyright">Independent design & development · 2026</span></footer>

    <dialog className="product-dialog" ref={productDialog} aria-labelledby="detail-title" onCancel={event => { event.preventDefault(); setProduct(null); }} onClick={event => { if (event.target === event.currentTarget) setProduct(null); }}>
      {product && selectedVariant && <div className="product-dialog-content"><button className="close-button" onClick={() => setProduct(null)} aria-label="Close product details"><CloseIcon /></button><div className="detail-image"><ProductPhoto productName={product.name} variant={selectedVariant} loading="eager" /><span>OBJECTS / {String(products.indexOf(product) + 1).padStart(2, '0')}</span></div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h2 id="detail-title">{product.name}</h2><p className="detail-subtitle">{product.subtitle}</p><p className="detail-price">{money(product.priceCents)} <small>CAD</small></p><p className="detail-description">{product.description}</p><fieldset className="variant-picker"><legend>Finish <span>— {selectedVariant.name}</span></legend><div>{product.variants.map(item => <button key={item.id} aria-pressed={variantId === item.id} onClick={() => setVariantId(item.id)} className={`${variantId === item.id ? 'selected' : ''} ${item.available ? '' : 'unavailable'}`} aria-label={`${item.name}${item.available ? '' : ', unavailable'}`}><span style={{ '--swatch': item.color } as CSSProperties} />{item.name}</button>)}</div></fieldset><p className={`stock-note ${selectedVariant.available ? '' : 'out-of-stock'}`}><span />{selectedVariant.available ? 'Available in this finish' : 'This finish is currently unavailable'}</p><button className="primary-button add-button" disabled={!selectedVariant.available || selectedCount >= 99} onClick={addSelected}>{!selectedVariant.available ? 'Currently unavailable' : selectedCount >= 99 ? 'Maximum quantity in bag' : `Add to bag — ${money(product.priceCents)}`}<Arrow /></button>{notice && <p className="detail-added" role="status">{notice}</p>}{cart.some(line => line.productId === product.id) && <button className="view-bag-link" onClick={openCart}>View your bag ({itemCount}) <Arrow /></button>}<dl className="product-specs"><div><dt>Materials</dt><dd>{product.materials}</dd></div><div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div></dl><ul className="detail-points">{product.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div></div>}
    </dialog>

    <dialog className="cart-dialog" ref={cartDialog} aria-labelledby="bag-title" onCancel={event => { event.preventDefault(); setCartOpen(false); }} onClick={event => { if (event.target === event.currentTarget) setCartOpen(false); }}>
      <div className="cart-panel"><div className="cart-header"><div><p className="eyebrow">YOUR EVERYDAY, TOGETHER</p><h2 id="bag-title">{summary ? 'Order summary' : 'Your bag'} <span>({itemCount})</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><CloseIcon /></button></div>
        {cart.length === 0 ? <div className="empty-bag"><svg width="70" height="78" viewBox="0 0 70 78" fill="none" aria-hidden="true"><path d="M10 24h50v46H10zM24 27V16a11 11 0 0 1 22 0v11" stroke="currentColor" strokeWidth="1.5" /><path d="M23 47h24" stroke="currentColor" /></svg><h3>A little room for something good.</h3><p>Your bag is empty. Find an object that makes your everyday feel a little more considered.</p><button className="primary-button" onClick={() => { setCartOpen(false); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore the collection <Arrow /></button></div> : <>
          {summary && <div className="summary-notice" role="status"><strong>Your selection, all in one place.</strong><p>{storageIssue ? 'This selection is available for this visit only.' : 'Your selection is saved in this browser only.'} No order has been placed and no payment is collected.</p></div>}
          <div className="cart-lines">{cart.map(line => {
            const item = products.find(p => p.id === line.productId)!;
            const variant = item.variants.find(v => v.id === line.variantId)!;
            return <div className="cart-line" key={`${line.productId}:${line.variantId}`}><ProductPhoto productName={item.name} variant={variant} /><div className="cart-line-details"><div className="cart-line-heading"><h3>{item.name}</h3><span>{money(line.unitPriceCents * line.quantity)}</span></div><p>{variant.name} <span>· {money(line.unitPriceCents)} each</span></p><div className="cart-line-actions">{summary ? <span className="summary-quantity">Quantity: {line.quantity}</span> : <div className="quantity-control"><button onClick={() => changeQuantity(line, line.quantity - 1)} aria-label={`Decrease quantity of ${item.name} in ${variant.name}`}>−</button><label><span className="visually-hidden">Quantity of {item.name} in {variant.name}</span><input type="number" min="1" max="99" value={line.quantity} onChange={event => { if (event.target.value !== '') changeQuantity(line, Number(event.target.value)); }} /></label><button disabled={line.quantity >= 99} onClick={() => changeQuantity(line, line.quantity + 1)} aria-label={`Increase quantity of ${item.name} in ${variant.name}`}>+</button></div>}{!summary && <button className="remove-item" onClick={() => changeQuantity(line, 0)} aria-label={`Remove ${item.name} in ${variant.name}`}>Remove</button>}</div></div></div>;
          })}</div><div className="cart-total"><div><span>Item subtotal</span><strong>{money(subtotal(cart))} <small>CAD</small></strong></div><p>Shipping and tax are not calculated. This is an item summary, not a checkout.</p>{!summary ? <button className="primary-button" onClick={() => setSummary(true)}>Review your selection <Arrow /></button> : <button className="primary-button" onClick={() => setSummary(false)}>Back to bag <Arrow /></button>}<button className="continue-link" onClick={() => setCartOpen(false)}>Continue browsing</button></div>
        </>}{storageIssue && <p className="storage-notice" role="status">Your browser could not save this bag. It will be available for this visit only.</p>}
      </div>
    </dialog>
    <div className={`toast ${notice && !product && !cartOpen ? 'visible' : ''}`} role="status" aria-live="polite">{notice && !product && !cartOpen && <><span className="toast-check" aria-hidden="true">✓</span><span>{notice}</span><button onClick={openCart}>View bag <Arrow /></button></>}</div>
  </div>;
}
