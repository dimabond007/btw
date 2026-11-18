import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { hasDb } from '@/lib/shop-db';
import { products } from '@/lib/products';

export const dynamic = 'force-dynamic';

// Sets how many units of a product (in one size) are on the shelf.
export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasDb()) return NextResponse.json({ error: 'no_db' }, { status: 503 });

  const body = await req.json().catch(() => null);
  const product = products.find((p) => p.id === body?.productId);
  const option = typeof body?.option === 'string' ? body.option : '';
  const quantity = body?.quantity;
  const validOption = product?.options?.length ? product.options.includes(option) : option === '';
  if (!product || !validOption || !Number.isInteger(quantity) || quantity < 0 || quantity > 9999) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  await prisma.stock.upsert({
    where: { productId_option: { productId: product.id, option } },
    update: { quantity },
    create: { productId: product.id, option, quantity },
  });
  return NextResponse.json({ ok: true });
}
