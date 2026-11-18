import { ShopClient } from '@/components/btw/shop-client';
import { paymentsMode } from '@/lib/chatinvoice';

export const dynamic = 'force-dynamic';

// With a test key, buying is shown only at /shop?test=1, so a real customer on the
// live site can never "pay" with a simulated card by accident.
export default function ShopPage({ searchParams }: { searchParams: { test?: string } }) {
  const mode = paymentsMode();
  const open = mode === 'live' || (mode === 'test' && searchParams?.test === '1');
  return <ShopClient paymentsMode={open ? mode : 'off'} />;
}
