import { notFound } from 'next/navigation';
import { locales, rtlLocales, type Locale } from '@/i18n';
import { Header } from '@/components/btw/header';
import { Footer } from '@/components/btw/footer';
import { I18nProvider } from '@/lib/i18n-context';

export function generateStaticParams() {
  return locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as any)) notFound();

  let messages: any;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  const isRtl = rtlLocales.includes(locale as Locale);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} lang={locale}>
      <I18nProvider locale={locale} messages={messages}>
        <Header locale={locale} />
        <main>{children}</main>
        <Footer />
      </I18nProvider>
    </div>
  );
}
