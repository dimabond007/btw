// Shop products.
// To put a product on sale: set image, price and forSale here, and its name and
// description under home.shop.items in messages/*.json.
// The price charged always comes from this file on the server, never from the browser.
// A product that is not forSale (or has no price) shows as "coming soon".
export type BtwProduct = {
  id: string; // key under home.shop.items
  image?: string; // e.g. '/images/shop/shirt.jpg'
  price?: number; // in shekels, VAT included
  forSale?: boolean; // true = can be bought on the site
  soldOut?: boolean; // true = shown, marked sold out, cannot be bought
  options?: string[]; // e.g. sizes: ['S', 'M', 'L', 'XL']
};

export const products: BtwProduct[] = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }];

export const MAX_QUANTITY = 10;

export function isBuyable(p: BtwProduct | undefined): p is BtwProduct & { price: number } {
  return Boolean(p && p.forSale && !p.soldOut && typeof p.price === 'number' && p.price > 0);
}
