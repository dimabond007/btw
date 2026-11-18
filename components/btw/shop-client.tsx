'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowUpRight, Lock, Minus, Plus, X } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n-context';
import { Rise, Up } from './motion';
import { products, isBuyable, MAX_QUANTITY, type BtwProduct } from '@/lib/products';

const RED = '#c41e2a';
const EASE = [0.22, 1, 0.36, 1] as const;

type Mode = 'off' | 'test' | 'live';

function newOrderId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/** The order form. It collects who is buying; the card itself is entered on ChatInvoice's page. */
function BuyDialog({ product, mode, onClose }: { product: BtwProduct & { price: number }; mode: Mode; onClose: () => void }) {
  const t = useTranslations('home');
  const locale = useLocale();
  // One id per opened form, so a double click can never create two charges.
  const [orderId] = useState(newOrderId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [option, setOption] = useState(product.options?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (name.trim().length < 2 || phone.replace(/[^\d]/g, '').length < 9) {
      setError(t('shop.checkout.errorInvalid'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity, option, name, phone, email, orderId, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) throw new Error(data?.error ?? 'failed');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message === 'invalid' ? t('shop.checkout.errorInvalid') : t('shop.checkout.errorGeneral'));
      setBusy(false);
    }
  };

  const field = 'mt-1.5 w-full border border-black/25 bg-white px-4 py-3 text-base outline-none focus:border-black';

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full sm:max-w-md max-h-[92dvh] overflow-y-auto bg-[#ebe6dc] text-[#111] p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        <button type="button" onClick={onClose} aria-label={t('shop.checkout.close')} className="absolute top-4 end-4 p-1 text-black/50 hover:text-black">
          <X className="w-5 h-5" />
        </button>

        {mode === 'test' && <div className="mb-4 inline-block bg-yellow-300 px-3 py-1 text-xs font-bold">{t('shop.checkout.testNote')}</div>}
        <div className="text-xs tracking-[0.25em] uppercase text-black/50">{t('shop.checkout.title')}</div>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-black">{t(`shop.items.${product.id}.name`)}</h2>
          <span dir="ltr" className="font-display text-2xl font-bold shrink-0">
            ₪{product.price}
          </span>
        </div>

        <label className="mt-6 block text-sm font-bold">
          {t('shop.checkout.name')}
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="mt-4 block text-sm font-bold">
          {t('shop.checkout.phone')}
          <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required />
        </label>
        <label className="mt-4 block text-sm font-bold">
          {t('shop.checkout.email')}
          <input className={field} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" dir="ltr" />
        </label>

        {product.options && product.options.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-bold">{t('shop.checkout.option')}</div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {product.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOption(o)}
                  className={`min-w-[3rem] border px-3 py-2 text-sm font-bold transition-colors ${
                    option === o ? 'border-black bg-black text-white' : 'border-black/25 bg-white hover:border-black'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-bold">{t('shop.checkout.quantity')}</div>
          <div dir="ltr" className="flex items-center border border-black/25 bg-white">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 disabled:opacity-30" disabled={quantity <= 1} aria-label="-">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              className="p-3 disabled:opacity-30"
              disabled={quantity >= MAX_QUANTITY}
              aria-label="+"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-baseline justify-between border-t border-black/15 pt-4">
          <span className="text-black/60">{t('shop.checkout.total')}</span>
          <span dir="ltr" className="font-display text-3xl font-bold">
            ₪{product.price * quantity}
          </span>
        </div>

        {error && <p className="mt-4 text-sm font-bold" style={{ color: RED }}>{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          style={{ background: RED }}
        >
          <Lock className="w-4 h-4" />
          {busy ? t('shop.checkout.sending') : t('shop.checkout.pay')}
        </button>
        <p className="mt-3 text-xs text-black/50 leading-relaxed">{t('shop.checkout.secure')}</p>
      </motion.form>
    </motion.div>
  );
}

// The shop page. Products are set in lib/products.ts; payments go through /api/checkout.
export function ShopClient({ paymentsMode = 'off' }: { paymentsMode?: Mode }) {
  const t = useTranslations('home');
  const [buying, setBuying] = useState<(BtwProduct & { price: number }) | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="btw-grain" aria-hidden />
      <section className="min-h-[100dvh] bg-[#ebe6dc] text-[#111] pt-36 pb-24 md:pt-48 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Up onMount>
            <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-black/50">
              <span className="h-px w-10" style={{ background: RED }} />
              <span>{t('shop.label')}</span>
            </div>
          </Up>
          <div className="mt-6 grid md:grid-cols-2 gap-6 items-end">
            <h1 className="text-5xl md:text-8xl font-black leading-[1.02]">
              <Rise onMount>{t('shop.title')}</Rise>
            </h1>
            <Up delay={0.15}>
              <p className="text-xl font-light text-black/65 md:text-end">{t('shop.text')}</p>
            </Up>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => {
              // A product can be bought only when it is marked for sale AND payments are connected.
              const buyable = isBuyable(p) && paymentsMode !== 'off';
              const badge = p.soldOut ? t('shop.soldOut') : buyable ? '' : t('shop.soon');
              return (
                <Up key={p.id} delay={i * 0.12} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={t(`shop.items.${p.id}.name`)}
                        fill
                        sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${p.soldOut ? 'grayscale opacity-60' : ''}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/favicon.png"
                          alt=""
                          width={120}
                          height={120}
                          className="opacity-25 transition-all duration-700 group-hover:opacity-60 group-hover:scale-110"
                        />
                      </div>
                    )}
                    {badge && (
                      <span className="absolute top-4 start-4 px-3 py-1.5 text-xs font-bold text-white" style={{ background: p.soldOut ? '#111' : RED }}>
                        {badge}
                      </span>
                    )}
                    <span className="absolute bottom-4 end-4 font-mono text-xs tracking-[0.2em] text-white/40">0{i + 1}</span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-black">{t(`shop.items.${p.id}.name`)}</div>
                      <p className="mt-1 text-black/55 leading-relaxed">{t(`shop.items.${p.id}.text`)}</p>
                    </div>
                    {p.price != null && (
                      <div dir="ltr" className="font-display text-2xl font-bold shrink-0">
                        ₪{p.price}
                      </div>
                    )}
                  </div>
                  {buyable && isBuyable(p) ? (
                    <button
                      onClick={() => setBuying(p)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white hover:brightness-110 transition"
                      style={{ background: RED }}
                    >
                      {t('shop.buy')}
                      <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                  ) : (
                    <div className="mt-4 w-full border border-black/20 px-6 py-3.5 text-center text-sm font-bold text-black/40">
                      {badge || t('shop.soon')}
                    </div>
                  )}
                </Up>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {buying && <BuyDialog product={buying} mode={paymentsMode} onClose={() => setBuying(null)} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
