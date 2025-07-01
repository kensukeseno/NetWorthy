'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const data = [
  { date: new Date('2021-01-01'), networth: 1000, asset: 1500, liability: 500 },
  { date: new Date('2021-06-09'), networth: 1200, asset: 1700, liability: 500 },
  { date: new Date('2021-11-17'), networth: 1400, asset: 2000, liability: 600 },
  { date: new Date('2022-04-27'), networth: 1600, asset: 2200, liability: 600 },
  { date: new Date('2022-10-04'), networth: 1800, asset: 2500, liability: 700 },
  { date: new Date('2023-03-13'), networth: 2000, asset: 2700, liability: 700 },
  { date: new Date('2023-08-20'), networth: 1200, asset: 1800, liability: 600 },
  { date: new Date('2024-01-27'), networth: 2400, asset: 3000, liability: 600 },
  { date: new Date('2024-07-05'), networth: 2600, asset: 3300, liability: 700 },
  { date: new Date('2024-12-12'), networth: 2800, asset: 3600, liability: 800 },
  { date: new Date('2025-05-20'), networth: 3000, asset: 3900, liability: 900 },
  {
    date: new Date('2025-06-07'),
    networth: 3200,
    asset: 4200,
    liability: 1000,
  },
];

const xMin = Number(new Date('2021-01-01'));
const xMax = Number(new Date());

const Graph = () => {
  return (
    <div className="w-full h-96 p-4 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
          <XAxis
            dataKey="date"
            type="number"
            axisLine={false}
            tickLine={false}
            domain={[xMin, xMax]}
            tick={{ fontSize: 12, fill: '#666' }}
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString()
            }
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="networth"
            stroke="#2563EB"
            strokeWidth={2}
            dot={false}
            name="Networth"
          />
          <Line
            type="monotone"
            dataKey="asset"
            stroke="#16A34A"
            strokeWidth={2}
            dot={false}
            name="Asset"
          />
          <Line
            type="monotone"
            dataKey="liability"
            stroke="#EA580C"
            strokeWidth={2}
            dot={false}
            name="Liabilities"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
