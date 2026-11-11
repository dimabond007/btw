'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEW = { once: true, margin: '-80px' as `${number}px` };

/** Text that rises out from behind an invisible line. */
export function Rise({
  children,
  delay = 0,
  className,
  onMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onMount?: boolean;
}) {
  const target = { y: '0%', opacity: 1 };
  return (
    <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={{ y: '105%', opacity: 0.4 }}
        {...(onMount ? { animate: target } : { whileInView: target, viewport: VIEW })}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Block that fades up into place. */
export function Up({
  children,
  delay = 0,
  className,
  onMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onMount?: boolean;
}) {
  const target = { y: 0, opacity: 1 };
  return (
    <motion.div
      className={className}
      initial={{ y: 28, opacity: 0 }}
      {...(onMount ? { animate: target } : { whileInView: target, viewport: VIEW })}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A photo uncovered by a wipe, settling from a slight zoom. Parent sets the size. */
export function Wipe({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ''}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={VIEW}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      <motion.div
        className="relative h-full w-full"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.6, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** A thin rule that draws itself across. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`h-px ${className ?? ''}`}
      style={{ transformOrigin: 'var(--btw-origin, right)' }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEW}
      transition={{ duration: 1, delay, ease: EASE }}
    />
  );
}

/** Background that drifts slower than the page while its section scrolls past. */
export function Parallax({ children, className, amount = 12 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div className="absolute inset-x-0 -inset-y-[14%]" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/** Red reading-progress line under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      className="fixed top-16 inset-x-0 z-50 h-[2px] bg-[#c41e2a]"
      style={{ scaleX, transformOrigin: 'var(--btw-origin, right)' }}
    />
  );
}
