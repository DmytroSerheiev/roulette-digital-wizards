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
  const [displayedIcon, setDisplayedIcon] = useState<string>('red');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [barK, setBarK] = useState(0);
  const [showBar, setShowBar] = useState(true);
  const [isWinnerShown, setIsWinnerShown] = useState(false);
  const [iconList, setIconList] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(30);

  const VISIBLE_ICONS = 13;
  const CENTER_INDEX = Math.floor(VISIBLE_ICONS / 2);

  const FIRST_PHASE = 2000;
  const RESULT_PAUSE = 4000;
  const SPIN_DURATION = 2000;
  const GAP = FIRST_PHASE + SPIN_DURATION;

  const generateIconList = (center: string): string[] => {
    const list: string[] = [];
    let lastColor: string | null = null;

    for (let i = 0; i < VISIBLE_ICONS; i++) {
      let color: string;

      if (i === CENTER_INDEX) {
        color = center;
      } else {
        const forbidden = [lastColor];
        if (i === CENTER_INDEX - 1) forbidden.push(center);
        if (i === CENTER_INDEX + 1) forbidden.push(center);

        const availableColors = colors.filter((c) => !forbidden.includes(c));
        color = availableColors[Math.floor(Math.random() * availableColors.length)];
      }

      list.push(color);
      lastColor = color;
    }

    return list;
  };

  useEffect(() => {
    let secondPhaseTimeout: NodeJS.Timeout;
    let fullCycleTimeout: NodeJS.Timeout;
    let postWinTimeout: NodeJS.Timeout;
    let spinInterval: NodeJS.Timeout;

    const startCycle = () => {
      setShowBar(true);
      setIsWinnerShown(false);
      setSpinning(false);
      setSpinSpeed(30);
      const initial = 'red';
      setDisplayedIcon(initial);
      setIconList(generateIconList(initial));

      secondPhaseTimeout = setTimeout(() => {
        setShowBar(false);
        setSpinning(true);
        let speed = 30;

        spinInterval = setInterval(() => {
          const spin = generateIconList(colors[Math.floor(Math.random() * colors.length)]);
          setIconList(spin);

          speed += 10;
          setSpinSpeed(speed);
        }, speed);
      }, FIRST_PHASE);

      fullCycleTimeout = setTimeout(() => {
        clearInterval(spinInterval);
        setSpinning(false);

        const final = selectedIcon ?? colors[Math.floor(Math.random() * colors.length)];
        setDisplayedIcon(final);
        setIconList(generateIconList(final));
        setIsWinnerShown(true);

        onWin(final);

        postWinTimeout = setTimeout(() => {
          setIsWinnerShown(false);
          setBarK((k) => k + 1);
          startCycle();
        }, RESULT_PAUSE);
      }, GAP);
    };

    startCycle();

    return () => {
      clearTimeout(secondPhaseTimeout);
      clearTimeout(fullCycleTimeout);
      clearTimeout(postWinTimeout);
    };
  }, [barK]);

  const handleSelect = (color: string) => {
    setSelectedIcon((prev) => (prev === color ? null : color));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-6xl mb-1">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rotate-180 z-10
                        w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
                        border-l-transparent border-r-transparent border-b-yellow-400" />
      </div>

      <div className="relative w-[1210px]">
        <div className="relative overflow-hidden rounded-lg bg-neutral-800 h-[100px] mb-[4px]">
          <div className="absolute left-0 top-0 h-full w-[50px] z-10 pointer-events-none bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-[50px] z-10 pointer-events-none bg-gradient-to-l from-black/80 via-black/40 to-transparent" />

          <div className="flex items-center h-full gap-1 py-0 relative z-0 transition-transform duration-700 ease-in-out">
            {iconList.map((color, idx) => {
              const isCenter = idx === CENTER_INDEX;
              return (
                <div key={idx} className="w-[90px] h-[90px] flex items-center justify-center relative shrink-0">
                  <Image
                    src={iconMap[color]}
                    alt="icon"
                    width={80}
                    height={80}
                    unoptimized
                    className="brightness-75"
                  />
                  {isCenter && isWinnerShown && (
                    <div className="absolute z-30 pointer-events-none">
                      <div className="animate-scaleWin rounded-lg overflow-hidden">
                        <Image
                          src={iconMap[color]}
                          alt="icon"
                          width={100}
                          height={100}
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showBar && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600 z-20 overflow-hidden -mt-2">
            <div
              key={barK}
              className="h-full bg-green-500"
              style={{ animation: `bar ${FIRST_PHASE}ms linear forwards` }}
            />
          </div>
        )}
      </div>

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

        @keyframes scaleWin {
          0% {
            transform: scale(1.1);
            opacity: 1;
          }
          50% {
            transform: scale(1.0);
          }
          100% {
            transform: scale(1.05);
            opacity: 0;
          }
        }

        .animate-scaleWin {
          animation: scaleWin 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}