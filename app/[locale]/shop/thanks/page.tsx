import { ShopThanksClient, type ThanksState } from '@/components/btw/shop-thanks-client';
import { ci, paymentsMode } from '@/lib/chatinvoice';
import { hasDb, settleBySession } from '@/lib/shop-db';

export const dynamic = 'force-dynamic';

// The customer lands here after the payment page. Arriving here proves nothing:
// the payment counts only if ChatInvoice itself says the session is paid.
export default async function ShopThanksPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams?.session_id ?? '';
  let state: ThanksState = { status: 'unknown' };

  if (paymentsMode() !== 'off' && /^cs_[A-Za-z0-9_-]{6,}$/.test(sessionId)) {
    try {
      // Records the payment on the order (and keeps the stock right) before showing it.
      if (hasDb()) await settleBySession(sessionId);
      const co = await ci<any>('GET', `/checkout/${sessionId}`);
      state =
        co.status === 'paid'
          ? {
              status: 'paid',
              amount: co.amount,
              items: (co.items ?? []).map((i: any) => ({ name: i.name, quantity: i.quantity ?? 1 })),
              receiptUrl: co.document?.view_url ?? co.document?.pdf_url ?? null,
              test: co.livemode === false,
            }
          : { status: 'unpaid' };
    } catch {
      state = { status: 'unknown' };
    }
  }

  return <ShopThanksClient state={state} />;
}
