'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n-context';

const RED = '#c41e2a';

export type ThanksState =
  | { status: 'paid'; amount: number; items: { name: string; quantity: number }[]; receiptUrl: string | null; test: boolean }
  | { status: 'unpaid' }
  | { status: 'unknown' };

export function ShopThanksClient({ state }: { state: ThanksState }) {
  const t = useTranslations('home');
  const locale = useLocale();
  const paid = state.status === 'paid';

  return (
    <section className="min-h-[100dvh] bg-[#ebe6dc] text-[#111] pt-36 pb-24 md:pt-48">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        {paid && state.test && (
          <div className="mb-8 inline-block bg-yellow-300 px-3 py-1.5 text-sm font-bold">{t('shop.checkout.testNote')}</div>
        )}
        <div className="h-[3px] w-16" style={{ background: RED }} />
        <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[1.02]">
          {paid ? t('shop.thanks.paidTitle') : t('shop.thanks.unpaidTitle')}
        </h1>
        <p className="mt-6 text-xl md:text-2xl font-light text-black/70 leading-relaxed">
          {paid ? t('shop.thanks.paidText') : t('shop.thanks.unpaidText')}
        </p>

        {paid && (
          <div className="mt-10 border-y border-black/15 py-6">
            {state.items.map((item, i) => (
              <div key={i} className="flex items-baseline justify-between gap-6 py-1.5 text-lg">
                <span className="font-bold">{item.name}</span>
                <span dir="ltr" className="text-black/60">
                  × {item.quantity}
                </span>
              </div>
            ))}
            <div className="mt-4 flex items-baseline justify-between gap-6">
              <span className="text-black/60">{t('shop.thanks.total')}</span>
              <span dir="ltr" className="font-display text-3xl font-bold">
                ₪{state.amount}
              </span>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {paid && state.receiptUrl && (
            <a
              href={state.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 text-sm font-bold text-white hover:brightness-110 transition"
              style={{ background: RED }}
            >
              {t('shop.thanks.receipt')}
            </a>
          )}
          <Link href={`/${locale}/shop`} className="px-7 py-4 text-sm font-bold border border-black/30 hover:bg-black hover:text-white transition-colors">
            {t('shop.thanks.back')}
          </Link>
          <a
            href={`https://wa.me/${t('contact.wa')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-black/70 hover:text-black"
          >
            <MessageCircle className="w-4 h-4" style={{ color: RED }} />
            {t('shop.thanks.help')}
          </a>
        </div>
      </div>
    </section>
  );
}
