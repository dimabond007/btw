'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from './section-header';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Calendar, AlertTriangle, ChevronRight, Skull } from 'lucide-react';

export function TrainingClient() {
  const t = useTranslations('training');
  const locale = useLocale();
  const days = t.raw('structure.days') as any[];
  const principles = t.raw('unknown.principles') as string[];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('structure.title')} subtitle={t('structure.description')} />
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(days ?? [])?.map((day: any, i: number) => {
              const isFriday = i === 5;
              return (
                <StaggerItem key={i}>
                  <div className={`p-6 border h-full ${
                    isFriday
                      ? 'bg-red-900/20 border-red-800/30'
                      : 'bg-white/[0.02] border-white/[0.05]'
                  } hover:border-red-600/30 transition-all`}>
                    <div className="flex items-center gap-3 mb-4">
                      {isFriday ? (
                        <Skull className="w-5 h-5 text-red-600" />
                      ) : (
                        <Calendar className="w-5 h-5 text-red-600/60" />
                      )}
                      <span className="font-mono text-xs text-white/30 uppercase">{day?.day ?? ''}</span>
                    </div>
                    <h3 className={`font-display text-lg font-bold mb-2 ${isFriday ? 'text-red-500' : ''}`}>
                      {day?.focus ?? ''}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">{day?.description ?? ''}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Unknown Challenge Detail */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://cdn.abacus.ai/images/95d7ced8-f0d2-4bff-a6f9-1b4e578e04fb.png"
            alt="Boxing training"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('unknown.title')} />
          <FadeIn>
            <p className="text-center text-white/50 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              {t('unknown.description')}
            </p>
            <p className="text-center text-white/30 max-w-2xl mx-auto leading-relaxed mb-12">
              {t('unknown.purpose')}
            </p>
          </FadeIn>
          <div className="max-w-2xl mx-auto space-y-4">
            {(principles ?? [])?.map((p: string, i: number) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                  <span className="text-white/60">{p}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-800 text-center">
        <FadeIn>
          <Link
            href={`/${locale}/apply`}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold text-sm tracking-wider uppercase hover:bg-white/90 transition-colors"
          >
            Apply Now <ChevronRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
