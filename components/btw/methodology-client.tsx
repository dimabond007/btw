'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import { SectionHeader } from './section-header';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Activity, Timer, Zap, Target, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';

export function MethodologyClient() {
  const t = useTranslations('methodology');
  const locale = useLocale();
  const skills = t.raw('gpp.skills') as string[];
  const metcons = t.raw('metcons.types') as any[];
  const energySystems = t.raw('energy.systems') as any[];
  const qualityPoints = t.raw('quality.points') as string[];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      {/* GPP */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('gpp.title')} />
          <FadeIn>
            <p className="text-center text-white/50 text-lg max-w-3xl mx-auto leading-relaxed mb-12">
              {t('gpp.description')}
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {(skills ?? [])?.map((skill: string, i: number) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white/[0.03] border border-white/[0.06] p-4 text-center">
                  <span className="text-red-600 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-white/70 mt-1">{skill}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* S&C Model */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('conditioning.title')} />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white/[0.03] border border-white/[0.06] p-8">
                <Activity className="w-6 h-6 text-red-600 mb-4" />
                <h3 className="font-display text-xl font-bold mb-3">{t('conditioning.gppTitle')}</h3>
                <p className="text-white/40 leading-relaxed">{t('conditioning.gppDesc')}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="bg-red-900/10 border border-red-800/20 p-8">
                <Target className="w-6 h-6 text-red-600 mb-4" />
                <h3 className="font-display text-xl font-bold mb-3">{t('conditioning.sppTitle')}</h3>
                <p className="text-white/40 leading-relaxed">{t('conditioning.sppDesc')}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* MetCons */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('metcons.title')} />
          <Stagger className="grid md:grid-cols-3 gap-8">
            {(metcons ?? [])?.map((mc: any, i: number) => (
              <StaggerItem key={i}>
                <div className="bg-white/[0.02] border border-white/[0.05] p-8 h-full">
                  <Timer className="w-6 h-6 text-red-600 mb-4" />
                  <h3 className="font-display text-lg font-bold mb-2">{mc?.title ?? ''}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{mc?.description ?? ''}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Energy Systems */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('energy.title')} />
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
            {(energySystems ?? [])?.map((sys: any, i: number) => (
              <FadeIn key={i} delay={i * 0.15} className="flex-1">
                <div className="bg-white/[0.03] border border-white/[0.06] p-6 text-center h-full">
                  <Zap className="w-5 h-5 text-red-600 mx-auto mb-3" />
                  <h3 className="font-display font-bold mb-1">{sys?.name ?? ''}</h3>
                  <p className="text-red-600/70 font-mono text-xs mb-2">{sys?.range ?? ''}</p>
                  <p className="text-white/40 text-sm">{sys?.desc ?? ''}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Movement Quality */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('quality.title')} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {(qualityPoints ?? [])?.map((p: string, i: number) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-white/60 text-sm">{p}</span>
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
