'use client';
import Summary from '@/app/dashboard/Summary';
import Graph from '@/app/dashboard/Graph';
import CurrencyButton from '@/app/dashboard/CurrencyButton';
import { useState } from 'react';
import { DatePick } from './DatePicker';

export default function DashBoard() {
  const now = new Date();
  const [xMax, setXMax] = useState<Date>(now);
  const [xMin, setXMin] = useState<Date>(
    new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365),
  );
  const [dataset, setDataset] = useState('all');

  const handlePeriodChange = (period: string) => {
    switch (period) {
      case 'month':
        setXMin(new Date(xMax.getTime() - 1000 * 60 * 60 * 24 * 365));
        break;
      case 'year':
        setXMin(new Date(xMax.getTime() - 1000 * 60 * 60 * 24 * 365 * 5));
        break;
      case 'day':
        setXMin(new Date(xMax.getTime() - 1000 * 60 * 60 * 24 * 30));
        break;
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-5">
      <Summary />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <DatePick
            setXMax={setXMax}
            setXMin={setXMin}
            xMax={xMax}
            xMin={xMin}
          />
          <select
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="p-1 border-2 border-gray-200 rounded-md"
          >
            <option value="year">Yearly</option>
            <option value="month" selected>
              Monthly
            </option>
            <option value="day">Daily</option>
          </select>
          <select
            onChange={(e) => setDataset(e.target.value)}
            className="p-1 border-2 border-gray-200 rounded-md"
          >
            <option value="all">All Net Worth</option>
            <option value="networth">Total Networth</option>
            <option value="asset">Total Assets</option>
            <option value="liability">Total Liabilities</option>
          </select>
        </div>
        <CurrencyButton />
      </div>
      <Graph xMax={xMax} xMin={xMin} dataset={dataset} />
    </div>
  );
}
