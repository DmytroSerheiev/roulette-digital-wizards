// src/components/RollStats.tsx
'use client';

import Image from 'next/image';

export type Counters = Record<'black' | 'red' | 'green' | 'joker', number>;

const order: (keyof Counters)[] = ['red', 'black', 'green', 'joker'];

const iconMap: Record<keyof Counters, string> = {
  red:   '/icons/icons1.png',
  black: '/icons/icons3.png',
  green: '/icons/icons2.png',
  joker: '/icons/icons4.png',
};

export default function RollStats({
  counts,
  className = '',          // ← залишаємо, аби можна було позиціювати зовні
}: {
  counts: Counters;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      <span className="text-sm text-gray-300">LAST&nbsp;100</span>

      {order.map((c) => (
        <div key={c} className="flex items-center gap-1">
          <Image
            src={iconMap[c]}
            alt={c}
            width={24}
            height={24}
            unoptimized
            className="shrink-0 rounded-sm"
          />
          <span className="text-sm font-medium">{counts[c]}</span>
        </div>
      ))}
    </div>
  );
}
