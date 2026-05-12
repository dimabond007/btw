'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import { SectionHeader } from './section-header';
import { Pyramid } from './pyramid';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Shield, Zap, Wind, Heart, Flame, ChevronRight } from 'lucide-react';

const icons = [Shield, Zap, Wind, Heart, Flame];

export function SystemClient() {
  const t = useTranslations('system');
  const locale = useLocale();
  const pillars = t.raw('pillars.items') as any[];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('doctrine.title')} />
          <FadeIn>
            <p className="text-center text-white/50 text-lg max-w-3xl mx-auto leading-relaxed">
              {t('doctrine.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('pillars.title')} />
          <Stagger className="space-y-6">
            {(pillars ?? [])?.map((pillar: any, i: number) => {
              const Icon = icons?.[i] ?? Shield;
              return (
                <StaggerItem key={i}>
                  <div className="bg-white/[0.02] border border-white/[0.05] p-8 hover:border-red-600/20 transition-all">
                    <div className="flex items-start gap-6">
                      <Icon className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-display text-2xl font-bold tracking-tight mb-2">
                          {pillar?.title ?? ''}
                        </h3>
                        <p className="text-white/50 mb-3">{pillar?.description ?? ''}</p>
                        <p className="text-white/30 text-sm leading-relaxed">{pillar?.detail ?? ''}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('pyramid.title')} subtitle={t('pyramid.description')} />
          <Pyramid />
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
