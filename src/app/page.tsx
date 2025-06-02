// src/app/page.tsx          ← шляхи до компонентів відносні (без "@/")
'use client';

import { useState } from 'react';
import Roulette from '../components/Roulette';
import RollStats, { Counters } from '../components/RollStats';

const init: Counters = { black: 0, red: 0, green: 0, joker: 0 };

export default function Page() {
  const [counts, setCounts] = useState(init);

  /** Отримуємо колір-переможець від Roulette */
  const handleWin = (color: string) =>
    setCounts((prev) => ({
      ...prev,
      [color as keyof Counters]: prev[color as keyof Counters] + 1,
    }));

  return (

    <div className="h-screen flex items-center justify-center">

      <div className="relative">

        <RollStats
          counts={counts}
          className="absolute -translate-y-[50px] right-[50px]"
        />

 
        <Roulette onWin={handleWin} />
      </div>
    </div>
  );
}
