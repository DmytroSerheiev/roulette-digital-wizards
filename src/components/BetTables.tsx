'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const colors = ['red', 'black', 'green', 'joker'] as const;
type Color = typeof colors[number];

const colorStyles = {
  red:    'bg-red-600 text-white',
  green:  'bg-green-500 text-black',
  black:  'bg-neutral-700 text-white',
  joker:  'bg-purple-600 text-white',
};

const titles = {
  red:   { label: 'BET ON RED', payout: 'PAYS 2X' },
  green: { label: 'BET ON GREEN', payout: 'PAYS 14X' },
  black: { label: 'BET ON BLACK', payout: 'PAYS 2X' },
  joker: { label: 'BET ON JOKER', payout: 'PAYS 7X' },
};

type Bet = {
  name: string;
  amount: number;
};

const randomUsernames = ['user123', 'user456', 'user789', 'user321', 'user654'];

function getRandomUser(): string {
  return randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
}

function getRandomAmount(): number {
  const min = 0.5;
  const max = 100;
  return +(Math.random() * (max - min) + min).toFixed(2);
}

const BetTable = ({ color, bets }: { color: Color; bets: Bet[] }) => {
  const total = bets.reduce((sum, b) => sum + b.amount, 0).toFixed(2);
  return (
    <div className="w-[260px] rounded overflow-hidden">
      <div className={`p-2 text-center text-xs font-bold flex justify-between ${colorStyles[color]}`}>
        <span>{titles[color].label}</span>
        <span>{titles[color].payout}</span>
      </div>

      <div className="bg-neutral-900 p-2 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">{bets.length} Bets total</span>
          <span className="text-white font-bold">{total}</span>
        </div>

        {bets.map((bet, i) => (
          <div
            key={i}
            className={`flex justify-between items-center py-1 px-2 rounded ${i % 2 === 1 ? 'bg-neutral-800' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Image src="/icons/user.png" alt="user" width={16} height={16} unoptimized />
              <span className="text-xs text-white">{bet.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Image src="/icons/money.png" alt="money" width={14} height={14} unoptimized />
              <span className="text-white text-xs">{bet.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BetTables() {
  const [betsByColor, setBetsByColor] = useState<Record<Color, Bet[]>>({
    red: [],
    black: [],
    green: [],
    joker: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const newBet: Bet = {
        name: getRandomUser(),
        amount: getRandomAmount(),
      };

      setBetsByColor((prev) => ({
        ...prev,
        [color]: [...prev[color], newBet].slice(-6), // показуємо останні 6 ставок
      }));
    }, Math.random() * 1000 + 1000); // кожні 1–2 секунди

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 mt-8 justify-center">
      {colors.map((color) => (
        <BetTable key={color} color={color} bets={betsByColor[color]} />
      ))}
    </div>
  );
}
