import { ShopClient } from '@/components/btw/shop-client';
import { paymentsMode } from '@/lib/chatinvoice';
import { getStock, hasDb, sweep, type StockMap } from '@/lib/shop-db';

export const dynamic = 'force-dynamic';

// With a test key, buying is shown only at /shop?test=1, so a real customer on the
// live site can never "pay" with a simulated card by accident.
export default async function ShopPage({ searchParams }: { searchParams: { test?: string } }) {
  const mode = paymentsMode();
  const open = mode === 'live' || (mode === 'test' && searchParams?.test === '1');

  // null = no database: the shop sells without counting stock.
  let stock: StockMap | null = null;
  if (hasDb()) {
    try {
      await sweep();
      stock = await getStock();
    } catch (e) {
      console.error('stock unavailable', e);
    }
  }

  return <ShopClient paymentsMode={open ? mode : 'off'} stock={stock} />;
}
