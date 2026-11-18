import { NextRequest, NextResponse } from 'next/server';
import { ci, ChatInvoiceError, paymentsMode } from '@/lib/chatinvoice';
import { products, isBuyable, MAX_QUANTITY } from '@/lib/products';
import { prisma } from '@/lib/prisma';
import { hasDb, release, reserve, sweep, SESSION_MINUTES } from '@/lib/shop-db';
import { locales } from '@/i18n';
import he from '@/messages/he.json';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Creates a ChatInvoice checkout session for one product and returns its payment page.
// The browser sends only the product id, quantity, chosen size and the buyer's details;
// the price and the product name come from the server. With a database, the units are
// reserved here and the order is recorded as waiting for payment.
export async function POST(req: NextRequest) {
  const mode = paymentsMode();
  if (mode === 'off') {
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
  if (product.options?.length ? !product.options.includes(option) : option !== '') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  // The receipt is a Hebrew document, so the line uses the Hebrew product name.
  const names = (he as any).home.shop.items as Record<string, { name: string }>;
  const productName = names[product.id]?.name ?? product.id;
  const lineName = [productName, option].filter(Boolean).join(' · ');
  const db = hasDb();

  if (db) {
    await sweep().catch(() => {});
    // The same order form submitted twice gets the same payment page.
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (existing) {
      return existing.status === 'pending' && existing.sessionUrl
        ? NextResponse.json({ url: existing.sessionUrl })
        : NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
    if (!(await reserve(product.id, option, quantity))) {
      return NextResponse.json({ error: 'out_of_stock' }, { status: 409 });
    }
    await prisma.order.create({
      data: {
        id: orderId,
        productId: product.id,
        productName,
        option,
        quantity,
        amount: product.price * quantity,
        name,
        phone,
        email: email || null,
        test: mode === 'test',
        locale,
      },
    });
  }

  const origin = req.nextUrl.origin;
  const session = {
    mode: 'charge',
    items: [{ name: lineName, price: product.price, quantity }],
    customer: { name, phone, ...(email ? { email } : {}) },
    expires_in_minutes: SESSION_MINUTES,
    metadata: { order_id: orderId, product_id: product.id, option, quantity: String(quantity) },
  };
  const urls = {
    success_url: `${origin}/${locale}/shop/thanks`,
    cancel_url: `${origin}/${locale}/shop`,
  };

  try {
    let created: { id: string; url: string };
    try {
      created = await ci('POST', '/checkout', { ...session, ...urls }, `order_${orderId}`);
    } catch (e) {
      // On a domain the key is not registered for (a preview copy), fall back to
      // ChatInvoice's own thank-you page instead of failing the purchase.
      if (!(e instanceof ChatInvoiceError) || e.code !== 'url_not_allowed') throw e;
      created = await ci('POST', '/checkout', session, `order_${orderId}_plain`);
    }
    if (db) {
      await prisma.order.update({ where: { id: orderId }, data: { sessionId: created.id, sessionUrl: created.url } });
    }
    return NextResponse.json({ url: created.url });
  } catch (e) {
    console.error('checkout failed', e instanceof ChatInvoiceError ? `${e.code}: ${e.message}` : e);
    if (db) {
      // No payment page was created: forget the order and put the units back.
      const gone = await prisma.order.deleteMany({ where: { id: orderId, status: 'pending', sessionId: null } });
      if (gone.count === 1) await release(product.id, option, quantity);
    }
    return NextResponse.json({ error: 'provider' }, { status: 502 });
  }
}
