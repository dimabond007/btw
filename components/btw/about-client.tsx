'use client';

import { useTranslations, useLocale } from '@/lib/i18n-context';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from './section-header';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { Target, MapPin, Phone, Instagram, ChevronRight } from 'lucide-react';

export function AboutClient() {
  const t = useTranslations('about');
  const locale = useLocale();

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <SlideIn from="left">
              <div className="relative aspect-[4/3] bg-muted rounded">
                <Image
                  src="https://cdn.abacus.ai/images/b5eadd39-6a0f-4779-b4e2-43a4e3d4d4eb.png"
                  alt="Group tactical training"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </SlideIn>
            <div>
              <FadeIn>
                <Target className="w-8 h-8 text-red-600 mb-6" />
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-6">
                  {t('mission.title')}
                </h2>
                <p className="text-white/50 leading-relaxed">{t('mission.description')}</p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <MapPin className="w-8 h-8 text-red-600 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                {t('location.title')}
              </h2>
              <p className="text-red-600 font-semibold text-lg mb-4">{t('location.city')}</p>
              <p className="text-white/50 leading-relaxed">{t('location.description')}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-32 md:py-48 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-lg mx-auto text-center">
            <FadeIn>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-8">
                {t('contact.title')}
              </h2>
              <div className="space-y-4 mb-10">
                <a href="tel:0547244553" className="flex items-center justify-center gap-3 text-white/60 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-red-600" />
                  {t('contact.phone')}
                </a>
                <a
                  href="https://instagram.com/betheweaponisrael"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white/60 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5 text-red-600" />
                  {t('contact.instagram')}
                </a>
              </div>
              <p className="text-white/40 mb-8">{t('contact.cta')}</p>
              <Link
                href={`/${locale}/apply`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold text-sm tracking-wider uppercase transition-colors"
              >
                Apply Now <ChevronRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
