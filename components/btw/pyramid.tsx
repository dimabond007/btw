'use client';

import { useTranslations } from '@/lib/i18n-context';
import { FadeIn } from '@/components/ui/animate';
import { Target, Swords, Dumbbell } from 'lucide-react';

const pyramidIcons = [Target, Swords, Dumbbell];
const pyramidWidths = ['w-full max-w-md', 'w-full max-w-lg', 'w-full max-w-2xl'];
const pyramidColors = [
  'bg-red-700/30 border-red-700/50',
  'bg-red-900/20 border-red-800/40',
  'bg-white/5 border-white/10',
];

export function Pyramid() {
  const t = useTranslations('home.pyramid');
  const levels = t.raw('levels') as any[];

  return (
    <div className="flex flex-col items-center gap-4">
      {(levels ?? [])?.map((level: any, i: number) => {
        const Icon = pyramidIcons?.[i] ?? Target;
        return (
          <FadeIn key={i} delay={i * 0.15}>
            <div
              className={`${pyramidWidths?.[i] ?? 'w-full'} ${pyramidColors?.[i] ?? ''} border px-8 py-6 text-center`}
            >
              <Icon className="w-6 h-6 text-red-600 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg tracking-tight">
                {level?.title ?? ''}
              </h3>
              <p className="text-white/50 text-sm mt-1">{level?.description ?? ''}</p>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
