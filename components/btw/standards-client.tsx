'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import { SectionHeader } from './section-header';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Award, BarChart3, ChevronRight, Dumbbell, Timer, Swords } from 'lucide-react';

const tierColors = [
  'border-white/10 bg-white/[0.02]',
  'border-white/15 bg-white/[0.04]',
  'border-red-800/30 bg-red-900/10',
  'border-red-700/40 bg-red-900/20',
];

const metricIcons = [Dumbbell, Timer, Swords];

export function StandardsClient() {
  const t = useTranslations('standards');
  const locale = useLocale();
  const tiers = t.raw('levels.tiers') as any[];
  const categories = t.raw('metrics.categories') as any[];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('levels.title')} subtitle={t('levels.description')} />
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(tiers ?? [])?.map((tier: any, i: number) => (
              <StaggerItem key={i}>
                <div className={`border p-6 h-full ${tierColors?.[i] ?? tierColors[0]}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-red-600" />
                    <span className="font-mono text-xs text-red-600/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{tier?.name ?? ''}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{tier?.description ?? ''}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('metrics.title')} />
          <Stagger className="grid md:grid-cols-3 gap-8">
            {(categories ?? [])?.map((cat: any, i: number) => {
              const Icon = metricIcons?.[i] ?? Dumbbell;
              const examples = cat?.examples as string[] ?? [];
              return (
                <StaggerItem key={i}>
                  <div className="bg-white/[0.02] border border-white/[0.05] p-8 h-full">
                    <Icon className="w-6 h-6 text-red-600 mb-4" />
                    <h3 className="font-display text-lg font-bold mb-4">{cat?.name ?? ''}</h3>
                    <ul className="space-y-2">
                      {examples?.map((ex: string, j: number) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/50">
                          <BarChart3 className="w-3 h-3 text-red-600/50" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
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
