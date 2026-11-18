import { adminConfigured, isAdmin } from '@/lib/admin-auth';
import { getStock, hasDb, sweep } from '@/lib/shop-db';
import { prisma } from '@/lib/prisma';
import { products } from '@/lib/products';
import { AdminClient, AdminLogin, AdminNotice } from '@/components/btw/admin-client';
import he from '@/messages/he.json';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'BTW – ניהול חנות', robots: { index: false, follow: false } };

// The owners' screen: orders and stock. Hebrew only, behind one shared password.
export default async function AdminPage() {
  if (!adminConfigured() || !hasDb()) {
    return <AdminNotice text="מסך הניהול עוד לא מחובר בסביבה הזו (חסרים סיסמה או מסד נתונים)." />;
  }
  if (!isAdmin()) return <AdminLogin />;

  await sweep(true).catch(() => {});
  const [orders, stock] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: ['paid', 'collected', 'cancelled'] } },
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
    getStock(),
  ]);
  const waiting = await prisma.order.count({ where: { status: 'pending' } });

  const names = (he as any).home.shop.items as Record<string, { name: string }>;
  const catalog = products.map((p) => ({
    id: p.id,
    name: names[p.id]?.name ?? p.id,
    price: p.price ?? null,
    forSale: Boolean(p.forSale),
    options: p.options?.length ? p.options : [''],
  }));

  return (
    <AdminClient
      orders={orders.map((o) => ({
        id: o.id,
        productName: o.productName,
        option: o.option,
        quantity: o.quantity,
        amount: o.amount,
        name: o.name,
        phone: o.phone,
        email: o.email,
        status: o.status as 'paid' | 'collected' | 'cancelled',
        receiptUrl: o.receiptUrl,
        test: o.test,
        createdAt: o.createdAt.toISOString(),
        collectedAt: o.collectedAt?.toISOString() ?? null,
      }))}
      stock={stock}
      catalog={catalog}
      waitingForPayment={waiting}
    />
  );
}
