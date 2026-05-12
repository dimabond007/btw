'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { SectionHeader } from './section-header';
import { Pyramid } from './pyramid';
import {
  Crosshair, Shield, Zap, Heart, Wind, Flame,
  ChevronRight, AlertTriangle, Check, X as XIcon, Award, Skull,
  MapPin, Monitor, Calendar
} from 'lucide-react';

const systemIcons = [Shield, Zap, Wind, Heart, Flame];
const serviceIcons = [MapPin, Monitor, Calendar];

export function HomeClient() {
  const t = useTranslations('home');
  const locale = useLocale();

  const doctrinePoints = t.raw('doctrine.points') as string[];
  const services = t.raw('services.items') as any[];
  const systemItems = t.raw('system.items') as any[];
  const unknownPoints = t.raw('unknown.points') as string[];
  const notFor = t.raw('notForEveryone.notFor') as string[];
  const forItems = t.raw('notForEveryone.for') as string[];
  const resultPoints = t.raw('result.points') as string[];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://cdn.abacus.ai/images/9690aa66-21a4-431c-8c88-c281c709e90f.png"
            alt="Tactical combat training"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,7%)] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <FadeIn>
            {/* <Crosshair className="w-10 h-10 text-red-600 mx-auto mb-8" /> */}
            <Image src="/favicon.png" alt="BE THE WEAPON" width={128} height={128} className="mx-auto mb-8" />
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-none">
              {t('hero.title')}
              <br />
              <span className="text-red-600">{t('hero.titleAccent')}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="mt-6 text-white/50 text-lg md:text-xl tracking-wide">
              {t('hero.subtitle')}
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <Link
              href={`/${locale}/system`}
              className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold text-sm tracking-wider uppercase transition-all"
            >
              {t('hero.cta')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* DOCTRINE */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <SlideIn from="left">
              <div className="relative aspect-[4/3] bg-muted rounded">
                <Image
                  src="https://cdn.abacus.ai/images/078be149-e861-4933-805d-1e7e63c20359.png"
                  alt="Strength training"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </SlideIn>
            <div>
              <SectionHeader
                label={t('doctrine.label')}
                title={t('doctrine.title')}
                center={false}
              />
              <FadeIn delay={0.2}>
                <p className="text-white/50 leading-relaxed mb-8">
                  {t('doctrine.description')}
                </p>
                <ul className="space-y-3">
                  {(doctrinePoints ?? [])?.map((point: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-white/70">
                      <ChevronRight className="w-4 h-4 text-red-600 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* PYRAMID */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            label={t('pyramid.label')}
            title={t('pyramid.title')}
            subtitle={t('pyramid.subtitle')}
          />
          <Pyramid />
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            label={t('services.label')}
            title={t('services.title')}
          />
          <Stagger className="grid md:grid-cols-3 gap-8">
            {(services ?? [])?.map((service: any, i: number) => {
              const Icon = serviceIcons?.[i] ?? MapPin;
              return (
                <StaggerItem key={service?.id ?? i}>
                  <div className="bg-white/[0.03] border border-white/[0.06] p-8 hover:border-red-600/30 transition-all group h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <Icon className="w-6 h-6 text-red-600" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 border border-white/10 px-2 py-1">
                        {service?.tag ?? ''}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight mb-3">
                      {service?.title ?? ''}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-8 flex-grow">
                      {service?.description ?? ''}
                    </p>
                    <Link
                      href={`/${locale}/apply`}
                      className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold tracking-wider uppercase group-hover:gap-3 transition-all"
                    >
                      {service?.cta ?? ''}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* FIVE COMPONENTS */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            label={t('system.label')}
            title={t('system.title')}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(systemItems ?? [])?.map((item: any, i: number) => {
              const Icon = systemIcons?.[i] ?? Shield;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white/[0.02] border border-white/[0.05] p-6 hover:border-red-600/20 transition-all">
                    <Icon className="w-5 h-5 text-red-600 mb-4" />
                    <h3 className="font-display font-bold text-lg tracking-tight mb-2">
                      {item?.title ?? ''}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {item?.description ?? ''}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn delay={0.5}>
            <p className="text-center mt-12 text-white/30 text-lg font-display tracking-tight">
              {t('system.integration')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* UNKNOWN CHALLENGE */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://cdn.abacus.ai/images/550721c3-37da-47e0-9b37-31b373c3b2da.png"
            alt="Sandbag carry training"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            label={t('unknown.label')}
            title={t('unknown.title')}
          />
          <FadeIn delay={0.2}>
            <p className="text-center text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              {t('unknown.description')}
            </p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-6">
            {(unknownPoints ?? [])?.map((point: string, i: number) => (
              <FadeIn key={i} delay={0.3 + i * 0.1}>
                <div className="bg-red-900/20 border border-red-800/30 px-6 py-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-white/70">{point}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* NOT FOR EVERYONE */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            label={t('notForEveryone.label')}
            title={t('notForEveryone.title')}
            subtitle={t('notForEveryone.description')}
          />
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FadeIn>
              <div className="space-y-4">
                {(notFor ?? [])?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <XIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-white/50">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white/80 mb-4">
                  {t('notForEveryone.forTitle')}
                </h3>
                {(forItems ?? [])?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <SectionHeader
            label={t('result.label')}
            title={t('result.title')}
            titleAccent={t('result.titleAccent')}
          />
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {(resultPoints ?? [])?.map((point: string, i: number) => (
                <div key={i} className="text-center">
                  <Award className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <span className="text-white/60 text-sm font-semibold tracking-wider uppercase">
                    {point}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-white/30 text-lg font-display italic tracking-tight">
              &ldquo;{t('result.quote')}&rdquo;
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 md:py-48 bg-red-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter leading-none mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-white/70 text-lg mb-10">
              {t('cta.description')}
            </p>
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
