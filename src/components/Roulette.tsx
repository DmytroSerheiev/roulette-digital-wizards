'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const colors = ['red', 'black', 'green', 'joker'];
const iconMap: Record<string, string> = {
  red: '/icons/icons1.png',
  green: '/icons/icons2.png',
  black: '/icons/icons3.png',
  joker: '/icons/icons4.png',
};

export default function Roulette({ onWin }: { onWin: (color: string) => void }) {
  const [centerIcon, setCenterIcon] = useState<string>('red');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [barK, setBarK] = useState(0);

  const ICON_WIDTH = 90;
  const VISIBLE_ICONS = 13;
  const CENTER_INDEX = Math.floor(VISIBLE_ICONS / 2);
  const GAP = 20000; // 20 секунд

  useEffect(() => {
    const interval = setInterval(() => {
      setBarK((k) => k + 1);
      const icon = selectedIcon ?? colors[Math.floor(Math.random() * colors.length)];
      setCenterIcon(icon);
      onWin(icon);
    }, GAP);

    return () => clearInterval(interval);
  }, [selectedIcon]);

  const handleSelect = (color: string) => {
    setSelectedIcon((prev) => (prev === color ? null : color));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Стрілочка */}
      <div className="relative w-full max-w-6xl mb-1">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rotate-180 z-10
                        w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
                        border-l-transparent border-r-transparent border-b-yellow-400" />
      </div>

      {/* Обгортка з рулеткою + прогрес-бар */}
      <div className="relative w-[1210px]">
        {/* Рулетка */}
        <div className="relative overflow-hidden rounded-lg bg-neutral-800 h-[100px] mb-[4px]">
          {/* Ліва тінь */}
          <div className="absolute left-0 top-0 h-full w-[50px] z-10 pointer-events-none bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          {/* Права тінь */}
          <div className="absolute right-0 top-0 h-full w-[50px] z-10 pointer-events-none bg-gradient-to-l from-black/80 via-black/40 to-transparent" />

          {/* Контент іконок */}
          <div className="flex items-center h-full gap-1 py-0 relative z-0">
            {Array.from({ length: VISIBLE_ICONS }).map((_, idx) => {
              const isCenter = idx === CENTER_INDEX;
              return (
                <div
                  key={idx}
                  className="w-[90px] h-[90px] flex items-center justify-center relative shrink-0"
                >
                  <Image
                    src={iconMap[isCenter ? centerIcon : colors[Math.floor(Math.random() * colors.length)]]}
                    alt="icon"
                    width={90}
                    height={90}
                    unoptimized
                    className="brightness-75" 
                  />
                  {isCenter && (
                    <div className="absolute flex flex-col items-center justify-center text-white font-bold text-xs z-20 ">
                      <span className="text-[10px]">ROLLING IN:</span>
                      <span className="text-[20px]">14.26</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Прогрес-бар під рулеткою */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600 z-20 overflow-hidden -mt-2">
  <div
    key={barK}
    className="h-full bg-green-500"
    style={{ animation: `bar ${GAP}ms linear forwards` }}
  />
</div>
      </div>

      {/* Вибір вручну */}
      <div className="flex gap-4 mt-6">
        {colors.map((color) => (
          <div
            key={color}
            className={`cursor-pointer p-1 rounded border-2 transition
              ${selectedIcon === color ? 'border-yellow-400' : 'border-transparent'}`}
            onClick={() => handleSelect(color)}
          >
            <Image src={iconMap[color]} alt={color} width={50} height={50} unoptimized />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes bar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
