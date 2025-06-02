'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const colors = ['red', 'black', 'green', 'joker'];
const iconMap: Record<string, string> = {
  red: '/icons/icons1.png',
  green: '/icons/icons2.png',
  black: '/icons/icons3.png',
  joker: '/icons/icons4.png',
};

export default function Roulette() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [pause, setPause] = useState(true);
  const [barKey, setBarKey] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);

  const ITEM_WIDTH = 90;
  const SPIN_ITEMS = 20;
  const SPIN_MS = 3000;
  const PAUSE_MS = 2000;
  const MAX_ITEMS = 1000; // збільшено ліміт
  const SAFE_ITEMS = 500;

  useEffect(() => {
    const initial = generateItems(40, null);
    setItems(initial);
    startPause();
  }, []);

  useEffect(() => {
    if (!pause && !spinning) {
      spin();
    }
  }, [pause, spinning]);

  const startPause = () => {
    setBarKey((k) => k + 1);
    setPause(true);
    const t = setTimeout(() => {
      setPause(false);
    }, PAUSE_MS);
    return () => clearTimeout(t);
  };

  const spin = () => {
    if (!containerRef.current) return;

    setSpinning(true);
    const container = containerRef.current;
    const spins = SPIN_ITEMS + Math.floor(Math.random() * 10);
    const spinDistance = ITEM_WIDTH * spins;
    const totalDistance = currentOffset + spinDistance;

    const lastItem = items[items.length - 1] || null;
    const newGenerated = generateItems(spins, lastItem);
    const newItems = [...items, ...newGenerated];

    setItems(newItems);

    container.style.transition = `transform ${SPIN_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    container.style.transform = `translateX(-${totalDistance}px)`;

    const onEnd = () => {
      container.removeEventListener('transitionend', onEnd);
      container.style.transition = 'none';
      setSpinning(false);

      let newOffset = totalDistance;

      if (newItems.length > MAX_ITEMS) {
        const cut = newItems.length - SAFE_ITEMS;
        const reducedOffset = newOffset - ITEM_WIDTH * cut;
        setCurrentOffset(reducedOffset);
        container.style.transform = `translateX(-${reducedOffset}px)`;
        setItems((prev) => prev.slice(cut));
      } else {
        setCurrentOffset(newOffset);
      }

      startPause();
    };

    container.addEventListener('transitionend', onEnd);
  };

  const generateItems = (n: number, last: string | null): string[] => {
    const result: string[] = [];
    let prev = last;
    for (let i = 0; i < n; i++) {
      let next: string;
      do {
        next = colors[Math.floor(Math.random() * colors.length)];
      } while (next === prev);
      result.push(next);
      prev = next;
    }
    return result;
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-6xl mb-4">
        <div
          className="absolute top-[60px] left-1/2 -translate-x-1/2 z-10
                     w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
                     border-l-transparent border-r-transparent border-b-yellow-400"
        />

        <div className="overflow-hidden rounded-lg bg-neutral-800 h-[100px]">
          <div
            ref={containerRef}
            className="flex items-center h-full gap-1 py-0"
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="w-[90px] h-[90px] flex items-center justify-center shrink-0"
              >
                <Image
                  src={iconMap[item]}
                  alt={item}
                  width={100}
                  height={100}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl h-1 bg-gray-600 rounded overflow-hidden mt-2">
        {pause ? (
          <div
            key={barKey}
            className="h-full bg-green-500"
            style={{ animation: `bar ${PAUSE_MS}ms linear forwards` }}
          />
        ) : (
          <div className="h-full bg-transparent" />
        )}
      </div>

      <style jsx>{`
        @keyframes bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
