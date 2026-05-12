'use client';

import { FadeIn } from '@/components/ui/animate';

interface SectionHeaderProps {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeader({ label, title, titleAccent, subtitle, center = true }: SectionHeaderProps) {
  return (
    <FadeIn className={`mb-16 ${center ? 'text-center' : ''}`}>
      {label && (
        <span className="text-red-600 text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none">
        {title}
        {titleAccent && (
          <span className="text-red-600"> {titleAccent}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-6 text-white/50 text-lg max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
