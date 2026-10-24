// Tienda en línea: conexión con uTracker (catálogo, carrito y checkout)
// La llave es publicable: solo permite leer el catálogo y crear sesiones de pago.
export const STORE_API = 'https://utracker-api.unify-tc.com/api';
export const STORE_KEY = 'utk_live_e4395433292036e89cfe3ac241df9171e791';

export interface StoreVariant {
  name: string;
  price: number;
}

export interface StoreProduct {
  id: string;
  kind: 'product' | 'service';
  name: string;
  description?: string;
  price: number;
  pricingMode: 'fixed' | 'quoted';
  images: string[];
  category?: string;
  variants: StoreVariant[];
  inStock: boolean;
  stock: number | null;
  preparationDays?: number;
  /** Valores de los filtros de /config, por id de filtro */
  attributes?: { filter: string; values: string[] }[];
}

/** Filtro creado en uTracker (por ejemplo "Tipo de plaga": Roedores, Aves) */
export interface StoreFilter {
  id: string;
  name: string;
  values: string[];
}

export interface StoreConfig {
  store: {
    name: string;
    acceptsOnlineOrders: boolean;
    deliveryTypes: string[];
  };
  filters?: StoreFilter[];
}

export interface Catalog {
  products: StoreProduct[];
  categories: string[];
}

export const storeApi = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = { 'X-Store-Key': STORE_KEY };
  if (init.body) headers['Content-Type'] = 'application/json';
  const res = await fetch(STORE_API + path, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || 'No se pudo conectar con la tienda');
  return data as T;
};

/** Catálogo leído en el build: sirve para el SEO y para pintar la tienda sin esperar a la API */
export const loadCatalog = async (): Promise<Catalog> => {
  try {
    const data = await storeApi<Catalog>('/storefront/products');
    return { products: data.products ?? [], categories: data.categories ?? [] };
  } catch {
    return { products: [], categories: [] };
  }
};

export const money = (n: number) => `S/ ${Number(n || 0).toFixed(2)}`;
