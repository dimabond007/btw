import 'server-only';
import { prisma } from '@/lib/prisma';
import { ci } from '@/lib/chatinvoice';
import { products } from '@/lib/products';

// Stock and orders. Everything here needs the database; when DATABASE_URL is not
// set the shop falls back to selling without stock tracking or an orders list.
export const hasDb = () => Boolean(process.env.DATABASE_URL);

export const SESSION_MINUTES = 30; // how long a payment page stays open
const EXPIRE_AFTER_MS = (SESSION_MINUTES + 10) * 60 * 1000;

export type StockMap = Record<string, Record<string, number>>;

/** Units on hand, per product and size. Missing rows count as zero. */
export async function getStock(): Promise<StockMap> {
  const rows = await prisma.stock.findMany();
  const map: StockMap = {};
  for (const p of products) {
    map[p.id] = {};
    for (const o of p.options?.length ? p.options : ['']) map[p.id][o] = 0;
  }
  for (const r of rows) {
    if (map[r.productId] && r.option in map[r.productId]) map[r.productId][r.option] = Math.max(0, r.quantity);
  }
  return map;
}

/** Takes units off the shelf for an order about to be paid. False = not enough left. */
export async function reserve(productId: string, option: string, quantity: number): Promise<boolean> {
  const res = await prisma.stock.updateMany({
    where: { productId, option, quantity: { gte: quantity } },
    data: { quantity: { decrement: quantity } },
  });
  return res.count === 1;
}

export async function release(productId: string, option: string, quantity: number) {
  await prisma.stock.upsert({
    where: { productId_option: { productId, option } },
    update: { quantity: { increment: quantity } },
    create: { productId, option, quantity },
  });
}

/**
 * Asks ChatInvoice whether an order's payment went through and records the answer.
 * Safe to call any number of times, from the thank-you page, the webhook and the sweep.
 */
export async function settleBySession(sessionId: string): Promise<'paid' | 'unpaid' | 'unknown'> {
  const order = await prisma.order.findUnique({ where: { sessionId } });
  if (!order) return 'unknown';
  if (order.status === 'paid' || order.status === 'collected') return 'paid';

  const co = await ci<any>('GET', `/checkout/${sessionId}`);
  if (co.status !== 'paid') return 'unpaid';

  const receiptUrl = co.document?.view_url ?? co.document?.pdf_url ?? null;
  const updated = await prisma.order.updateMany({
    where: { id: order.id, status: { in: ['pending', 'expired'] } },
    data: { status: 'paid', paidAt: new Date(), receiptUrl },
  });
  // A payment that arrived after the order had expired: its units were already put
  // back on the shelf, so take them off again (stock may go below zero; the admin
  // screen shows it).
  if (updated.count === 1 && order.status === 'expired') {
    await prisma.stock.updateMany({
      where: { productId: order.productId, option: order.option },
      data: { quantity: { decrement: order.quantity } },
    });
  }
  return 'paid';
}

let lastSweep = 0;

/**
 * Looks at orders still waiting for payment: marks the paid ones, and returns the
 * units of those whose payment page has expired. Runs at most once a minute.
 */
export async function sweep(force = false) {
  if (!force && Date.now() - lastSweep < 60_000) return;
  lastSweep = Date.now();
  const pending = await prisma.order.findMany({
    where: { status: 'pending', createdAt: { lt: new Date(Date.now() - 60_000) } },
    orderBy: { createdAt: 'asc' },
    take: 15,
  });
  for (const o of pending) {
    try {
      const state = o.sessionId ? await settleBySession(o.sessionId) : 'unpaid';
      if (state !== 'paid' && Date.now() - o.createdAt.getTime() > EXPIRE_AFTER_MS) {
        const expired = await prisma.order.updateMany({ where: { id: o.id, status: 'pending' }, data: { status: 'expired' } });
        if (expired.count === 1) await release(o.productId, o.option, o.quantity);
      }
    } catch (e) {
      console.error('sweep failed for order', o.id, e);
    }
  }
}
