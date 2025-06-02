'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ---- 1. дані ---- */
const colors = ['red', 'black', 'green', 'joker'];
const iconMap: Record<string, string> = {
  red:   '/icons/icons1.png',
  green: '/icons/icons2.png',
  black: '/icons/icons3.png',
  joker: '/icons/icons4.png',
};

/* ---- 2. компонент ---- */
export default function Roulette() {
  const wrapperRef   = useRef<HTMLDivElement>(null);   // обгортка з overflow-hidden
  const trackRef     = useRef<HTMLDivElement>(null);   // сам трек, що трансформується

  const [items, setItems]         = useState<string[]>([]);
  const [spinning, setSpinning]   = useState(false);
  const [pause, setPause]         = useState(true);
  const [barKey, setBarKey]       = useState(0);
  const [offset, setOffset]       = useState(0);       // накопичена translateX
  const [winner, setWinner]       = useState<number|null>(null);

  /* налаштування */
  const ITEM_W   = 90;
  const SPIN_N   = 20;
  const SPIN_MS  = 3000;
  const PAUSE_MS = 2000;
  const MAX      = 1000;   // ліміт елементів у DOM
  const SAFE     = 500;

  /* ---- 3. початкові 40 картинок ---- */
  useEffect(() => {
    setItems(gen(40, null));
    startPause();
  }, []);

  /* ---- 4. коли пауза закінчилась → починаємо спін ---- */
  useEffect(() => {
    if (!pause && !spinning) spin();
  }, [pause, spinning]);

  /* ---- 5. старт паузи (progress-bar) ---- */
  const startPause = () => {
    setBarKey(k => k + 1);   // перезапускаємо CSS-анімацію
    setPause(true);
    setTimeout(() => setPause(false), PAUSE_MS);
  };

  /* ---- 6. сам спін ---- */
  const spin = () => {
    const track = trackRef.current;
    if (!track) return;

    setSpinning(true);

    /* 6.1 скільки крутимо */
    const spins   = SPIN_N + Math.floor(Math.random() * 10);
    const dx      = ITEM_W * spins;
    const newOff  = offset + dx;

    /* 6.2 підкидаємо нові картинки */
    const next = gen(spins, items[items.length - 1] || null);
    const all  = [...items, ...next];
    setItems(all);

    /* 6.3 сама анімація */
    track.style.transition = `transform ${SPIN_MS}ms cubic-bezier(0.25,1,0.5,1)`;
    track.style.transform  = `translateX(-${newOff}px)`;

    /* 6.4 коли зупинилась */
    const onEnd = () => {
      track.removeEventListener('transitionend', onEnd);
      track.style.transition = 'none';
      setSpinning(false);
      let finalOff = newOff;

      /* 6.4.1 обрізаємо надлишок, щоб не ріс DOM */
      if (all.length > MAX) {
        const cut      = all.length - SAFE;
        const sliced   = all.slice(cut);
        finalOff      -= ITEM_W * cut;
        track.style.transform = `translateX(-${finalOff}px)`;
        setItems(sliced);
      }

      /* 6.4.2 шукаємо найцентральнішу іконку */
      const wrapperRect   = wrapperRef.current!.getBoundingClientRect();
      const centerX       = wrapperRect.left + wrapperRect.width / 2;
      const icons         = track.querySelectorAll<HTMLDivElement>('.icon');

      let min = Infinity, idx = -1;
      icons.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - centerX);
        if (d < min) { min = d; idx = i; }
      });
      setWinner(idx);

      /* 6.4.3 зберігаємо offset і запускаємо паузу */
      setOffset(finalOff);
      startPause();
    };
    track.addEventListener('transitionend', onEnd);
  };

  /* ---- 7. генератор різношерстих картинок ---- */
  const gen = (n: number, last: string|null) => {
    const out: string[] = [];
    let prev = last;
    for (let i = 0; i < n; i++) {
      let next: string;
      do next = colors[Math.random() * colors.length | 0];
      while (next === prev);
      out.push(next); prev = next;
    }
    return out;
  };

  /* ---- 8. UI ---- */
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6">
      {/* ▶︎ стрілочка */}
      <div className="relative w-full max-w-6xl mb-4">
        <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 rotate-180 z-10
                        w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
                        border-l-transparent border-r-transparent border-b-yellow-400" />

        {/* ▻ трек іконок */}
        <div ref={wrapperRef} className="overflow-hidden rounded-lg bg-neutral-800 h-[100px]">
          <div ref={trackRef} className="flex items-center h-full gap-1 py-0">
            {items.map((it, i) => {
              const win = !spinning && winner === i;
              return (
                <div
                  key={i}
                  className={`icon w-[90px] h-[90px] flex items-center justify-center shrink-0 relative
                              ${win ? 'border-4 border-yellow-400 rounded-xl' : ''}`}
                >
                  <Image src={iconMap[it]} alt={it} width={100} height={100} unoptimized />
                  {win && (
                    <span className="absolute bottom-1 text-yellow-400 font-bold text-sm">
                      WIN
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ▻ прогрес-бар очікування */}
      <div className="w-full max-w-7xl h-1 bg-gray-600 rounded overflow-hidden mt-2">
        {pause ? (
          <div key={barKey}
               className="h-full bg-green-500"
               style={{ animation: `bar ${PAUSE_MS}ms linear forwards` }} />
        ) : (
          <div className="h-full bg-transparent" />
        )}
      </div>

      {/* локальний CSS для barra */}
      <style jsx>{`
        @keyframes bar {
          from { width: 100%; }
          to   { width:   0%; }
        }
      `}</style>
    </div>
  );
}
