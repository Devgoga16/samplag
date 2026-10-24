// Samplag S.A.C. · tienda en línea (catálogo de uTracker, carrito y checkout)
import { storeApi, money, type Catalog, type StoreConfig, type StoreFilter, type StoreProduct } from '../data/store';
import { waLink } from '../data/site';
import { $, $$, reduceMotion, EASE_OUT, replay } from './utils';

/* ── Estado ─────────────────────────────────────────────────── */
interface CartLine {
  key: string;
  id: string;
  name: string;
  image?: string;
  variant: string;
  price: number;
  qty: number;
  stock: number | null;
}

const CART_KEY = 'samplag-cart';
const THANKS_PARAM = 'pedido';

// El carrito es una comodidad de este navegador: si el almacenamiento falla, se trabaja en memoria
const loadCart = (): CartLine[] => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
};
const saveCart = () => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* sin almacenamiento */ }
};

let cart: CartLine[] = loadCart();
let catalog: Catalog = { products: [], categories: [] };
let acceptsOrders = true;
let error = '';
let done: { trackingUrl?: string } | null = null;
let paying = false;

// Filtros de la tienda: categorías y filtros de uTracker se muestran solo si existen;
// búsqueda y orden aparecen cuando el catálogo crece
const SEARCH_MIN = 6;
let filters: StoreFilter[] = [];
const view = { category: '', attrs: {} as Record<string, string[]>, query: '', sort: 'default' };

const initial = document.getElementById('store-catalog');
if (initial?.textContent) {
  try { catalog = JSON.parse(initial.textContent); } catch { /* se pide a la API */ }
}

/* ── Helpers de DOM (sin innerHTML: los textos vienen del catálogo) ── */
type Child = Node | string | number | null | undefined | false;
const h = (tag: string, props: Record<string, unknown> = {}, children: Child | Child[] = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') node.className = String(v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v as EventListener);
    else node.setAttribute(k, String(v));
  }
  for (const c of ([] as Child[]).concat(children)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(typeof c === 'string' || typeof c === 'number' ? String(c) : c);
  }
  return node;
};
const icon = (name: string, cls = '') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `ic ${cls}`.trim());
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
};

/* ── Carrito ────────────────────────────────────────────────── */
const lineKey = (id: string, variant: string) => `${id}|${variant}`;
const priceOf = (p: StoreProduct, variant: string) => p.variants.find((v) => v.name === variant)?.price ?? p.price;
const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
const cartTotal = () => cart.reduce((n, l) => n + l.price * l.qty, 0);

/** Agrega `qty` unidades; devuelve false si el stock no alcanza */
const addToCart = (p: StoreProduct, variant: string, qty = 1) => {
  const key = lineKey(p.id, variant);
  let line = cart.find((l) => l.key === key);
  const current = line?.qty ?? 0;
  if (p.stock !== null && current + qty > p.stock) {
    notify(`Solo quedan ${p.stock} unidades de "${p.name}".`, 'error');
    return false;
  }
  if (!line) {
    line = { key, id: p.id, name: p.name, image: p.images[0], variant, price: priceOf(p, variant), qty: 0, stock: p.stock };
    cart.push(line);
  }
  line.qty += qty;
  error = '';
  done = null;
  saveCart();
  renderCart();
  bumpCount();
  return true;
};

const changeQty = (key: string, delta: number) => {
  const line = cart.find((l) => l.key === key);
  if (!line) return;
  if (delta > 0 && line.stock !== null && line.qty + 1 > line.stock) {
    error = `Solo quedan ${line.stock} unidades de "${line.name}".`;
  } else {
    line.qty += delta;
    error = '';
  }
  cart = cart.filter((l) => l.qty > 0);
  saveCart();
  renderCart();
};

const removeLine = (key: string) => {
  cart = cart.filter((l) => l.key !== key);
  error = '';
  saveCart();
  renderCart();
};

/** Actualiza precios y stock del carrito con el catálogo vigente; quita lo que ya no se vende */
const reconcileCart = () => {
  if (!catalog.products.length) return;
  cart = cart.filter((l) => {
    const p = catalog.products.find((x) => x.id === l.id);
    if (!p || !p.inStock || p.pricingMode === 'quoted') return false;
    if (l.variant && !p.variants.some((v) => v.name === l.variant)) return false;
    l.name = p.name;
    l.image = p.images[0];
    l.price = priceOf(p, l.variant);
    l.stock = p.stock;
    return true;
  });
  saveCart();
};

/* ── Contador del header ────────────────────────────────────── */
const counters = $$('[data-cart-count]');
const updateCount = () => {
  const n = cartCount();
  counters.forEach((c) => {
    c.textContent = String(n);
    c.hidden = n === 0;
  });
};
const bumpCount = () => counters.forEach((c) => replay(c, 'is-bump'));

/* ── Catálogo ───────────────────────────────────────────────── */
const grids = $$('[data-store-grid]');

// El catálogo de uTracker puede traer nombres con punto final; en la tarjeta se ve mejor sin él
const cleanName = (name: string) => name.replace(/\.\s*$/, '');

const productCard = (p: StoreProduct) => {
  const quoted = p.pricingMode === 'quoted';
  const soldOut = !p.inStock;
  const canBuy = !quoted && !soldOut && acceptsOrders;
  const name = cleanName(p.name);
  let qty = 1;

  const variantSelect = p.variants.length
    ? (h('select', { class: 'product__select', 'aria-label': `Opción de ${name}` },
        p.variants.map((v) => h('option', { value: v.name }, `${v.name} · ${money(v.price)}`))) as HTMLSelectElement)
    : null;
  const variant = () => variantSelect?.value ?? '';
  const priceEl = h('p', { class: 'product__price' }, quoted ? 'Precio a cotizar' : money(p.price));
  variantSelect?.addEventListener('change', () => { priceEl.textContent = money(priceOf(p, variant())); });

  /* Galería: la foto principal cambia con las miniaturas */
  const mainImg = p.images[0]
    ? (h('img', { class: 'product__img', src: p.images[0], alt: name, loading: 'lazy', decoding: 'async', width: 600, height: 450 }) as HTMLImageElement)
    : null;
  const thumbs = p.images.length > 1
    ? h('div', { class: 'product__thumbs', role: 'group', 'aria-label': `Fotos de ${name}` }, p.images.map((src, i) => {
        const t = h('button', {
          type: 'button',
          class: `product__thumb${i === 0 ? ' is-active' : ''}`,
          'aria-label': `Ver foto ${i + 1} de ${p.images.length}`,
          'aria-pressed': String(i === 0),
        }, h('img', { src, alt: '', loading: 'lazy', decoding: 'async', width: 64, height: 64 }));
        t.addEventListener('click', () => {
          if (!mainImg || mainImg.src === src) return;
          mainImg.src = src;
          replay(mainImg, 'is-swapping');
          t.parentElement!.querySelectorAll('.product__thumb').forEach((x) => {
            x.classList.toggle('is-active', x === t);
            x.setAttribute('aria-pressed', String(x === t));
          });
        });
        return t;
      }))
    : null;

  /* Cantidad */
  const qtyN = h('span', { class: 'qty__n', 'aria-live': 'polite' }, qty);
  const setQty = (n: number) => {
    const max = p.stock ?? 99;
    qty = Math.min(Math.max(1, n), max);
    qtyN.textContent = String(qty);
  };
  const qtyEl = canBuy ? h('div', { class: 'qty qty--card' }, [
    h('button', { type: 'button', class: 'qty__btn', 'aria-label': 'Menos', onclick: () => setQty(qty - 1) }, '−'),
    qtyN,
    h('button', { type: 'button', class: 'qty__btn', 'aria-label': 'Más', onclick: () => setQty(qty + 1) }, '+'),
  ]) : null;

  /* Acciones: comprar directo (más rápido) o agregar al carrito para seguir comprando */
  let actions: HTMLElement;
  if (quoted) {
    actions = h('a', { class: 'btn btn--outline btn--block', href: waLink(`Hola Samplag, quisiera cotizar: ${name}.`), target: '_blank', rel: 'noopener' }, [icon('whatsapp'), 'Cotizar por WhatsApp']);
  } else if (!canBuy) {
    actions = h('button', { type: 'button', class: 'btn btn--block', disabled: 'disabled' }, soldOut ? 'Agotado' : 'No disponible en línea');
  } else {
    const addBtn = h('button', { type: 'button', class: 'btn btn--outline product__add', 'aria-label': `Agregar ${name} al carrito`, title: 'Agregar al carrito' }, [icon('cart'), h('span', { class: 'product__add-check' }, icon('check'))]);
    addBtn.addEventListener('click', () => {
      if (!addToCart(p, variant(), qty)) return;
      replay(addBtn, 'is-added');
      notify(`${qty} × ${name} agregado al carrito`);
      setQty(1);
    });
    const buyBtn = h('button', { type: 'button', class: 'btn btn--green product__buy' }, ['Comprar ahora', icon('arrow')]);
    buyBtn.addEventListener('click', () => {
      checkout([{ productId: p.id, quantity: qty, variant: variant() || undefined }], true);
    });
    actions = h('div', { class: 'product__actions' }, [buyBtn, addBtn]);
  }

  return h('article', { class: 'product', 'data-product': p.id }, [
    h('div', { class: 'product__media' }, [
      mainImg ?? h('div', { class: 'product__img product__img--empty' }, icon('image')),
      soldOut ? h('span', { class: 'product__badge' }, 'Agotado') : null,
      canBuy ? h('span', { class: 'product__ship' }, [icon('truck'), 'Delivery']) : null,
    ]),
    thumbs,
    h('div', { class: 'product__body' }, [
      p.category ? h('span', { class: 'product__cat' }, p.category) : null,
      h('h3', { class: 'product__name' }, name),
      p.description ? h('p', { class: 'product__desc', title: p.description }, p.description) : null,
      p.preparationDays ? h('p', { class: 'product__note' }, `Se prepara con ${p.preparationDays} día(s) de anticipación`) : null,
      variantSelect,
      h('div', { class: 'product__row' }, [priceEl, qtyEl]),
      actions,
    ]),
  ]);
};

/* ── Filtros ────────────────────────────────────────────────── */
const normalize = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const matches = (p: StoreProduct) => {
  if (view.category && p.category !== view.category) return false;
  // Entre filtros distintos se exigen todos; dentro de un filtro basta con uno de los valores
  for (const [id, values] of Object.entries(view.attrs)) {
    if (!values.length) continue;
    const attr = p.attributes?.find((a) => a.filter === id);
    if (!attr || !attr.values.some((v) => values.includes(v))) return false;
  }
  const q = normalize(view.query.trim());
  return !q || normalize(`${p.name} ${p.description ?? ''} ${p.category ?? ''}`).includes(q);
};

const sorted = (items: StoreProduct[]) => {
  const list = [...items];
  if (view.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (view.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (view.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return list;
};

const hasActiveFilters = () => !!view.category || !!view.query.trim() || Object.values(view.attrs).some((v) => v.length);

const clearFilters = () => {
  view.category = '';
  view.attrs = {};
  view.query = '';
  renderToolbars();
  renderGrids(true);
};

/** Filtros de uTracker que tienen al menos un producto con ese valor */
const usableFilters = () => filters
  .map((f) => ({ ...f, values: f.values.filter((v) => catalog.products.some((p) => p.attributes?.some((a) => a.filter === f.id && a.values.includes(v)))) }))
  .filter((f) => f.values.length);

const chip = (label: string, active: boolean, onclick: () => void, count?: number) => h('button', {
  type: 'button',
  class: `filter${active ? ' is-active' : ''}`,
  'aria-pressed': String(active),
  onclick,
}, [label, count !== undefined ? h('span', {}, count) : null]);

const toolbars = $$('[data-store-toolbar]');

const renderToolbars = () => {
  toolbars.forEach((bar) => {
    const groups: HTMLElement[] = [];
    const total = catalog.products.length;

    if (catalog.categories.length > 1) {
      groups.push(h('div', { class: 'shop-filter' }, [
        h('span', { class: 'shop-filter__label' }, 'Categoría'),
        h('div', { class: 'shop-filter__chips', role: 'group', 'aria-label': 'Categoría' }, [
          chip('Todos', !view.category, () => { view.category = ''; renderToolbars(); renderGrids(true); }, total),
          ...catalog.categories.map((c) => chip(c, view.category === c, () => {
            view.category = view.category === c ? '' : c;
            renderToolbars();
            renderGrids(true);
          }, catalog.products.filter((p) => p.category === c).length)),
        ]),
      ]));
    }

    usableFilters().forEach((f) => {
      const selected = view.attrs[f.id] ?? [];
      groups.push(h('div', { class: 'shop-filter' }, [
        h('span', { class: 'shop-filter__label' }, f.name),
        h('div', { class: 'shop-filter__chips', role: 'group', 'aria-label': f.name }, f.values.map((v) => chip(v, selected.includes(v), () => {
          view.attrs[f.id] = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
          renderToolbars();
          renderGrids(true);
        }))),
      ]));
    });

    // Búsqueda y orden: se conserva el campo existente para no perder el foco mientras se escribe
    let tools: HTMLElement | null = null;
    if (total >= SEARCH_MIN) {
      tools = bar.querySelector<HTMLElement>('.shop-tools');
      if (!tools) {
        const search = h('input', { type: 'search', class: 'shop-search', placeholder: 'Buscar producto…', 'aria-label': 'Buscar producto', value: view.query }) as HTMLInputElement;
        search.addEventListener('input', () => { view.query = search.value; renderGrids(true); syncSummary(); });
        const sort = h('select', { class: 'shop-sort', 'aria-label': 'Ordenar productos' }, [
          h('option', { value: 'default' }, 'Destacados'),
          h('option', { value: 'price-asc' }, 'Precio: menor a mayor'),
          h('option', { value: 'price-desc' }, 'Precio: mayor a menor'),
          h('option', { value: 'name' }, 'Nombre (A-Z)'),
        ]) as HTMLSelectElement;
        sort.value = view.sort;
        sort.addEventListener('change', () => { view.sort = sort.value; renderGrids(true); });
        tools = h('div', { class: 'shop-tools' }, [h('span', { class: 'shop-search__wrap' }, [icon('search'), search]), sort]);
      } else {
        tools.querySelector<HTMLInputElement>('.shop-search')!.value = view.query;
      }
    }

    const summary = h('div', { class: 'shop-summary', 'aria-live': 'polite' });
    bar.replaceChildren(...[tools, ...groups, summary].filter((n): n is HTMLElement => n !== null));
    bar.hidden = !groups.length && !tools;
    syncSummary();
  });
};

const syncSummary = () => {
  const shown = catalog.products.filter(matches).length;
  $$('.shop-summary').forEach((s) => s.replaceChildren(
    h('span', {}, `${shown} ${shown === 1 ? 'producto' : 'productos'}`),
    hasActiveFilters() ? h('button', { type: 'button', class: 'shop-clear', onclick: clearFilters }, 'Limpiar filtros') : '',
  ));
};

const renderGrids = (filtering = false) => {
  grids.forEach((grid) => {
    const limit = Number(grid.dataset.limit) || Infinity;
    const filterable = grid.hasAttribute('data-filterable');
    if (!catalog.products.length) {
      grid.replaceChildren(h('p', { class: 'products__empty' }, 'Pronto publicaremos nuestros productos. Mientras tanto, escríbenos por WhatsApp.'));
      return;
    }
    const items = filterable ? sorted(catalog.products.filter(matches)) : catalog.products.slice(0, limit);
    if (!items.length) {
      grid.replaceChildren(h('div', { class: 'products__empty' }, [
        h('p', {}, 'No hay productos con esos filtros.'),
        h('button', { type: 'button', class: 'btn btn--outline btn--sm', onclick: clearFilters }, 'Ver todos los productos'),
      ]));
      return;
    }
    const cards = items.map(productCard);
    grid.replaceChildren(...cards);
    // Cascada al aparecer por primera vez; al filtrar, una entrada más corta (interrumpible con WAAPI)
    if (!grid.dataset.shown || filtering) {
      cards.forEach((c, i) => c.animate(
        reduceMotion
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 0, transform: filtering ? 'translateY(8px) scale(.98)' : 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: filtering ? 320 : 450, delay: i * (filtering ? 40 : 60), easing: EASE_OUT, fill: 'backwards' },
      ));
    }
    grid.dataset.shown = '1';
  });
  if (filtering) syncSummary();
  $$('[data-store-status]').forEach((s) => {
    s.hidden = acceptsOrders;
  });
};

/* ── Carrito lateral ────────────────────────────────────────── */
const drawer = document.getElementById('cart');
const body = drawer ? $('#cart-body', drawer) : null;
const foot = drawer ? $('#cart-foot', drawer) : null;
let opener: HTMLElement | null = null;

const openCart = (from?: HTMLElement | null) => {
  if (!drawer) return;
  opener = from ?? (document.activeElement as HTMLElement);
  renderCart();
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('has-drawer');
  setTimeout(() => $<HTMLButtonElement>('[data-cart-close].drawer__close', drawer).focus({ preventScroll: true }), 50);
};
const closeCart = () => {
  if (!drawer?.classList.contains('is-open')) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('has-drawer');
  opener?.focus({ preventScroll: true });
};

const renderCart = () => {
  updateCount();
  renderBar();
  if (!body || !foot) return;

  if (done) {
    body.replaceChildren(h('div', { class: 'cart-done' }, [
      h('span', { class: 'cart-done__ic' }, icon('check')),
      h('h3', {}, '¡Pedido confirmado!'),
      h('p', {}, 'Gracias por tu compra. Te contactaremos para coordinar la entrega.'),
      done.trackingUrl ? h('a', { class: 'btn btn--green', href: done.trackingUrl, target: '_blank', rel: 'noopener' }, ['Ver mi pedido', icon('arrow')]) : null,
    ]));
    foot.replaceChildren();
    return;
  }

  if (!cart.length) {
    body.replaceChildren(h('div', { class: 'cart-empty' }, [
      h('span', { class: 'cart-empty__ic' }, icon('cart')),
      h('h3', {}, 'Tu carrito está vacío'),
      h('p', {}, 'Agrega productos para el control de plagas y los recibes en tu local o domicilio.'),
      location.pathname.startsWith('/tienda') ? null : h('a', { class: 'btn btn--outline', href: '/tienda' }, ['Ver productos', icon('arrow')]),
    ]));
    foot.replaceChildren();
    return;
  }

  body.replaceChildren(h('ul', { class: 'cart-lines' }, cart.map((l) => h('li', { class: 'cart-line' }, [
    l.image ? h('img', { class: 'cart-line__img', src: l.image, alt: '', width: 72, height: 72 }) : h('span', { class: 'cart-line__img' }),
    h('div', { class: 'cart-line__info' }, [
      h('p', { class: 'cart-line__name' }, cleanName(l.name)),
      l.variant ? h('p', { class: 'cart-line__variant' }, l.variant) : null,
      h('p', { class: 'cart-line__unit' }, `${money(l.price)} c/u`),
      h('div', { class: 'qty' }, [
        h('button', { type: 'button', class: 'qty__btn', 'aria-label': `Quitar una unidad de ${l.name}`, onclick: () => changeQty(l.key, -1) }, '−'),
        h('span', { class: 'qty__n', 'aria-live': 'polite' }, l.qty),
        h('button', { type: 'button', class: 'qty__btn', 'aria-label': `Agregar una unidad de ${l.name}`, onclick: () => changeQty(l.key, 1) }, '+'),
      ]),
    ]),
    h('div', { class: 'cart-line__side' }, [
      h('strong', {}, money(l.price * l.qty)),
      h('button', { type: 'button', class: 'cart-line__remove', 'aria-label': `Eliminar ${l.name}`, onclick: () => removeLine(l.key) }, 'Eliminar'),
    ]),
  ]))));

  const payBtn = h('button', {
    type: 'button',
    class: `btn btn--green btn--lg btn--block${paying ? ' is-loading' : ''}`,
    disabled: !acceptsOrders || paying ? 'disabled' : null,
    onclick: () => checkout(),
  }, paying ? 'Abriendo pago…' : ['Continuar con el pago', icon('arrow')]);

  // replaceChildren convertiría un null en el texto "null": se filtran los bloques que no aplican
  foot.replaceChildren(...[
    error ? h('p', { class: 'cart-error', role: 'alert' }, error) : null,
    !acceptsOrders ? h('p', { class: 'cart-error' }, 'Por ahora no estamos recibiendo pedidos en línea. Escríbenos por WhatsApp.') : null,
    h('div', { class: 'cart-total' }, [h('span', {}, 'Subtotal'), h('strong', {}, money(cartTotal()))]),
    h('p', { class: 'cart-note' }, 'El precio final y la entrega se confirman en el siguiente paso.'),
    payBtn,
    h('p', { class: 'cart-secure' }, [icon('shield'), 'Completas tus datos y la entrega en una ventana segura de uTracker.']),
  ].filter((n): n is HTMLElement => n !== null));
};

/* ── Pago ───────────────────────────────────────────────────── */
type CheckoutItem = { productId: string; quantity: number; variant?: string };
const BUY_NOW_KEY = 'samplag-buy-now';

/**
 * Abre el checkout de uTracker. Sin `items` paga el carrito; con `items` y `buyNow`
 * paga solo ese producto ("Comprar ahora") y deja el carrito como estaba.
 */
async function checkout(items?: CheckoutItem[], buyNow = false) {
  const lines = items ?? cart.map((l) => ({ productId: l.id, quantity: l.qty, variant: l.variant || undefined }));
  if (!lines.length || paying) return;
  // La ventana se abre dentro del clic: si se abre después del fetch, el navegador la bloquea
  const win = window.open('', 'utracker-checkout', 'width=520,height=760');
  paying = true;
  error = '';
  renderCart();
  try {
    sessionStorage.setItem(BUY_NOW_KEY, buyNow ? '1' : '');
  } catch { /* sin almacenamiento */ }
  try {
    const data = await storeApi<{ checkoutUrl: string }>('/storefront/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: lines, returnUrl: `${location.origin}/tienda?${THANKS_PARAM}=gracias` }),
    });
    if (win && !win.closed) win.location.href = data.checkoutUrl;
    else location.href = data.checkoutUrl; // ventana bloqueada: misma pestaña
  } catch (err) {
    win?.close();
    error = (err as Error).message;
    if (buyNow) notify(error, 'error');
    // Precio o stock cambiaron: se vuelve a pedir el catálogo
    refresh();
  } finally {
    paying = false;
    renderCart();
  }
}

const completeOrder = (trackingUrl?: string) => {
  let buyNow = false;
  try { buyNow = sessionStorage.getItem(BUY_NOW_KEY) === '1'; sessionStorage.removeItem(BUY_NOW_KEY); } catch { /* sin almacenamiento */ }
  // "Comprar ahora" no toca el carrito: solo se vacía si se pagó el carrito
  if (!buyNow) {
    cart = [];
    saveCart();
  }
  done = { trackingUrl };
  renderCart();
  openCart();
};

/* ── Aviso breve ("agregado al carrito") ────────────────────── */
let toast: HTMLElement | null = null;
let toastTimer = 0;
function notify(message: string, kind: 'ok' | 'error' = 'ok') {
  if (!toast) {
    toast = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(toast);
  }
  toast.className = `toast toast--${kind}`;
  toast.replaceChildren(...[
    h('span', { class: 'toast__ic' }, icon(kind === 'ok' ? 'check' : 'alert')),
    h('span', { class: 'toast__msg' }, message),
    kind === 'ok' ? h('button', { type: 'button', class: 'toast__btn', 'data-cart-open': '' }, 'Ver carrito') : null,
  ].filter((n): n is HTMLElement => n !== null));
  // Se fuerza el reflow para que la entrada se anime también si el aviso ya estaba visible
  toast.classList.remove('is-visible');
  void toast.offsetWidth;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast?.classList.remove('is-visible'), 3200);
}

/* ── Barra fija de pago (/tienda) ───────────────────────────── */
const bar = document.querySelector<HTMLElement>('[data-checkout-bar]');
const renderBar = () => {
  if (!bar) return;
  const n = cartCount();
  const show = n > 0 && !done;
  bar.hidden = !show;
  document.documentElement.classList.toggle('has-checkout-bar', show);
  if (!show) return;
  bar.replaceChildren(
    h('button', { type: 'button', class: 'checkout-bar__info', 'data-cart-open': '', 'aria-label': 'Ver carrito' }, [
      h('span', { class: 'checkout-bar__ic' }, [icon('cart'), h('span', { class: 'checkout-bar__count' }, n)]),
      h('span', { class: 'checkout-bar__text' }, [
        h('small', {}, `${n} ${n === 1 ? 'producto' : 'productos'}`),
        h('strong', {}, money(cartTotal())),
      ]),
    ]),
    h('button', {
      type: 'button',
      class: 'btn btn--green checkout-bar__pay',
      disabled: !acceptsOrders || paying ? 'disabled' : null,
      onclick: () => checkout(),
    }, paying ? 'Abriendo…' : ['Pagar', icon('arrow')]),
  );
};

// uTracker avisa a esta página cuando el cliente confirma el pedido en la ventana aparte
window.addEventListener('message', (e) => {
  if (!e.data || e.data.source !== 'utracker') return;
  if (e.data.type === 'checkout:completed') completeOrder(e.data.trackingUrl);
});

// Regreso desde el checkout en la misma pestaña (o desde el botón final de la ventana)
const DONE_KEY = 'samplag-order-done';
const params = new URLSearchParams(location.search);
if (params.get(THANKS_PARAM)) {
  history.replaceState(null, '', location.pathname);
  if (window.opener && window.name === 'utracker-checkout') {
    // Somos la ventana de pago: avisamos a la pestaña principal y nos cerramos
    try { localStorage.setItem(DONE_KEY, String(Date.now())); } catch { /* sin almacenamiento */ }
    cart = [];
    saveCart();
    window.close();
  } else {
    completeOrder();
  }
}
// Respaldo por si el mensaje de uTracker no llega: la ventana de pago deja una marca en el almacenamiento
window.addEventListener('storage', (e) => {
  if (e.key === DONE_KEY && e.newValue && !done) completeOrder();
});

/* ── Eventos ────────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  const openBtn = t.closest<HTMLElement>('[data-cart-open]');
  if (openBtn) { e.preventDefault(); openCart(openBtn); return; }
  if (t.closest('[data-cart-close]')) closeCart();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

/* ── Arranque ───────────────────────────────────────────────── */
async function refresh() {
  try {
    const [config, products] = await Promise.all([
      storeApi<StoreConfig>('/storefront/config'),
      storeApi<Catalog>('/storefront/products'),
    ]);
    acceptsOrders = config.store.acceptsOnlineOrders;
    filters = config.filters ?? [];
    catalog = { products: products.products ?? [], categories: products.categories ?? [] };
    // Si una categoría elegida ya no existe, se vuelve a ver todo
    if (view.category && !catalog.categories.includes(view.category)) view.category = '';
    reconcileCart();
    renderToolbars();
    renderGrids();
    renderCart();
  } catch (err) {
    // Sin conexión con la tienda: se mantiene lo que vino en el build
    if (!catalog.products.length) {
      grids.forEach((g) => g.replaceChildren(h('p', { class: 'products__empty' }, (err as Error).message)));
    }
  }
}

if (grids.length) {
  renderToolbars();
  renderGrids();
}
renderCart();
refresh();
