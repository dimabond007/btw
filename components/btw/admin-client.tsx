'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, LogOut, MessageCircle, Minus, Phone, Plus, RotateCcw } from 'lucide-react';

const RED = '#c41e2a';

type Order = {
  id: string;
  productName: string;
  option: string;
  quantity: number;
  amount: number;
  name: string;
  phone: string;
  email: string | null;
  status: 'paid' | 'collected' | 'cancelled';
  receiptUrl: string | null;
  test: boolean;
  createdAt: string;
  collectedAt: string | null;
};

type CatalogItem = { id: string; name: string; price: number | null; forSale: boolean; options: string[] };

const shell = 'min-h-[100dvh] bg-[#ebe6dc] text-[#111]';

const when = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' }).format(new Date(iso));

const waNumber = (phone: string) => {
  const d = phone.replace(/[^\d]/g, '');
  return d.startsWith('972') ? d : d.startsWith('0') ? `972${d.slice(1)}` : d;
};

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.ok;
}

export function AdminNotice({ text }: { text: string }) {
  return (
    <div dir="rtl" lang="he" className={`${shell} flex items-center justify-center p-6`}>
      <p className="max-w-md text-center text-lg">{text}</p>
    </div>
  );
}

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    if (await post('/api/admin/login', { password })) router.refresh();
    else {
      setError(true);
      setBusy(false);
    }
  };

  return (
    <div dir="rtl" lang="he" className={`${shell} flex items-center justify-center p-6`}>
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="h-[3px] w-12" style={{ background: RED }} />
        <h1 className="mt-5 text-4xl font-black">ניהול החנות</h1>
        <p className="mt-2 text-black/60">הזמנות ומלאי של Be The Weapon.</p>
        <label className="mt-8 block text-sm font-bold">
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            dir="ltr"
            className="mt-1.5 w-full border border-black/25 bg-white px-4 py-3 text-base outline-none focus:border-black"
            required
          />
        </label>
        {error && (
          <p className="mt-3 text-sm font-bold" style={{ color: RED }}>
            הסיסמה לא נכונה.
          </p>
        )}
        <button type="submit" disabled={busy} className="mt-5 w-full px-6 py-4 text-sm font-bold text-white disabled:opacity-60" style={{ background: RED }}>
          {busy ? 'רגע...' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}

function StockRow({ productId, option, initial, onSaved }: { productId: string; option: string; initial: number; onSaved: () => void }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  const dirty = value !== saved;

  const save = async () => {
    setBusy(true);
    if (await post('/api/admin/stock', { productId, option, quantity: value })) {
      setSaved(value);
      onSaved();
    }
    setBusy(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="min-w-[3rem] font-bold">{option || 'מלאי'}</span>
      <div className="flex items-center gap-2">
        <div dir="ltr" className="flex items-center border border-black/25 bg-white">
          <button type="button" onClick={() => setValue((v) => Math.max(0, v - 1))} className="p-2.5" aria-label="פחות">
            <Minus className="h-4 w-4" />
          </button>
          <input
            value={value}
            onChange={(e) => setValue(Math.max(0, Math.min(9999, parseInt(e.target.value.replace(/[^\d]/g, '') || '0', 10))))}
            inputMode="numeric"
            className="w-14 bg-transparent text-center font-bold outline-none"
            aria-label="כמות במלאי"
          />
          <button type="button" onClick={() => setValue((v) => Math.min(9999, v + 1))} className="p-2.5" aria-label="יותר">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || busy}
          className="px-4 py-2.5 text-sm font-bold text-white disabled:bg-black/15 disabled:text-black/40"
          style={dirty && !busy ? { background: RED } : undefined}
        >
          {busy ? '...' : dirty ? 'שמירה' : 'נשמר'}
        </button>
      </div>
    </div>
  );
}

export function AdminClient({
  orders,
  stock,
  catalog,
  waitingForPayment,
}: {
  orders: Order[];
  stock: Record<string, Record<string, number>>;
  catalog: CatalogItem[];
  waitingForPayment: number;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'paid' | 'collected' | 'cancelled'>('paid');
  const [busyId, setBusyId] = useState('');

  const count = (s: Order['status']) => orders.filter((o) => o.status === s).length;
  const shown = orders.filter((o) => o.status === tab);

  const act = async (id: string, action: 'collected' | 'uncollect' | 'cancel') => {
    if (action === 'cancel' && !window.confirm('לבטל את ההזמנה ולהחזיר את היחידות למלאי? את ההחזר הכספי עושים בנפרד, בקארדקום.')) return;
    setBusyId(id);
    await post('/api/admin/order', { id, action });
    router.refresh();
    setBusyId('');
  };

  const logout = async () => {
    await post('/api/admin/logout', {});
    router.refresh();
  };

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'paid', label: 'ממתינות לאיסוף' },
    { key: 'collected', label: 'נאספו' },
    { key: 'cancelled', label: 'בוטלו' },
  ];

  return (
    <div dir="rtl" lang="he" className={shell}>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-[3px] w-12" style={{ background: RED }} />
            <h1 className="mt-4 text-4xl font-black md:text-5xl">ניהול החנות</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black">
            <LogOut className="h-4 w-4" />
            יציאה
          </button>
        </div>

        {/* ORDERS */}
        <h2 className="mt-10 text-2xl font-black">הזמנות</h2>
        {waitingForPayment > 0 && (
          <p className="mt-1 text-sm text-black/55">
            {waitingForPayment} הזמנות באמצע תשלום. הן יופיעו כאן אחרי שהתשלום יעבור, או יתבטלו לבד אחרי כ-40 דקות.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((x) => (
            <button
              key={x.key}
              onClick={() => setTab(x.key)}
              className={`px-4 py-2.5 text-sm font-bold transition-colors ${tab === x.key ? 'bg-black text-white' : 'border border-black/25 bg-white hover:border-black'}`}
            >
              {x.label} <span className="opacity-60">({count(x.key)})</span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {shown.length === 0 && <p className="border border-black/15 bg-white/50 p-6 text-black/55">אין כאן הזמנות.</p>}
          {shown.map((o) => (
            <div key={o.id} className="border border-black/15 bg-white p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl font-black">
                      {o.productName}
                      {o.option && ` · ${o.option}`}
                    </span>
                    <span dir="ltr" className="font-bold text-black/60">
                      × {o.quantity}
                    </span>
                    {o.test && <span className="bg-yellow-300 px-2 py-0.5 text-xs font-bold">בדיקה</span>}
                  </div>
                  <div className="mt-1 text-black/60">
                    {o.name} · <span dir="ltr">{when(o.createdAt)}</span>
                    {o.collectedAt && (
                      <>
                        {' '}
                        · נאסף <span dir="ltr">{when(o.collectedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div dir="ltr" className="font-display text-2xl font-bold">
                  ₪{o.amount}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href={`tel:${o.phone}`} className="inline-flex items-center gap-2 font-bold hover:underline">
                  <Phone className="h-4 w-4" style={{ color: RED }} />
                  <span dir="ltr">{o.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${waNumber(o.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <MessageCircle className="h-4 w-4" style={{ color: RED }} />
                  וואטסאפ
                </a>
                {o.receiptUrl && (
                  <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                    קבלה
                  </a>
                )}
                <span className="grow" />
                {o.status === 'paid' && (
                  <>
                    <button onClick={() => act(o.id, 'cancel')} disabled={busyId === o.id} className="text-sm text-black/50 hover:text-black">
                      ביטול הזמנה
                    </button>
                    <button
                      onClick={() => act(o.id, 'collected')}
                      disabled={busyId === o.id}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                      style={{ background: RED }}
                    >
                      <Check className="h-4 w-4" />
                      נאסף
                    </button>
                  </>
                )}
                {o.status === 'collected' && (
                  <button onClick={() => act(o.id, 'uncollect')} disabled={busyId === o.id} className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black">
                    <RotateCcw className="h-4 w-4" />
                    החזרה ל"ממתינות"
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* STOCK */}
        <h2 className="mt-14 text-2xl font-black">מלאי</h2>
        <p className="mt-1 text-sm text-black/55">
          כמה יחידות יש על המדף. כל רכישה מורידה מכאן לבד, ומוצר שמגיע לאפס מסומן באתר "אזל מהמלאי".
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {catalog.map((p) => (
            <div key={p.id} className="border border-black/15 bg-white p-4 md:p-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg font-black">{p.name}</span>
                {p.price != null && (
                  <span dir="ltr" className="font-bold text-black/60">
                    ₪{p.price}
                  </span>
                )}
              </div>
              {!p.forSale && <div className="mt-1 text-sm text-black/50">עוד לא במכירה באתר (מוצג כ"בקרוב").</div>}
              <div className="mt-3 divide-y divide-black/10">
                {p.options.map((o) => (
                  <StockRow key={o} productId={p.id} option={o} initial={stock[p.id]?.[o] ?? 0} onSaved={() => router.refresh()} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
