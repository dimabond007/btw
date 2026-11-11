// Shop products shown on the landing page.
// To put a product on sale: fill in image, price and url (the payment link) here,
// and its name and description under home.shop.items in messages/*.json.
// A product without a url shows as "coming soon" and cannot be bought.
export type BtwProduct = {
  id: string; // key under home.shop.items
  image?: string; // e.g. '/images/shop/shirt.jpg'
  price?: number; // in shekels
  url?: string; // payment link; leave empty until payments are connected
};

export const products: BtwProduct[] = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }];
