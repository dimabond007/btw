import { NextRequest, NextResponse } from 'next/server';
import { ci, ChatInvoiceError, paymentsMode } from '@/lib/chatinvoice';
import { products, isBuyable, MAX_QUANTITY } from '@/lib/products';
import { locales } from '@/i18n';
import he from '@/messages/he.json';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Creates a ChatInvoice checkout session for one product and returns its payment page.
// The browser sends only the product id, quantity, chosen option and the buyer's details;
// the price and the product name come from the server.
export async function POST(req: NextRequest) {
  if (paymentsMode() === 'off') {
    return NextResponse.json({ error: 'payments_off' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const product = products.find((p) => p.id === body?.productId);
  if (!isBuyable(product)) {
    return NextResponse.json({ error: 'not_for_sale' }, { status: 400 });
  }

  const quantity = Number.isInteger(body?.quantity) ? body.quantity : 1;
  const name = clean(body?.name, 80);
  const phone = clean(body?.phone, 20).replace(/[^\d+]/g, '');
  const email = clean(body?.email, 120);
  const option = clean(body?.option, 30);
  const orderId = clean(body?.orderId, 64).replace(/[^A-Za-z0-9_-]/g, '');
  const locale = (locales as readonly string[]).includes(body?.locale) ? body.locale : 'he';

  if (quantity < 1 || quantity > MAX_QUANTITY || name.length < 2 || phone.length < 9 || orderId.length < 8) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (product.options?.length && !product.options.includes(option)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  // The receipt is a Hebrew document, so the line uses the Hebrew product name.
  const items = (he as any).home.shop.items as Record<string, { name: string }>;
  const lineName = [items[product.id]?.name ?? product.id, option].filter(Boolean).join(' · ');

  const origin = req.nextUrl.origin;
  const session = {
    mode: 'charge',
    items: [{ name: lineName, price: product.price, quantity }],
    customer: { name, phone, ...(email ? { email } : {}) },
    metadata: { order_id: orderId, product_id: product.id, option, quantity: String(quantity) },
  };
  const urls = {
    success_url: `${origin}/${locale}/shop/thanks`,
    cancel_url: `${origin}/${locale}/shop`,
  };

  try {
    let created: { url: string };
    try {
      created = await ci('POST', '/checkout', { ...session, ...urls }, `order_${orderId}`);
    } catch (e) {
      // On a domain the key is not registered for (a preview copy), fall back to
      // ChatInvoice's own thank-you page instead of failing the purchase.
      if (!(e instanceof ChatInvoiceError) || e.code !== 'url_not_allowed') throw e;
      created = await ci('POST', '/checkout', session, `order_${orderId}_plain`);
    }
    return NextResponse.json({ url: created.url });
  } catch (e) {
    console.error('checkout failed', e instanceof ChatInvoiceError ? `${e.code}: ${e.message}` : e);
    return NextResponse.json({ error: 'provider' }, { status: 502 });
  }
}
