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

export default function Roulette({
  onWin,
}: {
  onWin: (color: string) => void;
}) {
  const [centerIcon, setCenterIcon] = useState<string>('red');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [barK, setBarK] = useState(0);

  const ICON_WIDTH = 90;
  const VISIBLE_ICONS = 13;
  const CENTER_INDEX = Math.floor(VISIBLE_ICONS / 2);
  const GAP = 2000;

  useEffect(() => {
    const interval = setInterval(() => {
      setBarK((k) => k + 1);
      const icon =
        selectedIcon ?? colors[Math.floor(Math.random() * colors.length)];
      setCenterIcon(icon);
      setHistory((h) => [...h, icon]);
      onWin(icon);
    }, GAP);
    return () => clearInterval(interval);
  }, [selectedIcon]);

  const counts = colors.reduce((acc, color) => {
    acc[color] = history.filter((c) => c === color).length;
    return acc;
  }, {} as Record<string, number>);

  const handleSelect = (color: string) => {
    if (selectedIcon === color) {
      setSelectedIcon(null);
    } else {
      setSelectedIcon(color);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* стрілочка */}
      <div className="relative w-full max-w-6xl mb-4">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rotate-180 z-10
                        w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
                        border-l-transparent border-r-transparent border-b-yellow-400" />

        {/* обгортка */}
        <div className="overflow-hidden rounded-lg bg-neutral-800 h-[100px] w-[1170px]">
          <div className="flex items-center h-full gap-1 py-0">
            {Array.from({ length: VISIBLE_ICONS }).map((_, idx) => {
              const isCenter = idx === CENTER_INDEX;
              return (
                <div
                  key={idx}
                  className={`w-[90px] h-[90px] flex items-center justify-center relative shrink-0
                    ${isCenter ? 'border-4 border-yellow-400 rounded-xl' : ''}`}
                >
                  <Image
                    src={iconMap[isCenter ? centerIcon : colors[Math.floor(Math.random() * colors.length)]]}
                    alt="icon"
                    width={70}
                    height={70}
                    unoptimized
                  />
                  {isCenter && (
                    <span className="absolute bottom-1 text-yellow-400 text-sm font-bold">WIN</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* прогрес-бар паузи */}
      <div className="w-full max-w-6xl h-1 bg-gray-600 rounded overflow-hidden mb-4">
        <div
          key={barK}
          className="h-full bg-green-500"
          style={{ animation: `bar ${GAP}ms linear forwards` }}
        />
      </div>

      <style jsx>{`
        @keyframes bar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Вибір вручну */}
      <div className="flex gap-4 mb-4">
        {colors.map((color) => (
          <div
            key={color}
            className={`cursor-pointer p-1 rounded border-2
              ${selectedIcon === color ? 'border-yellow-400' : 'border-transparent'}`}
            onClick={() => handleSelect(color)}
          >
            <Image src={iconMap[color]} alt={color} width={50} height={50} unoptimized />
          </div>
        ))}
      </div>
    </div>
  );
}
