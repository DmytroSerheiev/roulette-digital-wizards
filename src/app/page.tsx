'use client';

import { useState } from 'react';
import Roulette from '../components/Roulette';
import RollStats, { Counters } from '../components/RollStats';
import RandomIconRow from '../components/RandomIconRow';
import BetTables from '../components/BetTables';

const init: Counters = { black: 0, red: 0, green: 0, joker: 0 };

export default function Page() {
  const [counts, setCounts] = useState(init);

  const handleWin = (color: string) =>
    setCounts((prev) => ({
      ...prev,
      [color as keyof Counters]: prev[color as keyof Counters] + 1,
    }));

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="relative -mt-[200px]">
        <RandomIconRow className="mb-9" />
        <RollStats counts={counts} className="absolute top-2 right-[10px]" />
        <Roulette onWin={handleWin} />

        {/* ❗ Абсолютне позиціонування ставок */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+40px)]">
          <BetTables />
        </div>
      </div>
    </div>
  );
}
