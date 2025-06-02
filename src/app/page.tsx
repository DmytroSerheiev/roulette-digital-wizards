'use client';

import { useState } from 'react';
import Roulette from '../components/Roulette';
import RollStats, { Counters } from '../components/RollStats';
import RandomIconRow from '../components/RandomIconRow';

const init: Counters = { black: 0, red: 0, green: 0, joker: 0 };

export default function Page() {
  const [counts, setCounts] = useState(init);

  /* колір виграшу приходить із Roulette */
  const handleWin = (color: string) =>
    setCounts((prev) => ({
      ...prev,
      [color as keyof Counters]: prev[color as keyof Counters] + 1,
    }));

  /* ---- layout ----
     h-screen            — займаємо всю висоту
     flex items-center   — вертикально по центру
     justify-center      — горизонтально по центру
  */
  return (
    <div className="h-screen flex items-center justify-center">
      {/* relative — щоб позиціювати лічильник праворуч */}
      <div className="relative">
        {/* 1) ряд із 10 випадкових іконок (зліва) */}
        <RandomIconRow className="mb-9" />

        {/* 2) лічильник праворуч, на тій же лінії (50 px праворуч) */}
        <RollStats counts={counts} className="absolute top-2 right-[10px]" />

        {/* 3) рулетка під ними */}
        <Roulette onWin={handleWin} />
      </div>
    </div>
  );
}
