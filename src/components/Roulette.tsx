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

export default function Roulette({ onWin }: { onWin: (color: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [displayedIcon, setDisplayedIcon] = useState<string>('red');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [barK, setBarK] = useState(0);
  const [showBar, setShowBar] = useState(true);
  const [isWinnerShown, setIsWinnerShown] = useState(false);
  const [iconList, setIconList] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [offset, setOffset] = useState(0);

  const VISIBLE_ICONS = 13;
  const CENTER_INDEX = Math.floor(VISIBLE_ICONS / 2);
  const ITEM_WIDTH = 90;

  const FIRST_PHASE = 2000;
  const RESULT_PAUSE = 4000;
  const SPIN_DURATION = 3000;
  const TOTAL_SPIN_ICONS = 60;

  const buildSpinList = (final: string): string[] => {
    const list: string[] = [];
    for (let i = 0; i < TOTAL_SPIN_ICONS - 1; i++) {
      list.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    list.push(final); // переможець в кінці
    return list;
  };

  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;
    let postWinTimeout: NodeJS.Timeout;

    const startCycle = () => {
      setShowBar(true);
      setIsWinnerShown(false);
      setSpinning(false);
      setSelectedIcon(null);
      setOffset(0);

      const final = selectedIcon ?? colors[Math.floor(Math.random() * colors.length)];
      const spinIcons = buildSpinList(final);
      setIconList(spinIcons);

      animationTimeout = setTimeout(() => {
        setShowBar(false);
        setSpinning(true);

        const totalOffset = (spinIcons.length - CENTER_INDEX - 1) * ITEM_WIDTH;
        setOffset(totalOffset);

        setTimeout(() => {
          setSpinning(false);
          setDisplayedIcon(final);
          setIsWinnerShown(true);
          onWin(final);

          postWinTimeout = setTimeout(() => {
            setIsWinnerShown(false);
            setBarK(k => k + 1);
          }, RESULT_PAUSE);
        }, SPIN_DURATION);
      }, FIRST_PHASE);
    };

    startCycle();

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(postWinTimeout);
    };
  }, [barK]);

  const handleSelect = (color: string) => {
    setSelectedIcon(prev => (prev === color ? null : color));
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

          <div
            className="flex items-center h-full gap-1 py-0 relative z-0"
            ref={containerRef}
            style={{
              transform: `translateX(-${offset}px)`,
              transition: spinning
                ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`
                : 'none',
            }}
          >
            {iconList.map((color, idx) => {
              const isCenter = idx === iconList.length - 1;
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
        {colors.map(color => (
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