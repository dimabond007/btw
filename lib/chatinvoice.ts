import 'server-only';

// ChatInvoice Payments API — SERVER ONLY. The key lives in the CHATINVOICE_API_KEY
// environment variable and must never reach the browser.
// Guide: https://api.chat-invoice.co.il/docs/payments
const BASE = 'https://api.chat-invoice.co.il/v1';

export type PaymentsMode = 'off' | 'test' | 'live';

export function paymentsMode(): PaymentsMode {
  const key = process.env.CHATINVOICE_API_KEY ?? '';
  if (key.startsWith('ci_live_')) return 'live';
  if (key.startsWith('ci_test_')) return 'test';
  return 'off';
}

export class ChatInvoiceError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}

export async function ci<T = any>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
  idempotencyKey?: string
): Promise<T> {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.CHATINVOICE_API_KEY}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ChatInvoiceError(
      data?.error?.code ?? 'unknown',
      data?.error?.hint || data?.error?.message || `HTTP ${res.status}`,
      res.status
    );
  }
  return data as T;
}
