'use client';
import Summary from '@/app/dashboard/Summary';
import Graph from '@/app/dashboard/Graph';
import CurrencyButton from '@/app/dashboard/CurrencyButton';
import { useState } from 'react';

export default function DashBoard() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="flex flex-col gap-5 mt-5">
      <Summary />
      <div className="flex flex-row justify-between">
        <select
          onChange={(e) => setPeriod(e.target.value)}
          className="p-1 border-2 border-gray-200 rounded-md"
        >
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
          <option value="day">Daily</option>
        </select>
        <CurrencyButton />
      </div>
      <Graph period={period} />
    </div>
  );
}
