'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from '@/lib/i18n-context';
import { SectionHeader } from './section-header';
import { FadeIn } from '@/components/ui/animate';
import { AlertTriangle, Send, CheckCircle, Loader2, User, Mail, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function ApplyClient() {
  const t = useTranslations('apply');
  const locale = useLocale();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    motivation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!form?.name || !form?.email || !form?.phone || !form?.service || !form?.motivation) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(form ?? {}), locale }),
      });
      const data = await res?.json();
      if (data?.success) {
        setSubmitted(true);
        toast.success(t('form.success'));
      } else {
        toast.error(t('form.error'));
      }
    } catch {
      toast.error(t('form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const serviceOptions = t.raw('form.serviceOptions') as Record<string, string>;

  if (submitted) {
    return (
      <section className="min-h-[80dvh] flex items-center justify-center pt-16">
        <FadeIn className="text-center px-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold tracking-tighter mb-4">
            {t('form.success')}
          </h2>
        </FadeIn>
      </section>
    );
  }

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />
        </div>
      </section>

      <section className="pb-32 md:pb-48">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          {/* Filter Warning */}
          <FadeIn>
            <div className="bg-red-900/20 border border-red-800/30 p-6 mb-12">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{t('filter.title')}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{t('filter.description')}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-wider uppercase text-white/40 mb-2">
                  {t('form.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={form?.name ?? ''}
                    onChange={(e: any) => setForm({ ...(form ?? {}), name: e?.target?.value ?? '' })}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 pl-10 py-3 text-white placeholder-white/20 focus:border-red-600/50 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-white/40 mb-2">
                  {t('form.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    value={form?.email ?? ''}
                    onChange={(e: any) => setForm({ ...(form ?? {}), email: e?.target?.value ?? '' })}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 pl-10 py-3 text-white placeholder-white/20 focus:border-red-600/50 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-white/40 mb-2">
                  {t('form.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="tel"
                    value={form?.phone ?? ''}
                    onChange={(e: any) => setForm({ ...(form ?? {}), phone: e?.target?.value ?? '' })}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 pl-10 py-3 text-white placeholder-white/20 focus:border-red-600/50 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-white/40 mb-2">
                  {t('form.service')}
                </label>
                <select
                  value={form?.service ?? ''}
                  onChange={(e: any) => setForm({ ...(form ?? {}), service: e?.target?.value ?? '' })}
                  className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white focus:border-red-600/50 focus:outline-none transition-colors appearance-none"
                  required
                >
                  <option value="" className="bg-black">---</option>
                  {Object.entries(serviceOptions ?? {})?.map(([key, label]: [string, string]) => (
                    <option key={key} value={key} className="bg-black">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-white/40 mb-2">
                  {t('form.motivation')}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-white/20" />
                  <textarea
                    value={form?.motivation ?? ''}
                    onChange={(e: any) => setForm({ ...(form ?? {}), motivation: e?.target?.value ?? '' })}
                    placeholder={t('form.motivationPlaceholder')}
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 pl-10 py-3 text-white placeholder-white/20 focus:border-red-600/50 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wider uppercase transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('form.submit')}
                  </>
                )}
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
