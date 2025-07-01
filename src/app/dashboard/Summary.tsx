import React from 'react';

interface Metric {
  title: string;
  subtitle: string;
  value: number;
  bgColor: string;
  textColor: string;
}

interface SummaryProps {
  netWorth?: number;
  totalAssets?: number;
  liabilities?: number;
  asOfDate?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function Summary({
  netWorth = 464147,
  totalAssets = 600000,
  liabilities = 135853,
  asOfDate = 'today',
}: SummaryProps) {
  const metrics: Metric[] = [
    {
      title: 'Your Total Networth',
      subtitle: `as of ${asOfDate}`,
      value: netWorth,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
    },
    {
      title: 'Your Total Assets',
      subtitle: `as of ${asOfDate}`,
      value: totalAssets,
      bgColor: 'bg-green-600',
      textColor: 'text-white',
    },
    {
      title: 'Your Liabilities',
      subtitle: `as of ${asOfDate}`,
      value: liabilities,
      bgColor: 'bg-orange-600',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="flex flex-row gap-4 w-full max-w-6xl mx-auto">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} ${metric.textColor} ${index == 0 ? 'flex-2' : 'flex-1'} rounded-sm p-3 content-center`}
        >
          <div className=" flex flex-row flex-wrap items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">{metric.title}</h3>
              <p className="text-sm opacity-75">{metric.subtitle}</p>
            </div>
            <p className="text-2xl font-bold tracking-tight">
              {formatCurrency(metric.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
