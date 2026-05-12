'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from './section-header';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Shield, Dumbbell, Swords, Brain, Users, ChevronRight } from 'lucide-react';

const benefitIcons = [Shield, Dumbbell, Swords, Brain];

export function KidsClient() {
  const t = useTranslations('kids');
  const locale = useLocale();
  const benefits = t.raw('benefits.items') as any[];
  const ageGroups = t.raw('ages.groups') as any[];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      {/* Intro */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <SlideIn from="left">
              <div className="relative aspect-[4/3] bg-muted rounded">
                <Image
                  src="https://cdn.abacus.ai/images/73bc6e44-74f2-47f7-82f1-a5ce96b51995.png"
                  alt="Kids martial arts training"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </SlideIn>
            <div>
              <FadeIn>
                <Users className="w-8 h-8 text-red-600 mb-6" />
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-6">
                  {t('intro.title')}
                </h2>
                <p className="text-white/50 leading-relaxed">{t('intro.description')}</p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('benefits.title')} />
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(benefits ?? [])?.map((b: any, i: number) => {
              const Icon = benefitIcons?.[i] ?? Shield;
              return (
                <StaggerItem key={i}>
                  <div className="bg-white/[0.02] border border-white/[0.05] p-6 h-full hover:border-red-600/20 transition-all">
                    <Icon className="w-6 h-6 text-red-600 mb-4" />
                    <h3 className="font-display font-bold text-lg mb-2">{b?.title ?? ''}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{b?.description ?? ''}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Age Groups */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('ages.title')} />
          <Stagger className="grid md:grid-cols-3 gap-8">
            {(ageGroups ?? [])?.map((group: any, i: number) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.02] border border-white/[0.05] p-8 text-center h-full">
                  <span className="font-display text-4xl font-bold text-red-600">
                    {group?.range ?? ''}
                  </span>
                  <h3 className="font-display text-xl font-bold mt-3 mb-2">{group?.name ?? ''}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{group?.description ?? ''}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-48 bg-red-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter leading-none mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-white/70 text-lg mb-10">{t('cta.description')}</p>
            <Link
              href={`/${locale}/apply`}
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold text-sm tracking-wider uppercase hover:bg-white/90 transition-colors"
            >
              {t('cta.button')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
