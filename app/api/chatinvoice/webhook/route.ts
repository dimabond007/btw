import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { hasDb, settleBySession } from '@/lib/shop-db';

export const dynamic = 'force-dynamic';

// ChatInvoice calls this when a payment goes through, so an order is marked paid
// even if the customer closes the browser before reaching the thank-you page.
// The body is only a hint: the truth is fetched from ChatInvoice by settleBySession.
export async function POST(req: NextRequest) {
  const raw = await req.text();

  const secret = process.env.CHATINVOICE_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get('chatinvoice-signature') ?? '';
    const t = header.match(/t=(\d+)/)?.[1] ?? '';
    const v1 = header.match(/v1=([a-f0-9]+)/)?.[1] ?? '';
    const expected = createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex');
    const fresh = Math.abs(Date.now() / 1000 - Number(t)) < 300;
    const a = Buffer.from(v1);
    const b = Buffer.from(expected);
    if (!fresh || a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: 'bad_signature' }, { status: 401 });
    }
  }

  let evt: any = null;
  try {
    evt = JSON.parse(raw);
  } catch {}

  if (hasDb() && evt?.object === 'checkout' && typeof evt.object_id === 'string' && /^cs_[A-Za-z0-9_-]{6,}$/.test(evt.object_id)) {
    try {
      await settleBySession(evt.object_id);
    } catch (e) {
      console.error('webhook settle failed', e);
      return NextResponse.json({ error: 'retry' }, { status: 500 }); // ChatInvoice retries
    }
  }
  return new NextResponse('ok');
}
