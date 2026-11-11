'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n-context';

type Level = {
  id: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  items: string[];
};

// Tier heights, apex first. The apex is a true point, so it is taller to leave room for its label.
const HEIGHTS = [1.5, 1, 1, 1];
const GAP = 6; // px between tiers
const EASE = [0.22, 1, 0.36, 1] as const;

const levelImages: Record<string, string> = {
  citizen: '/images/btw/citizen.jpg',
  shooting: '/images/btw/shooting.jpg',
  combat: '/images/btw/combat.jpg',
  fitness: '/images/btw/fitness.jpg',
};

export function Pyramid() {
  const t = useTranslations('home');
  const levels = (t.raw('pyramid.levels') as Level[]) ?? [];
  // Start on the base: that is where the method starts.
  const [active, setActive] = useState(levels.length - 1);
  const current = levels[active];

  const total = HEIGHTS.reduce((a, b) => a + b, 0);
  // Half-width (% of the box) of the pyramid at each tier boundary: straight sides from the point to the base.
  const edges = HEIGHTS.reduce<number[]>((acc, h) => [...acc, acc[acc.length - 1] + (50 * h) / total], [0]);

  return (
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-center">
      {/* The pyramid */}
      <div dir="ltr" className="w-full max-w-[540px] mx-auto">
        <div className="flex flex-col" style={{ gap: GAP }} role="tablist" aria-orientation="vertical">
          {levels.map((level, i) => {
            const top = 50 - edges[i];
            const bottom = 50 - edges[i + 1];
            const isActive = i === active;
            const isApex = i === 0;
            return (
              <motion.button
                key={level.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                // The pyramid builds itself from the base up.
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: (levels.length - 1 - i) * 0.16, ease: EASE }}
                className={`relative w-full focus:outline-none transition-[background-color,color,filter] duration-300 ${
                  isActive
                    ? 'bg-[#c41e2a] text-white'
                    : isApex
                    ? 'bg-[#6e1219] text-white hover:bg-[#8f1820]'
                    : 'bg-[#222] text-white/80 hover:bg-[#2e2e2e]'
                }`}
                style={{
                  height: `calc(${HEIGHTS[i]} * clamp(80px, 22vw, 104px))`,
                  clipPath: `polygon(${top}% 0, ${100 - top}% 0, ${100 - bottom}% 100%, ${bottom}% 100%)`,
                }}
              >
                <span
                  className={`absolute inset-x-0 flex flex-col items-center text-center leading-tight ${
                    isApex ? 'bottom-3 sm:bottom-4' : 'inset-y-0 justify-center'
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] opacity-60">{level.num}</span>
                  <span className={`font-sans font-black ${isApex ? 'text-[11px] sm:text-sm max-w-[22%]' : 'text-sm sm:text-lg'}`}>
                    {level.title}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[11px] tracking-[0.25em] uppercase text-white/35">{t('pyramid.hint')}</p>
      </div>

      {/* Details of the selected layer */}
      <div className="min-h-[430px]">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="grid sm:grid-cols-[170px_minmax(0,1fr)] gap-6 sm:gap-8"
            >
              <motion.div
                className="relative h-48 sm:h-auto sm:min-h-[360px] overflow-hidden"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Image
                  src={levelImages[current.id] ?? levelImages.fitness}
                  alt={current.title}
                  fill
                  sizes="(min-width: 640px) 170px, 100vw"
                  className="btw-photo object-cover"
                />
              </motion.div>
              <div>
                <div className="font-display text-6xl font-bold leading-none text-[#c41e2a]">{current.num}</div>
                <h3 className="mt-3 text-3xl md:text-4xl font-black leading-tight">{current.title}</h3>
                <p className="mt-3 text-xl font-medium text-white/85">{current.tagline}</p>
                <p className="mt-4 text-white/60 leading-relaxed">{current.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {(current.items ?? []).map((item, k) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.15 + k * 0.035, ease: EASE }}
                      className="border border-white/15 px-3 py-1.5 text-sm text-white/80"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
