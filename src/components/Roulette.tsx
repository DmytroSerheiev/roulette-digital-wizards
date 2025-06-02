'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* --- вихідні дані --- */
const colors = ['red', 'black', 'green', 'joker'];
const iconMap: Record<string, string> = {
  red:   '/icons/icons1.png',
  green: '/icons/icons2.png',
  black: '/icons/icons3.png',
  joker: '/icons/icons4.png',
};

/* -------------------------------------------------------
   ↓↓↓   Єдина різниця – приймаємо onWin у пропсах   ↓↓↓
------------------------------------------------------- */
export default function Roulette({
  onWin,                               // 👈 новий проп (обов’язковий)
}: {
  onWin: (color: string) => void;      //   тип: колір, що випав
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  /* --- стейти --- */
  const [items,  setItems]  = useState<string[]>([]);
  const [spin,   setSpin]   = useState(false);
  const [pause,  setPause]  = useState(true);
  const [barK,   setBarK]   = useState(0);
  const [off,    setOff]    = useState(0);
  const [winIdx, setWinIdx] = useState<number | null>(null);

  /* --- константи --- */
  const W   = 90;          // ширина однієї іконки
  const N   = 20;          // мінімум елементів за спін
  const T   = 3000;        // тривалість спіну
  const GAP = 2000;        // пауза до наступного спіну

  /* --- 1. стартові 40 елементів --- */
  useEffect(() => {
    setItems(gen(40, null));
    beginPause();
  }, []);

  /* --- 2. якщо пауза закінчилась → крутимо --- */
  useEffect(() => {
    if (!pause && !spin) roll();
  }, [pause, spin]);

  /* ----------------------------------------------------
     Ф-ція: запускає відлік паузи (progress-bar зверху)
  ---------------------------------------------------- */
  const beginPause = () => {
    setBarK(k => k + 1);
    setPause(true);
    setTimeout(() => setPause(false), GAP);
  };

  /* ----------------------------------------------------
     Ф-ція: виконує сам спін
  ---------------------------------------------------- */
  const roll = () => {
    const track = trackRef.current;
    if (!track) return;
    setSpin(true);

    /* 1. на скільки прокрутити */
    const rnd   = Math.floor(Math.random() * 10);
    const dx    = W * (N + rnd);
    const nextOffset = off + dx;

    /* 2. додаємо нові елементи наперед */
    const more = gen(N + rnd, items.at(-1) || null);
    const combo = [...items, ...more];
    setItems(combo);

    /* 3. сама анімація */
    track.style.transition = `transform ${T}ms cubic-bezier(0.25,1,0.5,1)`;
    track.style.transform  = `translateX(-${nextOffset}px)`;

    /* 4. коли анімація закінчилась */
    const done = () => {
      track.removeEventListener('transitionend', done);
      track.style.transition = 'none';
      setSpin(false);
      setOff(nextOffset);

      /* ----- визначаємо виграшну іконку ----- */
      const wrapRect = wrapperRef.current!.getBoundingClientRect();
      const centerX  = wrapRect.left + wrapRect.width / 2;
      const icons    = track.querySelectorAll<HTMLDivElement>('.icon');

      let best = -1, min = Infinity;
      icons.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - centerX);
        if (d < min) { min = d; best = i; }
      });

      setWinIdx(best);
      /* ===>  СПОВІЩАЄМО БАТЬКУ, ЯКИЙ КОЛІР ВИПАВ  <=== */
      if (best >= 0) onWin(combo[best]);        // 👈 ЄДИНИЙ НОВИЙ ВИКЛИК

      /* запускаємо наступний відлік */
      beginPause();
    };

    track.addEventListener('transitionend', done);
  };

  /* --- генератор: n нових кольорів, не дублюючи сусіда --- */
  const gen = (n: number, last: string | null) => {
    const res: string[] = [];
    let prev = last;
    for (let i = 0; i < n; i++) {
      let x: string;
      do x = colors[Math.random() * colors.length | 0];
      while (x === prev);
      res.push(x); prev = x;
    }
    return res;
  };

  /* ---  UI  --- */
  return (
    <div className="flex flex-col items-center">
      {/* стрілочка */}
      <div className="relative w-full max-w-6xl mb-4">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rotate-180 z-10
                        w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
                        border-l-transparent border-r-transparent border-b-yellow-400" />

        {/* обгортка */}
        <div ref={wrapperRef} className="overflow-hidden rounded-lg bg-neutral-800 h-[100px]">
          <div ref={trackRef} className="flex items-center h-full gap-1">
            {items.map((c, i) => {
              const highlight = !spin && winIdx === i;
              return (
                <div
                  key={i}
                  className={`icon w-[90px] h-[90px] shrink-0 flex items-center justify-center relative
                              ${highlight ? 'border-4 border-yellow-400 rounded-xl' : ''}`}
                >
                  <Image src={iconMap[c]} alt={c} width={100} height={100} unoptimized />
                  {highlight && (
                    <span className="absolute bottom-1 text-yellow-400 text-sm font-bold">WIN</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* прогрес-бар паузи */}
      <div className="w-full max-w-6xl h-1 bg-gray-600 rounded overflow-hidden">
        {pause && (
          <div key={barK}
               className="h-full bg-green-500"
               style={{ animation: `bar ${GAP}ms linear forwards` }} />
        )}
      </div>

      {/* локальний CSS для бара */}
      <style jsx>{`
        @keyframes bar { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
}
