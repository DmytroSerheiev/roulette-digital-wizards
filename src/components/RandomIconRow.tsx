'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/** ті ж кольори, що й у Roulette */
const colors = ['red', 'black', 'green', 'joker'];
const iconMap: Record<string, string> = {
  red:   '/icons/icons1.png',
  green: '/icons/icons2.png',
  black: '/icons/icons3.png',
  joker: '/icons/icons4.png',
};

/** показує 10 іконок у випадковому порядку */
export default function RandomIconRow({
  className = '',
  count = 10,
}: {
  className?: string;
  count?: number;
}) {
  const [icons, setIcons] = useState<string[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: count }, () =>
      colors[Math.floor(Math.random() * colors.length)],
    );
    setIcons(arr);
  }, [count]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {icons.map((c, i) => (
        <Image
          key={i}
          src={iconMap[c]}
          alt={c}
          width={32}
          height={32}
          unoptimized
          className="rounded-sm shrink-0"
        />
      ))}
    </div>
  );
}
