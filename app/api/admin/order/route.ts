import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { hasDb, release } from '@/lib/shop-db';

export const dynamic = 'force-dynamic';

// Changes an order's status from the orders screen.
export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: 'no_db' }, { status: 503 });

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id : '';
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  if (body?.action === 'collected' && order.status === 'paid') {
    await prisma.order.update({ where: { id }, data: { status: 'collected', collectedAt: new Date() } });
  } else if (body?.action === 'uncollect' && order.status === 'collected') {
    await prisma.order.update({ where: { id }, data: { status: 'paid', collectedAt: null } });
  } else if (body?.action === 'cancel' && (order.status === 'paid' || order.status === 'collected')) {
    // Marks the order cancelled and puts its units back on the shelf. The refund
    // itself is done by the owner in Cardcom, with a credit note in ChatInvoice.
    const done = await prisma.order.updateMany({ where: { id, status: order.status }, data: { status: 'cancelled' } });
    if (done.count === 1) await release(order.productId, order.option, order.quantity);
  } else {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
