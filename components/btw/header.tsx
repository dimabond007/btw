'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n-context';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navItems = [
  { key: 'system', href: '/system' },
  { key: 'methodology', href: '/methodology' },
  { key: 'training', href: '/training' },
  { key: 'standards', href: '/standards' },
  { key: 'kids', href: '/kids' },
  { key: 'about', href: '/about' },
];

const localeNames: Record<string, string> = {
  en: 'EN',
  he: 'עב',
  ru: 'РУ',
};

const allLocales = ['en', 'he', 'ru'];

export function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname?.split('/') ?? [];
    segments[1] = newLocale;
    return segments.join('/') || `/${newLocale}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          {/* <Crosshair className="w-5 h-5 text-red-600" /> */}
          <Image src="/favicon.png" alt="BE THE WEAPON" width={32} height={32} />
          <span className="font-display font-bold text-sm tracking-[0.2em] uppercase text-white">
            BE THE WEAPON
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems?.map((item: any) => {
            const isActive = pathname?.includes(item?.href);
            return (
              <Link
                key={item?.key}
                href={`/${locale}${item?.href}`}
                className={`px-3 py-2 text-xs tracking-wider uppercase transition-colors ${isActive ? 'text-red-500' : 'text-white/60 hover:text-white'
                  }`}
              >
                {t(item?.key)}
              </Link>
            );
          })}
          <Link
            href={`/${locale}/apply`}
            className="ml-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs tracking-wider uppercase font-semibold transition-colors"
          >
            {t('apply')}
          </Link>

          {/* Language Switcher */}
          <div className="relative ml-3">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-2 text-white/60 hover:text-white text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              {localeNames?.[locale] ?? locale}
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 bg-black/95 border border-white/10 py-1 min-w-[60px]">
                {allLocales?.map((l: string) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    onClick={() => setLangOpen(false)}
                    className={`block px-3 py-1.5 text-xs ${l === locale ? 'text-red-500' : 'text-white/60 hover:text-white'
                      }`}
                  >
                    {localeNames?.[l] ?? l}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems?.map((item: any) => (
                <Link
                  key={item?.key}
                  href={`/${locale}${item?.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-white/70 hover:text-white uppercase tracking-wider"
                >
                  {t(item?.key)}
                </Link>
              ))}
              <Link
                href={`/${locale}/apply`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-red-500 font-semibold uppercase tracking-wider"
              >
                {t('apply')}
              </Link>
              <div className="flex gap-3 pt-3 border-t border-white/10">
                {allLocales?.map((l: string) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    onClick={() => setMobileOpen(false)}
                    className={`text-xs px-2 py-1 ${l === locale ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
                  >
                    {localeNames?.[l] ?? l}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
