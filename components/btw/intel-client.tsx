'use client';

import { useTranslations } from '@/lib/i18n-context';
import { SectionHeader } from './section-header';
import { FadeIn } from '@/components/ui/animate';
import { FileText, Lock } from 'lucide-react';

export function IntelClient() {
  const t = useTranslations('intel');
  const categories = t.raw('categories') as string[];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <Lock className="w-12 h-12 text-red-600/30 mx-auto mb-6" />
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              {t('coming')}
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {(categories ?? [])?.map((cat: string, i: number) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white/[0.02] border border-white/[0.05] p-6 text-center opacity-50">
                  <FileText className="w-5 h-5 text-red-600/40 mx-auto mb-3" />
                  <span className="text-xs text-white/30 uppercase tracking-wider">{cat}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
