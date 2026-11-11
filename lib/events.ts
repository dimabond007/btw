// Upcoming events shown on the landing page.
// To add an event: add a row here and a matching entry under home.events.items in messages/*.json.
// An event disappears from the site on its own once its date has passed.
export type BtwEvent = {
  id: string; // key under home.events.items
  date: string; // YYYY-MM-DD, Israel time
  url: string; // registration / payment link
  image: string;
};

export const events: BtwEvent[] = [
  { id: 'community', date: '2026-11-14', url: 'https://cinv.me/KS3P0', image: '/images/btw/community.jpg' },
  { id: 'workshop', date: '2026-11-20', url: 'https://cinv.me/vuYrq', image: '/images/btw/workshop.jpg' },
];

/** Today's date in Israel as YYYY-MM-DD. */
export function todayInIsrael(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(now);
}

/** Events whose date is today or later, soonest first. */
export function upcomingEvents(now: Date = new Date()): BtwEvent[] {
  const today = todayInIsrael(now);
  return events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}
