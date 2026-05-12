'use client';

import { useTranslations } from '@/lib/i18n-context';
import { Crosshair, Phone, MapPin, Instagram } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crosshair className="w-5 h-5 text-red-600" />
              <span className="font-display font-bold text-sm tracking-[0.2em] uppercase">
                BE THE WEAPON
              </span>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600/60" />
              <span>{t('phone')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600/60" />
              <span>{t('location')}</span>
            </div>
            <a
              href="https://instagram.com/betheweaponisrael"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4 text-red-600/60" />
              <span>@betheweaponisrael</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-center text-xs text-white/25">
          &copy; {new Date().getFullYear()} BE THE WEAPON. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
