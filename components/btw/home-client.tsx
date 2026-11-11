'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, MotionConfig, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MapPin, MessageCircle, Phone, Plus } from 'lucide-react';
import { useTranslations, useLocale } from '@/lib/i18n-context';
import { Pyramid } from './pyramid';
import { Parallax, Rise, Rule, ScrollProgress, Up, Wipe } from './motion';
import { events as allEvents, upcomingEvents, type BtwEvent } from '@/lib/events';

const ONLINE_URL = 'https://app.btwprogramming.com/discover';
const RED = '#c41e2a';
const EASE = [0.22, 1, 0.36, 1] as const;

function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function mapLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Small numbered label that opens every section. */
function Kicker({ num, children, dark = false }: { num: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <Up>
      <div className={`flex items-center gap-3 text-xs tracking-[0.25em] uppercase ${dark ? 'text-black/50' : 'text-white/45'}`}>
        <span className="font-mono" style={{ color: RED }}>
          {num}
        </span>
        <span className="h-px w-10" style={{ background: RED }} />
        <span>{children}</span>
      </div>
    </Up>
  );
}

function EventDate({ date, locale }: { date: string; locale: string }) {
  const d = new Date(`${date}T12:00:00`);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const weekday = new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : locale === 'ru' ? 'ru-RU' : 'en-GB', {
    weekday: 'long',
  }).format(d);
  return (
    <div className="shrink-0">
      <div dir="ltr" className="font-display text-6xl md:text-7xl font-bold leading-none w-fit">
        {day}
        <span style={{ color: RED }}>.</span>
        {month}
      </div>
      <div className="mt-2 text-sm text-white/45">{weekday}</div>
    </div>
  );
}

export function HomeClient() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRtl = locale === 'he';

  const whyRows = (t.raw('why.rows') as any[]) ?? [];
  const branches = (t.raw('ways.branches') as any[]) ?? [];
  const workshopTypes = (t.raw('events.types') as any[]) ?? [];
  const faqItems = (t.raw('faq.items') as any[]) ?? [];

  // Events drop off the page once their date has passed.
  const [events, setEvents] = useState<BtwEvent[]>(allEvents);
  useEffect(() => setEvents(upcomingEvents()), []);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Hero photo drifts and darkens as the page scrolls away from it.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '22%']);
  const heroFade = useTransform(heroProgress, [0, 1], [0, 0.6]);

  const trialLink = waLink(t('contact.wa'), t('ways.waText'));

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ ['--btw-origin' as any]: isRtl ? 'right' : 'left' }}>
        <div className="btw-grain" aria-hidden />
        <ScrollProgress />

        {/* HERO */}
        <section ref={heroRef} className="relative min-h-[100dvh] flex items-end overflow-hidden bg-[#0b0b0b]">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.16 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: EASE }}
            >
              <Image
                src="/images/btw/hero.jpg"
                alt="Be The Weapon"
                fill
                priority
                sizes="100vw"
                className="btw-photo object-cover object-[50%_30%]"
              />
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/45 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
          <motion.div className="absolute inset-0 bg-[#0b0b0b]" style={{ opacity: heroFade }} />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24 pt-32">
            <Up onMount delay={0.2}>
              <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/75">{t('hero.eyebrow')}</p>
            </Up>
            <h1 className="mt-4 font-display font-bold uppercase leading-[0.9] tracking-tight text-[17vw] md:text-[11vw] lg:text-[9.5rem]">
              <span dir="ltr" className="inline-flex flex-wrap gap-x-[0.25em]">
                <Rise onMount delay={0.3}>
                  Be The
                </Rise>
                <Rise onMount delay={0.45}>
                  <span style={{ color: RED }}>Weapon</span>
                </Rise>
              </span>
            </h1>
            <motion.div
              className="mt-5 h-[3px] w-24 md:w-40"
              style={{ background: RED, transformOrigin: 'var(--btw-origin)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            />
            <motion.p
              className="mt-5 font-display text-xl md:text-3xl uppercase text-white/90"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.28em' }}
              transition={{ duration: 1.4, delay: 0.85, ease: EASE }}
            >
              <span dir="ltr" className="inline-block">
                {t('hero.slogan')}
              </span>
            </motion.p>
            <Up onMount delay={1.15}>
              <p className="mt-8 max-w-xl text-xl md:text-2xl font-light leading-snug text-white/85">{t('hero.lead')}</p>
            </Up>
            <Up onMount delay={1.3}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={trialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btw-btn inline-flex items-center gap-2 px-7 py-4 text-sm font-bold text-white transition-colors"
                  style={{ background: RED }}
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('hero.ctaTrial')}
                </a>
                <a
                  href={ONLINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btw-btn inline-flex items-center gap-2 px-7 py-4 text-sm font-bold border border-white/40 text-white transition-colors"
                >
                  {t('hero.ctaOnline')}
                  <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                </a>
              </div>
            </Up>
            <motion.a
              href="#pyramid"
              className="mt-14 hidden md:inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white/50 hover:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowDown className="w-4 h-4" />
              </motion.span>
              {t('hero.scroll')}
            </motion.a>
          </div>
        </section>

        {/* 01 PYRAMID */}
        <section id="pyramid" className="scroll-mt-16 bg-[#0b0b0b] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Kicker num="01">{t('pyramid.label')}</Kicker>
            <h2 className="mt-6 text-4xl md:text-6xl font-black leading-[1.05] max-w-3xl">
              <Rise>{t('pyramid.title')}</Rise>
            </h2>
            <Up delay={0.15}>
              <p className="mt-5 max-w-2xl text-xl font-light text-white/65 leading-relaxed">{t('pyramid.subtitle')}</p>
            </Up>
            <div className="mt-14 md:mt-20">
              <Pyramid />
            </div>
          </div>
        </section>

        {/* 02 WHY ALL OF IT — light section */}
        <section className="bg-[#ebe6dc] text-[#111]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-36">
            <Kicker num="02" dark>
              {t('why.label')}
            </Kicker>
            <h2 className="mt-6 text-4xl md:text-7xl font-black leading-[1.02] max-w-4xl">
              <Rise>{t('why.title')}</Rise>
            </h2>
            <Up delay={0.15}>
              <p className="mt-6 max-w-2xl text-xl md:text-2xl font-light leading-relaxed text-black/70">{t('why.lead')}</p>
            </Up>

            <div className="mt-14">
              <Rule className="bg-black/20" />
              {whyRows.map((row: any, i: number) => (
                <div key={i}>
                  <Up delay={i * 0.1}>
                    <div className="group grid md:grid-cols-[1.2fr_1fr_2fr] gap-2 md:gap-8 py-7 items-baseline transition-[padding] duration-500 hover:ps-3">
                      <div className="text-2xl md:text-3xl font-black">{row?.name}</div>
                      <div className="text-lg font-bold" style={{ color: RED }}>
                        {row?.gives}
                      </div>
                      <div className="text-lg md:text-xl font-light text-black/65">{row?.missing}</div>
                    </div>
                  </Up>
                  <Rule className="bg-black/20" delay={0.1 + i * 0.1} />
                </div>
              ))}
            </div>
          </div>

          <Parallax className="relative h-[72vh] min-h-[440px]">
            <Image src="/images/btw/together.jpg" alt="" fill sizes="100vw" className="btw-photo object-cover object-[50%_25%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </Parallax>
          <div className="relative -mt-[38vh] md:-mt-[30vh] min-h-[38vh] md:min-h-[30vh] flex items-end pointer-events-none">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-16 text-white">
              <p className="max-w-3xl font-serif text-3xl md:text-5xl leading-tight">
                <Rise>{t('why.quote')}</Rise>
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-end">
            <Up>
              <p className="text-xl md:text-2xl font-light leading-relaxed text-black/75">{t('why.conclusion')}</p>
            </Up>
            <p className="text-4xl md:text-6xl font-black leading-none md:text-end">
              <Rise delay={0.15}>{t('why.punch')}</Rise>
            </p>
          </div>
        </section>

        {/* 03 WAYS IN */}
        <section id="ways" className="scroll-mt-16 bg-[#0b0b0b] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Kicker num="03">{t('ways.label')}</Kicker>
            <h2 className="mt-6 text-4xl md:text-6xl font-black leading-[1.05]">
              <Rise>{t('ways.title')}</Rise>
            </h2>

            {/* Academies */}
            <div className="mt-14 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] border border-white/10">
              <div className="group relative min-h-[300px] lg:min-h-[520px] overflow-hidden">
                <Wipe className="absolute inset-0">
                  <Image
                    src="/images/btw/academy.jpg"
                    alt=""
                    fill
                    sizes="(min-width:1024px) 42vw, 100vw"
                    className="btw-photo object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </Wipe>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-0 p-6 md:p-8">
                  <h3 className="text-3xl md:text-4xl font-black">{t('ways.academiesTitle')}</h3>
                  <p className="mt-2 max-w-sm text-white/75">{t('ways.academiesText')}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2">
                {branches.map((b: any, i: number) => (
                  <Up
                    key={i}
                    delay={0.15 + i * 0.12}
                    className={`group relative flex flex-col justify-between overflow-hidden p-6 md:p-10 border-white/10 border-t lg:border-t-0 ${
                      i > 0 ? 'sm:border-s' : 'lg:border-s'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-10 end-2 font-display text-[11rem] font-bold leading-none text-white/[0.035] transition-colors duration-500 group-hover:text-[#c41e2a]/20"
                    >
                      0{i + 1}
                    </span>
                    <div className="relative">
                      <div className="font-mono text-xs tracking-[0.2em]" style={{ color: RED }}>
                        0{i + 1}
                      </div>
                      <div className="mt-4 text-3xl md:text-4xl font-black">{b?.city}</div>
                      <a
                        href={mapLink(b?.map ?? `${b?.address} ${b?.city}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-xl text-white/70 hover:text-white transition-colors"
                      >
                        <MapPin className="w-4 h-4 shrink-0" style={{ color: RED }} />
                        <span>{b?.address}</span>
                        <span className="text-xs text-white/40 border-b border-white/20">{t('ways.navigate')}</span>
                      </a>
                    </div>
                    <div className="relative mt-10">
                      <a
                        href={waLink(b?.wa, t('ways.waText'))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btw-btn inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-white transition-colors"
                        style={{ background: RED }}
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        {t('ways.trial')}
                      </a>
                      <a
                        href={`tel:${String(b?.phone).replace(/-/g, '')}`}
                        className="mt-4 block w-fit text-white/55 hover:text-white font-mono text-sm"
                      >
                        <span dir="ltr">{b?.phone}</span>
                      </a>
                    </div>
                  </Up>
                ))}
              </div>
            </div>

            {/* Online + workshops */}
            <div className="grid md:grid-cols-2 border-x border-b border-white/10">
              <a
                href={ONLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-end justify-between gap-6 p-6 md:p-10 hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-black">{t('ways.onlineTitle')}</h3>
                  <p className="mt-2 text-white/60 max-w-sm">{t('ways.onlineText')}</p>
                  <span className="mt-5 inline-block text-sm font-bold border-b pb-0.5" style={{ borderColor: RED }}>
                    {t('ways.onlineCta')}
                  </span>
                </div>
                <ArrowUpRight className="w-8 h-8 shrink-0 text-white/30 transition-all duration-300 group-hover:text-white group-hover:-translate-y-1 rtl:-scale-x-100" />
              </a>
              <a
                href="#events"
                className="group flex items-end justify-between gap-6 p-6 md:p-10 border-t md:border-t-0 md:border-s border-white/10 hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-black">{t('ways.workshopsTitle')}</h3>
                  <p className="mt-2 text-white/60 max-w-sm">{t('ways.workshopsText')}</p>
                  <span className="mt-5 inline-block text-sm font-bold border-b pb-0.5" style={{ borderColor: RED }}>
                    {t('ways.workshopsCta')}
                  </span>
                </div>
                <ArrowDown className="w-8 h-8 shrink-0 text-white/30 transition-all duration-300 group-hover:text-white group-hover:translate-y-1" />
              </a>
            </div>
          </div>
        </section>

        {/* 04 EVENTS */}
        <section id="events" className="scroll-mt-16 bg-[#141414] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <Kicker num="04">{t('events.label')}</Kicker>
            <h2 className="mt-6 text-4xl md:text-6xl font-black leading-[1.05]">
              <Rise>{events.length > 0 ? t('events.title') : t('events.emptyTitle')}</Rise>
            </h2>

            {events.length > 0 ? (
              <div className="mt-14">
                <Rule className="bg-white/20" />
                {events.map((e, i) => (
                  <div key={e.id}>
                    <Up delay={i * 0.12}>
                      <div className="group grid md:grid-cols-[auto_minmax(0,1fr)_170px_auto] gap-6 md:gap-10 py-10 md:items-center">
                        <EventDate date={e.date} locale={locale} />
                        <div>
                          <div className="text-xs tracking-[0.25em] uppercase" style={{ color: RED }}>
                            {t(`events.items.${e.id}.kind`)}
                          </div>
                          <h3 className="mt-2 text-2xl md:text-3xl font-black">{t(`events.items.${e.id}.title`)}</h3>
                          <p className="mt-2 max-w-xl text-white/60 leading-relaxed">{t(`events.items.${e.id}.text`)}</p>
                        </div>
                        <div className="relative hidden md:block h-28 overflow-hidden">
                          <Image
                            src={e.image}
                            alt=""
                            fill
                            sizes="170px"
                            className="btw-photo object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                          />
                        </div>
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btw-btn inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-white transition-colors whitespace-nowrap"
                          style={{ background: RED }}
                        >
                          {t('events.register')}
                          <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                        </a>
                      </div>
                    </Up>
                    <Rule className="bg-white/20" delay={0.1 + i * 0.12} />
                  </div>
                ))}
                <p className="mt-6 text-lg font-light text-white/45">{t('events.more')}</p>
              </div>
            ) : (
              <p className="mt-6 max-w-2xl text-xl font-light text-white/60">{t('events.emptyText')}</p>
            )}

            <div className="mt-16">
              <div className="text-xs tracking-[0.25em] uppercase text-white/40">{t('events.typesTitle')}</div>
              <div className="mt-5 grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
                {workshopTypes.map((w: any, i: number) => (
                  <Up key={i} delay={i * 0.1} className="group relative bg-[#141414] p-6 md:p-8 overflow-hidden">
                    <span
                      className="absolute inset-x-0 top-0 h-[2px] scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: RED, transformOrigin: 'var(--btw-origin)' }}
                    />
                    <div className="text-xl font-black">{w?.title}</div>
                    <p className="mt-2 text-white/55 leading-relaxed">{w?.text}</p>
                  </Up>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05 FAQ */}
        <section id="faq" className="scroll-mt-16 bg-[#0b0b0b] py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-12 lg:gap-20">
            <div>
              <Kicker num="05">{t('faq.label')}</Kicker>
              <h2 className="mt-6 text-4xl md:text-6xl font-black leading-[1.05]">
                <Rise>{t('faq.title')}</Rise>
              </h2>
              <Wipe className="relative mt-10 hidden lg:block aspect-[4/5]">
                <Image src="/images/btw/range.jpg" alt="" fill sizes="30vw" className="btw-photo object-cover" />
              </Wipe>
            </div>
            <div className="self-start">
              <Rule className="bg-white/20" />
              {faqItems.map((item: any, i: number) => {
                const open = openFaq === i;
                return (
                  <Up key={i} delay={i * 0.06} className="border-b border-white/15">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="group w-full flex items-start justify-between gap-6 py-6 text-start"
                    >
                      <span
                        className={`text-xl md:text-2xl font-bold leading-snug transition-colors ${
                          open ? 'text-white' : 'text-white/75 group-hover:text-white'
                        }`}
                      >
                        {item?.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="mt-1 shrink-0"
                        style={{ color: RED }}
                      >
                        <Plus className="w-6 h-6" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pb-7 max-w-2xl text-lg md:text-xl font-light leading-relaxed text-white/70">{item?.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Up>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative overflow-hidden">
          <Parallax className="absolute inset-0" amount={10}>
            <Image src="/images/btw/group.jpg" alt="" fill sizes="100vw" className="btw-photo object-cover object-[50%_35%]" />
          </Parallax>
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-40">
            <h2 className="text-5xl md:text-8xl font-black leading-none">
              <Rise>{t('contact.title')}</Rise>
            </h2>
            <Up delay={0.15}>
              <p className="mt-6 max-w-xl text-xl md:text-2xl font-light text-white/80">{t('contact.text')}</p>
            </Up>
            <Up delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  href={waLink(t('contact.wa'), t('contact.waText'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btw-btn inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white transition-colors"
                  style={{ background: RED }}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('contact.whatsapp')}
                </a>
                <a
                  href={`tel:${t('contact.phone').replace(/-/g, '')}`}
                  className="inline-flex items-center gap-3 text-white/80 hover:text-white"
                >
                  <Phone className="w-4 h-4" style={{ color: RED }} />
                  <span>{t('contact.call')}</span>
                  <span dir="ltr" className="font-display text-2xl md:text-3xl font-bold tracking-wide">
                    {t('contact.phone')}
                  </span>
                </a>
              </div>
            </Up>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
