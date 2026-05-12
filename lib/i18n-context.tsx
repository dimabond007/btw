'use client';
import React, { createContext, useContext } from 'react';

type Messages = Record<string, any>;

const I18nContext = createContext<{ messages: Messages; locale: string }>({
  messages: {},
  locale: 'en',
});

export function I18nProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: Messages;
  locale: string;
}) {
  return (
    <I18nContext.Provider value={{ messages, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

function getNestedValue(obj: any, path: string): any {
  const result = path?.split('.')?.reduce((acc: any, key: string) => acc?.[key], obj);
  return result !== undefined ? result : path ?? '';
}

export function useTranslations(namespace?: string) {
  const { messages } = useContext(I18nContext);
  const section = namespace ? getNestedValue(messages ?? {}, namespace) ?? {} : messages ?? {};
  const t = (key: string, params?: Record<string, any>) => {
    let value = getNestedValue(section, key);
    if (typeof value !== 'string') return String(value ?? key ?? '');
    if (params) {
      Object.keys(params ?? {}).forEach((k: string) => {
        value = value?.replace?.(`{${k}}`, String(params?.[k] ?? '')) ?? value;
      });
    }
    return value ?? key ?? '';
  };
  // Support t.raw for arrays
  (t as any).raw = (key: string) => {
    const val = getNestedValue(section, key);
    return val;
  };
  return t as ((key: string, params?: Record<string, any>) => string) & { raw: (key: string) => any };
}

export function useLocale() {
  const { locale } = useContext(I18nContext);
  return locale ?? 'en';
}
