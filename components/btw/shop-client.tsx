'use client';

import Image from 'next/image';
import { MotionConfig } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-context';
import { Rise, Up } from './motion';
import { products } from '@/lib/products';

const RED = '#c41e2a';

// The shop page. Products and their payment links are set in lib/products.ts.
export function ShopClient() {
  const t = useTranslations('home');

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
            const onSale = Boolean(p.url);
            return (
              <Up key={p.id} delay={i * 0.12} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={t(`shop.items.${p.id}.name`)}
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                  {!onSale && (
                    <span className="absolute top-4 start-4 px-3 py-1.5 text-xs font-bold text-white" style={{ background: RED }}>
                      {t('shop.soon')}
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
                {onSale ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white hover:brightness-110 transition"
                    style={{ background: RED }}
                  >
                    {t('shop.buy')}
                    <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                  </a>
                ) : (
                  <div className="mt-4 w-full border border-black/20 px-6 py-3.5 text-center text-sm font-bold text-black/40">
                    {t('shop.soon')}
                  </div>
                )}
              </Up>
            );
          })}
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
