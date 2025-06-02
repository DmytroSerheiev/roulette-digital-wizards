'use client';

import Image from 'next/image';

const bets = [
  { name: 'User', amount: 100.0 },
  { name: 'User', amount: 80.0 },
  { name: 'User', amount: 50.0 },
  { name: 'User', amount: 0.8 },
];

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

const BetTable = ({ color }: { color: keyof typeof colorStyles }) => {
  return (
    <div className="w-[260px] rounded overflow-hidden">
      <div className={`p-2 text-center text-xs font-bold flex justify-between ${colorStyles[color]}`}>
        <span>{titles[color].label}</span>
        <span>{titles[color].payout}</span>
      </div>

      <div className="bg-neutral-900 p-2 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">4 Bets total</span>
          <span className="text-white font-bold">100.00</span>
        </div>

        {bets.map((bet, i) => (
          <div
            key={i}
            className={`flex justify-between items-center py-1 px-2 rounded ${i === 1 ? 'bg-neutral-800' : ''}`}
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
  return (
    <div className="flex gap-4 mt-8 justify-center">
      <BetTable color="red" />
      <BetTable color="green" />
      <BetTable color="black" />
      <BetTable color="joker" />
    </div>
  );
}
